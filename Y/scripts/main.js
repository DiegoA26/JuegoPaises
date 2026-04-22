// main.js
function cargarHeader() {
    const placeholder = document.getElementById('header-placeholder');
    const title = placeholder?.dataset.title || "Titulo sin implementar";

    fetch('../components/header.html')
        .then(response => response.text())
        .then(html => {
            placeholder.innerHTML = html;

            // cambiar el título después de insertar el header
            const titulo = document.getElementById('tituloHeader');
            if (titulo) {
                titulo.textContent = title;
            }
        });
}

document.addEventListener('DOMContentLoaded', cargarHeader);