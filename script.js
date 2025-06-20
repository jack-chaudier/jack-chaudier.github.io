// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const icon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateIcon(currentTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcon(theme);
});

function updateIcon(theme) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const hamburgerIcon = hamburger.querySelector('i');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburgerIcon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerIcon.className = 'fas fa-bars';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting and header effects
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const header = document.querySelector('header');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    // Header background on scroll
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Active section highlighting
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Animate skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(40px)';
        category.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        category.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(category);
    });
    
    // Animate education card
    const educationCard = document.querySelector('.education-card');
    if (educationCard) {
        educationCard.style.opacity = '0';
        educationCard.style.transform = 'translateY(40px)';
        educationCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(educationCard);
    }
    
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(title);
    });
    
    // Animate about content
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.style.opacity = '0';
        aboutContent.style.transform = 'translateY(30px)';
        aboutContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(aboutContent);
    }
});

// Parallax effect for hero background
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        hero.querySelector('.hero-content').style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// Mouse move effect for hero gradient
document.addEventListener('mousemove', (e) => {
    const heroSection = document.querySelector('.hero');
    if (heroSection && window.innerWidth > 768) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const heroGradient = heroSection.querySelector('::before');
        if (heroGradient) {
            heroSection.style.setProperty('--mouse-x', `${x * 100}%`);
            heroSection.style.setProperty('--mouse-y', `${y * 100}%`);
        }
    }
});

// Smooth hover effects for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.setProperty('--mouse-x', `50%`);
            this.style.setProperty('--mouse-y', `50%`);
        });
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.contact-info a, .project-links a').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Typewriter effect for hero title
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.visibility = 'visible';
    
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveNav();
    });
}, { passive: true });