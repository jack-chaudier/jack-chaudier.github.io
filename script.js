/* =========================================================
   Jack Gaffney — portfolio script
   ========================================================= */
(function () {
    "use strict";

    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    function setTheme(theme, evt) {
        const supportsVT = typeof document.startViewTransition === "function";
        if (!supportsVT || motionQuery.matches) {
            applyTheme(theme);
            return;
        }
        if (evt && evt.currentTarget) {
            const rect = evt.currentTarget.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const maxR = Math.hypot(
                Math.max(cx, window.innerWidth - cx),
                Math.max(cy, window.innerHeight - cy)
            );
            root.style.setProperty("--wipe-x", cx + "px");
            root.style.setProperty("--wipe-y", cy + "px");
            root.style.setProperty("--wipe-r", maxR + "px");
        }
        document.startViewTransition(() => applyTheme(theme));
    }
    function toggleTheme(evt) {
        const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        setTheme(next, evt);
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

    /* ================= WORK EXPAND ================= */
    document.querySelectorAll(".work-row").forEach((row) => {
        const d = row.dataset.detail;
        if (!d) return;
        const det = document.createElement("div");
        det.className = "detail";
        det.textContent = d;
        row.appendChild(det);

        function toggle() {
            const open = row.classList.toggle("open");
            row.setAttribute("aria-expanded", String(open));
        }
        row.addEventListener("click", toggle);
        row.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
            }
        });
    });

    /* ================= PROJECT VIZ: MIRAGE-MCP ================= */
    (function () {
        const el = document.getElementById("viz-mcp");
        if (!el) return;
        const w = 400;
        const h = 120;
        const nodes = [
            { x: 60, y: 60, r: 10, c: true, label: "agent" },
            { x: 160, y: 30, r: 7, label: "tool" },
            { x: 170, y: 90, r: 7, label: "tool" },
            { x: 260, y: 50, r: 7, label: "mcp" },
            { x: 270, y: 95, r: 7, label: "mcp" },
            { x: 350, y: 60, r: 9, c: true, label: "repo" }
        ];
        const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [1, 4]];
        let svg = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`;
        edges.forEach(([a, b]) => {
            svg += `<line class="edge" x1="${nodes[a].x}" y1="${nodes[a].y}" x2="${nodes[b].x}" y2="${nodes[b].y}">`;
            if (!motionQuery.matches) {
                svg += `<animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.2s" repeatCount="indefinite"/>`;
            }
            svg += `</line>`;
        });
        nodes.forEach((n) => {
            svg += `<circle class="node ${n.c ? "c" : ""}" cx="${n.x}" cy="${n.y}" r="${n.r}"/>`;
            svg += `<text class="lbl" x="${n.x}" y="${n.y + n.r + 10}" text-anchor="middle">${n.label}</text>`;
        });
        svg += `</svg>`;
        el.innerHTML = svg;
    })();

    /* ================= PROJECT VIZ: WAVEFORM ================= */
    (function () {
        const w = document.getElementById("viz-wave");
        if (!w) return;
        const N = 60;
        for (let i = 0; i < N; i++) {
            const s = document.createElement("span");
            const h = 10 + Math.abs(Math.sin(i * 0.4)) * 48 + Math.random() * 8;
            s.style.setProperty("--h", h + "px");
            s.style.animationDelay = i * 0.04 + "s";
            w.appendChild(s);
        }
    })();

    /* ================= PROJECT VIZ: PHONE BARS ================= */
    (function () {
        const el = document.getElementById("viz-phone-bars");
        if (!el) return;
        const heights = [18, 30, 22, 38, 26, 14, 34, 24, 30, 20];
        heights.forEach((h, i) => {
            const s = document.createElement("span");
            s.style.setProperty("--h", h + "px");
            s.style.height = "6px";
            s.style.animationDelay = i * 0.06 + "s";
            el.appendChild(s);
        });
    })();

    /* ================= PROJECT VIZ: PHOTO GRID ================= */
    (function () {
        const g = document.getElementById("viz-photogrid");
        if (!g) return;
        for (let i = 0; i < 36; i++) {
            const d = document.createElement("div");
            d.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
            g.appendChild(d);
        }
    })();

    /* ================= PROJECT VIZ: KERNEL MEMORY MAP ================= */
    (function () {
        const el = document.getElementById("viz-kernel");
        if (!el) return;
        // 32 cols × ~12 rows ≈ 384 cells
        const cells = 384;
        // seed "allocated" regions for a memory-map feel
        const regions = [
            { start: 0, len: 24, a: 85 }, // kernel text
            { start: 28, len: 14, a: 55 }, // heap
            { start: 48, len: 36, a: 30 },
            { start: 96, len: 12, a: 70 },
            { start: 140, len: 22, a: 45 },
            { start: 180, len: 40, a: 25 },
            { start: 240, len: 18, a: 65 },
            { start: 280, len: 30, a: 40 },
            { start: 330, len: 14, a: 75 }
        ];
        const alpha = new Array(cells).fill(0);
        regions.forEach((r) => {
            for (let i = r.start; i < r.start + r.len && i < cells; i++) alpha[i] = r.a;
        });
        for (let i = 0; i < cells; i++) {
            const d = document.createElement("div");
            const a = alpha[i] + Math.floor(Math.random() * 10);
            d.style.setProperty("--a", a + "%");
            el.appendChild(d);
        }
    })();

    /* ================= PROJECT VIZ: ENGINE ================= */
    (function () {
        const el = document.getElementById("viz-engine");
        if (!el) return;
        const fpsEl = el.querySelector(".fps");
        const SPRITES = motionQuery.matches ? 0 : 22;
        const sprites = [];
        for (let i = 0; i < SPRITES; i++) {
            const s = document.createElement("span");
            s.className = "sprite";
            const x = Math.random() * 0.9;
            const y = Math.random() * 0.7;
            s.style.left = x * 100 + "%";
            s.style.top = y * 100 + "%";
            s.style.opacity = 0.3 + Math.random() * 0.7;
            s.dataset.vx = String((Math.random() - 0.5) * 0.6);
            s.dataset.vy = String((Math.random() - 0.5) * 0.6);
            s.dataset.x = String(x);
            s.dataset.y = String(y);
            el.appendChild(s);
            sprites.push(s);
        }
        if (!SPRITES) return;

        let last = performance.now();
        function loop(now) {
            const dt = (now - last) / 16.666;
            last = now;
            sprites.forEach((s) => {
                let x = parseFloat(s.dataset.x) + parseFloat(s.dataset.vx) * 0.008 * dt;
                let y = parseFloat(s.dataset.y) + parseFloat(s.dataset.vy) * 0.008 * dt;
                if (x < 0 || x > 0.96) {
                    s.dataset.vx = String(-parseFloat(s.dataset.vx));
                    x = Math.max(0, Math.min(0.96, x));
                }
                if (y < 0 || y > 0.86) {
                    s.dataset.vy = String(-parseFloat(s.dataset.vy));
                    y = Math.max(0, Math.min(0.86, y));
                }
                s.dataset.x = String(x);
                s.dataset.y = String(y);
                s.style.left = x * 100 + "%";
                s.style.top = y * 100 + "%";
            });
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    })();

    /* ================= TERMINAL ================= */
    const term = document.getElementById("term");
    const termBody = document.getElementById("termBody");
    const termInput = document.getElementById("termInput");
    const termClose = document.getElementById("termClose");

    function openTerm() {
        if (!term) return;
        term.classList.add("on");
        setTimeout(() => termInput && termInput.focus(), 80);
    }
    function closeTerm() {
        if (!term) return;
        term.classList.remove("on");
    }
    function termLog(html) {
        if (!termBody) return;
        const p = document.createElement("p");
        p.className = "line";
        p.innerHTML = html;
        termBody.appendChild(p);
        termBody.scrollTop = termBody.scrollHeight;
    }
    function escapeHTML(s) {
        return s.replace(/[<>&"']/g, (c) =>
            ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c])
        );
    }

    const COMMANDS = {
        help: () => "available: about · projects · work · skills · contact · theme · whoami · matrix · joke · clear · exit",
        about: () =>
            `jack gaffney. cs senior @ umich, graduating may 2026.
builds ai-native backends & real-time voice pipelines.
bias: ship > perfect. values: simple systems, good typography, long runs.`,
        projects: () =>
            `mirage-mcp   — MCP server for consistent agentic coding
tether       — real-time voice companion (go, bedrock)
vulcanai     — multimodal construction reports (fastapi, llama)
pgai         — low-latency phone voice bot (nova sonic, twilio)
ocean-linux  — x86_64 microkernel (c11, limine)
fr-ocean     — 2d c++17 engine, 16ms budget`,
        work: () =>
            `2025  quantum opus     — full-stack swe intern (go · next · postgres)
2024  renewit decking  — carpenter & logistics lead
2022  dts enterprises  — engineering intern (cad)`,
        skills: () =>
            `python · typescript · go · swift · rust · c++ · c · lua · sql
fastapi · next · postgres · docker · websockets · aws bedrock
llm pipelines · mcp · multimodal · vision · transcription`,
        contact: () =>
            `email: jackgaff@umich.edu
gh:    github.com/jack-chaudier
li:    linkedin.com/in/jackgaffney23
phone: (231) 675-9844`,
        theme: (arg) => {
            const t = (arg || "").trim();
            if (t === "light" || t === "dark") {
                applyTheme(t);
                writeStoredTheme(t);
                return "theme → " + t;
            }
            return "usage: theme light|dark";
        },
        whoami: () => "guest@jackgaffney.dev",
        sudo: () => '<span style="color:var(--accent)">nice try.</span>',
        matrix: () => {
            toggleRain();
            return "reticulating splines…";
        },
        joke: () => {
            const j = [
                "there are 10 types of people. those who understand binary, and those who don't.",
                "a sql query walks into a bar, sees two tables, asks: may i join you?",
                "why did the dev go broke? he used up all his cache.",
                "i'd tell you a udp joke but you might not get it.",
                "the best thing about a boolean is even if you're wrong, you're only off by a bit."
            ];
            return j[Math.floor(Math.random() * j.length)];
        },
        clear: () => {
            if (termBody) termBody.innerHTML = "";
            return "";
        },
        exit: () => {
            closeTerm();
            return "";
        },
        ls: () => "about/  projects/  work/  skills/  contact.txt  secrets.⊕",
        cat: (a) =>
            a === "secrets.⊕"
                ? "try: ↑ ↑ ↓ ↓ ← → ← → b a"
                : a
                ? "cat: " + escapeHTML(a) + ": no such file"
                : "usage: cat <file>",
        echo: (a) => (a ? escapeHTML(a) : "")
    };

    if (termInput) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            const raw = termInput.value.trim();
            if (!raw) return;
            termLog('<span class="you">&gt;</span> ' + escapeHTML(raw));
            const [cmd, ...rest] = raw.split(/\s+/);
            const fn = COMMANDS[cmd.toLowerCase()];
            const out = fn ? fn(rest.join(" ")) : escapeHTML(cmd) + ": command not found. try 'help'.";
            if (out) termLog(out);
            termInput.value = "";
        });
    }
    if (termClose) termClose.addEventListener("click", closeTerm);

    /* global keys */
    document.addEventListener("keydown", (e) => {
        const tag = e.target && e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (e.target && e.target.isContentEditable) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === "/") {
            e.preventDefault();
            openTerm();
        } else if (e.key === "?") {
            e.preventDefault();
            openTerm();
            if (termInput) {
                termInput.value = "help";
                termInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
            }
        } else if (e.key === "Escape") {
            closeTerm();
        } else if (e.key === "t" || e.key === "T") {
            e.preventDefault();
            toggleTheme();
        }
    });

    /* ================= KONAMI ================= */
    const KONAMI = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a"
    ];
    let kpos = 0;
    document.addEventListener("keydown", (e) => {
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (k === KONAMI[kpos]) {
            kpos++;
            if (kpos === KONAMI.length) {
                trophy();
                kpos = 0;
            }
        } else {
            kpos = k === KONAMI[0] ? 1 : 0;
        }
    });
    function trophy() {
        const t = document.getElementById("trophy");
        if (!t) return;
        t.classList.add("on");
        toggleRain(true);
        setTimeout(() => {
            t.classList.remove("on");
            toggleRain(false);
        }, 4000);
    }

    /* ================= MATRIX RAIN ================= */
    const rain = document.getElementById("rain");
    let rctx = null;
    let rainOn = false;
    let rainAnim = 0;
    const glyphs = "ジャックJACKGAFFNEY01{}</>[]≠→←↑↓∞§¶".split("");
    let drops = [];

    function sizeRain() {
        if (!rain) return;
        rain.width = window.innerWidth;
        rain.height = window.innerHeight;
    }
    function initDrops() {
        if (!rain) return;
        drops = new Array(Math.floor(rain.width / 14))
            .fill(0)
            .map(() => Math.random() * (rain.height / 14));
    }
    function drawRain() {
        if (!rain || !rctx) return;
        const darkBg = root.getAttribute("data-theme") === "dark" ? "rgba(14,13,11,0.08)" : "rgba(244,239,230,0.12)";
        rctx.fillStyle = darkBg;
        rctx.fillRect(0, 0, rain.width, rain.height);
        rctx.font = '14px "JetBrains Mono", ui-monospace, monospace';
        const accent = getComputedStyle(root).getPropertyValue("--accent").trim();
        for (let i = 0; i < drops.length; i++) {
            const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
            rctx.fillStyle = Math.random() < 0.05 ? "#fff" : accent;
            rctx.fillText(ch, i * 14, drops[i] * 14);
            if (drops[i] * 14 > rain.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        if (rainOn) rainAnim = requestAnimationFrame(drawRain);
    }
    function toggleRain(force) {
        if (!rain) return;
        if (!rctx) {
            rctx = rain.getContext("2d");
            sizeRain();
            window.addEventListener("resize", sizeRain);
        }
        const want = typeof force === "boolean" ? force : !rainOn;
        rainOn = want && !motionQuery.matches;
        rain.classList.toggle("on", rainOn);
        if (rainOn) {
            initDrops();
            drawRain();
        } else {
            cancelAnimationFrame(rainAnim);
            rctx.clearRect(0, 0, rain.width, rain.height);
        }
    }

    /* ================= PORTRAIT CLICK EASTER EGGS ================= */
    (function () {
        const frame = document.getElementById("portraitFrame");
        if (!frame) return;
        const meta = document.getElementById("portraitMeta");
        const img = frame.querySelector("img");
        let clicks = 0;
        frame.addEventListener("click", () => {
            clicks++;
            if (clicks === 5 && meta) meta.textContent = "hi :)";
            if (clicks === 10 && img) img.style.filter = "hue-rotate(90deg) saturate(1.2)";
            if (clicks === 15) trophy();
        });
    })();

    /* ================= HINT FADE ON SCROLL ================= */
    (function () {
        const hint = document.querySelector(".hint");
        if (!hint) return;
        window.addEventListener(
            "scroll",
            () => {
                hint.style.opacity = window.scrollY > 200 ? "0.25" : "0.6";
            },
            { passive: true }
        );
    })();
})();
