/* Progressive enhancement: theme toggle + scroll reveal.
   The site is fully functional and readable with this file absent. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- Theme toggle ---- */
  function effectiveTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    var sync = function () { toggle.setAttribute("aria-pressed", effectiveTheme() === "dark"); };
    sync();
    toggle.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  }

})();
