/* ======================= VARIABLES Y SELECTORES ====================== */

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');




/* ========================== EVENT LISTENER =========================== */

eventListeners();

function eventListeners() {

    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);

}




/* =============================== CLASES ============================== */

class Presupuesto {

    constructor(presupuesto) {

        this.presupuesto = Number(presupuesto);
        this.restante    = Number(presupuesto);
        this.gastos      = [];

    }

    nuevoGasto(gasto) {

        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    }

    calcularRestante() {

        const gastado = this.gastos.reduce( (total, gasto ) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id) {

        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();

    }

}


class UI {

    insertarPresupuesto(cantidad) {
        
        // Extraemos los valores
        const { presupuesto, restante } = cantidad;

        // Agregamos al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje, tipo) {

        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar del HTML
        setTimeout(() => {

            divMensaje.remove();

        }, 2500);

    }

    mostrarGastos(gastos) {

        this.limpiarHTML();

        // Iterar sobre los gastos
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            // Crear Li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Insertar HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            // Botón eliminar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;' // $times; es una entidad de HTML por lo tanto solo funciona con innerHTML
            btnBorrar.onclick = () => {

                eliminarGasto(id);

            }

            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        });

    }

    limpiarHTML() {

        while (gastoListado.firstChild) {

            gastoListado.removeChild(gastoListado.firstChild);

        }

    }

    actualizarRestante(restante) {

        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupuestoObj) {

        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25% y 50%
        if ( (presupuesto / 4) > restante ) {

            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if ( (presupuesto / 2) > restante ) {

            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');

        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor
        if (restante <= 0) {

            ui.imprimirAlerta('El presupuesto se ha agtado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;

        }

    }

}


// Instanciar
const ui = new UI();
let presupuesto;




/* ============================= FUNCIONES ============================= */

function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('¿Cuál es el presupuesto?');

    // console.log(presupuestoUsuario);

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);

}


// Agregar Gastos

function agregarGasto(e) {

    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if (nombre === '' || cantidad === '') {

        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;

    } else if (cantidad <= 0 || isNaN(cantidad)) {

        ui.imprimirAlerta('Cantidad no válida', 'error');

        return;

    }

    // Generar un objeto con el gasto
    // Object Literal Enhancement ( Es lo opuesto al Destructuring )
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Mensaje Success
    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimir los gastos
    const { gastos, restante } = presupuesto;

    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el Formulario
    formulario.reset();

}

function eliminarGasto(id) {

    presupuesto.eliminarGasto(id);
    const { gastos, restante } = presupuesto;

    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}