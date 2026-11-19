# Motor Patitas v0.2

Motor de recepción e historiales clínicos de mascotas en JavaScript. La recepción prioriza urgencias, registra cada atención en una lista enlazada y permite deshacer o rehacer cambios.

## Estructuras

- `Nodo`: dato de una atención y referencia al nodo siguiente.
- `ListaEnlazada`: referencias a cabeza y cola, contador, inserciones, recorrido, búsqueda y eliminación.
- `Cola`: turnos FIFO enlazados con referencias al frente y al final.
- `Pila`: acciones LIFO para deshacer y rehacer.
- `RegistroClinico`: un `Map` que relaciona el nombre de cada mascota con su lista de atenciones.
- `Recepcion` y `Editor`: prioridad de urgencias e historial de acciones reversibles.

## Ejecutar

Desde la raíz del proyecto, con Node.js instalado:

```bash
node pruebas/nodos.js
node pruebas/lista.js
node pruebas/cola.js
node pruebas/recepcion.js
node pruebas/editor.js
node src/reporte.js
node src/simulacion.js
```

`node pruebas/cola.js` también mide encolado/desencolado de 100.000 turnos frente a `push`/`shift`. `node src/simulacion.js` ejecuta la mañana del sábado, muestra horas y esperas, corrige una atención mal registrada mediante deshacer y presenta los historiales resultantes.