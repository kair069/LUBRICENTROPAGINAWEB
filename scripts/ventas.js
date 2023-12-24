document.addEventListener('DOMContentLoaded', () => {
    obtenerVentas();

    document.getElementById('formulario-venta').addEventListener('submit', function(event) {
        event.preventDefault();
        const clienteIdVenta = document.getElementById('clienteIdVenta').value;
        const clienteNombreVenta = document.getElementById('clienteNombreVenta').value;
        const clienteApellidoVenta = document.getElementById('clienteApellidoVenta').value;
        const clienteCorreoVenta = document.getElementById('clienteCorreoVenta').value;

        // Crear un objeto cliente con la estructura correcta
        const clienteVenta = {
            id: clienteIdVenta,
            nombre: clienteNombreVenta,
            apellido: clienteApellidoVenta,
            correo: clienteCorreoVenta
        };

        crearVenta({ cliente: clienteVenta });
    });

    // Agrega el evento para abrir el modal de edición
    document.getElementById('ventas').addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'BUTTON' && target.textContent === 'Editar') {
            const ventaId = target.dataset.id;
            editarVenta(ventaId);
        }
    });
});

function obtenerVentas() {
    fetch('http://localhost:8080/miaplicacion/ventas')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            mostrarVentas(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function mostrarVentas(ventas) {
    const ventasSection = document.getElementById('ventas');
    ventasSection.innerHTML = ''; // Limpiar la lista antes de mostrar las ventas

    ventas.forEach(venta => {
        const ventaElement = document.createElement('div');
        ventaElement.classList.add('venta');
        ventaElement.innerHTML = `
            <h3>ID Venta: ${venta.id}</h3>
            <p>Cliente: ${venta.cliente.nombre} ${venta.cliente.apellido}</p>
            <p>Correo del Cliente: ${venta.cliente.correo}</p>
            <button data-id="${venta.id}" onclick="editarVenta(${venta.id})">Editar</button>
            <button onclick="eliminarVenta(${venta.id})">Eliminar</button>
        `;
        ventasSection.appendChild(ventaElement);
    });
}

function crearVenta(venta) {
    fetch('http://localhost:8080/miaplicacion/ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(venta),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        obtenerVentas(); // Vuelve a cargar la lista de ventas después de crear una nueva
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function editarVenta(ventaId) {
    // Obtener la venta por su ID y llenar el formulario de edición
    fetch(`http://localhost:8080/miaplicacion/ventas/${ventaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(venta => {
            document.getElementById('editVentaId').value = venta.id;
            document.getElementById('editClienteIdVenta').value = venta.cliente.id;
            document.getElementById('editClienteNombreVenta').value = venta.cliente.nombre;
            document.getElementById('editClienteApellidoVenta').value = venta.cliente.apellido;
            document.getElementById('editClienteCorreoVenta').value = venta.cliente.correo;
            abrirModalEditarVenta();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function abrirModalEditarVenta() {
    document.getElementById('modal-editar-venta').style.display = 'block';
}

function cerrarModalEditarVenta() {
    document.getElementById('modal-editar-venta').style.display = 'none';
}

function guardarEdicionVenta() {
    const ventaId = document.getElementById('editVentaId').value;
    const clienteIdVenta = document.getElementById('editClienteIdVenta').value;
    const clienteNombreVenta = document.getElementById('editClienteNombreVenta').value;
    const clienteApellidoVenta = document.getElementById('editClienteApellidoVenta').value;
    const clienteCorreoVenta = document.getElementById('editClienteCorreoVenta').value;

    // Crear un objeto cliente con la estructura correcta
    const clienteVentaEditado = {
        id: clienteIdVenta,
        nombre: clienteNombreVenta,
        apellido: clienteApellidoVenta,
        correo: clienteCorreoVenta
    };

    const ventaEditada = { id: ventaId, cliente: clienteVentaEditado };

    fetch(`http://localhost:8080/miaplicacion/ventas/${ventaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaEditada),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        cerrarModalEditarVenta();
        obtenerVentas();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function eliminarVenta(ventaId) {
    fetch(`http://localhost:8080/miaplicacion/ventas/${ventaId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        obtenerVentas(); // Vuelve a cargar la lista de ventas después de eliminar una
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}
