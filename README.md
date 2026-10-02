# Retuerto y Asociados — Correduría de Seguros

Sitio web bilingüe, generado con Jekyll por GitHub Pages, de Retuerto y Asociados (227 páginas en español y 227 en inglés): inicio, seguros para particulares, comercios y empresas, blog, diccionario, teléfonos de asistencia y páginas legales.

- `*.html` — versión en español (raíz del sitio).
- `en/*.html` — versión en inglés (las páginas nuevas tienen slug en inglés).
- `blog/` — el blog y una carpeta por categoría, cada una con su `index.html`:
  `blog/boletines/`, `blog/archivo/` (con `covid/` y `volcan/`), `blog/publicaciones/` y
  `blog/guias/` (con `ciberseguridad/`, `ocupacion-ilegal/`, `vivir-de-alquiler/`,
  `enfermedades-graves/` y `vehiculos-industriales-y-agricolas/`). En inglés: `en/blog/…`
  (`newsletters/`, `archive/`, `publications/`, `guides/`…).
- Cada artículo vive dentro de la carpeta de su categoría, p. ej.
  `blog/guias/vivir-de-alquiler/fianza-y-desperfectos-al-dejar-un-piso-de-alquiler/`
  o `blog/boletines/cuarentena-y-filomena/` (en inglés, `en/blog/guides/renting/…`).
- Las antiguas direcciones (`blog.html`, `categoria-*.html`, `articulo-*.html`) redirigen a las nuevas.
- `assets/` — estilos, script y logotipos compartidos. `site.js` adapta sus textos al idioma de la página (`<html lang>`).
- Cada página enlaza a su equivalente con el selector ES · EN de la barra superior y con `hreflang`.
- Publicado con GitHub Pages (Deploy from a branch) en https://retuertographic.github.io/rya/ y https://retuertographic.github.io/rya/en/

## Formulario de contacto (CRM)

- Las 140 páginas con formulario (70 en español y 70 en inglés) usan el mismo *partial*:
  `<div class="crm-form" data-formulario-crm></div>` más `assets/formulario-crm.js`.
- El script inserta el formulario del CRM según el idioma de la página (`<html lang>`) y fija
  el alto del marco para que no aparezca barra de desplazamiento. Las URL de los formularios y
  la tabla de altos están al principio de `assets/formulario-crm.js`.
- Si el formulario del CRM publica su alto con `postMessage({height})`, se usa ese valor exacto.

## Direcciones de la web anterior

- `404.html` reconoce las direcciones de la web anterior (Joomla: `/blog-retuertoseguros/…`,
  `/tienda-seguros-online-tenerife/…`, `/asistencia/diccionario-de-seguros/…`, etc.) y lleva a su
  equivalente en la web nueva; si no hay equivalente, muestra una página de error con enlaces.
- Las direcciones antiguas indexadas que se localizaron tienen además su propia redirección
  (carpetas `blog-retuertoseguros/`, `tienda-seguros-online-tenerife/`, `seguros-para-…-tenerife/`…).

## Estructura con Jekyll (partials)

GitHub Pages monta la web con Jekyll al publicar; el visitante recibe HTML estático.

- `_includes/cabecera-es.html` / `cabecera-en.html`: `<head>` (`cabeza.html`, común a los dos idiomas)
  + barra superior y menú (`barra-es.html` / `barra-en.html`).
- `_includes/pie-es.html` / `pie-en.html`: pie y botones flotantes (`pie-cuerpo-es.html` /
  `pie-cuerpo-en.html`) + scripts (`scripts.html`).
- `_includes/cabeza.html` incluye la etiqueta canonical, Open Graph / Twitter Card (imagen para
  compartir: `assets/compartir.png`, 1200×630) y `datos-estructurados.html` (JSON-LD de la
  correduría, migas de pan sacadas del `<div class="crumbs">` de cada página y artículo en el blog).
- `404.html` y `error.html` llevan `bilingue: true`: un solo archivo para los dos idiomas que, en las
  direcciones bajo `en/`, cambia textos, título, cabecera y pie a inglés (`idioma-error.html`,
  `pie-bilingue.html`).
- `_includes/head-comun.html`: lo que va en el `<head>` de todas las páginas (Google Tag Manager
  y el script del banner de cookies). `_includes/body-comun.html`: justo después de `<body>`.
- `_includes/variables.html`: calcula las rutas relativas según la profundidad de cada página.
- `_layouts/pagina.html`: une cabecera + contenido + pie. `_layouts/redireccion.html`: redirecciones.
- Cada página tiene solo su `<main>` y un front matter:
  - `lang`: `es` o `en`; `title` y `description`: título y descripción;
  - `alt`: su versión en el otro idioma (ruta desde la raíz, p. ej. `en/tenant-insurance.html`);
  - `activo`: elemento del menú marcado (opcional); `formulario: true` si lleva el formulario del CRM;
  - `pie_asegurado` / `pie_rc: false` si el pie no debe repetir esos enlaces al glosario;
  - `actualizado`: fecha del último cambio de contenido (AAAA-MM-DD). Va al `<lastmod>` del sitemap y
    a la fecha de modificación de los artículos: **actualízala al cambiar el texto de una página**.
- `sitemap.xml` y `robots.txt` se generan solos con todas las páginas.
- Dominio: al pasar a `retuertoyasociados.com`, cambiar `url` y `baseurl` en `_config.yml`.
- Para probar en local: `bundle exec jekyll serve` con la gema `github-pages`.
