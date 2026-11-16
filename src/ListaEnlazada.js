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

    tamanioRecursivo() {
        return this._tamanioRecursivo(this.cabeza);
    }

    _tamanioRecursivo(nodo) {
        if (nodo === null) {
            return 0;
        }

        return 1 + this._tamanioRecursivo(nodo.siguiente);
    }

    costoTotal() {
        let total = 0;
        this.recorrer((dato) => {
            if (dato !== null && typeof dato === "object" && typeof dato.costo === "number") {
                total += dato.costo;
            }
        });
        return total;
    }

    costoTotalRecursivo() {
        return this._costoTotalRecursivo(this.cabeza);
    }

    _costoTotalRecursivo(nodo) {
        if (nodo === null) {
            return 0;
        }

        const costo = nodo.dato !== null &&
            typeof nodo.dato === "object" &&
            typeof nodo.dato.costo === "number"
            ? nodo.dato.costo
            : 0;
        return costo + this._costoTotalRecursivo(nodo.siguiente);
    }

    buscarRecursivo(condicion) {
        return this._buscarRecursivo(this.cabeza, condicion);
    }

    _buscarRecursivo(nodo, condicion) {
        if (nodo === null) {
            return null;
        }

        if (condicion(nodo.dato)) {
            return nodo.dato;
        }

        return this._buscarRecursivo(nodo.siguiente, condicion);
    }

    imprimirAlReves(imprimir = console.log) {
        this._imprimirAlReves(this.cabeza, imprimir);
    }

    _imprimirAlReves(nodo, imprimir) {
        if (nodo === null) {
            return;
        }

        this._imprimirAlReves(nodo.siguiente, imprimir);
        imprimir(nodo.dato);
    }

    estaVacia() {
        return this.tamanio === 0;
    }

    obtenerTamanio() {
        return this.tamanio;
    }
}

module.exports = ListaEnlazada;