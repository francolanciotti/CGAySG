// Variables para las nubes
let imagenesNubes = [];
let cantidadNubes = 5;

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

  // Como es la Entrega 1 (obra estática sin interacción), 
  // detenemos el loop para no consumir recursos innecesarios.
  noLoop();
}

function draw() {
  dibujarFondo();

  // PASO 4: Motor de Perspectiva
  imageMode(CENTER);

  let cantidadFilas = 8; // Cantidad de hileras de nubes desde el horizonte

  // Dibujamos desde la fila 0 (horizonte, más lejos) hasta la última fila (más cerca)
  // Esto asegura que las nubes grandes de adelante tapen a las pequeñas de atrás.
  for (let fila = 0; fila < cantidadFilas; fila++) {

    // Usamos pow() para lograr la perspectiva:
    // "profundidad" va de 0 a 1, pero crece lento al principio y rápido al final.
    let profundidad = pow(fila / (cantidadFilas - 1), 2.5);

    // Calculamos cuántas nubes caben en esta fila:
    // En el horizonte (profundidad 0) necesitamos muchas, abajo (profundidad 1) pocas.
    let nubesPorFila = Math.floor(map(profundidad, 0, 1, 12, 4));

    // Calculamos la posición Y (desde un poco abajo del horizonte hasta el borde inferior)
    let yPos = map(profundidad, 0, 1, horizonteY + 15, height - 20);

    // Calculamos el tamaño: muy chicas en el horizonte, muy grandes abajo
    let escala = map(profundidad, 0, 1, 0.15, 1.3);
    let anchoActual = 250 * escala;
    let altoActual = 120 * escala;

    // "Tresbolillo": Alternamos la posición X en filas pares/impares
    let offsetX = (fila % 2 === 0) ? 0 : (anchoActual * 0.5);

    // Empezamos desde -2 y vamos hasta nubesPorFila + 1 para cubrir los bordes
    for (let col = -2; col <= nubesPorFila + 1; col++) {

      // Distribuimos las nubes base a lo ancho del canvas
      let xPos = map(col, 0, nubesPorFila - 1, 0, width);
      xPos += offsetX;

      // PASO 5: Variación Aleatoria
      // Calculamos pequeños desfasajes aleatorios proporcionales al tamaño actual
      let variacionX = random(-anchoActual * 0.2, anchoActual * 0.2);
      let variacionY = random(-altoActual * 0.2, altoActual * 0.2);
      let variacionTamanio = random(0.8, 1.2); // Entre 80% y 120% del tamaño original

      // Aplicamos las variaciones
      let xFinal = xPos + variacionX;
      let yFinal = yPos + variacionY;
      let anchoFinal = anchoActual * variacionTamanio;
      let altoFinal = altoActual * variacionTamanio;

      // Seleccionamos una imagen de la lista
      let imgIndex = Math.abs(fila + col) % cantidadNubes;

      // Dibujamos la nube final con la variación aplicada
      image(imagenesNubes[imgIndex], xFinal, yFinal, anchoFinal, altoFinal);
    }
  }
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
