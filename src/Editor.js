const Pila = require("./Pila");

class Editor {
    constructor(registro) {
        this.registro = registro;
        this.pilaDeshacer = new Pila();
        this.pilaRehacer = new Pila();
    }

    agregar(mascota, atencion) {
        this.registro.registrarAtencion(mascota, atencion);
        this._vaciarPila(this.pilaRehacer);
        this.pilaDeshacer.apilar({ tipo: "agregar", mascota, atencion });
        return atencion;
    }

    eliminar(mascota, condicion) {
        const historial = this.registro.obtenerHistorial(mascota);
        if (historial === null) {
            return null;
        }

        let anterior = null;
        let actual = historial.cabeza;
        while (actual !== null && !condicion(actual.dato)) {
            anterior = actual;
            actual = actual.siguiente;
        }

        if (actual === null) {
            return null;
        }

        const atencion = actual.dato;
        const anteriorAtencion = anterior === null ? null : anterior.dato;
        const eliminada = this.registro.eliminarAtencion(
            mascota,
            (dato) => dato === atencion
        );
        if (eliminada === null) {
            return null;
        }

        this._vaciarPila(this.pilaRehacer);
        this.pilaDeshacer.apilar({
            tipo: "eliminar",
            mascota,
            atencion: eliminada,
            anterior: anteriorAtencion,
        });
        return eliminada;
    }

    deshacer() {
        const accion = this.pilaDeshacer.verTope();
        if (accion === null) {
            return false;
        }

        if (accion.tipo === "agregar") {
            const eliminada = this.registro.eliminarAtencion(
                accion.mascota,
                (dato) => dato === accion.atencion
            );
            if (eliminada === null) {
                throw new Error("No se pudo revertir la accion de agregar.");
            }
        } else {
            this._restaurarEliminacion(accion);
        }

        this.pilaDeshacer.desapilar();
        this.pilaRehacer.apilar(accion);
        return true;
    }

    rehacer() {
        const accion = this.pilaRehacer.verTope();
        if (accion === null) {
            return false;
        }

        if (accion.tipo === "agregar") {
            this.registro.registrarAtencion(accion.mascota, accion.atencion);
        } else {
            const eliminada = this.registro.eliminarAtencion(
                accion.mascota,
                (dato) => dato === accion.atencion
            );
            if (eliminada === null) {
                throw new Error("No se pudo repetir la accion de eliminar.");
            }
        }

        this.pilaRehacer.desapilar();
        this.pilaDeshacer.apilar(accion);
        return true;
    }

    _restaurarEliminacion(accion) {
        const historial = this.registro.obtenerHistorial(accion.mascota);
        if (historial === null) {
            throw new Error("No existe el historial necesario para restaurar la atencion.");
        }

        if (accion.anterior === null) {
            historial.agregarAlInicio(accion.atencion);
            return;
        }

        const insertada = historial.insertarDespuesDe(
            (dato) => dato === accion.anterior,
            accion.atencion
        );
        if (!insertada) {
            throw new Error("No se encontro la atencion anterior para restaurar el orden.");
        }
    }

    _vaciarPila(pila) {
        while (!pila.estaVacia()) {
            pila.desapilar();
        }
    }
}

module.exports = Editor;
