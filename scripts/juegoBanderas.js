const textoPerder = document.getElementById("texto-pantalla-final");
const btnReiniciar = document.getElementById("btn-reiniciar");
const imagenBandera = document.getElementById("imagen-bandera");

const inputBuscador = document.getElementById("buscador");
const listaBuscador = document.getElementById("lista-buscador");

const btnBuscar = document.getElementById("btn-buscar");

let listaPaises = [];
let contadorPais = 0;

let modalPerder;

let contadorVidas = 3;
let contadorPuntuacion = 0;

async function inicio() {
    //descargarse las banderas y guardaerlas en una lista
    // desordenar la lista
    // cargar la primera bandera

    prepararListaPaises();
}

async function prepararListaPaises() {
    try {
        //Recupera los datos de internet
        const respuesta = await fetch(
            "https://restcountries.com/v3.1/all?fields=translations,flags",
        );
        //Los convierte a json
        const datos = await respuesta.json();

        //recorre el json y crea los objetos paises para almacenarlos en una lista
        datos.forEach((elemento) => {
            const nuevoPais = {
                nombre: elemento.translations.spa.official,
                bandera: elemento.flags.svg,
            };
            listaPaises.push(nuevoPais);
        });
        //Desordena la lista
        listaPaises = desordenarLista(listaPaises);
        cargarPais();
        // console.log(listaPaises);
    } catch (error) {
        console.log(error);
    }
}

function cargarPais() {
    //se carga la bandera
    imagenBandera.setAttribute("src", listaPaises[contadorPais].bandera);

    console.log("Pais cargado: " + listaPaises[contadorPais].nombre);
}

function desordenarLista(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio
    }
    return array;
}

btnBuscar.addEventListener("click", () => {
    const paisCorrecto = listaPaises[contadorPais].nombre;

    if (paisCorrecto == inputBuscador.value) {
        adivinarIntento();
    } else {
        fallarIntento();
    }

    inputBuscador.value = "";
});

function adivinarIntento() {
    console.log("adivinado");
    contadorPuntuacion++;
    contadorPais++;
    document.getElementById("contador-puntuacion").textContent =
        `Puntuación: ${contadorPuntuacion}`;
    cargarPais();
}

function fallarIntento() {
    console.log("fallar");
    contadorVidas--;

    if (contadorVidas > 0) {
        document.getElementById("contador-vidas").textContent =
            `Vidas: ${contadorVidas}/3`; 
    }
    else{
        textoPerder.textContent = `Has conseguido una puntuación de ${contadorPuntuacion}, el país era ${listaPaises[contadorPais].nombre}`;
        modalPerder.show();
    }
}

inputBuscador.addEventListener("input", function () {
    const valor = this.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // Limpiar lista
    listaBuscador.innerHTML = "";

    if (valor === "") return;

    // Filtrar países
    const resultados = listaPaises.filter((pais) =>
        pais.nombre
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(valor),
    );

    // Limitar resultados
    const maxResultados = 10;

    resultados.slice(0, maxResultados).forEach((pais) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        item.textContent = pais.nombre;

        // al hacer click, se rellena el input
        item.addEventListener("click", () => {
            inputBuscador.value = pais.nombre;
            listaBuscador.innerHTML = "";
        });

        listaBuscador.appendChild(item);
    });
});
btnReiniciar.addEventListener("click", () => {window.location.reload();})
document.addEventListener('DOMContentLoaded', function() {
    // 1. Selecciona el elemento modal
    const modalElement = document.getElementById("modal-perder");
    
    // 2. Inicializa y muestra el modal
    modalPerder = new bootstrap.Modal(modalElement);
});


inicio();
