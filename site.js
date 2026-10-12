/* site.js: header menu and footer details for the notes page, single notes and the 404 page
   (the home page carries its own copy of these, alongside its animation). */
(function () {
  var nav = document.getElementById('site-nav');
  if (nav) {
    var btn = nav.querySelector('.menu-btn');
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setOpen(false); });
  }
  // links to other sites open in a new tab
  document.querySelectorAll('a[href^="http"]').forEach(function (a) { if (a.host !== location.host) { a.target = '_blank'; a.rel = 'noopener'; } });
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  var mod = document.getElementById('modified'), when = new Date(document.lastModified);
  if (mod && !isNaN(when)) mod.textContent = ' · Last revised ' + when.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
})();
