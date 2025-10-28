// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

// Toggle theme function
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ===== Mobile Navigation =====
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

// ===== Active Navigation Link =====
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

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// ===== Smooth Scroll =====
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

// ===== Snake Game Easter Egg =====
const snakeGameOverlay = document.getElementById('snake-game');
const closeGameBtn = document.querySelector('.close-game');
const startGameBtn = document.getElementById('start-game');
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

// Snake game variables
let gameRunning = false;
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

// Update high score display
highScoreElement.textContent = highScore;

// Easter egg trigger - press 's' three times quickly
let sKeyPresses = [];
const S_KEY_TIMEOUT = 1000; // 1 second

document.addEventListener('keydown', (e) => {
    // Easter egg detection
    if (e.key === 's' || e.key === 'S') {
        const now = Date.now();
        sKeyPresses.push(now);

        // Keep only recent presses
        sKeyPresses = sKeyPresses.filter(time => now - time < S_KEY_TIMEOUT);

        // If 's' was pressed 3 times within timeout, open game
        if (sKeyPresses.length >= 3) {
            openSnakeGame();
            sKeyPresses = [];
        }
    }

    // Game controls
    if (gameRunning && snakeGameOverlay.classList.contains('active')) {
        switch(e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                e.preventDefault();
                break;
        }
    }
});

function openSnakeGame() {
    snakeGameOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSnakeGame() {
    snakeGameOverlay.classList.remove('active');
    document.body.style.overflow = '';
    stopGame();
}

closeGameBtn.addEventListener('click', closeSnakeGame);

// Close game when clicking outside
snakeGameOverlay.addEventListener('click', (e) => {
    if (e.target === snakeGameOverlay) {
        closeSnakeGame();
    }
});

// Start game button
startGameBtn.addEventListener('click', () => {
    if (!gameRunning) {
        startGame();
    } else {
        stopGame();
        startGame();
    }
});

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    placeFood();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
    };

    // Make sure food doesn't spawn on snake
    const onSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    if (onSnake) {
        placeFood();
    }
}

function startGame() {
    initGame();
    gameRunning = true;
    startGameBtn.textContent = 'Restart Game';
    gameLoop = setInterval(updateGame, 100);
}

function stopGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    startGameBtn.textContent = 'Start Game';
}

function updateGame() {
    // Update direction
    direction = nextDirection;

    // Move snake
    const head = { x: snake[0].x, y: snake[0].y };

    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
    }

    // Check self collision
    const selfCollision = snake.some(segment => segment.x === head.x && segment.y === head.y);
    if (selfCollision) {
        gameOver();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;

        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }

        placeFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }

    draw();
}

function draw() {
    // Get current theme colors
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#1e293b' : '#f8fafc';
    const snakeColor = isDark ? '#3b82f6' : '#2563eb';
    const foodColor = isDark ? '#22d3ee' : '#06b6d4';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );

        // Draw eyes on head
        if (index === 0) {
            ctx.fillStyle = bgColor;
            const eyeSize = 3;
            const eyeOffset = 5;

            if (direction === 'right') {
                ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, segment.y * GRID_SIZE + 12, eyeSize, eyeSize);
            } else if (direction === 'left') {
                ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + 12, eyeSize, eyeSize);
            } else if (direction === 'up') {
                ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
            } else if (direction === 'down') {
                ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
            }
        }
    });

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function gameOver() {
    stopGame();

    // Show game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '18px Inter';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    if (score === highScore && score > 0) {
        ctx.fillStyle = '#22d3ee';
        ctx.fillText('New High Score!', canvas.width / 2, canvas.height / 2 + 50);
    }
}

// ===== Console Easter Egg =====
console.log(
    '%c👨‍💻 Jack Gaffney - Software Engineer',
    'font-size: 20px; font-weight: bold; color: #2563eb; padding: 10px 0;'
);
console.log(
    '%cInterested in my work?',
    'font-size: 14px; color: #475569; padding: 5px 0;'
);
console.log(
    '%cPress "s" three times quickly to play a secret game! 🎮',
    'font-size: 14px; color: #06b6d4; font-weight: bold; padding: 5px 0;'
);
console.log(
    '%cLet\'s connect: jackgaff@umich.edu',
    'font-size: 14px; color: #2563eb; padding: 5px 0;'
);

// ===== Scroll Animations =====
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
document.querySelectorAll('.timeline-item, .project-card, .skill-group, .activity-card').forEach(el => {
    observer.observe(el);
});

// ===== Parallax Effect on Hero =====
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            const scrollIndicator = document.querySelector('.scroll-indicator');

            if (heroContent && scrolled < window.innerHeight) {
                const opacity = 1 - (scrolled / window.innerHeight) * 0.5;
                heroContent.style.opacity = opacity;
            }

            if (scrollIndicator && scrolled > 100) {
                scrollIndicator.style.opacity = '0';
            } else if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
            }

            ticking = false;
        });

        ticking = true;
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
        htmlElement.setAttribute('data-theme', 'dark');
    }

    // Draw initial empty game board
    if (canvas && ctx) {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDark ? '#1e293b' : '#f8fafc';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
});
