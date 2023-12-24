document.addEventListener('DOMContentLoaded', () => {
    obtenerPedidos();

    document.getElementById('formulario-pedido').addEventListener('submit', function(event) {
        event.preventDefault();
        const clienteId = document.getElementById('clienteId').value;
        const clienteNombre = document.getElementById('clienteNombre').value;
        const clienteApellido = document.getElementById('clienteApellido').value;
        const clienteCorreo = document.getElementById('clienteCorreo').value;

        // Crear un objeto cliente con la estructura correcta
        const cliente = {
            id: clienteId,
            nombre: clienteNombre,
            apellido: clienteApellido,
            correo: clienteCorreo
        };

        crearPedido({ cliente });
    });
});

function obtenerPedidos() {
    fetch('http://localhost:8080/miaplicacion/pedidos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            mostrarPedidos(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function mostrarPedidos(pedidos) {
    const pedidosSection = document.getElementById('pedidos');
    pedidosSection.innerHTML = '';

    pedidos.forEach(pedido => {
        const pedidoElement = document.createElement('div');
        pedidoElement.classList.add('pedido');
        pedidoElement.innerHTML = `
            <h3>ID del Pedido: ${pedido.id}</h3>
            <p>ID del Cliente: ${pedido.cliente.id}</p>
            <button onclick="editarPedido(${pedido.id})">Editar</button>
            <button onclick="eliminarPedido(${pedido.id})">Eliminar</button>
        `;
        pedidosSection.appendChild(pedidoElement);
    });
}

function crearPedido(pedido) {
    fetch('http://localhost:8080/miaplicacion/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        obtenerPedidos();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function editarPedido(pedidoId) {
    fetch(`http://localhost:8080/miaplicacion/pedidos/${pedidoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(pedido => {
            document.getElementById('editId').value = pedido.id;
            document.getElementById('editClienteId').value = pedido.cliente.id;
            abrirModalEditar();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function abrirModalEditar() {
    document.getElementById('modal-editar').style.display = 'block';
}

function cerrarModalEditar() {
    document.getElementById('modal-editar').style.display = 'none';
}

function guardarEdicion() {
    const pedidoId = document.getElementById('editId').value;
    const clienteId = document.getElementById('editClienteId').value;

    const pedidoEditado = { id: pedidoId, cliente: { id: clienteId } };

    fetch(`http://localhost:8080/miaplicacion/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoEditado),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        cerrarModalEditar();
        obtenerPedidos();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function eliminarPedido(pedidoId) {
    fetch(`http://localhost:8080/miaplicacion/pedidos/${pedidoId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        obtenerPedidos();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}
