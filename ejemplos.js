/*
  ejemplos.js = los EJEMPLOS INTERACTIVOS de cada ficha.
  Todos usan DATOS FICTICIOS.

  Cada ejemplo está guardado con el id de su caso ("kardex", "tdr"...) y tiene:
    html     → lo que se dibuja
    iniciar  → lo que lo hace interactivo (botones, sliders...)

  Si un caso nuevo no tiene ejemplo aquí, la ficha simplemente
  muestra el espacio vacío. No se rompe nada.
*/

// Ayudita para mostrar soles bonitos: 12345 → "S/ 12,345"
const soles = (n) => "S/ " + Math.round(n).toLocaleString("es-PE");

const EJEMPLOS = {

  // ============ SISTEMA FINANCIERO ENDORE ============
  "financiero-endore": {
    html: () => `
      <div class="ej-botones">
        <button class="ej-boton activo" data-vista="antes">Antes: flujo de caja</button>
        <button class="ej-boton" data-vista="semaforo">Semáforo del mes</button>
        <button class="ej-boton" data-vista="servicios">Ganancia por servicio</button>
      </div>

      <div data-panel="antes" class="ej-panel">
        <p class="ej-titulo">Cierre de mes · clínica ficticia</p>
        <div class="ej-fila"><span>Entró</span><b>${soles(62000)}</b></div>
        <div class="ej-fila"><span>Salió</span><b>${soles(58500)}</b></div>
        <div class="ej-fila ej-fila--total"><span>Saldo</span><b>${soles(3500)}</b></div>
        <p class="ej-pista">¿Fue un buen mes? ¿Qué servicio dejó plata? ¿Qué cambiar? Con esto, no se sabe.</p>
      </div>

      <div data-panel="semaforo" class="ej-panel" hidden>
        <div class="ej-control">
          <span>Mes:</span>
          <select class="ej-select" data-mes>
            <option value="0">Agosto</option><option value="1">Septiembre</option><option value="2" selected>Octubre</option>
          </select>
        </div>
        <div class="sem" data-sem></div>
        <p class="ej-resultado" data-sem-resumen></p>
      </div>

      <div data-panel="servicios" class="ej-panel" hidden>
        <p class="ej-titulo">Lo que queda de cada servicio · después de IGV y tarjeta</p>
        <div class="serv" data-serv></div>
        <div class="ej-control">
          <span>Precio de la bioimpedancia:</span>
          <input type="range" min="40" max="120" step="5" value="70" data-precio>
          <b data-precio-txt></b>
        </div>
        <p class="ej-resultado" data-serv-resumen></p>
      </div>
    `,
    iniciar: (raiz) => {
      // ---------- Semáforo: datos ficticios por mes ----------
      // [indicador, meta, tipo ("min" = mayor o igual es bueno, "max" = menor o igual), valores por mes]
      const INDICADORES = [
        ["Margen EBITDA", 15, "min", [12.4, 16.8, 18.1]],
        ["Margen de seguridad", 10, "min", [4.2, 8.9, 12.5]],
        ["% pacientes que regresan", 50, "min", [41.0, 47.5, 53.2]],
        ["Crecimiento vs. mes anterior", 3, "min", [1.1, 5.4, 2.6]],
        ["Comisión de tarjeta / ingresos", 2.2, "max", [2.9, 2.4, 2.1]],
        ["Personal / ingresos", 12, "max", [13.8, 11.6, 10.9]]
      ];
      const estado = (valor, meta, tipo) => {
        const bien = tipo === "min" ? valor >= meta : valor <= meta;
        if (bien) return "ok";
        const distancia = Math.abs(valor - meta) / meta;
        return distancia <= 0.15 ? "alerta" : "critico";
      };
      const TEXTO = { ok: "OK", alerta: "ALERTA", critico: "CRÍTICO" };

      function pintarSemaforo() {
        const mes = Number(raiz.querySelector("[data-mes]").value);
        const conteo = { ok: 0, alerta: 0, critico: 0 };
        const filas = INDICADORES.map(([nombre, meta, tipo, valores]) => {
          const v = valores[mes], e = estado(v, meta, tipo);
          conteo[e]++;
          return `<div class="sem__fila"><span>${nombre}</span><span>${v.toFixed(1)}%</span>
            <span>${tipo === "min" ? "≥" : "≤"} ${meta}%</span><span class="sem__pill sem__pill--${e}">${TEXTO[e]}</span></div>`;
        }).join("");
        raiz.querySelector("[data-sem]").innerHTML =
          `<div class="sem__fila sem__fila--cabeza"><span>Indicador</span><span>Mes</span><span>Meta</span><span>Estado</span></div>` + filas;
        const peor = INDICADORES.find(([, meta, tipo, valores]) => estado(valores[mes], meta, tipo) === "critico");
        raiz.querySelector("[data-sem-resumen]").textContent = peor
          ? `${conteo.ok} en verde, ${conteo.critico} en rojo. Primera decisión: atacar "${peor[0].toLowerCase()}".`
          : `${conteo.ok} en verde y ${conteo.alerta} en alerta: un buen mes, a cuidar lo que está en amarillo.`;
      }
      raiz.querySelector("[data-mes]").addEventListener("change", pintarSemaforo);
      pintarSemaforo();

      // ---------- Ganancia por servicio ----------
      const IGV = 0.18, TARJETA = 0.025;
      // [servicio, cobrado (con IGV), costo directo]; la bioimpedancia se calcula con el precio del control
      const FIJOS = [["Consultas", 30000, 20500], ["Laboratorio", 21000, 16900], ["Imagenología", 4200, 2500]];
      const BIO = { cantidad: 60, costoUnitario: 38 };

      function pintarServicios() {
        const precio = Number(raiz.querySelector("[data-precio]").value);
        raiz.querySelector("[data-precio-txt]").textContent = soles(precio);
        const filas = [...FIJOS, ["Bioimpedancia", BIO.cantidad * precio, BIO.cantidad * BIO.costoUnitario]]
          .map(([nombre, cobrado, costo]) => {
            const queda = cobrado / (1 + IGV) - cobrado * TARJETA - costo;
            return { nombre, queda, margen: queda / cobrado * 100 };
          });
        const maximo = Math.max(...filas.map(f => Math.abs(f.queda)), 1);
        raiz.querySelector("[data-serv]").innerHTML = filas.map(f => `
          <div class="serv__fila"><span>${f.nombre}</span>
            <div class="serv__barra"><div style="width:${Math.max(f.queda, 0) / maximo * 100}%"></div></div>
            <b>${soles(Math.round(f.queda))}</b></div>`).join("");
        const bio = filas[3];
        raiz.querySelector("[data-serv-resumen]").textContent = bio.queda <= 0
          ? `A ${soles(precio)}, cada bioimpedancia pierde plata: el IGV y la tarjeta se comen el margen.`
          : `A ${soles(precio)}, a la bioimpedancia le queda ${bio.margen.toFixed(0)}% de lo cobrado.`;
      }
      raiz.querySelector("[data-precio]").addEventListener("input", pintarServicios);
      pintarServicios();

      // ---------- Pestañas ----------
      raiz.addEventListener("click", (e) => {
        const vista = e.target.dataset.vista;
        if (!vista) return;
        raiz.querySelectorAll("[data-vista]").forEach(b => b.classList.toggle("activo", b.dataset.vista === vista));
        raiz.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== vista);
      });
    }
  },

  // ============ KÁRDEX: ENTRADA / SALIDA / CONTEO ============
  "kardex": {
    html: () => `
      <div class="ej-botones">
        <button class="ej-boton activo" data-vista="entrada">↓ Entrada</button>
        <button class="ej-boton" data-vista="salida">↑ Salida</button>
        <button class="ej-boton" data-vista="conteo">☑ Conteo</button>
      </div>

      <div data-panel="entrada" class="ej-panel">
        <p class="ej-titulo">Llegó material · factura ficticia</p>
        <button class="ej-boton ej-boton--principal" data-leer>Leer factura</button>
        <div data-lectura></div>
      </div>

      <div data-panel="salida" class="ej-panel" hidden>
        <p class="ej-titulo">Salió material · solo lo que hay en stock</p>
        <div data-stock></div>
        <p class="ej-pista">Toca "Retirar 10" varias veces.</p>
      </div>

      <div data-panel="conteo" class="ej-panel" hidden>
        <p class="ej-titulo">Conteo del día · cemento</p>
        <label class="ej-slider"><span>Cantidad física contada: <b data-contado></b></span>
          <input type="range" min="50" max="80" step="1" value="70" data-slider></label>
        <div class="ej-kpis">
          <div class="ej-kpi"><span>Sistema</span><b data-sistema></b></div>
          <div class="ej-kpi"><span>Conteo</span><b data-conteo></b></div>
          <div class="ej-kpi"><span>Diferencia</span><b data-diferencia></b></div>
        </div>
      </div>
      <p class="ej-resultado" data-resumen></p>
    `,
    iniciar: (raiz) => {
      // Stock ficticio de una obra
      const stock = { "Cemento (bolsas)": 70, "Fierro 1/2\" (varillas)": 40, "Clavos 2 1/2\" (kg)": 5 };
      const resumen = raiz.querySelector("[data-resumen]");

      // --- Pestañas ---
      raiz.addEventListener("click", (e) => {
        const vista = e.target.dataset.vista;
        if (!vista) return;
        raiz.querySelectorAll("[data-vista]").forEach(b => b.classList.toggle("activo", b.dataset.vista === vista));
        raiz.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== vista);
        resumen.textContent = "";
        if (vista === "salida") pintarStock();
        if (vista === "conteo") contar();
      });

      // --- Entrada: "leer" la factura (simulación del OCR) ---
      raiz.querySelector("[data-leer]").addEventListener("click", (e) => {
        e.target.disabled = true;
        const lectura = raiz.querySelector("[data-lectura]");
        const datos = [
          ["Proveedor", "Ferretería Ficticia S.A.C."], ["RUC", "20600000001"], ["Documento", "F001-000123"],
          ["Cemento (bolsas)", "+20 · " + soles(32) + " c/u"], ["Clavos 2 1/2\" (kg)", "+10 · " + soles(6) + " c/u"]
        ];
        lectura.innerHTML = "";
        datos.forEach(([campo, valor], i) => setTimeout(() => {
          lectura.insertAdjacentHTML("beforeend", `<div class="ej-fila ej-fila--ok"><span>${campo}</span><b>${valor}</b></div>`);
        }, 300 * (i + 1)));
        setTimeout(() => {
          stock["Cemento (bolsas)"] += 20; stock["Clavos 2 1/2\" (kg)"] += 10;
          resumen.textContent = "Factura leída y stock actualizado, sin escribir nada a mano.";
        }, 300 * (datos.length + 1));
      });

      // --- Salida: no deja retirar más de lo que hay ---
      function pintarStock() {
        // usamos la posición (0, 1, 2) en el botón, porque los nombres tienen comillas (1/2")
        raiz.querySelector("[data-stock]").innerHTML = Object.entries(stock).map(([material, cant], i) => `
          <div class="ej-tarea"><div><b>${material}</b><small>Disponible: ${cant}</small></div>
          <button class="ej-boton" data-retirar="${i}">Retirar 10</button></div>`).join("");
      }
      raiz.querySelector("[data-stock]").addEventListener("click", (e) => {
        const posicion = e.target.dataset.retirar;
        if (posicion === undefined) return;
        const material = Object.keys(stock)[posicion];
        if (stock[material] >= 10) {
          stock[material] -= 10;
          resumen.textContent = `Salida registrada: 10 de ${material.toLowerCase()}.`;
        } else {
          resumen.textContent = `⚠ No se puede: solo quedan ${stock[material]}. Nadie retira lo que no existe.`;
        }
        pintarStock();
      });

      // --- Conteo: sistema vs. físico ---
      const slider = raiz.querySelector("[data-slider]");
      function contar() {
        const sistema = stock["Cemento (bolsas)"];
        slider.max = sistema + 10; slider.min = Math.max(0, sistema - 20);
        const contado = Number(slider.value);
        const dif = contado - sistema;
        raiz.querySelector("[data-contado]").textContent = contado;
        raiz.querySelector("[data-sistema]").textContent = sistema;
        raiz.querySelector("[data-conteo]").textContent = contado;
        const celda = raiz.querySelector("[data-diferencia]");
        celda.textContent = dif === 0 ? "0" : (dif > 0 ? "+" : "") + dif;
        celda.className = dif === 0 ? "ej-ok" : "ej-alerta";
        resumen.textContent = dif === 0
          ? "Cuadra. El cierre de hoy será la apertura de mañana."
          : `⚠ Diferencia de ${Math.abs(dif)} bolsas: alerta al encargado hoy mismo.`;
      }
      slider.addEventListener("input", contar);
    }
  },

  // ============ GASTOS DE OBRA (GRUPO UP) ============
  "gastos-obra": {
    html: () => `
      <div class="ej-botones">
        <button class="ej-boton activo" data-vista="registro">Registrar un gasto</button>
        <button class="ej-boton" data-vista="dashboard">Ver el dashboard</button>
      </div>
      <div data-panel="registro">
      <p class="ej-pista">Elige un comprobante para "mandarlo por Telegram".</p>
      <div class="ej-botones">
        <button class="ej-boton" data-comp="0">Boleta · movilidad</button>
        <button class="ej-boton" data-comp="1">Factura · cemento</button>
        <button class="ej-boton" data-comp="2">La misma boleta otra vez</button>
        <button class="ej-boton" data-comp="3">Voucher de transferencia</button>
        <button class="ej-boton" data-comp="4">Factura del voucher</button>
      </div>
      <div class="ej-flujo" data-pasos></div>
      <div class="ej-dos">
        <div class="ej-panel" data-lectura><p class="ej-pista">Esperando comprobante…</p></div>
        <div class="ej-panel">
          <p class="ej-titulo">Obra OBR-001 · mes ficticio</p>
          <div data-obra></div>
        </div>
      </div>
      </div>

      <div data-panel="dashboard" hidden>
        <p class="ej-pista">Obra ficticia: facturado S/ 120,000 y gastado S/ 52,000 (con IGV). Mueve cuánto del gasto tiene factura.</p>
        <label class="ej-slider"><span>Gasto con factura: <b data-pct></b></span>
          <input type="range" min="20" max="100" step="5" value="40" data-sustento></label>
        <div class="ej-dos">
          <div class="ej-panel">
            <p class="ej-titulo">Ganancia a la fecha</p>
            <div class="ej-fila"><span>Facturado sin IGV</span><b data-d="fsi"></b></div>
            <div class="ej-fila"><span>Gasto sin IGV</span><b data-d="gsi"></b></div>
            <div class="ej-fila ej-fila--total"><span>Ganancia</span><b data-d="gan"></b></div>
            <p class="ej-titulo" style="margin-top:14px">Plata que llegó al banco</p>
            <div class="ej-fila"><span>Retención y detracción</span><b data-d="ret"></b></div>
            <div class="ej-fila ej-fila--total"><span>Queda en caja</span><b data-d="caja"></b></div>
          </div>
          <div class="ej-panel">
            <p class="ej-titulo">IGV a pagar estimado</p>
            <div class="ej-fila"><span>IGV de ventas</span><b data-d="igvv"></b></div>
            <div class="ej-fila"><span>IGV de compras</span><b data-d="igvc"></b></div>
            <div class="ej-fila"><span>Se paga con la detracción</span><b data-d="det"></b></div>
            <div class="ej-fila ej-fila--total"><span>Falta de tu bolsillo</span><b class="ej-alerta" data-d="bol"></b></div>
          </div>
        </div>
      </div>
      <p class="ej-resultado" data-resumen></p>
    `,
    iniciar: (raiz) => {
      const comprobantes = [
        { tipo: "Boleta", numero: "B001-0456", ruc: "10400000002", total: 118, categoria: "Logística y transporte" },
        { tipo: "Factura", numero: "F001-0789", ruc: "20600000003", total: 1416, categoria: "Materiales" },
        { tipo: "Boleta", numero: "B001-0456", ruc: "10400000002", total: 118, categoria: "Logística y transporte" },
        { tipo: "Voucher", numero: "Transferencia", ruc: "—", total: 590, categoria: "Materiales", esVoucher: true },
        { tipo: "Factura", numero: "F002-0321", ruc: "20600000004", total: 590, categoria: "Materiales" }
      ];
      let voucherEsperando = null; // voucher que espera su factura (en el real: 10 minutos)
      const guardados = new Set();
      const obra = { valorizado: 60000, gastado: 41200, sinSustento: 3800 }; // sinSustento = gastos sin comprobante
      const pasos = ["Foto recibida", "Lectura OCR", "¿Duplicado?", "Guardado"];

      function pintarObra() {
        const utilidad = obra.valorizado - obra.gastado;
        raiz.querySelector("[data-obra]").innerHTML = `
          <div class="ej-fila"><span>Valorizado</span><b>${soles(obra.valorizado)}</b></div>
          <div class="ej-fila"><span>Gastado</span><b>${soles(obra.gastado)}</b></div>
          <div class="ej-fila ej-fila--total"><span>Utilidad estimada</span><b>${soles(utilidad)} · ${Math.round(utilidad / obra.valorizado * 100)}%</b></div>
          <div class="ej-fila"><span>Gastos sin sustento</span><b class="ej-alerta">${soles(obra.sinSustento)}</b></div>
          <div class="ej-fila"><span>% formalidad tributaria</span><b>${Math.round((obra.gastado - obra.sinSustento) / obra.gastado * 100)}%</b></div>`;
      }
      function pintarPasos(hasta, alerta) {
        raiz.querySelector("[data-pasos]").innerHTML = pasos.map((p, i) => {
          const clase = i === alerta ? "ej-paso ej-paso--cuello" : (i <= hasta ? "ej-paso ej-paso--hecho" : "ej-paso ej-suave");
          return `<div class="${clase}"><small>${i + 1}</small>${p}</div>`;
        }).join('<span class="ej-flecha">→</span>');
      }

      raiz.addEventListener("click", (e) => {
        const i = e.target.dataset.comp;
        if (i === undefined) return;
        const c = comprobantes[i];
        const base = c.total / 1.18, igv = c.total - base;
        const clave = c.ruc + c.numero;
        const resumen = raiz.querySelector("[data-resumen]");
        raiz.querySelector("[data-lectura]").innerHTML = `
          <p class="ej-titulo">${c.tipo} leída</p>
          <div class="ej-fila"><span>RUC</span><b>${c.ruc}</b></div>
          <div class="ej-fila"><span>N°</span><b>${c.numero}</b></div>
          <div class="ej-fila"><span>Base</span><b>${soles(base)}</b></div>
          <div class="ej-fila"><span>IGV</span><b>${soles(igv)}</b></div>
          <div class="ej-fila ej-fila--total"><span>Total</span><b>${soles(c.total)}</b></div>`;

        if (c.esVoucher) {
          voucherEsperando = c;
          pintarPasos(1);
          resumen.textContent = "Transferencia recibida: espera 10 min su factura para unirlas. Si no llega, se registra como gasto sin factura y se avisa.";
          return;
        }
        if (guardados.has(clave)) {
          pintarPasos(1, 2);
          resumen.textContent = "⚠ Duplicado: ese comprobante ya estaba registrado. No se guarda dos veces.";
        } else if (voucherEsperando && voucherEsperando.total === c.total) {
          pintarPasos(3);
          guardados.add(clave); obra.gastado += c.total; voucherEsperando = null; pintarObra();
          resumen.textContent = "Factura unida a su transferencia por el monto: se registra UNA sola vez, con sustento.";
        } else {
          pintarPasos(3);
          guardados.add(clave); obra.gastado += c.total; pintarObra();
          resumen.textContent = `Guardado en ${c.categoria.toLowerCase()} y la utilidad de la obra se actualizó sola.`;
        }
      });
      // ----- Pestaña "Ver el dashboard" (números ficticios) -----
      const facturado = 120000, gastoTotal = 52000, contrato = 160000;
      function dashboard() {
        const pct = Number(raiz.querySelector("[data-sustento]").value) / 100;
        const fsi = facturado / 1.18, igvVentas = facturado - fsi;
        const igvCompras = gastoTotal * pct * 0.18 / 1.18;   // solo las facturas dan crédito de IGV
        const gsi = gastoTotal - igvCompras;
        const retencion = contrato * 0.10, detraccion = facturado * 0.04;
        const bolsillo = Math.max(0, igvVentas - igvCompras - detraccion);
        const d = (k, v) => raiz.querySelector(`[data-d="${k}"]`).textContent = v;
        raiz.querySelector("[data-pct]").textContent = Math.round(pct * 100) + "%";
        d("fsi", soles(fsi)); d("gsi", "– " + soles(gsi)); d("gan", soles(fsi - gsi));
        d("ret", "– " + soles(retencion + detraccion));
        d("caja", soles(facturado - retencion - detraccion - gastoTotal));
        d("igvv", soles(igvVentas)); d("igvc", "– " + soles(igvCompras)); d("det", "– " + soles(detraccion));
        d("bol", soles(bolsillo));
        raiz.querySelector("[data-resumen]").textContent =
          `Con ${Math.round(pct * 100)}% del gasto con factura, faltan ${soles(bolsillo)} de IGV de tu bolsillo. Más facturas = menos IGV a pagar.`;
      }
      raiz.querySelector("[data-sustento]").addEventListener("input", dashboard);
      raiz.addEventListener("click", (e) => {
        const vista = e.target.dataset.vista;
        if (!vista) return;
        raiz.querySelectorAll("[data-vista]").forEach(b => b.classList.toggle("activo", b.dataset.vista === vista));
        raiz.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== vista);
        raiz.querySelector("[data-resumen]").textContent = "";
        if (vista === "dashboard") dashboard();
      });

      pintarObra(); pintarPasos(-1);
    }
  },

  // ============ CONCILIACIÓN ============
  "conciliacion": {
    html: () => `
      <div class="ej-dos">
        <div class="ej-panel">
          <p class="ej-titulo">Nuestro registro</p>
          <div data-lado="propio"></div>
        </div>
        <div class="ej-panel">
          <p class="ej-titulo">Registro del aliado</p>
          <div data-lado="aliado"></div>
        </div>
      </div>
      <button class="ej-boton ej-boton--principal" data-conciliar>Conciliar</button>
      <p class="ej-resultado" data-resumen></p>
    `,
    iniciar: (raiz) => {
      // código de atención, monto propio, monto del aliado (null = no lo tiene)
      const registros = [
        ["A-101", 120, 120], ["A-102", 85, 85], ["A-103", 150, 130],
        ["A-104", 95, null], ["A-105", 120, 120], ["A-106", 60, 60]
      ];
      const pintar = (lado) => registros
        .filter(r => lado === "propio" || r[2] !== null)
        .map(r => `<div class="ej-fila" data-codigo="${r[0]}"><span>${r[0]}</span><b>${soles(lado === "propio" ? r[1] : r[2])}</b></div>`)
        .join("");
      raiz.querySelector('[data-lado="propio"]').innerHTML = pintar("propio");
      raiz.querySelector('[data-lado="aliado"]').innerHTML = pintar("aliado");

      raiz.querySelector("[data-conciliar]").addEventListener("click", () => {
        let esperado = 0, recibido = 0;
        registros.forEach(([codigo, propio, aliado], i) => {
          esperado += propio; recibido += aliado || 0;
          // marca fila por fila, una tras otra, para que se vea el proceso
          setTimeout(() => {
            raiz.querySelectorAll(`[data-codigo="${codigo}"]`).forEach(fila => {
              fila.classList.add(aliado === propio ? "ej-fila--ok" : "ej-fila--alerta");
            });
          }, i * 250);
        });
        setTimeout(() => {
          raiz.querySelector("[data-resumen]").textContent =
            `Esperado ${soles(esperado)} · Recibido ${soles(recibido)} · Diferencia ${soles(esperado - recibido)}: 1 atención no registrada y 1 monto distinto.`;
        }, registros.length * 250);
      });
    }
  },

  // ============ PRECIOS ============
  "precios": {
    html: () => `
      <div class="ej-panel">
        <p class="ej-titulo">Costo de un servicio ficticio</p>
        <div class="ej-fila"><span>Insumos</span><b>${soles(22)}</b></div>
        <div class="ej-fila"><span>Personal</span><b>${soles(10)}</b></div>
        <div class="ej-fila"><span>Gastos indirectos</span><b>${soles(6)}</b></div>
        <div class="ej-fila ej-fila--total"><span>Costo total</span><b>${soles(38)}</b></div>
      </div>
      <div class="ej-botones">
        <button class="ej-boton activo" data-pago="pasarela">Cobro con pasarela (3%)</button>
        <button class="ej-boton" data-pago="qr">Cobro con QR directo</button>
      </div>
      <label class="ej-slider">
        <span>Precio de venta (con IGV): <b data-precio></b></span>
        <input type="range" min="40" max="120" step="1" value="70" data-slider>
      </label>
      <div class="ej-regla">
        <div class="ej-regla__mercado" style="left:${(60 - 40) / 80 * 100}%; width:${25 / 80 * 100}%">mercado</div>
        <div class="ej-regla__marca" data-marca></div>
      </div>
      <div class="ej-kpis">
        <div class="ej-kpi"><span>Precio sin IGV</span><b data-sinigv></b></div>
        <div class="ej-kpi"><span>Comisión</span><b data-comision></b></div>
        <div class="ej-kpi"><span>Ganancia por servicio</span><b data-ganancia></b><small data-margen></small></div>
      </div>
      <p class="ej-resultado" data-veredicto></p>
    `,
    iniciar: (raiz) => {
      const costo = 38, mercadoMin = 60, mercadoMax = 85;
      let pago = "pasarela";
      const slider = raiz.querySelector("[data-slider]");
      function calcular() {
        const precio = Number(slider.value);
        const sinIgv = precio / 1.18;                                  // el IGV no es tuyo
        const comision = pago === "pasarela" ? precio * 0.03 : 0;      // la pasarela cobra sobre el total
        const ganancia = sinIgv - comision - costo;
        raiz.querySelector("[data-precio]").textContent = soles(precio);
        raiz.querySelector("[data-sinigv]").textContent = soles(sinIgv);
        raiz.querySelector("[data-comision]").textContent = comision ? "– " + soles(comision) : soles(0);
        raiz.querySelector("[data-ganancia]").textContent = soles(ganancia);
        raiz.querySelector("[data-margen]").textContent = Math.round(ganancia / sinIgv * 100) + "% de margen";
        raiz.querySelector("[data-marca]").style.left = (precio - 40) / 80 * 100 + "%";
        let v;
        if (ganancia < 0) v = "⚠ Pierdes plata con cada servicio.";
        else if (precio < mercadoMin) v = "Ganas, pero estás regalando margen: el mercado paga más.";
        else if (precio <= mercadoMax) v = "✓ En rango de mercado y con margen sano.";
        else v = "Muy por encima del mercado: riesgo de perder pacientes.";
        if (pago === "pasarela" && ganancia > 0) v += ` La pasarela se lleva ${soles(comision * 1000)} cada 1,000 servicios.`;
        raiz.querySelector("[data-veredicto]").textContent = v;
      }
      raiz.addEventListener("click", (e) => {
        if (!e.target.dataset.pago) return;
        pago = e.target.dataset.pago;
        raiz.querySelectorAll("[data-pago]").forEach(b => b.classList.toggle("activo", b.dataset.pago === pago));
        calcular();
      });
      slider.addEventListener("input", calcular);
      calcular();
    }
  },

  // ============ ALERTAS TDR ============
  "tdr": {
    html: () => `
      <p class="ej-pista">Mueve el día de obra y mira cuándo sale cada alerta.</p>
      <label class="ej-slider">
        <span>Día de obra: <b data-dia></b></span>
        <input type="range" min="0" max="60" step="1" value="0" data-slider>
      </label>
      <div class="ej-panel" data-lista></div>
    `,
    iniciar: (raiz) => {
      // obligación, día límite, responsable, canal
      const obligaciones = [
        ["Plan de seguridad aprobado", 7, "Residente", "Correo"],
        ["Pruebas de calidad del concreto", 21, "Calidad", "Telegram"],
        ["Informe mensual de avance", 30, "Residente", "Correo"],
        ["Valorización del mes", 32, "Gerencia", "Correo + Telegram"],
        ["Renovación de pólizas", 45, "Administración", "Correo"]
      ];
      const slider = raiz.querySelector("[data-slider]");
      function actualizar() {
        const dia = Number(slider.value);
        raiz.querySelector("[data-dia]").textContent = dia;
        raiz.querySelector("[data-lista]").innerHTML = obligaciones.map(([tarea, limite, quien, canal]) => {
          const faltan = limite - dia;
          let estado = `<span class="ej-suave">en ${faltan} días</span>`;
          if (faltan < 0) estado = `<span class="ej-ok">✓ Cumplido</span>`;
          else if (faltan <= 5) estado = `<span class="ej-alerta">🔔 Alerta enviada · ${canal}</span>`;
          return `<div class="ej-tarea">
            <div><b>${tarea}</b><small>Día ${limite} · ${quien}</small></div>${estado}
          </div>`;
        }).join("");
      }
      slider.addEventListener("input", actualizar);
      actualizar();
    }
  },

  // ============ CLIMA LABORAL (por jerarquía) ============
  "clima": {
    html: () => `
      <p class="ej-pista">Elige una zona y una agencia, como haría cada líder. (En el real eran 106 agencias.)</p>
      <div class="ej-botones">
        <select class="ej-select" data-zona aria-label="Zona"></select>
        <select class="ej-select" data-agencia aria-label="Agencia"></select>
      </div>
      <div class="ej-kpis">
        <div class="ej-kpi"><span>Participación</span><b data-part></b></div>
        <div class="ej-kpi"><span>Satisfacción de la unidad</span><b data-sat></b><small data-semaforo></small></div>
        <div class="ej-kpi"><span>vs. institucional</span><b data-vs></b><small data-inst></small></div>
      </div>
      <div class="ej-panel">
        <p class="ej-titulo">Resultado por dimensión</p>
        <div data-barras></div>
        <div class="ej-leyenda">
          <span><i style="background:var(--ej-impulsor)"></i>≥ 85% impulsor</span>
          <span><i style="background:var(--ej-formativo)"></i>70–84% formativo</span>
          <span><i style="background:var(--ej-alerta)"></i>≤ 69% restrictivo</span>
        </div>
      </div>
      <p class="ej-resultado" data-resumen></p>
    `,
    iniciar: (raiz) => {
      const dimensiones = ["Credibilidad", "Respeto", "Imparcialidad", "Camaradería", "Orgullo"];
      // zona → agencias: [nombre, participación %, resultados por dimensión]. Todo ficticio.
      const zonas = {
        "Zona Norte":  [["Agencia 01", 95, [88, 84, 80, 91, 90]], ["Agencia 02", 88, [76, 70, 66, 82, 79]],
                        ["Agencia 03", 100, [91, 89, 86, 94, 92]], ["Agencia 04", 90, [83, 78, 74, 87, 85]]],
        "Zona Centro": [["Agencia 05", 82, [72, 65, 61, 75, 70]], ["Agencia 06", 93, [85, 82, 79, 88, 86]],
                        ["Agencia 07", 89, [80, 77, 70, 84, 83]], ["Agencia 08", 78, [68, 62, 58, 72, 69]]],
        "Zona Sur":    [["Agencia 09", 97, [90, 87, 85, 93, 91]], ["Agencia 10", 94, [86, 83, 80, 90, 88]],
                        ["Agencia 11", 91, [79, 74, 71, 85, 82]], ["Agencia 12", 92, [84, 80, 77, 89, 87]]]
      };
      const promedio = (lista) => lista.reduce((a, b) => a + b, 0) / lista.length;

      // Junta varias agencias en una sola unidad (para zona o institución)
      function juntar(agencias) {
        return {
          part: promedio(agencias.map(a => a[1])),
          dims: dimensiones.map((_, i) => promedio(agencias.map(a => a[2][i])))
        };
      }
      const todas = Object.values(zonas).flat();
      const institucional = juntar(todas);
      const satInst = promedio(institucional.dims);

      const semaforo = (v) => v >= 85 ? ["Impulsor del progreso", "var(--ej-impulsor)"]
                            : v >= 70 ? ["Proceso formativo", "var(--ej-formativo)"]
                            : ["Restrictivo del progreso", "var(--ej-alerta)"];

      const selZona = raiz.querySelector("[data-zona]");
      const selAgencia = raiz.querySelector("[data-agencia]");
      selZona.innerHTML = `<option value="">Toda la institución</option>` +
        Object.keys(zonas).map(z => `<option>${z}</option>`).join("");

      function llenarAgencias() {
        const z = selZona.value;
        selAgencia.disabled = !z;
        selAgencia.innerHTML = `<option value="">${z ? "Toda la zona" : "—"}</option>` +
          (z ? zonas[z].map(a => `<option>${a[0]}</option>`).join("") : "");
      }

      function mostrar() {
        const z = selZona.value, ag = selAgencia.value;
        let unidad, nombre;
        if (!z) { unidad = institucional; nombre = "La institución"; }
        else if (!ag) { unidad = juntar(zonas[z]); nombre = z; }
        else { const a = zonas[z].find(x => x[0] === ag); unidad = { part: a[1], dims: a[2] }; nombre = ag; }

        const sat = promedio(unidad.dims);
        const dif = Math.round(sat - satInst);
        const [estado, color] = semaforo(sat);
        raiz.querySelector("[data-part]").textContent = Math.round(unidad.part) + "%";
        raiz.querySelector("[data-sat]").textContent = Math.round(sat) + "%";
        raiz.querySelector("[data-sat]").style.color = color;
        raiz.querySelector("[data-semaforo]").textContent = estado;
        raiz.querySelector("[data-vs]").textContent = !z ? "—" : (dif > 0 ? "+" : "") + dif + " pts";
        raiz.querySelector("[data-inst]").textContent = "Institucional: " + Math.round(satInst) + "%";

        // barras de mayor a menor, como en el reporte real
        const orden = dimensiones.map((d, i) => [d, Math.round(unidad.dims[i])]).sort((a, b) => b[1] - a[1]);
        raiz.querySelector("[data-barras]").innerHTML = orden.map(([d, v]) => `
          <div class="ej-barra"><span>${d}</span>
            <div class="ej-barra__fondo"><div class="ej-barra__relleno" style="width:${v}%; background:${semaforo(v)[1]}"></div></div>
            <b>${v}%</b></div>`).join("");

        const [peor, valorPeor] = orden[orden.length - 1];
        raiz.querySelector("[data-resumen]").textContent =
          `${nombre}: su punto más bajo es ${peor} (${valorPeor}%). Ahí empieza su plan de acción.`;
      }

      selZona.addEventListener("change", () => { llenarAgencias(); mostrar(); });
      selAgencia.addEventListener("change", mostrar);
      llenarAgencias(); mostrar();
    }
  },

  // ============ PROCESOS ============
  "procesos": {
    html: () => `
      <div class="ej-botones">
        <button class="ej-boton activo" data-vista="mapa">Mapa de procesos</button>
        <button class="ej-boton" data-vista="cobro">Un subproceso: el cobro</button>
      </div>

      <div data-panel="mapa">
        <p class="ej-pista">Toca un proceso para ver quién lo lleva y qué hace.</p>
        <div class="ej-mapa-procesos" data-mapa></div>
        <div class="ej-panel" data-detalle><p class="ej-pista">Ningún proceso elegido.</p></div>
      </div>

      <div data-panel="cobro" hidden>
        <p class="ej-pista">Antes: solo se consultaba si ya pagaron. Ahora hay una secuencia. Mueve los días.</p>
        <label class="ej-slider"><span>Días desde que se presentó la factura: <b data-dia></b></span>
          <input type="range" min="0" max="40" step="1" value="0" data-slider></label>
        <div class="ej-panel" data-bitacora></div>
      </div>
      <p class="ej-resultado" data-resumen></p>
    `,
    iniciar: (raiz) => {
      // tipo, proceso, responsable, qué es
      const procesos = [
        ["Estratégico", "Dirección y gerencia", "Gerente general", "Decidir, aprobar y controlar resultados y costos."],
        ["Estratégico", "Captación de contratos", "Gerente general", "Buscar procesos, armar propuestas y formar consorcios."],
        ["Principal", "Expedientes técnicos", "Gerencia + proyectista", "Diseñar el proyecto y entregarlo aprobado."],
        ["Principal", "Supervisión de obras", "Jefe de supervisión", "Controlar la obra que ejecuta otro contratista."],
        ["Principal", "Ejecución de obras", "Residente de obra", "Construir la obra según el expediente técnico."],
        ["Común", "Arranque de contrato", "Administración", "Antes del día 1: plazos, penalidades, seguros y garantías cargados."],
        ["Común", "Cobro del pago", "Encargado de cobro", "Facturar y gestionar el pago en la oficina donde está el trámite."],
        ["Común", "Cierre y liquidación", "Administración + gerencia", "Liquidar el contrato y recuperar la garantía."],
        ["Común", "Cartas y archivo", "Quien emite la carta", "Numerar, presentar y archivar cada carta con su cargo."],
        ["Soporte", "Finanzas", "Administración", "Facturas, IGV y cierre mensual con el contador."],
        ["Soporte", "Logística", "Residente + almacenero", "Compras, requerimientos y almacén de obra."],
        ["Soporte", "Personal y seguridad", "Administración + seguridad", "Condiciones de trabajo, SCTR, EPP y charlas."]
      ];
      const tipos = ["Estratégico", "Principal", "Común", "Soporte"];
      raiz.querySelector("[data-mapa]").innerHTML = tipos.map(tipo => `
        <div class="ej-mapa-procesos__fila">
          <span class="ej-cabeza">${tipo}</span>
          <div>${procesos.map((p, i) => p[0] === tipo
              ? `<button class="ej-boton" data-proceso="${i}">${p[1]}</button>` : "").join("")}</div>
        </div>`).join("");

      // Secuencia de cobro (plazo de pago ficticio: 20 días)
      const plazo = 20;
      const pasos = [
        [0, "Factura presentada con carta por mesa de partes; cargo guardado."],
        [3, "Visita a la oficina donde está el trámite; si hay observación, se atiende el mismo día."],
        [10, "Visita semanal: fecha, oficina, persona atendida y pendientes."],
        [17, "Visita semanal: el trámite pasó a la siguiente oficina."],
        [plazo + 1, "⚠ Venció el plazo de pago: carta de reiteración."],
        [plazo + 11, "⚠ Sigue sin pagarse: carta pidiendo intereses."]
      ];
      const slider = raiz.querySelector("[data-slider]");
      function bitacora() {
        const dia = Number(slider.value);
        raiz.querySelector("[data-dia]").textContent = dia;
        raiz.querySelector("[data-bitacora]").innerHTML = pasos.map(([d, accion]) => `
          <div class="ej-tarea"><div><b>Día ${d}</b><small>${accion}</small></div>
          ${dia >= d ? '<span class="ej-ok">✓ Hecho</span>' : '<span class="ej-suave">pendiente</span>'}</div>`).join("");
        raiz.querySelector("[data-resumen]").textContent = dia <= plazo
          ? "Cada visita queda registrada: nadie depende de acordarse."
          : "El atraso queda por escrito, y eso presiona y protege a la empresa.";
      }
      slider.addEventListener("input", bitacora);

      raiz.addEventListener("click", (e) => {
        const vista = e.target.dataset.vista;
        if (vista) {
          raiz.querySelectorAll("[data-vista]").forEach(b => b.classList.toggle("activo", b.dataset.vista === vista));
          raiz.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== vista);
          raiz.querySelector("[data-resumen]").textContent = "";
          if (vista === "cobro") bitacora();
        }
        const i = e.target.dataset.proceso;
        if (i !== undefined) {
          const [tipo, nombre, quien, que] = procesos[i];
          raiz.querySelectorAll("[data-proceso]").forEach(b => b.classList.toggle("activo", b.dataset.proceso === i));
          raiz.querySelector("[data-detalle]").innerHTML = `
            <p class="ej-titulo">${tipo}</p><p><b>${nombre}</b></p>
            <div class="ej-fila"><span>Responsable</span><b>${quien}</b></div>
            <p class="ej-pista" style="margin-top:8px">${que}</p>`;
          raiz.querySelector("[data-resumen]").textContent = tipo === "Común"
            ? "Se repite igual en los tres servicios, por eso se explica una sola vez."
            : "";
        }
      });
    }
  },

  // ============ DATAMATCH (proyecto personal) ============
  "datamatch": {
    html: () => `
      <p class="ej-pista">Dos listas con los mismos nombres, escritos distinto. Crúzalas.</p>
      <div class="ej-botones">
        <button class="ej-boton" data-cruce="formula">Cruzar con fórmula (BUSCARV)</button>
        <button class="ej-boton ej-boton--principal" data-cruce="datamatch">Cruzar con DataMatch 🐰</button>
      </div>
      <div class="buni" data-buni hidden>
        <span class="buni__pista" data-pista></span>
        <div class="buni__barra"><div data-avance></div></div>
      </div>
      <div class="ej-dos">
        <div class="ej-panel">
          <p class="ej-titulo">Archivo de trabajo</p>
          <div data-trabajo></div>
        </div>
        <div class="ej-panel">
          <p class="ej-titulo">Archivo de referencia</p>
          <div data-referencia></div>
        </div>
      </div>
      <div class="ej-leyenda">
        <span><i style="background:#F3E1DF"></i>exacto</span>
        <span><i style="background:#F7E7A8"></i>parecido: verificar</span>
        <span><i style="background:#E7A3AE"></i>no encontrado</span>
      </div>
      <p class="ej-resultado" data-resumen></p>
    `,
    iniciar: (raiz) => {
      const trabajo = ["Pérez, Juan", "MARIA LOPEZ", "Rodríguez Carla", "Diaz Q. Luis", "Ana Torres", "Pedro Salas"];
      const referencia = [["JUAN PEREZ", "Créditos"], ["María López", "Cobranzas"], ["CARLA RODRIGUEZ", "Operaciones"],
                          ["Luis Díaz Quispe", "Comercial"], ["Ana Torres", "Administración"], ["Jorge Ruiz", "Créditos"]];

      // La misma limpieza que hace DataMatch en Python ("ADN" del nombre)
      const adn = (t) => t.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
                          .replace(/[^A-Z0-9\s]/g, " ").split(/\s+/).filter(Boolean).sort().join(" ");
      // Parecido entre dos textos (0 a 100), como el "ratio" de thefuzz
      function parecido(a, b) {
        const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
        for (let j = 1; j <= b.length; j++) d[0][j] = j;
        for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
          d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 2));
        return Math.round((a.length + b.length - d[a.length][b.length]) / (a.length + b.length) * 100);
      }

      raiz.querySelector("[data-referencia]").innerHTML = referencia.map(([n, area]) =>
        `<div class="ej-fila"><span>${n}</span><b>${area}</b></div>`).join("");
      const pintarTrabajo = (filas) => raiz.querySelector("[data-trabajo]").innerHTML = filas.join("");
      pintarTrabajo(trabajo.map(n => `<div class="ej-fila"><span>${n}</span><b class="ej-suave">¿área?</b></div>`));

      function cruzar(modo) {
        let encontrados = 0;
        const filas = trabajo.map(nombre => {
          if (modo === "formula") {
            // BUSCARV: solo si el texto es igual (sin contar mayúsculas)
            const r = referencia.find(([n]) => n.toUpperCase() === nombre.toUpperCase());
            if (r) { encontrados++; return `<div class="ej-fila dm-exacto"><span>${nombre}</span><b>${r[1]}</b></div>`; }
            return `<div class="ej-fila dm-no"><span>${nombre}</span><b>#N/D</b></div>`;
          }
          const limpio = adn(nombre);
          const exacto = referencia.find(([n]) => adn(n) === limpio);
          if (exacto) { encontrados++; return `<div class="ej-fila dm-exacto"><span>${nombre}</span><b>${exacto[1]}</b></div>`; }
          const mejor = referencia.map(([n, area]) => ({ n, area, p: parecido(limpio, adn(n)) })).sort((x, y) => y.p - x.p)[0];
          if (mejor.p >= 50) { encontrados++; return `<div class="ej-fila dm-parecido" title="Se usó: ${mejor.n}"><span class="dm-nombre">${nombre}<small>Se parece ${mejor.p}% a "${mejor.n}"</small></span><b>${mejor.area}</b></div>`; }
          return `<div class="ej-fila dm-no"><span>${nombre}</span><b>NO ENCONTRADO</b></div>`;
        });
        pintarTrabajo(filas);
        raiz.querySelector("[data-resumen]").textContent = modo === "formula"
          ? `BUSCARV encontró ${encontrados} de ${trabajo.length}: falla con tildes, comas y nombres en otro orden.`
          : `DataMatch encontró ${encontrados} de ${trabajo.length}. El amarillo se revisa a mano antes de confiar en él.`;
      }

      raiz.addEventListener("click", (e) => {
        const modo = e.target.dataset.cruce;
        if (!modo) return;
        if (modo === "formula") return cruzar("formula");
        // Buni corre hacia la zanahoria mientras "cruza"
        const buni = raiz.querySelector("[data-buni]"), pista = raiz.querySelector("[data-pista]"), avance = raiz.querySelector("[data-avance]");
        buni.hidden = false;
        let paso = 0; const total = 16;
        const timer = setInterval(() => {
          paso++;
          pista.textContent = "|" + " ".repeat(paso) + "🐰" + " ".repeat(total - paso) + "🥕|";
          avance.style.width = (paso / total * 100) + "%";
          if (paso >= total) { clearInterval(timer); setTimeout(() => { buni.hidden = true; cruzar("datamatch"); }, 250); }
        }, 70);
      });
    }
  },

  // ============ RETENCIÓN DE PACIENTES (cohortes) ============
  "retencion": {
    html: () => `
      <div class="ej-botones">
        <button class="ej-boton activo" data-modo="todas">Contar todas las visitas</button>
        <button class="ej-boton" data-modo="control">Solo controles reales (21+ días)</button>
      </div>
      <div class="ej-panel">
        <p class="ej-titulo">% de pacientes que vuelve, según su mes de llegada</p>
        <div class="cohorte" data-tabla></div>
      </div>
      <p class="ej-resultado" data-resumen></p>
      <div class="ej-panel">
        <p class="ej-titulo">Simulador: recuperar a los que no vuelven</p>
        <label class="ej-slider"><span>Recupero el <b data-pct></b> de 300 pacientes que no volvieron</span>
          <input type="range" min="0" max="30" step="5" value="10" data-recupero></label>
        <div class="ej-kpis">
          <div class="ej-kpi"><span>Pacientes recuperados</span><b data-pacientes></b></div>
          <div class="ej-kpi"><span>Ingreso extra al mes</span><b data-ingreso></b><small>con un ticket de S/ 150</small></div>
        </div>
      </div>
    `,
    iniciar: (raiz) => {
      const meses = ["Ene", "Feb", "Mar", "Abr", "May"];
      // % que vuelve en el mes 1, 2, 3, 4 después de llegar (datos ficticios)
      const datos = {
        todas:   [[100, 55, 58, 53, 51], [100, 58, 55, 52], [100, 56, 57], [100, 60], [100]],
        control: [[100, 31, 36, 33, 30], [100, 35, 33, 31], [100, 34, 32], [100, 37], [100]]
      };
      const color = (v) => v === 100 ? "rgba(30,26,24,.08)" : `rgba(183,110,121,${(v / 70).toFixed(2)})`;
      function pintar(modo) {
        const filas = datos[modo];
        raiz.querySelector("[data-tabla]").innerHTML =
          `<span class="ej-cabeza">Llegó</span>${["Mes 0", "Mes 1", "Mes 2", "Mes 3", "Mes 4"].map(m => `<span class="ej-cabeza">${m}</span>`).join("")}` +
          filas.map((fila, i) => `<span>${meses[i]}</span>${[0, 1, 2, 3, 4].map(k =>
            fila[k] === undefined ? "<span></span>" : `<span class="cohorte__celda" style="background:${color(fila[k])}">${fila[k]}%</span>`).join("")}`).join("");
        const prom = Math.round(filas.filter(f => f.length > 1).map(f => f[1]).reduce((a, b, _, arr) => a + b / arr.length, 0));
        raiz.querySelector("[data-resumen]").textContent = modo === "todas"
          ? `Parece que vuelve el ${prom}%... pero ojo: muchas son la misma consulta, que vuelve a dejar sus resultados.`
          : `Contando solo controles reales, vuelve el ${prom}%. La retención era mucho menor de lo que parecía.`;
      }
      raiz.addEventListener("click", (e) => {
        const modo = e.target.dataset.modo;
        if (!modo) return;
        raiz.querySelectorAll("[data-modo]").forEach(b => b.classList.toggle("activo", b.dataset.modo === modo));
        pintar(modo);
      });
      const slider = raiz.querySelector("[data-recupero]");
      function simular() {
        const pct = Number(slider.value), n = Math.round(300 * pct / 100);
        raiz.querySelector("[data-pct]").textContent = pct + "%";
        raiz.querySelector("[data-pacientes]").textContent = n;
        raiz.querySelector("[data-ingreso]").textContent = soles(n * 150);
      }
      slider.addEventListener("input", simular);
      pintar("todas"); simular();
    }
  }
};
