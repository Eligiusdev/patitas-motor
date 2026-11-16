const assert = require("assert");
const ListaEnlazada = require("../src/ListaEnlazada");

function verificarLista(lista, datosEsperados, caso) {
    assert.deepStrictEqual(lista.aArreglo(), datosEsperados, caso);
    assert.strictEqual(lista.obtenerTamanio(), datosEsperados.length, `${caso}: tamanio`);
    assert.strictEqual(lista.estaVacia(), datosEsperados.length === 0, `${caso}: estaVacia`);

    if (datosEsperados.length === 0) {
        assert.strictEqual(lista.cabeza, null, `${caso}: cabeza vacia`);
        assert.strictEqual(lista.cola, null, `${caso}: cola vacia`);
        return;
    }

    assert.strictEqual(lista.cabeza.dato, datosEsperados[0], `${caso}: cabeza`);
    assert.strictEqual(
        lista.cola.dato,
        datosEsperados[datosEsperados.length - 1],
        `${caso}: cola`
    );
    assert.strictEqual(lista.cola.siguiente, null, `${caso}: cola.siguiente`);

    if (datosEsperados.length === 1) {
        assert.strictEqual(lista.cabeza, lista.cola, `${caso}: nodo unico`);
    }
}

const alFinal = new ListaEnlazada();
verificarLista(alFinal, [], "lista vacia antes de agregar al final");
alFinal.agregarAlFinal("A");
verificarLista(alFinal, ["A"], "agregar al final en lista vacia");
alFinal.agregarAlFinal("B");
verificarLista(alFinal, ["A", "B"], "agregar al final con un nodo");
alFinal.agregarAlFinal("C");
verificarLista(alFinal, ["A", "B", "C"], "agregar al final con varios nodos");

const alInicio = new ListaEnlazada();
alInicio.agregarAlInicio("A");
verificarLista(alInicio, ["A"], "agregar al inicio en lista vacia");
alInicio.agregarAlInicio("B");
verificarLista(alInicio, ["B", "A"], "agregar al inicio con un nodo");
alInicio.agregarAlInicio("C");
verificarLista(alInicio, ["C", "B", "A"], "agregar al inicio con varios nodos");

const visitados = [];
alFinal.recorrer((dato) => visitados.push(dato));
assert.deepStrictEqual(visitados, ["A", "B", "C"], "recorrer debe visitar en orden");

console.log("Pruebas basicas de ListaEnlazada: OK");

assert.strictEqual(
    alFinal.buscar((dato) => dato === "B"),
    "B",
    "buscar debe devolver el primer dato que cumple"
);
assert.strictEqual(alFinal.buscar((dato) => dato === "Z"), null, "buscar sin coincidencia");

const insertarDespuesDeLaCola = new ListaEnlazada();
insertarDespuesDeLaCola.agregarAlFinal("A");
insertarDespuesDeLaCola.agregarAlFinal("B");
assert.strictEqual(
    insertarDespuesDeLaCola.insertarDespuesDe((dato) => dato === "B", "C"),
    true,
    "insertar despues de la cola"
);
verificarLista(insertarDespuesDeLaCola, ["A", "B", "C"], "cola actualizada al insertar");
assert.strictEqual(insertarDespuesDeLaCola.cola.dato, "C");
assert.strictEqual(
    insertarDespuesDeLaCola.insertarDespuesDe((dato) => dato === "Z", "D"),
    false,
    "no insertar si no existe el nodo buscado"
);
verificarLista(insertarDespuesDeLaCola, ["A", "B", "C"], "insercion sin coincidencia");

const eliminarDeVacia = new ListaEnlazada();
assert.strictEqual(eliminarDeVacia.eliminar((dato) => dato === "A"), null, "eliminar en vacia");
verificarLista(eliminarDeVacia, [], "lista vacia despues de eliminar");

const eliminarUnico = new ListaEnlazada();
eliminarUnico.agregarAlFinal("Unico");
assert.strictEqual(
    eliminarUnico.eliminar((dato) => dato === "Unico"),
    "Unico",
    "eliminar unico nodo"
);
verificarLista(eliminarUnico, [], "lista vacia despues de eliminar el unico");

const eliminarCabeza = new ListaEnlazada();
eliminarCabeza.agregarAlFinal("A");
eliminarCabeza.agregarAlFinal("B");
eliminarCabeza.agregarAlFinal("C");
assert.strictEqual(eliminarCabeza.eliminar((dato) => dato === "A"), "A", "eliminar cabeza");
verificarLista(eliminarCabeza, ["B", "C"], "referencias despues de eliminar cabeza");

const eliminarIntermedio = new ListaEnlazada();
eliminarIntermedio.agregarAlFinal("A");
eliminarIntermedio.agregarAlFinal("B");
eliminarIntermedio.agregarAlFinal("C");
assert.strictEqual(
    eliminarIntermedio.eliminar((dato) => dato === "B"),
    "B",
    "eliminar nodo intermedio"
);
verificarLista(eliminarIntermedio, ["A", "C"], "referencias despues de eliminar intermedio");

const eliminarCola = new ListaEnlazada();
eliminarCola.agregarAlFinal("A");
eliminarCola.agregarAlFinal("B");
eliminarCola.agregarAlFinal("C");
assert.strictEqual(eliminarCola.eliminar((dato) => dato === "C"), "C", "eliminar cola");
verificarLista(eliminarCola, ["A", "B"], "cola despues de eliminar");
assert.strictEqual(eliminarCola.cola.dato, "B");
assert.strictEqual(eliminarCola.cola.siguiente, null);

const eliminarInexistente = new ListaEnlazada();
eliminarInexistente.agregarAlFinal("A");
eliminarInexistente.agregarAlFinal("B");
assert.strictEqual(
    eliminarInexistente.eliminar((dato) => dato === "Z"),
    null,
    "eliminar dato inexistente"
);
verificarLista(eliminarInexistente, ["A", "B"], "lista sin cambios al eliminar inexistente");

console.log("Pruebas de busqueda, insercion y eliminacion: OK");
