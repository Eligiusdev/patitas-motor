const assert = require("assert");
const Pila = require("../src/estructuras/Pila");
const Editor = require("../src/dominio/Editor");
const RegistroClinico = require("../src/dominio/RegistroClinico");

function describirPila(pila) {
    const acciones = [];
    let actual = pila.tope;
    while (actual !== null) {
        acciones.push(`${actual.dato.tipo}:${actual.dato.atencion.id}`);
        actual = actual.siguiente;
    }
    return acciones.reverse();
}

function verificarPaso(editor, registro, historialEsperado, deshacerEsperado, rehacerEsperado, paso) {
    assert.deepStrictEqual(
        registro.obtenerHistorial("Lola").aArreglo().map((atencion) => atencion.id),
        historialEsperado,
        `${paso}: historial`
    );
    assert.deepStrictEqual(describirPila(editor.pilaDeshacer), deshacerEsperado, `${paso}: deshacer`);
    assert.deepStrictEqual(describirPila(editor.pilaRehacer), rehacerEsperado, `${paso}: rehacer`);
}

const pila = new Pila();
assert.strictEqual(pila.desapilar(), null);
assert.strictEqual(pila.verTope(), null);
pila.apilar("A");
pila.apilar("B");
assert.strictEqual(pila.verTope(), "B");
assert.strictEqual(pila.tamanio(), 2);
assert.strictEqual(pila.desapilar(), "B");
assert.strictEqual(pila.desapilar(), "A");
assert.strictEqual(pila.estaVacia(), true);

const registro = new RegistroClinico();
const editor = new Editor(registro);
const atencionA = { id: "A" };
const atencionB = { id: "B" };
const atencionC = { id: "C" };

assert.strictEqual(editor.deshacer(), false);
assert.strictEqual(editor.rehacer(), false);

editor.agregar("Lola", atencionA);
verificarPaso(editor, registro, ["A"], ["agregar:A"], [], "1. agregar A");

editor.agregar("Lola", atencionB);
verificarPaso(editor, registro, ["A", "B"], ["agregar:A", "agregar:B"], [], "2. agregar B");

assert.strictEqual(editor.eliminar("Lola", (atencion) => atencion.id === "A"), atencionA);
verificarPaso(
    editor,
    registro,
    ["B"],
    ["agregar:A", "agregar:B", "eliminar:A"],
    [],
    "3. eliminar A"
);

assert.strictEqual(editor.deshacer(), true);
verificarPaso(
    editor,
    registro,
    ["A", "B"],
    ["agregar:A", "agregar:B"],
    ["eliminar:A"],
    "4. deshacer"
);

assert.strictEqual(editor.deshacer(), true);
verificarPaso(
    editor,
    registro,
    ["A"],
    ["agregar:A"],
    ["eliminar:A", "agregar:B"],
    "5. deshacer"
);

assert.strictEqual(editor.rehacer(), true);
verificarPaso(
    editor,
    registro,
    ["A", "B"],
    ["agregar:A", "agregar:B"],
    ["eliminar:A"],
    "6. rehacer"
);

editor.agregar("Lola", atencionC);
verificarPaso(
    editor,
    registro,
    ["A", "B", "C"],
    ["agregar:A", "agregar:B", "agregar:C"],
    [],
    "7. agregar C"
);

assert.strictEqual(editor.rehacer(), false);
verificarPaso(
    editor,
    registro,
    ["A", "B", "C"],
    ["agregar:A", "agregar:B", "agregar:C"],
    [],
    "8. rehacer sin accion"
);

console.log("Pruebas de Pila y Editor: OK");
