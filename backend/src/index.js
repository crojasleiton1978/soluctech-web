import { MODEL, SYSTEM_PROMPT } from "./knowledge.js";

const MAX_BODY_BYTES = 12_000;
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_TOTAL_MESSAGE_LENGTH = 5_000;
const MAX_OUTPUT_TOKENS = 250;
const TURNSTILE_ACTION = "soluctech_ai_chat";
const TURNSTILE_TEST_ACTION = "test";
const TURNSTILE_TEST_HOSTNAME = "localhost";
const TURNSTILE_DUMMY_HOSTNAME = "example.com";
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function jsonResponse(body, status, origin) {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Vary", "Origin");
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function allowedOrigins(env) {
  return new Set((env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean));
}

async function readJson(request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "El contenido debe estar en formato JSON.");
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "La solicitud supera el tamaño permitido.");
  }

  if (!request.body) {
    throw new HttpError(400, "La solicitud está vacía o no contiene JSON válido.");
  }

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new HttpError(413, "La solicitud supera el tamaño permitido.");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new HttpError(400, "La solicitud está vacía o no contiene JSON válido.");
  }
}

const personalDataPatterns = [
  /[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+/i,
  /(?:\+?56[\s.-]*)?(?:9[\s.-]*)?\d{4}[\s.-]?\d{4}\b/,
  /\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b/,
  /\b(?:me llamo|mi nombre es|mi correo es|mi email es|mi teléfono es|mi celular es|mi empresa es|mi empresa se llama|my name is|my email is)\b/i,
  /\b(?:soy|me llamo|mi nombre es|trabajo en)\s+[A-ZÁÉÍÓÚÑ][\p{L}'-]+(?:\s+[A-ZÁÉÍÓÚÑ][\p{L}'-]+){0,2}/u
];

function validateMessages(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    throw new HttpError(400, "Envía entre 1 y 8 mensajes de conversación.");
  }

  let totalLength = 0;
  const messages = value.map((message) => {
    if (!message || typeof message !== "object" ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        message.content.trim().length === 0 ||
        message.content.length > MAX_MESSAGE_LENGTH) {
      throw new HttpError(400, "Uno de los mensajes no tiene un formato válido.");
    }

    if (personalDataPatterns.some((pattern) => pattern.test(message.content))) {
      throw new HttpError(400, "No compartas datos personales en el chat. Si deseas que te contacten, usa el formulario de contacto.");
    }

    totalLength += message.content.length;
    return { role: message.role, content: message.content.trim() };
  });

  if (totalLength > MAX_TOTAL_MESSAGE_LENGTH) {
    throw new HttpError(400, "La conversación supera el límite permitido. Inicia una nueva consulta.");
  }

  return messages;
}

async function verifyTurnstile(
  token,
  secret,
  expectedHostname,
  allowOfficialTestKey,
  diagnosticsEnabled,
  fetchImpl = fetch
) {
  const response = await fetchImpl(TURNSTILE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      response: token,
      idempotency_key: crypto.randomUUID()
    })
  });

  if (!response.ok) {
    throw new HttpError(502, "No se pudo validar la protección antiabuso. Intenta más tarde.");
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new HttpError(502, "No se pudo validar la protección antiabuso. Intenta más tarde.");
  }

  if (diagnosticsEnabled) {
    const diagnostic = {
      success: typeof result.success === "boolean" ? result.success : null,
      hostname: typeof result.hostname === "string" ? result.hostname : null,
      action: typeof result.action === "string" || result.action === null
        ? result.action
        : Object.hasOwn(result, "action") ? "[invalid type]" : "[missing]"
    };
    if (Array.isArray(result["error-codes"])) {
      diagnostic["error-codes"] = result["error-codes"].filter((code) => typeof code === "string");
    }
    console.info(diagnostic);
  }

  const validProductionResponse = result.hostname === expectedHostname &&
    result.action === TURNSTILE_ACTION;
  const validLocalTestResponse = allowOfficialTestKey &&
    result.hostname === TURNSTILE_TEST_HOSTNAME &&
    result.action === TURNSTILE_TEST_ACTION;
  const validDummyTestResponse = allowOfficialTestKey &&
    result.hostname === TURNSTILE_DUMMY_HOSTNAME &&
    (result.action === null || !Object.hasOwn(result, "action"));

  if (result.success !== true ||
      (!validProductionResponse && !validLocalTestResponse && !validDummyTestResponse)) {
    throw new HttpError(403, "Completa la verificación de seguridad e inténtalo nuevamente.");
  }
}

async function handleChat(request, env, origin) {
  let body;
  try {
    body = await readJson(request);
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonResponse({ error: error.message }, error.status, origin);
    }
    return jsonResponse({ error: "No se pudo leer la solicitud." }, 400, origin);
  }

  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some((key) => !["messages", "turnstileToken"].includes(key))) {
    return jsonResponse({ error: "La solicitud contiene campos no permitidos." }, 400, origin);
  }

  let messages;
  try {
    messages = validateMessages(body.messages);
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonResponse({ error: error.message }, error.status, origin);
    }
    return jsonResponse({ error: "La conversación no es válida." }, 400, origin);
  }

  if (typeof body.turnstileToken !== "string" ||
      body.turnstileToken.length === 0 ||
      body.turnstileToken.length > 2_048) {
    return jsonResponse({ error: "Completa la verificación de seguridad para continuar." }, 400, origin);
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return jsonResponse({ error: "El servicio aún no está configurado para recibir consultas." }, 503, origin);
  }

  if (!env.AI || !env.CHAT_RATE_LIMITER) {
    return jsonResponse({ error: "El servicio de asistencia no está disponible temporalmente." }, 503, origin);
  }

  const clientIp = request.headers.get("CF-Connecting-IP");
  if (!clientIp) {
    return jsonResponse({ error: "No se pudo validar la solicitud." }, 400, origin);
  }

  let limit;
  try {
    limit = await env.CHAT_RATE_LIMITER.limit({ key: clientIp });
  } catch {
    return jsonResponse({ error: "No se pudo validar el límite de consultas. Intenta más tarde." }, 503, origin);
  }
  if (!limit.success) {
    return jsonResponse({ error: "Alcanzaste el límite temporal de consultas. Espera un minuto e inténtalo nuevamente." }, 429, origin);
  }

  try {
    const hostname = new URL(origin).hostname;
    const allowOfficialTestKey = env.TURNSTILE_TEST_MODE === "true" &&
      env.TURNSTILE_SECRET_KEY === TURNSTILE_TEST_SECRET;
    const diagnosticsEnabled = env.LOCAL_TURNSTILE_DIAGNOSTICS === "true" && allowOfficialTestKey;
    await verifyTurnstile(
      body.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      hostname,
      allowOfficialTestKey,
      diagnosticsEnabled
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonResponse({ error: error.message }, error.status, origin);
    }
    return jsonResponse({ error: "No se pudo validar la protección antiabuso. Intenta más tarde." }, 502, origin);
  }

  let result;
  try {
    result = await env.AI.run(MODEL, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.2
    });
  } catch {
    return jsonResponse({ error: "No se pudo generar una respuesta. Intenta nuevamente más tarde." }, 502, origin);
  }

  if (typeof result?.response !== "string" || result.response.trim().length === 0) {
    return jsonResponse({ error: "El asistente no pudo generar una respuesta. Intenta nuevamente." }, 502, origin);
  }

  return jsonResponse({ reply: result.response.trim() }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const origins = allowedOrigins(env);

    if (!origin || !origins.has(origin)) {
      return jsonResponse({ error: "Origen no autorizado." }, 403);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/chat") {
      return jsonResponse({ error: "Ruta no encontrada." }, 404, origin);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "no-store",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Método no permitido." }, 405, origin);
    }

    return handleChat(request, env, origin);
  }
};
