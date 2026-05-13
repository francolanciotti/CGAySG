# Plan de Desarrollo: Quinta Obra (Sky Above Clouds)

Este documento detalla el plan paso a paso para construir la obra generativa inspirada en Georgia O'Keeffe utilizando p5.js, empleando imágenes preexistentes para las nubes.

## 1. Componentes Necesarios

*   **Fondo (Cielo y Mar con gradiente):** Un sistema que divida la pantalla con una línea de horizonte. Arriba, dibujará el cielo con un gradiente; abajo, dibujará un mar que va desde un celeste muy claro cerca del horizonte hasta un azul oscuro en la parte inferior.
*   **Gestor de Imágenes (Assets):** Lógica para cargar y almacenar las imágenes de nubes que ya tienes (nube1, nube2, etc.) antes de que el sketch empiece a dibujar.
*   **Motor de Perspectiva (Grilla):** Un sistema matemático que calcule dónde ubicar cada imagen de nube. Las nubes más bajas en la pantalla (más cerca) se verán más grandes y estarán más espaciadas. Las nubes más altas (hacia el horizonte) se verán más pequeñas y más juntas.
*   **Sistema de Variación y "Ruido":** Lógica para romper la simetría. Esto incluye rotar levemente las nubes, alterar su tamaño ligeramente, aplicar sutiles transparencias, y elegir aleatoriamente qué imagen de nube mostrar en cada posición.

## 2. Orden de Implementación

1.  **Carga de Assets:** Implementar la función `preload()` para cargar las imágenes de las nubes en un arreglo (array) y asegurarse de que estén listas para usar.
2.  **Configuración del Canvas y Fondo:** Configurar el tamaño del lienzo en `setup()` (preferiblemente un formato panorámico). Crear una función para dibujar los gradientes del cielo y el mar divididos por el horizonte.
3.  **Prototipo de Posicionamiento Simple:** Crear un bucle (`for`) que dibuje una fila de imágenes de nubes en la parte inferior para probar que las imágenes se cargan y se ven bien.
4.  **Motor de Perspectiva:** Implementar el bucle anidado (filas y columnas). Empezar desde el horizonte (nubes más lejanas y pequeñas) dibujando hacia abajo (nubes más cercanas y grandes) para que las nubes que están delante tapen correctamente a las que están detrás.
5.  **Variación Orgánica:** Aplicar `random()` o `noise()` a la posición X e Y de cada nube en la grilla para que no queden alineadas perfectamente. Seleccionar aleatoriamente una imagen del array para cada posición.

## 3. Variables Globales Clave

*   **Assets:**
    *   `imagenesNubes = []`: Arreglo para guardar las imágenes cargadas.
    *   `cantidadNubes`: Número total de imágenes distintas que vas a usar.
*   **Paleta de Colores (Cielo y Mar):**
    *   `colorCieloCenit` y `colorCieloHorizonte`
    *   `colorMarHorizonte` y `colorMarAbajo`
*   **Perspectiva:**
    *   `horizonteY`: A qué altura de la pantalla (en píxeles) está la línea donde terminan las nubes.
    *   `filas`: Cantidad de hileras de nubes desde el horizonte hacia nosotros.
    *   `escalaCerca` y `escalaLejos`: Multiplicadores para el tamaño de las imágenes.

## 4. Funciones de p5.js a Utilizar

*   **Gestión de Assets:** `preload()`, `loadImage()`.
*   **Dibujo:** `image()`, `imageMode(CENTER)` (para ubicar las nubes desde su centro y que sea más fácil aplicarles transformaciones).
*   **Color y Efectos:** `lerpColor()` (para el gradiente del cielo).
*   **Matemática y Perspectiva:** `map()` (para calcular el tamaño y espaciado de una nube basándose en su posición Y).
*   **Transformaciones:** `push()`, `pop()`, `translate()`, `scale()` (para dibujar y alterar el tamaño de cada imagen de manera individual sin afectar a las demás).
*   **Variación:** `random()`.
*   **Flujo:** `noLoop()` (ya que la Entrega 1 requiere una imagen estática).
