// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Toggle theme function
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Add a smooth transition effect
    htmlElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// Add event listener to theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const isDarkTheme = htmlElement.getAttribute('data-theme') === 'dark';

    if (window.scrollY > 50) {
        if (isDarkTheme) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        navbar.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
    } else {
        if (isDarkTheme) {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        }
        navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.08)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.timeline-item, .solution-card, .skill-category-pro, .approach-item, .competency-item').forEach(el => {
    observer.observe(el);
});

// Smooth Scroll for Safari
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic Year in Footer
const footer = document.querySelector('.footer p');
if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} Jack Gaffney. All rights reserved.`;
}

// Animate metric bars on scroll
const metricBars = document.querySelectorAll('.metric-fill, .skill-bar-fill');

const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger the width animation
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
        }
    });
}, { threshold: 0.5 });

metricBars.forEach(bar => {
    barObserver.observe(bar);
});

// Add hover effects to cards
document.querySelectorAll('.solution-card, .timeline-content, .approach-item, .competency-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-6px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Console Easter Egg
console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #1e40af;');
console.log('%cThanks for checking out my portfolio!', 'font-size: 16px; color: #475569;');
console.log('%cInterested in Forward Deployed Software Engineering? Let\'s connect!', 'font-size: 14px; color: #059669;');
console.log('%c📧 jackgaff@umich.edu', 'font-size: 14px; color: #1e40af; font-weight: bold;');

// Add subtle parallax effect to hero section
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroText = document.querySelector('.hero-text');
            const heroVisual = document.querySelector('.hero-visual');

            if (heroText && scrolled < window.innerHeight) {
                heroText.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroText.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }

            if (heroVisual && scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            ticking = false;
        });

        ticking = true;
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Track scroll depth for analytics (optional)
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > maxScroll) {
        maxScroll = Math.round(scrollPercent);
        // You could send this to analytics here
        if (maxScroll % 25 === 0) { // Log at 25%, 50%, 75%, 100%
            console.log(`User reached ${maxScroll}% of page`);
        }
    }
});

// Prefetch links on hover for faster navigation
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const url = this.href;
        if (!document.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.href = url;
            document.head.appendChild(prefetch);
        }
    });
});

// Add loading state to resume download button
const resumeBtn = document.querySelector('.resume-cta .btn-primary');
if (resumeBtn) {
    resumeBtn.addEventListener('click', function(e) {
        // Show a subtle feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}
