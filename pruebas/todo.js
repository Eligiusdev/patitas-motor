const assert = require("assert");
const Nodo = require("../src/estructuras/Nodo");
const ListaEnlazada = require("../src/estructuras/ListaEnlazada");
const Cola = require("../src/estructuras/Cola");
const Pila = require("../src/estructuras/Pila");
const RegistroClinico = require("../src/dominio/RegistroClinico");
const Recepcion = require("../src/dominio/Recepcion");
const Editor = require("../src/dominio/Editor");
const catalogo = require("../src/dominio/catalogo");

let fallas = 0;

function probar(nombre, caso) {
    try {
        caso();
        console.log(`OK - ${nombre}`);
    } catch (error) {
        fallas += 1;
        console.error(`FALLA - ${nombre}: ${error.message}`);
    }
}

probar("Nodo normal y enlace nulo", () => {
    const primero = new Nodo("A");
    const segundo = new Nodo("B");
    assert.strictEqual(primero.siguiente, null);
    primero.siguiente = segundo;
    assert.strictEqual(primero.siguiente.dato, "B");
});

probar("Lista enlazada normal y vacía", () => {
    const lista = new ListaEnlazada();
    assert.strictEqual(lista.eliminar(() => true), null);
    lista.agregarAlFinal("A");
    lista.agregarAlInicio("B");
    assert.deepStrictEqual(lista.aArreglo(), ["B", "A"]);
    assert.strictEqual(lista.cabeza.dato, "B");
    assert.strictEqual(lista.cola.dato, "A");
    assert.strictEqual(lista.cola.siguiente, null);
    assert.strictEqual(lista.eliminar((dato) => dato === "A"), "A");
    assert.deepStrictEqual(lista.aArreglo(), ["B"]);
});

probar("Cola FIFO y cola vacía", () => {
    const cola = new Cola();
    assert.strictEqual(cola.desencolar(), null);
    cola.encolar("A");
    cola.encolar("B");
    assert.strictEqual(cola.verFrente(), "A");
    assert.strictEqual(cola.desencolar(), "A");
    assert.strictEqual(cola.desencolar(), "B");
    assert.strictEqual(cola.frente, null);
    assert.strictEqual(cola.final, null);
    assert.strictEqual(cola.tamanio(), 0);
});

probar("Pila LIFO y pila vacía", () => {
    const pila = new Pila();
    assert.strictEqual(pila.desapilar(), null);
    pila.apilar("A");
    pila.apilar("B");
    assert.strictEqual(pila.verTope(), "B");
    assert.strictEqual(pila.desapilar(), "B");
    assert.strictEqual(pila.desapilar(), "A");
    assert.strictEqual(pila.estaVacia(), true);
});

probar("Registro clínico normal y mascota inexistente", () => {
    const registro = new RegistroClinico();
    const atencion = { motivo: "Control" };
    registro.registrarAtencion("Lola", atencion);
    assert.strictEqual(registro.obtenerHistorial("Lola").cabeza.dato, atencion);
    assert.strictEqual(registro.obtenerHistorial("Toby"), null);
    assert.strictEqual(
        registro.eliminarAtencion("Lola", (dato) => dato === atencion),
        atencion
    );
    assert.strictEqual(registro.eliminarAtencion("Toby", () => true), null);
});

probar("Recepción prioritaria y vacía", () => {
    const recepcion = new Recepcion();
    recepcion.registrarLlegada({ mascota: "Toby", tipo: "General" });
    recepcion.registrarLlegada({ mascota: "Luna", tipo: "Urgencia" });
    assert.strictEqual(recepcion.llamarSiguiente().mascota, "Luna");
    assert.strictEqual(recepcion.llamarSiguiente().mascota, "Toby");
    assert.strictEqual(recepcion.estaVacia(), true);
    assert.strictEqual(recepcion.llamarSiguiente(), null);
});

probar("Editor undo, redo y pila de rehacer invalidada", () => {
    const registro = new RegistroClinico();
    const editor = new Editor(registro);
    const atencion = { id: "A" };
    assert.strictEqual(editor.deshacer(), false);
    assert.strictEqual(editor.rehacer(), false);
    editor.agregar("Lola", atencion);
    assert.strictEqual(editor.deshacer(), true);
    assert.strictEqual(registro.obtenerHistorial("Lola").estaVacia(), true);
    assert.strictEqual(editor.rehacer(), true);
    assert.strictEqual(registro.obtenerHistorial("Lola").cabeza.dato, atencion);
    editor.deshacer();
    editor.agregar("Lola", { id: "B" });
    assert.strictEqual(editor.rehacer(), false);

    editor.agregar("Toby", { id: "1" });
    const segundo = { id: "2" };
    editor.agregar("Toby", segundo);
    editor.agregar("Toby", { id: "3" });
    assert.strictEqual(editor.eliminar("Toby", (dato) => dato.id === "2"), segundo);
    assert.deepStrictEqual(
        registro.obtenerHistorial("Toby").aArreglo().map((dato) => dato.id),
        ["1", "3"]
    );
    assert.strictEqual(editor.deshacer(), true);
    assert.deepStrictEqual(
        registro.obtenerHistorial("Toby").aArreglo().map((dato) => dato.id),
        ["1", "2", "3"]
    );
});

probar("Catálogo recursivo normal y sin resultados", () => {
    assert.strictEqual(catalogo.contarServicios(catalogo.catalogoOriginal), 9);
    assert.strictEqual(catalogo.contarServicios(catalogo.catalogo), 10);
    assert.strictEqual(catalogo.buscarServicio(catalogo.catalogo, "Gata").precio, 280000);
    assert.strictEqual(catalogo.buscarServicio(catalogo.catalogo, "Peluquería"), null);
    assert.strictEqual(catalogo.precioPaquete({ servicios: [], subcategorias: [] }), 0);
    assert.deepStrictEqual(
        catalogo.serviciosEnRango({ servicios: [], subcategorias: [] }, 0, 100000),
        []
    );
});

probar("Operaciones recursivas normales y lista vacía", () => {
    const lista = new ListaEnlazada();
    lista.agregarAlFinal({ costo: 10, id: "A" });
    lista.agregarAlFinal({ costo: 20, id: "B" });
    assert.strictEqual(lista.tamanioRecursivo(), lista.obtenerTamanio());
    assert.strictEqual(lista.costoTotalRecursivo(), lista.costoTotal());
    assert.strictEqual(lista.buscarRecursivo((dato) => dato.id === "B").id, "B");
    assert.strictEqual(new ListaEnlazada().tamanioRecursivo(), 0);
});

if (fallas > 0) {
    process.exitCode = 1;
} else {
    console.log("Todas las pruebas terminaron: OK");
}
