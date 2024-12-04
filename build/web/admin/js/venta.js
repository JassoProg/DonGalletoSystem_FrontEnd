const apiRecetasUrl = 'http://localhost:3000/api/producto/terminado/';
const apiUrl = "http://localhost:3000/api/detalleventa/";

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


function llenarSelectRecetas(recetas) {
    const selectReceta = document.getElementById('receta');
    selectReceta.innerHTML = '';

    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecciona una receta';
    selectReceta.appendChild(optionDefault);

    recetas.forEach((receta) => {
        const option = document.createElement('option');
        option.value = receta.id;
        option.textContent = receta.nombre;
        selectReceta.appendChild(option);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    getAllRecetas();

    // Asignar eventos a los botones
    document.querySelector('.btn.btn-primary-custom:nth-child(1)').addEventListener('click', limpiarSeleccion);
    document.querySelector('.btn.btn-primary-custom:nth-child(2)').addEventListener('click', agregarGalleta);

    // Delegar evento para eliminar filas
    document.querySelector('#tabla_venta tbody').addEventListener('click', (e) => {
        if (e.target && e.target.matches('button.btn-danger')) {
            e.target.closest('tr').remove();
        }
    });
});

function limpiarSeleccion() {
    // Restablecer todos los campos a sus valores iniciales
    document.getElementById('receta').value = '';
    document.getElementById('efectivo').value = '';
    document.getElementById('unidades_galletas').value = '';
    document.getElementById('peso_kg').value = '';
    document.getElementById('peso_gm').value = '';
    document.getElementById('peso_total').value = '';
    document.getElementById('precio_venta').value = '';

    document.querySelectorAll('.form-control').forEach(input => {
        if (input.type === 'text') {
            input.value = input.classList.contains('input-dark') ? '0' : '$0.00';
        }
    });
}

function agregarGalleta() {
    // Obtener valores de los campos
    const recetaSelect = document.getElementById('receta');
    const recetaNombre = recetaSelect.options[recetaSelect.selectedIndex].text;
    const recetaId = recetaSelect.value;

    if (!recetaId) {
        alert('Por favor, selecciona una receta antes de agregar.');
        return;
    }

    let galletasUds = parseFloat(document.querySelectorAll('.form-control')[1].value) || 0;
    let pesoKg = parseFloat(document.querySelectorAll('.form-control')[2].value) || 0;
    let pesoGm = parseFloat(document.querySelectorAll('.form-control')[3].value) || 0;

    // Calcular peso total y ajustar cantidad según peso
    let pesoTotalGm = pesoKg * 1000 + pesoGm;
    galletasUds = Math.round(pesoTotalGm / 40); // Cada galleta pesa 40 gm
    pesoTotalGm = galletasUds * 40; // Reajustar el peso total según la cantidad de galletas

    const pesoTotalKg = pesoTotalGm / 1000;
    const precioPorGalleta = 4.50;
    const precioVenta = Math.ceil(galletasUds * precioPorGalleta); // Redondeo a favor del cliente

    // Crear una nueva fila en la tabla
    const tabla = document.getElementById('tabla_venta').querySelector('tbody');
    const fila = document.createElement('tr');

    // Asegúrate de agregar el `data-receta-id` a la fila
    fila.setAttribute('data-receta-id', recetaId); // Añadir el ID de la receta

    fila.innerHTML = `
        <td>${recetaNombre}</td>
        <td>${galletasUds}</td>
        <td>${(pesoTotalKg).toFixed(2)} Kg</td>
        <td>${(pesoTotalGm % 1000).toFixed(2)} Gm</td>
        <td>${pesoTotalKg.toFixed(2)} Kg</td>
        <td>$${precioVenta.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm">&#x1F5D1;</button></td>
    `;

    tabla.appendChild(fila);

    // Asegurarse de que la fila tiene al menos 6 celdas
    if (fila.children.length < 6) {
        console.error('La fila no tiene suficientes celdas. Algo salió mal al agregarla.');
    }

    // Actualizar totales
    actualizarTotales();

    // Limpiar campos después de agregar
    limpiarSeleccion();
}

function actualizarTotales() {
    let totalPesoKg = 0;
    let totalPrecio = 0;
    let totalGalletas = 0;

    const filas = document.querySelectorAll('#tabla_venta tbody tr');
    if (filas.length === 0) {
        console.log('No hay filas en la tabla.');
        return;
    }

    filas.forEach(fila => {
        const galletasUds = parseInt(fila.children[1]?.textContent) || 0;  // Usamos el operador ?. para evitar errores
        const pesoTotalKg = parseFloat(fila.children[4]?.textContent.replace(' Kg', '')) || 0; // Usamos ? para evitar errores
        const precioVenta = parseFloat(fila.children[5]?.textContent.replace('$', '')) || 0;

        totalGalletas += galletasUds;
        totalPesoKg += pesoTotalKg;
        totalPrecio += precioVenta;
    });

    // Actualizar los totales en la UI
    document.querySelector('.col-md-6.text-end h4 span').textContent = `$${totalPrecio.toFixed(2)}`;
}

async function cobrarVenta() {
    const filas = document.querySelectorAll('#tabla_venta tbody tr');
    if (filas.length === 0) {
        alert('No hay productos para cobrar.');
        return;
    }

    // Crear un arreglo con los datos de las filas de la tabla
    const detallesVenta = Array.from(filas).map(fila => {
        // Verificar que las celdas existen
        const recetaId = fila.getAttribute('data-receta-id') || '';  // Obtener el ID de la receta
        const cantidad = parseInt(fila.children[1]?.textContent) || 0;  // Obtener cantidad
        const precio = parseFloat(fila.children[5]?.textContent.replace('$', '').trim()) || 0;  // Obtener precio

        return {
            producto_Id: recetaId,
            cantidad: cantidad,
            precio: precio
        };
    });

    // Datos adicionales necesarios para la venta
    const ventaData = {
        sucursal: "centro",  // Este valor es por defecto
        estado: "PAGADO",    // Este valor es por defecto
        metodoPago: "EFECTIVO",  // Este valor es por defecto
    };

    // Agregar cada producto individualmente a la estructura principal y realizar la solicitud
    for (const detalle of detallesVenta) {
        const productoData = { 
            ...ventaData, // Copiar los datos generales de la venta
            producto_Id: parseInt(detalle.producto_Id), 
            cantidad: detalle.cantidad,
            precio: detalle.precio
        };

        // Realizar la solicitud POST por cada producto
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer $`, // Cambiar el token según tu necesidad
                },
                body: JSON.stringify(productoData)
            });

            if (!response.ok) {
                throw new Error(`Error al cobrar la venta. Status: ${response.status}`);
            }

            const responseData = await response.json();
            alert('Venta cobrada con éxito!');
            console.log(responseData);
            // Puedes hacer algo con la respuesta del servidor si es necesario.
        } catch (error) {
            console.error('Error al cobrar la venta:', error);
            alert('Hubo un error al cobrar la venta.');
        }
    }
}

