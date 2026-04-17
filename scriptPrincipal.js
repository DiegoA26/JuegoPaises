//Cargar en la tarjeta 1 los datos de la primera posicion
//Cargar en la tarjeta 2 los dotos de

const textoPuntuacion = document.getElementById("contador-puntuacion");
const textoPerder = document.getElementById("texto-pantalla-final");

let modalPerder;


const tarjeta1 = document.getElementById("tarjeta-1");
const tarjeta2 = document.getElementById("tarjeta-2");
const btnReiniciar = document.getElementById("btn-reiniciar");

const btnMas = document.getElementById("btn-mas");
const btnMenos = document.getElementById("btn-menos");

let listaPaises = [];
let contadorPais = 2; //Empieza en dos xk los dos primeros puestos ya se cargan

let contadorPuntuacion = 0;

async function iniciarJuego() {
    console.log("empieza a cargar el juego");
    const espera = await prepararListaPaises();
    cargarInformacionTarjeta1();
    cargarInformacionTarjeta2();
    //cargar la informacion de los paises en las tarjetas
    console.log("Juego Listo");
}

function cargarInformacionTarjeta1() {
    const nombrePais = tarjeta1.querySelector("h1");
    const imagenBandera = tarjeta1.querySelector("img");
    const poblacion = tarjeta1.querySelector("h2");

    const objetoPais = listaPaises[contadorPais - 2];
    nombrePais.textContent = objetoPais.nombre;
    imagenBandera.setAttribute("src", objetoPais.bandera);
    poblacion.textContent =
        "Poblacion: " + objetoPais.poblacion.toLocaleString("es-ES");
}

function cargarInformacionTarjeta2() {
    const nombrePais = tarjeta2.querySelector("h1");
    const imagenBandera = tarjeta2.querySelector("img");

    const objetoPais = listaPaises[contadorPais - 1];
    nombrePais.textContent = objetoPais.nombre;
    imagenBandera.setAttribute("src", objetoPais.bandera);

    console.log("Pais 2 con " + objetoPais.poblacion.toLocaleString("es-ES"));
}

async function prepararListaPaises() {
    try {
        //Recupera los datos de internet
        const respuesta = await fetch(
            "https://restcountries.com/v3.1/all?fields=translations,population,flags",
        );
        //Los convierte a json
        const datos = await respuesta.json();

        //recorre el json y crea los objetos paises para almacenarlos en una lista
        datos.forEach((elemento) => {
            const nuevoPais = {
                nombre: elemento.translations.spa.official,
                bandera: elemento.flags.svg,
                poblacion: elemento.population,
            };
            listaPaises.push(nuevoPais);
        });
        //Desordena la lista
        listaPaises = desordenarLista(listaPaises);
        // console.log(listaPaises);
    } catch (error) {
        console.log(error);
    }
}

function desordenarLista(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio
    }
    return array;
}

function cambiarPaises(){
    contadorPuntuacion++;
    textoPuntuacion.textContent = "Puntuacion: " + contadorPuntuacion;

    contadorPais++;
    cargarInformacionTarjeta1();
    cargarInformacionTarjeta2();
}

function botonMas() {
    //Comprobar si es mayor la tarjeta 1 que la dos
    if (!compararTarjetas()) {
        //Si adivino
        console.log("Gano");
        cambiarPaises();
    } else {
        //Si perdio
        console.log("Perdio");
        perderPartida();
    }
}
function botonMenos() {
    if (compararTarjetas()) {
        //Si adivino
        console.log("Gano");
        cambiarPaises();
    } else {
        //Si perdio
        console.log("Perdio");
        perderPartida();
    }
}

function compararTarjetas() {
    //Si la primera es mayor que la segunda
    console.log(listaPaises[contadorPais - 2].poblacion > listaPaises[contadorPais - 1].poblacion);
    return listaPaises[contadorPais - 2].poblacion > listaPaises[contadorPais - 1].poblacion;
}

function perderPartida(){
    btnMas.disabled = true;
    btnMenos.disabled = true;

    textoPerder.textContent = "Has conseguido una puntuacion de " + contadorPuntuacion;
    modalPerder.show();
}

btnMas.addEventListener("click", () => botonMas());
btnMenos.addEventListener("click", () => botonMenos());
btnReiniciar.addEventListener("click", () => {window.location.reload();})

document.addEventListener('DOMContentLoaded', function() {
    // 1. Selecciona el elemento modal
    const modalElement = document.getElementById("modal-perder");
    
    // 2. Inicializa y muestra el modal
    modalPerder = new bootstrap.Modal(modalElement);
});


iniciarJuego();
