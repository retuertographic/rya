---
layout: null
sitemap: false
---
// Service worker de Retuerto y Asociados.
// Si GitHub Pages responde con un error 5xx (o 429) o no hay conexión, muestra la última copia
// guardada de la página o, si no la hay, la página de error de la web en lugar de la de GitHub.
// Se regenera en cada publicación, así que cada versión del sitio usa su propia caché.
const VERSION = 'rya-{{ site.time | date: "%Y%m%d%H%M%S" }}';
const BASE = '{{ site.baseurl }}/';
const ERROR = BASE + 'error.html';
const PRECARGA = [ERROR, BASE + 'assets/styles.css', BASE + 'assets/site.js', BASE + 'assets/logo.png',
                  BASE + 'assets/logo-blanco.png', BASE + 'assets/favicon.png', BASE + 'assets/favicon.ico'];
const MAX_PAGINAS = 60;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECARGA)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((claves) => Promise.all(claves.filter((k) => k.startsWith('rya-') && k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => guardarAbiertas()));
});

// La primera página visitada se carga antes de que exista el service worker: se guarda al activarse.
async function guardarAbiertas() {
  const abiertas = await self.clients.matchAll({ type: 'window' });
  await Promise.all(abiertas.map(async (c) => {
    const url = new URL(c.url);
    if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
    try {
      const r = await fetch(url.href, { credentials: 'same-origin' });
      if (r.ok) await guardar(new Request(url.href), r);
    } catch (err) {}
  }));
}

const esFallo = (r) => r.status >= 500 || r.status === 429;

async function guardar(peticion, respuesta) {
  const cache = await caches.open(VERSION);
  await cache.put(peticion, respuesta);
  const claves = await cache.keys();
  const paginas = claves.filter((k) => !PRECARGA.includes(new URL(k.url).pathname));
  for (let i = 0; i < paginas.length - MAX_PAGINAS; i++) await cache.delete(paginas[i]);
}

async function reserva(peticion) {
  const copia = await caches.match(peticion, { ignoreSearch: true });
  if (copia) return copia;
  const error = await caches.match(ERROR);
  if (error) return new Response(await error.blob(), { status: 503, statusText: 'Service Unavailable',
                                                      headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  return Response.error();
}

async function navegar(peticion) {
  try {
    const r = await fetch(peticion);
    if (esFallo(r)) return reserva(peticion);
    if (r.ok) guardar(peticion, r.clone());
    return r;
  } catch (err) {
    return reserva(peticion);
  }
}

async function recurso(peticion) {
  try {
    const r = await fetch(peticion);
    if (esFallo(r)) return (await caches.match(peticion)) || r;
    if (r.ok) (await caches.open(VERSION)).put(peticion, r.clone());
    return r;
  } catch (err) {
    return (await caches.match(peticion)) || Response.error();
  }
}

self.addEventListener('fetch', (e) => {
  const p = e.request;
  if (p.method !== 'GET') return;
  const url = new URL(p.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (p.mode === 'navigate') e.respondWith(navegar(p));
  else if (/\.(css|js|png|jpe?g|webp|svg|ico|woff2?)$/.test(url.pathname)) e.respondWith(recurso(p));
});
