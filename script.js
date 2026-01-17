/**
 * Fake Store API Landing Page - JavaScript
 * Handles: Copy code, smooth scroll offset, and API demo
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // SMOOTH SCROLL WITH NAVBAR OFFSET
    // ========================================
    const NAVBAR_HEIGHT = 80;

    // Handle all anchor link clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Handle "#" or empty href
            if (targetId === '#' || targetId === '') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - NAVBAR_HEIGHT;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // COPY CODE FUNCTIONALITY
    // ========================================
    const copyBtn = document.getElementById('copyBtn');
    const codeContent = document.querySelector('.code-content code');

    if (copyBtn && codeContent) {
        copyBtn.addEventListener('click', async () => {
            // Get the plain text content (without HTML tags)
            const codeText = codeContent.textContent;

            try {
                await navigator.clipboard.writeText(codeText);
                
                // Update button state
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                `;
                copyBtn.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('copied');
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy: ', err);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        `;
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Fallback copy failed: ', fallbackErr);
                }
                
                document.body.removeChild(textArea);
            }
        });
    }

    // ========================================
    // LIVE API DEMO - FETCH PRODUCTS
    // ========================================
    const responseContent = document.getElementById('responseContent');

    if (responseContent) {
        fetchProducts();
    }

    async function fetchProducts() {
        try {
            responseContent.textContent = 'Fetching data from API...';
            
            const response = await fetch('https://fakestoreapi.com/products?limit=3');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Format and display the JSON
            const formattedJson = JSON.stringify(data, null, 2);
            responseContent.textContent = formattedJson;
            
        } catch (error) {
            console.error('Error fetching products:', error);
            responseContent.textContent = `// Unable to fetch data\n// Error: ${error.message}\n\n// Sample response:\n${getSampleResponse()}`;
        }
    }

    function getSampleResponse() {
        return JSON.stringify([
            {
                id: 1,
                title: "Fjallraven Backpack",
                price: 109.95,
                description: "Your perfect pack for everyday use...",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
            },
            {
                id: 2,
                title: "Mens Casual Premium Slim Fit T-Shirts",
                price: 22.3,
                description: "Slim-fitting style...",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            }
        ], null, 2);
    }

    // ========================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ========================================
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    // Check if elements should animate on scroll (for elements below fold)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Only observe elements that are in sections below the hero
        document.querySelectorAll('.docs-section .fade-in-up, .donate-section .fade-in-up').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
});
