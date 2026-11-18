/*
  interactivos.js = las piezas interactivas de la página principal:
    1) Barra de progreso arriba
    2) La HOJITA de la portada que se ordena sola
    3) El TABLERO (moodboard) de casos y herramientas
    4) "Una decisión que puedes probar": IGV de bolsillo
    5) El TALLER de herramientas: Excel, Power Query, Power BI, SQL y Python
  Todo con datos ficticios.
*/

const miles = (n) => Math.round(n).toLocaleString("es-PE");
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ======================= 1) BARRA DE PROGRESO =======================
const barra = document.getElementById("progreso");
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  barra.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + "%";
}, { passive: true });


// ======================= 2) HOJITA QUE SE ORDENA SOLA =======================
function iniciarHojita() {
  const caja = document.getElementById("hojita");
  // 3 momentos: datos sueltos → tabla ordenada → decisión
  const etapas = [
    { nombre: "Datos", titulo: "Llegan sueltos", html: `
      <div class="hojita__sueltos">
        ${["PRY-2 · 2,750", "pry-1  4200", "Transporte 480", "PRY-01 / 650", "   3,100 MO", "PRY-02 · 2900", "#N/D", "ene-feb??"]
          .map((t, i) => `<span style="--i:${i}">${t}</span>`).join("")}
      </div>` },
    { nombre: "Orden", titulo: "Se ordenan", html: `
      <div class="hojita__tabla">
        <span>Proyecto</span><span>Categoría</span><span>Monto</span>
        ${[["PRY-01", "Materiales", 4200], ["PRY-01", "Mano de obra", 3100], ["PRY-01", "Transporte", 650],
           ["PRY-02", "Materiales", 2750], ["PRY-02", "Mano de obra", 2900], ["PRY-02", "Transporte", 480]]
          .map((f, i) => `<i style="--i:${i}">${f[0]}</i><i style="--i:${i}">${f[1]}</i><i style="--i:${i}">${miles(f[2])}</i>`).join("")}
      </div>` },
    { nombre: "Decisión", titulo: "Y se decide", html: `
      <div class="hojita__grafico">
        <div class="hojita__barras">
          <div><b style="--h:79%;--i:0"></b><span>PRY-01</span><small>7,950</small></div>
          <div><b style="--h:61%;--i:1"></b><span>PRY-02</span><small>6,130</small></div>
          <em class="hojita__tope">presupuesto</em>
        </div>
        <p>PRY-01 se acerca a su presupuesto: <b>revisar mano de obra.</b></p>
      </div>` }
  ];
  caja.innerHTML = `
    <div class="hojita__barra-sup"><i></i><i></i><i></i><span data-titulo></span></div>
    <div class="hojita__escena" data-escena></div>
    <div class="hojita__nav">
      <button aria-label="Anterior" data-mover="-1">←</button>
      ${etapas.map((e, i) => `<button class="hojita__paso" data-ir="${i}">0${i + 1} ${e.nombre}</button>`).join('<span class="hojita__linea"></span>')}
      <button aria-label="Siguiente" data-mover="1">→</button>
    </div>
    <p class="hojita__ayuda">Usa las flechas · se mueve sola</p>`;

  let actual = 0, timer;
  function mostrar(i) {
    actual = (i + etapas.length) % etapas.length;
    const escena = caja.querySelector("[data-escena]");
    escena.innerHTML = etapas[actual].html;
    escena.className = "hojita__escena hojita__escena--" + actual;
    caja.querySelector("[data-titulo]").textContent = `0${actual + 1} / ${etapas[actual].titulo}`;
    caja.querySelectorAll("[data-ir]").forEach(b => b.classList.toggle("activo", Number(b.dataset.ir) === actual));
  }
  function automatico() {
    clearInterval(timer);
    if (!sinMovimiento) timer = setInterval(() => mostrar(actual + 1), 3800);
  }
  caja.addEventListener("click", (e) => {
    if (e.target.dataset.mover) { mostrar(actual + Number(e.target.dataset.mover)); automatico(); }
    if (e.target.dataset.ir) { mostrar(Number(e.target.dataset.ir)); automatico(); }
  });
  mostrar(0); automatico();
}


// ======================= 3) TABLERO: CASOS Y HERRAMIENTAS UNIDOS CON HILO =======================
const NODOS_HERRAMIENTA = {
  excel:      { nombre: "Excel",        texto: "Bases de datos, BUSCARX, SI, SUMAPRODUCTO, tablas dinámicas y Power Query." },
  powerbi:    { nombre: "Power BI",     texto: "Modelos de datos, medidas en DAX y dashboards por jerarquía." },
  sheets:     { nombre: "Sheets",       texto: "Bases maestras conectadas por código, alimentadas solas." },
  n8n:        { nombre: "n8n",          texto: "Conecta apps y datos para que una tarea repetitiva se haga sola." },
  ia:         { nombre: "IA",           texto: "Integración de IA vía API, extracción de datos con IA y desarrollo asistido por IA." },
  python:     { nombre: "Python",       texto: "Análisis de datos con pandas (cohortes, retención), apps con Streamlit y automatización de tareas." },
  appsscript: { nombre: "Apps Script",  texto: "Sistemas web sobre Google, como el sistema financiero de Endore." },
  web:        { nombre: "HTML / JS",    texto: "Mis propios dashboards y portales, como este portafolio." },
  procesos:   { nombre: "Procesos",     texto: "Mapeo, flujogramas, manuales y checklists." }
};
// Qué herramientas usa cada caso (por id del caso en casos.js)
const CONEXIONES = {
  "financiero-endore": ["appsscript", "web", "ia"],
  "kardex":            ["web", "n8n", "ia", "sheets"],
  "gastos-obra":       ["n8n", "ia", "sheets", "web"],
  "conciliacion":      ["python", "excel", "ia"],
  "precios":           ["excel"],
  "tdr":               ["ia", "web"],
  "clima":             ["powerbi", "excel"],
  "procesos":          ["procesos", "ia"],
  "datamatch":         ["python", "excel", "ia"],
  "retencion":         ["python", "ia"]
};

// Nombre corto de cada caso para su foto en el tablero
const TITULO_CORTO = {
  "financiero-endore": "Flujo de caja", "kardex": "Kárdex de obra", "gastos-obra": "Gastos de obra",
  "conciliacion": "Conciliación", "precios": "Precios", "tdr": "Alertas TDR", "clima": "Clima laboral",
  "procesos": "Manual de procesos", "datamatch": "DataMatch", "retencion": "Retención"
};

function iniciarTablero() {
  const tablero = document.getElementById("tablero");
  const nota = document.getElementById("tablero-nota");
  const mitad = Math.ceil(CASOS.length / 2);

  // Una "polaroid" por caso (con cinta rosa arriba)
  const foto = (caso) => {
    const giro = ((CASOS.indexOf(caso) * 37) % 9) - 4;          // giro "al azar" pero siempre igual
    const imagen = caso.icono
      ? `<img src="${caso.icono}" alt="">`
      : `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[caso.categoria] || ""}</svg>`;
    return `<button class="polaroid" data-id="${caso.id}" data-abrir="${CASOS.indexOf(caso)}" style="--giro:${giro}deg"
              aria-label="${caso.pregunta}">
              <span class="polaroid__foto polaroid__foto--${caso.categoria}">${imagen}</span>
              <span class="polaroid__pie"><b>${caso.numero}</b> ${TITULO_CORTO[caso.id] || caso.area}</span>
            </button>`;
  };
  const herramientas = Object.entries(NODOS_HERRAMIENTA).map(([id, h]) =>
    `<button class="etiqueta-herr" data-herr="${id}">${h.nombre}</button>`).join("");

  tablero.innerHTML = `
    <svg class="tablero__hilos" aria-hidden="true"></svg>
    <div class="tablero__fila">${CASOS.slice(0, mitad).map(foto).join("")}</div>
    <div class="tablero__herramientas">${herramientas}</div>
    <div class="tablero__fila">${CASOS.slice(mitad).map(foto).join("")}</div>`;

  const svg = tablero.querySelector(".tablero__hilos");
  const centro = (el, hacia) => {           // punto de amarre: borde de arriba o de abajo del elemento
    const r = el.getBoundingClientRect(), t = tablero.getBoundingClientRect();
    return { x: r.left - t.left + r.width / 2, y: (hacia === "abajo" ? r.bottom : r.top) - t.top };
  };

  // Dibuja los hilos entre una herramienta y sus casos (o un caso y sus herramientas)
  function hilos(pares) {
    svg.setAttribute("width", tablero.clientWidth);
    svg.setAttribute("height", tablero.clientHeight);
    svg.innerHTML = pares.map(([herr, foto]) => {
      const fotoArriba = foto.getBoundingClientRect().top < herr.getBoundingClientRect().top;
      const a = centro(herr, fotoArriba ? "arriba" : "abajo");
      const b = centro(foto, fotoArriba ? "abajo" : "arriba");
      const medio = (a.y + b.y) / 2 + 18;   // el hilo cuelga un poquito
      return `<path d="M${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${medio} ${b.x} ${b.y}"/><circle cx="${b.x}" cy="${b.y}" r="3"/>`;
    }).join("");
  }

  function resaltar(tipo, id) {
    let pares = [], texto = "";
    if (tipo === "herr") {
      const usos = CASOS.filter(c => (CONEXIONES[c.id] || []).includes(id));
      const h = tablero.querySelector(`[data-herr="${id}"]`);
      pares = usos.map(c => [h, tablero.querySelector(`.polaroid[data-id="${c.id}"]`)]);
      texto = `${NODOS_HERRAMIENTA[id].nombre}: ${NODOS_HERRAMIENTA[id].texto}` + (usos.length ? ` La usé en ${usos.length} caso${usos.length > 1 ? "s" : ""}.` : "");
    } else {
      const caso = CASOS.find(c => c.id === id);
      const f = tablero.querySelector(`.polaroid[data-id="${id}"]`);
      pares = (CONEXIONES[id] || []).map(hid => [tablero.querySelector(`[data-herr="${hid}"]`), f]);
      texto = `${caso.numero} · ${caso.pregunta}`;
    }
    const activos = new Set(pares.flat());
    tablero.classList.add("tablero--foco");
    tablero.querySelectorAll(".polaroid, .etiqueta-herr").forEach(el => el.classList.toggle("activo", activos.has(el)));
    hilos(pares);
    nota.textContent = texto;
  }
  function soltar() {
    tablero.classList.remove("tablero--foco");
    tablero.querySelectorAll(".activo").forEach(el => el.classList.remove("activo"));
    svg.innerHTML = "";
    nota.textContent = "Pasa el mouse por una foto o una herramienta.";
  }

  // Mouse encima = mostrar hilos. Clic en herramienta = dejarla fija. Clic en foto = abre el caso (main.js)
  let fija = null;
  tablero.addEventListener("mouseover", (e) => {
    const el = e.target.closest(".polaroid, .etiqueta-herr");
    if (el) resaltar(el.dataset.herr ? "herr" : "caso", el.dataset.herr || el.dataset.id);
  });
  tablero.addEventListener("mouseleave", () => fija ? resaltar("herr", fija) : soltar());
  tablero.addEventListener("click", (e) => {
    const h = e.target.closest(".etiqueta-herr");
    if (!h) return;
    fija = fija === h.dataset.herr ? null : h.dataset.herr;
    fija ? resaltar("herr", fija) : soltar();
  });
  window.addEventListener("resize", () => fija ? resaltar("herr", fija) : soltar());
}


// ======================= 4) DECISIÓN: IGV DE BOLSILLO =======================
function iniciarDecision(caja) {
  const facturado = 120000, gastoTotal = 52000;     // obra ficticia, montos con IGV
  caja.innerHTML = `
    <div class="decision__cabeza"><span>Gasto con factura</span><b data-pct></b></div>
    <input type="range" min="0" max="100" step="5" value="40" data-sustento aria-label="Porcentaje del gasto con factura">
    <div class="decision__extremos"><span>Todo sin factura</span><span>Todo con factura</span></div>
    <div class="decision__filas">
      <div><span>IGV de lo facturado</span><b data-d="ventas"></b></div>
      <div><span>IGV de compras (crédito fiscal)</span><b data-d="compras"></b></div>
      <div><span>Se paga con la detracción (4%)</span><b data-d="detra"></b></div>
    </div>
    <div class="decision__total"><span>Falta pagar de tu bolsillo</span><b data-d="bolsillo"></b></div>
    <div class="decision__monedas" data-monedas></div>
    <p class="decision__lectura" data-lectura></p>`;
  const slider = caja.querySelector("[data-sustento]");
  function calcular() {
    const pct = Number(slider.value) / 100;
    const igvVentas = facturado - facturado / 1.18;
    const igvCompras = gastoTotal * pct * 0.18 / 1.18;     // solo las facturas dan crédito fiscal
    const detraccion = facturado * 0.04;
    const bolsillo = Math.max(0, igvVentas - igvCompras - detraccion);
    const maximo = igvVentas - detraccion;
    const d = (k, v) => caja.querySelector(`[data-d="${k}"]`).textContent = v;
    caja.querySelector("[data-pct]").textContent = Math.round(pct * 100) + "%";
    d("ventas", "S/ " + miles(igvVentas)); d("compras", "– S/ " + miles(igvCompras));
    d("detra", "– S/ " + miles(detraccion)); d("bolsillo", "S/ " + miles(bolsillo));
    // monedas: cada una son ~S/ 1,000 que salen de tu bolsillo
    const n = Math.round(bolsillo / 1000);
    caja.querySelector("[data-monedas]").innerHTML = Array.from({ length: Math.round(maximo / 1000) },
      (_, i) => `<i class="${i < n ? "llena" : ""}"></i>`).join("");
    caja.querySelector("[data-lectura]").textContent = pct >= 0.8
      ? `Con casi todo facturado, pagas S/ ${miles(bolsillo)}. Pedir factura desde el día 1 es la decisión.`
      : `Cada 10% más de gasto con factura te ahorra S/ ${miles(gastoTotal * 0.1 * 0.18 / 1.18)} de IGV.`;
  }
  slider.addEventListener("input", calcular);
  calcular();
}


// ======================= 5) TALLER DE HERRAMIENTAS =======================
const TABLA = [
  ["G-01", "PRY-01", "Materiales",   4200, 5000],
  ["G-02", "PRY-01", "Mano de obra", 3100, 3000],
  ["G-03", "PRY-02", "Materiales",   2750, 2500],
  ["G-04", "PRY-02", "Transporte",    480,  600],
  ["G-05", "PRY-01", "Transporte",    650,  600],
  ["G-06", "PRY-02", "Mano de obra", 2900, 3200]
];

// Dibuja una hoja tipo Excel. columnas = títulos; filas = arreglo de arreglos
function hojaExcel(columnas, filas, { marcar = () => false, letras = true, numeradas = true } = {}) {
  const abc = "ABCDEFGH";
  const cols = `grid-template-columns: ${numeradas ? "34px " : ""}repeat(${columnas.length}, minmax(80px, 1fr))`;
  let html = "";
  if (letras) html += `<div class="lab__fila lab__fila--letras" style="${cols}">${numeradas ? "<span></span>" : ""}${columnas.map((_, i) => `<span>${abc[i]}</span>`).join("")}</div>`;
  html += `<div class="lab__fila lab__fila--titulos" style="${cols}">${numeradas ? "<span>1</span>" : ""}${columnas.map(t => `<span>${t}</span>`).join("")}</div>`;
  filas.forEach((f, i) => {
    html += `<div class="lab__fila" style="${cols}">${numeradas ? `<span>${i + 2}</span>` : ""}${f.map((v, c) =>
      `<span class="${marcar(i, c) ? "lab__celda--marcada" : ""}">${typeof v === "number" ? miles(v) : v}</span>`).join("")}</div>`;
  });
  return html;
}

const PESTANAS = {
  // ---------- Excel ----------
  excel: {
    nombre: "Excel",
    iniciar(caja) {
      const funciones = [["buscar", "BUSCARV / BUSCARX"], ["si", "SI + Y"], ["sumarsi", "SUMAR.SI.CONJUNTO"], ["contarsi", "CONTAR.SI.CONJUNTO"],
                         ["indice", "INDICE + COINCIDIR"], ["sierror", "SIERROR"], ["formato", "Formato condicional"], ["din", "Tabla dinámica"], ["vba", "Macro VBA · básico"]];
      caja.innerHTML = `
        <div class="lab__botones">${funciones.map(([k, n], i) => `<button class="ej-boton ${i === 0 ? "activo" : ""}" data-f="${k}">${n}</button>`).join("")}</div>
        <div class="lab__control" data-control></div>
        <div class="lab__fx"><span>fx</span><code data-formula></code></div>
        <div data-extra></div>
        <div class="lab__hoja" data-hoja></div>
        <p class="lab__explica" data-explica></p>`;
      let f = "buscar", codigo = "G-03", obra = "PRY-01", categoria = "Transporte", buscado = "G-09";
      const cols = ["Código", "Proyecto", "Categoría", "Monto", "Presupuesto"];
      const q = (s) => caja.querySelector(s);
      const selector = (data, opciones, actual) => `<select class="ej-select" data-${data}>${opciones.map(o => `<option ${o === actual ? "selected" : ""}>${o}</option>`).join("")}</select>`;
      const codigos = TABLA.map(r => r[0]), obras = ["PRY-01", "PRY-02"], cats = [...new Set(TABLA.map(r => r[2]))];

      function mostrar() {
        q("[data-extra]").innerHTML = "";
        if (f === "buscar") {
          q("[data-control]").innerHTML = `Buscar el monto del código ${selector("codigo", codigos, codigo)}`;
          const i = TABLA.findIndex(r => r[0] === codigo);
          q("[data-formula]").textContent = `=BUSCARX("${codigo}"; A2:A7; D2:D7)   ·   =BUSCARV("${codigo}"; A2:E7; 4; FALSO)   →  ${miles(TABLA[i][3])}`;
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA, { marcar: (r, c) => r === i && (c === 0 || c === 3) });
          q("[data-explica]").textContent = "Las dos encuentran el dato; BUSCARX es más flexible porque no depende del número de columna.";
        }
        if (f === "si") {
          q("[data-control]").textContent = "Marcar los gastos de materiales que se pasaron de su presupuesto";
          q("[data-formula]").textContent = `=SI(Y(D2>E2; C2="Materiales"); "Revisar"; "OK")`;
          const filas = TABLA.map(r => [...r, r[3] > r[4] && r[2] === "Materiales" ? "Revisar" : "OK"]);
          q("[data-hoja]").innerHTML = hojaExcel([...cols, "Estado"], filas, { marcar: (r, c) => c === 5 && filas[r][5] === "Revisar" });
          q("[data-explica]").textContent = "Con Y se cumplen las dos condiciones; con O, basta una.";
        }
        if (f === "sumarsi") {
          q("[data-control]").innerHTML = `Total de ${selector("cat", cats, categoria)} en ${selector("obra", obras, obra)}`;
          const total = TABLA.filter(r => r[1] === obra && r[2] === categoria).reduce((s, r) => s + r[3], 0);
          q("[data-formula]").textContent = `=SUMAR.SI.CONJUNTO(D2:D7; B2:B7; "${obra}"; C2:C7; "${categoria}")  →  ${miles(total)}`;
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA, { marcar: (r, c) => TABLA[r][1] === obra && TABLA[r][2] === categoria && [1, 2, 3].includes(c) });
          q("[data-explica]").textContent = "Suma solo las filas que cumplen todas las condiciones.";
        }
        if (f === "contarsi") {
          q("[data-control]").innerHTML = `¿Cuántos gastos de más de S/ 1,000 tiene ${selector("obra", obras, obra)}?`;
          const n = TABLA.filter(r => r[1] === obra && r[3] > 1000).length;
          q("[data-formula]").textContent = `=CONTAR.SI.CONJUNTO(B2:B7; "${obra}"; D2:D7; ">1000")  →  ${n}`;
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA, { marcar: (r, c) => TABLA[r][1] === obra && TABLA[r][3] > 1000 && (c === 1 || c === 3) });
          q("[data-explica]").textContent = "Cuenta las filas que cumplen todas las condiciones.";
        }
        if (f === "indice") {
          q("[data-control]").innerHTML = `Presupuesto del código ${selector("codigo", codigos, codigo)}`;
          const i = TABLA.findIndex(r => r[0] === codigo);
          q("[data-formula]").textContent = `=INDICE(E2:E7; COINCIDIR("${codigo}"; A2:A7; 0))  →  ${miles(TABLA[i][4])}`;
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA, { marcar: (r, c) => r === i && (c === 0 || c === 4) });
          q("[data-explica]").textContent = "COINCIDIR encuentra la fila; INDICE trae el dato de esa fila. Funciona aunque la columna buscada esté a la derecha.";
        }
        if (f === "sierror") {
          q("[data-control]").innerHTML = `Buscar el código ${selector("buscado", [...codigos, "G-09"], buscado)}`;
          const r = TABLA.find(x => x[0] === buscado);
          q("[data-formula]").textContent = `=SIERROR(BUSCARX("${buscado}"; A2:A7; D2:D7); "No existe")  →  ${r ? miles(r[3]) : "No existe"}`;
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA, { marcar: (i, c) => r && TABLA[i][0] === buscado && (c === 0 || c === 3) });
          q("[data-explica]").textContent = "Sin SIERROR saldría #N/D. Con SIERROR, el reporte queda limpio.";
        }
        if (f === "formato") {
          q("[data-control]").textContent = "Inicio → Formato condicional → Nueva regla → Usar una fórmula";
          q("[data-formula]").textContent = "=$D2>$E2   (relleno rosa: el gasto se pasó del presupuesto)";
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA, { marcar: (r, c) => TABLA[r][3] > TABLA[r][4] && c >= 3 });
          q("[data-explica]").textContent = "La tabla se pinta sola: lo que necesita atención salta a la vista.";
        }
        if (f === "din") {
          q("[data-control]").textContent = "Resumen por categoría y proyecto";
          q("[data-formula]").textContent = "Insertar → Tabla dinámica  (Filas: Categoría · Columnas: Proyecto · Valores: Suma de Monto)";
          const s = (c, o) => TABLA.filter(r => r[2] === c && r[1] === o).reduce((a, r) => a + r[3], 0);
          const filas = cats.map(c => [c, ...obras.map(o => s(c, o)), obras.reduce((a, o) => a + s(c, o), 0)]);
          filas.push(["Total", ...obras.map(o => cats.reduce((a, c) => a + s(c, o), 0)), TABLA.reduce((a, r) => a + r[3], 0)]);
          q("[data-hoja]").innerHTML = hojaExcel(["Categoría", ...obras, "Total"], filas, { letras: false, numeradas: false, marcar: (r, c) => c === 3 || r === filas.length - 1 });
          q("[data-explica]").textContent = "Seis filas se vuelven un resumen en segundos. Con miles de filas, es lo mismo.";
        }
        if (f === "vba") {
          q("[data-control]").textContent = "Una macro sencilla para no repetir lo mismo cada semana";
          q("[data-formula]").textContent = "Desarrollador → Macros → OrdenarYMarcar → Ejecutar";
          q("[data-extra]").innerHTML = `<div class="codigo"><pre>Sub OrdenarYMarcar()
    Range("A1:E7").Sort Key1:=Range("D1"), _
        Order1:=xlDescending, Header:=xlYes
    For Each celda In Range("D2:D7")
        If celda.Value > celda.Offset(0, 1).Value Then
            celda.Interior.Color = RGB(233, 201, 198)
        End If
    Next celda
End Sub</pre><button class="ej-boton ej-boton--principal" data-vba>▶ Ejecutar</button></div>`;
          q("[data-hoja]").innerHTML = hojaExcel(cols, TABLA);
          q("[data-explica]").textContent = "Ordena de mayor a menor y pinta lo que se pasó, en un clic. Las macros las armo con apoyo de IA.";
          q("[data-vba]").addEventListener("click", () => {
            const orden = [...TABLA].sort((a, b) => b[3] - a[3]);
            q("[data-hoja]").innerHTML = hojaExcel(cols, orden, { marcar: (r, c) => c === 3 && orden[r][3] > orden[r][4] });
          });
        }
      }
      caja.addEventListener("click", (e) => {
        if (!e.target.dataset.f) return;
        f = e.target.dataset.f;
        caja.querySelectorAll("[data-f]").forEach(b => b.classList.toggle("activo", b.dataset.f === f));
        mostrar();
      });
      caja.addEventListener("change", (e) => {
        if (e.target.matches("[data-codigo]")) codigo = e.target.value;
        if (e.target.matches("[data-obra]")) obra = e.target.value;
        if (e.target.matches("[data-cat]")) categoria = e.target.value;
        if (e.target.matches("[data-buscado]")) buscado = e.target.value;
        mostrar();
      });
      mostrar();
    }
  },

  // ---------- Power Query ----------
  powerquery: {
    nombre: "Power Query",
    iniciar(caja) {
      // Base de encuesta "fea", como llegaba de verdad: preguntas en columnas
      const original = [
        ["Sondeo de clima 2026 · % favorable", "", "", ""],
        ["", "", "", ""],
        ["Área", "P01", "P02", "P03"],
        ["Créditos", "86", "79", "91"],
        ["Cobranzas", "72", "68", "80"]
      ];
      const preg = ["P01", "P02", "P03"];
      const pasos = [
        { nombre: "Origen", m: 'Excel.Workbook(File.Contents("sondeo.xlsx"))', aplicar: () => ({ cols: ["Column1", "Column2", "Column3", "Column4"], filas: original }) },
        { nombre: "Filas superiores quitadas", m: "Table.Skip(Origen, 2)", aplicar: () => ({ cols: ["Column1", "Column2", "Column3", "Column4"], filas: original.slice(2) }) },
        { nombre: "Encabezados promovidos", m: 'Table.PromoteHeaders(#"Filas superiores quitadas")', aplicar: () => ({ cols: original[2], filas: original.slice(3) }) },
        { nombre: "Columnas de anulación de dinamización", m: 'Table.UnpivotOtherColumns(#"Encabezados promovidos", {"Área"}, "Pregunta", "Favorable")',
          aplicar: () => ({ cols: ["Área", "Pregunta", "Favorable"], filas: original.slice(3).flatMap(r => preg.map((q, i) => [r[0], q, r[i + 1]])) }) },
        { nombre: "Tipo cambiado", m: 'Table.TransformColumnTypes(#"Columnas de anulación…", {{"Favorable", Percentage.Type}})',
          aplicar: () => ({ cols: ["Área", "Pregunta", "Favorable"], filas: original.slice(3).flatMap(r => preg.map((q, i) => [r[0], q, r[i + 1] + "%"])) }) }
      ];
      caja.innerHTML = `
        <div class="pq">
          <div>
            <div class="lab__fx"><span>fx</span><code data-m></code></div>
            <div class="lab__hoja" data-hoja></div>
            <p class="lab__explica" data-explica></p>
          </div>
          <div class="pq__pasos"><p class="etiqueta">Pasos aplicados</p>
            ${pasos.map((p, i) => `<button class="pq__paso" data-paso="${i}">${p.nombre}</button>`).join("")}
            <button class="ej-boton ej-boton--principal pq__play" data-play>▶ Aplicar todos</button>
          </div>
        </div>`;
      function mostrar(i) {
        const { cols, filas } = pasos[i].aplicar();
        caja.querySelector("[data-m]").textContent = "= " + pasos[i].m;
        caja.querySelector("[data-hoja]").innerHTML = hojaExcel(cols, filas, { letras: false, marcar: (r, c) => i === 4 && c === 2 });
        caja.querySelectorAll("[data-paso]").forEach((b, k) => { b.classList.toggle("activo", k === i); b.classList.toggle("hecho", k < i); });
        caja.querySelector("[data-explica]").textContent = i === 0 ? "Así llegaban las bases del sondeo: títulos arriba, filas vacías y cada pregunta en una columna."
          : i === 4 ? "Lista para Power BI: así preparaba las bases del sondeo de clima. Con nuevos datos, se actualiza con un clic." : "";
      }
      caja.addEventListener("click", (e) => {
        if (e.target.dataset.paso) mostrar(Number(e.target.dataset.paso));
        if (e.target.matches("[data-play]")) pasos.forEach((_, i) => setTimeout(() => mostrar(i), i * 700));
      });
      mostrar(0);
    }
  },

  // ---------- Power BI (recreación con datos ficticios) ----------
  powerbi: {
    nombre: "Power BI",
    iniciar(caja) {
      const dims = ["Credibilidad", "Respeto", "Imparcialidad", "Camaradería", "Orgullo"];
      const unidades = {
        "Institucional": { part: 91, v: [86, 84, 80, 89, 88] },
        "Zona Norte":    { part: 93, v: [88, 85, 81, 91, 90] },
        "Zona Centro":   { part: 86, v: [76, 72, 66, 80, 77] },
        "Sede 08":    { part: 78, v: [68, 62, 58, 72, 69] }
      };
      caja.innerHTML = `
        <div class="pbi">
          <div class="pbi__cabeza"><b>Sondeo de clima laboral</b>
            <select class="ej-select" data-unidad>${Object.keys(unidades).map(u => `<option>${u}</option>`).join("")}</select>
          </div>
          <div class="pbi__cuerpo">
            <div class="pbi__tarjeta"><span>Nivel de satisfacción</span><svg viewBox="0 0 120 70" class="pbi__medidor"><path d="M10 62 A50 50 0 0 1 110 62" class="pbi__fondo"/><path d="M10 62 A50 50 0 0 1 110 62" class="pbi__valor" data-arco/></svg><b data-sat></b><small data-semaforo></small></div>
            <div class="pbi__tarjeta"><span>Participación</span><b data-part></b><small data-vs></small></div>
            <div class="pbi__tarjeta pbi__tarjeta--ancha"><span>Resultado por dimensión</span><div data-barras></div></div>
          </div>
          <p class="pbi__nota">Recreación del dashboard que hice en Power BI, con datos ficticios. El real era mucho más grande.</p>
        </div>`;
      const sem = (v) => v >= 85 ? ["Impulsor", "#1E1A18"] : v >= 70 ? ["Formativo", "#C98F98"] : ["Restrictivo", "#9E3B4D"];
      function mostrar(nombre) {
        const u = unidades[nombre], sat = Math.round(u.v.reduce((a, b) => a + b) / u.v.length);
        const inst = Math.round(unidades.Institucional.v.reduce((a, b) => a + b) / 5);
        const arco = caja.querySelector("[data-arco]");
        const largo = arco.getTotalLength();
        arco.style.strokeDasharray = largo; arco.style.strokeDashoffset = largo * (1 - sat / 100);
        arco.style.stroke = sem(sat)[1];
        caja.querySelector("[data-sat]").textContent = sat + "%";
        caja.querySelector("[data-semaforo]").textContent = sem(sat)[0];
        caja.querySelector("[data-part]").textContent = u.part + "%";
        caja.querySelector("[data-vs]").textContent = nombre === "Institucional" ? "de los colaboradores" : `${sat - inst >= 0 ? "+" : ""}${sat - inst} pts vs. institucional`;
        const orden = dims.map((d, i) => [d, u.v[i]]).sort((a, b) => b[1] - a[1]);
        caja.querySelector("[data-barras]").innerHTML = orden.map(([d, v]) =>
          `<div class="ej-barra"><span>${d}</span><div class="ej-barra__fondo"><div class="ej-barra__relleno" style="width:${v}%;background:${sem(v)[1]}"></div></div><b>${v}%</b></div>`).join("");
      }
      caja.querySelector("[data-unidad]").addEventListener("change", (e) => mostrar(e.target.value));
      mostrar("Institucional");
    }
  },

  // ---------- SQL (básico) ----------
  sql: {
    nombre: "SQL · básico",
    iniciar(caja) {
      const consultas = {
        where: { boton: "WHERE", sql: "SELECT codigo, categoria, monto\nFROM gastos\nWHERE proyecto = 'PRY-02';",
          correr: () => ({ cols: ["codigo", "categoria", "monto"], filas: TABLA.filter(r => r[1] === "PRY-02").map(r => [r[0], r[2], r[3]]) }) },
        group: { boton: "GROUP BY", sql: "SELECT categoria, SUM(monto) AS total\nFROM gastos\nGROUP BY categoria;",
          correr: () => { const m = {}; TABLA.forEach(r => m[r[2]] = (m[r[2]] || 0) + r[3]); return { cols: ["categoria", "total"], filas: Object.entries(m) }; } },
        order: { boton: "ORDER BY", sql: "SELECT codigo, proyecto, monto\nFROM gastos\nORDER BY monto DESC;",
          correr: () => ({ cols: ["codigo", "proyecto", "monto"], filas: [...TABLA].sort((a, b) => b[3] - a[3]).map(r => [r[0], r[1], r[3]]) }) }
      };
      caja.innerHTML = `
        <div class="lab__botones">${Object.entries(consultas).map(([k, c], i) => `<button class="ej-boton ${i === 0 ? "activo" : ""}" data-q="${k}">${c.boton}</button>`).join("")}</div>
        <div class="codigo"><pre data-sql></pre><button class="ej-boton ej-boton--principal" data-run>▶ Ejecutar</button></div>
        <div class="lab__hoja" data-hoja></div>`;
      let actual = "where";
      const correr = () => { const r = consultas[actual].correr(); caja.querySelector("[data-hoja]").innerHTML = hojaExcel(r.cols, r.filas, { letras: false }); };
      function elegir(k) {
        actual = k;
        caja.querySelectorAll("[data-q]").forEach(b => b.classList.toggle("activo", b.dataset.q === k));
        caja.querySelector("[data-sql]").textContent = consultas[k].sql;
        caja.querySelector("[data-hoja]").innerHTML = `<p class="ej-pista">Presiona Ejecutar.</p>`;
      }
      caja.addEventListener("click", (e) => { if (e.target.dataset.q) elegir(e.target.dataset.q); if (e.target.matches("[data-run]")) correr(); });
      elegir("where");
    }
  },

  // ---------- Python: retención (Endore) y limpieza de nombres (DataMatch) ----------
  python: {
    nombre: "Python",
    iniciar(caja) {
      caja.innerHTML = `
        <div class="lab__botones">
          <button class="ej-boton activo" data-py="retencion">Retención de clientes (pandas)</button>
          <button class="ej-boton" data-py="adn">Limpieza de nombres (DataMatch)</button>
        </div>
        <div data-py-panel></div>`;
      const panel = caja.querySelector("[data-py-panel]");
      const adn = (t) => t.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9\s]/g, " ").split(/\s+/).filter(Boolean).sort().join(" ");
      const vistas = {
        retencion() {
          panel.innerHTML = `
            <div class="py">
              <pre class="codigo__bloque"><span class="py__c"># Solo visitas reales: no anuladas y con comprobante</span>
pagadas = df[(df["Estado"] != "Anulado") &amp;
             (df["Estado Comprobante"] == "Registrado")]

<span class="py__c"># 1 cliente en 1 día = 1 visita</span>
visitas = pagadas.drop_duplicates(["cod_cliente", "dia"])

<span class="py__c"># Cohortes: % que vuelve cada mes según su mes de llegada</span>
tabla = visitas.pivot_table(index="cohorte", columns="mes_n",
                            values="cod_cliente", aggfunc="nunique")
retencion = (tabla.div(tabla[0], axis=0) * 100).round(1)

<span class="py__c"># Control real = vuelve 21+ días después</span>
visitas["dias"] = visitas.groupby("cod_cliente")["dia"].diff().dt.days
visitas["es_control"] = visitas["dias"] >= 21</pre>
              <div class="py__prueba">
                <p class="ej-pista">Salida (datos ficticios):</p>
                <div class="consola" data-consola></div>
                <button class="ej-boton ej-boton--principal" data-correr>▶ Ejecutar</button>
                <p class="lab__explica">El paso clave: separar el control real del "mismo episodio". Sin eso, la retención se ve mucho mejor de lo que es.</p>
              </div>
            </div>`;
          const salida = [">>> retencion.head()", "cohorte  mes_1  mes_2  mes_3", "2026-01   31.0   36.0   33.0", "2026-02   35.0   33.0   31.0", "2026-03   34.0   32.0     -", "", ">>> print(f\"Vuelven a control: {volvio.mean():.0%}\")", "Vuelven a control: 34%"];
          panel.querySelector("[data-correr]").addEventListener("click", () => {
            const c = panel.querySelector("[data-consola]"); c.textContent = "";
            salida.forEach((l, i) => setTimeout(() => c.textContent += l + "\n", i * 180));
          });
        },
        adn() {
          panel.innerHTML = `
            <div class="py">
              <pre class="codigo__bloque"><span class="py__c"># Mi función de DataMatch: deja cada nombre en su "ADN"</span>
def super_limpieza_adn(texto):
    texto = str(texto).upper()
    texto = "".join(c for c in unicodedata.normalize("NFKD", texto)
                    if not unicodedata.combining(c))
    texto = re.sub(r"[^A-Z0-9\\s]", " ", texto)
    return " ".join(sorted(texto.split())).strip()</pre>
              <div class="py__prueba">
                <label>Escribe un nombre como venga:<input type="text" value="Pérez, Juan" data-nombre maxlength="60"></label>
                <div class="py__ejemplos">${["Pérez, Juan", "JUAN PEREZ", "juan  pérez.", "Rodríguez-Carla"].map(n => `<button class="chip-caso" data-ej="${n}">${n}</button>`).join("")}</div>
                <p class="ej-pista">Resultado:</p>
                <p class="py__salida" data-salida></p>
                <p class="lab__explica">Escritos distinto, con el mismo ADN: así DataMatch sabe que son la misma persona.</p>
              </div>
            </div>`;
          const entrada = panel.querySelector("[data-nombre]");
          const mostrar = () => panel.querySelector("[data-salida]").textContent = `"${adn(entrada.value) || "—"}"`;
          entrada.addEventListener("input", mostrar);
          panel.addEventListener("click", (e) => { if (e.target.dataset.ej) { entrada.value = e.target.dataset.ej; mostrar(); } });
          mostrar();
        }
      };
      caja.addEventListener("click", (e) => {
        const v = e.target.dataset.py;
        if (!v) return;
        caja.querySelectorAll("[data-py]").forEach(b => b.classList.toggle("activo", b.dataset.py === v));
        vistas[v]();
      });
      vistas.retencion();
    }
  },
  // ---------- Finanzas: IGV de bolsillo ----------
  finanzas: {
    nombre: "Finanzas · IGV",
    iniciar(caja) {
      caja.innerHTML = `
        <p class="lab__explica">¿Cuánto IGV pagas de tu bolsillo? Mueve cuánto del gasto de un proyecto tiene factura. Proyecto ficticio.</p>
        <div class="decision__caja" data-igv></div>`;
      iniciarDecision(caja.querySelector("[data-igv]"));
    }
  }
};

function iniciarTaller() {
  const taller = document.getElementById("taller");
  taller.innerHTML = `
    <div class="taller__pestanas" role="tablist">${Object.entries(PESTANAS).map(([k, p]) =>
      `<button role="tab" class="taller__pestana" data-tab="${k}" aria-expanded="false">${p.nombre}</button>`).join("")}</div>
    <div class="taller__panel" data-panel hidden></div>`;
  let abierta = null;
  function abrir(k) {
    const panel = taller.querySelector("[data-panel]");
    const nuevo = panel.cloneNode(false);          // panel limpio, sin eventos de la pestaña anterior
    panel.replaceWith(nuevo);
    abierta = abierta === k ? null : k;            // tocar la misma la cierra
    taller.querySelectorAll("[data-tab]").forEach(b => {
      b.classList.toggle("activo", b.dataset.tab === abierta);
      b.setAttribute("aria-expanded", b.dataset.tab === abierta);
    });
    taller.classList.toggle("abierto", !!abierta);
    nuevo.hidden = !abierta;
    if (abierta) PESTANAS[abierta].iniciar(nuevo);
  }
  taller.querySelector(".taller__pestanas").addEventListener("click", (e) => { if (e.target.dataset.tab) abrir(e.target.dataset.tab); });
}

iniciarHojita();
iniciarTaller();
