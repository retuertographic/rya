// Textos de la interfaz según el idioma de la página (<html lang>).
var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
var T = EN ? {
  abrir: 'Open menu', cerrar: 'Close menu', verDic: 'See in the glossary',
  nombre: 'Name', telefono: 'Phone', correo: 'Email', ramo: 'Insurance of interest',
  asunto: 'Quote request', una: '1 company found', varias: ' companies found'
} : {
  abrir: 'Abrir menú', cerrar: 'Cerrar menú', verDic: 'Ver en el diccionario',
  nombre: 'Nombre', telefono: 'Teléfono', correo: 'Correo', ramo: 'Seguro de interés',
  asunto: 'Solicitud de presupuesto', una: '1 compañía encontrada', varias: ' compañías encontradas'
};

// Menú responsive
(function () {
  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? T.cerrar : T.abrir);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });
})();

// Acceso e-cliente: ventana emergente a tamaño de pantalla, sin enviar el
// referente (la URL de origen) a la plataforma de destino.
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-popup]') : null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var w = (window.screen && screen.availWidth) || 1280;
    var h = (window.screen && screen.availHeight) || 800;
    var rasgos = [
      'popup=yes', 'noopener=yes', 'noreferrer=yes',
      'width=' + w, 'height=' + h, 'left=0', 'top=0',
      'resizable=yes', 'scrollbars=yes', 'status=no', 'toolbar=no',
      'menubar=no', 'location=no'
    ].join(',');
    var win = window.open(a.href, a.dataset.popup || '_blank', rasgos);
    // Si el navegador bloquea la ventana emergente, dejamos el enlace normal.
    if (win) { e.preventDefault(); win.focus(); }
  });
})();

// Diccionario: muestra la definición del término al pasar por encima o al
// tocarlo, con enlace a la entrada completa.
(function () {
  var caja = null;
  function cerrar() { if (caja) { caja.remove(); caja = null; } }
  function abrir(a) {
    cerrar();
    caja = document.createElement('div');
    caja.className = 'dic-pop';
    caja.innerHTML = '<strong></strong><p></p><a></a>';
    caja.querySelector('strong').textContent = a.dataset.term;
    caja.querySelector('p').textContent = a.dataset.def;
    var ver = caja.querySelector('a');
    ver.href = a.getAttribute('href');
    ver.textContent = T.verDic;
    document.body.appendChild(caja);
    var r = a.getBoundingClientRect();
    var ancho = caja.offsetWidth;
    var x = Math.min(Math.max(12, r.left + r.width / 2 - ancho / 2),
                     window.innerWidth - ancho - 12);
    var arriba = r.top > caja.offsetHeight + 16;
    caja.style.left = (x + window.scrollX) + 'px';
    caja.style.top = (arriba ? r.top - caja.offsetHeight - 10 : r.bottom + 10) + window.scrollY + 'px';
    caja.classList.toggle('abajo', !arriba);
  }
  document.addEventListener('mouseover', function (e) {
    var a = e.target.closest && e.target.closest('a.dic');
    if (a) abrir(a);
  });
  document.addEventListener('mouseout', function (e) {
    var a = e.target.closest && e.target.closest('a.dic');
    if (a && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.dic-pop'))) cerrar();
  });
  document.addEventListener('focusin', function (e) {
    var a = e.target.closest && e.target.closest('a.dic');
    if (a) abrir(a);
  });
  document.addEventListener('focusout', cerrar);
  window.addEventListener('scroll', cerrar, { passive: true });
  window.addEventListener('resize', cerrar);
})();

// Compartir esta página
(function () {
  var bloques = document.querySelectorAll('[data-compartir]');
  if (!bloques.length) return;
  var url = location.href;
  var titulo = document.title;
  bloques.forEach(function (bloque) {
    bloque.querySelectorAll('[data-share]').forEach(function (el) {
      var tipo = el.dataset.share;
      if (tipo === 'whatsapp') el.href = 'https://wa.me/?text=' + encodeURIComponent(titulo + ' ' + url);
      else if (tipo === 'linkedin') el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
      else if (tipo === 'facebook') el.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
      else if (tipo === 'email') el.href = 'mailto:?subject=' + encodeURIComponent(titulo) + '&body=' + encodeURIComponent(url);
      else if (tipo === 'copiar') {
        el.addEventListener('click', function () {
          var aviso = bloque.querySelector('.compartir-ok');
          var ok = function () {
            if (!aviso) return;
            aviso.hidden = false;
            setTimeout(function () { aviso.hidden = true; }, 2200);
          };
          if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, function () {});
          else ok();
        });
      }
    });
  });
})();

// Menú principal con desbordamiento: los elementos que no caben se recogen
// en «Más», y vuelven al menú al ensanchar la ventana.
(function () {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  var lista = nav.querySelector('ul');
  var mas = lista.querySelector('.nav-mas');
  var drop = mas && mas.querySelector('.nav-drop');
  var cta = lista.querySelector('.cta');
  var wrap = document.querySelector('.site-header .wrap');
  if (!mas || !drop || !wrap) return;
  var movil = window.matchMedia('(max-width:1300px)');

  function restaurar() {
    while (drop.firstElementChild) lista.insertBefore(drop.firstElementChild, mas);
    mas.hidden = true;
    cerrar();
  }
  function cerrar() {
    mas.classList.remove('abierto');
    mas.querySelector('button').setAttribute('aria-expanded', 'false');
  }
  function ajustar() {
    restaurar();
    if (movil.matches) return;
    var items = Array.prototype.filter.call(
      lista.children, function (li) { return li !== mas && li !== cta; }
    );
    // Se recogen desde el final; «Inicio» no se mueve nunca.
    var i = items.length - 1;
    while (wrap.scrollWidth > wrap.clientWidth + 1 && i >= 1) {
      mas.hidden = false;
      drop.insertBefore(items[i], drop.firstChild);
      i--;
    }
    if (!drop.children.length) { mas.hidden = true; return; }
    // Si la página actual ha quedado recogida, se marca «Más».
    mas.classList.toggle('tiene-activo', !!drop.querySelector('a.active'));
  }

  mas.querySelector('button').addEventListener('click', function (e) {
    e.stopPropagation();
    var abierto = mas.classList.toggle('abierto');
    this.setAttribute('aria-expanded', String(abierto));
  });
  document.addEventListener('click', function (e) {
    if (!mas.contains(e.target)) cerrar();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrar();
  });

  var pendiente;
  window.addEventListener('resize', function () {
    clearTimeout(pendiente);
    pendiente = setTimeout(ajustar, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
  ajustar();
})();

// Botón de volver arriba. Se coloca sobre el de WhatsApp, nunca encima.
(function () {
  var boton = document.getElementById('irArriba');
  if (!boton) return;
  var visible = false;
  function revisar() {
    var debe = window.scrollY > 600;
    if (debe !== visible) { visible = debe; boton.hidden = !debe; }
  }
  boton.addEventListener('click', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  window.addEventListener('scroll', revisar, { passive: true });
  revisar();
})();

// Índice del blog: «Mostrar más» revela el siguiente lote de entradas.
(function () {
  document.querySelectorAll('[data-mas]').forEach(function (boton) {
    var bloque = boton.closest('.blog-sec');
    var rejilla = bloque && bloque.querySelector('[data-lote]');
    if (!rejilla) return;
    var lote = parseInt(rejilla.dataset.lote, 10) || 12;
    boton.addEventListener('click', function () {
      var ocultas = rejilla.querySelectorAll('[data-extra][hidden]');
      Array.prototype.slice.call(ocultas, 0, lote).forEach(function (el) {
        el.removeAttribute('hidden');
      });
      if (rejilla.querySelectorAll('[data-extra][hidden]').length === 0) {
        boton.hidden = true;
      }
    });
  });
})();

// Formulario de contacto: compone un correo con los datos introducidos.
// El sitio es estático, así que no hay servidor donde enviarlo.
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
    var cuerpo = [
      T.nombre + ': ' + v('nombre'),
      T.telefono + ': ' + v('telefono'),
      T.correo + ': ' + v('email'),
      T.ramo + ': ' + v('ramo'),
      '',
      v('mensaje')
    ].join('\n');
    var url = 'mailto:' + form.dataset.to +
      '?subject=' + encodeURIComponent(T.asunto + ' — ' + (v('nombre') || 'web')) +
      '&body=' + encodeURIComponent(cuerpo);
    var msg = document.getElementById('formMsg');
    if (msg) msg.classList.add('show');
    window.location.href = url;
  });
})();

// Buscador del directorio de teléfonos de asistencia.
(function () {
  var campo = document.getElementById('buscaTel');
  var dir = document.getElementById('dirTel');
  if (!campo || !dir) return;
  var fichas = Array.prototype.slice.call(dir.querySelectorAll('.tel-comp'));
  var conteo = document.getElementById('conteoTel');
  var vacio = document.getElementById('vacioTel');
  var base = conteo ? conteo.textContent : '';

  function limpiar(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  fichas.forEach(function (f) { f.dataset.norm = limpiar(f.dataset.busca || ''); });

  function filtrar() {
    var q = limpiar(campo.value.trim());
    var visibles = 0;
    fichas.forEach(function (f) {
      var ok = !q || f.dataset.norm.indexOf(q) !== -1;
      f.hidden = !ok;
      if (ok) visibles++;
    });
    if (vacio) vacio.hidden = visibles !== 0;
    if (conteo) {
      conteo.textContent = q
        ? (visibles === 1 ? T.una : visibles + T.varias)
        : base;
    }
  }
  campo.addEventListener('input', filtrar);
})();
