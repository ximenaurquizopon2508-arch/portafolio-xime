/*
  casos.js = la LISTA de tus casos.
  Es el único archivo que tocas para agregar, quitar o cambiar un caso.

  TARJETA (lo que se ve en la grilla):
    id         → nombre corto SIN espacios. Une el caso con su ejemplo en ejemplos.js
    numero     → "01", "02"... puedes reordenar
    area, pregunta, resumen (también es la bajada de la ficha), estado
    grupo      → nudo del tablero: "fin" (Finanzas), "ope" (Operaciones y procesos) o "dat" (Datos y clientes)
    rubro      → dónde lo hiciste de verdad: sale como "Caso real · Salud"
    visual     → mini gráfico de la polaroid: semaforo, barras, cohortes, alerta, ranking, margen, cruce, calendario, flujo
    tablero    → 1 a 6 = sale en el tablero desde el inicio (en ese orden); 0 = solo al tocar "Ver los 10 casos"
    categoria  → elige el ícono del caso
    icono      → (opcional) imagen propia en vez del ícono del área

  FICHA (al hacer clic):
    problema    → UNA frase grande: qué pasaba antes
    construi    → 3 líneas cortas de lo que hiciste
    recorrido   → 4 pasos cortos: del dato a la decisión
    resultado   → UNA frase: qué cambió
    otrosNegocios → 3 pares [rubro, uso]
    fondo       → color del bloque del ejemplo: "rosa" o "tinta"

  "MÁS A FONDO" (desplegable, opcional):
    herramientas, ia, numeros [indicador, antes, después], notaNumeros, decisiones
*/

const CASOS = [
  {
    id: "financiero-endore",
    categoria: "finanzas",
    numero: "01",
    area: "Finanzas · Indicadores · Clínica",
    pregunta: "Solo un flujo de caja al cierre. ¿Basta para tomar decisiones?",
    grupo: "fin",
    rubro: "Salud",
    visual: "semaforo",
    tablero: 1,
    resumen: "Un tablero de cierre de mes que muestra qué servicio deja plata, qué médico mueve más pacientes y qué indicador está en rojo.",
    estado: "En uso",
    destacado: false,
    problema: "El cierre de mes era solo un flujo de caja: decía cuánto entró y salió, pero no por qué.",
    construi: [
      "El mes en una frase: EBITDA, flujo neto, punto de equilibrio y caja acumulada.",
      "La ganancia real de cada servicio y médico, ya sin IGV ni comisión de tarjeta (incluye bioimpedancias).",
      "Un semáforo de 15 indicadores con su meta: OK, alerta o crítico."
    ],
    recorrido: ["Atenciones del mes", "Google Sheets", "Apps Script calcula", "Gerencia decide"],
    resultado: "La gerencia pasó de ver un saldo a entender el mes: qué funcionó, qué no y qué decidir para el siguiente. Lo presento en cada cierre.",
    ia: "Desarrollo asistido por IA (Apps Script + HTML).",
    herramientas: ["Google Sheets", "Google Apps Script", "HTML / JavaScript", "IA como apoyo"],
    otrosNegocios: [
      ["Retail", "Margen real por tienda, no solo ventas"],
      ["Restaurante", "Ganancia por plato y por turno"],
      ["Servicios", "Producción por persona del equipo"]
    ],
    fondo: "rosa"
  },
  {
    id: "kardex",
    categoria: "operaciones",
    numero: "02",
    area: "Operaciones · Inventario",
    pregunta: "¿Cómo saber si falta material antes de que sea tarde?",
    grupo: "ope",
    rubro: "Construcción",
    visual: "alerta",
    tablero: 4,
    resumen: "Un inventario de obra que lee las facturas, solo deja retirar lo que hay y avisa cuando el conteo no cuadra.",
    estado: "Implementado en 3 obras",
    destacado: false,
    problema: "En obra no había kárdex: una diferencia se notaba recién cuando ya faltaba algo.",
    construi: [
      "Entrada: subes la factura y el sistema la lee solo.",
      "Salida: solo se puede retirar lo que hay en stock.",
      "Conteo diario con alerta si el cierre no cuadra con la apertura del día siguiente."
    ],
    recorrido: ["Factura o retiro", "Portal + n8n", "Stock al día", "Alerta si no cuadra"],
    resultado: "Fue el primer control de inventario de la empresa: las diferencias se ven el mismo día, no al final de la obra.",
    ia: "Extracción de datos con IA: lee las facturas de compra (OCR con IA).",
    herramientas: ["Portal web propio", "OCR", "n8n", "Google Sheets"],
    otrosNegocios: [
      ["Almacén", "Detectar mermas entre turnos"],
      ["Farmacia", "Cuadrar stock diario de productos"],
      ["Restaurante", "Controlar insumos de cocina"]
    ],
    fondo: "tinta"
  },
  {
    id: "gastos-obra",
    categoria: "finanzas",
    numero: "03",
    area: "Finanzas · Control de obras",
    pregunta: "¿Cuánto deja realmente cada proyecto?",
    grupo: "fin",
    rubro: "Construcción",
    visual: "barras",
    tablero: 2,
    resumen: "Los gastos se registran con una foto por Telegram y la utilidad y el IGV de cada obra se ven al instante, no 10 días después.",
    estado: "En uso",
    destacado: true,
    problema: "Los comprobantes llegaban como fotos sueltas y la utilidad de cada obra se conocía días después del cierre.",
    construi: [
      "Un bot de Telegram: el personal manda la foto del gasto y la IA lee RUC, IGV, total y categoría.",
      "Controles automáticos: duplicados, vouchers sin factura y avisos.",
      "Mi propio dashboard: gasto vs. contrato, utilidad estimada e IGV a pagar por obra."
    ],
    recorrido: ["Foto por Telegram", "IA lee y clasifica", "Base maestra de obras", "Dashboard para gerencia"],
    resultado: "Hoy presento a la gerencia los gastos, la utilidad y el IGV de cada obra desde este sistema, y la empresa lo sigue usando.",
    numeros: [
      ["Registrar un comprobante", "A mano, en Excel", "Con una foto"],
      ["Consolidar los gastos del mes", "3 a 4 días", "Automático, al día"],
      ["Utilidad e IGV listos tras el cierre", "7 a 10 días", "Al instante"],
      ["Control de duplicados", "Ninguno", "Automático"]
    ],
    notaNumeros: "Tiempos estimados.",
    ia: "Integración de IA vía API: Gemini, conectado en n8n, extrae y clasifica cada comprobante. El dashboard, con desarrollo asistido por IA.",
    herramientas: ["n8n", "Telegram", "Gemini vía API", "Google Sheets", "Google Drive", "Dashboard propio en HTML"],
    otrosNegocios: [
      ["Proyectos", "Rentabilidad por proyecto o por cliente"],
      ["Equipos en campo", "Rendición de gastos con foto"],
      ["Franquicias", "Gasto y margen por local"]
    ],
    fondo: "rosa"
  },
  {
    id: "conciliacion",
    categoria: "finanzas",
    numero: "04",
    area: "Finanzas · Conciliación",
    pregunta: "¿Lo que te pagan cuadra con lo que vendiste?",
    grupo: "fin",
    rubro: "Salud",
    visual: "cruce",
    tablero: 0,
    resumen: "Comparo dos registros para encontrar diferencias antes de aceptar un pago.",
    estado: "En desarrollo",
    destacado: false,
    problema: "Cada aliado paga según su propio registro, y comprobarlo era revisar línea por línea a mano.",
    construi: [
      "Definí qué datos deben coincidir en los dos registros.",
      "Una comparación automática que marca sola lo que no cuadra.",
      "Las diferencias quedan listas para revisar antes de aceptar el pago."
    ],
    recorrido: ["Registro del aliado", "Registro propio", "Python compara", "Revisar diferencias"],
    resultado: "Elimina la búsqueda manual precio por precio antes de aceptar cada abono.",
    ia: "Desarrollo asistido por IA (Python).",
    herramientas: ["Python", "rapidfuzz", "Excel", "Desarrollo asistido por IA"],
    otrosNegocios: [
      ["Ventas", "Banco vs. ventas registradas"],
      ["Compras", "Facturas vs. órdenes de compra"],
      ["E-commerce", "Liquidación del marketplace vs. pedidos"]
    ],
    fondo: "tinta"
  },
  {
    id: "precios",
    categoria: "finanzas",
    numero: "05",
    area: "Finanzas · Precios",
    pregunta: "¿Cuánto cobrar sin perder margen?",
    grupo: "fin",
    rubro: "Salud",
    visual: "margen",
    tablero: 6,
    resumen: "Costos, mercado y margen en un solo lugar para decidir el precio.",
    estado: "Aprobado",
    destacado: false,
    problema: "Poner un precio solo mirando a la competencia puede dejar el servicio sin margen.",
    construi: [
      "El costo real de cada servicio.",
      "Un estudio de precios de la zona y una base de tarifas extraída con web scraping.",
      "El cálculo con IGV y comisión de la pasarela de pagos incluidos."
    ],
    recorrido: ["Costo del servicio", "Precios del mercado", "IGV y comisiones", "Rango de precio"],
    resultado: "Mis precios se aprobaron, y al ver cuánto se llevaba la pasarela (~3%), la gerencia pasó a cobrar con QR directo.",
    herramientas: ["Excel", "Estudio de mercado"],
    otrosNegocios: [
      ["Retail", "Precio de un producto nuevo"],
      ["Servicios", "Tarifa de un paquete o plan"],
      ["Restaurante", "Precio de carta según costo del plato"]
    ],
    fondo: "rosa"
  },
  {
    id: "tdr",
    categoria: "operaciones",
    numero: "06",
    area: "Operaciones · Cumplimiento",
    pregunta: "¿Cómo evitar una penalidad que nadie vio venir?",
    grupo: "ope",
    rubro: "Construcción",
    visual: "calendario",
    tablero: 0,
    resumen: "Leo los términos de referencia y aviso a cada responsable antes de cada plazo.",
    estado: "Implementado",
    destacado: false,
    problema: "Los plazos de cada obra estaban enterrados en documentos largos, y uno que nadie vio terminó en penalidad.",
    construi: [
      "Un sistema que lee los TDR y extrae obligaciones y fechas.",
      "Cada obligación con su responsable.",
      "Alertas por correo y Telegram antes de cada plazo."
    ],
    recorrido: ["TDR en PDF", "IA extrae plazos", "Responsable asignado", "Alerta antes del plazo"],
    resultado: "Cada obligación tiene dueño y fecha desde el inicio de la obra: nadie depende de acordarse.",
    ia: "Extracción de datos con IA: lee los TDR y saca obligaciones y plazos.",
    herramientas: ["Lectura con IA (OCR)", "Portal web propio", "Gmail", "Telegram"],
    otrosNegocios: [
      ["Ventas B2B", "Plazos de contratos con clientes"],
      ["Legal", "Licencias y permisos que vencen"],
      ["Suscripciones", "Renovaciones y fechas de corte"]
    ],
    fondo: "tinta"
  },
  {
    id: "clima",
    categoria: "personas",
    numero: "07",
    area: "Personas · Clima laboral",
    pregunta: "¿Qué área necesita atención primero?",
    grupo: "dat",
    rubro: "Financiero",
    visual: "ranking",
    tablero: 5,
    resumen: "Un reporte de clima para cada agencia y área, comparado con toda la institución y con semáforo.",
    estado: "Entregado",
    destacado: false,
    problema: "Antes de la encuesta oficial de Great Place to Work, había que saber qué áreas estaban en riesgo, en 106 agencias.",
    construi: [
      "Bases del sondeo unidas a la jerarquía: zona, departamento y agencia.",
      "Medidas de participación, satisfacción, dimensiones y preguntas.",
      "Dos dashboards: el sondeo de todas las agencias (46 páginas) y otro solo de las unidades críticas del año anterior."
    ],
    recorrido: ["Respuestas del sondeo", "Power Query limpia", "Modelo + DAX", "Planes de acción"],
    resultado: "Cada líder recibió su diagnóstico y armó su plan de acción; el seguimiento lo llevaba yo.",
    herramientas: ["Power BI", "Power Query", "DAX", "Figma"],
    otrosNegocios: [
      ["Retail", "Satisfacción por tienda, zona y gerente"],
      ["Banca", "Resultados por agencia y región"],
      ["Educación", "Evaluaciones por sede, curso y docente"]
    ],
    fondo: "rosa"
  },
  {
    id: "procesos",
    categoria: "procesos",
    numero: "08",
    area: "Procesos · Gestión",
    pregunta: "¿Qué pasa si quien sabe hacerlo se va?",
    grupo: "ope",
    rubro: "Construcción",
    visual: "flujo",
    tablero: 0,
    resumen: "Un manual de procesos con flujogramas, rutinas por puesto y checklists, conectado a los sistemas de la empresa.",
    estado: "Versión 01 · set 2026",
    destacado: false,
    problema: "Plazos, cartas, seguros y cobros dependían de que alguien se acordara.",
    construi: [
      "El mapa de procesos y un flujograma por cada servicio.",
      "La rutina de 9 puestos y 11 checklists estándar.",
      "Todo conectado con los sistemas: alertas TDR, inventario y gastos."
    ],
    recorrido: ["Levantar procesos", "Flujogramas", "Rutinas y checklists", "Conectar sistemas"],
    resultado: "Cuando dejé el puesto, quien me reemplazó supo qué hacer desde el primer día gracias al manual.",
    ia: "Documentación asistida por IA: los procesos los levanté yo; la IA me ayudó a redactarlos y ordenarlos.",
    herramientas: ["IA como apoyo", "Flujogramas", "Word", "Google Drive"],
    otrosNegocios: [
      ["Cualquier empresa", "Inducción de personal nuevo"],
      ["Operaciones", "Checklists para que nada se olvide"],
      ["Auditoría", "Procesos documentados y con registro"]
    ],
    fondo: "tinta"
  },
  {
    id: "datamatch",
    categoria: "personal",
    numero: "09",
    icono: "datamatch.png",
    area: "Proyecto personal · Python",
    pregunta: "¿Cómo cruzar dos bases si los nombres no coinciden?",
    grupo: "dat",
    rubro: "Proyecto personal",
    visual: "cruce",
    tablero: 0,
    resumen: "Una app que cruza dos Excel sin fórmulas, aunque los nombres tengan tildes, comas o estén en otro orden.",
    estado: "Uso personal",
    destacado: false,
    problema: "Para BUSCARV, \"Pérez, Juan\" y \"JUAN PEREZ\" son personas distintas.",
    construi: [
      "Una app de escritorio: eliges los dos archivos y qué columnas traer.",
      "Limpia los nombres antes de comparar: sin tildes, símbolos ni orden.",
      "Lo parecido sale en amarillo con su %, para verificarlo."
    ],
    recorrido: ["Dos archivos Excel", "Limpieza de nombres", "Cruce exacto o parecido", "Excel con colores"],
    resultado: "Cruzo bases en segundos, y me enseñó a pensar en quién va a usar una herramienta.",
    ia: "Desarrollo asistido por IA (Python).",
    herramientas: ["Python", "pandas", "customtkinter", "thefuzz", "xlsxwriter"],
    otrosNegocios: [
      ["RR.HH.", "Cruzar planillas con listas de asistencia"],
      ["Ventas", "Unir clientes de dos sistemas distintos"],
      ["Compras", "Cruzar proveedores escritos de forma distinta"]
    ],
    fondo: "rosa"
  },
  {
    id: "retencion",
    categoria: "clientes",
    numero: "10",
    area: "Clientes · Retención · Python",
    pregunta: "¿Cuántos clientes vuelven y cuándo los perdemos?",
    grupo: "dat",
    rubro: "Salud",
    visual: "cohortes",
    tablero: 3,
    resumen: "Analicé 10 meses de citas en Python y encontré que la clínica crece por los que vuelven, no por los nuevos.",
    estado: "Análisis y propuesta",
    destacado: true,
    problema: "La clínica crecía, pero nadie sabía si los pacientes volvían después de su primera visita.",
    construi: [
      "Citas limpias y anonimizadas: sin anuladas y una visita por día.",
      "Cohortes por mes de llegada, separando el mismo episodio del control real.",
      "Una app con mapa de calor y simulador, validada contra el flujo de caja."
    ],
    recorrido: ["Reporte de citas", "Limpieza en Python", "Cohortes", "Propuesta a gerencia"],
    resultado: "La retención real era menor de lo que parecía, y la propuesta fue de costo cero: agendar el próximo control antes de que el paciente salga.",
    decisiones: [
      "Agendar el próximo control antes de que el paciente salga, con un piloto A/B de 2 meses.",
      "Registrar cómo conoció el paciente a la clínica y hacer obligatorio el celular.",
      "Descartar con datos dos causas: inasistencias y promociones.",
      "Usar las recetas como demanda para planear las compras de la farmacia."
    ],
    ia: "Desarrollo asistido por IA (Python).",
    herramientas: ["Python", "pandas", "Jupyter Notebook", "Streamlit", "Altair", "openpyxl"],
    otrosNegocios: [
      ["Gimnasios", "Quién renueva su membresía y cuándo se va"],
      ["Retail", "Qué clientes vuelven a comprar"],
      ["Suscripciones", "En qué mes se pierde a los clientes"]
    ],
    fondo: "tinta"
  }
];
