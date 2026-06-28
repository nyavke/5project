// Legacy no-op: dark mode was removed from Vanilla.
(function () {
    "use strict";

    var html = document.documentElement;
    html.setAttribute("data-bs-theme", "light");
    html.classList.remove("theme-dark");
    try { localStorage.removeItem("vanilla-theme"); } catch (e) {}
})();
