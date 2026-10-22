# Soluctech — Primera versión del sitio web

Sitio estático multipágina (HTML5, CSS3 y JavaScript), desarrollado tomando como base `requirements.md`, `design.md` y `tasks.md` de Kiro.

## Vista local
1. Descomprime este ZIP.
2. Abre la carpeta en VS Code.
3. Inicia un servidor local: `python -m http.server 8000` (requiere Python).
4. Abre http://localhost:8000/

## Estado
- Listas: Inicio, Servicios, Nosotros, Contacto, navegación móvil, FAQ, validaciones de formulario, sitemap y metadatos SEO.
- **Pendiente: logotipo oficial en archivo independiente.** Se utiliza temporalmente una marca tipográfica / símbolo genérico, no el logotipo original; reemplazar antes de publicación. El catálogo original solo contiene el logotipo incrustado en un PDF.
- **Pendiente: formulario en vivo.** Configura Formspree y asigna la URL validada a `data-endpoint` en `contacto.html` (p.ej. `https://formspree.io/f/TU_ID`). El formulario no declara éxito falso si está sin configurar. Prueba envíos reales y antispam antes de publicar.
- **Pendiente: GA4, Search Console, HTTPS y DNS.** No se activan ni modifican hasta contar con accesos y plataforma elegida.
- Si el proveedor exige una redirección HTTPS explícita, configurarla **según el hosting escogido**.
- Contenido legal/privacidad del formulario debe revisarse antes de habilitar envíos.
- `assets/og-cover.svg` es un recurso provisional que puede cambiarse por una imagen compatible con las redes sociales.

## Estructura
- `index.html` / `servicios.html` / `nosotros.html` / `contacto.html`
- `css/styles.css` / `js/main.js`
- `assets/` íconos y recurso social temporal
- `docs/` requisitos, diseño y referencias originales

## Consideraciones
Se eligió desarrollo sin framework como define `design.md`. Los documentos de Kiro se incluyen para trazabilidad. No se ejecutó un despliegue real.
