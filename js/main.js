"use strict";
(() => {
  const isLocalHost = ['localhost', '127.0.0.1'].includes(location.hostname);
  const chatConfig = isLocalHost
    ? {
        apiUrl: 'http://127.0.0.1:8787/api/chat',
        siteKey: '1x00000000000000000000AA'
      }
    : ['www.soluctech.cl', 'soluctech.cl'].includes(location.hostname)
      ? {
          apiUrl: 'https://soluctech-ai-backend.soluctech-ai.workers.dev/api/chat',
          siteKey: '0x4AAAAAAFibKXdWBOjeutlX'
        }
      : null;
  if (chatConfig) {
    const chatScript = document.createElement('script');
    chatScript.src = '/js/ai-chat.js';
    chatScript.dataset.apiUrl = chatConfig.apiUrl;
    chatScript.dataset.siteKey = chatConfig.siteKey;
    chatScript.onerror = () => console.error('No se pudo cargar el chat de Soluctech AI.');
    chatScript.defer = true;
    document.head.append(chatScript);
  }
  const toggle=document.querySelector('.nav-toggle'); const nav=document.querySelector('.site-nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Abrir menú':'Cerrar menú');nav.classList.toggle('is-open',!open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}));}
  document.querySelectorAll('.faq-toggle').forEach(btn=>btn.addEventListener('click',()=>{const opened=btn.getAttribute('aria-expanded')==='true';const panel=document.getElementById(btn.getAttribute('aria-controls'));btn.setAttribute('aria-expanded',String(!opened));btn.querySelector('span').textContent=opened?'+':'−';if(panel)panel.hidden=opened;}));
  const form=document.getElementById('contact-form'); if(!form)return;
  const fields=['nombre','empresa','correo','telefono','servicio','modalidad','mensaje'];
  const limits={nombre:100,empresa:100,correo:254,telefono:30,mensaje:1000};
  const validEmail=v=>/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(v);
  const validPhone=v=>v===''||/^[0-9 +\-()]+$/.test(v);
  function validate(data){const errors={};for(const name of ['nombre','empresa','correo','servicio','modalidad','mensaje'])if(!String(data[name]||'').trim())errors[name]='Este campo es obligatorio.';if(data.correo&&!validEmail(data.correo))errors.correo='Ingresa un correo electrónico válido.';if(data.telefono&&!validPhone(data.telefono))errors.telefono='Solo se permiten números, espacios y + - ( ).';for(const [name,max] of Object.entries(limits))if((data[name]||'').length>max)errors[name]=`Máximo ${max} caracteres.`;return errors}
  const status=document.getElementById('form-status');
  function showStatus(msg,problem=false){status.hidden=false;status.textContent=msg;status.setAttribute('role',problem?'alert':'status')}
  form.addEventListener('submit',async event=>{event.preventDefault();const data=Object.fromEntries(new FormData(form).entries());const errors=validate(data);for(const name of fields){const el=form.elements.namedItem(name),box=document.getElementById(name+'-error');if(!el||!box)continue;const err=errors[name];box.textContent=err||'';box.hidden=!err;el.setAttribute('aria-invalid',String(Boolean(err)))}status.hidden=true;if(Object.keys(errors).length){form.elements.namedItem(Object.keys(errors)[0]).focus();return;}const endpoint=form.dataset.endpoint;if(!endpoint){showStatus('El formulario aún no está habilitado para envíos. Por ahora, escríbenos a crojasl@soluctech.cl.',true);return;}const button=form.querySelector('[type=submit]');button.disabled=true;try{const response=await fetch(endpoint,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(data)});if(!response.ok)throw Error('Error HTTP');form.reset();showStatus('Tu mensaje fue enviado correctamente. Gracias por contactarnos.');}catch(e){showStatus('No fue posible enviar tu mensaje. Intenta nuevamente o escríbenos por correo.',true)}finally{button.disabled=false}});
})();
