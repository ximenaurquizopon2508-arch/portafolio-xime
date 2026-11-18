/*
  main.js = la LÓGICA.
  Agarra la lista de casos.js y la convierte en tarjetas dentro de la página.
  Además hace la animación suave de aparecer al hacer scroll.
*/

// 0) Íconos chiquitos por categoría (dibujos simples en SVG)
const ICONOS = {
  finanzas:    '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  operaciones: '<rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V4h8v3M3 12h18"/>',
  personas:    '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 1.8 6 5.5"/>',
  clientes:    '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/><path d="M12 8v4l3 2"/>',
  procesos:    '<rect x="2" y="3" width="7" height="5" rx="1"/><rect x="15" y="9.5" width="7" height="5" rx="1"/><rect x="2" y="16" width="7" height="5" rx="1"/><path d="M9 5.5h3v13H9M12 12h3"/>',
  personal:    '<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/>'
};
const NOMBRE_CATEGORIA = { finanzas: "Finanzas", clientes: "Clientes", operaciones: "Operaciones", personas: "Personas", procesos: "Procesos", personal: "Proyecto personal" };

function iconoDe(caso) {
  if (caso.icono) return `<img class="tarjeta__icono tarjeta__icono--img" src="${caso.icono}" alt="">`;
  return `<span class="tarjeta__icono"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[caso.categoria] || ICONOS.finanzas}</svg></span>`;
}

// 1) Función que arma el HTML de UNA tarjeta a partir de un caso
//    data-indice guarda la posición del caso en la lista (0, 1, 2...)
//    tabindex="0" permite llegar con la tecla Tab y abrir con Enter
function crearTarjeta(caso) {
  const indice = CASOS.indexOf(caso);
  return `
    <article class="tarjeta aparecer" data-indice="${indice}" data-categoria="${caso.categoria}" tabindex="0" role="button">
      <div class="tarjeta__arriba">
        ${iconoDe(caso)}
        <span class="etiqueta">${caso.area}</span>
        <span class="tarjeta__flecha" aria-hidden="true">↗</span>
      </div>
      <h3 class="tarjeta__pregunta">${caso.pregunta}</h3>
      <div class="tarjeta__abajo">
        <span class="tarjeta__estado">${caso.numero} · ${caso.estado}</span>
        <span class="tarjeta__link">Ver caso →</span>
      </div>
    </article>
  `;
}

// Versión compacta para la portada
function crearDestacado(caso) {
  const indice = CASOS.indexOf(caso);
  return `
    <article class="tarjeta tarjeta--destacada" data-indice="${indice}" tabindex="0" role="button">
      <p class="etiqueta">${caso.area}</p>
      <h3 class="tarjeta__pregunta">${caso.pregunta}</h3>
      <p class="tarjeta__resumen">${caso.resumen}</p>
      <span class="tarjeta__flecha" aria-hidden="true">↗</span>
    </article>`;
}

// 3) Los 2 casos destacados de la portada (portada: true en casos.js)
document.getElementById("destacados").innerHTML = CASOS.filter(c => c.portada).map(caso => `
  <article class="tarjeta tarjeta--destacada" data-indice="${CASOS.indexOf(caso)}" tabindex="0" role="button">
    <p class="etiqueta">${caso.area.split(" · ")[0]}</p>
    <h3 class="tarjeta__pregunta">${caso.pregunta}</h3>
    <p class="tarjeta__resumen">${caso.beneficio}</p>
    <span class="tarjeta__flecha" aria-hidden="true">↗</span>
  </article>`).join("");

// 3b) Estampitas: crear cada dibujo en su lugar (datos en personal.js)
const capaEstampitas = document.getElementById("estampitas");
capaEstampitas.innerHTML = ESTAMPITAS.map(e => `
  <img class="estampita" src="${e.archivo}" alt=""
       data-mueve="${e.mueve}"
       style="top:${e.arriba}%; left:${e.izquierda}%; width:${e.tamano}px; --giro:${e.giro}deg;">
`).join("");

// 3c) Collage de fotos (solo si agregaste fotos en personal.js)
const capaCollage = document.getElementById("collage");
capaCollage.innerHTML = FOTOS.slice(0, 4).map((foto, i) => `
  <img class="foto foto--${i + 1}" src="${foto}" alt="">
`).join("");

// 3d) Las estampitas se mueven un poquito siguiendo el mouse
//     (en celular no hay mouse, así que se quedan quietas)
const portada = document.getElementById("inicio");
const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!movimientoReducido) {
  portada.addEventListener("mousemove", (evento) => {
    // posición del mouse de -0.5 a 0.5 (0 = centro)
    const x = evento.clientX / window.innerWidth - 0.5;
    const y = evento.clientY / window.innerHeight - 0.5;
    document.querySelectorAll(".estampita").forEach(img => {
      const fuerza = img.dataset.mueve * 24; // máximo 24px
      img.style.translate = `${x * fuerza}px ${y * fuerza}px`;
    });
  });
}

// ================= FICHA DE CASO =================
const ficha = document.getElementById("ficha");
const fichaContenido = document.getElementById("ficha-contenido");
const fichaContador = document.getElementById("ficha-contador");
let casoActual = 0;

// Arma el HTML de la ficha de un caso (estructura corta)
function crearFicha(caso) {
  const construi = caso.construi.map(t => `<li>${t}</li>`).join("");
  const recorrido = caso.recorrido.map((paso, i) => `
    <li class="recorrido__paso"><span>${String(i + 1).padStart(2, "0")}</span><b>${paso}</b></li>`).join("");
  const otros = caso.otrosNegocios.map(([negocio, uso]) => `
    <div class="otros__tarjeta"><strong>${negocio}</strong><span>${uso}</span></div>`).join("");

  // "Más a fondo": solo lo que el caso tenga
  const tablaNumeros = caso.numeros ? `
    <div>
      <p class="etiqueta">Antes vs. después</p>
      <div class="numeros">
        <div class="numeros__fila numeros__cabeza"><span></span><span>Antes</span><span>Después</span></div>
        ${caso.numeros.map(([indicador, antes, despues]) => `
          <div class="numeros__fila"><span>${indicador}</span><span class="numeros__antes">${antes}</span><b>${despues}</b></div>`).join("")}
      </div>
      ${caso.notaNumeros ? `<p class="numeros__nota">${caso.notaNumeros}</p>` : ""}
    </div>` : "";
  const decisiones = caso.decisiones ? `
    <div><p class="etiqueta">Decisiones que ayudó a tomar</p>
    <ol class="ficha__pasos">${caso.decisiones.map(d => `<li>${d}</li>`).join("")}</ol></div>` : "";
  const ia = caso.ia ? `<div><p class="etiqueta">Cómo usé la IA</p><p>${caso.ia}</p></div>` : "";
  const herramientas = `<div><p class="etiqueta">Herramientas</p>
    <div class="ficha__herramientas">${caso.herramientas.map(h => `<span class="estado">${h}</span>`).join("")}</div></div>`;

  return `
    <header class="ficha__cabecera ficha__cabecera--dos">
      <div>
        <p class="etiqueta">${caso.numero} · ${caso.area}</p>
        <h2 class="ficha__pregunta">${caso.pregunta}</h2>
        <p class="ficha__resumen">${caso.resumen}</p>
        <a href="#ejemplo" class="ficha__ejemplo-link">Entenderlo con un ejemplo ↓</a>
      </div>
      <div class="ficha__sello">
        ${iconoDe(caso)}
        <span class="estado">${caso.estado}</span>
      </div>
    </header>

    <div class="ficha__dos">
      <section>
        <p class="etiqueta">El problema</p>
        <p class="ficha__frase">${caso.problema}</p>
      </section>
      <section>
        <p class="etiqueta">Qué construí</p>
        <ul class="ficha__flechas">${construi}</ul>
      </section>
    </div>

    <section class="recorrido">
      <p class="etiqueta">Del dato a la decisión · Así funciona el recorrido</p>
      <ol class="recorrido__pasos">${recorrido}</ol>
    </section>

    <section class="ficha__resultado">
      <p class="etiqueta">Resultado</p>
      <p>${caso.resultado}</p>
    </section>

    <section id="ejemplo" class="ejemplo ejemplo--${caso.fondo}">
      <p class="etiqueta">Un caso para entenderlo · ejemplo ficticio: ${caso.contexto}</p>
      <div class="ejemplo__lienzo" data-lienzo>
        ${EJEMPLOS[caso.id] ? EJEMPLOS[caso.id].html() : '<p class="ej-pista">Ejemplo en preparación.</p>'}
      </div>
      <p class="ejemplo__nota">Ilustración conceptual · datos ficticios</p>
    </section>

    <section>
      <p class="etiqueta">La misma lógica, otros negocios</p>
      <div class="otros otros--tarjetas">${otros}</div>
    </section>

    <details class="afondo">
      <summary>Más a fondo <span>+</span></summary>
      <div class="afondo__cuerpo">${herramientas}${ia}${tablaNumeros}${decisiones}</div>
    </details>

    <footer class="ficha__cierre">
      <p>¿Tu equipo enfrenta algo parecido?</p>
      <div>
        <a class="boton boton--lleno" href="#contacto" data-accion="cerrar">Conversemos</a>
        <button class="boton" data-accion="siguiente">Explorar otro caso →</button>
      </div>
    </footer>
  `;
}

// Abre la ficha del caso número "indice"
function abrirFicha(indice, origen) {
  const yaAbierta = !ficha.hidden;
  // si te pasas del último, vuelve al primero (y al revés)
  casoActual = (indice + CASOS.length) % CASOS.length;
  const caso = CASOS[casoActual];

  fichaContenido.innerHTML = crearFicha(caso);

  // si este caso tiene ejemplo en ejemplos.js (buscado por su id), lo hacemos interactivo
  if (EJEMPLOS[caso.id]) {
    EJEMPLOS[caso.id].iniciar(fichaContenido.querySelector("[data-lienzo]"));
  }
  fichaContador.textContent = `${casoActual + 1} / ${CASOS.length}`;
  ficha.hidden = false;
  ficha.scrollTop = 0;
  // la ficha se abre como una pantalla: la foto se levanta y una hoja crece desde ella
  if (origen && !yaAbierta && !movimientoReducido && ficha.animate) {
    const r = origen.getBoundingClientRect();
    const hoja = document.createElement("div");
    hoja.className = "hoja-abriendo";
    Object.assign(hoja.style, { top: r.top + "px", left: r.left + "px", width: r.width + "px", height: r.height + "px" });
    document.body.appendChild(hoja);
    ficha.style.animation = "none";       // apaga la entrada normal mientras crece la hoja
    ficha.style.opacity = "0";
    origen.animate([{ transform: "scale(1)" }, { transform: "scale(1.06) translateY(-8px)" }], { duration: 160, fill: "forwards" });
    hoja.animate([
      { top: r.top + "px", left: r.left + "px", width: r.width + "px", height: r.height + "px", borderRadius: "4px", opacity: .9 },
      { top: "0px", left: "0px", width: innerWidth + "px", height: innerHeight + "px", borderRadius: "0px", opacity: 1 }
    ], { duration: 520, delay: 140, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }).onfinish = () => {
      ficha.style.opacity = "";
      ficha.style.animation = "";
      ficha.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "ease-out" });
      hoja.remove();
      origen.getAnimations().forEach(a => a.cancel());
    };
  }
  document.body.classList.add("sin-scroll");      // la página de atrás no se mueve
  history.replaceState(null, "", `#caso-${caso.numero}`); // link directo al caso
}

function cerrarFicha() {
  ficha.hidden = true;
  document.body.classList.remove("sin-scroll");
  history.replaceState(null, "", "#casos");
}

// Clic en cualquier tarjeta (de la portada o de la grilla) → abre su ficha
document.addEventListener("click", (evento) => {
  const tarjeta = evento.target.closest(".tarjeta, .polaroid");
  if (tarjeta) abrirFicha(Number(tarjeta.dataset.indice), tarjeta);
});

// Enter sobre una tarjeta (para quien navega con teclado)
document.addEventListener("keydown", (evento) => {
  const tarjeta = evento.target.closest?.(".tarjeta, .polaroid");
  if (tarjeta && evento.key === "Enter") abrirFicha(Number(tarjeta.dataset.indice), tarjeta);
});

// Botones de la ficha: volver, anterior, siguiente
ficha.addEventListener("click", (evento) => {
  const accion = evento.target.dataset.accion;
  if (accion === "cerrar") cerrarFicha();
  if (accion === "anterior") abrirFicha(casoActual - 1);
  if (accion === "siguiente") abrirFicha(casoActual + 1);

  // el link "Entenderlo con un ejemplo" baja suave dentro de la ficha
  if (evento.target.matches(".ficha__ejemplo-link")) {
    evento.preventDefault();
    ficha.querySelector("#ejemplo").scrollIntoView({ behavior: "smooth" });
  }
});

// Teclado dentro de la ficha: Esc cierra, flechas pasan de caso
document.addEventListener("keydown", (evento) => {
  if (ficha.hidden) return;
  if (evento.key === "Escape") cerrarFicha();
  if (evento.key === "ArrowLeft") abrirFicha(casoActual - 1);
  if (evento.key === "ArrowRight") abrirFicha(casoActual + 1);
});

// Si alguien entra con un link tipo tupagina.com/#caso-03, abre ese caso
const casoEnLink = location.hash.match(/^#caso-(\d+)/);
if (casoEnLink) {
  const indice = CASOS.findIndex(c => c.numero === casoEnLink[1]);
  if (indice >= 0) abrirFicha(indice);
}

document.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-abrir]");
  if (boton) abrirFicha(Number(boton.dataset.abrir), boton);
  const porId = e.target.closest("[data-abrir-id]");
  if (porId) abrirFicha(CASOS.findIndex(c => c.id === porId.dataset.abrirId));
});

// ================= 3f) CASOS: TABLERO DE POLAROIDS =================
// Cada polaroid va unida con un hilo a su tema (los "nudos" del centro).
// Tocar un nudo = filtrar. Tocar una foto = abrir el caso.
const NUDOS = { todo: "Todos", fin: "Finanzas", ope: "Operaciones y procesos", dat: "Datos y clientes" };

// Mini gráfico de cada polaroid (el tipo se elige en casos.js → visual)
function miniVisual(tipo) {
  const b = (alturas, marca) => alturas.map((h, i) => `<i style="height:${h}%" class="${i === marca ? "fuerte" : ""}"></i>`).join("");
  const v = {
    semaforo:   `<div class="mv-sem"><i class="ok"></i><i class="ok"></i><i class="alerta"></i><i class="mal"></i></div>`,
    barras:     `<div class="mv-barras">${b([55, 80, 40, 95, 70], 3)}</div>`,
    alerta:     `<div class="mv-barras">${b([70, 72, 68, 30, 71], 3)}</div><span class="mv-chip">¡no cuadra!</span>`,
    cohortes:   `<div class="mv-heat">${[100, 64, 41, 33, 28, 100, 58, 39, 30, 100, 61, 44].map(p => `<i style="opacity:${p / 100}"></i>`).join("")}</div>`,
    ranking:    `<div class="mv-rank">${[90, 72, 55, 38].map((w, i) => `<i style="width:${w}%" class="${i === 0 ? "fuerte" : ""}"></i>`).join("")}</div>`,
    margen:     `<div class="mv-margen"><i style="flex:62"></i><i style="flex:15" class="igv"></i><i style="flex:3" class="com"></i><i style="flex:20" class="fuerte"></i></div>`,
    cruce:      `<div class="mv-cruce"><div><i></i><i></i><i></i></div><span>↔</span><div><i></i><i class="fuerte"></i><i></i></div></div>`,
    calendario: `<div class="mv-cal">${Array.from({ length: 14 }, (_, i) => `<i class="${i === 9 ? "fuerte" : ""}"></i>`).join("")}</div>`,
    flujo:      `<div class="mv-flujo"><i></i><span>→</span><i></i><span>→</span><i class="fuerte"></i></div>`
  };
  return v[tipo] || v.barras;
}

const tablero = document.getElementById("tablero-casos");
let verTodos = false, temaActual = "todo";

function pintarTablero() {
  // casos del tablero: primero los marcados 1..6, luego el resto si "ver todos"
  const orden = CASOS.map((c, i) => ({ c, i }))
    .filter(({ c }) => verTodos || c.tablero > 0)
    .sort((a, b) => (a.c.tablero || 99) - (b.c.tablero || 99) || a.i - b.i);
  const mitad = Math.ceil(orden.length / 2);
  const giros = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2, -2, 2.2, -1, 1.6];
  const foto = ({ c, i }, k) => `
    <article class="polaroid" data-indice="${i}" data-grupo="${c.grupo}" tabindex="0" role="button" style="--giro:${giros[k % giros.length]}deg">
      <span class="polaroid__pin" aria-hidden="true"></span>
      <div class="polaroid__foto">${miniVisual(c.visual)}</div>
      <h3 class="polaroid__pregunta">${c.pregunta}</h3>
      <p class="polaroid__pie">${c.beneficio}</p>
    </article>`;
  tablero.innerHTML = `
    <svg class="tablerocasos__hilos" aria-hidden="true"></svg>
    <div class="tablerocasos__fila">${orden.slice(0, mitad).map((o, k) => foto(o, k)).join("")}</div>
    <div class="tablerocasos__nudos">${Object.entries(NUDOS).map(([k, n]) =>
      `<button class="nudo ${k === temaActual ? "activo" : ""}" data-nudo="${k}">${n}</button>`).join("")}</div>
    <div class="tablerocasos__fila">${orden.slice(mitad).map((o, k) => foto(o, k + mitad)).join("")}</div>`;
  aplicarTema();
}

function aplicarTema() {
  tablero.querySelectorAll(".nudo").forEach(n => n.classList.toggle("activo", n.dataset.nudo === temaActual));
  tablero.querySelectorAll(".polaroid").forEach(p => p.classList.toggle("apagada", temaActual !== "todo" && p.dataset.grupo !== temaActual));
  dibujarHilos();
}

// Hilos: curvas punteadas de cada polaroid a su nudo
function dibujarHilos(resaltar) {
  const svg = tablero.querySelector(".tablerocasos__hilos");
  if (!svg) return;
  const caja = tablero.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${caja.width} ${caja.height}`);
  if (window.innerWidth < 760) { svg.innerHTML = ""; return; }   // en celular no hay hilos
  svg.innerHTML = [...tablero.querySelectorAll(".polaroid")].map(p => {
    const nudo = tablero.querySelector(`[data-nudo="${p.dataset.grupo}"]`);
    const a = p.getBoundingClientRect(), n = nudo.getBoundingClientRect();
    const arriba = a.top < n.top;
    const x1 = a.left + a.width / 2 - caja.left, y1 = (arriba ? a.bottom : a.top) - caja.top;
    const x2 = n.left + n.width / 2 - caja.left, y2 = (arriba ? n.top : n.bottom) - caja.top;
    const fuerte = temaActual === p.dataset.grupo || resaltar === p;
    const apagado = temaActual !== "todo" && temaActual !== p.dataset.grupo;
    return `<path d="M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}"
      class="hilo ${fuerte ? "hilo--fuerte" : ""} ${apagado ? "hilo--apagado" : ""}"/>`;
  }).join("");
}

tablero.addEventListener("click", (e) => {
  const nudo = e.target.closest("[data-nudo]");
  if (nudo) { temaActual = nudo.dataset.nudo; aplicarTema(); }
});
tablero.addEventListener("mouseover", (e) => {
  const p = e.target.closest(".polaroid");
  if (p) dibujarHilos(p);
});
tablero.addEventListener("mouseleave", () => dibujarHilos());
document.getElementById("ver-todos").addEventListener("click", (e) => {
  verTodos = !verTodos;
  e.currentTarget.textContent = verTodos ? "Ver menos ↑" : "Ver los 10 casos ↓";
  pintarTablero();
});
window.addEventListener("resize", () => dibujarHilos());
pintarTablero();
window.addEventListener("load", () => dibujarHilos());   // cuando cargan las letras, se recalculan

// ================= 3g) EXPERIENCIA: LÍNEA DE TIEMPO =================
const linea = document.getElementById("linea-tiempo");
linea.innerHTML = `
  <ol class="lineatiempo__puntos">${EXPERIENCIA.map((x, i) => `
    <li><button class="lineatiempo__punto ${i === EXPERIENCIA.length - 1 ? "activo" : ""}" data-exp="${i}">
      <span class="lineatiempo__bola" aria-hidden="true"></span>
      <b>${x.corto}</b><small>${x.fecha}</small></button></li>`).join("")}</ol>
  <div class="lineatiempo__detalle" data-detalle></div>`;
function mostrarExperiencia(i) {
  const x = EXPERIENCIA[i];
  linea.querySelectorAll("[data-exp]").forEach(b => b.classList.toggle("activo", Number(b.dataset.exp) === i));
  linea.querySelector("[data-detalle]").innerHTML = `
    <p class="etiqueta">${x.fecha} · ${x.empresa}</p>
    <h3>${x.cargo}</h3>
    <p>${x.frase}</p>
    <div class="lineatiempo__casos">${x.aptitudes.map(a => `<span class="chip-apt">${a}</span>`).join("")}</div>`;
}
linea.addEventListener("click", (e) => { const b = e.target.closest("[data-exp]"); if (b) mostrarExperiencia(Number(b.dataset.exp)); });
mostrarExperiencia(EXPERIENCIA.length - 1);

// ================= 3h) CERTIFICADOS + VISTA PREVIA =================
document.getElementById("certificados-lista").innerHTML = CERTIFICADOS.map((c, i) => `
  <button class="cert" data-cert="${i}" style="--giro:${[-1.5, 1, -0.5, 1.5, -1][i % 5]}deg">
    <span class="cert__img"><img src="${c.img}" alt="" loading="lazy"></span>
    <b>${c.nombre}</b><small>${c.entidad}</small>
    ${c.nota ? `<span class="cert__nota">${c.nota}</span>` : ""}
  </button>`).join("");
const visor = document.getElementById("visor");
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cert]");
  if (c) {
    const cert = CERTIFICADOS[Number(c.dataset.cert)];
    document.getElementById("visor-img").src = cert.img;
    document.getElementById("visor-img").alt = "Certificado: " + cert.nombre;
    document.getElementById("visor-txt").textContent = `${cert.nombre} · ${cert.entidad}`;
    visor.hidden = false;
    document.body.classList.add("sin-scroll");
  }
  if (e.target.matches("[data-cerrar-visor]") || e.target === visor) {
    visor.hidden = true;
    document.body.classList.remove("sin-scroll");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !visor.hidden) { visor.hidden = true; document.body.classList.remove("sin-scroll"); }
});

// 4) Animación suave: cuando un elemento con clase "aparecer"
//    entra a la pantalla, le agregamos la clase "visible"
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target); // solo anima una vez
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".aparecer").forEach(el => observador.observe(el));
