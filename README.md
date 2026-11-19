# Motor Patitas v0.1

Motor de historiales clínicos de mascotas en JavaScript. Cada atención se guarda en una lista enlazada y `RegistroClinico` mantiene un historial por mascota.

## Estructuras

- `Nodo`: dato de una atención y referencia al nodo siguiente.
- `ListaEnlazada`: referencias a cabeza y cola, contador, inserciones, recorrido, búsqueda y eliminación.
- `RegistroClinico`: un `Map` que relaciona el nombre de cada mascota con su lista de atenciones.

## Ejecutar

Desde la raíz del proyecto, con Node.js instalado:

```bash
node pruebas/nodos.js
node pruebas/lista.js
node src/reporte.js
```

El reporte muestra el historial, número de atenciones, costo total y última vacunación (o “sin registro”) por mascota.