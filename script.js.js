// State management
let cart = [];

function formatMXN(amount) {
    return `$${Number(amount).toFixed(2)} MXN`;
}

function toggleSidebar() {
    const drawer = document.getElementById('sidebarDrawer');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = drawer.classList.contains('translate-x-0');

    if (isOpen) {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    } else {
        drawer.classList.remove('-translate-x-full');
        drawer.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
    }
}

function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(p => p.classList.add('hidden'));

    // Show target page
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function addToCart(name, price, icon) {
    const numericPrice = typeof price === 'number'
        ? price
        : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price: numericPrice, icon, qty: 1 });
    }
    updateCartUI();
    showNotification(`¡${name} agregado con éxito!`);
}

function updateCartUI() {
    const countElem = document.getElementById('cartCount');
    const listElem = document.getElementById('cartItemsList');
    const totalElem = document.getElementById('cartTotalPrice');

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    countElem.innerText = totalCount;
    totalElem.innerText = formatMXN(totalPrice);

    if (cart.length === 0) {
        listElem.innerHTML = `<p class="text-center text-gray-400 py-6 text-sm">Tu carrito está vacío</p>`;
        return;
    }

    let html = '';
    cart.forEach((item, index) => {
        const subtotal = formatMXN(item.price * item.qty);
        html += `
            <div class="flex items-center justify-between pt-3">
                <div class="flex items-center space-x-3">
                    <span class="text-2xl">${item.icon}</span>
                    <div>
                        <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                        <p class="text-xs text-gray-500">${formatMXN(item.price)} x ${item.qty} = <span class="font-semibold text-gray-700">${subtotal}</span></p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="changeQty(${index}, -1)" class="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-xs">-</button>
                    <span class="text-sm font-semibold">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-xs">+</button>
                </div>
            </div>
        `;
    });
    listElem.innerHTML = html;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function openCart() {
    document.getElementById('cartModal').classList.remove('hidden');
}

function closeCart() {
    document.getElementById('cartModal').classList.add('hidden');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Agrega productos antes de ordenar.');
        return;
    }
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`¡Gracias por tu pedido en Dulces Zefe! Total: ${formatMXN(totalPrice)}. Te redirigiremos al teléfono 55-63-24-22-16 para confirmar tu entrega.`);
    cart = [];
    updateCartUI();
    closeCart();
}

function showNotification(msg) {
    const box = document.getElementById('notificationBox');
    const text = document.getElementById('notificationText');
    text.innerText = msg;
    box.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        box.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}