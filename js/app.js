//Variables y SElectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  document.addEventListener("submit", agregarGastos);
}

//Classes
class Presupuesto {
  constructor(presupuesto) {
    //aqui quedara el presuesto pasado como parametros en   presupuesto = new Presupuesto(presupuestoUsuario);
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
      
  }

  //Métodos
  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();

  }

  calcularRestante(){
      const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0)
      this.restante = this.presupuesto - gastado
      console.log(gastado)
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto => gasto.id !== id)
    this.calcularRestante();
   
  }
}
//para que se vea el gasto reflejado en la web
class UI {
  insertarPresupuesto(cantidad) {
    //extrayendo el valor
    const { presupuesto, restante } = cantidad;
    //Agresando al html
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //mensaje Error
    divMensaje.textContent = mensaje;
    //insertar en el html
    document.querySelector(".primario").insertBefore(divMensaje, formulario);
    //quitar del html
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  mostrarGastos(gastos) {
    //Eliminar el html previo
    this.limpiarHTML();
    //Iterar solo los gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      //Crear un LI
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;
      console.log(nuevoGasto);

      //Agregar el HTML del Gasto
      nuevoGasto.innerHTML = `${nombre}  <span class="badge badge-primary badge-pill"> ${cantidad}</span>
      `;

      //Boton para borrar el gasto

      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "Borrar";
      
      btnBorrar.onclick = ()=>{
        eliminarGasto(id)
      }

      nuevoGasto.appendChild(btnBorrar);

      //Agregar al HTML

      gastoListado.appendChild(nuevoGasto);
    });
  }
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante){
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoOBJ){
    const {presupuesto, restante}=presupuestoOBJ
    const restantediv = document.querySelector('.restante')

    // comprobar 25%
    if((presupuesto / 4) > restante){
      restantediv.classList.remove('alert-success', 'alert-warning')
      restantediv.classList.add('alert-danger')
    }else if((presupuesto /2) > restante){
      restantediv.classList.remove('alert-success')
      restantediv.classList.add('alert-warning')
    }else{
      restantediv.classList.remove('alert-danger','alert-warning')
      restantediv.classList.add('alert-success')
    }

    //si el total es 0 a cero

    if (restante <= 0){
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
      formulario.querySelector('button[type="submit"]').disabled = true //desactiva el boton cuando sea menor o = a cero
    }
  }
}

//Instanciar para que sea vea reglejado en la web
const ui = new UI();
let presupuesto;

//funciones



function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Ingrese un Presupuesto");

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload(); //recarga la ventana actual si no se cumple la condicion
  }

  // una vez pasada la validacion sera un presupuesto valido

  //instanciamos el Presupuesto y le pasamos como parametros el presupuesto ingresado por el usuario en la web
  presupuesto = new Presupuesto(presupuestoUsuario);

  // le pasamos la clase presupuesto por parametros  a ui para poder mostrarlo en el html
  ui.insertarPresupuesto(presupuesto);
  
}



//Añade gastos //evento submit Formulario
function agregarGastos(e) {
  e.preventDefault();

  //Leer gastos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //validar

  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campós son obligatiorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }

  //mensaje de todo bien
  ui.imprimirAlerta("Gasto agregado Correctamente");

  //AÑADIENTO GASTO
  //Generar un objeto con el gasto
  const gasto = {
    nombre, //mombre:nombre si es lo mismos e deja uno solo
    cantidad,
    id: Date.now(),
  }; //une nombre y cantidad a gasto object literal

  //Añande un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  //Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
 

  //una vez agregado correctamente los datos al formulario lo reseteamos
  formulario.reset();
}

function eliminarGasto(id){
  //Elimina del objeto
presupuesto.eliminarGasto(id)
//elimina los gastos del html
const {gastos,restante}= presupuesto
//toma gasto
ui.mostrarGastos(gastos)
//toma restante
ui.actualizarRestante(restante);

//este toma todo el objeto
ui.comprobarPresupuesto(presupuesto)
}
