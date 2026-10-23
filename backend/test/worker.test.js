import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import worker from "../src/index.js";
import { KNOWLEDGE, MODEL, SYSTEM_PROMPT } from "../src/knowledge.js";

const origin = "https://www.soluctech.cl";
const hostname = "www.soluctech.cl";
const devOrigin = "http://localhost:8000";
const devPreviewOrigin = "http://localhost:8001";
const officialTestSecret = "1x0000000000000000000000000000000AA";
const originalFetch = globalThis.fetch;

function makeEnv(options = {}) {
  return {
    ALLOWED_ORIGINS: options.dev
      ? "http://localhost:8000,http://127.0.0.1:8000,http://localhost:8001,http://127.0.0.1:8001"
      : "https://soluctech.cl,https://www.soluctech.cl,https://crojasleiton1978.github.io",
    TURNSTILE_SECRET_KEY: options.turnstileSecret ?? "test-secret",
    TURNSTILE_TEST_MODE: options.dev ? "true" : undefined,
    LOCAL_TURNSTILE_DIAGNOSTICS: options.localTurnstileDiagnostics ? "true" : undefined,
    CHAT_RATE_LIMITER: {
      limit: async () => ({ success: options.allowedByRateLimit !== false })
    },
    AI: {
      run: async (model, input) => {
        options.modelCall?.(model, input);
        if (options.modelError) throw new Error("private model error");
        return options.modelResult ?? { response: "Podemos revisar tu desafío y orientarte." };
      }
    }
  };
}

function makeRequest(body, options = {}) {
  const headers = new Headers({
    Origin: options.origin ?? origin,
    "CF-Connecting-IP": "203.0.113.10",
    "Content-Type": options.contentType ?? "application/json"
  });
  return new Request("https://worker.example/api/chat", {
    method: options.method ?? "POST",
    headers,
    body: options.rawBody ?? JSON.stringify(body)
  });
}

const validBody = {
  messages: [{ role: "user", content: "¿Qué servicio ayuda a priorizar iniciativas de inteligencia artificial?" }],
  turnstileToken: "valid-token"
};

beforeEach(() => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.equal(body.secret, "test-secret");
    assert.equal(body.response, "valid-token");
    return Response.json({ success: true, hostname, action: "soluctech_ai_chat" });
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("answers through the configured Workers AI model and curated commercial knowledge", async () => {
  let calledWith;
  const response = await worker.fetch(makeRequest(validBody), makeEnv({
    modelCall: (model, input) => { calledWith = { model, input }; }
  }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { reply: "Podemos revisar tu desafío y orientarte." });
  assert.equal(calledWith.model, MODEL);
  assert.equal(calledWith.input.max_tokens, 250);
  assert.equal(calledWith.input.temperature, 0.2);
  assert.equal(calledWith.input.messages[0].role, "system");
  assert.ok(calledWith.input.messages[0].content.includes(KNOWLEDGE));
  assert.ok(calledWith.input.messages[0].content.includes(SYSTEM_PROMPT));
  assert.deepEqual(calledWith.input.messages[1], validBody.messages[0]);
  assert.equal(calledWith.input.messages.some((message) => message.content.includes("test-secret")), false);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("rejects requests from unapproved origins before calling any service", async () => {
  const response = await worker.fetch(makeRequest(validBody, { origin: "https://example.com" }), makeEnv());
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
});

test("rejects requests without an Origin header", async () => {
  const request = makeRequest(validBody);
  request.headers.delete("Origin");
  const response = await worker.fetch(request, makeEnv());
  assert.equal(response.status, 403);
});

test("answers preflight requests only for an allowed origin", async () => {
  const response = await worker.fetch(makeRequest(undefined, { method: "OPTIONS" }), makeEnv());
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});

test("allows the local site preview origin only in dev", async () => {
  const devResponse = await worker.fetch(makeRequest(undefined, {
    method: "OPTIONS",
    origin: devPreviewOrigin
  }), makeEnv({ dev: true }));
  assert.equal(devResponse.status, 204);
  assert.equal(devResponse.headers.get("Access-Control-Allow-Origin"), devPreviewOrigin);

  const productionResponse = await worker.fetch(makeRequest(validBody, {
    origin: devPreviewOrigin
  }), makeEnv());
  assert.equal(productionResponse.status, 403);
});

test("rejects non-JSON content", async () => {
  const response = await worker.fetch(makeRequest({}, { contentType: "text/plain", rawBody: "hello" }), makeEnv());
  assert.equal(response.status, 415);
});

test("rejects common personal data before the model is called", async (t) => {
  const examples = [
    "Mi correo es carlos@example.com, recomiéndame un servicio.",
    "Mi nombre es Carlos Rojas, necesito orientación.",
    "Mi teléfono es +56 9 1234 5678."
  ];
  for (const content of examples) {
    await t.test(content, async () => {
      let modelCalled = false;
      const body = {
        messages: [{ role: "user", content }],
        turnstileToken: "valid-token"
      };
      const response = await worker.fetch(makeRequest(body), makeEnv({
        modelCall: () => { modelCalled = true; }
      }));
      assert.equal(response.status, 400);
      assert.equal(modelCalled, false);
    });
  }
});

test("does not forward unrecognized message fields to Workers AI", async () => {
  let modelMessages;
  const body = {
    messages: [{ role: "user", content: "¿Qué servicio ayuda a priorizar iniciativas?", email: "carlos@example.com" }],
    turnstileToken: "valid-token"
  };
  const response = await worker.fetch(makeRequest(body), makeEnv({
    modelCall: (_model, input) => { modelMessages = input.messages; }
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(modelMessages[1], {
    role: "user",
    content: "¿Qué servicio ayuda a priorizar iniciativas?"
  });
});

test("rejects extra contact-data fields rather than passing them through", async () => {
  const body = { ...validBody, email: "carlos@example.com" };
  const response = await worker.fetch(makeRequest(body), makeEnv());
  assert.equal(response.status, 400);
});

test("rejects empty, oversized, and excessive message histories", async (t) => {
  await t.test("empty history", async () => {
    const response = await worker.fetch(makeRequest({ ...validBody, messages: [] }), makeEnv());
    assert.equal(response.status, 400);
  });
  await t.test("oversized message", async () => {
    const response = await worker.fetch(makeRequest({
      ...validBody,
      messages: [{ role: "user", content: "a".repeat(1_201) }]
    }), makeEnv());
    assert.equal(response.status, 400);
  });
  await t.test("too many messages", async () => {
    const response = await worker.fetch(makeRequest({
      ...validBody,
      messages: Array.from({ length: 9 }, () => ({ role: "user", content: "consulta" }))
    }), makeEnv());
    assert.equal(response.status, 400);
  });
});

test("rejects bodies over the byte limit", async () => {
  const request = makeRequest(validBody);
  const oversized = new Request(request.url, {
    method: "POST",
    headers: {
      Origin: origin,
      "CF-Connecting-IP": "203.0.113.10",
      "Content-Type": "application/json",
      "Content-Length": "12001"
    },
    body: "{}"
  });
  const response = await worker.fetch(oversized, makeEnv());
  assert.equal(response.status, 413);
});

test("rejects an oversized streamed body when Content-Length is absent", async () => {
  const oversizedBody = JSON.stringify({
    messages: [{ role: "user", content: "a".repeat(12_100) }],
    turnstileToken: "valid-token"
  });
  const request = makeRequest({}, { rawBody: oversizedBody });
  const response = await worker.fetch(request, makeEnv());
  assert.equal(response.status, 413);
});

test("requires a Turnstile token and configured secret", async (t) => {
  await t.test("missing token", async () => {
    const response = await worker.fetch(makeRequest({ messages: validBody.messages }), makeEnv());
    assert.equal(response.status, 400);
  });
  await t.test("missing secret", async () => {
    const env = makeEnv();
    delete env.TURNSTILE_SECRET_KEY;
    const response = await worker.fetch(makeRequest(validBody), env);
    assert.equal(response.status, 503);
  });
});

test("blocks invalid Turnstile validation and a hostname mismatch", async (t) => {
  await t.test("challenge rejected", async () => {
    globalThis.fetch = async () => Response.json({ success: false });
    const response = await worker.fetch(makeRequest(validBody), makeEnv());
    assert.equal(response.status, 403);
  });
  await t.test("hostname mismatch", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "attacker.example",
      action: "soluctech_ai_chat"
    });
    const response = await worker.fetch(makeRequest(validBody), makeEnv());
    assert.equal(response.status, 403);
  });
  await t.test("does not accept test action in production", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname,
      action: "test"
    });
    const response = await worker.fetch(makeRequest(validBody), makeEnv({
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 403);
  });
  await t.test("requires success to be exactly true", async () => {
    globalThis.fetch = async () => Response.json({
      success: 1,
      hostname,
      action: "soluctech_ai_chat"
    });
    const response = await worker.fetch(makeRequest(validBody), makeEnv());
    assert.equal(response.status, 403);
  });
});

test("accepts the official Turnstile test response only in dev with the official test key", async (t) => {
  await t.test("accepts localhost and test action after Siteverify succeeds", async () => {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
      const payload = JSON.parse(options.body);
      assert.equal(payload.secret, officialTestSecret);
      assert.equal(payload.response, "valid-token");
      return Response.json({
        success: true,
        hostname: "localhost",
        action: "test"
      });
    };
    const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
      dev: true,
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 200);
  });

  await t.test("rejects test action when dev does not use the official test key", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "localhost",
      action: "test"
    });
    const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
      dev: true,
      turnstileSecret: "another-secret"
    }));
    assert.equal(response.status, 403);
  });

  await t.test("accepts the official dummy response in dev", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "example.com",
      action: null
    });
    const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
      dev: true,
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 200);
  });

  await t.test("accepts the official dummy response with missing action in dev", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "example.com"
    });
    const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
      dev: true,
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 200);
  });

  await t.test("rejects the official dummy response in production", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "example.com",
      action: null
    });
    const response = await worker.fetch(makeRequest(validBody), makeEnv({
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 403);
  });

  await t.test("rejects the official dummy response with missing action in production", async () => {
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "example.com"
    });
    const response = await worker.fetch(makeRequest(validBody), makeEnv({
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 403);
  });

  await t.test("still requires Siteverify success for the dummy response in dev", async () => {
    globalThis.fetch = async () => Response.json({
      success: false,
      hostname: "example.com",
      action: null
    });
    const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
      dev: true,
      turnstileSecret: officialTestSecret
    }));
    assert.equal(response.status, 403);
  });

  await t.test("logs and accepts a missing action distinctly from a null action in dev", async () => {
    const originalInfo = console.info;
    const logs = [];
    console.info = (...args) => logs.push(args);
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "example.com"
    });
    try {
      const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
        dev: true,
        turnstileSecret: officialTestSecret,
        localTurnstileDiagnostics: true
      }));
      assert.equal(response.status, 200);
      assert.deepEqual(logs[0], [{
        success: true,
        hostname: "example.com",
        action: "[missing]"
      }]);
    } finally {
      console.info = originalInfo;
    }
  });
});

test("logs only allowed Siteverify fields when local diagnostics are explicitly enabled", async (t) => {
  await t.test("logs response metadata and error codes in local dev", async () => {
    const originalInfo = console.info;
    const logs = [];
    console.info = (...args) => logs.push(args);
    globalThis.fetch = async () => Response.json({
      success: false,
      hostname: "localhost",
      action: "test",
      "error-codes": ["invalid-input-response"],
      challenge_ts: "must-not-be-logged",
      cdata: "must-not-be-logged"
    });

    try {
      const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
        dev: true,
        turnstileSecret: officialTestSecret,
        localTurnstileDiagnostics: true
      }));
      assert.equal(response.status, 403);
      assert.equal(logs.length, 1);
      assert.deepEqual(logs[0], [{
        success: false,
        hostname: "localhost",
        action: "test",
        "error-codes": ["invalid-input-response"]
      }]);
      assert.doesNotMatch(JSON.stringify(logs), /valid-token|must-not-be-logged|officialTestSecret/);
    } finally {
      console.info = originalInfo;
    }
  });

  await t.test("does not log in production even if the diagnostic flag is present", async () => {
    const originalInfo = console.info;
    const logs = [];
    console.info = (...args) => logs.push(args);
    try {
      const response = await worker.fetch(makeRequest(validBody), makeEnv({
        localTurnstileDiagnostics: true
      }));
      assert.equal(response.status, 200);
      assert.deepEqual(logs, []);
    } finally {
      console.info = originalInfo;
    }
  });

  await t.test("does not log in dev without the official test secret", async () => {
    const originalInfo = console.info;
    const logs = [];
    console.info = (...args) => logs.push(args);
    globalThis.fetch = async () => Response.json({
      success: true,
      hostname: "localhost",
      action: "soluctech_ai_chat"
    });
    try {
      const response = await worker.fetch(makeRequest(validBody, { origin: devOrigin }), makeEnv({
        dev: true,
        turnstileSecret: "another-secret",
        localTurnstileDiagnostics: true
      }));
      assert.equal(response.status, 200);
      assert.deepEqual(logs, []);
    } finally {
      console.info = originalInfo;
    }
  });
});

test("rejects requests beyond the configured rate limit", async () => {
  let modelCalled = false;
  const response = await worker.fetch(makeRequest(validBody), makeEnv({
    allowedByRateLimit: false,
    modelCall: () => { modelCalled = true; }
  }));
  assert.equal(response.status, 429);
  assert.equal(modelCalled, false);
});

test("returns safe errors when Workers AI fails or returns no response", async (t) => {
  await t.test("model failure", async () => {
    const response = await worker.fetch(makeRequest(validBody), makeEnv({ modelError: true }));
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /private model error/);
  });
  await t.test("empty model result", async () => {
    const response = await worker.fetch(makeRequest(validBody), makeEnv({ modelResult: {} }));
    assert.equal(response.status, 502);
  });
});
