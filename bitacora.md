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

## Cola FIFO de recepción

La cola guarda dos referencias: `frente` apunta al próximo turno y `final` al último. Después de encolar a Lola, Toby y Mía, y desencolar una vez:

```text
Antes de desencolar:
frente                                  final
  |                                       |
  v                                       v
[Lola | o] -> [Toby | o] ------------> [Mía | null]

Sale Lola. Estado resultante:
frente                   final
  |                        |
  v                        v
[Toby | o] ------------> [Mía | null]
```

`encolar` enlaza el nuevo nodo desde `final`; `desencolar` mueve `frente` al siguiente nodo. Ambos actualizan referencias sin recorrer la cola.

### Complejidad: cola enlazada y arreglo

| Operacion | Cola enlazada | Arreglo |
| --- | --- | --- |
| Encolar | O(1) | `push`: O(1) amortizado |
| Desencolar | O(1) | `shift`: O(n) |
| Ver frente | O(1) | `arreglo[0]`: O(1) |
| Consultar si esta vacia | O(1) | `length === 0`: O(1) |
| Consultar tamanio | O(1) | `length`: O(1) |

`shift()` desplaza las referencias restantes para cerrar el espacio del primer elemento. La cola enlazada solo mueve la referencia `frente`; por eso desencolar no depende de cuántos turnos esperan.

### Medicion local de 100.000 turnos

Medicion en este entorno con Node.js y `console.time` en `node pruebas/cola.js`:

| Operacion (100.000 turnos) | Primera ejecucion | Repeticion |
| --- | ---: | ---: |
| Cola enlazada: encolar | 89,45 ms | 96,695 ms |
| Cola enlazada: desencolar | 8,472 ms | 8,869 ms |
| Arreglo: `push` | 33,808 ms | 43,105 ms |
| Arreglo: `shift` | 26,031 s | 2,428 s |

Son mediciones ilustrativas, no una garantia: los tiempos variaron entre ejecuciones y dependen de la carga de la máquina y de Node.js. En ambas, `shift()` fue mucho más costoso que desencolar en la cola enlazada, porque desplaza elementos en lugar de mover una sola referencia.

## Recepción con prioridad: cálculo manual

Se atiende durante 20 minutos por turno. El consultorio comienza libre a las 8:00; solo se considera a quienes ya llegaron. Al quedar libre, se toma primero la urgencia más antigua; si no hay urgencias esperando, se toma la consulta general más antigua.

| Inicio | Evento disponible al elegir | Turno elegido | Tipo | Espera |
| --- | --- | --- | --- | ---: |
| 8:00 | Toby llega | Toby | General | 0 min |
| 8:20 | Max, Luna y Simón ya llegaron | Luna | Urgencia | 10 min |
| 8:40 | Kira y Nala ya llegaron | Kira | Urgencia | 15 min |
| 9:00 | Rocky llega al terminar Kira | Rocky | Urgencia | 0 min |
| 9:20 | No quedan urgencias; Max espera desde 8:05 | Max | General | 75 min |
| 9:40 | Simón es la siguiente consulta general | Simón | General | 80 min |
| 10:00 | Nala es la siguiente consulta general | Nala | General | 80 min |

Orden manual: **Toby, Luna, Kira, Rocky, Max, Simón, Nala**. El promedio de espera de urgencias es `(10 + 15 + 0) / 3 = 8,33 min`; el de generales es `(0 + 75 + 80 + 80) / 4 = 58,75 min`. No se detectó discrepancia entre la simulación por eventos y este cálculo; por lo tanto, no hubo síntoma, hipótesis ni corrección adicionales que documentar.

## Pila y deshacer/rehacer

Se eligió una pila enlazada con `Nodo`: `apilar` y `desapilar` solo cambian la referencia `tope` y son O(1), sin desplazar elementos ni redimensionar arreglos. `verTope`, `estaVacia` y `tamanio` también son O(1).

La traza muestra el contenido de cada pila desde la base hasta el tope:

| Paso | Accion | Historial de Lola | Pila deshacer | Pila rehacer |
| ---: | --- | --- | --- | --- |
| 1 | Agregar A | A | +A | vacia |
| 2 | Agregar B | A, B | +A, +B | vacia |
| 3 | Eliminar A | B | +A, +B, -A | vacia |
| 4 | Deshacer | A, B | +A, +B | -A |
| 5 | Deshacer | A | +A | -A, +B |
| 6 | Rehacer | A, B | +A, +B | -A |
| 7 | Agregar C | A, B, C | +A, +B, +C | vacia |
| 8 | Rehacer | A, B, C | +A, +B, +C | vacia |

Cada acción nueva borra la pila de rehacer. Por eso, después de agregar C, el último rehacer no modifica el historial.

## Estructuras integradas en Motor Patitas v0.2

| Estructura | Principio | Uso en Patitas | Complejidad principal |
| --- | --- | --- | --- |
| `Nodo` | Secuencial | Enlaza un dato con el siguiente nodo. | Leer o actualizar `siguiente`: O(1). |
| `ListaEnlazada` | Secuencial | Historial de atenciones por mascota. | Insertar en extremos: O(1); buscar/eliminar por condición: O(n). |
| `Cola` | FIFO | Espera de pacientes, por categoría. | Encolar/desencolar: O(1). |
| `Pila` | LIFO | Historial de acciones de deshacer y rehacer. | Apilar/desapilar/ver tope: O(1). |
| `RegistroClinico` | Índice por clave | Localiza la lista de cada mascota con un `Map`. | Obtener/crear historial: O(1) promedio; agregar al final: O(1). |
| `Recepcion` | Prioridad + FIFO | Elige urgencias antes que generales y conserva el orden de cada cola. | Registrar llegada/llamar siguiente: O(1). |
| `Editor` | Acciones reversibles con dos pilas | Corrige altas y eliminaciones en historiales. | Agregar: O(1) salvo limpiar rehacer; eliminar/deshacer/rehacer: O(n) cuando buscan en el historial. |

En la simulación integrada, la atención equivocada de Toby se agrega primero al historial de Max, se revierte con `deshacer` y luego se registra correctamente en Toby. La comprobación final confirma siete atenciones en los historiales correspondientes. Si se llama a recepción con ambas colas vacías, se informa que la sala está vacía y se devuelve `null`.

## MiniReto 9: catálogo anidado

Cada función desciende a las subcategorías hasta llegar a una categoría sin hijas (arreglo vacío): ese es el caso base. La reducción es procesar una subcategoría más pequeña; la combinación incorpora el resultado de esa llamada al resultado de la categoría actual.

| Funcion | Caso base | Reduccion | Combinacion |
| --- | --- | --- | --- |
| `contarServicios` | La categoria no tiene subcategorias; cuenta sus servicios. | Llama a la misma funcion para cada subcategoria. | Suma los servicios locales y los subtotales recibidos. |
| `listarCatalogo` | No hay subcategorias que visitar; imprime categoria y servicios locales. | Llama para cada subcategoria con nivel + 1. | La sangria ` " ".repeat(nivel)` refleja el nivel de cada llamada. |
| `profundidad` | Sin subcategorias devuelve 1 (la categoria actual). | Calcula la profundidad de cada subcategoria. | Devuelve 1 + la profundidad maxima de las hijas. |

El catálogo original tiene 9 servicios y profundidad 3. Se agregó `Oftalmología` dentro de `Consultas > Especializada`, con el servicio `Fondo de ojo` de $160.000: el catálogo extendido tiene 10 servicios y profundidad 4.

### Traza de `contarServicios(Cirugías)`

```text
contarServicios(Cirugías): servicios locales = 0
  contarServicios(Esterilización): 2 + 0 subcategorías = 2
  contarServicios(Limpieza dental): 1 + 0 subcategorías = 1
Combinar en Cirugías: 0 + 2 + 1 = 3 servicios
```

## MiniReto 10: búsquedas, rutas y paquetes

`buscarServicio` revisa primero los servicios locales y luego recorre subcategorías; al encontrar una coincidencia la devuelve inmediatamente y no visita las ramas restantes. `rutaDeServicio` añade el nombre de cada categoría al arreglo que retorna la llamada hija. `serviciosEnRango` combina los resultados locales con los de cada subcategoría.

`precioPaquete` separa `sumarPrecios`, que acumula todo el árbol sin descuentos, de la función pública que aplica una sola vez el 10 %. Para Cirugías, el total sin descuento es $780.000 y el paquete correcto es **$702.000**.

Error de descontar en cada llamada: Esterilización terminaría en $567.000 (90 % de $630.000) y Limpieza dental en $135.000 (90 % de $150.000); la raíz volvería a aplicar el 90 % a $702.000 y daría **$631.800**, un descuento efectivo de 19 % sobre el subtotal. El descuento debe aplicarse únicamente después de combinar todas las ramas.

El rango inclusivo de $80.000 a $150.000 contiene cinco servicios: Consulta a domicilio, Dermatología, Cardiología, Con anestesia y Triple felina. `Fondo de ojo` cuesta $160.000 y queda fuera del rango.