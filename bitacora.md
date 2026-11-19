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