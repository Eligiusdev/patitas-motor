const Cola = require("./Cola");

class Recepcion {
    constructor() {
        this.urgencias = new Cola();
        this.generales = new Cola();
    }

    registrarLlegada(turno) {
        if (turno.tipo === "Urgencia") {
            this.urgencias.encolar(turno);
        } else {
            this.generales.encolar(turno);
        }
    }

    llamarSiguiente() {
        if (this.estaVacia()) {
            console.log("Sala vacía: no hay turnos para llamar.");
            return null;
        }

        if (!this.urgencias.estaVacia()) {
            return this.urgencias.desencolar();
        }

        return this.generales.desencolar();
    }

    estaVacia() {
        return this.urgencias.estaVacia() && this.generales.estaVacia();
    }
}

module.exports = Recepcion;
