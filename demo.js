const {
    catalogo,
    listarCatalogo,
    buscarServicio,
    rutaDeServicio,
    precioPaquete,
} = require("./src/dominio/catalogo");
const simularManana = require("./src/simulacion");

console.log("1. Catálogo de servicios");
listarCatalogo(catalogo);

console.log("\n2. Simulación de la mañana");
const resultado = simularManana({ imprimir: () => {}, demostrarRehacer: true });
for (const turno of resultado.ordenAtencion) {
    console.log(
        `${turno.mascota} | llegada ${turno.horaLlegada} | atención ${turno.horaAtencion} | espera ${turno.espera} min`
    );
}
console.log(
    `Promedio urgencias: ${(resultado.promedios.Urgencia.total / resultado.promedios.Urgencia.cantidad).toFixed(2)} min`
);
console.log(
    `Promedio generales: ${(resultado.promedios.General.total / resultado.promedios.General.cantidad).toFixed(2)} min`
);
resultado.recepcion.llamarSiguiente();

console.log("\n3. Corrección con deshacer y rehacer");
for (const paso of resultado.trazaCorreccion) {
    console.log(paso);
}

console.log("\n4. Historiales finales");
const mascotasAtendidas = new Set();
for (const turno of resultado.ordenAtencion) {
    mascotasAtendidas.add(turno.mascota);
}
for (const mascota of mascotasAtendidas) {
    const historial = resultado.registro.obtenerHistorial(mascota);
    console.log(`${mascota}:`);
    historial.recorrer((atencion) => {
        console.log(`  ${atencion.horaAtencion} | ${atencion.tipo} | ${atencion.motivo}`);
    });
}

console.log("\n5. Búsqueda de servicio y paquete");
const servicio = buscarServicio(catalogo, "Gata");
const ruta = rutaDeServicio(catalogo, "Gata");
const cirugias = catalogo.subcategorias.find((categoria) => categoria.nombre === "Cirugías");
console.log(`Servicio: ${ruta.join(" › ")} — $${servicio.precio.toLocaleString("es-CO")}`);
console.log(`Paquete Cirugías con 10 % de descuento: $${precioPaquete(cirugias).toLocaleString("es-CO")}`);
