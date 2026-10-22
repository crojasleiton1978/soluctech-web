**&#xA0;Plan de Implementación: Soluctech Corporate Website**



**## Overview**



El sitio es un sitio \*\*estático multipágina\*\* (HTML5 + CSS3 + JavaScript vainilla, sin framework ni build) compuesto por cuatro páginas (Inicio, Servicios, Nosotros, Contacto), una hoja de estilos global (\`css/styles.css\`), un script global (\`js/main.js\`), assets y archivos de SEO/infraestructura.



El plan sigue el orden de implementación: scaffold y assets → sistema de diseño CSS → componentes compartidos (header/footer) → las cuatro páginas → JavaScript (menú, acordeón, validación y envío del formulario) → SEO e infraestructura. Las pruebas basadas en propiedades (PBT) se ubican como sub-tareas junto a la implementación que validan, según las 22 propiedades del documento de diseño. Las pruebas unitarias, de integración y smoke las complementan.



**## Tasks**



\- [ ] 1. Estructura del proyecto, archivos base y assets

  - [ ] 1.1 Crear la estructura de directorios, archivos base y configuración de pruebas

    - Crear carpetas \`css/\`, \`js/\`, \`assets/\`, \`tests/\`

    - Crear \`css/styles.css\` y \`js/main.js\` vacíos

    - Configurar framework de pruebas (Vitest + jsdom para pruebas de funciones puras y de DOM; opción de Playwright para smoke de páginas)

    - Crear \`package.json\` y configuración del runner con \`--run\` (ejecución única, no watch)

    - *\_Requisitos: 1.1\_*

  - [ ] 1.2 Crear assets: logotipo SVG e imagen Open Graph

    - Crear \`assets/logo-soluctech.svg\` (logotipo vectorial institucional)

    - Crear \`assets/og-cover.jpg\` (placeholder de imagen Open Graph, a optimizar a ≤ 200 KB / ≥ 72 ppi)

    - *\_Requisitos: 1.3, 2.5, 20.3\_*

  - [ ]\* 1.3 Escribir prueba de propiedad: optimización del tamaño de imagen

    - \*\*Propiedad 15: Image file size optimization\*\*

    - \*\*Valida: Requisitos 18.2\*\*



\- [ ] 2. Sistema de diseño CSS y estilos base

  - [ ] 2.1 Definir design tokens (custom properties) y estilos base

    - Paleta institucional como únicos colores permitidos, máximo 2 familias tipográficas, tamaño de cuerpo mínimo 16px, tokens de espaciado y layout

    - Estilos base (reset ligero, tipografía, contenedores, foco visible \`:focus-visible\`)

    - *\_Requisitos: 14.2, 20.1, 20.2, 20.6\_*

  - [ ] 2.2 Implementar layout responsivo mobile-first y componentes reutilizables

    - Breakpoints en 768px (tableta) y 1024px (escritorio); cambios solo visuales vía CSS, nunca reordenando el DOM

    - Clases compartidas: \`.btn\`/\`.btn--primary\`, \`.card\`/\`.card__title\`/\`.card__body\`, \`.section\`, header/nav/footer, formulario y FAQ

    - Objetivos táctiles mínimos 44×44px; metodología en columna en móvil y fila en escritorio

    - *\_Requisitos: 14.1, 14.4, 14.5, 19.7, 20.4, 20.5\_*

  - [ ]\* 2.3 Escribir prueba de propiedad: uso exclusivo de la paleta institucional

    - \*\*Propiedad 21: Palette color usage\*\*

    - \*\*Valida: Requisitos 20.1\*\*

  - [ ]\* 2.4 Escribir prueba de propiedad: cantidad y consistencia de familias tipográficas

    - \*\*Propiedad 22: Font family count and consistency\*\*

    - \*\*Valida: Requisitos 20.2\*\*

  - [ ]\* 2.5 Escribir prueba de propiedad: tamaño mínimo de fuente y sin desbordamiento horizontal

    - \*\*Propiedad 8: Minimum font size and no horizontal overflow across breakpoints\*\*

    - \*\*Valida: Requisitos 14.2, 20.6\*\*

  - [ ]\* 2.6 Escribir prueba de propiedad: umbrales de contraste de color

    - \*\*Propiedad 18: Color contrast thresholds\*\*

    - \*\*Valida: Requisitos 19.2\*\*

  - [ ]\* 2.7 Escribir prueba de propiedad: tamaño mínimo de objetivo táctil

    - \*\*Propiedad 10: Tap target minimum size\*\*

    - \*\*Valida: Requisitos 14.5\*\*

  - [ ]\* 2.8 Escribir prueba de propiedad: sin reordenamiento del DOM entre breakpoints

    - \*\*Propiedad 9: No DOM reordering across breakpoints\*\*

    - \*\*Valida: Requisitos 14.4\*\*



\- [ ] 3. Componentes compartidos (header y footer)

  - [ ] 3.1 Construir el header y footer compartidos en las cuatro páginas

    - Header sticky con logotipo (enlace a \`index.html\`), menú principal a las 4 páginas, CTA diferenciado hacia \`contacto.html\` y botón hamburguesa con ARIA (\`aria-expanded\`/\`aria-controls\`, visible < 768px)

    - Footer con nombre de empresa, dominio \`www\.soluctech.cl\`, correo de contacto y enlaces a las 4 páginas

    - Establecer el shell HTML base (doctype, \`\<head>\` con meta placeholders, \`\<main>\` vacío) en \`index.html\`, \`servicios.html\`, \`nosotros.html\`, \`contacto.html\`

    - *\_Requisitos: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8\_*

  - [ ]\* 3.2 Escribir prueba de propiedad: el \`alt\` refleja el rol de la imagen

    - \*\*Propiedad 17: Image alt reflects role\*\*

    - \*\*Valida: Requisitos 19.1, 19.8\*\*



\- [ ] Checkpoint — componentes base y sistema de diseño listos

  - Ensure all tests pass, ask the user if questions arise.



\- [ ] 4. Página de Inicio (index.html)

  - [ ] 4.1 Implementar todas las secciones de la página de inicio

    - \*\*Hero\*\*: H1 exacto "SOLUCTECH — Transformando desafíos en soluciones tecnológicas", H2 exacto, texto descriptivo exacto del Req 2.3, botón CTA "Agenda una conversación inicial" → \`contacto.html\` (visible sin desplazamiento)

    - \*\*Nuestro Enfoque\*\*: 4 pilares en orden (Entender el desafío, Priorizar oportunidades, Definir hoja de ruta, Acompañar resultados) con descripciones; sin scroll horizontal a 375px

    - \*\*Resumen de portafolio\*\*: 6 tarjetas clicables (nombre + descripción ≤ 150 caracteres), en orden, enlazando a \`servicios.html#\<anchor>\`

    - \*\*Modalidades\*\*: 3 tarjetas (Diagnóstico Ejecutivo, Proyecto Específico, Asesoría Recurrente) con descripciones; sin truncar a 375px

    - \*\*Metodología\*\*: 5 pasos en orden (Descubrimiento, Diagnóstico, Propuesta, Ejecución, Cierre), descripciones de 10–150 caracteres; fila en escritorio, columna en móvil

    - CTA adicional hacia \`contacto.html\`

    - *\_Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 21.1, 21.4\_*

  - [ ]\* 4.2 Escribir prueba de propiedad: longitud de la descripción de tarjeta de servicio

    - \*\*Propiedad 1: Service card description length\*\*

    - \*\*Valida: Requisitos 4.2\*\*

  - [ ]\* 4.3 Escribir prueba de propiedad: longitud de la descripción de paso de metodología

    - \*\*Propiedad 2: Methodology step description length\*\*

    - \*\*Valida: Requisitos 6.3\*\*



\- [ ] 5. Página de Servicios (servicios.html)

  - [ ] 5.1 Implementar las 6 fichas de servicios con detalle completo y CTA

    - 6 \`\<article>\` con \`id\` (ancla), en orden exacto; cada ficha con número, nombre, texto de presentación y bullets de alcance

    - Incluir entregables y notas aclaratorias cuando el catálogo los define (Consultoría TI: entregables; IA: 3 fases + nota; Ciberseguridad: nota; etc.)

    - CTA "agendar una conversación inicial" → \`contacto.html\`

    - *\_Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 21.2\_*



\- [ ] 6. Página Nosotros (nosotros.html)

  - [ ] 6.1 Implementar identidad, metodología, enfoque, liderazgo, valores y CTA

    - Propuesta de valor (texto Req 9.1); Metodología de 5 pasos con nombre y descripción; Enfoque de 4 pilares con nombre y descripción; modalidad de atención remota y presencial

    - Sección "Liderazgo Ejecutivo" con exactamente 2 integrantes visibles simultáneamente: Macarena Herrera R. (Gerente General) y Carlos Rojas L. (Consultor TI Principal)

    - Sección de Valores con mínimo 4 valores (título + descripción cada uno)

    - CTA "agendar una conversación inicial" → \`contacto.html\`

    - *\_Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 11.1, 11.2, 21.3\_*

  - [ ]\* 6.2 Escribir prueba de propiedad: estructura de valores corporativos

    - \*\*Propiedad 3: Corporate values structure\*\*

    - \*\*Valida: Requisitos 11.1\*\*



\- [ ] 7. Página de Contacto (contacto.html)

  - [ ] 7.1 Implementar formulario, datos de contacto, FAQ y CTA

    - \*\*Formulario\*\* (7 campos): Nombre, Empresa, Correo, Teléfono (opcional), Servicio (select de 6), Modalidad preferida (select de 3), Mensaje; con \`maxlength\`, \`required\`, \`\<label for>\`, \`role="alert"\` por campo, \`novalidate\`

    - \*\*Datos de contacto directo\*\*: correo \`crojasleiton\@gmail.com\` como texto y enlace \`mailto:\`; nombres y cargos de los responsables

    - \*\*FAQ\*\* (acordeón): propósito de la reunión de descubrimiento (sin costo ni obligación) y las 3 modalidades; semántica ARIA (\`aria-expanded\`/\`aria-controls\`)

    - \*\*CTA\*\* que dirija al formulario

    - *\_Requisitos: 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 19.5\_*

  - [ ]\* 7.2 Escribir prueba de propiedad: límites de longitud de campos de texto

    - \*\*Propiedad 4: Text field length constraints\*\*

    - \*\*Valida: Requisitos 12.1, 12.12\*\*

  - [ ]\* 7.3 Escribir prueba de propiedad: asociación de etiquetas de campos de formulario

    - \*\*Propiedad 20: Form field label association\*\*

    - \*\*Valida: Requisitos 19.5\*\*



\- [ ] Checkpoint — páginas y formulario HTML listos

  - Ensure all tests pass, ask the user if questions arise.



\- [ ] 8. JavaScript (js/main.js)

  - [ ] 8.1 Implementar el menú hamburguesa y el acordeón FAQ

    - \`toggleMobileNav\`: alternar \`aria-expanded\`, visibilidad de los enlaces y \`aria-label\` del botón

    - \`toggleFaqItem\`: alternar \`aria-expanded\` y \`hidden\` del panel del acordeón

    - Cablear los listeners al cargar el DOM

    - *\_Requisitos: 1.7, 13.3\_*

  - [ ] 8.2 Implementar los validadores puros del formulario

    - \`isValidEmail\` (exactamente un \`@\`, parte local no vacía, dominio con punto y partes no vacías), \`isValidPhone\` (solo dígitos/espacios y \`+ - ( )\`, vacío permitido), \`isWithinLimit\` y \`validateForm\` (errores por campo obligatorio vacío, formato y longitud)

    - Exportar las funciones puras para pruebas

    - *\_Requisitos: 12.8, 12.9, 12.10, 12.12\_*

  - [ ]\* 8.3 Escribir prueba de propiedad: validación de campos obligatorios vacíos

    - \*\*Propiedad 5: Required-field empty validation\*\*

    - \*\*Valida: Requisitos 12.8\*\*

  - [ ]\* 8.4 Escribir prueba de propiedad: validación de formato de correo

    - \*\*Propiedad 6: Email format validation\*\*

    - \*\*Valida: Requisitos 12.9\*\*

  - [ ]\* 8.5 Escribir prueba de propiedad: validación de formato de teléfono

    - \*\*Propiedad 7: Phone format validation\*\*

    - \*\*Valida: Requisitos 12.10\*\*

  - [ ] 8.6 Implementar el envío del formulario (submitForm + orquestador)

    - \`submitForm\` vía \`fetch\` (JSON) al endpoint de Formspree/FormSubmit; éxito → mensaje de confirmación y reset; fallo HTTP/red → mensaje de error y conservación de los datos

    - Orquestador: leer el formulario, ejecutar \`validateForm\`, mostrar errores por campo, enviar y manejar \`#form-status\`

    - *\_Requisitos: 12.6, 12.7, 12.11\_*

  - [ ]\* 8.7 Escribir prueba de propiedad: alcanzabilidad por teclado y sin trampas de foco

    - \*\*Propiedad 19: Keyboard reachability and no focus traps\*\*

    - \*\*Valida: Requisitos 19.3, 19.6\*\*

  - [ ]\* 8.8 Escribir pruebas unitarias basadas en ejemplos para los validadores

    - Casos concretos de correos válidos/inválidos, teléfonos válidos/inválidos y cadenas en el límite exacto de \`maxlength\`

    - *\_Requisitos: 12.8, 12.9, 12.10, 12.12\_*

  - [ ]\* 8.9 Escribir pruebas de integración del envío del formulario

    - Mock de \`fetch\`: respuesta 2xx resetea el formulario y muestra confirmación; fallo conserva los datos y muestra error de red

    - *\_Requisitos: 12.6, 12.7, 12.11\_*



\- [ ] 9. SEO e infraestructura

  - [ ] 9.1 Configurar meta tags por página (title, description, Open Graph)

    - \`meta-title\` ≤ 60 caracteres y distinto por página; el de Inicio exacto "SOLUCTECH — Consultoría TI, IA y Ciberseguridad en Chile"

    - \`meta-description\` ≤ 160 caracteres, distinta por página, mencionando el tema principal de cada página

    - Open Graph (\`og:title\`, \`og:description\`, \`og:type\`, \`og:url\`, \`og:image\`)

    - *\_Requisitos: 15.1, 15.2, 15.3, 15.4\_*

  - [ ]\* 9.2 Escribir prueba de propiedad: longitud y distinción de meta tags

    - \*\*Propiedad 11: Meta tag length and distinctness\*\*

    - \*\*Valida: Requisitos 15.1, 15.3\*\*

  - [ ]\* 9.3 Escribir prueba de propiedad: validez de la jerarquía de encabezados

    - \*\*Propiedad 12: Heading hierarchy validity\*\*

    - \*\*Valida: Requisitos 15.5\*\*

  - [ ] 9.4 Crear sitemap.xml y robots.txt

    - \`sitemap.xml\` con exactamente las 4 URLs; \`robots.txt\` que permita el rastreo y referencie el sitemap

    - *\_Requisitos: 15.6, 16.1\_*

  - [ ] 9.5 Integrar Google Analytics 4 y verificación de Google Search Console

    - Snippet de GA4 (\`gtag\`) con \`async\`/\`defer\` en las 4 páginas; meta \`google-site-verification\` (placeholder)

    - *\_Requisitos: 16.2, 16.3, 16.4\_*

  - [ ] 9.6 Configurar la redirección HTTP→HTTPS y prevenir contenido mixto

    - Archivo de configuración de redirección forzada a HTTPS (p. ej. \`\_redirects\`/\`netlify.toml\`/\`.htaccess\`) preservando ruta y query

    - Asegurar que todos los recursos (scripts, hojas de estilo, imágenes, multimedia) se carguen vía HTTPS

    - *\_Requisitos: 17.1, 17.2, 17.3, 17.4\_*

  - [ ]\* 9.7 Escribir prueba de propiedad: la redirección HTTP→HTTPS preserva ruta y query

    - \*\*Propiedad 13: HTTP to HTTPS redirect preserves path and query\*\*

    - \*\*Valida: Requisitos 17.2\*\*

  - [ ]\* 9.8 Escribir prueba de propiedad: ausencia de contenido mixto

    - \*\*Propiedad 14: No mixed content\*\*

    - \*\*Valida: Requisitos 17.4\*\*

  - [ ]\* 9.9 Escribir prueba de propiedad: máximo de solicitudes HTTP por página

    - \*\*Propiedad 16: Maximum HTTP requests per page\*\*

    - \*\*Valida: Requisitos 18.4\*\*

  - [ ]\* 9.10 Escribir pruebas smoke de configuración y arranque

    - Cada una de las 4 páginas carga sin errores de consola y contiene su H1 único; \`styles.css\`, \`main.js\` y el logo cargan con HTTP 200; \`sitemap.xml\` lista 4 URLs y \`robots.txt\` referencia el sitemap; el snippet de GA4 está presente

    - *\_Requisitos: 15.6, 16.1, 16.2, 16.3\_*



\- [ ] Checkpoint final — integración, smoke tests y consistencia transversal

  - Ensure all tests pass, ask the user if questions arise.



**## Notes**



\- Las sub-tareas marcadas con \`\*\` son opcionales (pruebas) y pueden omitirse para un MVP más rápido; las sub-tareas sin \`\*\` son obligatorias.

\- Cada sub-tarea referencia los requisitos específicos que cubre para trazabilidad.

\- Los checkpoints validan de forma incremental; ante dudas, consultar al usuario.

\- Las pruebas de propiedad (PBT) validan invariantes universales; se ejecutan con un mínimo de 100 iteraciones y referencian la propiedad del diseño (\`Feature: soluctech-corporate-website, Property N\`).

\- Las pruebas unitarias, de integración y smoke complementan las PBT con escenarios concretos, puntos de integración y verificaciones de configuración.

\- Las pruebas de redirección HTTPS (Propiedad 13) y de rendimiento en despliegue requieren un entorno publicado; se marcan como smoke opcionales.

\- Para un sitio estático, el header y footer se replican en cada página; la consistencia se garantiza con las clases BEM-like compartidas y los design tokens.

\- Las pruebas basadas en propiedades de estructura iteran sobre el conjunto finito de 4 páginas y sus elementos.



**## Task Dependency Graph**



\`\`\`json

{

  "waves": [

    { "id": 0, "tasks": ["1.1"] },

    { "id": 1, "tasks": ["1.2", "2.1", "9.4", "9.6"] },

    { "id": 2, "tasks": ["2.2", "3.1", "1.3", "9.7"] },

    { "id": 3, "tasks": ["4.1", "5.1", "6.1", "7.1"] },

    { "id": 4, "tasks": ["8.1", "9.1", "4.2", "4.3", "6.2", "7.2", "7.3", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "3.2", "9.8", "9.9"] },

    { "id": 5, "tasks": ["8.2", "9.5", "9.2", "9.3"] },

    { "id": 6, "tasks": ["8.6", "8.3", "8.4", "8.5", "8.8", "9.10"] },

    { "id": 7, "tasks": ["8.7", "8.9"] }

  ]

}

\`\`\`