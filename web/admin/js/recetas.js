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

        console.log('Respuesta completa:', response);

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Datos recibidos:', responseData);

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
        verRecetaBtn.classList.add('view-btn');
        verRecetaBtn.textContent = 'Ver receta';
        verRecetaBtn.addEventListener('click', () => {
            verReceta(receta.id); 
        });
        celdaReceta.appendChild(verRecetaBtn);


        row.appendChild(celdaNombre);
        row.appendChild(celdaReceta);

        tbody.appendChild(row);
    });
}

function verReceta(id) {
    console.log(`Ver receta con id: ${id}`);
 
}

document.addEventListener('DOMContentLoaded', () => {
    getAllRecetas();
});
