const Nodo = require("./Nodo");

class Cola {
    constructor() {
        this.frente = null;
        this.final = null;
        this.cantidad = 0;
    }

    encolar(dato) {
        const nuevo = new Nodo(dato);

        if (this.estaVacia()) {
            this.frente = nuevo;
            this.final = nuevo;
        } else {
            this.final.siguiente = nuevo;
            this.final = nuevo;
        }

        this.cantidad += 1;
    }

    desencolar() {
        if (this.estaVacia()) {
            return null;
        }

        const nodoEliminado = this.frente;
        this.frente = nodoEliminado.siguiente;
        this.cantidad -= 1;

        if (this.frente === null) {
            this.final = null;
        }

        nodoEliminado.siguiente = null;
        return nodoEliminado.dato;
    }

    verFrente() {
        return this.estaVacia() ? null : this.frente.dato;
    }

    estaVacia() {
        return this.frente === null;
    }

    tamanio() {
        return this.cantidad;
    }
}

module.exports = Cola;
