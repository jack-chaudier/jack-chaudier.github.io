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
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for lists
                if (entry.target.classList.contains('timeline-item') || 
                    entry.target.classList.contains('project-card') ||
                    entry.target.classList.contains('skill-category') ||
                    entry.target.classList.contains('activity-card')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.section, .timeline-item, .project-card, .skill-category, .activity-card, .about-content, .contact-content'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // ===================================
    // Skill Tooltips
    // ===================================
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(skill => {
        const level = skill.getAttribute('data-level');
        if (level) {
            skill.title = `Proficiency: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
        }
    });

    // ===================================
    // Project Card Hover Effect
    // ===================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
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
    // Copy Email to Clipboard
    // ===================================
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
                        background: var(--primary);
                        color: white;
                        padding: 0.75rem 1.5rem;
                        border-radius: var(--radius-full);
                        z-index: 9999;
                        animation: fadeInUp 0.3s ease;
                        box-shadow: var(--shadow-lg);
                    `;
                    document.body.appendChild(tooltip);
                    
                    // Add fadeInUp animation
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes fadeInUp {
                            from {
                                opacity: 0;
                                transform: translate(-50%, 10px);
                            }
                            to {
                                opacity: 1;
                                transform: translate(-50%, 0);
                            }
                        }
                        @keyframes fadeOutDown {
                            from {
                                opacity: 1;
                                transform: translate(-50%, 0);
                            }
                            to {
                                opacity: 0;
                                transform: translate(-50%, 10px);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    setTimeout(() => {
                        tooltip.style.animation = 'fadeOutDown 0.3s ease';
                        setTimeout(() => {
                            tooltip.remove();
                            style.remove();
                        }, 300);
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy email:', err);
                });
            }
        });
    });

    // ===================================
    // Smooth Page Load
    // ===================================
    window.addEventListener('load', () => {
        // Trigger animations for hero section
        document.querySelectorAll('.animate-in').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });

    // ===================================
    // Parallax Effect for Hero
    // ===================================
    let heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // ===================================
    // Performance Monitoring
    // ===================================
    if ('performance' in window && 'getEntriesByType' in window.performance) {
        window.addEventListener('load', () => {
            // Use the modern Performance API
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                const navigationEntry = navigationEntries[0];
                const pageLoadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
                console.log(`Page load time: ${Math.round(pageLoadTime)}ms`);
            }
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
});