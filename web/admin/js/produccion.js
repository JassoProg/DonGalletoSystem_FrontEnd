const apiUrl = 'http://localhost:3000/api/produccion/';
const apiRecetasUrl = 'http://localhost:3000/api/receta/';
const apiPUTUrl = 'http://localhost:3000/api/produccion/';

let data = []; // Para almacenar los datos de producción

// Obtener recetas y llenar select
async function getAllRecetas() {
    try {
        const response = await fetch(apiRecetasUrl);
        const responseData = await response.json();
        llenarSelectRecetas(responseData.data, 'receta');
        llenarSelectRecetas(responseData.data, 'editarReceta');
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
    }
}

function llenarSelectRecetas(recetas, selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = ''; // Limpiar las opciones anteriores
    recetas.forEach(receta => {
        const option = document.createElement('option');
        option.value = receta.id;
        option.textContent = receta.nombre;
        select.appendChild(option);
    });
}

// Agregar producción
async function agregarProduccion() {
    const recetaId = document.getElementById('receta').value;
    const sucursal = document.getElementById('sucursal').value;
    const estado = document.getElementById('estado').value;

    if (!recetaId || !sucursal || !estado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receta_Id: parseInt(recetaId), sucursal, estado }),
        });
        getAllProduccion(); // Recargar la lista de producciones
    } catch (error) {
        console.error('Error al agregar producción:', error);
    }
}

// Obtener producción y actualizar tabla
async function getAllProduccion() {
    try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        data = responseData.data; // Almacenar los datos en la variable global
        actualizarTablaProduccion(data); // Actualizar la tabla con los datos
    } catch (error) {
        console.error('Error al obtener producción:', error);
    }
}

function actualizarTablaProduccion(data) {
    const tbody = document.querySelector('#tabla_produccion tbody');
    tbody.innerHTML = ''; // Limpiar la tabla actual

    data.forEach(registro => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.receta.nombre}</td>
            <td>${new Date(registro.fecha_fin).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-outline-dark rounded-circle" onclick="editarRegistro(${registro.id})">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>`;
        tbody.appendChild(row);
    });
}

function editarRegistro(folio) {
    const registro = data.find(r => r.id === folio); // Buscar el registro en los datos almacenados
    if (registro) {
        // Rellenar los campos del modal con los datos actuales del registro
        document.getElementById('editarEstado').value = registro.estado;
        document.getElementById('editarFechaFin').value = registro.fecha_fin || ''; // Si no hay fecha, dejar vacío

        const modal = new bootstrap.Modal(document.getElementById('editarModal'));
        modal.show();

        // Configurar el evento para guardar los cambios cuando se haga clic en el botón
        document.getElementById('guardarCambios').onclick = () => guardarCambiosRegistro(folio, registro.id);  // Pasar el ID del registro
    }
}

async function guardarCambiosRegistro(folio, id) {
    const estado = document.getElementById('editarEstado').value;
    const fechaFin = document.getElementById('editarFechaFin').value;

    // Validar que los campos no estén vacíos
    if (!estado || !fechaFin) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        // Enviar solicitud PUT para actualizar la producción
        await fetch(`${apiUrl}`, {  // Aquí se usa el folio para la URL
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,         // Aquí solo se pasa el ID en el cuerpo
                estado,
                fechaFin,
            }),
        });

        // Recargar la lista de producciones después de guardar los cambios
        getAllProduccion();

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarModal'));
        modal.hide();
    } catch (error) {
        console.error('Error al actualizar producción:', error);
    }
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
    getAllRecetas();  // Obtener las recetas para el select
    getAllProduccion();  // Obtener las producciones para mostrar en la tabla
    document.getElementById('guardarBtn').addEventListener('click', agregarProduccion); // Evento del botón de agregar
});
