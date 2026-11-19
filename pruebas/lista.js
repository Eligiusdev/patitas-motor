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
