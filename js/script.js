```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            // Optional: Toggle icon between bars and times
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });

        // Close nav when a link is clicked (for single-page navigation)
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.querySelector('i').classList.remove('fa-times');
                    navToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Simulated Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountElement = document.getElementById('cart-count');
    let cartItemCount = 0;

    if (addToCartButtons.length > 0 && cartCountElement) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                const productTitle = event.target.previousElementSibling.previousElementSibling.textContent; // Gets product title
                
                cartItemCount++;
                cartCountElement.textContent = cartItemCount;

                alert(`"${productTitle}" added to cart! Total items: ${cartItemCount}`);
                console.log(`Product ID ${productId} added to cart.`);
            });
        });
    }

    // 3. Simulated Newsletter Subscription
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (email) {
                alert(`Thank you for subscribing, ${email}! You'll receive our latest updates.`);
                console.log(`Newsletter subscription: ${email}`);
                emailInput.value = ''; // Clear the input field
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // 4. Simulated Customer Feedback Submission
    const feedbackForm = document.getElementById('feedbackForm');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission

            const name = document.getElementById('feedbackName').value;
            const email = document.getElementById('feedbackEmail').value;
            const message = document.getElementById('feedbackMessage').value;
            const rating = document.getElementById('rating').value;

            if (name && email && message && rating) {
                alert(`Thank you for your feedback, ${name}! We received your ${rating}-star review.`);
                console.log(`Feedback received: Name=${name}, Email=${email}, Rating=${rating}, Message=${message}`);
                // Clear the form
                feedbackForm.reset();
            } else {
                alert('Please fill in all feedback fields.');
            }
        });
    }

    // 5. Active navigation link highlighting (for single-page navigation)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID

    function activateNavLink() {
        let currentActive = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust offset for fixed header
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            } else if (currentActive === null && link.getAttribute('href').includes('index.html')) {
                // If at the very top and no section is active, highlight Home
                 link.classList.add('active');
            }
        });
    }

    // Set initial active link and update on scroll
    activateNavLink();
    window.addEventListener('scroll', activateNavLink);
});
```