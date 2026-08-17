/* =========================================================
   Jack Gaffney — portfolio script
   Theme toggle, footer year, and the writing-index filter.
   Nothing else; every page works without it.
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

    /* ================= WRITING INDEX FILTER ================= */
    const filters = document.getElementById("writingFilters");
    const index = document.getElementById("writingIndex");

    if (filters && index) {
        const buttons = Array.prototype.slice.call(filters.querySelectorAll("[data-filter]"));
        const items = Array.prototype.slice.call(index.querySelectorAll(".toc-item"));

        function pad(n) {
            return (n < 10 ? "0" : "") + n;
        }

        function applyFilter(kind) {
            const visible = [];
            items.forEach((item) => {
                const match = kind === "all" || item.getAttribute("data-kind") === kind;
                item.hidden = !match;
                item.classList.remove("is-first", "is-last");
                if (match) visible.push(item);
            });
            visible.forEach((item, i) => {
                const num = item.querySelector(".toc-num");
                if (num) num.textContent = pad(i + 1);
            });
            if (visible.length) {
                visible[0].classList.add("is-first");
                visible[visible.length - 1].classList.add("is-last");
            }
            buttons.forEach((btn) => {
                btn.setAttribute("aria-pressed", String(btn.getAttribute("data-filter") === kind));
            });
        }

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => applyFilter(btn.getAttribute("data-filter")));
        });
    }
})();
