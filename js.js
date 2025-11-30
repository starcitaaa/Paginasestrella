// Estado del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para abrir/cerrar carrito
function toggleCarrito() {
    const modal = document.getElementById('modal-carrito');
    if (modal) {
        modal.classList.toggle('activo');
        if (modal.classList.contains('activo')) {
            actualizarCarrito();
        }
    }
}

// Función para agregar al carrito
function agregarAlCarrito(nombre, precio) {
    const item = carrito.find(g => g.nombre === nombre);
    
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: parseFloat(precio.replace('$', '')),
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(`✅ ${nombre} agregado al carrito`);
}

// Función para eliminar del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(g => g.nombre !== nombre);
    guardarCarrito();
    actualizarCarrito();
    actualizarTablaCarrito(); // Actualizar tabla en Carrito.html
}

// Función para cambiar cantidad
function cambiarCantidad(nombre, cambio) {
    const item = carrito.find(g => g.nombre === nombre);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(nombre);
        } else {
            guardarCarrito();
            actualizarCarrito();
            actualizarTablaCarrito(); // Actualizar tabla en Carrito.html
        }
    }
}

// Función para guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar vista del carrito (modal en index.html)
function actualizarCarrito() {
    const lista = document.getElementById('carrito-lista');
    const contador = document.getElementById('carrito-count');
    const totalItems = document.getElementById('total-items');
    const totalPrecio = document.getElementById('total-precio');
    const btnFinalizar = document.getElementById('btn-finalizar');

    if (!lista) return; // Si no está en index.html, salir

    // Actualizar contador
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (contador) contador.textContent = totalCantidad;

    if (carrito.length === 0) {
        lista.innerHTML = '<div class="carrito-vacio"><p>Tu carrito está vacío 😿</p></div>';
        if (totalItems) totalItems.textContent = '0';
        if (totalPrecio) totalPrecio.textContent = '0';
        if (btnFinalizar) btnFinalizar.disabled = true;
    } else {
        // Construir HTML del carrito
        lista.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">$${item.precio.toFixed(2)}</div>
                </div>
                <div class="item-cantidad">
                    <button class="btn-cantidad" onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                </div>
                <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button>
            </div>
        `).join('');

        // Calcular totales
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        if (totalItems) totalItems.textContent = totalCantidad;
        if (totalPrecio) totalPrecio.textContent = total.toFixed(2);
        if (btnFinalizar) btnFinalizar.disabled = false;
    }
}

// Función para actualizar tabla en Carrito.html
function actualizarTablaCarrito() {
    const tabla = document.getElementById('carrito-tabla');
    if (!tabla) return; // Si no está en Carrito.html, salir

    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    <p style="font-size: 1.2rem; color: #999;">Tu carrito está vacío 😿</p>
                </td>
            </tr>
        `;
    } else {
        tabla.innerHTML = carrito.map(item => `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <button class="btn-cantidad-tabla" onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                    <span class="cantidad-numero-tabla">${item.cantidad}</span>
                    <button class="btn-cantidad-tabla" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                </td>
                <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
                <td><button class="btn-eliminar-tabla" onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button></td>
            </tr>
        `).join('');
    }

    actualizarTotalCarrito();
}

// Función para actualizar total en Carrito.html
function actualizarTotalCarrito() {
    const totalElement = document.getElementById('total-carrito-precio');
    const cantidadElement = document.getElementById('total-carrito-items');

    if (!totalElement || !cantidadElement) return;

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    totalElement.textContent = total.toFixed(2);
    cantidadElement.textContent = totalCantidad;
}

// Función para finalizar compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cantidadGatos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    alert(`🎉 ¡Compra finalizada!\n\nGatos comprados: ${cantidadGatos}\nTotal: $${total.toFixed(2)}\n\n¡Gracias por tu compra! 💕`);
    
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    actualizarTablaCarrito();
    
    const modal = document.getElementById('modal-carrito');
    if (modal) toggleCarrito();
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff69b4;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(255, 20, 147, 0.4);
        z-index: 300;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar al cargar página
window.addEventListener('DOMContentLoaded', function() {
    actualizarCarrito();
    actualizarTablaCarrito();
});
