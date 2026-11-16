const assert = require("assert");
const {
    catalogo,
    catalogoOriginal,
    contarServicios,
    listarCatalogo,
    profundidad,
    buscarServicio,
    rutaDeServicio,
    precioPaquete,
    serviciosEnRango,
} = require("../src/dominio/catalogo");

assert.strictEqual(contarServicios(catalogoOriginal), 9);
assert.strictEqual(profundidad(catalogoOriginal), 3);
assert.strictEqual(contarServicios(catalogo), 10);
assert.strictEqual(profundidad(catalogo), 4);

const lineas = [];
listarCatalogo(catalogo, 0, (linea) => lineas.push(linea));
assert(lineas.includes("Patitas"));
assert(lineas.includes("    Especializada"));
assert(lineas.includes("        - Fondo de ojo: $160.000"));

assert.deepStrictEqual(buscarServicio(catalogo, "Rabia"), {
    nombre: "Rabia",
    precio: 45000,
});
assert.deepStrictEqual(buscarServicio(catalogo, "Gata"), {
    nombre: "Gata",
    precio: 280000,
});
assert.strictEqual(buscarServicio(catalogo, "Peluquería"), null);
assert.deepStrictEqual(rutaDeServicio(catalogo, "Gata"), [
    "Patitas",
    "Cirugías",
    "Esterilización",
    "Gata",
]);
assert.deepStrictEqual(rutaDeServicio(catalogo, "Consulta general"), [
    "Patitas",
    "Consultas",
    "Consulta general",
]);
assert.strictEqual(rutaDeServicio(catalogo, "Peluquería"), null);

const cirugias = catalogo.subcategorias.find((categoria) => categoria.nombre === "Cirugías");
assert.strictEqual(precioPaquete(cirugias), 702000);
assert.strictEqual(precioPaquete({ servicios: [], subcategorias: [] }), 0);

assert.deepStrictEqual(
    serviciosEnRango(catalogo, 80000, 150000).map((servicio) => servicio.nombre),
    [
        "Consulta a domicilio",
        "Dermatología",
        "Cardiología",
        "Con anestesia",
        "Triple felina",
    ]
);
assert.deepStrictEqual(
    serviciosEnRango({ servicios: [], subcategorias: [] }, 0, 100000),
    []
);

const categoriaConCoincidenciaTemprana = {
    nombre: "Raíz",
    servicios: [],
    subcategorias: [
        {
            nombre: "Coincidencia",
            servicios: [{ nombre: "Encontrado", precio: 1 }],
            subcategorias: [],
        },
        {
            get servicios() {
                throw new Error("La búsqueda debió detenerse en la primera coincidencia");
            },
            subcategorias: [],
        },
    ],
};
assert.strictEqual(
    buscarServicio(categoriaConCoincidenciaTemprana, "Encontrado").nombre,
    "Encontrado"
);

console.log("Pruebas recursivas del catálogo: OK");
