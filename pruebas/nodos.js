const Nodo = require("../src/Nodo");

const vacunacion = new Nodo({
    fecha: "02/02",
    motivo: "Vacunación",
    veterinario: "Dra. Ríos",
    costo: 85000,
});
const controlDePeso = new Nodo({
    fecha: "15/03",
    motivo: "Control de peso",
    veterinario: "Dr. Gómez",
    costo: 40000,
});
const limpiezaDental = new Nodo({
    fecha: "20/05",
    motivo: "Limpieza dental",
    veterinario: "Dra. Ríos",
    costo: 150000,
});

vacunacion.siguiente = controlDePeso;
controlDePeso.siguiente = limpiezaDental;

const cabeza = vacunacion;

function formatearCosto(costo) {
    return `$${costo.toLocaleString("es-CO")}`;
}

console.log("Historial clínico de Lola (gata, 4 años):");
let actual = cabeza;
while (actual !== null) {
    const atencion = actual.dato;
    console.log(
        `${atencion.fecha} | ${atencion.motivo} | ${atencion.veterinario} | ${formatearCosto(atencion.costo)}`
    );
    actual = actual.siguiente;
}

let costoTotal = 0;
actual = cabeza;
while (actual !== null) {
    costoTotal += actual.dato.costo;
    actual = actual.siguiente;
}

console.log(`Costo total del historial: ${formatearCosto(costoTotal)}`);