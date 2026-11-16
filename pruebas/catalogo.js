const assert = require("assert");
const {
    catalogo,
    catalogoOriginal,
    contarServicios,
    listarCatalogo,
    profundidad,
} = require("../src/catalogo");

assert.strictEqual(contarServicios(catalogoOriginal), 9);
assert.strictEqual(profundidad(catalogoOriginal), 3);
assert.strictEqual(contarServicios(catalogo), 10);
assert.strictEqual(profundidad(catalogo), 4);

const lineas = [];
listarCatalogo(catalogo, 0, (linea) => lineas.push(linea));
assert(lineas.includes("Patitas"));
assert(lineas.includes("    Especializada"));
assert(lineas.includes("        - Fondo de ojo: $160.000"));

console.log("Pruebas recursivas del catálogo: OK");
