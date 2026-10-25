"use strict";
(() => {
  const configuration = document.currentScript?.dataset;
  const API_URL = configuration?.apiUrl;
  const SITE_KEY = configuration?.siteKey;
  if (!API_URL || !SITE_KEY) {
    console.error('Falta la configuración pública del chat de Soluctech AI.');
    return;
  }
  const TURNSTILE_ACTION = 'soluctech_ai_chat';
  const history = [];
  let token = '';
  let widgetId;
  let sending = false;

  const style = document.createElement('style');
  style.textContent = `
    .sa-chat-button{position:fixed;right:24px;bottom:24px;z-index:50;display:flex;align-items:center;gap:10px;padding:14px 20px;border:0;border-radius:999px;background:#0b2a4a;color:#fff;font:700 15px/1.2 system-ui,sans-serif;box-shadow:0 8px 28px #071e3852;cursor:pointer}
    .sa-chat-button:hover{background:#1265a8}
    .sa-chat-panel{position:fixed;right:24px;bottom:88px;z-index:51;display:flex;width:min(390px,calc(100vw - 32px));height:min(590px,calc(100vh - 120px));flex-direction:column;overflow:hidden;border:1px solid #dbe5ef;border-radius:16px;background:#fff;box-shadow:0 18px 60px #071e3840;font:15px/1.5 system-ui,sans-serif;color:#112c4c}
    .sa-chat-panel[hidden]{display:none}
    .sa-chat-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:#0b2a4a;color:#fff}
    .sa-chat-head h2{margin:0;font:700 17px/1.3 system-ui,sans-serif}
    .sa-chat-close{border:0;background:transparent;color:#fff;font-size:25px;cursor:pointer}
    .sa-chat-notice{margin:0;padding:10px 16px;background:#f1f6fb;color:#44566c;font-size:12px}
    .sa-chat-messages{display:flex;flex:1;flex-direction:column;gap:10px;overflow:auto;padding:14px}
    .sa-chat-message{max-width:90%;padding:10px 12px;border-radius:12px;background:#f1f6fb;white-space:pre-wrap;overflow-wrap:anywhere}
    .sa-chat-message[data-role="user"]{align-self:flex-end;background:#e4f5fa}
    .sa-chat-message[data-role="assistant"]{align-self:flex-start}
    .sa-chat-controls{padding:12px 14px;border-top:1px solid #dbe5ef}
    .sa-chat-status{min-height:1.4em;margin:0 0 8px;color:#44566c;font-size:12px}
    .sa-chat-status[data-error="true"]{color:#a32121}
    .sa-chat-turnstile{min-height:65px;margin:4px 0 10px}
    .sa-chat-form{display:flex;gap:8px;align-items:flex-end}
    .sa-chat-input{width:100%;min-height:68px;max-height:120px;resize:vertical;padding:10px;border:1px solid #aebbc9;border-radius:8px;font:14px/1.4 system-ui,sans-serif}
    .sa-chat-send{min-height:42px;padding:9px 13px;border:0;border-radius:8px;background:#1265a8;color:#fff;font-weight:700;cursor:pointer}
    .sa-chat-send:disabled{background:#8794a5;cursor:not-allowed}
    @media(max-width:480px){.sa-chat-button{right:16px;bottom:16px}.sa-chat-panel{right:8px;bottom:78px;width:calc(100vw - 32px);height:min(620px,calc(100vh - 96px))}}
  `;
  document.head.append(style);

  const button = document.createElement('button');
  button.className = 'sa-chat-button';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'sa-chat-panel');
  button.textContent = '✦  Soluctech AI';

  const panel = document.createElement('section');
  panel.className = 'sa-chat-panel';
  panel.id = 'sa-chat-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Chat de Soluctech AI');

  const head = document.createElement('header');
  head.className = 'sa-chat-head';
  const title = document.createElement('h2');
  title.textContent = 'Soluctech AI';
  const close = document.createElement('button');
  close.className = 'sa-chat-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Cerrar chat');
  close.textContent = '×';
  head.append(title, close);

  const notice = document.createElement('p');
  notice.className = 'sa-chat-notice';
  notice.textContent = 'Asesoría sobre servicios Soluctech. No compartas nombres, datos de contacto ni otra información personal.';

  const messages = document.createElement('div');
  messages.className = 'sa-chat-messages';
  messages.setAttribute('aria-live', 'polite');

  const controls = document.createElement('div');
  controls.className = 'sa-chat-controls';
  const status = document.createElement('p');
  status.className = 'sa-chat-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Cargando verificación de seguridad…';
  const turnstile = document.createElement('div');
  turnstile.className = 'sa-chat-turnstile';
  turnstile.id = 'sa-chat-turnstile';
  const form = document.createElement('form');
  form.className = 'sa-chat-form';
  const input = document.createElement('textarea');
  input.className = 'sa-chat-input';
  input.maxLength = 1200;
  input.required = true;
  input.setAttribute('aria-label', 'Escribe tu pregunta');
  input.placeholder = '¿Cómo puede ayudarte Soluctech?';
  const send = document.createElement('button');
  send.className = 'sa-chat-send';
  send.type = 'submit';
  send.textContent = 'Enviar';
  send.disabled = true;
  form.append(input, send);
  controls.append(status, turnstile, form);
  panel.append(head, notice, messages, controls);
  document.body.append(button, panel);

  function setStatus(text, error = false) {
    status.textContent = text;
    status.dataset.error = String(error);
  }

  function updateButton() {
    send.disabled = sending || !token || !input.value.trim();
  }

  function addMessage(role, content) {
    const item = document.createElement('div');
    item.className = 'sa-chat-message';
    item.dataset.role = role;
    item.textContent = content;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function fitHistory(items) {
    const result = [...items];
    while (result.length > 8 || result.reduce((sum, item) => sum + item.content.length, 0) > 5000) {
      result.shift();
    }
    return result;
  }

  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) input.focus();
  });
  close.addEventListener('click', () => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  });
  input.addEventListener('input', updateButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || !token || sending) return;

    const requestMessages = fitHistory([...history, { role: 'user', content: question }]);
    const submittedToken = token;
    token = '';
    sending = true;
    updateButton();
    addMessage('user', question);
    setStatus('Consultando el asistente de Soluctech…');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: requestMessages, turnstileToken: submittedToken })
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(`Respuesta no válida del backend (HTTP ${response.status}).`);
      }
      if (!response.ok) throw new Error(result.error || `Error del backend (HTTP ${response.status}).`);
      if (typeof result.reply !== 'string' || !result.reply.trim()) {
        throw new Error('El backend no devolvió una respuesta del modelo.');
      }

      history.splice(0, history.length, ...fitHistory([
        ...requestMessages,
        { role: 'assistant', content: result.reply }
      ]));
      addMessage('assistant', result.reply);
      input.value = '';
      setStatus('Respuesta recibida del asistente de Soluctech.');
    } catch (error) {
      setStatus(error.message || 'No se pudo conectar con el backend local.', true);
    } finally {
      sending = false;
      if (window.turnstile && widgetId !== undefined) window.turnstile.reset(widgetId);
      updateButton();
    }
  });

  window.soluctechTurnstileLoaded = () => {
    widgetId = window.turnstile.render(turnstile, {
      sitekey: SITE_KEY,
      action: TURNSTILE_ACTION,
      callback: (newToken) => {
        token = newToken;
        setStatus('Verificación lista.');
        updateButton();
      },
      'expired-callback': () => {
        token = '';
        setStatus('La verificación venció; espera una nueva.', true);
        updateButton();
      },
      'error-callback': (errorCode) => {
        token = '';
        const messages = {
          '110100': 'La Site Key de Turnstile no es válida. Verifica la clave pública en Cloudflare.',
          '110110': 'No se encontró la Site Key de Turnstile. Verifica la clave pública en Cloudflare.',
          '110200': 'El dominio de este sitio no está autorizado para Turnstile.',
          '400020': 'La Site Key de Turnstile no es válida. Verifica que copiaste la clave activa de producción en Cloudflare.',
          '400021': 'La región de la Site Key no coincide con la del script de Turnstile.',
          '400070': 'La Site Key de Turnstile está deshabilitada en Cloudflare.'
        };
        setStatus(messages[String(errorCode)] || 'No se pudo completar la verificación de seguridad. Recarga la página e inténtalo nuevamente.', true);
        updateButton();
        return true;
      }
    });
  };

  const turnstileScript = document.createElement('script');
  turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=soluctechTurnstileLoaded';
  turnstileScript.async = true;
  turnstileScript.defer = true;
  turnstileScript.onerror = () => setStatus('No se pudo cargar Turnstile.', true);
  document.head.append(turnstileScript);
})();
