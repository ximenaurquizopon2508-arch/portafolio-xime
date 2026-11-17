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

// 2) Pintar TODOS los casos en la sección "Casos", con filtros
const lista = document.getElementById("lista-casos");
lista.innerHTML = CASOS.map(crearTarjeta).join("");

const filtros = document.getElementById("filtros-casos");
const categorias = ["todo", ...new Set(CASOS.map(c => c.categoria))];
filtros.innerHTML = categorias.map(cat =>
  `<button class="filtro ${cat === "todo" ? "activo" : ""}" data-filtro="${cat}">${cat === "todo" ? "Todo" : NOMBRE_CATEGORIA[cat]}</button>`).join("");

function filtrar(cat) {
  let visibles = 0;
  lista.querySelectorAll(".tarjeta").forEach(t => {
    const ver = cat === "todo" || t.dataset.categoria === cat;
    t.hidden = !ver;
    if (ver) visibles++;
  });
  filtros.querySelectorAll("[data-filtro]").forEach(b => b.classList.toggle("activo", b.dataset.filtro === cat));
  document.getElementById("contador-casos").textContent = `${String(visibles).padStart(2, "0")} / ${String(CASOS.length).padStart(2, "0")} preguntas`;
}
filtros.addEventListener("click", (e) => { if (e.target.dataset.filtro) filtrar(e.target.dataset.filtro); });
filtrar("todo");

// 3) Pintar SOLO los destacados en la portada
const destacados = document.getElementById("destacados");
destacados.innerHTML = CASOS.filter(caso => caso.destacado).map(crearDestacado).join("");

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
      <p class="etiqueta">Un caso para entenderlo</p>
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
function abrirFicha(indice) {
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
  const tarjeta = evento.target.closest(".tarjeta");
  if (tarjeta) abrirFicha(Number(tarjeta.dataset.indice));
});

// Enter sobre una tarjeta (para quien navega con teclado)
document.addEventListener("keydown", (evento) => {
  const tarjeta = evento.target.closest?.(".tarjeta");
  if (tarjeta && evento.key === "Enter") abrirFicha(Number(tarjeta.dataset.indice));
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

// 3e) Experiencia: cada trabajo muestra sus casos como botones
document.querySelectorAll("[data-casos]").forEach(caja => {
  caja.innerHTML = caja.dataset.casos.split(",").map(id => {
    const indice = CASOS.findIndex(c => c.id === id.trim());
    if (indice < 0) return "";                      // si borras un caso, su botón desaparece solo
    const caso = CASOS[indice];
    return `<button class="chip-caso" data-abrir="${indice}">
              <span class="oro">${caso.numero}</span> ${caso.pregunta}</button>`;
  }).join("");
});
document.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-abrir]");
  if (boton) abrirFicha(Number(boton.dataset.abrir));
  const porId = e.target.closest("[data-abrir-id]");
  if (porId) abrirFicha(CASOS.findIndex(c => c.id === porId.dataset.abrirId));
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
