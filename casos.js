/*
  casos.js = la LISTA de tus casos.
  Es el único archivo que tocas para agregar, quitar o cambiar un caso.

  Datos de la TARJETA (lo que se ve en la grilla):
    id         → nombre corto SIN espacios. Une el caso con su ejemplo en ejemplos.js
    numero     → el número que sale en oro ("01"). Puedes reordenar libremente
    area, pregunta, resumen, estado
    destacado  → true = sale también en la portada (pon solo 2)
    categoria  → para los filtros: "finanzas", "clientes", "operaciones", "personas", "procesos" o "personal"
    icono      → (opcional) imagen propia en vez del ícono del área

  Datos de la FICHA (lo que se ve al hacer clic):
    problema      → qué pasaba antes
    hice          → lista de pasos de lo que hiciste
    resultado     → qué cambió
    decisiones    → (opcional) lista de decisiones que ayudó a tomar
    ia            → (opcional) cómo usaste la IA en este caso
    numeros       → (opcional) tabla antes vs. después: [indicador, antes, después]
    notaNumeros   → (opcional) nota chiquita debajo de la tabla
    herramientas  → con qué lo hiciste
    otrosNegocios → la misma lógica aplicada a otros rubros
    fondo         → color del bloque del ejemplo: "rosa" o "tinta"

  Donde diga [COMPLETAR], llénalo tú con tus palabras.
  Para agregar un caso: copia un bloque { ... } completo,
  pégalo al final, cambia los textos y pon una coma entre bloques.
*/

const CASOS = [
  {
    id: "financiero-endore",
    categoria: "finanzas",
    numero: "01",
    area: "Finanzas · Indicadores",
    pregunta: "¿Qué no te muestra el flujo de caja?",
    resumen: "Pasé de un flujo de caja mensual a un sistema con rentabilidad, impuestos y productividad por profesional.",
    estado: "En uso",
    destacado: false,
    problema: "La gerencia solo veía el flujo de caja a fin de mes. Sabía cuánto entró y salió, pero no cuánto ganaba el negocio de verdad ni qué servicios o profesionales empujaban los resultados.",
    hice: [
      "Ordené los ingresos y gastos para que se pudieran leer como estado de resultados.",
      "Construí un sistema web con indicadores financieros: EBIT, EBITDA e IGV por pagar.",
      "Sumé indicadores operativos: atenciones por profesional y servicios realizados."
    ],
    resultado: "Antes solo se veía el flujo de caja. Ahora la gerencia ve en una sola pantalla rentabilidad, impuestos y producción por profesional, y con mi guía saca conclusiones para decidir. Lo presento cada cierre de mes.",
    ia: "Desarrollo asistido por IA (Apps Script + HTML).",
    herramientas: ["Google Apps Script", "HTML", "IA como apoyo"],
    otrosNegocios: [
      ["Retail", "Margen real por tienda, no solo ventas"],
      ["Restaurante", "Rentabilidad por turno y por plato"],
      ["Servicios", "Productividad por persona del equipo"]
    ],
    fondo: "rosa"
  },
  {
    id: "kardex",
    categoria: "operaciones",
    numero: "02",
    area: "Operaciones · Inventario",
    pregunta: "¿Cómo saber si falta material antes de que sea tarde?",
    resumen: "Un inventario de obra que lee las facturas, solo deja retirar lo que hay y avisa cuando el conteo no cuadra.",
    estado: "Implementado en 3 obras",
    destacado: false,
    problema: "En obra no existía kárdex. Los materiales entraban y salían sin registro, y una diferencia se notaba recién cuando ya faltaba algo.",
    hice: [
      "Entrada: subes la foto o el PDF de la factura y el sistema la lee sola (proveedor, RUC, número de documento, ítems y precios).",
      "Salida: solo se puede retirar lo que hay en stock, así nadie saca lo que no existe.",
      "Conteo: al inicio y al fin del día se compara lo que dice el sistema con lo que se contó, y se ve la diferencia al instante.",
      "Todo queda sincronizado en una base de datos, con alerta si el cierre de un día no cuadra con la apertura del siguiente."
    ],
    resultado: "Se usó en 3 obras y fue el primer control de inventario de la empresa. Las diferencias se ven el mismo día, no al final de la obra.",
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
    pregunta: "¿Cuánto deja realmente cada obra?",
    resumen: "Los gastos se registran con una foto por Telegram y la utilidad y el IGV de cada obra se ven al instante en el dashboard, no 10 días después.",
    estado: "En uso",
    destacado: true,
    problema: "Los comprobantes llegaban como fotos sueltas por WhatsApp o en físico, y se digitaban a mano en Excel: unos 10 minutos por comprobante. A fin de mes, consolidar los gastos de cada obra tomaba de 3 a 4 días, y la utilidad estimada y el IGV a pagar llegaban de 7 a 10 días después del cierre, muy cerca del vencimiento del IGV. Además había comprobantes duplicados, perdidos o mal digitados.",
    hice: [
      "Empecé con una obra piloto: un bot de Telegram (UPcito) donde el personal manda el gasto como texto, foto o PDF. Cada grupo de Telegram está conectado a su obra.",
      "Con inteligencia artificial, el sistema lee RUC, base, IGV, total y tipo de comprobante, clasifica el gasto en su categoría y guarda la imagen en Drive.",
      "Sumé controles: detecta comprobantes duplicados, y cuando llega un voucher de transferencia, espera su factura y los une por monto. Si la factura no llega, lo registra como gasto sin factura y avisa.",
      "Lo extendí a todas las obras con una base maestra: cada obra tiene un código que conecta expedientes, valorizaciones, gastos, cobranzas y flujo de caja.",
      "Programé mi propio dashboard en HTML: cuánto del contrato ya se gastó, la ganancia separada de la plata que de verdad llega al banco (retención y detracción), gasto por mes, categoría y tipo de comprobante, y cuánto IGV falta pagar de bolsillo."
    ],
    resultado: "Un sistema completo de captura, control y visualización de las finanzas de obra, que la empresa sigue usando. Hoy presento a la gerencia los gastos por obra, la utilidad estimada y el IGV a pagar desde este sistema, y cruzo el IGV con SUNAT como verificación.",
    numeros: [
      ["Registrar un comprobante", "~10 min, a mano", "~1 min, con una foto"],
      ["Consolidar los gastos del mes", "3 a 4 días", "Automático, al día"],
      ["Utilidad e IGV listos tras el cierre", "7 a 10 días", "Al instante, en el dashboard"],
      ["Control de duplicados", "Ninguno", "Automático"]
    ],
    notaNumeros: "Tiempos estimados.",
    ia: "Integración de IA vía API: Gemini, conectado en n8n, extrae y clasifica cada comprobante. El dashboard, con desarrollo asistido por IA.",
    herramientas: ["n8n", "Telegram", "Gemini vía API", "Google Sheets", "Google Drive", "Dashboard propio en HTML"],
    otrosNegocios: [
      ["Proyectos", "Rentabilidad por proyecto o por cliente"],
      ["Equipos en campo", "Rendición de gastos con foto del comprobante"],
      ["Franquicias", "Gasto y margen por local"]
    ],
    fondo: "rosa"
  },
  {
    id: "conciliacion",
    categoria: "finanzas",
    numero: "04",
    area: "Finanzas · Conciliación",
    pregunta: "¿El abono cuadra con lo que atendimos?",
    resumen: "Comparo dos registros para encontrar diferencias antes de aceptar un pago.",
    estado: "En desarrollo",
    destacado: false,
    problema: "Con cada convenio, el aliado paga según su propio registro. Para saber si el abono es correcto hay que comparar línea por línea contra el registro propio, a mano y cada pocas semanas.",
    hice: [
      "Definí qué datos deben coincidir en los dos registros.",
      "Estoy automatizando la comparación para que marque sola lo que no cuadra.",
      "Las diferencias quedan listas para revisar antes de aceptar el pago."
    ],
    resultado: "Elimina la comparación precio por precio y la búsqueda manual en el sistema antes de aceptar cada abono.",
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
    pregunta: "¿Cuánto cobrar por un servicio sin perder?",
    resumen: "Costos, mercado y margen en un solo lugar para decidir el precio.",
    estado: "En análisis",
    destacado: false,
    problema: "Al cambiar de proveedor y abrir nuevas líneas de servicio, los precios tenían que definirse otra vez. Poner un precio solo mirando a la competencia puede dejar el servicio sin margen.",
    hice: [
      "Armé el costo real de cada servicio.",
      "Hice un estudio de mercado para ver los precios de la zona.",
      "Incluí el IGV y la comisión de la pasarela de pagos en el cálculo.",
      "Crucé costo, mercado y margen deseado para proponer un rango de precio."
    ],
    resultado: "Mis precios se aprobaron. Al mostrar cuánto se llevaba la comisión de la pasarela (cerca de 3%), la gerencia decidió cobrar directo con QR de Yape, siempre con boleta.",
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
    resumen: "Leo los términos de referencia y aviso a cada responsable antes de cada plazo.",
    estado: "Implementado",
    destacado: false,
    problema: "Las obligaciones y plazos de cada obra estaban enterrados en documentos largos. En una obra anterior, un plazo que nadie vio terminó en una penalidad.",
    hice: [
      "Construí un sistema que lee los documentos y extrae obligaciones y fechas.",
      "Asigné cada obligación a su responsable.",
      "Programé alertas por correo y por Telegram al responsable y a la gerencia antes de cada plazo."
    ],
    resultado: "Cada obligación tiene dueño y fecha desde el inicio de la obra. Nadie depende de acordarse.",
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
    resumen: "Un reporte de clima para cada agencia y área, comparado con toda la institución y con semáforo.",
    estado: "Entregado",
    destacado: false,
    problema: "El sondeo de clima cubría 106 agencias y áreas, organizadas en jerarquías (zonas, departamentos, agencias). Cada líder necesitaba ver SUS resultados y compararlos con los de toda la institución, sin perderse en una base gigante.",
    hice: [
      "Consolidé y transformé las bases del sondeo para conectar cada respuesta con su unidad y su jerarquía.",
      "Armé el modelo de datos y las medidas: participación, nivel de satisfacción, dimensiones, subdimensiones y cada pregunta.",
      "Construí un dashboard de 46 páginas con una vista para cada nivel, comparación contra el resultado institucional, evaluación del líder y semáforo de clima."
    ],
    resultado: "Los reportes llegaban a gerencia. Con los analistas del área definíamos el diagnóstico y se lo presentábamos a jefes zonales, supervisores y jefes de departamento, que armaban sus planes de acción. El seguimiento de esos planes también lo llevaba yo en Excel.",
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
    pregunta: "¿Cómo hacer que el trabajo no dependa de la memoria de una persona?",
    resumen: "Un manual de procesos con flujogramas, rutinas por puesto y checklists, conectado a los sistemas de la empresa.",
    estado: "Versión 01 · set 2026",
    destacado: false,
    problema: "La empresa presta tres servicios distintos (expedientes técnicos, supervisión y ejecución de obras públicas) y muchas tareas dependían de que alguien se acordara: plazos, cartas, seguros, cobros. Un olvido podía costar una penalidad o retrasar un pago.",
    hice: [
      "Armé el mapa de procesos: estratégicos, los tres servicios principales y los de soporte.",
      "Encontré cinco subprocesos que se repiten igual en los tres servicios (arranque de contrato, cobro, cierre, cartas y cierre mensual de finanzas) y los expliqué una sola vez.",
      "Dibujé un flujograma por servicio, con una tabla que dice qué se hace, quién, en qué plazo y dónde queda registrado.",
      "Escribí la rutina de 9 puestos y 11 checklists estándar, y conecté todo con los sistemas: alertas TDR, inventario y registro de gastos por Telegram."
    ],
    resultado: "Los procesos quedaron estandarizados y claros, y los plazos que antes casi terminaban en multas ya no se pasan. Cuando dejé el puesto, la asistente de gerencia que me reemplazó supo qué hacer desde el primer día gracias al manual.",
    ia: "Documentación asistida por IA: los procesos los levanté yo; la IA me ayudó a redactarlos y ordenarlos.",
    herramientas: ["IA como apoyo", "Flujogramas", "Word", "Google Drive"],
    otrosNegocios: [
      ["Cualquier empresa", "Inducción de personal nuevo con su rutina"],
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
    pregunta: "¿Cómo cruzar dos bases cuando los nombres no están escritos igual?",
    resumen: "Una app que cruza dos Excel sin fórmulas, aunque los nombres tengan tildes, comas o estén en otro orden.",
    estado: "Uso personal",
    destacado: false,
    problema: "Mis compañeras analistas no usaban fórmulas para cruzar bases, por más que se las explicara. Y BUSCARV falla apenas un nombre está escrito distinto: para Excel, \"Pérez, Juan\" no es \"JUAN PEREZ\".",
    hice: [
      "Programé una app de escritorio en Python: eliges el archivo de trabajo, el de referencia y qué columnas traer.",
      "Encuentra sola la fila de encabezados, aunque el Excel tenga títulos o filas vacías arriba.",
      "Limpia los nombres antes de compararlos: mayúsculas, sin tildes ni símbolos y con las palabras en orden.",
      "Si no hay coincidencia exacta, busca la más parecida, la pinta de amarillo y deja un comentario con el % para verificarla. Lo que no encuentra queda en rojo."
    ],
    resultado: "La hice para que el equipo cruzara bases sin fórmulas. No la adoptaron, pero yo la sigo usando para cruzar bases en segundos. Aprendí que una herramienta no sirve si el equipo no la adopta: ahora pienso desde el inicio en quién la va a usar y cómo se le enseña.",
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
    pregunta: "¿Cuántos pacientes vuelven, cada cuánto y en qué momento los perdemos?",
    resumen: "Analicé 10 meses de citas en Python y encontré que la clínica crece por los que vuelven, no por los nuevos.",
    estado: "Análisis y propuesta",
    destacado: true,
    problema: "La clínica crecía, pero nadie sabía si los pacientes, muchos de ellos crónicos, regresaban después de su primera visita, ni cada cuánto. No existía un número de retención.",
    hice: [
      "Tomé el reporte de citas del sistema y anonimicé a cada paciente con un código.",
      "Limpié las visitas: sin anuladas, solo con comprobante, y una sola visita por paciente por día.",
      "Armé cohortes por mes de llegada para medir qué porcentaje vuelve cada mes.",
      "Separé el \"mismo episodio\" (vuelve en pocos días con sus resultados) del control real (21 días o más).",
      "Validé los ingresos contra el flujo de caja y mostré todo en una app web con mapa de calor y simulador."
    ],
    resultado: "Al separar episodio de control, la retención real resultó mucho menor de lo que parecía: el análisis evitó una conclusión engañosa. Menos de la mitad vuelve a un control real, la clínica crece por los que vuelven y no por pacientes nuevos, las promociones atraen pero no fidelizan, y las inasistencias casi no existen. Los datos cuadraron con el flujo de caja.",
    decisiones: [
      "Causa encontrada: no hay un paso fijo para agendar el próximo control. Propuesta de costo cero: agendarlo antes de que el paciente salga, con un piloto A/B de 2 meses.",
      "Registrar en el sistema cómo conoció el paciente a la clínica y hacer obligatorio el celular.",
      "Descartar con datos dos causas: inasistencias y promociones.",
      "Usar las recetas encontradas en los datos como demanda para planear las compras de la farmacia."
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
