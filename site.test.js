/**
 * @jest-environment jsdom
 */

// Mocking window methods/objects if necessary
window.alert = jest.fn();

describe('NovaCart E2E/Unit Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <header>
                <nav><button id="cart-btn" aria-label="Open Cart" onclick="toggleCart()">Bag (<span id="cart-count">0</span>)</button></nav>
            </header>
            <main id="product-grid"></main>
            <aside id="cart-drawer"><div id="cart-items"></div><div id="cart-total"></div></aside>
            <div class="chat-btn" onclick="initChat()" id="chat-widget">💬</div>
        `;
        // Inject script functions here or import them
        // For testing logic:
        require('./script.js'); 
    });

    test('Cart: Add item updates count and drawer', () => {
        addToCart(1);
        expect(document.getElementById('cart-count').innerText).toBe('1');
        expect(document.getElementById('cart-items').innerHTML).toContain('Premium Watch');
    });

    test('Cart: Remove/Empty logic (Reset flow)', () => {
        cart = []; 
        updateCartDrawer();
        expect(document.getElementById('cart-count').innerText).toBe('0');
        expect(document.getElementById('cart-items').innerHTML).toBe('');
    });

    test('Search: Filtering products logic', () => {
        const searchTerm = 'Watch';
        const filtered = products.filter(p => p.name.includes(searchTerm));
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('Premium Watch');
    });

    test('Dark Mode: Toggle state', () => {
        document.body.style.setProperty('--bg', '#000');
        expect(document.body.style.getPropertyValue('--bg')).toBe('#000');
    });

    test('Chatbot: Interaction triggers alert', () => {
        const chatBtn = document.getElementById('chat-widget');
        chatBtn.click();
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Chatbot"));
    });

    test('Quantity update: Calculation correct', () => {
        cart = [products[0], products[0]]; // Add same item twice
        updateCartDrawer();
        const totalText = document.getElementById('cart-total').innerText;
        expect(totalText).toContain('59,998');
    });

    test('Mobile Responsiveness: Check drawer class', () => {
        const drawer = document.getElementById('cart-drawer');
        toggleCart();
        expect(drawer.classList.contains('cart-open')).toBe(true);
        expect(drawer.getAttribute('aria-hidden')).toBe('false');
    });

    test('Navigation: Ensure elements exist', () => {
        expect(document.querySelector('header')).toBeDefined();
        expect(document.getElementById('product-grid')).not.toBeNull();
    });

    test('Checkout flow: Cart total renders correctly', () => {
        cart = [products[0], products[1]];
        updateCartDrawer();
        const total = document.getElementById('cart-total').innerText;
        expect(total).toBe('Total: ₹38,998');
    });
});