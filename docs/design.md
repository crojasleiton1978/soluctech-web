# Design Document — Soluctech Corporate Website

## Overview

Este documento describe la arquitectura y el diseño técnico del sitio web oficial de Soluctech (`www.soluctech.cl`), una consultora tecnológica chilena. El sitio es un sitio **estático** compuesto por cuatro páginas principales (Inicio, Servicios, Nosotros y Contacto), construido con **HTML5, CSS3 y JavaScript vainilla**, sin framework ni paso de build.

El objetivo es entregar un sitio rápido, responsivo, accesible y optimizado para SEO, que respete la identidad institucional de Soluctech y facilite la generación de leads mediante el formulario de contacto.

### Decisiones de diseño clave

- **Stack:** HTML5 semántico + CSS3 (custom properties, mobile-first) + JavaScript vainilla (ES6+). Sin framework, sin bundle, sin dependencias de runtime.
- **Despliegue:** Archivos estáticos servidos por un host compatible con HTTPS (por ejemplo, hosting estático con certificado SSL gestionado). El formulario se envía a través de un servicio de terceros (Formspree o FormSubmit) al correo `crojasl@soluctech.cl`.
- **Idioma:** Contenido en español (`lang="es"`).
- **Público objetivo:** Empresas que requieren consultoría tecnológica en Chile.

## Architecture

El sitio sigue una arquitectura **multipágina estática tradicional** (MPA). Cada página es un documento HTML independiente que comparte una hoja de estilos global y un script global. No hay enrutamiento del lado del cliente; la navegación es mediante enlaces a archivos `.html`.

### Principios arquitectónicos

1. **Separación de capas:** Estructura (HTML semántico), presentación (CSS con design tokens) y comportamiento (JS) en archivos separados.
2. **Mobile-first:** Los estilos base apuntan a móvil; los media queries escalan hacia tableta y escritorio.
3. **Reutilización mediante componentes HTML:** Header, footer y secciones repetidas se construyen con clases BEM-like compartidas para garantizar consistencia visual.
4. **Sin dependencias externas de runtime:** Solo se cargan fuentes (máx. 2 familias) y el snippet de Google Analytics 4. Todo lo demás es código propio.

### Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Navegador del visitante                  │
└───────────────────────────┬─────────────────────────────┘
                            │  HTTPS (Req 17)
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Hosting estático (SSL/TLS gestionado)         │
│                                                             │
│   index.html   servicios.html   nosotros.html   contacto  │
│        css/styles.css      js/main.js      assets/         │
│        sitemap.xml         robots.txt                      │
└───────────┬───────────────────────────┬───────────────────┘
            │                           │
            │  Recursos estáticos       │  POST del formulario
            ▼                           ▼
   Fuentes (Google Fonts)      Formspree / FormSubmit
   Google Analytics 4          → crojasl@soluctech.cl
```

### Responsabilidades por capa

| Capa | Archivo | Responsabilidad |
|------|---------|------------------|
| Estructura | `*.html` | Contenido semántico, meta tags, jerarquía de encabezados |
| Presentación | `css/styles.css` | Design tokens, layout responsivo, componentes visuales |
| Comportamiento | `js/main.js` | Menú hamburguesa, acordeón FAQ, validación del formulario, envío al backend |
| Datos | `assets/` | Logotipo e imágenes optimizadas |
| SEO/infra | `sitemap.xml`, `robots.txt` | Indexación y directivas para crawlers |

## Pages

### Página 1 — Inicio (`index.html`)

Secciones en orden del documento:

1. **Hero** (primera sección, visible sin desplazamiento)
   - H1: "SOLUCTECH — Transformando desafíos en soluciones tecnológicas"
   - H2: "Tecnología conectada con los objetivos de tu negocio"
   - Párrafo descriptivo (texto exacto del Req 2.3)
   - Botón CTA principal: "Agenda una conversación inicial" → `contacto.html`
2. **Nuestro Enfoque** — 4 tarjetas/pilares en orden: Entender el desafío, Priorizar oportunidades, Definir hoja de ruta, Acompañar resultados.
3. **Resumen de Portafolio** — 6 tarjetas de servicios (nombre + descripción ≤ 150 caracteres), clicables, enlazando a `servicios.html#<anchor>` del servicio correspondiente.
4. **Modalidades de Contratación** — 3 tarjetas: Diagnóstico Ejecutivo, Proyecto Específico, Asesoría Recurrente.
5. **Metodología** — 5 pasos en orden: Descubrimiento, Diagnóstico, Propuesta, Ejecución, Cierre. Cada paso con descripción de 10–150 caracteres. Disposición horizontal en escritorio, vertical en móvil.
6. **CTA** — al menos un botón CTA hacia `contacto.html`.

### Página 2 — Servicios (`servicios.html`)

- 6 fichas, una por servicio, en el orden especificado (Req 7.2). Cada ficha es un `<article>` con `id` (ancla) para navegación directa desde Inicio.
- Cada ficha contiene: número, nombre del servicio, texto de presentación, lista de bullets de alcance. Si el catálogo define **entregables** o **notas aclaratorias**, se incluyen en la ficha.
- El detalle por servicio (Req 8) define los alcances, entregables, fases y notas exactas por ficha.
- CTA hacia `contacto.html`.

### Página 3 — Nosotros (`nosotros.html`)

- Propuesta de valor (Req 9.1).
- Metodología de 5 pasos con nombre y descripción.
- Enfoque de 4 pilares con nombre y descripción.
- Modalidad de atención (remota y presencial según requerimiento).
- **Liderazgo Ejecutivo**: sección con exactamente 2 integrantes visibles simultáneamente: Macarena Herrera R. (Gerente General) y Carlos Rojas L. (Consultor TI Principal).
- **Valores**: al menos 4 valores, cada uno con título y descripción.
- CTA hacia `contacto.html`.

### Página 4 — Contacto (`contacto.html`)

- **Formulario de contacto** (7 campos) con validación JS del lado del cliente y envío vía Formspree/FormSubmit.
- **Datos de contacto directo**: correo `crojasl@soluctech.cl` como texto y como enlace `mailto:`; nombres y cargos de los responsables.
- **FAQ** (acordeón): propósito de la reunión de descubrimiento (sin costo ni obligación) y las tres modalidades.
- **CTA** que dirige al formulario.

## Components and Interfaces

Esta sección documenta los componentes reutilizables clave, su estructura HTML, sus interfaces JavaScript (cuando aplican) y el contrato de clases CSS de cada uno.

### Header (compartido, en las 4 páginas)

Cabecera fija (`position: sticky`/`fixed`) que contiene:

- **Logotipo** de Soluctech (enlace a `index.html`).
- **Menú principal** con enlaces a las 4 páginas.
- **CTA distinguido** visualmente (clase diferenciada) hacia `contacto.html`.
- **Menú hamburguesa**: visible solo cuando el ancho de pantalla es < 768px. Un botón (`aria-expanded`, `aria-controls`) alterna la visibilidad de los enlaces.

```html
<header class="site-header" role="banner">
  <a href="index.html" class="site-header__logo" aria-label="Soluctech — Inicio">
    <img src="assets/logo-soluctech.svg" alt="Logotipo de Soluctech" width="160" height="40">
  </a>

  <button class="site-header__toggle" type="button"
          aria-label="Abrir menú" aria-expanded="false" aria-controls="primary-nav"
          hidden>
    <span class="site-header__toggle-bar"></span>
    <span class="site-header__toggle-bar"></span>
    <span class="site-header__toggle-bar"></span>
  </button>

  <nav class="site-nav" id="primary-nav" aria-label="Navegación principal">
    <ul class="site-nav__list">
      <li><a href="index.html">Inicio</a></li>
      <li><a href="servicios.html">Servicios</a></li>
      <li><a href="nosotros.html">Nosotros</a></li>
      <li><a href="contacto.html" class="site-nav__cta">Contáctanos</a></li>
    </ul>
  </nav>
</header>
```

### Footer (compartido, en las 4 páginas)

Pie de página con nombre de la empresa, dominio `www.soluctech.cl`, correo de contacto y enlaces a las 4 páginas.

```html
<footer class="site-footer" role="contentinfo">
  <div class="site-footer__brand">Soluctech — www.soluctech.cl</div>
  <a href="mailto:crojasl@soluctech.cl">crojasl@soluctech.cl</a>
  <nav class="site-footer__nav" aria-label="Navegación del pie de página">
    <a href="index.html">Inicio</a>
    <a href="servicios.html">Servicios</a>
    <a href="nosotros.html">Nosotros</a>
    <a href="contacto.html">Contacto</a>
  </nav>
</footer>
```

### Tarjeta (Card)

Componente reutilizable para pilares, servicios, modalidades, valores y fichas. Clases BEM-like: `.card`, `.card__title`, `.card__body`.

### Acordeón FAQ

Componente accesible: cada ítem usa un `<button aria-expanded>` asociado a un panel (`aria-controls`/`id`). Soporta navegación por teclado.

### Formulario de contacto

Ver sección *Form Handling*.

### Interfaces de JavaScript

El comportamiento del lado del cliente se organiza en módulos con **funciones puras** (verificables con property-based tests) y **orquestadores** (con efectos secundarios sobre el DOM o la red).

**Módulo de navegación (`js/main.js`) — menú hamburguesa:**

```js
// Alterna la visibilidad del menú móvil. Efecto secundario sobre el DOM.
function toggleMobileNav(toggleBtn, navList) {
  const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
  toggleBtn.setAttribute('aria-expanded', String(!isOpen));
  navList.hidden = isOpen;
  toggleBtn.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
}
```

**Módulo de acordeón FAQ (`js/main.js`):**

```js
// Alterna un panel del acordeón. Efecto secundario sobre el DOM.
function toggleFaqItem(button, panel) {
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  panel.hidden = isOpen;
}
```

**Módulo de validación y envío del formulario (`js/main.js`):**

```js
// Funciones puras (sin efectos secundarios, verificables con PBT)
isValidEmail(value: string): boolean       // Req 12.9
isValidPhone(value: string): boolean       // Req 12.10
isWithinLimit(value: string, max: number): boolean  // Req 12.12
validateForm(data: ContactFormData): FormErrors      // Req 12.8–12.12

// Orquestador (efectos secundarios: red y DOM)
async submitForm(data: ContactFormData): Promise<{ ok: true } | never>  // Req 12.6–12.7
```

### Contratos de clases CSS

| Clase | Rol | Usada por |
|-------|-----|-----------|
| `.btn`, `.btn--primary` | Botón base y variante primaria (CTA) | Todas las páginas |
| `.card`, `.card__title`, `.card__body` | Tarjeta reutilizable | Pilares, servicios, modalidades, valores, fichas |
| `.section` | Contenedor de sección con espaciado estándar | Todas las páginas |
| `.site-header`, `.site-header__logo`, `.site-header__toggle` | Cabecera y menú hamburguesa | Todas las páginas |
| `.site-nav`, `.site-nav__list`, `.site-nav__cta` | Navegación principal | Todas las páginas |
| `.site-footer`, `.site-footer__brand`, `.site-footer__nav` | Pie de página | Todas las páginas |
| `.contact-form`, `.form-field`, `.form-field__error` | Formulario de contacto | `contacto.html` |
| `.faq` | Ítems FAQ colapsables (acordeón) | `contacto.html` |

## Data Models

Al tratarse de un sitio estático sin backend propio, los "modelos de datos" son las estructuras de contenido representadas en HTML y los objetos JavaScript que se envían al servicio de formularios. A continuación se documentan las estructuras principales.

### Modelo: datos de envío del formulario (`ContactFormData`)

Objeto JavaScript construido a partir de los campos del formulario y enviado como JSON al endpoint de Formspree/FormSubmit (Req 12.1–12.5).

```js
type ContactFormData = {
  nombre:    string;   // obligatorio, máx. 100 caracteres
  empresa:   string;   // obligatorio, máx. 100 caracteres
  correo:    string;   // obligatorio, máx. 254 caracteres, formato email válido
  telefono:  string;   // opcional, máx. 30 caracteres, solo dígitos/espacios/+ - ( )
  servicio:  string;   // obligatorio, uno de 6 valores fijos
  modalidad: string;   // obligatorio, uno de 3 valores fijos
  mensaje:   string;   // obligatorio, máx. 1000 caracteres
};
```

### Modelo: objeto de errores de validación (`FormErrors`)

Retorno de `validateForm`. Las claves son nombres de campos con error; los valores son mensajes en español (Req 12.8–12.12).

```js
type FormErrors = { [fieldName: string]: string };
// Ejemplo: { correo: 'Ingresa un correo válido.', mensaje: 'Máximo 1000 caracteres.' }
```

### Modelo: tarjeta de servicio (`ServiceCard`)

Estructura de contenido de cada tarjeta en el resumen de portafolio (Inicio) y de cada ficha en la página de Servicios (Req 4.2, 7.2–7.6, 8).

```js
type ServiceCard = {
  id:           string;    // ancla, ej. "consultoria-ti"
  numero:       number;    // 1–6
  nombre:       string;    // nombre del servicio
  descripcion:  string;    // ≤ 150 caracteres (Req 4.2)
  alcance:      string[];  // lista de bullets (ficha de servicios)
  entregables?: string[]; // opcional, según catálogo (Req 7.5/8.2)
  notas?:       string[]; // opcional, según catálogo (Req 7.6/8.4/8.7)
};
```

### Modelo: paso de metodología (`MethodologyStep`)

```js
type MethodologyStep = {
  numero:      number;   // 1–5
  nombre:      string;   // Descubrimiento, Diagnóstico, Propuesta, Ejecución, Cierre
  descripcion: string;   // 10–150 caracteres (Req 6.3)
};
```

### Modelo: pilar de enfoque (`Pillar`)

```js
type Pillar = {
  nombre:      string;   // Entender el desafío, Priorizar oportunidades, etc.
  descripcion: string;
};
```

### Modelo: modalidad de contratación (`Modality`)

```js
type Modality = {
  nombre:      string;   // Diagnóstico Ejecutivo, Proyecto Específico, Asesoría Recurrente
  descripcion: string;
};
```

### Modelo: integrante del liderazgo (`Leader`)

```js
type Leader = {
  nombre: string;   // ej. "Macarena Herrera R."
  cargo:  string;   // ej. "Gerente General"
};
// Exactamente 2 integrantes visibles simultáneamente (Req 10.1)
```

### Modelo: valor institucional (`Value`)

```js
type Value = {
  titulo:      string;
  descripcion: string;
};
// Mínimo 4 valores (Req 11.1)
```

### Modelo: ítem de FAQ (`FaqItem`)

```js
type FaqItem = {
  pregunta: string;
  respuesta: string;
};
```

### Modelo: metadatos de página (`PageMeta`)

```js
type PageMeta = {
  ruta:            string;   // ej. "index.html"
  metaTitle:       string;   // ≤ 60 caracteres, único por página (Req 15.1)
  metaDescription: string;   // ≤ 160 caracteres, único por página (Req 15.3)
  h1:              string;   // exactamente uno por página (Req 15.5)
};
```

## CSS / Design System

### Design tokens (custom properties)

Centralizados en `:root` para garantizar consistencia visual (Req 20) y restringir los colores a la paleta institucional.

```css
:root {
  /* Paleta institucional — únicos colores permitidos (Req 20.1) */
  --color-primary:   #0b2a4a;   /* azul profundo */
  --color-secondary: #1aa0a0;  /* acento teal */
  --color-neutral-900: #1a1a1a;
  --color-neutral-700: #4a4a4a;
  --color-neutral-300: #cfcfcf;
  --color-neutral-100: #f5f7fa;
  --color-white:     #ffffff;

  /* Tipografía — máximo 2 familias (Req 20.2) */
  --font-heading: "Montserrat", system-ui, sans-serif;
  --font-body:    "Open Sans", system-ui, sans-serif;

  /* Tamaños — mínimo 16px de cuerpo (Req 14.2, 20.6) */
  --fs-body: 16px;        /* mínimo absoluto */
  --fs-h1: 2.25rem;
  --fs-h2: 1.75rem;
  --fs-h3: 1.25rem;

  /* Espaciado y layout */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --container-max: 1140px;

  /* Objetivos táctiles — mínimo 44x44px (Req 14.5) */
  --tap-min: 44px;
  --radius: 8px;
}
```

### Estrategia responsiva (mobile-first)

Breakpoints en 768px (tableta) y 1024px (escritorio), alineados a los rangos del Req 14.1.

```css
/* Base: móvil (<768px) */
.site-nav__list { flex-direction: column; }
.site-header__toggle { display: inline-flex; }   /* hamburguesa visible */

/* Tableta (≥768px) */
@media (min-width: 768px) {
  .site-header__toggle { display: none; }        /* menú horizontal */
  .site-nav__list { flex-direction: row; }
}

/* Escritorio (≥1024px) */
@media (min-width: 1024px) {
  .methodology__steps { flex-direction: row; } /* izquierda a derecha */
}
```

En móvil, los pasos de la metodología se disponen verticalmente (`flex-direction: column`); en escritorio, horizontalmente.

### Reglas de consistencia (Req 20)

- Botones, tarjetas y secciones usan clases compartidas (`.btn`, `.card`, `.section`) para mantener color, forma, tamaño y borde uniformes.
- El logotipo se coloca siempre en la misma posición del header con las mismas proporciones.
- El espaciado se basa en los tokens `--space-*` para uniformidad entre páginas.

## Form Handling

El formulario (`contacto.html`) tiene 7 campos. La validación se realiza **del lado del cliente en JavaScript** antes del envío; el envío se delega a un servicio de formularios (Formspree o FormSubmit) que entrega los datos al correo `crojasl@soluctech.cl`.

### Estructura del formulario

| Campo | Tipo | Obligatorio | Límite máx. | Notas |
|-------|------|-------------|-------------|-------|
| Nombre | text | Sí | 100 | — |
| Empresa | text | Sí | 100 | — |
| Correo | email | Sí | 254 | Validación de formato |
| Teléfono | tel | No | 30 | Solo dígitos, espacios y `+ - ( )` |
| Servicio | select | Sí | — | 6 opciones (los servicios) |
| Modalidad preferida | select/radio | Sí | — | 3 opciones (las modalidades) |
| Mensaje | textarea | Sí | 1000 | — |

```html
<form class="contact-form" id="contact-form" novalidate action="https://formspree.io/f/XXXX" method="POST">
  <div class="form-field">
    <label for="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" maxlength="100" required
           aria-required="true" autocomplete="name">
    <p class="form-field__error" id="nombre-error" role="alert" hidden></p>
  </div>

  <div class="form-field">
    <label for="empresa">Empresa</label>
    <input type="text" id="empresa" name="empresa" maxlength="100" required aria-required="true">
    <p class="form-field__error" id="empresa-error" role="alert" hidden></p>
  </div>

  <div class="form-field">
    <label for="correo">Correo</label>
    <input type="email" id="correo" name="correo" maxlength="254" required aria-required="true" autocomplete="email">
    <p class="form-field__error" id="correo-error" role="alert" hidden></p>
  </div>

  <div class="form-field">
    <label for="telefono">Teléfono (opcional)</label>
    <input type="tel" id="telefono" name="telefono" maxlength="30" autocomplete="tel">
    <p class="form-field__error" id="telefono-error" role="alert" hidden></p>
  </div>

  <div class="form-field">
    <label for="servicio">Servicio</label>
    <select id="servicio" name="servicio" required aria-required="true">
      <option value="" disabled selected>Selecciona un servicio</option>
      <option>Consultoría TI</option>
      <option>Inteligencia Artificial y Automatización</option>
      <option>Gestión de Proyectos TI</option>
      <option>Ciberseguridad</option>
      <option>Desarrollo de Software a Medida</option>
      <option>QA y Aseguramiento de Calidad</option>
    </select>
    <p class="form-field__error" id="servicio-error" role="alert" hidden></p>
  </div>

  <div class="form-field">
    <label for="modalidad">Modalidad preferida</label>
    <select id="modalidad" name="modalidad" required aria-required="true">
      <option value="" disabled selected>Selecciona una modalidad</option>
      <option>Diagnóstico Ejecutivo</option>
      <option>Proyecto Específico</option>
      <option>Asesoría Recurrente</option>
    </select>
    <p class="form-field__error" id="modalidad-error" role="alert" hidden></p>
  </div>

  <div class="form-field">
    <label for="mensaje">Mensaje</label>
    <textarea id="mensaje" name="mensaje" maxlength="1000" required aria-required="true"></textarea>
    <p class="form-field__error" id="mensaje-error" role="alert" hidden></p>
  </div>

  <button type="submit" class="btn btn--primary">Enviar</button>
  <p class="contact-form__status" id="form-status" role="status" aria-live="polite" hidden></p>
</form>
```

### Lógica de validación y envío (`js/main.js`)

El módulo de formulario expone funciones puras de validación que son verificables con property-based tests, y un orquestador que maneja el envío.

```js
// Validadores puros (verificables con PBT)

// Req 12.9: correo válido = exactamente un '@', parte local no vacía,
// dominio con al menos un punto y no vacío a cada lado del punto.
export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const atCount = (value.match(/@/g) || []).length;
  if (atCount !== 1) return false;
  const [local, domain] = value.split('@');
  if (local.length === 0) return false;
  if (!domain.includes('.')) return false;
  const [dLeft, dRight] = domain.split('.');
  // al menos un punto con partes no vacías a ambos lados
  return dLeft.length > 0 && dRight.length > 0;
}

// Req 12.10: teléfono válido = solo dígitos, espacios y + - ( )
export function isValidPhone(value) {
  if (value === '') return true; // opcional
  return /^[0-9 +\-()]+$/.test(value);
}

// Req 12.12: límite de caracteres por campo
export function isWithinLimit(value, max) {
  return typeof value === 'string' && value.length <= max;
}

const FIELD_LIMITS = {
  nombre: 100, empresa: 100, correo: 254, telefono: 30, mensaje: 1000,
};

// Req 12.8: mensajes por cada campo obligatorio vacío
export function validateForm(data) {
  const errors = {};
  const required = ['nombre', 'empresa', 'correo', 'servicio', 'modalidad', 'mensaje'];

  for (const field of required) {
    const v = (data[field] ?? '').trim();
    if (v === '') errors[field] = `El campo ${field} es obligatorio.`;
  }

  if (data.correo && !isValidEmail(data.correo)) {
    errors.correo = 'Ingresa un correo válido.';
  }
  if (data.telefono && !isValidPhone(data.telefono)) {
    errors.telefono = 'Teléfono: solo dígitos, espacios y + - ( ).';
  }
  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    if (data[field] && !isWithinLimit(data[field], max)) {
      errors[field] = `Máximo ${max} caracteres.`;
    }
  }
  return errors;
}

// Req 12.6 / 12.7 / 12.11: envío al backend
export async function submitForm(data) {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('submit_failed'); // 12.11: conservar datos
  return { ok: true };
}
```

### Manejo de errores (Req 12.11)

Si el envío falla, el orquestador muestra un mensaje de error en `#form-status` (con `role="alert"`) y **conserva los valores ingresados** en los campos (no los limpia). El usuario puede reintentar.

### Resultados del envío

- **Éxito (Req 12.7):** se muestra un mensaje de confirmación en `#form-status` y se resetea el formulario.
- **Validación fallida (Req 12.8/12.9/12.10/12.12):** se muestran mensajes por campo en sus respectivos `role="alert"`.
- **Fallo de red/servicio (Req 12.11):** mensaje de error y datos conservados.

## Error Handling

Esta sección consolida las estrategias de manejo de errores del formulario, la red y los casos límite.

### Errores de validación del formulario (Req 12.8–12.12)

Cada campo obligatorio vacío genera un mensaje específico en su contenedor `role="alert"` asociado (`#<campo>-error`). Los errores de formato (correo, teléfono) y de longitud (límites de caracteres) también se muestran por campo. La validación **no se detiene en el primer fallo**: `validateForm` evalúa todos los campos y devuelve un objeto `FormErrors` con todos los errores presentes.

- **Campo obligatorio vacío:** `"El campo <campo> es obligatorio."` (uno por cada campo vacío; los espacios en blanco se tratan como vacíos tras `trim()`).
- **Correo inválido:** `"Ingresa un correo válido."`
- **Teléfono inválido:** `"Teléfono: solo dígitos, espacios y + - ( )."`
- **Exceso de caracteres:** `"Máximo <n> caracteres."`

Los mensajes de validación van en los `role="alert"` por campo. El contenedor `#form-status` (`role="status"`, `aria-live="polite"`) se reserva para los resultados del envío (confirmación o error de red), no para los errores de validación.

### Errores de envío y red (Req 12.6, 12.7, 12.11)

| Escenario | Comportamiento |
|-----------|----------------|
| Envío exitoso (HTTP 2xx) | Mensaje de confirmación en `#form-status` y se resetea el formulario (Req 12.7). |
| Respuesta no-OK (HTTP ≥ 400) | `submitForm` lanza `Error('submit_failed')`; el orquestador muestra un mensaje de error en `#form-status` (`role="alert"`) y **conserva los datos** en los campos para reintentar (Req 12.11). |
| Fallo de red / excepción en `fetch` | Capturada por el orquestador; mismo mensaje de error de red y datos conservados. |

### Casos límite (edge cases)

- **Teléfono vacío:** campo opcional; `isValidPhone('')` retorna `true` (no genera error).
- **Espacios en blanco:** los campos obligatorios se evalúan tras `trim()`; una cadena de solo espacios se trata como vacía y genera error (Req 12.8).
- **Entrada muy larga:** el atributo `maxlength` del HTML limita la entrada en el navegador; el validador JS también verifica `isWithinLimit` como defensa adicional (Req 12.12).
- **Correo con múltiples `@`:** rechazado, ya que `atCount !== 1`.
- **Correo con punto final o partes vacías:** rechazado, ya que `dLeft.length === 0 || dRight.length === 0`.
- **JavaScript deshabilitado:** el atributo `novalidate` impide la validación nativa del navegador. Sin JS, el formulario se envía directamente al endpoint y la validación recae en el servicio de formularios del lado del servidor. Con JS habilitado, la validación del lado del cliente controla la experiencia antes del envío.

## SEO

### Meta tags por página (Req 15)

Cada página incluye `meta-title` (≤ 60 caracteres, distinto por página) y `meta-description` (≤ 160 caracteres, distinto por página, mencionando el tema principal de la página). El `meta-title` de Inicio es exactamente `"SOLUCTECH — Consultoría TI, IA y Ciberseguridad en Chile"`.

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- meta-title por página, ≤ 60 caracteres --></title>
  <meta name="description" content="<!-- meta-description por página, ≤ 160 caracteres -->">

  <!-- Open Graph -->
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.soluctech.cl/...">
  <meta property="og:image" content="https://www.soluctech.cl/assets/og-cover.jpg">

  <!-- Verificación de Google Search Console (Req 16.4) -->
  <meta name="google-site-verification" content="CODIGO_DE_VERIFICACION">

  <!-- Google Analytics 4 (Req 16.2/16.3) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
  <script defer>
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  </script>
</head>
```

### Jerarquía de encabezados (Req 15.5)

- Exactamente **un H1 por página**.
- Ningún encabezado de nivel N aparece sin que exista previamente un encabezado de nivel N-1 en el orden del documento (p. ej., no hay H3 sin un H2 previo).

### HTML semántico (Req 15.4)

Cada página usa `header`, `nav`, `main`, `section`, `article`, `footer`.

### Sitemap y robots (Req 15.6 / 16.1)

`sitemap.xml` en la raíz del dominio lista exactamente las 4 URLs.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.soluctech.cl/index.html</loc></url>
  <url><loc>https://www.soluctech.cl/servicios.html</loc></url>
  <url><loc>https://www.soluctech.cl/nosotros.html</loc></url>
  <url><loc>https://www.soluctech.cl/contacto.html</loc></url>
</urlset>
```

`robots.txt` permite el rastreo y referencia el sitemap.

```
User-agent: *
Allow: /
Sitemap: https://www.soluctech.cl/sitemap.xml
```

## Performance

Estrategias para cumplir los requisitos de rendimiento (Req 18):

- **CSS en el `<head>`** y **JS con `defer`** o al final del `<body>`, para no bloquear el renderizado del contenido visible inicial (Req 18.3).
- **Imágenes optimizadas:** máximo 200 KB por imagen, resolución ≥ 72 ppi (Req 18.2). Se prefieren formatos modernos (SVG para el logotipo e iconos; JPG/WebP para fotografías).
- **Máximo 50 solicitudes HTTP por página** (Req 18.4): se minimiza el número de recursos consolidando CSS y JS en un único archivo cada uno, y reutilizando las mismas hojas y scripts en todas las páginas.
- **Fuentes:** máximo 2 familias, cargadas con `preconnect` y `font-display: swap` para evitar bloqueo de texto.
- **Objetivo de carga:** contenido visible inicial en < 3 s bajo 4G (Req 18.1); se logra con el peso reducido y el renderizado no bloqueante.

## Accessibility

Cumplimiento de buenas prácticas de accesibilidad (Req 19):

- **Imágenes informativas:** `alt` descriptivo. **Imágenes decorativas:** `alt=""` (Req 19.1/19.8).
- **Contraste de color:** mínimo 4.5:1 para texto < 24px y 3:1 para texto ≥ 24px (Req 19.2), verificado con la paleta institucional.
- **Navegación por teclado:** todos los elementos interactivos son alcanzables con `Tab`, en el orden de lectura del documento (Req 19.3). Indicador de foco visible (`:focus-visible`) en todos los interactivos (Req 19.7).
- **Sin trampas de foco:** el foco puede avanzar y retroceder sin quedar atrapado (Req 19.6).
- **ARIA:** los componentes sin semántica nativa (menú hamburguesa, acordeón FAQ) usan `aria-expanded`, `aria-controls`, `aria-label` (Req 19.4).
- **Etiquetas de formulario:** cada campo tiene un `<label for>` asociado (Req 19.5). Los mensajes de error usan `role="alert"` y `aria-live`.
- **Objetivos táctiles:** mínimo 44×44px en dispositivos táctiles (Req 14.5).

```css
/* Indicador de foco diferenciado (Req 19.7) */
:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 2px;
}

/* Objetivo táctil mínimo (Req 14.5) */
.btn, .site-nav__list a, .site-header__toggle {
  min-width: var(--tap-min);
  min-height: var(--tap-min);
}
```

## File Structure

```
PaginaWeb_SoluctTech/
├── index.html              # Página Inicio
├── servicios.html          # Página Servicios
├── nosotros.html           # Página Nosotros
├── contacto.html           # Página Contacto
├── css/
│   └── styles.css          # Design system + layout responsivo
├── js/
│   └── main.js             # Menú hamburguesa, acordeón, validación y envío del formulario
├── assets/
│   ├── logo-soluctech.svg  # Logotipo
│   ├── og-cover.jpg        # Imagen Open Graph
│   └── ...                 # Imágenes optimizadas
├── sitemap.xml             # 4 URLs (Req 15.6/16.1)
├── robots.txt              # Directivas para crawlers
└── .kiro/
    └── specs/
        └── soluctech-corporate-website/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The following properties are derived from the acceptance criteria prework analysis. Pure functions (form validators, serializers) are the primary targets for property-based testing; structural invariants (over the limited set of pages and elements) are tested as properties iterating over all pages/elements. Criteria classified as EXAMPLE, EDGE_CASE, INTEGRATION, or SMOKE in the prework are addressed with example-based unit tests, integration tests, or smoke tests, respectively, and are not repeated here.

### Property 1: Service card description length

*For any* service card on the home page, the length of its description text SHALL be less than or equal to 150 characters.

**Validates: Requirements 4.2**

### Property 2: Methodology step description length

*For any* methodology step on the home page, the length of its description text SHALL be between 10 and 150 characters inclusive.

**Validates: Requirements 6.3**

### Property 3: Corporate values structure

*For any* value entry on the Nosotros page, it SHALL contain a title and an associated description, and the page SHALL present at least four such value entries.

**Validates: Requirements 11.1**

### Property 4: Text field length constraints

*For any* text input field of the contact form, its `maxlength` attribute SHALL match the limit specified for that field, and *for any* input value exceeding that field's limit, the form SHALL display a validation message indicating the allowed maximum.

**Validates: Requirements 12.1, 12.12**

### Property 5: Required-field empty validation

*For any* subset of the required fields left empty upon submission, the form SHALL display a validation message for each empty required field.

**Validates: Requirements 12.8**

### Property 6: Email format validation

*For any* string entered in the email field, the form SHALL reject it with a validation error if and only if the string does not contain exactly one `@` separating a non-empty local part from a domain that contains at least one dot with non-empty parts on both sides; valid emails SHALL produce no email error.

**Validates: Requirements 12.9**

### Property 7: Phone format validation

*For any* string entered in the phone field, the form SHALL reject it with a validation error if and only if the string contains a character other than digits, spaces, or the characters `+`, `-`, `(`, `)`; the empty string and any string composed exclusively of the allowed characters SHALL produce no phone error.

**Validates: Requirements 12.10**

### Property 8: Minimum font size and no horizontal overflow across breakpoints

*For any* page and *for any* responsive breakpoint (mobile < 768px, tableta 768–1024px, escritorio > 1024px), every text element SHALL have a computed font size of at least 16 pixels and the page SHALL not require horizontal scrolling.

**Validates: Requirements 14.2, 20.6**

### Property 9: No DOM reordering across breakpoints

*For any* page, the order of content in the document and the heading hierarchy SHALL be identical at mobile, tableta, and desktop widths (responsive changes SHALL be purely visual via CSS, never via reordering the DOM).

**Validates: Requirements 14.4**

### Property 10: Tap target minimum size

*For any* interactive element (button or link) on any page, its rendered tap target area SHALL be at least 44 by 44 pixels on touch devices.

**Validates: Requirements 14.5**

### Property 11: Meta tag length and distinctness

*For any* page, the meta-title SHALL be at most 60 characters and the meta-description SHALL be at most 160 characters; and across the four pages all meta-titles SHALL be pairwise distinct and all meta-descriptions SHALL be pairwise distinct.

**Validates: Requirements 15.1, 15.3**

### Property 12: Heading hierarchy validity

*For any* page, there SHALL be exactly one H1 heading, and *for any* heading of level N greater than 1, a heading of level N-1 SHALL appear earlier in document order.

**Validates: Requirements 15.5**

### Property 13: HTTP to HTTPS redirect preserves path and query

*For any* path and *for any* query string, an HTTP request to that path SHALL redirect to the HTTPS URL with the identical path and identical query string.

**Validates: Requirements 17.2**

### Property 14: No mixed content

*For any* resource reference (`src` or `href` attribute) on any page, the referenced URL SHALL use the HTTPS scheme or be protocol-relative or relative; no resource SHALL be loaded over plain HTTP.

**Validates: Requirements 17.4**

### Property 15: Image file size optimization

*For any* image asset referenced by the site, the file size SHALL be at most 200 KB and its display resolution SHALL be at least 72 ppi.

**Validates: Requirements 18.2**

### Property 16: Maximum HTTP requests per page

*For any* page, the total number of HTTP requests triggered on load SHALL be at most 50.

**Validates: Requirements 18.4**

### Property 17: Image alt reflects role

*For any* image on any page, the `alt` attribute SHALL be present and non-empty if the image is informative, and SHALL be present and empty if the image is decorative.

**Validates: Requirements 19.1, 19.8**

### Property 18: Color contrast thresholds

*For any* text element on any page, the contrast ratio between the text color and its background SHALL be at least 4.5 to 1 when the font size is less than 24 pixels, and at least 3 to 1 when the font size is 24 pixels or greater.

**Validates: Requirements 19.2**

### Property 19: Keyboard reachability and no focus traps

*For any* interactive element on any page, it SHALL be reachable by keyboard in an order matching the document reading order, and *for any* interactive component, keyboard focus SHALL be able to enter and leave the component without being trapped.

**Validates: Requirements 19.3, 19.6**

### Property 20: Form field label association

*For any* form field in the contact form, an associated label SHALL exist via the `for` attribute of a `label` element pointing to the field's `id`, or via an ARIA labeling attribute.

**Validates: Requirements 19.5**

### Property 21: Palette color usage

*For any* color value used in the styling of any page, the color SHALL be a member of the defined institutional palette of Soluctech; no color outside the palette SHALL be used.

**Validates: Requirements 20.1**

### Property 22: Font family count and consistency

*For any* page, the set of font families used SHALL have size at most two, and the set of font families SHALL be identical across all four pages.

**Validates: Requirements 20.2**

## Testing Strategy

El sitio adopta un enfoque de pruebas dual: **pruebas basadas en propiedades (PBT)** para verificar invariantes universales sobre entradas generadas aleatoriamente, y **pruebas basadas en ejemplos** (unitarias, de integración y smoke) para escenarios concretos, puntos de integración y configuración.

### Pruebas basadas en propiedades (PBT)

Las propiedades formales se definen en la sección *Correctness Properties* anterior. Cada prueba de propiedad:

- Ejecuta un mínimo de **100 iteraciones** por propiedad, debido a la aleatorización.
- Hace referencia a la propiedad del documento de diseño mediante la etiqueta `Feature: soluctech-corporate-website, Property <n>: <texto>`.
- Se enfoca en **funciones puras** (validadores del formulario) e **invariantes estructurales** iterando sobre el conjunto finito de páginas y elementos del DOM.

**Objetivos principales de PBT:**

- `isValidEmail`, `isValidPhone`, `isWithinLimit`, `validateForm`: funciones puras con un espacio de entrada grande (cadenas arbitrarias). La variación de entrada revela casos límite (múltiples `@`, partes vacías, caracteres no permitidos, longitudes extremas).
- Invariantes de estructura: recorrido de las 4 páginas y validación de jerarquía de encabezados, longitud de meta tags, paleta de colores, número de familias tipográficas y asociación de etiquetas de formulario.

**Uso de mocks:** las propiedades que involucran el envío del formulario (`submitForm`) usan mocks de `fetch` para aislar la lógica de validación de la red, manteniendo el costo bajo.

### Pruebas unitarias basadas en ejemplos

Complementan las PBT con escenarios concretos y casos límite específicos:

- **Validadores de formulario:** ejemplos concretos de correos válidos/inválidos, teléfonos válidos/inválidos, cadenas en el límite exacto de `maxlength`.
- **Puntos de integración entre componentes:** alternar el menú hamburguesa y verificar `aria-expanded`; expandir/colapsar un ítem FAQ y verificar la visibilidad del panel.
- **Casos límite y errores:** envío con todos los campos vacíos (6 errores esperados); teléfono vacío (sin error); correo con múltiples `@`.

### Pruebas de integración

Verifican la interacción con servicios externos con 1–3 ejemplos representativos (no PBT):

- **Envío del formulario a Formspree/FormSubmit:** mock o entorno de prueba del endpoint; verificar que el payload JSON contiene los 7 campos y que una respuesta 2xx resetea el formulario y muestra confirmación.
- **Error de red:** simular un fallo de `fetch` y verificar que los datos se conservan y se muestra el mensaje de error.
- **Navegación entre páginas:** verificar que los enlaces del header y footer dirigen a las páginas correctas.

### Pruebas smoke (configuración y arranque)

Verificaciones de una sola ejecución para configuración e infraestructura (no PBT):

- **Renderizado de páginas:** cada una de las 4 páginas carga sin errores de consola y contiene su H1 único.
- **Recursos estáticos:** `styles.css`, `main.js`, `logo-soluctech.svg` cargan con HTTP 200.
- **SEO/infra:** `sitemap.xml` lista exactamente 4 URLs; `robots.txt` referencia el sitemap; el snippet de Google Analytics 4 está presente.
- **HTTPS/redirección:** (en entorno desplegado) verificar la redirección de HTTP a HTTPS (Req 17.2) y ausencia de contenido mixto (Req 17.4).

### Cobertura de criterios no testables como propiedad

Los criterios clasificados como EXAMPLE, EDGE_CASE, INTEGRATION o SMOKE en el prework se cubren con las pruebas unitarias, de integración y smoke descritas arriba, y no se duplican como propiedades.
