const apiUrl = 'http://localhost:3000/api/produccion/'; // URL de la API para obtener los datos de producción

const apiRecetasUrl = 'http://localhost:3000/api/receta/'; 

async function getAllRecetas() {
    try {
        const response = await fetch(apiRecetasUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <tu-token>', // Cambia el token según tu necesidad
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
            llenarSelectRecetas(responseData.data); // Pasar los datos al método para llenar el select
        } else {
            console.error('La clave "data" no contiene un arreglo:', responseData.data);
        }
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
    }
}

// Función para llenar el select con las recetas
function llenarSelectRecetas(recetas) {
    const selectReceta = document.getElementById('receta');
    selectReceta.innerHTML = ''; // Limpiar las opciones existentes

    // Crear una opción por defecto (opcional)
    const optionDefault = document.createElement('option');
    optionDefault.value = ''; // Si no selecciona ninguna receta
    optionDefault.textContent = 'Selecciona una receta';
    selectReceta.appendChild(optionDefault);

    // Agregar las opciones al select
    recetas.forEach((receta) => {
        const option = document.createElement('option');
        option.value = receta.id; // Asignar el id de la receta como valor
        option.textContent = receta.nombre; // Asignar el nombre de la receta como texto
        selectReceta.appendChild(option);
    });
}

// Llamar a la función getAllRecetas cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    getAllRecetas();
});


async function agregarProduccion() {
    // Obtener los valores de los campos
    const recetaId = document.getElementById('receta').value;
    const sucursal = document.getElementById('sucursal').value;
    const estado = document.getElementById('estado').value;

    // Validar los campos
    if (!recetaId || !sucursal || !estado) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <tu-token>', // Añadir token si es necesario
            },
            body: JSON.stringify({
                receta_Id: parseInt(recetaId),
                sucursal: sucursal,
                estado: estado
            }),
        });

        if (!response.ok) {
            throw new Error(`Error al agregar la producción: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Registro agregado:', responseData);

        // Limpiar los campos del formulario
        document.getElementById('receta').value = '';
        document.getElementById('sucursal').value = '';
        document.getElementById('estado').value = 'EN_PROCESO'; // Restaurar el valor por defecto de 'EN_PROCESO'

        // Actualizar la tabla con los nuevos datos
        getAllProduccion();
    } catch (error) {
        console.error('Error al agregar la producción:', error);
    }
}

// Evento para el botón Guardar
document.getElementById('guardarBtn').addEventListener('click', agregarProduccion);


// Función para obtener todos los registros de producción
async function getAllProduccion() {
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
            actualizarTablaProduccion(responseData.data); // Pasa el arreglo al actualizarTablaProduccion
        } else {
            console.error('La clave "data" no contiene un arreglo:', responseData.data);
        }
    } catch (error) {
        console.error('Error al obtener los registros de producción:', error);
    }
}

// Función para actualizar la tabla con los datos de producción
function actualizarTablaProduccion(data) {
    const tbody = document.querySelector('#tabla_produccion tbody');
    tbody.innerHTML = ''; // Limpiar el contenido actual de la tabla

    data.forEach((registro) => {
        const row = document.createElement('tr');

        // Crear celdas de la fila
        const celdaFolio = document.createElement('td');
        celdaFolio.textContent = registro.id;

        const celdaGalleta = document.createElement('td');
        celdaGalleta.textContent = registro.receta.nombre; // Suponiendo que 'galleta' es el campo para el nombre de la galleta

        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = new Date(registro.fecha_fin).toLocaleDateString(); // Suponiendo que 'fecha' es el campo de la fecha

  

        // Crear botón para realizar una acción (por ejemplo, editar o ver detalles)
        const celdaAcciones = document.createElement('td');
        const btnAcciones = document.createElement('button');
        btnAcciones.classList.add('btn', 'btn-outline-dark', 'rounded-circle');
        btnAcciones.innerHTML = '<i class="bi bi-plus"></i>'; // Icono de lápiz para editar
        btnAcciones.addEventListener('click', () => {
            editarRegistro(registro.folio); // Llamar a la función para editar el registro
        });
        

        celdaAcciones.appendChild(btnAcciones);

        // Agregar celdas a la fila
        row.appendChild(celdaFolio);
        row.appendChild(celdaGalleta);
        row.appendChild(celdaFecha);
        row.appendChild(celdaAcciones);

        // Agregar fila a la tabla
        tbody.appendChild(row);
    });
}

// Función para manejar el proceso de editar un registro
function editarRegistro(folio) {
    console.log(`Editar registro con folio: ${folio}`);
    // Aquí puedes agregar la lógica para editar el registro, por ejemplo, mostrar un modal o pre-cargar los datos en un formulario.
}

// Llamar a la función getAllProduccion al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getAllProduccion();
});
