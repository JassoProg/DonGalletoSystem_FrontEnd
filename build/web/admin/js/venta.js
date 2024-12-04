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
    const recetaSelect = document.getElementById('receta');
    const recetaNombre = recetaSelect.options[recetaSelect.selectedIndex].text;
    const recetaId = recetaSelect.value;

    if (!recetaId) {
        alert('Por favor, selecciona una receta antes de agregar.');
        return;
    }

    const precioPorGalleta = 4.50;
    let galletasUds = 0;
    let pesoKg = 0;
    let pesoGm = 0;
    let precioVenta = 0;

    // Obtener valores de los campos
    const efectivo = parseFloat(document.getElementById('efectivo').value) || 0;
    const unidadesGalletas = parseInt(document.getElementById('unidades_galletas').value) || 0;
    const pesoInputKg = parseFloat(document.getElementById('peso_kg').value) || 0;
    const pesoInputGm = parseFloat(document.getElementById('peso_gm').value) || 0;

    if (efectivo > 0) {
        // Calcular la cantidad de galletas por efectivo
        galletasUds = Math.floor(efectivo / precioPorGalleta); // Redondear hacia abajo
        precioVenta = galletasUds * precioPorGalleta;
    } else if (unidadesGalletas > 0) {
        // Usar la cantidad de unidades especificadas
        galletasUds = unidadesGalletas;
        precioVenta = galletasUds * precioPorGalleta;
    } else if (pesoInputKg > 0 || pesoInputGm > 0) {
        // Calcular la cantidad de galletas por peso
        const pesoTotalGm = (pesoInputKg * 1000) + pesoInputGm;
        galletasUds = Math.floor(pesoTotalGm / 40); // Cada galleta pesa 40 gm
        precioVenta = galletasUds * precioPorGalleta;
        pesoKg = Math.floor(pesoTotalGm / 1000);
        pesoGm = pesoTotalGm % 1000;
    } else {
        alert('Por favor, ingresa efectivo, unidades o peso para agregar galletas.');
        return;
    }

    // Si el peso no fue calculado, calcularlo ahora
    if (pesoKg === 0 && pesoGm === 0) {
        const pesoTotalGm = galletasUds * 40;
        pesoKg = Math.floor(pesoTotalGm / 1000);
        pesoGm = pesoTotalGm % 1000;
    }

    // Crear una nueva fila en la tabla
    const tabla = document.getElementById('tabla_venta').querySelector('tbody');
    const fila = document.createElement('tr');
    fila.setAttribute('data-receta-id', recetaId);

    fila.innerHTML = `
        <td>${recetaNombre}</td>
        <td>${galletasUds}</td>
        <td>${pesoKg.toFixed(2)} Kg</td>
        <td>${pesoGm.toFixed(2)} Gm</td>
        <td>${(pesoKg + pesoGm / 1000).toFixed(2)} Kg</td>
        <td>$${precioVenta.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm">&#x1F5D1;</button></td>
    `;

    tabla.appendChild(fila);

    // Actualizar totales y limpiar los campos
    actualizarTotales();
    limpiarSeleccion();
}

function actualizarTotales() {
    let totalPesoKg = 0;
    let totalPrecio = 0;
    let totalGalletas = 0;

    const filas = document.querySelectorAll('#tabla_venta tbody tr');
    filas.forEach(fila => {
        const galletasUds = parseInt(fila.children[1]?.textContent) || 0;
        const pesoTotalKg = parseFloat(fila.children[4]?.textContent.replace(' Kg', '')) || 0;
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

    // Ya no necesitas los datos de sucursal, estado y metodoPago
    for (const detalle of detallesVenta) {
        const productoData = { 
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
                    'Authorization': `Bearer <tu-token>`, // Cambia el token según tu necesidad
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
