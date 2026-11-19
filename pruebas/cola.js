const assert = require("assert");
const Cola = require("../src/Cola");

const turnos = [
    { mascota: "Lola", tutor: "Ana", horaLlegada: "08:00", motivo: "Vacunación" },
    { mascota: "Toby", tutor: "Luis", horaLlegada: "08:05", motivo: "Control" },
    { mascota: "Mía", tutor: "Eva", horaLlegada: "08:10", motivo: "Esterilización" },
    { mascota: "Max", tutor: "Leo", horaLlegada: "08:15", motivo: "Consulta" },
    { mascota: "Kira", tutor: "Sol", horaLlegada: "08:20", motivo: "Herida" },
];

const cola = new Cola();
assert.strictEqual(cola.desencolar(), null, "desencolar una cola vacia");
assert.strictEqual(cola.frente, null);
assert.strictEqual(cola.final, null);

for (const turno of turnos) {
    cola.encolar(turno);
}

assert.strictEqual(cola.verFrente(), turnos[0]);
assert.strictEqual(cola.tamanio(), turnos.length);

const atendidos = [cola.desencolar()];
assert.strictEqual(atendidos[0], turnos[0]);
assert.strictEqual(cola.verFrente(), turnos[1], "verFrente avanza al siguiente turno");
assert.strictEqual(cola.tamanio(), turnos.length - 1);
while (!cola.estaVacia()) {
    atendidos.push(cola.desencolar());
}

assert.deepStrictEqual(atendidos, turnos, "la cola debe conservar el orden FIFO");
assert.strictEqual(cola.tamanio(), 0);
assert.strictEqual(cola.estaVacia(), true);
assert.strictEqual(cola.frente, null);
assert.strictEqual(cola.final, null);
assert.strictEqual(cola.desencolar(), null);
console.log("Pruebas FIFO de Cola: OK");

const cantidad = 100000;
const colaBenchmark = new Cola();
console.time("Cola enlazada: encolar 100000");
for (let i = 0; i < cantidad; i += 1) {
    colaBenchmark.encolar({ mascota: `Mascota ${i}` });
}
console.timeEnd("Cola enlazada: encolar 100000");

console.time("Cola enlazada: desencolar 100000");
while (!colaBenchmark.estaVacia()) {
    colaBenchmark.desencolar();
}
console.timeEnd("Cola enlazada: desencolar 100000");

const arreglo = [];
console.time("Arreglo: push 100000");
for (let i = 0; i < cantidad; i += 1) {
    arreglo.push({ mascota: `Mascota ${i}` });
}
console.timeEnd("Arreglo: push 100000");

console.time("Arreglo: shift 100000");
while (arreglo.length > 0) {
    arreglo.shift();
}
console.timeEnd("Arreglo: shift 100000");
