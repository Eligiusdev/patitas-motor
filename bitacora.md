# Bitácora: nodos enlazados

Lola es una gata de 4 años. Cada nodo contiene los datos de una atención y una referencia al nodo siguiente. `cabeza` guarda la referencia al primer nodo:

```text
cabeza
  |
  v
[02/02 Vacunación, $85.000] -> [15/03 Control de peso, $40.000] -> [20/05 Limpieza dental, $150.000] -> null
```

El enlace entre nodos se establece manualmente:

```text
vacunacion.siguiente = controlDePeso
controlDePeso.siguiente = limpiezaDental
```

El recorrido empieza en `cabeza` y avanza con `actual = actual.siguiente` hasta que `actual` vale `null`. Un segundo recorrido suma el costo de cada nodo; el resultado es **$275.000**.

## ¿Qué pasa si se pierde un enlace?

Si se cambia el enlace del primer nodo:

```text
vacunacion.siguiente = null
```

el recorrido que empieza en `cabeza` imprimirá únicamente la vacunación. El control de peso y la limpieza dental ya no son alcanzables siguiendo los enlaces desde la cabeza: una lista enlazada depende de esas referencias para conocer qué nodo sigue. Si no queda ninguna otra referencia a esos nodos, además podrían quedar disponibles para la recolección de memoria.

## Inserciones en una lista con cabeza y cola

Cada dibujo muestra cómo quedan las referencias después de insertar. En la lista vacía, agregar al final o al inicio crea un nodo que es a la vez cabeza y cola:

```text
Antes: cabeza -> null, cola -> null, tamanio = 0
Despues de agregar A:
        cabeza, cola
            |
            v
          [A | null]       tamanio = 1
```

Agregar al final cuando hay un nodo enlaza la cola anterior con el nuevo y mueve `cola`:

```text
Antes:  cabeza, cola
           |
           v
         [A | null]        tamanio = 1

Despues:
 cabeza                    cola
   |                         |
   v                         v
 [A | o] ----------------> [B | null]   tamanio = 2
```

Agregar al final cuando hay varios nodos mantiene `cabeza`, enlaza la cola anterior y mueve `cola`:

```text
Antes:  cabeza                         cola
           |                             |
           v                             v
         [A | o] --------------------> [B | null]

Despues: cabeza                                  cola
           |                                        |
           v                                        v
         [A | o] -> [B | o] --------------------> [C | null]
```

Agregar al inicio en una lista de un nodo enlaza el nuevo nodo con la cabeza anterior y mueve `cabeza`; `cola` no cambia:

```text
Antes:  cabeza, cola
           |
           v
         [A | null]        tamanio = 1

Despues:
 cabeza                    cola
   |                         |
   v                         v
 [B | o] ----------------> [A | null]   tamanio = 2
```

Agregar al inicio cuando hay varios nodos mueve `cabeza` y deja `cola` en el nodo final:

```text
Antes:  cabeza                         cola
           |                             |
           v                             v
         [A | o] --------------------> [B | null]

Despues: cabeza                         cola
           |                             |
           v                             v
         [C | o] -> [A | o] ----------> [B | null]
```

Las inserciones al inicio y al final son **O(1)**: usan las referencias `cabeza` y `cola` sin recorrer la lista. `recorrer` y `aArreglo` son **O(n)** porque visitan todos los nodos. `estaVacia` y `obtenerTamanio` son **O(1)**.

## Eliminaciones y sus referencias

En cada caso se busca con `anterior` y `actual`. Al borrar la cabeza, se mueve `cabeza` al segundo nodo y `cola` permanece igual:

```text
Antes:   cabeza                         cola
            |                             |
            v                             v
          [A | o] -> [B | o] ----------> [C | null]

Despues: cabeza                 cola
            |                    |
            v                    v
          [B | o] ------------> [C | null]    tamanio -= 1
```

Al borrar un nodo intermedio, `anterior.siguiente` salta el nodo eliminado:

```text
Antes:   cabeza                         cola
            |                             |
            v                             v
          [A | o] -> [B | o] ----------> [C | null]
                       ^
                   eliminado

Despues: cabeza                 cola
            |                    |
            v                    v
          [A | o] ------------> [C | null]    tamanio -= 1
```

Al borrar la cola, se busca el nodo anterior, se termina su enlace y se actualiza `cola`:

```text
Antes:   cabeza                         cola
            |                             |
            v                             v
          [A | o] -> [B | o] ----------> [C | null]
                                    anterior  eliminado

Despues: cabeza          cola
            |              |
            v              v
          [A | o] ------> [B | null]       tamanio -= 1
```

La lista guarda `siguiente`, pero no `anterior`. Por eso, aunque la cola ya se conoce, eliminarla requiere recorrer desde `cabeza` para encontrar el nodo previo: **O(n)**. Al eliminar cabeza, nodo intermedio, nodo único o un elemento inexistente, el tamaño y las referencias se ajustan; la cola siempre termina en `null`.

Complejidad de las operaciones:

| Operacion | Complejidad | Motivo |
| --- | --- | --- |
| `agregarAlFinal` | O(1) | Actualiza el nodo apuntado por `cola`. |
| `agregarAlInicio` | O(1) | Actualiza `cabeza` sin recorrer. |
| `recorrer` | O(n) | Visita cada nodo una vez. |
| `aArreglo` | O(n) | Recorre todos los datos para copiarlos. |
| `estaVacia` | O(1) | Consulta `tamanio`. |
| `obtenerTamanio` | O(1) | Devuelve el contador. |
| `buscar` | O(n) | En el peor caso revisa todos los nodos. |
| `insertarDespuesDe` | O(n) | Busca el nodo; el enlace en sí es O(1). |
| `eliminar` | O(n) | Busca el nodo y su anterior; actualizar enlaces es O(1). |

## Registro clínico y reporte v0.1

`RegistroClinico` usa un `Map` cuya clave es el nombre de la mascota y cuyo valor es su `ListaEnlazada`. Registrar una atención obtiene o crea la lista y la agrega al final. El reporte recorre cada historial para imprimir atenciones, contar registros y sumar costos. La última vacunación se consulta con `buscar`; los datos de esta versión tienen como máximo una vacunación por mascota.

### Lista enlazada frente a arreglo

| Operacion | Lista enlazada con cabeza y cola | Arreglo dinamico |
| --- | --- | --- |
| Agregar al final | O(1) | O(1) amortizado; O(n) si debe redimensionarse |
| Agregar al inicio | O(1) | O(n), desplaza los elementos existentes |
| Acceder a la atencion k | O(n), recorre desde cabeza | O(1), acceso por indice |
| Buscar un dato | O(n) | O(n) |
| Eliminar la primera | O(1), mueve cabeza | O(n), desplaza los elementos restantes |

La lista enlazada facilita insertar al inicio y al final sin mover datos, pero no ofrece acceso directo por posición. Un arreglo permite ese acceso, pero insertar o eliminar al inicio requiere desplazar elementos.