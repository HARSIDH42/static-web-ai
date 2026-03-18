```javascript
// This script will be loaded dynamically by feedback-integrator.js
// It expects to be called with an `initializeFeedbackWidget` function.

(function() {
    let currentContainer = null;
    let currentOnCloseCallback = null;

    // IMPORTANT: Replace with your actual backend API endpoint for feedback
    const FEEDBACK_API_ENDPOINT = 'YOUR_BACKEND_FEEDBACK_ENDPOINT'; // e.g., '/api/feedback'

    /**
     * Initializes the feedback widget within the given container.
     * @param {Object} options
     * @param {HTMLElement} options.container The DOM element containing the widget's HTML.
     * @param {Function} options.onClose A callback function to hide/remove the widget.
     */
    window.initializeFeedbackWidget = function({ container, onClose }) {
        currentContainer = container;
        currentOnCloseCallback = onClose;

        const form = container.querySelector('#feedback-form');
        const closeButton = container.querySelector('.feedback-close-button');
        const cancelButton = container.querySelector('.feedback-cancel-button');
        const feedbackMessage = container.querySelector('#feedback-message');

        if (!form || !closeButton || !cancelButton || !feedbackMessage) {
            console.error('Feedback widget elements not found in container.');
            return;
        }

        form.addEventListener('submit', handleFormSubmit);
        closeButton.addEventListener('click', handleClose);
        cancelButton.addEventListener('click', handleClose);

        // Allow escape key to close the modal
        document.addEventListener('keydown', handleEscapeKey);

        // Ensure focus is trapped within the modal for accessibility
        trapFocus(container);
    };

    /**
     * Cleans up event listeners when the widget is removed.
     */
    window.cleanupFeedbackWidget = function() {
        document.removeEventListener('keydown', handleEscapeKey);
        // Additional cleanup for form listeners if they were attached globally or needed explicit removal.
        // In this setup, form and button listeners are on elements that are removed with the container.
        currentContainer = null;
        currentOnCloseCallback = null;
    };


    /**
     * Handles the form submission.
     * @param {Event} event
     */
    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const feedbackText = form.querySelector('#feedback-text').value;
        const feedbackEmail = form.querySelector('#feedback-email').value;
        const submitButton = form.querySelector('.feedback-submit-button');
        const feedbackMessage = currentContainer.querySelector('#feedback-message');

        if (!feedbackText.trim()) {
            showMessage(feedbackMessage, 'Please enter your feedback.', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        showMessage(feedbackMessage, '', ''); // Clear previous messages

        const feedbackData = {
            feedback: feedbackText,
            email: feedbackEmail.trim() || null,
            // Automatically capture contextual data
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
            // Add more context as needed, e.g., screen size, user ID (if available globally)
            // screenWidth: window.innerWidth,
            // screenHeight: window.innerHeight,
            // userId: window.myApp && window.myApp.currentUser ? window.myApp.currentUser.id : null,
        };

        try {
            const response = await fetch(FEEDBACK_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            showMessage(feedbackMessage, 'Thank you for your feedback!', 'success');
            form.reset(); // Clear form
            setTimeout(currentOnCloseCallback, 2000); // Close after a short delay
        } catch (error) {
            console.error('Feedback submission failed:', error);
            showMessage(feedbackMessage, `Failed to send feedback: ${error.message || 'Please try again.'}`, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Feedback';
        }
    }

    /**
     * Displays a message within the widget.
     * @param {HTMLElement} element The message display element.
     * @param {string} message The message text.
     * @param {string} type The type of message ('success' or 'error').
     */
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `feedback-message ${type}`;
        element.style.display = message ? 'block' : 'none';
    }

    /**
     * Handles closing the widget.
     */
    function handleClose() {
        if (currentOnCloseCallback) {
            currentOnCloseCallback();
        }
    }

    /**
     * Handles the escape key to close the widget.
     * @param {KeyboardEvent} event
     */
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }

    /**
     * Traps focus within the modal for accessibility.
     * @param {HTMLElement} modalElement The modal container.
     */
    function trapFocus(modalElement) {
        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
        const focusableElements = Array.from(modalElement.querySelectorAll(focusableElementsString)).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusableElements.length === 0) return;

        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        // Focus the first element when the modal opens
        firstFocusableElement.focus();

        modalElement.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

})();
```