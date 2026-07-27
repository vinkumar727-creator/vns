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
// Sticky Header on Scroll (rAF-throttled)
// ============================================
let lastScrollTop = 0;
let scrollTicking = false;
let scrollIdleTimer = null;

const updateScrollUI = () => {
    const scrollTop = window.scrollY || 0;

    document.body.classList.add('is-scrolling');
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 140);

    if (header) {
        header.classList.toggle('scrolled', scrollTop > 50);
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle('visible', scrollTop > 500);
    }

    lastScrollTop = scrollTop;
    scrollTicking = false;
};

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateScrollUI);
    }
}, { passive: true });

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
// Initialize animate on scroll with staggered delays
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });
    
    elements.forEach((element, index) => {
        const parent = element.closest('.stats-grid, .features-grid, .testimonials-grid');
        const staggerIndex = parent
            ? Array.from(parent.children).indexOf(element)
            : index % 6;
        element.style.setProperty('--scroll-delay', `${staggerIndex * 45}ms`);
        observer.observe(element);
    });
};

// Initialize animate on scroll
animateOnScroll();

// ============================================
// Logo Mark Wrapper (blends PNG white bg)
// ============================================
const initLogoMarks = () => {
    document.querySelectorAll('.logo-img, .footer-logo-img').forEach(img => {
        if (img.closest('.logo-mark')) return;

        const isFooter = img.classList.contains('footer-logo-img');
        const wrap = document.createElement('span');
        wrap.className = isFooter ? 'logo-mark logo-mark-footer' : 'logo-mark';
        wrap.setAttribute('aria-hidden', isFooter ? 'true' : 'true');
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
    });
};

initLogoMarks();

// ============================================
const initHeroEffects = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const run = () => {
        document.querySelectorAll('.hero').forEach(hero => {
            if (!reduced && !isMobile && !hero.querySelector('.hero-glow-1')) {
                ['hero-glow-1', 'hero-glow-2'].forEach(cls => {
                    const glow = document.createElement('div');
                    glow.className = `hero-glow ${cls}`;
                    glow.setAttribute('aria-hidden', 'true');
                    hero.insertBefore(glow, hero.firstChild);
                });
            }

            if (!reduced && !isMobile && !hero.querySelector('.hero-particles')) {
                const container = document.createElement('div');
                container.className = 'hero-particles';
                container.setAttribute('aria-hidden', 'true');

                for (let i = 0; i < 5; i++) {
                    const particle = document.createElement('span');
                    particle.className = 'hero-particle';
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.animationDuration = `${12 + Math.random() * 10}s`;
                    particle.style.animationDelay = `${Math.random() * 6}s`;
                    particle.style.width = particle.style.height = `${2 + Math.random() * 2}px`;
                    container.appendChild(particle);
                }

                hero.insertBefore(container, hero.firstChild);
            }
        });
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(run, { timeout: 2000 });
    } else {
        setTimeout(run, 400);
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const stats = document.querySelector('.stats-section');
            (stats || document.querySelector('.intro-section'))?.scrollIntoView({ behavior: 'smooth' });
        });
    }
};

initHeroEffects();

// ============================================
// Premium Card Tilt Effect
// ============================================
const initCardTilt = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const setup = () => {
        document.querySelectorAll('.feature-card').forEach(card => {
            let tiltRaf = null;

            card.addEventListener('mousemove', (e) => {
                if (tiltRaf) return;
                tiltRaf = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
                    tiltRaf = null;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                if (tiltRaf) {
                    cancelAnimationFrame(tiltRaf);
                    tiltRaf = null;
                }
                card.style.transform = '';
            });
        });
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(setup, { timeout: 2500 });
    } else {
        setTimeout(setup, 600);
    }
};

initCardTilt();

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

// Load weather after first paint / idle to avoid blocking TTI
const scheduleWeather = () => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadWeather(), { timeout: 3000 });
    } else {
        setTimeout(loadWeather, 800);
    }
};

if (document.readyState === 'complete') {
    scheduleWeather();
} else {
    window.addEventListener('load', scheduleWeather, { once: true });
}

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
                // WhatsApp connect disabled
                // case 'whatsapp':
                //     shareUrl = `https://wa.me/?text=${title}%20${url}`;
                //     break;
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
    // Disabled — duplicate of initCardTilt; caused competing transforms
};

// ============================================
// Parallax Scroll Effect for Hero Section
// ============================================
const initParallaxEffect = () => {
    // Disabled — translating .hero on scroll caused visible scroll jank
};

// ============================================
// Staggered Animation on Scroll
// ============================================
const initStaggeredAnimation = () => {
    // Disabled — duplicate IntersectionObserver conflicted with animateOnScroll
};

// ============================================
// Mouse Cursor Trail Effect (Premium)
// ============================================
const initCursorTrail = () => {
    // Disabled — CSS variable updates on mousemove are unnecessary during scroll
};

// ============================================
// Smooth Scroll Reveal with Different Effects
// ============================================
const initAdvancedScrollReveal = () => {
    // Disabled — re-applying slideInUp animations fought CSS transitions and caused flicker
};

// Initialize all premium animations
document.addEventListener('DOMContentLoaded', () => {
    // Heavy scroll effects intentionally left off for smooth scrolling
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
