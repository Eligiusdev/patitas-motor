const assert = require("assert");
const Recepcion = require("../src/dominio/Recepcion");

const recepcion = new Recepcion();
const turnos = [
    { mascota: "Toby", tipo: "General" },
    { mascota: "Max", tipo: "General" },
    { mascota: "Luna", tipo: "Urgencia" },
    { mascota: "Kira", tipo: "Urgencia" },
];

for (const turno of turnos) {
    recepcion.registrarLlegada(turno);
}

assert.deepStrictEqual(
    [
        recepcion.llamarSiguiente().mascota,
        recepcion.llamarSiguiente().mascota,
        recepcion.llamarSiguiente().mascota,
        recepcion.llamarSiguiente().mascota,
    ],
    ["Luna", "Kira", "Toby", "Max"],
    "urgencias conservan prioridad y el orden FIFO de cada grupo"
);
assert.strictEqual(recepcion.estaVacia(), true);
assert.strictEqual(recepcion.llamarSiguiente(), null);
console.log("Pruebas de prioridad de Recepcion: OK");
