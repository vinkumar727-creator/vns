// ============================================
// MyBanaras - Main JavaScript File
// ============================================

// ============================================
// DOM Elements
// ============================================
const header = document.getElementById('header');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const scrollToTopBtn = document.getElementById('scrollToTop');
const newsletterForm = document.getElementById('newsletterForm');

// ============================================
// Sticky Header on Scroll
// ============================================
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // Add scrolled class for shrinking effect
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (scrollTop > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
});

// ============================================
// Mobile Menu Toggle
// ============================================
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// Mobile dropdown functionality
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// ============================================
// Scroll to Top Button
// ============================================
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Animate on Scroll
// ============================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Initialize animate on scroll
animateOnScroll();

// ============================================
// Counter Animation for Stats
// ============================================
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
};

// Initialize counter animation
animateCounters();

// ============================================
// Weather Widget
// ============================================
const loadWeather = async () => {
    const weatherWidget = document.getElementById('weatherWidget');
    
    if (!weatherWidget) return;
    
    try {
        // Using Open-Meteo API (no API key required)
        const lat = 25.3176; // Varanasi latitude
        const lon = 82.9739; // Varanasi longitude
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FKolkata`
        );
        
        const data = await response.json();
        
        const temp = Math.round(data.current.temperature_2m);
        const humidity = data.current.relative_humidity_2m;
        const weatherCode = data.current.weather_code;
        
        // Weather code to description mapping
        const weatherDescriptions = {
            0: 'Clear Sky',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light Drizzle',
            53: 'Drizzle',
            55: 'Heavy Drizzle',
            61: 'Light Rain',
            63: 'Rain',
            65: 'Heavy Rain',
            71: 'Light Snow',
            73: 'Snow',
            75: 'Heavy Snow',
            95: 'Thunderstorm'
        };
        
        const weatherIcons = {
            0: '☀️',
            1: '🌤️',
            2: '⛅',
            3: '☁️',
            45: '🌫️',
            48: '🌫️',
            51: '🌦️',
            53: '🌦️',
            55: '🌧️',
            61: '🌧️',
            63: '🌧️',
            65: '⛈️',
            71: '🌨️',
            73: '🌨️',
            75: '❄️',
            95: '⛈️'
        };
        
        const description = weatherDescriptions[weatherCode] || 'Unknown';
        const icon = weatherIcons[weatherCode] || '🌤️';
        
        weatherWidget.innerHTML = `
            <div class="weather-content">
                <div>
                    <div class="weather-icon">${icon}</div>
                </div>
                <div>
                    <h3 style="margin-bottom: 0.5rem; color: var(--dark-brown);">Varanasi Weather</h3>
                    <div class="weather-temp">${temp}°C</div>
                </div>
                <div style="text-align: left;">
                    <div class="weather-desc">${description}</div>
                    <p style="margin-top: 0.5rem; color: var(--gray-medium);">
                        <i class="fas fa-tint"></i> Humidity: ${humidity}%
                    </p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Weather API Error:', error);
        weatherWidget.innerHTML = `
            <div style="color: var(--gray-medium);">
                <i class="fas fa-cloud"></i> Weather information unavailable
            </div>
        `;
    }
};

// Load weather on page load
loadWeather();

// ============================================
// Newsletter Form
// ============================================
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Show success message
        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        newsletterForm.reset();
        
        // In production, you would send this to your email marketing service
        console.log('Newsletter subscription:', email);
    });
}

// ============================================
// Cookie Consent
// ============================================
const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    const cookieBanner = document.getElementById('cookieConsent');
    if (cookieBanner) {
        cookieBanner.style.display = 'none';
    }
};

// Check if cookies already accepted
window.addEventListener('load', () => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    const cookieBanner = document.getElementById('cookieConsent');
    
    if (cookieConsent === 'accepted' && cookieBanner) {
        cookieBanner.style.display = 'none';
    }
});

// Make acceptCookies function globally available
window.acceptCookies = acceptCookies;

// ============================================
// Visitor Counter
// ============================================
const updateVisitorCount = () => {
    const visitorCountElement = document.getElementById('visitorCount');
    
    if (!visitorCountElement) return;
    
    // Get current count from localStorage
    let count = localStorage.getItem('visitorCount');
    
    if (!count) {
        // Generate a random starting count (between 10000-50000)
        count = Math.floor(Math.random() * 40000) + 10000;
    } else {
        count = parseInt(count);
    }
    
    // Increment by 1-3 randomly
    count += Math.floor(Math.random() * 3) + 1;
    
    // Save updated count
    localStorage.setItem('visitorCount', count);
    
    // Display formatted count
    visitorCountElement.textContent = count.toLocaleString();
};

// Update visitor count on page load
updateVisitorCount();

// ============================================
// Image Lazy Loading (for older browsers)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// Page Load Performance
// ============================================
window.addEventListener('load', () => {
    // Remove loading class if present
    document.body.classList.remove('loading');
    
    // Log page load time for performance monitoring
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// ============================================
// Contact Form Handler (if present)
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for contacting us! We will get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
        
        console.log('Contact form submitted:', data);
    });
}

// ============================================
// Search Functionality (if present)
// ============================================
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = searchForm.querySelector('input[type="search"]').value;
        
        // Redirect to search results page or filter content
        window.location.href = `blog.html?search=${encodeURIComponent(searchQuery)}`;
    });
}

// ============================================
// Gallery Lightbox (if present)
// ============================================
const initGalleryLightbox = () => {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    if (galleryImages.length === 0) return;
    
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close lightbox
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => {
                lightbox.remove();
                document.body.style.overflow = '';
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });
        });
    });
};

// Initialize gallery lightbox
initGalleryLightbox();

// ============================================
// Social Share Buttons
// ============================================
const initSocialShare = () => {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = button.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
};

// Initialize social share
initSocialShare();

// ============================================
// Print Functionality
// ============================================
const printButtons = document.querySelectorAll('.print-button');
printButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.print();
    });
});

// ============================================
// Back Button
// ============================================
const backButtons = document.querySelectorAll('.back-button');
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.history.back();
    });
});

// ============================================
// Console Welcome Message
// ============================================
console.log('%c🕉️ MyBanaras.com', 'font-size: 24px; font-weight: bold; color: #FF9933;');
console.log('%cWelcome to the spiritual capital of India!', 'font-size: 14px; color: #C86234;');
console.log('%cExplore the sacred ghats, ancient temples, and timeless traditions of Banaras.', 'font-size: 12px; color: #666;');

// ============================================
// Premium Card Tilt Effect (Mouse Move Animation)
// ============================================
const initCardTiltEffect = () => {
    const cards = document.querySelectorAll('.feature-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
};

// ============================================
// Parallax Scroll Effect for Hero Section
// ============================================
const initParallaxEffect = () => {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    // Skip parallax effect on blog page as it interferes with background image
    if (window.location.pathname.includes('blog.html')) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        // Move hero background slower than scroll
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
};

// ============================================
// Staggered Animation on Scroll
// ============================================
const initStaggeredAnimation = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.animation = `slideInUp 0.6s ease forwards`;
                }, index * 100); // Stagger by 100ms
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
};

// ============================================
// Mouse Cursor Trail Effect (Premium)
// ============================================
const initCursorTrail = () => {
    const cards = document.querySelectorAll('.feature-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create glow effect at cursor position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};

// ============================================
// Smooth Scroll Reveal with Different Effects
// ============================================
const initAdvancedScrollReveal = () => {
    const revealElements = document.querySelectorAll('.animate-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add random delay for more organic feel
                const delay = Math.random() * 200;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Add bounce effect
                    entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                }, delay);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
};

// Initialize all premium animations
document.addEventListener('DOMContentLoaded', () => {
    initCardTiltEffect();
    initParallaxEffect();
    initStaggeredAnimation();
    initCursorTrail();
    initAdvancedScrollReveal();
});

// ============================================
// Export functions for use in other scripts
// ============================================
window.MyBanaras = {
    animateOnScroll,
    loadWeather,
    updateVisitorCount,
    acceptCookies,
    initCardTiltEffect,
    initParallaxEffect,
    initStaggeredAnimation
};
