/* =========================================================================
   jack-chaudier.github.io — theme toggle and footer year. Nothing else.
   ========================================================================= */
(function () {
    "use strict";

    var root = document.documentElement;
    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var COLORS = { light: "#f4ede1", dark: "#121110" };

    function readStoredTheme() {
        try {
            var stored = localStorage.getItem("jg-theme");
            return stored === "light" || stored === "dark" ? stored : null;
        } catch (e) {
            return null;
        }
    }

    function writeStoredTheme(theme) {
        try {
            localStorage.setItem("jg-theme", theme);
        } catch (e) {
            /* storage unavailable */
        }
    }

    function preferredTheme() {
        return readStoredTheme() || (darkQuery.matches ? "dark" : "light");
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        var dark = theme === "dark";
        var toggles = document.querySelectorAll(".theme-toggle");
        for (var i = 0; i < toggles.length; i++) {
            toggles[i].setAttribute("aria-pressed", String(dark));
            toggles[i].setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        }
        var metas = document.querySelectorAll('meta[name="theme-color"]');
        for (var j = 0; j < metas.length; j++) {
            metas[j].setAttribute("content", COLORS[theme]);
        }
    }

    function toggleTheme() {
        var current = root.getAttribute("data-theme") || preferredTheme();
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        writeStoredTheme(next);
    }

    applyTheme(root.getAttribute("data-theme") || preferredTheme());

    var toggles = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < toggles.length; i++) {
        toggles[i].addEventListener("click", toggleTheme);
    }

    if (typeof darkQuery.addEventListener === "function") {
        darkQuery.addEventListener("change", function (e) {
            if (readStoredTheme()) return;
            applyTheme(e.matches ? "dark" : "light");
        });
    }

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
