# Plan de Implementación: Interacción Modular por Fases

Este plan detalla la transformación del sketch en fases modulares. Se ha considerado el problema de los espacios vacíos, por lo que se generará un margen mucho más amplio de nubes invisibles a los costados del canvas.

## Fase 1: Refactorización y Márgenes Extendidos
El objetivo de esta fase es separar la generación de datos del dibujado (render) y expandir el mundo de nubes más allá de los límites de la pantalla para soportar el arrastre.

1.  Quitar la función `noLoop()` del `setup()`.
2.  Crear una variable global `datosNubes = []`.
3.  Mover la lógica del doble ciclo `for` desde `draw()` hacia una nueva función `generarNubes()` que se ejecutará en el `setup()`.
4.  **Márgenes Extendidos:** En el ciclo de las columnas (`col`), ampliaremos el rango. En lugar de ir desde `-2` hasta `nubesPorFila + 1`, iremos desde `-10` hasta `nubesPorFila + 10`. Esto generará un "colchón" gigante de nubes a izquierda y derecha del canvas.
5.  Para cada nube, guardaremos en un objeto: `xBase`, `yBase`, `anchoBase`, `altoBase`, `imgIndex`, `profundidad`, y `factorAleatorio` (un número random entre -0.5 y 0.5).
6.  En `draw()`, recorrer el arreglo `datosNubes` y simplemente dibujarlas usando sus propiedades guardadas.

## Fase 2: Implementación de Arrastre en Eje X (Viento y Estado)
Esta fase conectará el movimiento del mouse con el desplazamiento lateral, guardando el estado al soltar.

1.  Crear la variable global `offsetViento = 0`.
2.  Implementar la función `mouseDragged()` de p5.js.
3.  Dentro de `mouseDragged()`, calcular `deltaX = mouseX - pmouseX` y sumarlo a `offsetViento`.
4.  En el `draw()`, al procesar cada nube, aplicar la fórmula: `xFinal = nube.xBase + (offsetViento * nube.profundidad)`. Al multiplicar por la profundidad, logramos el efecto Parallax.

## Fase 3: Implementación de Arrastre en Eje Y (Irregularidad de Tamaños)
Esta última fase agregará el control sobre qué tan irregulares son los tamaños de las nubes entre sí.

1.  Crear la variable global `nivelIrregularidad = 0.5` (valor inicial por defecto).
2.  En `mouseDragged()`, calcular `deltaY = mouseY - pmouseY`.
3.  Restar este delta al nivel de irregularidad (restando, logramos que al subir el mouse, el nivel aumente): `nivelIrregularidad -= deltaY * 0.005`.
4.  Limitar el valor para evitar aberraciones: `nivelIrregularidad = constrain(nivelIrregularidad, 0, 2)`.
5.  En el `draw()`, calcular el multiplicador de tamaño: `multiplicadorTamanio = 1 + (nube.factorAleatorio * nivelIrregularidad)`.
6.  Aplicar el multiplicador al ancho y alto final al momento de usar `image()`.

## Verification Plan
1. Ejecutar Fase 1 y verificar que el canvas se ve igual que antes, sin parpadeos, y a 60fps constantes.
2. Ejecutar Fase 2, mantener presionado el click y arrastrar horizontalmente. Verificar que las nubes se desplazan largas distancias sin revelar espacios en blanco (gracias a la Fase 1). Verificar que al soltar el click, las nubes se quedan donde están.
3. Ejecutar Fase 3, arrastrar hacia abajo para comprobar que todas las nubes se vuelven uniformes. Arrastrar hacia arriba para que los tamaños diverjan caóticamente. Soltar el click y comprobar que el nivel de irregularidad se guarda correctamente.
