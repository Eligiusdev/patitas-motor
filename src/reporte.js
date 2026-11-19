const RegistroClinico = require("./dominio/RegistroClinico");

const registro = new RegistroClinico();
const atenciones = [
    { mascota: "Lola", fecha: "02/02", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 },
    { mascota: "Lola", fecha: "15/03", motivo: "Control de peso", veterinario: "Dr. Gómez", costo: 40000 },
    { mascota: "Lola", fecha: "20/05", motivo: "Limpieza dental", veterinario: "Dra. Ríos", costo: 150000 },
    { mascota: "Toby", fecha: "10/01", motivo: "Consulta por cojera", veterinario: "Dr. Gómez", costo: 60000 },
    { mascota: "Toby", fecha: "12/01", motivo: "Radiografía de pata", veterinario: "Dr. Gómez", costo: 120000 },
    { mascota: "Toby", fecha: "05/04", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 },
    { mascota: "Mía", fecha: "18/02", motivo: "Esterilización", veterinario: "Dra. Ríos", costo: 280000 },
    { mascota: "Mía", fecha: "25/02", motivo: "Control posquirúrgico", veterinario: "Dra. Ríos", costo: 0 },
];
const especies = {
    Lola: "gata",
    Toby: "perro",
    Mía: "gata",
};

for (const atencion of atenciones) {
    const { mascota, ...datosAtencion } = atencion;
    registro.registrarAtencion(mascota, datosAtencion);
}

function formatearCosto(costo) {
    return `$${costo.toLocaleString("es-CO")}`;
}

console.log("Historiales clínicos de Patitas");

for (const mascota of registro.obtenerMascotas()) {
    const historial = registro.obtenerHistorial(mascota);
    let costoTotal = 0;

    console.log(`\n${mascota} (${especies[mascota]})`);
    historial.recorrer((atencion) => {
        costoTotal += atencion.costo;
        console.log(
            `${atencion.fecha} | ${atencion.motivo} | ${atencion.veterinario} | ${formatearCosto(atencion.costo)}`
        );
    });

    console.log(`Atenciones: ${historial.obtenerTamanio()}`);
    console.log(`Costo total: ${formatearCosto(costoTotal)}`);

    const ultimaVacunacion = historial.buscar((atencion) =>
        /vacunaci[oó]n/i.test(atencion.motivo)
    );
    if (ultimaVacunacion === null) {
        console.log("Última vacunación: sin registro");
    } else {
        console.log(
            `Última vacunación: ${ultimaVacunacion.fecha} | ${ultimaVacunacion.motivo} | ${formatearCosto(ultimaVacunacion.costo)}`
        );
    }
}