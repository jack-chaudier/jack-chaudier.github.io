const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

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

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
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

applyTheme(preferredTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);
        writeStoredTheme(nextTheme);
    });
}

const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}
