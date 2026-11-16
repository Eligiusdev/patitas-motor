const Nodo = require("./Nodo");

class Pila {
    constructor() {
        this.tope = null;
        this.cantidad = 0;
    }

    apilar(dato) {
        const nuevo = new Nodo(dato);
        nuevo.siguiente = this.tope;
        this.tope = nuevo;
        this.cantidad += 1;
    }

    desapilar() {
        if (this.estaVacia()) {
            return null;
        }

        const nodoEliminado = this.tope;
        this.tope = nodoEliminado.siguiente;
        this.cantidad -= 1;
        nodoEliminado.siguiente = null;
        return nodoEliminado.dato;
    }

    verTope() {
        return this.estaVacia() ? null : this.tope.dato;
    }

    estaVacia() {
        return this.tope === null;
    }

    tamanio() {
        return this.cantidad;
    }
}

module.exports = Pila;
