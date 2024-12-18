const apiUrl = 'http://localhost:3000/api/receta/';

async function getAllRecetas() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <tu-token>',
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
            actualizarTablaRecetas(responseData.data);
        } else {
            console.error('La clave "data" no contiene un arreglo:', responseData.data);
        }
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
    }
}

function actualizarTablaRecetas(data) {
    const tbody = document.querySelector('#tabla_recetas tbody');
    tbody.innerHTML = '';

    data.forEach((receta) => {
        const row = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = receta.nombre;

        const celdaReceta = document.createElement('td');
        const verRecetaBtn = document.createElement('button');
        verRecetaBtn.classList.add('btn', 'btn-primary');
        verRecetaBtn.textContent = 'Ver receta';
        
        // Pasamos directamente la descripción como argumento al evento
        verRecetaBtn.addEventListener('click', () => {
            mostrarDescripcion(receta.descripcion);
        });
        
        celdaReceta.appendChild(verRecetaBtn);

        row.appendChild(celdaNombre);
        row.appendChild(celdaReceta);

        tbody.appendChild(row);
    });
}

function mostrarDescripcion(descripcion) {
    // Establece el contenido del modal con la descripción proporcionada
    document.getElementById('descripcionContenido').textContent = descripcion;

    // Muestra el modal
    const modal = new bootstrap.Modal(document.getElementById('descripcionModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', () => {
    getAllRecetas();
});
