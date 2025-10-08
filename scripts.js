// AALUPA Consultants - Modern Interactive Script
// ===============================================

// Utility Functions
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeScrollToTop();
    initializeSmoothScrolling();
    initializeParallaxEffects();
    initializeTypewriter();
    initializeCounters();
    initializeIntersectionObserver();
    initializeTiltEffects();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Start entrance animations
                startEntranceAnimations();
            }, 500);
        }, 1200);
    });
}

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('header');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const scrollHandler = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100);
    
    window.addEventListener('scroll', scrollHandler);
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add staggered animation for service cards
                if (entry.target.classList.contains('service-pillar') || 
                    entry.target.classList.contains('client-card') ||
                    entry.target.classList.contains('category-card')) {
                    const cards = entry.target.parentNode.children;
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Real-time validation
    nameInput.addEventListener('input', () => validateField(nameInput, 'nameError'));
    emailInput.addEventListener('input', () => validateField(emailInput, 'emailError'));
    messageInput.addEventListener('input', () => validateField(messageInput, 'messageError'));
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isValid = validateForm();
        
        if (isValid) {
            submitForm();
        }
    });
    
    function validateField(field, errorId) {
        const errorElement = document.getElementById(errorId);
        let isValid = true;
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value);
        } else {
            isValid = field.value.trim().length > 0;
        }
        
        if (isValid) {
            field.style.borderColor = 'var(--accent-green)';
            errorElement.style.display = 'none';
        } else {
            field.style.borderColor = '#ef4444';
            errorElement.style.display = 'block';
        }
        
        return isValid;
    }
    
    function validateForm() {
        const nameValid = validateField(nameInput, 'nameError');
        const emailValid = validateField(emailInput, 'emailError');
        const messageValid = validateField(messageInput, 'messageError');
        
        return nameValid && emailValid && messageValid;
    }
    
    function submitForm() {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission
        setTimeout(() => {
            // Success state
            submitBtn.style.background = 'var(--accent-green)';
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            
            // Show success notification
            showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'var(--gradient-primary)';
                
                // Reset field borders
                [nameInput, emailInput, messageInput].forEach(field => {
                    field.style.borderColor = '#e2e8f0';
                });
            }, 3000);
        }, 2000);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const bgColor = type === 'success' ? 'var(--accent-green)' : 'var(--primary-blue)';
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.4s ease;
        max-width: 350px;
        border-left: 4px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close
    setTimeout(() => {
        closeNotification(notification);
    }, 6000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 400);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 55px;
        height: 55px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 400) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'scale(1.1)';
        scrollToTopBtn.style.background = 'var(--gold)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'scale(1)';
        scrollToTopBtn.style.background = 'var(--gradient-primary)';
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        
        if (hero && scrolled < hero.offsetHeight) {
            const yPos = -(scrolled * parallaxSpeed);
            hero.style.transform = `translateY(${yPos}px)`;
        }
    }, 16));
}

// Typewriter Effect for Hero
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.hero-subtitle');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    const speed = 60;
    
    setTimeout(() => {
        typewriterElement.textContent = '';
        typewriterElement.style.borderRight = '2px solid var(--gold)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Remove cursor after typing
                setTimeout(() => {
                    typewriterElement.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }, 2000);
}

// Counters Animation
function initializeCounters() {
    // const counters = [
    //     { element: null, target: 500, suffix: '+', label: 'Happy Clients', icon: 'fas fa-users' },
    //     { element: null, target: 1000, suffix: '+', label: 'Projects Completed', icon: 'fas fa-project-diagram' },
    //     { element: null, target: 99, suffix: '%', label: 'Client Satisfaction', icon: 'fas fa-star' },
    //     { element: null, target: 10, suffix: '+', label: 'Years Experience', icon: 'fas fa-calendar-alt' }
    // ];
    
    // Create counter elements
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const counterContainer = document.createElement('div');
        counterContainer.className = 'counters-container animate-on-scroll';
        counterContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
            padding: 3rem;
            background: var(--light-blue);
            border-radius: 20px;
        `;
        
        counters.forEach((counter, index) => {
            const counterElement = document.createElement('div');
            counterElement.className = 'counter';
            counterElement.style.cssText = `
                text-align: center;
                padding: 1.5rem;
                background: var(--white);
                border-radius: 15px;
                box-shadow: var(--shadow);
                transition: transform 0.3s ease;
            `;
            
            counterElement.innerHTML = `
                <div class="counter-icon" style="font-size: 2.5rem; color: var(--primary-blue); margin-bottom: 1rem;">
                    <i class="${counter.icon}"></i>
                </div>
                <div class="counter-number" style="font-size: 2.5rem; font-weight: 700; color: var(--gold); margin-bottom: 0.5rem;">0</div>
                <div class="counter-label" style="color: var(--medium-grey); font-weight: 500;">${counter.label}</div>
            `;
            
            counterElement.addEventListener('mouseenter', () => {
                counterElement.style.transform = 'translateY(-5px)';
            });
            
            counterElement.addEventListener('mouseleave', () => {
                counterElement.style.transform = 'translateY(0)';
            });
            
            counter.element = counterElement.querySelector('.counter-number');
            counterContainer.appendChild(counterElement);
        });
        
        aboutSection.querySelector('.container').appendChild(counterContainer);
        
        // Animate counters when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counterContainer);
    }
    
    function animateCounters() {
        counters.forEach(counter => {
            let current = 0;
            const increment = counter.target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    current = counter.target;
                    clearInterval(timer);
                }
                counter.element.textContent = Math.floor(current) + counter.suffix;
            }, 30);
        });
    }
}

// Enhanced Intersection Observer
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animations based on element type
                if (entry.target.classList.contains('service-pillar')) {
                    entry.target.style.animation = 'slideInUp 0.8s ease forwards';
                }
                
                if (entry.target.classList.contains('client-card')) {
                    entry.target.style.animation = 'fadeInScale 0.6s ease forwards';
                }
                
                if (entry.target.classList.contains('heritage-content')) {
                    const textElement = entry.target.querySelector('.heritage-text');
                    const visualElement = entry.target.querySelector('.heritage-visual');
                    
                    if (textElement) textElement.style.animation = 'slideInLeft 0.8s ease forwards';
                    if (visualElement) visualElement.style.animation = 'slideInRight 0.8s ease forwards 0.3s';
                }
                
                if (entry.target.classList.contains('contact-info')) {
                    entry.target.style.animation = 'slideInLeft 0.8s ease forwards';
                }
                
                if (entry.target.classList.contains('contact-form')) {
                    entry.target.style.animation = 'slideInRight 0.8s ease forwards 0.2s';
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Tilt Effects for Cards
function initializeTiltEffects() {
    const tiltElements = document.querySelectorAll('.service-pillar, .client-card, .feature-card');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Entrance Animations
function startEntranceAnimations() {
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1.2s ease forwards';
    }
    
    // Animate navigation
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.animation = 'slideInDown 0.8s ease forwards';
    }
}

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical images
    const criticalImages = [];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (navLinks && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Enter key on CTA button
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
        e.target.click();
    }
});

// Focus management for accessibility
document.querySelectorAll('a, button, input, textarea, select').forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '3px solid var(--gold)';
        element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

// Add custom animations to CSS dynamically
const customAnimations = `
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInDown {
        from { opacity: 0; transform: translateY(-40px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .counters-container {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 1rem !important;
            padding: 2rem !important;
        }
        
        .scroll-to-top {
            bottom: 20px !important;
            right: 20px !important;
            width: 50px !important;
            height: 50px !important;
        }
    }
`;

// Add animations to head
const style = document.createElement('style');
style.textContent = customAnimations;
document.head.appendChild(style);

// Initialize theme detection
function initializeThemeDetection() {
    // Respect user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0s');
    }
}

// Call theme detection
initializeThemeDetection();

console.log('🚀 AALUPA Consultants - Enhanced Interactive Script Loaded Successfully!');

// Add loading progress indicator
let loadProgress = 0;
const loadingInterval = setInterval(() => {
    loadProgress += Math.random() * 15;
    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadingInterval);
    }
}, 100);

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: Service worker file would need to be created separately
        // navigator.serviceWorker.register('/sw.js');
    });
}