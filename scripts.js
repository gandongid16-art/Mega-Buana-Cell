// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initStatusToko();
    initGaleri();
    initConsultForm();
    initBackToTop();
    initSmoothScroll();
    updateCopyrightYear();
});

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// STATUS TOKO (BUKA/TUTUP)
// ==========================================
function initStatusToko() {
    const statusIndicator = document.getElementById('statusToko');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');

    function updateStatus() {
        // Get current time in WIT (UTC+9)
        // Note: JavaScript Date uses local timezone, so we calculate WIT manually
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const witTime = new Date(utc + (3600000 * 9)); // WIT is UTC+9

        const hours = witTime.getHours();
        const minutes = witTime.getMinutes();
        const currentTime = hours + (minutes / 60);

        // Jam operasional: 10:00 - 23:00 WIT
        const openTime = 10; // 10:00
        const closeTime = 23; // 23:00

        if (currentTime >= openTime && currentTime < closeTime) {
            // BUKA
            statusIndicator.classList.add('open');
            statusIndicator.classList.remove('closed');
            statusText.textContent = 'Toko Saat Ini BUKA';
        } else {
            // TUTUP
            statusIndicator.classList.add('closed');
            statusIndicator.classList.remove('open');
            statusText.textContent = 'Toko Saat Ini TUTUP';
        }
    }

    // Update status immediately
    updateStatus();

    // Update every minute
    setInterval(updateStatus, 60000);
}

// ==========================================
// GALERI & LIGHTBOX
// ==========================================
function initGaleri() {
    const galeriItems = document.querySelectorAll('.galeri-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;

    // Open lightbox
    galeriItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const img = galeriItems[currentIndex].querySelector('img');
        const caption = galeriItems[currentIndex].querySelector('.galeri-overlay p');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption.textContent;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Previous image
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galeriItems.length) % galeriItems.length;
        openLightbox();
    });

    // Next image
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galeriItems.length;
        openLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galeriItems.length) % galeriItems.length;
            openLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galeriItems.length;
            openLightbox();
        }
    });
}

// ==========================================
// KONSULTASI FORM
// ==========================================
function initConsultForm() {
    const form = document.getElementById('consultForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const nama = document.getElementById('nama').value;
        const telepon = document.getElementById('telepon').value;
        const layanan = document.getElementById('layanan').value;
        const pesan = document.getElementById('pesan').value;

        // Create WhatsApp message
        const message = `Halo MEGA BUANA CELL, saya ingin konsultasi:%0A%0A` +
                       `Nama: ${encodeURIComponent(nama)}%0A` +
                       `Telepon: ${encodeURIComponent(telepon)}%0A` +
                       `Layanan: ${encodeURIComponent(layanan)}%0A` +
                       `Pesan: ${encodeURIComponent(pesan)}`;

        // Open WhatsApp
        window.open(`https://wa.me/6282288573322?text=${message}`, '_blank');

        // Reset form
        form.reset();

        // Show success message
        alert('Terima kasih! Anda akan diarahkan ke WhatsApp.');
    });
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70; // Adjust for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// UPDATE COPYRIGHT YEAR
// ==========================================
function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.layanan-card, .galeri-item, .info-card, .section-header');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Preload critical resources
window.addEventListener('load', () => {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c MEGA BUANA CELL ', 'background: #dc2626; color: #fff; padding: 10px 20px; font-size: 20px; font-weight: bold;');
console.log('%c Website Servis HP Profesional ', 'background: #eab308; color: #000; padding: 5px 10px; font-size: 14px;');
console.log('Hubungi kami: +62 822-8857-3322');