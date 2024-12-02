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