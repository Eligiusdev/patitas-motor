const assert = require("assert");
const ListaEnlazada = require("../src/ListaEnlazada");

function crearHistorial(atenciones) {
    const historial = new ListaEnlazada();
    for (const atencion of atenciones) {
        historial.agregarAlFinal(atencion);
    }
    return historial;
}

const historiales = [
    {
        nombre: "Lola",
        atenciones: [
            { fecha: "02/02", motivo: "Vacunación anual", costo: 85000 },
            { fecha: "15/03", motivo: "Control de peso", costo: 40000 },
            { fecha: "20/05", motivo: "Limpieza dental", costo: 150000 },
        ],
        costo: 275000,
    },
    {
        nombre: "Toby",
        atenciones: [
            { fecha: "10/01", motivo: "Consulta por cojera", costo: 60000 },
            { fecha: "12/01", motivo: "Radiografía de pata", costo: 120000 },
            { fecha: "05/04", motivo: "Vacunación anual", costo: 85000 },
        ],
        costo: 265000,
    },
    {
        nombre: "Mía",
        atenciones: [
            { fecha: "18/02", motivo: "Esterilización", costo: 280000 },
            { fecha: "25/02", motivo: "Control posquirúrgico", costo: 0 },
        ],
        costo: 280000,
    },
];

for (const caso of historiales) {
    const historial = crearHistorial(caso.atenciones);
    assert.strictEqual(historial.tamanioRecursivo(), historial.obtenerTamanio(), caso.nombre);
    assert.strictEqual(historial.costoTotalRecursivo(), historial.costoTotal(), caso.nombre);
    assert.strictEqual(historial.costoTotalRecursivo(), caso.costo, caso.nombre);
    assert.deepStrictEqual(
        historial.buscarRecursivo((atencion) => atencion.motivo.includes("Vacunación")),
        historial.buscar((atencion) => atencion.motivo.includes("Vacunación")),
        `${caso.nombre}: buscar`
    );

    const inversas = caso.atenciones.slice().reverse();
    let indice = 0;
    historial.imprimirAlReves((atencion) => {
        assert.strictEqual(atencion, inversas[indice]);
        indice += 1;
    });
    assert.strictEqual(indice, caso.atenciones.length);
}

const vacia = new ListaEnlazada();
assert.strictEqual(vacia.tamanioRecursivo(), 0);
assert.strictEqual(vacia.costoTotalRecursivo(), 0);
assert.strictEqual(vacia.buscarRecursivo(() => true), null);
vacia.imprimirAlReves(() => assert.fail("La lista vacia no debe imprimir datos"));

const grande = new ListaEnlazada();
for (let i = 0; i < 100000; i += 1) {
    grande.agregarAlFinal({ costo: 1 });
}
assert.strictEqual(grande.obtenerTamanio(), 100000);
let desbordoPila = false;
try {
    grande.tamanioRecursivo();
} catch (error) {
    if (!(error instanceof RangeError)) {
        throw error;
    }
    desbordoPila = true;
    console.log(`Desbordamiento recursivo esperado: ${error.message}`);
}
assert.strictEqual(desbordoPila, true, "100.000 nodos deben exceder la pila de llamadas");

console.log("Pruebas recursivas de ListaEnlazada: OK");
