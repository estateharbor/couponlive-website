// Load the web fonts WITHOUT blocking first paint. The two font stylesheets
// were render-blocking <link rel=stylesheet> tags in the head — the main cause
// of the ~6s mobile LCP. Injecting them from a deferred script makes them async;
// with font-display:swap the text paints immediately in the system fallback
// (Inter / Poppins / system-ui) and swaps to the brand fonts when they arrive.
(function () {
  var hrefs = [
    "https://api.fontshare.com/v2/css?f[]=general-sans@600,700&f[]=satoshi@400,500,700&display=swap",
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap",
  ];
  for (var i = 0; i < hrefs.length; i++) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = hrefs[i];
    document.head.appendChild(l);
  }
})();
