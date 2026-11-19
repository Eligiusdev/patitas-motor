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