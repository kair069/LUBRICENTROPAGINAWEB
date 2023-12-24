document.addEventListener('DOMContentLoaded', () => {
    obtenerInventarios();

    document.getElementById('formulario-inventario').addEventListener('submit', function (event) {
        event.preventDefault();
        const producto = document.getElementById('producto').value;
        const cantidad = document.getElementById('cantidad').value;

        agregarInventario({ producto, cantidad });
    });

    document.getElementById('formulario-editar-inventario').addEventListener('submit', function (event) {
        event.preventDefault();
        guardarEdicionInventario();
    });
});

function obtenerInventarios() {
    fetch('http://localhost:8080/miaplicacion/inventarios')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            mostrarInventarios(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function mostrarInventarios(inventarios) {
    const inventariosSection = document.getElementById('inventarios');
    inventariosSection.innerHTML = '';

    inventarios.forEach(inventario => {
        const inventarioElement = document.createElement('div');
        inventarioElement.classList.add('inventario');
        inventarioElement.innerHTML = `
            <h3>${inventario.producto.nombre}</h3>
            <p>Precio: $${inventario.producto.precio}</p>
            <p>Cantidad: ${inventario.cantidad}</p>
            <button onclick="editarInventario(${inventario.id})">Editar</button>
            <button onclick="eliminarInventario(${inventario.id})">Eliminar</button>
        `;
        inventariosSection.appendChild(inventarioElement);
    });
}

function agregarInventario(inventario) {
    fetch('http://localhost:8080/miaplicacion/inventarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventario),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            obtenerInventarios();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function editarInventario(inventarioId) {
    fetch(`http://localhost:8080/miaplicacion/inventarios/${inventarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(inventario => {
            document.getElementById('editIdInventario').value = inventario.id;
            document.getElementById('editProducto').value = inventario.producto;
            document.getElementById('editCantidad').value = inventario.cantidad;
            abrirModalEditarInventario();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function abrirModalEditarInventario() {
    document.getElementById('modal-editar-inventario').style.display = 'block';
}

function cerrarModalEditarInventario() {
    document.getElementById('modal-editar-inventario').style.display = 'none';
}

function guardarEdicionInventario() {
    const inventarioId = document.getElementById('editIdInventario').value;
    const producto = document.getElementById('editProducto').value;
    const cantidad = document.getElementById('editCantidad').value;

    const inventarioEditado = { id: inventarioId, producto, cantidad };

    fetch(`http://localhost:8080/miaplicacion/inventarios/${inventarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventarioEditado),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            cerrarModalEditarInventario();
            obtenerInventarios();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function eliminarInventario(inventarioId) {
    fetch(`http://localhost:8080/miaplicacion/inventarios/${inventarioId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            obtenerInventarios();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
