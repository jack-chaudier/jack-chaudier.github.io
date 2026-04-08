const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function readStoredTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (error) {
        return null;
    }
}

function writeStoredTheme(theme) {
    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        // Ignore storage errors (for example private browsing restrictions).
    }
}

function preferredTheme() {
    const storedTheme = readStoredTheme();
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return darkQuery.matches ? "dark" : "light";
}

function applyTheme(theme) {
    html.setAttribute("data-theme", theme);

    if (!themeToggle) {
        return;
    }

    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
    );
}

function setTheme(theme) {
    // Use the View Transitions API for a smooth cross-fade when supported.
    if (
        typeof document.startViewTransition !== "function" ||
        motionQuery.matches
    ) {
        applyTheme(theme);
        return;
    }

    document.startViewTransition(() => applyTheme(theme));
}

applyTheme(preferredTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme =
            html.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        setTheme(nextTheme);
        writeStoredTheme(nextTheme);
    });
}

// Keep the theme in sync with the OS when the user hasn't chosen manually.
function handleSystemThemeChange(event) {
    if (readStoredTheme()) {
        return;
    }
    setTheme(event.matches ? "dark" : "light");
}

if (typeof darkQuery.addEventListener === "function") {
    darkQuery.addEventListener("change", handleSystemThemeChange);
} else if (typeof darkQuery.addListener === "function") {
    darkQuery.addListener(handleSystemThemeChange);
}

// Reveal entries as they scroll into view (progressive enhancement).
const entryNodes = document.querySelectorAll(".entry");

if (entryNodes.length > 0) {
    if (motionQuery.matches || !("IntersectionObserver" in window)) {
        entryNodes.forEach((node) => node.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver(
            (observed) => {
                observed.forEach((item) => {
                    if (item.isIntersecting) {
                        item.target.classList.add("is-visible");
                        observer.unobserve(item.target);
                    }
                });
            },
            { rootMargin: "0px 0px -48px 0px", threshold: 0.05 }
        );
        entryNodes.forEach((node) => observer.observe(node));
    }
}

const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}
