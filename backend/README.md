# Soluctech AI — etapa 1: backend

Worker independiente para probar el endpoint de conversación de Soluctech AI. Esta etapa no integra el widget, no modifica las páginas y no despliega el servicio.

## Piloto configurado

- Runtime: Cloudflare Workers.
- Inferencia: Workers AI mediante el binding `AI`.
- Modelo candidato: `@cf/meta/llama-3.1-8b-instruct-fp8-fast`.
- Plan: Workers Free. La configuración no habilita una ruta ni un hostname público en producción (`workers_dev: false`).
- Cuota antiabuso por IP: 5 solicitudes por minuto, con el Rate Limiting binding de Cloudflare. El límite de Cloudflare es aproximado y se aplica por ubicación; no es una cuota diaria global.
- Protección de bots: Turnstile obligatorio y validado desde el servidor; el token debe corresponder al dominio y la acción esperados.
- Contexto: únicamente extractos comerciales derivados del catálogo y las especificaciones aprobadas.
- Privacidad: no registra conversaciones; rechaza campos de contacto y patrones comunes de datos personales antes de consultar el modelo. La interfaz de la etapa 2 deberá avisar que no se compartan datos personales en el chat.
- La solicitud al modelo solo incluye instrucciones, contexto comercial y mensajes de conversación. No incluye IP, token de Turnstile ni campos estructurados de contacto.

El catálogo de modelos y las rutas de documentación de Cloudflare pueden cambiar. La configuración conserva el identificador solicitado para la evaluación; una inferencia real debe confirmar que sigue disponible en Workers Free antes de habilitar el asistente.

## Pruebas locales sin cuenta ni facturación

Requiere Node.js 22 o posterior. Ejecuta los comandos desde esta carpeta (`backend`):

```powershell
npm test
```

Las pruebas sustituyen el binding AI y la verificación remota de Turnstile; no llaman a servicios externos ni consumen Neurons. Para un ensayo de inferencia real se necesita configurar una cuenta Cloudflare con Workers AI disponible y credenciales locales de Wrangler. No ejecutar `wrangler deploy` en esta etapa.

## Preparación pendiente para una prueba real

1. Instalar las dependencias de desarrollo: `npm install`.
2. Confirmar en el catálogo de la cuenta que el modelo candidato sigue disponible en Workers Free.
3. Configurar la clave secreta de Turnstile como secreto local/de Cloudflare, nunca en `wrangler.json`, el frontend ni el repositorio.
4. Registrar el sitio de pruebas de Turnstile para los hosts permitidos y usar la acción `soluctech_ai_chat`.
5. Ejecutar Wrangler localmente con la configuración `dev` y validar una inferencia de prueba antes de aprobar cualquier despliegue.
6. Confirmar que los `namespace_id` de rate limiting no estén ya asignados a otros bindings en la cuenta antes de desplegar.

`ALLOWED_ORIGINS` contiene solo los orígenes de producción conocidos. El entorno `dev` permite exclusivamente los dos orígenes HTTP locales configurados. CORS no reemplaza Turnstile ni autentica usuarios: Turnstile es obligatorio porque el endpoint destinado al público no puede mantener una clave secreta en el navegador.

Los límites de Workers AI gratuitos publicados por Cloudflare son 10.000 Neurons por día; Workers Free incluye hasta 100.000 solicitudes Worker por día. Si se agota la cuota gratuita, el Worker devolverá un error y no se debe activar un plan pagado sin autorización expresa.

## Página de prueba local

La página independiente `backend/local-test/index.html` permite probar manualmente el Worker sin modificar ni servir las páginas corporativas. Desde la raíz del repositorio, inicia un servidor estático ligado a loopback:

```powershell
python -m http.server 8000 --bind localhost
```

Abre `http://localhost:8000/backend/local-test/`. La página envía consultas a `http://127.0.0.1:8787/api/chat`; el navegador incluirá `Origin: http://localhost:8000`, permitido por el entorno `dev`.

Para probar el agente integrado en las páginas del sitio mientras trabajas localmente, inicia el servidor estático desde la raíz del repositorio (no desde `backend`). El puerto `8001` evita confundir la raíz del sitio con el servidor de prueba independiente que puede estar usando `8000`:

```powershell
python -m http.server 8001 --bind localhost
```

Abre `http://localhost:8001/`. El botón flotante se carga únicamente para `localhost` y `127.0.0.1`; en otros hostnames, incluido el dominio público, el script de chat no se carga. El frontend usa el Worker local en `http://127.0.0.1:8787/api/chat`. Mantén Wrangler ejecutándose con `--env dev`; ese entorno permite los orígenes locales de los puertos `8000` y `8001`.

La vista previa Cloudflare del sitio todavía requiere un hostname de preview y un endpoint Workers AI `dev` configurado. No se inventa ni se habilita una URL workers.dev sin confirmar que el Worker se haya publicado al entorno de desarrollo; la prueba local no publica recursos.

Antes de enviar una consulta, configura el secreto dummy de Turnstile para pruebas únicamente en la configuración local del Worker y reinícialo. Para `wrangler dev --env dev`, usa `backend/.dev.vars.dev`; para el entorno sin nombre, usa `backend/.dev.vars`. Define `TURNSTILE_SECRET_KEY` con el secreto dummy oficial de Cloudflare, sin reemplazar otras variables locales existentes. No uses una clave de producción. La página usa la sitekey pública de prueba `1x00000000000000000000AA`, que genera tokens dummy aceptados con el secreto dummy correspondiente; Cloudflare documenta ambas claves de prueba en [Test your Turnstile implementation](https://developers.cloudflare.com/turnstile/troubleshooting/testing/). Wrangler habilita `TURNSTILE_TEST_MODE` únicamente en el entorno `dev`; con el secreto oficial de prueba y una respuesta exitosa de Siteverify, el backend acepta las respuestas dummy `hostname=localhost`/`action=test`, `hostname=example.com`/`action=null` y `hostname=example.com` sin propiedad `action`. En producción se sigue exigiendo el hostname del origen autorizado y `action=soluctech_ai_chat`; las respuestas dummy no se aceptan. La clave secreta nunca se incluye en la página ni en la solicitud del navegador; solo se envía el token generado.

Para habilitar temporalmente el diagnóstico de Siteverify solo en una sesión local `wrangler dev --env dev`, agrega `LOCAL_TURNSTILE_DIAGNOSTICS=true` a `backend/.dev.vars.dev` y reinicia Wrangler. El registro se activa solo junto con `TURNSTILE_TEST_MODE=true` y el secreto dummy oficial; imprime exclusivamente `success`, `hostname`, `action` y `error-codes` cuando existan. No agregues esta variable a `wrangler.json` ni a configuración remota. Retírala al terminar el diagnóstico.

La página muestra la respuesta real del Worker o el error HTTP devuelto. Cada envío usa un token nuevo; Turnstile debe cargar y entregar el token antes de habilitar el botón.

## Rutas

- `POST /api/chat`: requiere `Origin` autorizado, `messages`, `turnstileToken`, un secreto Turnstile configurado, límite disponible y binding AI.
- `OPTIONS /api/chat`: preflight CORS para los orígenes permitidos.
