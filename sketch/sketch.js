// Variables para las nubes
let imagenesNubes = [];
let cantidadNubes = 5;

// Variables globales nuevas (Fases 1, 2 y 3)
let datosNubes = [];
let offsetViento = 0;
let nivelIrregularidad = 0;

// Variables para el horizonte y colores
let horizonteY;
let colorCieloCenit;
let colorCieloHorizonte;
let colorMarHorizonte;
let colorMarAbajo;

function preload() {
  // Cargamos las imágenes de las nubes antes de que inicie el sketch
  for (let i = 1; i <= cantidadNubes; i++) {
    imagenesNubes.push(loadImage('img/nube' + i + '.png'));
  }
}

function setup() {
  // Proporción panorámica, similar a los lienzos de O'Keeffe
  createCanvas(1200, 600);

  // Definimos la altura del horizonte (ej: 75% de la pantalla hacia abajo)
  horizonteY = height * 0.25;

  // Definimos la paleta del cielo
  colorCieloCenit = color(158, 186, 240); // Azul más profundo arriba
  colorCieloHorizonte = color(242, 215, 235); // Celeste muy pálido/blanco abajo

  // Definimos la paleta del mar
  colorMarHorizonte = color(158, 186, 240); // Celeste muy claro donde toca el cielo
  colorMarAbajo = color(0, 57, 200); // Azul oscuro hacia el borde inferior

  // Como es la Entrega 2, quitamos el noLoop para permitir interacción
  // y generamos los datos base de las nubes una sola vez (Fase 1)
  generarNubes();
}

function generarNubes() {
  let cantidadFilas = 8; // Cantidad de hileras de nubes desde el horizonte

  for (let fila = 0; fila < cantidadFilas; fila++) {
    let profundidad = pow(fila / (cantidadFilas - 1), 2.5);
    let nubesPorFila = Math.floor(map(profundidad, 0, 1, 12, 4));
    let yPos = map(profundidad, 0, 1, horizonteY + 15, height - 20);
    let escala = map(profundidad, 0, 1, 0.15, 1.3);
    let anchoActual = 250 * escala;
    let altoActual = 120 * escala;
    let offsetX = (fila % 2 === 0) ? 0 : (anchoActual * 0.5);

    // Expandimos el margen de -10 a nubesPorFila + 10 (Fase 1) para cubrir el arrastre
    for (let col = -10; col <= nubesPorFila + 10; col++) {
      let xPos = map(col, 0, nubesPorFila - 1, 0, width);
      xPos += offsetX;

      let variacionX = random(-anchoActual * 0.2, anchoActual * 0.2);
      let variacionY = random(-altoActual * 0.2, altoActual * 0.2);
      let factorAleatorio = random(-0.2, 0.2); // Rango de variación base para el tamaño

      let xBase = xPos + variacionX;
      let yBase = yPos + variacionY;
      let imgIndex = Math.abs(fila + col) % cantidadNubes;

      // Guardamos la nube en la lista
      datosNubes.push({
        xBase: xBase,
        yBase: yBase,
        anchoBase: anchoActual,
        altoBase: altoActual,
        imgIndex: imgIndex,
        profundidad: profundidad,
        factorAleatorio: factorAleatorio
      });
    }
  }
}

function draw() {
  dibujarFondo();

  imageMode(CENTER);

  // Recorrer las nubes y dibujarlas (Fase 1 y 2)
  for (let i = 0; i < datosNubes.length; i++) {
    let nube = datosNubes[i];

    // Fase 2: Arrastre X (Viento)
    // Puedes ajustar estos valores para controlar la fuerza en los límites
    let fuerzaFondo = 0.1; // Fuerza en la línea del horizonte
    let fuerzaFrente = 1; // Fuerza en las nubes más cercanas al usuario

    let multiplicadorViento = map(nube.profundidad, 0, 1, fuerzaFondo, fuerzaFrente);
    let xFinal = nube.xBase + (offsetViento * multiplicadorViento);

    let yFinal = nube.yBase;

    // Fase 3: Irregularidad de tamaño dinámica
    let multiplicadorTamanio = 1 + (nube.factorAleatorio * nivelIrregularidad);
    let anchoFinal = nube.anchoBase * multiplicadorTamanio;
    let altoFinal = nube.altoBase * multiplicadorTamanio;

    image(imagenesNubes[nube.imgIndex], xFinal, yFinal, anchoFinal, altoFinal);
  }
}

// Fases 2 y 3: Función de arrastre (se activa solo al mantener presionado y mover)
function mouseDragged() {
  // Arrastre X (Viento)
  let deltaX = mouseX - pmouseX;
  offsetViento += deltaX;

  // Arrastre Y (Irregularidad)
  let deltaY = mouseY - pmouseY;
  // Restamos porque subir el mouse (deltaY negativo) debe aumentar la irregularidad
  nivelIrregularidad -= deltaY * 0.005;
  // Limitamos para que no se deformen demasiado (0 = todas iguales, 2 = muy caótico)
  nivelIrregularidad = constrain(nivelIrregularidad, 0, 3);
}

function dibujarFondo() {
  // DIBUJAR EL CIELO (de arriba hasta el horizonte)
  for (let y = 0; y <= horizonteY; y++) {
    // map() convierte 'y' en un valor de 0 a 1 dentro del rango del cielo
    let interpolacion = map(y, 0, horizonteY, 0, 1);
    let colorActual = lerpColor(colorCieloCenit, colorCieloHorizonte, interpolacion);

    stroke(colorActual);
    line(0, y, width, y);
  }

  // DIBUJAR EL MAR (desde el horizonte hasta abajo)
  for (let y = horizonteY; y <= height; y++) {
    // map() convierte 'y' en un valor de 0 a 1 dentro del rango del mar
    let interpolacion = map(y, horizonteY, height, 0, 1);
    let colorActual = lerpColor(colorMarHorizonte, colorMarAbajo, interpolacion);

    stroke(colorActual);
    line(0, y, width, y);
  }
}
