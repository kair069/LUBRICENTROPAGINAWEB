document.addEventListener('DOMContentLoaded', () => {
    obtenerClientes();

    document.getElementById('formulario-cliente').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;

        crearCliente({ nombre, correo });
    });

    document.getElementById('formulario-editar').addEventListener('submit', function (event) {
        event.preventDefault();
        guardarEdicion();
    });
});

function obtenerClientes() {
    fetch('http://localhost:8080/miaplicacion/clientes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            mostrarClientes(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function mostrarClientes(clientes) {
    const clientesSection = document.getElementById('clientes');
    clientesSection.innerHTML = '';

    clientes.forEach(cliente => {
        const clienteElement = document.createElement('div');
        clienteElement.classList.add('cliente');
        clienteElement.innerHTML = `
            <h3>${cliente.nombre}</h3>
            <p>Correo: ${cliente.correo}</p>
            <button onclick="editarCliente(${cliente.id})">Editar</button>
            <button onclick="eliminarCliente(${cliente.id})">Eliminar</button>
        `;
        clientesSection.appendChild(clienteElement);
    });
}

function crearCliente(cliente) {
    fetch('http://localhost:8080/miaplicacion/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            obtenerClientes();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function editarCliente(clienteId) {
    fetch(`http://localhost:8080/miaplicacion/clientes/${clienteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(cliente => {
            document.getElementById('editId').value = cliente.id;
            document.getElementById('editNombre').value = cliente.nombre;
            document.getElementById('editCorreo').value = cliente.correo;
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
    const clienteId = document.getElementById('editId').value;
    const nombre = document.getElementById('editNombre').value;
    const correo = document.getElementById('editCorreo').value;

    const clienteEditado = { id: clienteId, nombre, correo };

    fetch(`http://localhost:8080/miaplicacion/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteEditado),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            cerrarModalEditar();
            obtenerClientes();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function eliminarCliente(clienteId) {
    fetch(`http://localhost:8080/miaplicacion/clientes/${clienteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            obtenerClientes();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
