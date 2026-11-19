const Nodo = require("./Nodo");

class ListaEnlazada {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.tamanio = 0;
    }

    agregarAlFinal(dato) {
        const nuevo = new Nodo(dato);

        if (this.estaVacia()) {
            this.cabeza = nuevo;
            this.cola = nuevo;
        } else {
            this.cola.siguiente = nuevo;
            this.cola = nuevo;
        }

        this.tamanio += 1;
    }

    agregarAlInicio(dato) {
        const nuevo = new Nodo(dato);

        if (this.estaVacia()) {
            this.cabeza = nuevo;
            this.cola = nuevo;
        } else {
            nuevo.siguiente = this.cabeza;
            this.cabeza = nuevo;
        }

        this.tamanio += 1;
    }

    buscar(condicion) {
        let actual = this.cabeza;

        while (actual !== null) {
            if (condicion(actual.dato)) {
                return actual.dato;
            }
            actual = actual.siguiente;
        }

        return null;
    }

    insertarDespuesDe(condicion, dato) {
        let actual = this.cabeza;

        while (actual !== null && !condicion(actual.dato)) {
            actual = actual.siguiente;
        }

        if (actual === null) {
            return false;
        }

        const nuevo = new Nodo(dato);
        nuevo.siguiente = actual.siguiente;
        actual.siguiente = nuevo;

        if (actual === this.cola) {
            this.cola = nuevo;
        }

        this.tamanio += 1;
        return true;
    }

    eliminar(condicion) {
        let anterior = null;
        let actual = this.cabeza;

        while (actual !== null) {
            if (condicion(actual.dato)) {
                if (anterior === null) {
                    this.cabeza = actual.siguiente;
                } else {
                    anterior.siguiente = actual.siguiente;
                }

                if (actual === this.cola) {
                    this.cola = anterior;
                }

                this.tamanio -= 1;
                if (this.cabeza === null) {
                    this.cola = null;
                }

                actual.siguiente = null;
                return actual.dato;
            }

            anterior = actual;
            actual = actual.siguiente;
        }

        return null;
    }

    recorrer(callback) {
        let actual = this.cabeza;

        while (actual !== null) {
            callback(actual.dato);
            actual = actual.siguiente;
        }
    }

    aArreglo() {
        const datos = [];
        this.recorrer((dato) => datos.push(dato));
        return datos;
    }

    estaVacia() {
        return this.tamanio === 0;
    }

    obtenerTamanio() {
        return this.tamanio;
    }
}

module.exports = ListaEnlazada;