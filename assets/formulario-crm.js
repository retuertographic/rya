// Formulario de contacto del CRM (partial). Se inserta en cada
// <div class="crm-form" data-formulario-crm></div> según el idioma de la página,
// sin barras de desplazamiento: el marco toma el alto del formulario.
(function () {
  var FORMULARIOS = {
    es: 'https://crmapi.retuertographicdesign.com/form/9c7232b5-f6ad-3c11-94fa-fe12a752629e',
    en: 'https://crmapi.retuertographicdesign.com/form/1b1c1891-7aec-30ef-9ca7-a836dccc12a9'
  };
  var ORIGEN = 'https://crmapi.retuertographicdesign.com';

  // Alto del formulario medido en el navegador según el ancho del marco
  // (ancho mínimo → alto). Si el CRM publica su alto con postMessage,
  // se usa ese valor exacto en lugar de esta tabla.
  var ALTOS = {
    es: [[800, 631], [700, 631], [520, 634], [360, 658], [320, 682], [280, 706], [260, 706], [240, 730], [220, 754], [200, 778]],
    en: [[800, 1323], [480, 1351], [400, 1375], [360, 1404], [320, 1428], [280, 1457], [260, 1481], [240, 1505], [220, 1534], [200, 1582]]
  };
  var MARGEN = 40;  // hueco para los avisos de campo obligatorio

  var bloques = document.querySelectorAll('[data-formulario-crm]');
  if (!bloques.length) return;
  var idioma = (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  var marcos = [];

  function altoTabla(ancho) {
    var tabla = ALTOS[idioma];
    for (var i = 0; i < tabla.length; i++) {
      if (ancho >= tabla[i][0]) return tabla[i][1] + MARGEN;
    }
    return tabla[tabla.length - 1][1] + 60 + MARGEN;
  }

  function ajustar(marco) {
    if (marco.dataset.altoCrm) return;  // ya lo fija el propio formulario
    marco.style.height = altoTabla(marco.clientWidth || marco.parentNode.clientWidth) + 'px';
  }

  bloques.forEach(function (bloque) {
    var marco = document.createElement('iframe');
    marco.src = FORMULARIOS[idioma];
    marco.title = idioma === 'en' ? 'Contact form' : 'Formulario de contacto';
    marco.loading = 'lazy';
    marco.setAttribute('scrolling', 'no');
    marco.addEventListener('load', function () {
      try { marco.contentWindow.postMessage({ tipo: 'pedir-alto' }, ORIGEN); } catch (e) {}
    });
    bloque.appendChild(marco);
    marcos.push(marco);
    ajustar(marco);
  });

  // Alto exacto si el formulario lo publica (fragmento opcional en el CRM).
  window.addEventListener('message', function (e) {
    if (e.origin !== ORIGEN || !e.data || typeof e.data.height !== 'number') return;
    marcos.forEach(function (marco) {
      if (marco.contentWindow === e.source) {
        marco.dataset.altoCrm = '1';
        marco.style.height = Math.ceil(e.data.height) + 'px';
      }
    });
  });

  var pendiente;
  window.addEventListener('resize', function () {
    clearTimeout(pendiente);
    pendiente = setTimeout(function () { marcos.forEach(ajustar); }, 150);
  });
})();
