const catalogoOriginal = {
    nombre: "Patitas",
    servicios: [],
    subcategorias: [
        {
            nombre: "Consultas",
            servicios: [
                { nombre: "Consulta general", precio: 60000 },
                { nombre: "Consulta a domicilio", precio: 90000 },
            ],
            subcategorias: [
                {
                    nombre: "Especializada",
                    servicios: [
                        { nombre: "Dermatología", precio: 110000 },
                        { nombre: "Cardiología", precio: 130000 },
                    ],
                    subcategorias: [],
                },
            ],
        },
        {
            nombre: "Cirugías",
            servicios: [],
            subcategorias: [
                {
                    nombre: "Esterilización",
                    servicios: [
                        { nombre: "Gata", precio: 280000 },
                        { nombre: "Perra", precio: 350000 },
                    ],
                    subcategorias: [],
                },
                {
                    nombre: "Limpieza dental",
                    servicios: [{ nombre: "Con anestesia", precio: 150000 }],
                    subcategorias: [],
                },
            ],
        },
        {
            nombre: "Vacunas",
            servicios: [
                { nombre: "Rabia", precio: 45000 },
                { nombre: "Triple felina", precio: 85000 },
            ],
            subcategorias: [],
        },
    ],
};

const catalogo = JSON.parse(JSON.stringify(catalogoOriginal));
const consultas = catalogo.subcategorias.find((categoria) => categoria.nombre === "Consultas");
const especializada = consultas.subcategorias.find(
    (categoria) => categoria.nombre === "Especializada"
);
especializada.subcategorias.push({
    nombre: "Oftalmología",
    servicios: [{ nombre: "Fondo de ojo", precio: 160000 }],
    subcategorias: [],
});

function contarServicios(categoria) {
    let total = categoria.servicios.length;

    for (const subcategoria of categoria.subcategorias) {
        total += contarServicios(subcategoria);
    }

    return total;
}

function listarCatalogo(categoria, nivel = 0, imprimir = console.log) {
    imprimir(`${"  ".repeat(nivel)}${categoria.nombre}`);

    for (const servicio of categoria.servicios) {
        imprimir(
            `${"  ".repeat(nivel + 1)}- ${servicio.nombre}: $${servicio.precio.toLocaleString("es-CO")}`
        );
    }

    for (const subcategoria of categoria.subcategorias) {
        listarCatalogo(subcategoria, nivel + 1, imprimir);
    }
}

function profundidad(categoria) {
    let profundidadMaxima = 0;

    for (const subcategoria of categoria.subcategorias) {
        profundidadMaxima = Math.max(profundidadMaxima, profundidad(subcategoria));
    }

    return 1 + profundidadMaxima;
}

module.exports = {
    catalogo,
    catalogoOriginal,
    contarServicios,
    listarCatalogo,
    profundidad,
};
