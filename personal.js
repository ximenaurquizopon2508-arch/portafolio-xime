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
