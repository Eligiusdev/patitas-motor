# Motor Patitas v1.0

Motor de recepción e historiales clínicos para una clínica veterinaria. Integra listas enlazadas, colas FIFO, pilas LIFO, acciones reversibles, una recepción con prioridad de urgencias y un catálogo recursivo de servicios.

## Requisitos

- Node.js (no requiere instalar paquetes).
- CommonJS (`require` y `module.exports`).

## Organización

- `src/estructuras/`: `Nodo`, `ListaEnlazada`, `Cola` y `Pila`.
- `src/dominio/`: `RegistroClinico`, `Recepcion`, `Editor` y el catálogo.
- `src/simulacion.js`: simulación de eventos de la mañana.
- `src/reporte.js`: reporte de historiales de Lola, Toby y Mía.
- `demo.js`: demostración integrada del motor.
- `pruebas/`: pruebas de cada reto y verificación final.

## Ejecutar

Desde la raíz:

```bash
node demo.js
node pruebas/todo.js
```

La demostración contiene cinco secciones: catálogo, simulación priorizada, corrección con deshacer/rehacer, historiales finales y búsqueda/ruta/precio de paquete. Para explorar cada reto, también se pueden ejecutar `node src/simulacion.js`, `node src/reporte.js`, `node pruebas/cola.js`, `node pruebas/editor.js`, `node pruebas/catalogo.js` y `node pruebas/recursividad.js`. La prueba de cola incluye un benchmark de 100.000 turnos.

## Estructuras y complejidad

| Estructura | Operaciones principales | Complejidad |
| --- | --- | --- |
| `Nodo` | Leer/actualizar `dato` y `siguiente` | O(1) |
| `ListaEnlazada` | Agregar al inicio/final; obtener tamaño | O(1) |
| `ListaEnlazada` | Recorrer, costo total, buscar, insertar después y eliminar por condición | O(n) tiempo, O(1) memoria iterativa |
| `ListaEnlazada` | Tamaño/costo/búsqueda recursivos; imprimir al revés | O(n) tiempo y O(n) pila de llamadas |
| `Cola` | Encolar, desencolar, ver frente, vacío y tamaño | O(1) |
| `Pila` | Apilar, desapilar, ver tope, vacío y tamaño | O(1) |
| `RegistroClinico` | Obtener/crear historial con `Map` | O(1) promedio; agregar al final O(1) |
| `RegistroClinico` | Eliminar atención por condición | O(n) |
| `Recepcion` | Registrar llegada y llamar siguiente con prioridad | O(1) |
| `Editor` | Agregar acción | O(1), salvo vaciar rehacer pendiente (O(r)) |
| `Editor` | Eliminar, deshacer o rehacer acción en historial | O(n) en el peor caso |
| Catálogo | Contar, listar, buscar, crear ruta o sumar paquete | O(N) tiempo, O(h) pila recursiva |
| Catálogo | Filtrar servicios en rango | O(N) tiempo, O(h) pila recursiva + O(k) para los resultados |
| Catálogo | Calcular profundidad | O(C) tiempo, O(h) pila recursiva |

`n` es el número de atenciones, `r` el número de acciones que deban descartarse de rehacer, `N` los servicios/categorías visitados, `C` las categorías, `h` la profundidad máxima del catálogo y `k` los servicios que coinciden con el rango.

## Clonar y verificar

```bash
git clone https://github.com/Eligiusdev/patitas-motor.git
cd patitas-motor
node demo.js
node pruebas/todo.js
```