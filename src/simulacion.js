const assert = require("assert");
const Recepcion = require("./dominio/Recepcion");
const Editor = require("./dominio/Editor");
const RegistroClinico = require("./dominio/RegistroClinico");

function convertirAMinutos(hora) {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
}

function convertirAHora(minutosTotales) {
    const horas = Math.floor(minutosTotales / 60);
    const minutos = String(minutosTotales % 60).padStart(2, "0");
    return `${horas}:${minutos}`;
}

function simularManana({ imprimir = console.log, demostrarRehacer = false } = {}) {
    const turnos = [
        { mascota: "Toby", tipo: "General", motivo: "Control de vacunas", horaLlegada: "8:00" },
        { mascota: "Max", tipo: "General", motivo: "Revisión de piel", horaLlegada: "8:05" },
        { mascota: "Luna", tipo: "Urgencia", motivo: "Intoxicación", horaLlegada: "8:10" },
        { mascota: "Simón", tipo: "General", motivo: "Corte de uñas", horaLlegada: "8:20" },
        { mascota: "Kira", tipo: "Urgencia", motivo: "Herida en pata", horaLlegada: "8:25" },
        { mascota: "Nala", tipo: "General", motivo: "Desparasitación", horaLlegada: "8:40" },
        { mascota: "Rocky", tipo: "Urgencia", motivo: "Dificultad para respirar", horaLlegada: "9:00" },
    ];
    const recepcion = new Recepcion();
    const registro = new RegistroClinico();
    const editor = new Editor(registro);
    const ordenAtencion = [];
    const trazaCorreccion = [];
    const promedios = {
        Urgencia: { total: 0, cantidad: 0 },
        General: { total: 0, cantidad: 0 },
    };
    let indiceLlegada = 0;
    let tiempoActual = convertirAMinutos("8:00");
    let errorCorregido = false;

    while (indiceLlegada < turnos.length || !recepcion.estaVacia()) {
        if (
            recepcion.estaVacia() &&
            indiceLlegada < turnos.length &&
            convertirAMinutos(turnos[indiceLlegada].horaLlegada) > tiempoActual
        ) {
            tiempoActual = convertirAMinutos(turnos[indiceLlegada].horaLlegada);
        }

        while (
            indiceLlegada < turnos.length &&
            convertirAMinutos(turnos[indiceLlegada].horaLlegada) <= tiempoActual
        ) {
            recepcion.registrarLlegada(turnos[indiceLlegada]);
            indiceLlegada += 1;
        }

        const turno = recepcion.llamarSiguiente();
        if (turno === null) {
            continue;
        }

        const llegada = convertirAMinutos(turno.horaLlegada);
        const espera = tiempoActual - llegada;
        const horaAtencion = convertirAHora(tiempoActual);
        assert(espera >= 0, `${turno.mascota} no puede ser atendida antes de llegar`);

        ordenAtencion.push({
            ...turno,
            horaAtencion,
            espera,
        });
        promedios[turno.tipo].total += espera;
        promedios[turno.tipo].cantidad += 1;

        const atencion = {
            horaAtencion,
            tipo: turno.tipo,
            motivo: turno.motivo,
            esperaMinutos: espera,
        };

        tiempoActual += 20;

        if (!errorCorregido) {
            const mensajeError = "Se registra por error la atención de Toby en Max.";
            editor.agregar("Max", atencion);
            imprimir(`Corrección: ${mensajeError}`);
            trazaCorreccion.push(`Agregar Max: ${atencion.motivo}`);
            assert.strictEqual(editor.deshacer(), true);
            imprimir("Deshacer elimina la atención del historial equivocado.");
            trazaCorreccion.push("Deshacer: se elimina la atención errónea.");

            if (demostrarRehacer) {
                assert.strictEqual(editor.rehacer(), true);
                imprimir("Rehacer recupera temporalmente la acción errónea.");
                trazaCorreccion.push("Rehacer: se recupera la acción errónea.");
                assert.strictEqual(editor.deshacer(), true);
                imprimir("Un segundo deshacer vuelve a retirar la acción errónea.");
                trazaCorreccion.push("Deshacer: se vuelve a retirar la acción errónea.");
            }

            errorCorregido = true;
        }

        editor.agregar(turno.mascota, atencion);
        if (turno.mascota === "Toby" && errorCorregido) {
            trazaCorreccion.push("Agregar Toby: la atención queda en el historial correcto.");
        }
    }

    assert.strictEqual(errorCorregido, true);
    assert.deepStrictEqual(
        ordenAtencion.map((turno) => [turno.mascota, turno.horaAtencion, turno.espera]),
        [
            ["Toby", "8:00", 0],
            ["Luna", "8:20", 10],
            ["Kira", "8:40", 15],
            ["Rocky", "9:00", 0],
            ["Max", "9:20", 75],
            ["Simón", "9:40", 80],
            ["Nala", "10:00", 80],
        ],
        "el calendario simulado debe coincidir con el cálculo manual"
    );

    const mascotasAtendidas = new Set();
    for (const turno of ordenAtencion) {
        mascotasAtendidas.add(turno.mascota);
    }

    let totalAtenciones = 0;
    for (const mascota of mascotasAtendidas) {
        const historial = registro.obtenerHistorial(mascota);
        assert.notStrictEqual(historial, null, `${mascota} debe tener historial`);
        const atencionesMascota = historial.aArreglo();
        const turnoEsperado = ordenAtencion.find((turno) => turno.mascota === mascota);
        assert.strictEqual(atencionesMascota.length, 1, `${mascota} debe tener una atencion`);
        assert.strictEqual(
            atencionesMascota[0].motivo,
            turnoEsperado.motivo,
            `${mascota} debe tener su atencion correcta`
        );
        assert.strictEqual(
            atencionesMascota[0].horaAtencion,
            turnoEsperado.horaAtencion,
            `${mascota} debe tener la hora de atencion correcta`
        );
        totalAtenciones += historial.obtenerTamanio();
    }
    assert.strictEqual(totalAtenciones, turnos.length, "las siete atenciones deben quedar registradas");

    imprimir("Orden de atención");
    for (const turno of ordenAtencion) {
        imprimir(
            `${turno.mascota} (${turno.tipo}) | llegada ${turno.horaLlegada} | atención ${turno.horaAtencion} | espera ${turno.espera} min`
        );
    }
    imprimir(
        `Promedio de espera - urgencias: ${(promedios.Urgencia.total / promedios.Urgencia.cantidad).toFixed(2)} min`
    );
    imprimir(
        `Promedio de espera - generales: ${(promedios.General.total / promedios.General.cantidad).toFixed(2)} min`
    );

    return { ordenAtencion, promedios, registro, editor, recepcion, trazaCorreccion };
}

if (require.main === module) {
    const resultado = simularManana();
    resultado.recepcion.llamarSiguiente();
}

module.exports = simularManana;
