# Retuerto y Asociados — Correduría de Seguros

Sitio web estático y bilingüe de Retuerto y Asociados (227 páginas en español y 227 en inglés): inicio, seguros para particulares, comercios y empresas, blog, diccionario, teléfonos de asistencia y páginas legales.

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
