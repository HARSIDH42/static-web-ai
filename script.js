
    const products = [
        { id: 1, name: 'Premium Watch', price: 29999, img: 'https://via.placeholder.com/300?text=Watch' },
        { id: 2, name: 'Tech Jacket', price: 8999, img: 'https://via.placeholder.com/300?text=Jacket' },
        { id: 3, name: 'Smart Shoe', price: 12500, img: 'https://via.placeholder.com/300?text=Shoe' }
    ];

    let cart = [];

    function renderProducts() {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = products.map(p => `
            <article class="card">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <h3>${p.name}</h3>
                <p>₹${p.price.toLocaleString()}</p>
                <button onclick="addToCart(${p.id})">Add to Bag</button>
            </article>
        `).join('');
    }

    function addToCart(id) {
        const item = products.find(p => p.id === id);
        cart.push(item);
        document.getElementById('cart-count').innerText = cart.length;
        updateCartDrawer();
    }

    function updateCartDrawer() {
        const list = document.getElementById('cart-items');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        list.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>₹${item.price.toLocaleString()}</span>
            </div>
        `).join('');
        document.getElementById('cart-total').innerHTML = `Total: ₹${total.toLocaleString()}`;
    }

    function toggleCart() {
        const drawer = document.getElementById('cart-drawer');
        drawer.classList.toggle('cart-open');
        drawer.setAttribute('aria-hidden', drawer.classList.contains('cart-open') ? 'false' : 'true');
    }

    function initChat() {
        alert("Chatbot: Hello! How can I assist you with your order today?");
    }

    document.addEventListener('DOMContentLoaded', renderProducts);
