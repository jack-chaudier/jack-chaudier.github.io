// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Initialize theme from localStorage or default to light
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Set current year
document.getElementById("year").textContent = new Date().getFullYear();
