const ListaEnlazada = require("../estructuras/ListaEnlazada");

class RegistroClinico {
    constructor() {
        this.historiales = new Map();
    }

    registrarAtencion(mascota, atencion) {
        let historial = this.historiales.get(mascota);

        if (historial === undefined) {
            historial = new ListaEnlazada();
            this.historiales.set(mascota, historial);
        }

        historial.agregarAlFinal(atencion);
    }

    eliminarAtencion(mascota, condicion) {
        const historial = this.obtenerHistorial(mascota);
        return historial === null ? null : historial.eliminar(condicion);
    }

    obtenerHistorial(mascota) {
        return this.historiales.get(mascota) || null;
    }

    obtenerMascotas() {
        return this.historiales.keys();
    }
}

module.exports = RegistroClinico;