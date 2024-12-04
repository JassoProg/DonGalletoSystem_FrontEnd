const apiUrl = 'http://localhost:3000/api/detalleVenta/'; // URL de la API

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

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
            actualizarTablaDetalleVenta(responseData.data);
        } else {
            console.error('La clave "data" no contiene un arreglo:', responseData.data);
        }
    } catch (error) {
        console.error('Error al obtener los detalles de venta:', error);
    }
}

// Función para actualizar la tabla con los datos
function actualizarTablaDetalleVenta(data) {
    const tbody = document.querySelector('#tabla_detalle_venta tbody');
    tbody.innerHTML = '';

    data.forEach((detalle) => {
        const row = document.createElement('tr');

        // Crear celdas de la fila
        const celdaFolio = document.createElement('td');
        celdaFolio.textContent = detalle.venta_Id;

        const celdaProductos = document.createElement('td');
        celdaProductos.textContent = detalle.cantidad;

        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = new Date(detalle.createdAt).toLocaleDateString();

        const celdaSubTotal = document.createElement('td');
        celdaSubTotal.textContent = `$${(detalle.precio * detalle.cantidad).toFixed(2)}`;

        const celdaTotal = document.createElement('td');
        celdaTotal.textContent = `$${(detalle.precio * detalle.cantidad).toFixed(2)}`;

        // Botón para ver detalles
        const celdaAcciones = document.createElement('td');
        const btnAcciones = document.createElement('button');
        btnAcciones.classList.add('btn', 'btn-outline-dark', 'rounded-circle');
        btnAcciones.innerHTML = '<i class="bi bi-plus"></i>';
        btnAcciones.addEventListener('click', () => {
            verDetalles(detalle.id);
        });

        celdaAcciones.appendChild(btnAcciones);

        // Agregar celdas a la fila
        row.appendChild(celdaFolio);
        row.appendChild(celdaProductos);
        row.appendChild(celdaFecha);
        row.appendChild(celdaSubTotal);
        row.appendChild(celdaTotal);
        row.appendChild(celdaAcciones);

        tbody.appendChild(row);
    });
}

// Función para obtener y mostrar los detalles de venta por ID
async function verDetalles(id) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <tu-token>',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const detalleVenta = await response.json();

        // Rellenar el modal con los datos obtenidos
        const venta = detalleVenta.data[0]; // Suponiendo que "data" es un array con un único objeto
        document.getElementById('detalleFecha').textContent = new Date(venta.createdAt).toLocaleDateString();
        document.getElementById('detalleSubTotal').textContent = `$${(venta.precio * venta.cantidad).toFixed(2)}`;
        document.getElementById('detalleTotal').textContent = `$${(venta.precio * venta.cantidad).toFixed(2)}`;
        
        const productosList = document.getElementById('detalleProductos');
        productosList.innerHTML = '';

        // Agregar producto al listado del modal
        const li = document.createElement('li');
        li.textContent = `Producto ID: ${venta.producto_Id} - Cantidad: ${venta.cantidad} x $${venta.precio.toFixed(2)}`;
        productosList.appendChild(li);

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('detalleVentaModal'));
        modal.show();
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getAllDetalleVenta();
});
