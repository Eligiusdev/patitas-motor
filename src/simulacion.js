const assert = require("assert");
const Recepcion = require("./Recepcion");

const turnos = [
    { mascota: "Toby", tipo: "General", motivo: "Control de vacunas", horaLlegada: "8:00" },
    { mascota: "Max", tipo: "General", motivo: "Revisión de piel", horaLlegada: "8:05" },
    { mascota: "Luna", tipo: "Urgencia", motivo: "Intoxicación", horaLlegada: "8:10" },
    { mascota: "Simón", tipo: "General", motivo: "Corte de uñas", horaLlegada: "8:20" },
    { mascota: "Kira", tipo: "Urgencia", motivo: "Herida en pata", horaLlegada: "8:25" },
    { mascota: "Nala", tipo: "General", motivo: "Desparasitación", horaLlegada: "8:40" },
    { mascota: "Rocky", tipo: "Urgencia", motivo: "Dificultad para respirar", horaLlegada: "9:00" },
];

function convertirAMinutos(hora) {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
}

function convertirAHora(minutosTotales) {
    const horas = Math.floor(minutosTotales / 60);
    const minutos = String(minutosTotales % 60).padStart(2, "0");
    return `${horas}:${minutos}`;
}

const recepcion = new Recepcion();
const ordenAtencion = [];
const promedios = {
    Urgencia: { total: 0, cantidad: 0 },
    General: { total: 0, cantidad: 0 },
};
let indiceLlegada = 0;
let tiempoActual = convertirAMinutos("8:00");

while (indiceLlegada < turnos.length || !recepcion.estaVacia()) {
    if (
        recepcion.estaVacia() &&
        indiceLlegada < turnos.length &&
        convertirAMinutos(turnos[indiceLlegada].horaLlegada) > tiempoActual
    ) {
        tiempoActual = convertirAMinutos(turnos[indiceLlegada].horaLlegada);
    }

    while (
        indiceLlegada < turnos.length &&
        convertirAMinutos(turnos[indiceLlegada].horaLlegada) <= tiempoActual
    ) {
        recepcion.registrarLlegada(turnos[indiceLlegada]);
        indiceLlegada += 1;
    }

    const turno = recepcion.llamarSiguiente();
    if (turno === null) {
        continue;
    }

    const llegada = convertirAMinutos(turno.horaLlegada);
    const espera = tiempoActual - llegada;
    assert(espera >= 0, `${turno.mascota} no puede ser atendida antes de llegar`);

    ordenAtencion.push({
        ...turno,
        horaAtencion: convertirAHora(tiempoActual),
        espera,
    });
    promedios[turno.tipo].total += espera;
    promedios[turno.tipo].cantidad += 1;
    tiempoActual += 20;
}

console.log("Orden de atención");
for (const turno of ordenAtencion) {
    console.log(
        `${turno.mascota} (${turno.tipo}) | llegada ${turno.horaLlegada} | atención ${turno.horaAtencion} | espera ${turno.espera} min`
    );
}

console.log(
    `Promedio de espera - urgencias: ${(promedios.Urgencia.total / promedios.Urgencia.cantidad).toFixed(2)} min`
);
console.log(
    `Promedio de espera - generales: ${(promedios.General.total / promedios.General.cantidad).toFixed(2)} min`
);

assert.deepStrictEqual(
    ordenAtencion.map((turno) => [turno.mascota, turno.horaAtencion, turno.espera]),
    [
        ["Toby", "8:00", 0],
        ["Luna", "8:20", 10],
        ["Kira", "8:40", 15],
        ["Rocky", "9:00", 0],
        ["Max", "9:20", 75],
        ["Simón", "9:40", 80],
        ["Nala", "10:00", 80],
    ],
    "el calendario simulado debe coincidir con el cálculo manual"
);
