/*
  personal.js = tus cosas personales de la portada.

  ESTAMPITAS: las ilustraciones chiquitas (están en ).
    archivo  → nombre del dibujo
    arriba / izquierda → dónde va, en % de la portada
    tamano   → ancho en píxeles
    giro     → inclinación en grados
    mueve    → cuánto se mueve con el mouse (0 = quieto, 1 = mucho)

  FOTOS: el collage transparente del fondo.
    1) Pon tu foto en la carpeta   (ej. mancora.jpg)
    2) Agrega una línea aquí abajo con el nombre
    Si la lista está vacía, no sale el collage. Máximo 4 fotos.
*/

const ESTAMPITAS = [
  // Van alrededor de la hojita (columna derecha). "izquierda" y "arriba" en % de la portada
  { archivo: "lirio.svg",     arriba: 2,  izquierda: 92, tamano: 70, giro: 8,   mueve: 0.6 },
  { archivo: "pasaporte.svg", arriba: 4,  izquierda: 55, tamano: 42, giro: 14,  mueve: 0.7 },
  { archivo: "taza.svg",      arriba: 74, izquierda: 52, tamano: 52, giro: -10, mueve: 0.9 },
  { archivo: "sombrero.svg",  arriba: 40, izquierda: 95, tamano: 66, giro: 6,   mueve: 0.4 },
  { archivo: "sapito.svg",    arriba: 84, izquierda: 88, tamano: 48, giro: -4,  mueve: 1   },
  { archivo: "palmera.svg",   arriba: 18, izquierda: 96, tamano: 52, giro: 4,   mueve: 0.8 },
  { archivo: "tacon.svg",     arriba: 64, izquierda: 96, tamano: 52, giro: -12, mueve: 0.5 }
];

const FOTOS = [
  // "mancora.jpg",
  // "punta-cana.jpg",
];

/*
  EXPERIENCIA: cada punto de la línea de tiempo (del más antiguo al más reciente).
    casos → los id de casos.js que hiciste ahí (salen como botones)
*/
const EXPERIENCIA = [
  { fecha: "Ago 2025 – Ene 2026", corto: "Grupo UP", cargo: "Practicante Pre Profesional · Gerencia General",
    empresa: "Grupo UP · Construcción",
    frase: "Instauré el primer control de inventario de la empresa y automaticé el registro de gastos.",
    casos: ["kardex", "procesos"] },
  { fecha: "Feb 2026 – Ago 2026", corto: "Caja Trujillo", cargo: "Practicante Profesional · Experiencia del Colaborador",
    empresa: "Caja Trujillo · Financiero",
    frase: "Dos dashboards de clima en Power BI antes de Great Place to Work: 106 agencias y +2,500 colaboradores.",
    casos: ["clima"] },
  { fecha: "Ago 2026 – actualidad", corto: "Grupo UP", cargo: "Soporte Financiero y de Sistemas (freelance)",
    empresa: "Grupo UP · Construcción",
    frase: "Sistema financiero con IA y un dashboard por proyecto que presento al gerente y al socio.",
    casos: ["gastos-obra", "tdr"] },
  { fecha: "Sep 2026 – actualidad", corto: "Endore", cargo: "Administradora",
    empresa: "Centro Médico Endore · Salud",
    frase: "Soporte directo a gerencia: indicadores de cierre, precios, conciliaciones y análisis de pacientes.",
    casos: ["financiero-endore", "retencion", "precios", "conciliacion"] }
];

/*
  CERTIFICADOS: imagen (en la misma carpeta) + nombre + quién lo da.
    nota → solo si quieres mostrarla (déjala vacía "" si no)
*/
const CERTIFICADOS = [
  { img: "cert-analista-datos.jpg", nombre: "Analista de Datos · SQL, Power BI y Python", entidad: "WE Educación Ejecutiva · 90 h · 2026", nota: "" },
  { img: "cert-sql.jpg",            nombre: "SQL Server for Analytics",            entidad: "WE Educación Ejecutiva · 30 h · 2026", nota: "" },
  { img: "cert-python.jpg",         nombre: "Python: Análisis de Datos",           entidad: "WE Educación Ejecutiva · 30 h · 2026", nota: "" },
  { img: "cert-powerbi-cip.jpg",    nombre: "Power Pivot y Power BI",              entidad: "Colegio de Ingenieros del Perú · 30 h · 2025", nota: "Nota 19" },
  { img: "cert-powerbi-upc.jpg",    nombre: "Análisis de Datos con Power BI",      entidad: "Becas Grupo Romero · UPC", nota: "" },
  { img: "cert-upn-proyectos.jpg",  nombre: "Formulador y Evaluador de Proyectos", entidad: "UPN · Certificación por competencias · 2026", nota: "" },
  { img: "cert-upn-gestion.jpg",    nombre: "Analista de Sistemas Integrados de Gestión", entidad: "UPN · Certificación por competencias · 2026", nota: "" },
  { img: "cert-estrategia.jpg",     nombre: "Estrategia Empresarial",              entidad: "Universidad Austral / IAE · Coursera · 2025", nota: "" },
  { img: "cert-administracion.jpg", nombre: "Administración para obtener resultados", entidad: "UNAM · Coursera · 2025", nota: "" }
];
