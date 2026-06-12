/* =========================================================
   Jack Gaffney — portfolio script
   Theme toggle + footer year. Nothing else.
   ========================================================= */
(function () {
    "use strict";

    const root = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /* ================= THEME ================= */
    function readStoredTheme() {
        try {
            return localStorage.getItem("jg-theme");
        } catch (e) {
            return null;
        }
    }
    function writeStoredTheme(theme) {
        try {
            localStorage.setItem("jg-theme", theme);
        } catch (e) {
            /* private mode, etc — ignore */
        }
    }
    function preferredTheme() {
        const stored = readStoredTheme();
        if (stored === "light" || stored === "dark") return stored;
        return darkQuery.matches ? "dark" : "light";
    }
    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        const toggle = document.getElementById("themeToggle");
        if (toggle) {
            const dark = theme === "dark";
            toggle.setAttribute("aria-pressed", String(dark));
            toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        }
    }
    function toggleTheme() {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        writeStoredTheme(next);
    }

    applyTheme(preferredTheme());

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

    if (typeof darkQuery.addEventListener === "function") {
        darkQuery.addEventListener("change", (e) => {
            if (readStoredTheme()) return;
            applyTheme(e.matches ? "dark" : "light");
        });
    }

    /* ================= YEAR ================= */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
