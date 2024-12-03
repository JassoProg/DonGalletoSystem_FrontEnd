const apiUrl = 'http://localhost:3000/api/detalleventa/'; // URL de la API para obtener los detalles de venta

// Función para obtener todos los detalles de venta
async function getAllDetalleVenta() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <tu-token>', // Reemplaza <tu-token> con tu token de autorización
            }
        });

        console.log('Respuesta completa:', response);

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Datos recibidos:', responseData);

        // Verificar si la respuesta contiene un arreglo de detalles
        if (Array.isArray(responseData.data)) {
            actualizarTablaDetalleVenta(responseData.data); // Actualizar la tabla con los datos
        } else {
            console.error('La clave "data" no contiene un arreglo:', responseData.data);
        }
    } catch (error) {
        console.error('Error al obtener los detalles de venta:', error);
    }
}

// Función para actualizar la tabla con los datos de detalles de venta
function actualizarTablaDetalleVenta(data) {
    const tbody = document.querySelector('#tabla_detalle_venta tbody');
    tbody.innerHTML = ''; // Limpiar el contenido actual de la tabla

    data.forEach((detalle) => {
        const row = document.createElement('tr');

        // Crear celdas de la fila
        const celdaFolio = document.createElement('td');
        celdaFolio.textContent = detalle.venta_Id; // ID de la venta principal

        const celdaProductos = document.createElement('td');
        celdaProductos.textContent = detalle.cantidad; // Número de productos vendidos

        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = new Date(detalle.createdAt).toLocaleDateString(); // Fecha de creación del detalle de venta

        const celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = `$${detalle.precio.toFixed(2)}`; // Precio del producto

        const celdaSubTotal = document.createElement('td');
        celdaSubTotal.textContent = `$${(detalle.precio * detalle.cantidad).toFixed(2)}`; // Subtotal: precio * cantidad

        const celdaTotal = document.createElement('td');
        celdaTotal.textContent = `$${(detalle.precio * detalle.cantidad).toFixed(2)}`; // El total puede ser el mismo que el subtotal si solo hay un producto en la venta

        // Crear botón para ver más detalles
        const celdaAcciones = document.createElement('td');
        const btnAcciones = document.createElement('button');
        btnAcciones.classList.add('btn', 'btn-outline-dark', 'rounded-circle');
        btnAcciones.innerHTML = '<i class="bi bi-plus"></i>'; // Icono de más para ver detalles
        btnAcciones.addEventListener('click', () => {
            verDetalles(detalle.id); // Llamar a la función para ver los detalles de la venta
        });

        celdaAcciones.appendChild(btnAcciones);

        // Agregar celdas a la fila
        row.appendChild(celdaFolio);
        row.appendChild(celdaProductos);
        row.appendChild(celdaFecha);
        row.appendChild(celdaPrecio);
        row.appendChild(celdaTotal);
        row.appendChild(celdaAcciones);

        // Agregar fila a la tabla
        tbody.appendChild(row);
    });
}

// Función para manejar el proceso de ver detalles de una venta
function verDetalles(id) {
    console.log(`Ver detalles del detalle de venta con ID: ${id}`);
    // Aquí puedes agregar la lógica para ver más detalles, por ejemplo, abrir un modal o redirigir a otra página.
}

// Llamar a la función getAllDetalleVenta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getAllDetalleVenta();
});
