# Requirements Document

## Introduction

Soluctech es una consultora tecnológica chilena enfocada en transformar desafíos empresariales en soluciones digitales con impacto real. Este documento define los requerimientos para el desarrollo y publicación del sitio web oficial www.soluctech.cl, un sitio corporativo moderno, profesional y responsivo que presenta la propuesta de valor, el catálogo de seis servicios, la metodología de trabajo y los canales de contacto de la empresa.

El sitio web consta de cuatro páginas principales: Inicio, Servicios, Nosotros y Contacto. El sitio debe respetar la identidad institucional (colores, logotipo y tipografías), ser responsivo en dispositivos móviles, tabletas y escritorio, cumplir con buenas prácticas de SEO para indexación en Google y ofrecer una experiencia de usuario fluida que facilite la generación de leads a través del formulario de contacto.

## Glossary

- **Sitio_Web**: El sitio web oficial de Soluctech publicado en www.soluctech.cl, compuesto por cuatro páginas principales.
- **Navegación**: El sistema de menú y enlaces que permite al visitante moverse entre las páginas del Sitio_Web.
- **Página_Inicio**: La página de aterrizaje principal del Sitio_Web, que presenta la propuesta de valor, el enfoque, el resumen de servicios, las modalidades de contratación, la metodología y un llamado a la acción.
- **Página_Servicios**: La página del Sitio_Web que presenta el detalle completo del catálogo de seis servicios tecnológicos de Soluctech.
- **Página_Nosotros**: La página del Sitio_Web que presenta la identidad corporativa, la metodología, el equipo directivo y los valores de Soluctech.
- **Página_Contacto**: La página del Sitio_Web que contiene el formulario web estructurado, los datos de contacto directo y las preguntas frecuentes.
- **Hero**: La sección de encabezado superior de la Página_Inicio que contiene el título principal H1, el subtítulo H2, el texto descriptivo y el botón de llamado a la acción principal.
- **Enfoque**: El conjunto de cuatro pilares que describen la metodología de trabajo de Soluctech: Entender el desafío, Priorizar oportunidades, Definir hoja de ruta y Acompañar resultados.
- **Servicios**: El catálogo de seis servicios tecnológicos de Soluctech: Consultoría TI, Inteligencia Artificial y Automatización, Gestión de Proyectos TI, Ciberseguridad, Desarrollo de Software a Medida y QA y Aseguramiento de Calidad.
- **Modalidades**: Las tres modalidades de contratación de Soluctech: Diagnóstico Ejecutivo, Proyecto Específico y Asesoría Recurrente.
- **Metodología**: El proceso de trabajo de cinco pasos de Soluctech: Descubrimiento, Diagnóstico, Propuesta, Ejecución y Cierre.
- **Formulario_Contacto**: El formulario web estructurado de la Página_Contacto que recopila los datos del interesado.
- **CTA**: El llamado a la acción que invita al visitante a agendar una conversación inicial con Soluctech.
- **SEO**: Las prácticas de optimización para motores de búsqueda aplicadas al Sitio_Web para mejorar su indexación y visibilidad en Google.
- **Responsive**: La capacidad del Sitio_Web de adaptar su diseño y contenido a diferentes tamaños de pantalla y dispositivos.
- **Meta_Tag**: Las etiquetas de metadatos HTML (meta-title y meta-description) configuradas en cada página del Sitio_Web para SEO.
- **Sitemap**: El archivo sitemap.xml que enumera las URLs del Sitio_Web para facilitar la indexación en buscadores.

## Requirements

### Requirement 1: Arquitectura del Sitio y Navegación Global

**User Story:** Como visitante del sitio, quiero navegar fácilmente entre las secciones del sitio web, para encontrar la información que busco de forma rápida e intuitiva.

#### Acceptance Criteria

1. THE Sitio_Web SHALL estar compuesto por cuatro páginas principales: Página_Inicio, Página_Servicios, Página_Nosotros y Página_Contacto.
2. THE Navegación SHALL mostrar un menú principal fijo en la cabecera con enlaces a las cuatro páginas en todas las páginas del Sitio_Web.
3. THE Navegación SHALL mostrar el logotipo de Soluctech en la cabecera en todas las páginas del Sitio_Web.
4. WHEN el usuario haga clic en el logotipo de Soluctech, THE Navegación SHALL redirigir a la Página_Inicio.
5. THE Navegación SHALL incluir un enlace de CTA distinguido visualmente de los demás enlaces del menú principal mediante un estilo diferenciado, que dirija a la Página_Contacto.
6. WHILE el ancho de pantalla sea menor a 768 píxeles, THE Navegación SHALL mostrar un menú tipo hamburguesa en lugar del menú horizontal.
7. WHEN el usuario haga clic en el icono del menú tipo hamburguesa, THE Navegación SHALL alternar la visibilidad de los enlaces a las cuatro páginas principales.
8. THE Sitio_Web SHALL incluir un pie de página presente en las cuatro páginas con el nombre de la empresa, el dominio www.soluctech.cl, el correo de contacto y enlaces a las cuatro páginas principales.

### Requirement 2: Página de Inicio — Hero y Propuesta de Valor

**User Story:** Como visitante que llega al sitio, quiero ver de inmediato la propuesta de valor de Soluctech, para entender qué ofrece la empresa en los primeros segundos.

#### Acceptance Criteria

1. THE Página_Inicio SHALL mostrar una sección Hero como primera sección de la página, visible en la ventana del navegador al cargar la página sin requerir desplazamiento, con un título H1 con el texto "SOLUCTECH — Transformando desafíos en soluciones tecnológicas".
2. THE Página_Inicio SHALL mostrar un subtítulo H2 en la sección Hero con el texto "Tecnología conectada con los objetivos de tu negocio".
3. THE Página_Inicio SHALL mostrar un texto descriptivo en la sección Hero con el texto exacto: "Apoyamos a empresas que necesitan tomar mejores decisiones tecnológicas, modernizar procesos y ejecutar iniciativas digitales con una mirada estratégica y práctica."
4. THE Página_Inicio SHALL mostrar un botón de CTA principal en la sección Hero con el texto "Agenda una conversación inicial" que dirija a la Página_Contacto.
5. THE Página_Inicio SHALL utilizar la paleta de colores institucionales de Soluctech y mostrar el logotipo de Soluctech definido en el catálogo de servicios en la sección Hero.

### Requirement 3: Página de Inicio — Enfoque de 4 Pilares

**User Story:** Como visitante, quiero conocer el enfoque de trabajo de Soluctech, para entender cómo la empresa aborda los desafíos tecnológicos.

#### Acceptance Criteria

1. THE Página_Inicio SHALL mostrar una sección titulada "Nuestro Enfoque" que presente los cuatro pilares del Enfoque de Soluctech.
2. THE Página_Inicio SHALL presentar los cuatro pilares en el siguiente orden: "Entender el desafío", "Priorizar oportunidades", "Definir hoja de ruta" y "Acompañar resultados".
3. THE Página_Inicio SHALL mostrar una descripción para cada pilar del Enfoque según los textos del documento de especificaciones.
4. THE Página_Inicio SHALL mostrar los cuatro pilares en una disposición visual de tarjetas o columnas que, en un ancho de viewport de 375px, mantenga todo el contenido de cada pilar visible dentro del área de visualización sin requerir desplazamiento horizontal.

### Requirement 4: Página de Inicio — Resumen de Portafolio de Servicios

**User Story:** Como visitante, quiero ver un resumen de los servicios que ofrece Soluctech, para tener una visión general del portafolio tecnológico.

#### Acceptance Criteria

1. THE Página_Inicio SHALL mostrar una sección de resumen del portafolio que presente los seis Servicios de Soluctech.
2. THE Página_Inicio SHALL presentar los seis Servicios como tarjetas seleccionables mediante clic, cada una mostrando el nombre del servicio y una descripción de máximo 150 caracteres.
3. THE Página_Inicio SHALL mostrar los seis Servicios en el siguiente orden: Consultoría TI, Inteligencia Artificial y Automatización, Gestión de Proyectos TI, Ciberseguridad, Desarrollo de Software a Medida y QA y Aseguramiento de Calidad.
4. WHEN el visitante haga clic en una tarjeta de servicio, THE Sitio_Web SHALL redirigir a la sección correspondiente de ese servicio en la Página_Servicios y mostrar dicha sección al visitante.

### Requirement 5: Página de Inicio — Modalidades de Contratación

**User Story:** Como visitante, quiero conocer las modalidades de contratación disponibles, para entender las opciones para trabajar con Soluctech.

#### Acceptance Criteria

1. THE Página_Inicio SHALL mostrar una sección que presente las tres Modalidades de contratación de Soluctech.
2. THE Página_Inicio SHALL presentar las tres Modalidades en el siguiente orden: Diagnóstico Ejecutivo, Proyecto Específico y Asesoría Recurrente.
3. THE Página_Inicio SHALL mostrar una descripción para cada Modalidad según los textos del documento de especificaciones.
4. WHILE la página se visualice en un dispositivo con un ancho de visualización de 375 píxeles, THE Página_Inicio SHALL mostrar las tres Modalidades en tarjetas que se ajusten al ancho de la pantalla sin requerir desplazamiento horizontal y sin truncar el texto de la descripción de cada Modalidad.

### Requirement 6: Página de Inicio — Metodología en 5 Pasos

**User Story:** Como visitante, quiero entender la metodología de trabajo de Soluctech, para conocer el proceso que seguiré al contratar sus servicios.

#### Acceptance Criteria

1. THE Página_Inicio SHALL mostrar una sección con un encabezado que la identifique como la Metodología, donde se presenten los cinco pasos de la Metodología de Soluctech.
2. THE Página_Inicio SHALL presentar los cinco pasos de la Metodología en el siguiente orden: Descubrimiento, Diagnóstico, Propuesta, Ejecución y Cierre.
3. THE Página_Inicio SHALL mostrar, para cada uno de los cinco pasos de la Metodología, una descripción de entre 10 y 150 caracteres que reproduzca el texto definido para ese paso en la sección "Cómo trabajamos" del Catálogo de Servicios de Soluctech.
4. IF la Página_Inicio se visualice en una pantalla de escritorio, THEN THE Página_Inicio SHALL mostrar los cinco pasos en una disposición visual secuencial de izquierda a derecha.
5. IF la Página_Inicio se visualice en una pantalla móvil, THEN THE Página_Inicio SHALL mostrar los cinco pasos en una disposición visual secuencial de arriba a abajo.

### Requirement 7: Página de Servicios — Catálogo Completo

**User Story:** Como visitante interesado en los servicios, quiero ver el detalle completo de cada servicio, para evaluar si Soluctech cubre mis necesidades tecnológicas.

#### Acceptance Criteria

1. THE Página_Servicios SHALL mostrar exactamente seis fichas, una por cada Servicio del catálogo de Soluctech.
2. THE Página_Servicios SHALL presentar las seis fichas en el siguiente orden: Consultoría TI y Dirección Tecnológica Externa, Inteligencia Artificial y Automatización, Gestión de Proyectos TI, Ciberseguridad y Seguridad de la Información, Desarrollo de Software a Medida y QA y Aseguramiento de Calidad de Software.
3. THE Página_Servicios SHALL mostrar en cada ficha el número, el nombre del Servicio y un texto descriptivo de presentación del Servicio que precede a los bullets de alcance, según los textos del catálogo de servicios.
4. THE Página_Servicios SHALL mostrar en cada ficha una lista de bullets con el alcance del Servicio correspondiente según los textos del catálogo de servicios.
5. IF el documento de especificaciones define entregables para un Servicio, THEN THE Página_Servicios SHALL mostrar dichos entregables en la ficha correspondiente.
6. IF el documento de especificaciones define notas aclaratorias para un Servicio, THEN THE Página_Servicios SHALL mostrar dichas notas en la ficha correspondiente.

### Requirement 8: Página de Servicios — Detalle por Servicio

**User Story:** Como visitante, quiero acceder al detalle de cada servicio individualmente, para profundizar en el servicio específico que me interesa.

#### Acceptance Criteria

1. WHEN el visitante accede al detalle del Servicio de Consultoría TI y Dirección Tecnológica Externa, THE Página_Servicios SHALL mostrar los siguientes puntos de alcance: diagnóstico tecnológico y matriz de riesgos, plan estratégico TI y hoja de ruta, gobierno TI con KPIs y evaluación de proveedores, y asesoría externa de dirección TI bajo alcance mensual.
2. WHEN el visitante accede al detalle del Servicio de Consultoría TI y Dirección Tecnológica Externa, THE Página_Servicios SHALL mostrar los entregables del servicio: informe ejecutivo, matriz de prioridades y plan de acción.
3. WHEN el visitante accede al detalle del Servicio de Inteligencia Artificial y Automatización, THE Página_Servicios SHALL mostrar las tres fases con sus descripciones: Identificar — levantamiento de procesos y selección de casos de uso tangibles; Evaluar — factibilidad, seguridad, calidad de datos y retorno esperado; Planificar — hoja de ruta, indicadores y plan de gestión del cambio.
4. WHEN el visitante accede al detalle del Servicio de Inteligencia Artificial y Automatización, THE Página_Servicios SHALL mostrar la nota aclaratoria indicando que la implementación y el desarrollo están sujetos a cotización específica.
5. WHEN el visitante accede al detalle del Servicio de Gestión de Proyectos TI, THE Página_Servicios SHALL mostrar los siguientes puntos de alcance: planificación y control de hitos con PMO ejecutiva, control de riesgos, alcance y presupuesto, y coordinación de equipos internos y proveedores.
6. WHEN el visitante accede al detalle del Servicio de Ciberseguridad y Seguridad de la Información, THE Página_Servicios SHALL mostrar los siguientes puntos: diagnóstico de controles y detección de brechas, evaluación de riesgos y recomendaciones de políticas, y planes de mejora continua y continuidad operativa.
7. WHEN el visitante accede al detalle del Servicio de Ciberseguridad y Seguridad de la Información, THE Página_Servicios SHALL mostrar la nota aclaratoria indicando que las evaluaciones y recomendaciones no sustituyen auditorías o certificaciones formales.
8. WHEN el visitante accede al detalle del Servicio de Desarrollo de Software a Medida, THE Página_Servicios SHALL mostrar los siguientes puntos: levantamiento y definición de requerimientos funcionales, diseño de arquitectura e integración de sistemas, y desarrollo coordinado bajo alcance acordado formalmente.
9. WHEN el visitante accede al detalle del Servicio de QA y Aseguramiento de Calidad, THE Página_Servicios SHALL mostrar los siguientes puntos: estrategia y planes de prueba funcionales e integración, matrices de cobertura y trazabilidad con gestión de defectos, y certificación final de calidad de software.

### Requirement 9: Página Nosotros — Identidad y Metodología

**User Story:** Como visitante, quiero conocer la identidad corporativa y la metodología de Soluctech, para confiar en la empresa y su forma de trabajo.

#### Acceptance Criteria

1. THE Página_Nosotros SHALL mostrar la propuesta de valor de Soluctech con el texto que comunica que Soluctech apoya a organizaciones que necesitan tomar mejores decisiones tecnológicas, modernizar procesos e impulsar iniciativas digitales con visión práctica.
2. THE Página_Nosotros SHALL mostrar la Metodología de cinco pasos de Soluctech, donde cada paso se presenta con su nombre y descripción: Descubrimiento como reunión para entender el desafío; Diagnóstico como análisis y priorización de necesidades; Propuesta como alcance, entregables, plazos y valor; Ejecución como acompañamiento y seguimiento de avances; y Cierre como resultados, recomendaciones y próximos pasos.
3. THE Página_Nosotros SHALL mostrar el enfoque de cuatro pilares de Soluctech, donde cada pilar se presenta con su nombre y descripción: Entender el desafío como comprender a fondo las necesidades y contexto de la empresa; Priorizar oportunidades como identificar iniciativas con mayor potencial de valor; Definir hoja de ruta como diseñar un plan de acción con metas concretas; y Acompañar resultados como supervisar la ejecución para asegurar el impacto esperado.
4. THE Página_Nosotros SHALL mostrar la modalidad de atención de Soluctech indicando que es remota y presencial según requerimiento.
5. THE Página_Nosotros SHALL mostrar el liderazgo ejecutivo de Soluctech, identificando a Macarena Herrera R. como Gerente General y a Carlos Rojas L. como Consultor TI Principal.

### Requirement 10: Página Nosotros — Equipo Directivo

**User Story:** Como visitante, quiero conocer al equipo directivo de Soluctech, para identificar a las personas responsables de la consultora.

#### Acceptance Criteria

1. THE Página_Nosotros SHALL mostrar una sección titulada "Liderazgo Ejecutivo" que presente exactamente dos integrantes del equipo directivo de Soluctech, visibles simultáneamente en la misma sección.
2. THE Página_Nosotros SHALL mostrar a Macarena Herrera R. como texto visible con el cargo de Gerente General también como texto visible.
3. THE Página_Nosotros SHALL mostrar a Carlos Rojas L. como texto visible con el cargo de Consultor TI Principal también como texto visible.

### Requirement 11: Página Nosotros — Valores

**User Story:** Como visitante, quiero conocer los valores de Soluctech, para entender los principios que guían a la empresa.

#### Acceptance Criteria

1. THE Página_Nosotros SHALL mostrar al menos 4 valores corporativos de Soluctech, donde cada valor tiene un título identificable y una descripción asociada.
2. THE Página_Nosotros SHALL mostrar valores que correspondan a uno o más de los siguientes conceptos derivados de los documentos de especificaciones: mirada estratégica, visión práctica, tecnología conectada con los objetivos del negocio, entender el desafío, priorizar oportunidades, definir hoja de ruta y acompañar resultados.

### Requirement 12: Página de Contacto — Formulario Web

**User Story:** Como visitante interesado, quiero completar un formulario de contacto estructurado, para solicitar una conversación inicial con Soluctech.

#### Acceptance Criteria

1. THE Página_Contacto SHALL mostrar el Formulario_Contacto con los campos: Nombre (límite máximo de 100 caracteres), Empresa (límite máximo de 100 caracteres), Correo (límite máximo de 254 caracteres), Teléfono (límite máximo de 30 caracteres), Servicio, Modalidad preferida y Mensaje (límite máximo de 1000 caracteres).
2. THE Formulario_Contacto SHALL marcar como obligatorios los campos Nombre, Empresa, Correo, Servicio, Modalidad preferida y Mensaje.
3. THE Formulario_Contacto SHALL marcar el campo Teléfono como opcional.
4. THE Formulario_Contacto SHALL mostrar el campo Servicio como un menú desplegable con las seis opciones de Servicios de Soluctech.
5. THE Formulario_Contacto SHALL mostrar el campo Modalidad preferida como un selector con las tres opciones de Modalidades de Soluctech.
6. WHEN el visitante envíe el Formulario_Contacto con todos los campos obligatorios completados, THE Sitio_Web SHALL enviar los datos al correo de contacto crojasl@soluctech.cl.
7. WHEN el visitante envíe el Formulario_Contacto con todos los campos obligatorios completados y válidos, THE Sitio_Web SHALL mostrar un mensaje de confirmación de envío exitoso.
8. IF el visitante intenta enviar el Formulario_Contacto sin completar los campos obligatorios, THEN THE Formulario_Contacto SHALL mostrar mensajes de validación indicando qué campos faltan por completar.
9. IF el visitante ingresa en el campo Correo un valor que no contenga un único símbolo '@' separando una parte local no vacía de un dominio con al menos un punto, THEN THE Formulario_Contacto SHALL mostrar un mensaje de error de validación.
10. IF el visitante ingresa un valor en el campo Teléfono que no esté compuesto exclusivamente por dígitos, espacios y los caracteres '+', '-', '(' o ')', THEN THE Formulario_Contacto SHALL mostrar un mensaje de error de validación indicando el formato permitido.
11. IF el envío de los datos al correo de contacto falla, THEN THE Sitio_Web SHALL mostrar un mensaje de error indicando que el envío no pudo completarse y conservar los datos ingresados por el visitante.
12. IF el visitante ingresa un valor que exceda el límite máximo de caracteres definido para un campo de texto, THEN THE Formulario_Contacto SHALL mostrar un mensaje de validación indicando el límite permitido.

### Requirement 13: Página de Contacto — Contacto Directo y FAQ

**User Story:** Como visitante, quiero ver los datos de contacto directo y las preguntas frecuentes, para resolver mis dudas antes de iniciar una conversación.

#### Acceptance Criteria

1. THE Página_Contacto SHALL mostrar el correo de contacto directo crojasl@soluctech.cl como texto legible en una sección de datos de contacto y como un enlace de correo electrónico clicable.
2. THE Página_Contacto SHALL mostrar el nombre y cargo de los responsables de contacto: Macarena Herrera R. como Gerente General y Carlos Rojas L. como Consultor TI.
3. THE Página_Contacto SHALL mostrar una sección de preguntas frecuentes que explique que la reunión inicial de descubrimiento tiene como propósito entender el desafío del cliente y que no genera costo ni obligación de contratación.
4. THE Página_Contacto SHALL mostrar en la sección de preguntas frecuentes las tres Modalidades de contratación disponibles: Diagnóstico Ejecutivo, Proyecto Específico y Asesoría Recurrente.
5. THE Página_Contacto SHALL mostrar un CTA que invite al visitante a completar el Formulario_Contacto.
6. WHEN el visitante haga clic en el CTA, THE Página_Contacto SHALL dirigir al visitante al Formulario_Contacto.

### Requirement 14: Diseño Responsivo

**User Story:** Como visitante que usa distintos dispositivos, quiero que el sitio se adapte a mi pantalla, para tener una experiencia de uso consistente sin importar el dispositivo.

#### Acceptance Criteria

1. THE Sitio_Web SHALL ser responsivo y adaptar su diseño a tres rangos de pantalla: móvil (menor a 768 píxeles), tableta (768 a 1024 píxeles) y escritorio (mayor a 1024 píxeles).
2. THE Sitio_Web SHALL mantener un tamaño de fuente mínimo de 16 píxeles para todos los textos en cada rango de pantalla sin requerir desplazamiento horizontal.
3. THE Sitio_Web SHALL ajustar las imágenes y elementos gráficos al ancho de su contenedor preservando la relación de aspecto original sin perder calidad visible.
4. THE Sitio_Web SHALL mantener el mismo orden de lectura del contenido y la jerarquía de tamaños de encabezados en cada rango de pantalla.
5. WHILE el sitio se visualice en un dispositivo con pantalla táctil, THE Sitio_Web SHALL garantizar que todos los botones y enlaces tengan un área mínima de 44 por 44 píxeles.

### Requirement 15: SEO y Meta Etiquetas

**User Story:** Como administrador del sitio, quiero que cada página tenga meta etiquetas optimizadas, para mejorar la indexación y visibilidad del sitio en Google.

#### Acceptance Criteria

1. THE Sitio_Web SHALL incluir un Meta_Tag de meta-title en cada una de las cuatro páginas, con un máximo de 60 caracteres por título y títulos distintos entre las cuatro páginas.
2. THE Sitio_Web SHALL configurar el meta-title de la Página_Inicio como "SOLUCTECH — Consultoría TI, IA y Ciberseguridad en Chile".
3. THE Sitio_Web SHALL incluir un Meta_Tag de meta-description en cada una de las cuatro páginas, cuyo texto sea distinto para cada página, no exceda 160 caracteres, y mencione el tema o servicio principal definido para esa página en la arquitectura de navegación del sitio.
4. THE Sitio_Web SHALL incluir etiquetas semánticas HTML5 (header, nav, main, section, article, footer) en la estructura de cada página.
5. THE Sitio_Web SHALL incluir exactamente un encabezado H1 por página y una jerarquía de encabezados en la que ningún encabezado de nivel N aparezca sin que exista previamente, en el orden del documento, un encabezado de nivel N-1.
6. THE Sitio_Web SHALL generar y publicar un archivo Sitemap (sitemap.xml), accesible públicamente en la raíz del dominio del Sitio_Web, que liste exactamente las URLs de las cuatro páginas principales.

### Requirement 16: Indexación en Google y Analítica

**User Story:** Como administrador del sitio, quiero configurar la indexación en Google y la analítica web, para medir el tráfico y el desempeño del sitio.

#### Acceptance Criteria

1. THE Sitio_Web SHALL incluir un Sitemap en formato XML, accesible en la URL raíz del dominio, que liste todas las páginas públicas publicadas del Sitio_Web.
2. THE Sitio_Web SHALL integrar Google Analytics 4 para el registro de vistas de página y métricas de comportamiento de los visitantes.
3. THE Sitio_Web SHALL incluir el código de seguimiento de Google Analytics 4 en todas las páginas públicas del sitio.
4. THE Sitio_Web SHALL incluir una etiqueta meta de verificación de propiedad en el código fuente del Sitio_Web para Google Search Console.

### Requirement 17: Seguridad y Certificado SSL

**User Story:** Como visitante, quiero que el sitio use protocolo HTTPS, para que mis datos viajen de forma segura, especialmente al completar el formulario de contacto.

#### Acceptance Criteria

1. THE Sitio_Web SHALL ser servido exclusivamente bajo protocolo HTTPS con un certificado SSL emitido por una autoridad certificadora reconocida por los navegadores, que coincida con el dominio del sitio y cuya fecha de vigencia sea válida al momento del acceso.
2. WHEN un visitante acceda al sitio mediante HTTP con cualquier ruta y parámetros de consulta, THE Sitio_Web SHALL redirigir automáticamente a la versión HTTPS preservando la misma ruta y los mismos parámetros de consulta.
3. THE Sitio_Web SHALL cifrar los datos enviados a través del Formulario_Contacto mediante la conexión HTTPS.
4. THE Sitio_Web SHALL cargar todos los recursos de la página, incluyendo scripts, hojas de estilo, imágenes y multimedia, exclusivamente mediante protocolo HTTPS.

### Requirement 18: Rendimiento del Sitio

**User Story:** Como visitante, quiero que el sitio cargue rápidamente, para no abandonar la página por tiempos de espera prolongados.

#### Acceptance Criteria

1. WHEN el visitante acceda a cualquier página del Sitio_Web bajo una conexión de 4G, THE Sitio_Web SHALL cargar el contenido visible en el área inicial del navegador sin necesidad de desplazamiento en un tiempo menor a 3 segundos.
2. THE Sitio_Web SHALL optimizar el peso de las imágenes a un máximo de 200 KB por imagen, manteniendo una resolución de visualización en pantalla no inferior a 72 ppi.
3. THE Sitio_Web SHALL cargar archivos CSS y JavaScript de forma que ninguno bloquee el renderizado del contenido visible en el área inicial del navegador sin necesidad de desplazamiento.
4. THE Sitio_Web SHALL realizar un máximo de 50 solicitudes HTTP de recursos por página.

### Requirement 19: Accesibilidad Web

**User Story:** Como visitante, quiero que el sitio cumpla con estándares de accesibilidad, para que personas con distintas capacidades puedan navegar el contenido.

#### Acceptance Criteria

1. IF una imagen contiene contenido informativo, THEN THE Sitio_Web SHALL incluir un atributo alt con una descripción textual de dicho contenido.
2. THE Sitio_Web SHALL mantener un contraste de color mínimo de 4.5 a 1 entre el texto y el fondo para textos de tamaño menor a 24 píxeles, y de 3 a 1 para textos de 24 píxeles o mayores.
3. THE Sitio_Web SHALL permitir la navegación completa mediante teclado de todos los elementos interactivos, con un orden de foco visible que sigue el orden de lectura del documento.
4. IF un componente interactivo no tiene semántica HTML nativa, THEN THE Sitio_Web SHALL usar etiquetas ARIA para proveer la semántica adecuada.
5. THE Sitio_Web SHALL asegurar que todos los campos del Formulario_Contacto tengan etiquetas asociadas mediante el atributo for del elemento label o mediante ARIA.
6. THE Sitio_Web SHALL permitir que el foco del teclado avance y retroceda entre todos los elementos interactivos sin quedar atrapado en ningún componente.
7. THE Sitio_Web SHALL mostrar un indicador visual de foco diferenciado para el elemento que tenga el foco del teclado en cada momento.
8. IF una imagen es decorativa y no aporta contenido informativo, THEN THE Sitio_Web SHALL incluir un atributo alt vacío para que los lectores de pantalla la omitan.

### Requirement 20: Consistencia Visual e Identidad Institucional

**User Story:** Como visitante, quiero que el sitio tenga una apariencia visual coherente y profesional, para percibir a Soluctech como una empresa confiable.

#### Acceptance Criteria

1. THE Sitio_Web SHALL usar la misma paleta de colores institucionales de Soluctech en todas las páginas, sin utilizar colores fuera de dicha paleta.
2. THE Sitio_Web SHALL usar un máximo de 2 familias tipográficas, manteniendo las mismas familias en todas las páginas.
3. THE Sitio_Web SHALL mostrar el logotipo de Soluctech en la misma posición y con las mismas proporciones en la cabecera de todas las páginas.
4. THE Sitio_Web SHALL mantener el mismo color, forma, tamaño y estilo de borde para cada tipo de elemento (botones, tarjetas y secciones) a lo largo de las cuatro páginas.
5. THE Sitio_Web SHALL usar los mismos valores de espaciado y reglas de alineación para el mismo tipo de sección en todas las páginas.
6. THE Sitio_Web SHALL usar un tamaño mínimo de fuente de 16 píxeles para el texto del cuerpo en todas las páginas.

### Requirement 21: Llamados a la Acción (CTA)

**User Story:** Como visitante, quiero ver llamados a la acción claros en el sitio, para saber cómo iniciar una conversación con Soluctech.

#### Acceptance Criteria

1. THE Sitio_Web SHALL mostrar al menos un botón de CTA en el contenido de la Página_Inicio que dirija a la Página_Contacto.
2. THE Sitio_Web SHALL mostrar al menos un botón de CTA en el contenido de la Página_Servicios, con texto que invite al visitante a agendar una conversación inicial, que dirija a la Página_Contacto.
3. THE Sitio_Web SHALL mostrar al menos un botón de CTA en el contenido de la Página_Nosotros, con texto que invite al visitante a agendar una conversación inicial, que dirija a la Página_Contacto.
4. THE Sitio_Web SHALL mostrar el CTA principal de la Página_Inicio en la sección Hero con el texto "Agenda una conversación inicial" que dirija a la Página_Contacto.
