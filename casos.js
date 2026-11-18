/*
  casos.js = la LISTA de tus casos.
  Regla de oro: NADA que identifique a una empresa. Preguntas y resultados generales,
  que cualquier negocio reconozca como suyos. Los ejemplos son siempre de una empresa ficticia.

  POLAROID (tablero):
    pregunta   → la pregunta de negocio, general
    beneficio  → una línea: "Para …" (lo que gana quien lo usa)
    grupo      → nudo del tablero: "fin" (Finanzas), "ope" (Operaciones y procesos) o "dat" (Datos y clientes)
    visual     → mini gráfico: semaforo, barras, cohortes, alerta, ranking, margen, cruce, calendario, flujo
    tablero    → 1 a 6 = visible desde el inicio (en ese orden); 0 = sale con "Ver los 10 casos"
    portada    → true = sale como destacado en la portada (pon solo 2)
    categoria  → elige el ícono del caso

  FICHA (al abrir):
    area, resumen, estado
    contexto   → "Ejemplo ficticio · …" (qué tipo de empresa ficticia usa el ejemplo)
    problema   → UNA frase: la oportunidad, nunca una falla de alguien
    construi   → 3 líneas cortas
    recorrido  → 4 pasos: del dato a la decisión
    resultado  → UNA frase estratégica, que sirva para cualquier rubro
    otrosNegocios → 3 pares [rubro, uso]
    Más a fondo (opcional): herramientas, ia, numeros [indicador, antes, después], notaNumeros, decisiones
*/

const CASOS = [
  {
    id: "financiero-endore", categoria: "finanzas", numero: "01",
    area: "Finanzas · Indicadores",
    pregunta: "¿Cómo saber, al cierre, si el mes fue bueno?",
    beneficio: "Para decidir con indicadores, no con un saldo.",
    grupo: "fin", visual: "semaforo", tablero: 1,
    resumen: "Un dashboard de cierre que muestra qué funcionó, qué no y dónde actuar.",
    estado: "En uso",
    contexto: "una empresa de servicios",
    problema: "Al cierre había un saldo, pero no una lectura del mes: qué deja margen, qué está fallando y qué decidir.",
    construi: [
      "El mes en una frase: EBITDA, flujo, punto de equilibrio y caja.",
      "El margen real de cada servicio, ya sin impuestos ni comisiones.",
      "Un semáforo de 15 indicadores, cada uno con su meta."
    ],
    recorrido: ["Registros del mes", "Google Sheets", "Apps Script calcula", "Gerencia decide"],
    resultado: "La gerencia ve en una sola pantalla qué funciona, qué no y dónde actuar.",
    ia: "Desarrollo asistido por IA (Apps Script + HTML).",
    herramientas: ["Google Sheets", "Google Apps Script", "HTML / JavaScript", "IA como apoyo"],
    otrosNegocios: [["Retail", "Margen real por tienda, no solo ventas"], ["Restaurantes", "Ganancia por plato y por turno"], ["Servicios", "Producción por persona del equipo"]],
    fondo: "rosa"
  },
  {
    id: "kardex", categoria: "operaciones", numero: "02",
    area: "Operaciones · Inventario",
    pregunta: "¿Cómo saber si falta material antes de que sea tarde?",
    beneficio: "Para comprar lo justo y a tiempo.",
    grupo: "ope", visual: "alerta", tablero: 4,
    resumen: "Un inventario que lee las facturas, controla las salidas y avisa cuando el conteo no cuadra.",
    estado: "Implementado",
    contexto: "una empresa que ejecuta proyectos",
    problema: "El material se movía entre proyectos sin un registro común, así que cada compra se decidía sin saber qué había.",
    construi: [
      "Entrada automática: el sistema lee la factura.",
      "Salida controlada: solo se retira lo que hay.",
      "Conteo diario con alerta si algo no cuadra."
    ],
    recorrido: ["Factura o retiro", "Portal + n8n", "Stock al día", "Alerta si no cuadra"],
    resultado: "Las compras parten de lo que ya existe y las diferencias se detectan el mismo día.",
    ia: "Extracción de datos con IA: lee las facturas de compra.",
    herramientas: ["Portal web propio", "OCR con IA", "n8n", "Google Sheets"],
    otrosNegocios: [["Almacenes", "Detectar mermas entre turnos"], ["Farmacias", "Cuadrar el stock diario"], ["Restaurantes", "Controlar insumos de cocina"]],
    fondo: "tinta"
  },
  {
    id: "gastos-obra", categoria: "finanzas", numero: "03",
    area: "Finanzas · Rentabilidad",
    pregunta: "¿Cuánto deja realmente cada proyecto?",
    beneficio: "Para conocer el margen real de cada proyecto.",
    grupo: "fin", visual: "barras", tablero: 2, portada: true,
    resumen: "Cada gasto se registra con una foto, y el margen y los impuestos de cada proyecto se ven al instante.",
    estado: "En uso",
    contexto: "una empresa que ejecuta proyectos",
    problema: "Los comprobantes llegan por cientos y en fotos sueltas: si uno se escapa, el margen y su reparto dejan de ser exactos.",
    construi: [
      "Registro por foto: la IA lee RUC, base, IGV y categoría.",
      "Controles automáticos: duplicados y pagos sin factura.",
      "Un dashboard por proyecto: gasto vs. contrato, margen e impuestos."
    ],
    recorrido: ["Foto del comprobante", "IA lee y clasifica", "Base de proyectos", "Dashboard para gerencia"],
    resultado: "Cada gasto queda registrado y la rentabilidad se conoce al momento, no semanas después.",
    numeros: [
      ["Comprobantes de un solo proyecto", "—", "+1,200 registrados"],
      ["Registrar un comprobante", "A mano, en Excel", "Con una foto"],
      ["Consolidar los gastos del mes", "3 a 4 días", "Al día"],
      ["Margen e impuestos tras el cierre", "7 a 10 días", "Al instante"],
      ["Control de duplicados", "Ninguno", "Automático"]
    ],
    notaNumeros: "Tiempos estimados.",
    ia: "Integración de IA vía API: lee y clasifica cada comprobante. El dashboard, con desarrollo asistido por IA.",
    herramientas: ["n8n", "Gemini vía API", "Google Sheets", "Google Drive", "Dashboard propio en HTML"],
    otrosNegocios: [["Consultoras", "Rentabilidad por cliente"], ["Equipos en campo", "Rendición de gastos con foto"], ["Franquicias", "Gasto y margen por local"]],
    fondo: "rosa"
  },
  {
    id: "conciliacion", categoria: "finanzas", numero: "04",
    area: "Finanzas · Conciliación",
    pregunta: "¿Lo que te cobran cuadra con lo que realmente usaste?",
    beneficio: "Para pagar solo lo que corresponde.",
    grupo: "fin", visual: "cruce", tablero: 0,
    resumen: "Comparo el cobro de un proveedor con mis propios registros para encontrar diferencias antes de pagar.",
    estado: "En desarrollo",
    contexto: "una empresa que trabaja con proveedores aliados",
    problema: "Revisar cada cobro línea por línea toma cerca de una hora, y usar una IA en línea obligaría a compartir datos personales.",
    construi: [
      "Reglas de qué debe coincidir en ambos registros.",
      "Una comparación en Python que marca sola lo que no cuadra.",
      "Todo se procesa en la computadora: ningún dato personal sale a internet."
    ],
    recorrido: ["Cobro del proveedor", "Registro propio", "Python compara", "Revisar diferencias"],
    resultado: "Las diferencias aparecen solas, antes de pagar y sin exponer datos personales. Objetivo: de ~1 hora a minutos.",
    ia: "Desarrollo asistido por IA (Python), sin enviar datos a la IA.",
    herramientas: ["Python", "pandas", "rapidfuzz", "Excel"],
    otrosNegocios: [["Compras", "Facturas vs. órdenes de compra"], ["Ventas", "Banco vs. ventas registradas"], ["E-commerce", "Liquidación del marketplace vs. pedidos"]],
    fondo: "tinta"
  },
  {
    id: "precios", categoria: "finanzas", numero: "05",
    area: "Finanzas · Precios",
    pregunta: "¿Cuánto cobrar sin perder margen?",
    beneficio: "Para fijar precios con números, no a ojo.",
    grupo: "fin", visual: "margen", tablero: 6,
    resumen: "Costos, mercado, impuestos y comisiones en un solo lugar para decidir cada precio.",
    estado: "Aprobado",
    contexto: "una empresa que lanza productos y servicios",
    problema: "Poner un precio solo mirando a la competencia puede dejar un producto sin margen.",
    construi: [
      "El costo real de cada producto o servicio.",
      "Una base de +3,000 tarifas del mercado, extraída con web scraping.",
      "El cálculo con impuestos y comisión de cobro incluidos."
    ],
    recorrido: ["Costo", "Mercado", "Impuestos y comisiones", "Precio"],
    resultado: "Cada precio cubre su costo, sus impuestos y sus comisiones, es competitivo y se cobra por el medio más barato.",
    ia: "Web scraping asistido por IA para extraer las tarifas.",
    herramientas: ["Excel", "Web scraping", "Estudio de mercado"],
    otrosNegocios: [["Retail", "Precio de un producto nuevo"], ["Servicios", "Tarifa de un paquete o plan"], ["Restaurantes", "Precio de carta según el costo del plato"]],
    fondo: "rosa"
  },
  {
    id: "tdr", categoria: "operaciones", numero: "06",
    area: "Operaciones · Cumplimiento",
    pregunta: "¿Cómo cumplir cada plazo sin depender de la memoria?",
    beneficio: "Para cumplir los compromisos a tiempo.",
    grupo: "ope", visual: "calendario", tablero: 0,
    resumen: "Leo los contratos, extraigo cada obligación y aviso a su responsable antes de cada plazo.",
    estado: "Implementado",
    contexto: "una empresa con contratos y plazos",
    problema: "Las obligaciones de un contrato viven dentro de documentos largos, y es fácil que alguna se pase.",
    construi: [
      "Lectura automática de contratos: obligaciones y fechas.",
      "Cada obligación con su responsable.",
      "Avisos por correo y mensajería antes de cada plazo."
    ],
    recorrido: ["Contrato en PDF", "IA extrae plazos", "Responsable asignado", "Aviso antes del plazo"],
    resultado: "Cada obligación tiene responsable y aviso previo: el cumplimiento deja de depender de que alguien se acuerde.",
    ia: "Extracción de datos con IA: lee los contratos y saca obligaciones y plazos.",
    herramientas: ["Lectura con IA (OCR)", "Portal web propio", "Gmail", "Telegram"],
    otrosNegocios: [["Ventas B2B", "Plazos de contratos con clientes"], ["Legal", "Licencias y permisos que vencen"], ["Suscripciones", "Renovaciones y fechas de corte"]],
    fondo: "tinta"
  },
  {
    id: "clima", categoria: "personas", numero: "07",
    area: "Personas · Clima laboral",
    pregunta: "¿Qué área necesita atención primero?",
    beneficio: "Para priorizar dónde actuar primero.",
    grupo: "dat", visual: "ranking", tablero: 5,
    resumen: "Un diagnóstico de clima para cada sede y área, comparado con toda la organización y con semáforo.",
    estado: "Entregado",
    contexto: "una organización con muchas sedes",
    problema: "Antes de una medición oficial, cada líder necesitaba ver su resultado sin perderse en una base gigante.",
    construi: [
      "Respuestas unidas a la estructura: zona, área y sede.",
      "Medidas de participación, satisfacción y dimensiones.",
      "Dos dashboards: toda la organización y las áreas que más atención necesitaban."
    ],
    recorrido: ["Respuestas", "Power Query limpia", "Modelo + DAX", "Planes de acción"],
    resultado: "Cada líder recibe su diagnóstico y la organización enfoca sus recursos donde más se necesitan.",
    herramientas: ["Power BI", "Power Query", "DAX", "Figma"],
    otrosNegocios: [["Retail", "Satisfacción por tienda y zona"], ["Banca", "Resultados por oficina y región"], ["Educación", "Evaluaciones por sede y curso"]],
    fondo: "rosa"
  },
  {
    id: "procesos", categoria: "procesos", numero: "08",
    area: "Procesos · Gestión",
    pregunta: "¿Qué pasa si quien sabe hacerlo se va?",
    beneficio: "Para que el conocimiento no se vaya con las personas.",
    grupo: "ope", visual: "flujo", tablero: 0,
    resumen: "Un manual con flujogramas, rutinas por puesto y checklists, conectado a los sistemas.",
    estado: "Versión 01",
    contexto: "una empresa en crecimiento",
    problema: "Mucho del trabajo diario vivía en la memoria de las personas.",
    construi: [
      "Mapa de procesos y un flujograma por servicio.",
      "Rutinas de 9 puestos y 11 checklists.",
      "Todo conectado con los sistemas: alertas, inventario y gastos."
    ],
    recorrido: ["Levantar procesos", "Flujogramas", "Rutinas y checklists", "Conectar sistemas"],
    resultado: "Cualquier persona nueva sabe qué hacer desde el primer día.",
    ia: "Documentación asistida por IA: los procesos los levanté yo; la IA me ayudó a redactarlos.",
    herramientas: ["Flujogramas", "Bizagi (BPMN)", "Word", "IA como apoyo"],
    otrosNegocios: [["Cualquier empresa", "Inducción de personal nuevo"], ["Operaciones", "Checklists para que nada se olvide"], ["Auditoría", "Procesos documentados"]],
    fondo: "tinta"
  },
  {
    id: "datamatch", categoria: "personal", numero: "09", icono: "datamatch.png",
    area: "Proyecto personal · Python",
    pregunta: "¿Cómo unir bases cuando los nombres están mal escritos?",
    beneficio: "Para cruzar datos sin fórmulas.",
    grupo: "dat", visual: "cruce", tablero: 0,
    resumen: "Una app que limpia nombres y encuentra los parecidos que BUSCARX no reconoce.",
    estado: "Uso personal",
    contexto: "dos listas de personas",
    problema: "Para BUSCARX, \"Pérez, Juan\" y \"JUAN PEREZ\" son personas distintas, y limpiarlo con Power Query toma muchos pasos.",
    construi: [
      "Limpia cada nombre: tildes, comas, mayúsculas y orden.",
      "Mide el % de parecido con la otra base (fuzzy matching).",
      "Marca por colores lo seguro, lo que hay que revisar y lo que no tiene pareja."
    ],
    recorrido: ["Dos archivos Excel", "Limpieza", "Parecido %", "Excel con colores"],
    resultado: "Cualquier persona, sepa o no de Excel, une información que antes no coincidía.",
    ia: "Desarrollo asistido por IA (Python).",
    herramientas: ["Python", "pandas", "thefuzz", "customtkinter", "xlsxwriter"],
    otrosNegocios: [["RR.HH.", "Planillas vs. listas de asistencia"], ["Ventas", "Clientes de dos sistemas distintos"], ["Compras", "Proveedores escritos de forma distinta"]],
    fondo: "rosa"
  },
  {
    id: "retencion", categoria: "clientes", numero: "10",
    area: "Clientes · Retención · Python",
    pregunta: "¿Cuántos clientes vuelven y cuándo los perdemos?",
    beneficio: "Para retener clientes a tiempo.",
    grupo: "dat", visual: "cohortes", tablero: 3, portada: true,
    resumen: "Un análisis de cohortes en Python que muestra en qué momento se pierde a los clientes.",
    estado: "Análisis y propuesta",
    contexto: "una empresa de servicios recurrentes",
    problema: "El negocio crecía, pero no se sabía si los clientes volvían después de su primera visita.",
    construi: [
      "Miles de registros limpiados y anonimizados.",
      "Cohortes por mes de llegada: quién vuelve y cuándo.",
      "Una app con mapa de calor y simulador, validada con los números de caja."
    ],
    recorrido: ["Registros de visitas", "Limpieza en Python", "Cohortes", "Propuesta"],
    resultado: "Se identifica en qué momento se pierde a los clientes y qué acción concreta tomar.",
    decisiones: [
      "Agendar la siguiente visita antes de que el cliente se vaya (piloto A/B).",
      "Registrar cómo llegó cada cliente y un dato de contacto obligatorio.",
      "Descartar con datos causas que parecían obvias.",
      "Usar la demanda histórica para planear las compras."
    ],
    ia: "Desarrollo asistido por IA (Python).",
    herramientas: ["Python", "pandas", "Jupyter Notebook", "Streamlit", "Altair"],
    otrosNegocios: [["Gimnasios", "Quién renueva y cuándo se va"], ["Retail", "Qué clientes vuelven a comprar"], ["Suscripciones", "En qué mes se pierde a los clientes"]],
    fondo: "tinta"
  }
];
