# Retuerto y Asociados — Correduría de Seguros

Sitio web estático y bilingüe de Retuerto y Asociados (227 páginas en español y 227 en inglés): inicio, seguros para particulares, comercios y empresas, blog, diccionario, teléfonos de asistencia y páginas legales.

- `*.html` — versión en español (raíz del sitio).
- `en/*.html` — versión en inglés, con los mismos nombres de archivo.
- `assets/` — estilos, script y logotipos compartidos. `site.js` adapta sus textos al idioma de la página (`<html lang>`).
- Cada página enlaza a su equivalente con el selector ES · EN de la barra superior y con `hreflang`.
- Publicado con GitHub Pages (Deploy from a branch) en https://retuertographic.github.io/rya/ y https://retuertographic.github.io/rya/en/
