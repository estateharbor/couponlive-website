/* Runs before paint (synchronous, in <head>) to set the theme class and avoid
   a flash of the wrong theme. Kept as a static file so no inline React script
   is rendered (React 19 does not execute inline component scripts). */
(function () {
  try {
    var t = localStorage.getItem("theme");
    var dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
