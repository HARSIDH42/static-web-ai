// 4. SHOPPING INTERACTION: Simple State Management
let cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initFilters();
    initSearch();
    updateCartUI();
});

// CART LOGIC
function initCart() {
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    const toggleFn = () => {
        const isOpen = sidebar.classList.toggle('open');
        overlay.classList.toggle('visible');
        sidebar.setAttribute('aria-hidden', !isOpen);
    };

    cartToggle.addEventListener('click', toggleFn);
    closeCart.addEventListener('click', toggleFn);
    overlay.addEventListener('click', toggleFn);

    // Add to cart delegation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const btn = e.target;
            const item = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                qty: 1
            };
            addToCart(item);
            
            // Subtle feedback animation
            btn.innerText = 'Added!';
            setTimeout(() => btn.innerText = 'Add to Cart', 1500);
        }
    });
}

function addToCart(newItem) {
    const existing = cart.find(i => i.id === newItem.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push(newItem);
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const list = document.getElementById('cartItems');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cartTotalValue');
    
    count.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    
    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        total.innerText = '$0.00';
        return;
    }

    let totalVal = 0;
    list.innerHTML = cart.map(item => {
        totalVal += item.price * item.qty;
        return `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.qty}</p>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="btn-link">Remove</button>
            </div>
        `;
    }).join('');
    
    total.innerText = `$${totalVal.toFixed(2)}`;
}

// 2. PRODUCT DISCOVERY: Filter & Sort logic
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('priceSort');
    const products = Array.from(document.querySelectorAll('.product-card'));
    const grid = document.getElementById('productGrid');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            products.forEach(p => {
                const isMatch = filter === 'all' || p.dataset.category === filter;
                p.classList.toggle('hidden', !isMatch);
            });
            
            checkEmptyState();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const sorted = [...products].sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            return val === 'low' ? priceA - priceB : priceB - priceA;
        });
        
        if (val !== 'default') {
            sorted.forEach(p => grid.appendChild(p));
        }
    });
}

// 2. SEARCH: Instant filtering
function initSearch() {
    const searchInput = document.getElementById('productSearch');
    const products = document.querySelectorAll('.product-card');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        products.forEach(p => {
            const name = p.querySelector('h3').innerText.toLowerCase();
            p.classList.toggle('hidden', !name.includes(query));
        });
        
        checkEmptyState();
    });
}

function checkEmptyState() {
    const visible = document.querySelectorAll('.product-card:not(.hidden)').length;
    document.getElementById('noResults').classList.toggle('hidden', visible > 0);
}

function resetFilters() {
    document.getElementById('productSearch').value = '';
    document.querySelector('[data-filter="all"]').click();
}

// 3. PDP: Size selector interaction
document.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        chip.parentElement.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});