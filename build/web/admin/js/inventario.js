const apiUrl = 'https://climate-vs-champion-back.trycloudflare.com/api/inventario/';

async function getAll() {
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

        // Asegúrate de que `responseData.data` es un arreglo antes de continuar
        if (Array.isArray(responseData.data)) {
            actualizarTabla(responseData.data); // Pasa el arreglo al actualizarTabla
        } else {
            console.error('La clave "data" no contiene un arreglo:', responseData.data);
        }
    } catch (error) {
        console.error('Error al obtener el inventario:', error);
    }
}

// Función para actualizar la tabla con datos del JSON
function actualizarTabla(data) {
    const tbody = document.querySelector('#tabla_inventario tbody');
    tbody.innerHTML = ''; // Limpiar el contenido actual de la tabla

    data.forEach((item) => {
        const row = document.createElement('tr');

        // Crear celdas de la fila
        const celdaFolio = document.createElement('td');
        celdaFolio.textContent = item.id;

        const celdaGalleta = document.createElement('td');
        celdaGalleta.textContent = `Producto ${item.producto_Id}`; // Ejemplo de cómo mostrar producto_Id

        const celdaCantidad = document.createElement('td');
        celdaCantidad.textContent = item.cantidad;

        const celdaCaducidad = document.createElement('td');
        celdaCaducidad.textContent = item.createdAt.split('T')[0]; // Formato de fecha (YYYY-MM-DD)

        // Agregar celdas a la fila
        row.appendChild(celdaFolio);
        row.appendChild(celdaGalleta);
        row.appendChild(celdaCantidad);
        row.appendChild(celdaCaducidad);

        // Agregar fila a la tabla
        tbody.appendChild(row);
    });
}

// Llamar a la función getAll al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getAll();
});
