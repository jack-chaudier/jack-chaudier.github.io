document.addEventListener('DOMContentLoaded', () => {
    // Remove preload class after page loads
    window.addEventListener('load', () => {
        document.body.classList.remove('preload');
    });

    // ===================================
    // Theme Management
    // ===================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    const getSavedTheme = () => localStorage.getItem('theme');
    const saveTheme = (theme) => localStorage.setItem('theme', theme);

    const getPreferredTheme = () => {
        const savedTheme = getSavedTheme();
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    };

    const updateThemeIcon = (theme) => {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        setTheme(newTheme);
        saveTheme(newTheme);
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    // Theme toggle click handler
    themeToggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!getSavedTheme()) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ===================================
    // Mobile Navigation
    // ===================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    const toggleMobileMenu = () => {
        const isOpen = navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', !isOpen);
        
        // Prevent body scroll when menu is open
        if (!isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    const closeMobileMenu = () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    };

    // Toggle mobile menu
    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ===================================
    // Smooth Scrolling
    // ===================================
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (!element) return;

        const navHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = element.offsetTop - navHeight - 20;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    };

    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') {
                smoothScroll(target);
            }
        });
    });

    // ===================================
    // Active Navigation Link
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    const updateActiveLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });

        // If at the top of the page, activate home link
        if (scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-link[href="#home"]')?.classList.add('active');
        }
    };

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('.navbar');
    
    const updateNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for lists
                if (entry.target.classList.contains('timeline-item') || 
                    entry.target.classList.contains('project-card')) {
                    const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.section, .timeline-item, .project-card, .skill-category, .activity-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================================
    // Skill Tooltips
    // ===================================
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(skill => {
        const level = skill.getAttribute('data-level');
        if (level) {
            skill.title = `Proficiency: ${level}`;
        }
    });

    // ===================================
    // Scroll Event Listeners
    // ===================================
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll);

    // ===================================
    // Window Resize Handler
    // ===================================
    let resizeTimer;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250);
    });

    // ===================================
    // Form Handling (if you add a contact form later)
    // ===================================
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form submitted');
    };

    // ===================================
    // Utility Functions
    // ===================================
    
    // Copy email to clipboard
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const email = link.href.replace('mailto:', '');
                
                navigator.clipboard.writeText(email).then(() => {
                    // Show temporary tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.textContent = 'Email copied!';
                    tooltip.style.cssText = `
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: var(--primary-color);
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 0.5rem;
                        z-index: 9999;
                        animation: fadeInUp 0.3s ease;
                    `;
                    document.body.appendChild(tooltip);
                    
                    setTimeout(() => {
                        tooltip.style.animation = 'fadeOutDown 0.3s ease';
                        setTimeout(() => tooltip.remove(), 300);
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy email:', err);
                });
            }
        });
    });

    // ===================================
    // Performance Monitoring
    // ===================================
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }

    // ===================================
    // Error Handling
    // ===================================
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });

    // ===================================
    // Service Worker Registration (optional)
    // ===================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered:', registration);
            }).catch(error => {
                console.log('SW registration failed:', error);
            });
        });
    }
});

// ===================================
// External Script Loading
// ===================================
window.addEventListener('load', () => {
    // Google Analytics or other analytics
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');
});