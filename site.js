/* site.js: header menu and footer details for the notes page, the pages in notes/, single notes and articles,
   and the 404 page
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

  // the pages in notes/: the contents shows how many entries each subject has
  document.querySelectorAll('[data-count]').forEach(function (c) {
    var sec = document.getElementById(c.getAttribute('data-count'));
    var n = sec ? sec.querySelectorAll('.doc').length : 0;
    c.textContent = n ? String(n) : '\u2013';
  });

  // and each figure draws itself as it comes into view, unless motion is reduced, or paused on the home page
  var plates = document.querySelectorAll('.plate svg'), still = false;
  try { still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('am-motion') === 'paused'; } catch (e) {}
  if (plates.length && !still && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('plates-armed');
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('drawn'); seen.unobserve(e.target); } });
    }, { threshold: 0.3 });
    plates.forEach(function (p) { seen.observe(p); });
  }

  // pointing at a figure sets its travelling point going round its path (not when motion is reduced or paused).
  // Moving away pauses the point where it is, so it fades out in place, and it carries on from there next time.
  var moving = document.querySelectorAll('.plate animateMotion');
  if (moving.length && !still && moving[0].beginElement && window.matchMedia('(hover: hover)').matches) {
    document.documentElement.classList.add('can-travel');
    document.querySelectorAll('.plate').forEach(function (fig) {
      var m = fig.querySelector('animateMotion'), svg = fig.querySelector('svg'), started = false;
      if (!m || !svg.pauseAnimations) return;
      fig.addEventListener('mouseenter', function () {
        svg.unpauseAnimations();
        if (!started) { m.beginElement(); started = true; }
      });
      fig.addEventListener('mouseleave', function () { svg.pauseAnimations(); });
    });
  }

  // Reading time: an article's length turned into minutes. Its length is the running text before the references
  // (paragraphs, lists and quotations, with each piece of maths counted as one word); figures and diagrams are not
  // counted. An article's own label shows its time; an entry for an article in a list shows the time of the page
  // its title links to, which is fetched to be measured. Either way, nobody types the number.
  var WORDS_PER_MINUTE = 200;
  var minutesToRead = function (words) { return Math.max(1, Math.round(words / WORDS_PER_MINUTE)); };
  var articleLength = function (doc) {
    var main = doc.querySelector('main'), end = main && main.querySelector('hr:not(.break)'), words = 0;
    if (!main) return 0;
    main.querySelectorAll('p, li').forEach(function (el) {
      if (end && end.compareDocumentPosition(el) & 4) return;                     // after the references' rule
      if (el.closest('figure, nav, .cd-wrap, .refs') || el.classList.contains('label')) return;
      if (el.tagName === 'LI' && el.querySelector('p')) return;                   // its paragraphs are counted
      var c = el.cloneNode(true);
      c.querySelectorAll('.katex').forEach(function (k) { k.replaceWith(' x '); });   // maths already typeset
      var text = c.textContent.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, ' x ');       // or not yet
      words += (text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
    });
    return words;
  };
  document.querySelectorAll('[data-read-time]').forEach(function (el) {
    var put = function (words) { if (words) el.textContent = minutesToRead(words) + ' min read'; };
    var entry = el.closest('.doc');
    if (!entry) { put(articleLength(document)); return; }
    var link = entry.querySelector('h3 a[href]');                                  // a planned article has no link yet
    if (!link || !window.fetch || !window.DOMParser) return;
    fetch(link.href).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) { put(articleLength(new DOMParser().parseFromString(html, 'text/html'))); })
      .catch(function () {});                                                     // the typed text, if any, stays
  });

  // Articles: each reference is repeated in the right margin, level with the line that first cites it, on screens
  // with room for a margin (site.css). Pointing at a citation lights up its note, as in §3 of the home page, and
  // the notes are built from the reference list, so they always agree with it.
  var article = document.querySelector('.article-page main'), notes = [];
  if (article && article.querySelector('.refs')) {
    var aside = document.createElement('aside');
    aside.className = 'sidenotes'; aside.setAttribute('aria-hidden', 'true');
    article.querySelectorAll('.cite').forEach(function (c) {
      var id = c.getAttribute('href').slice(1), ref = document.getElementById(id);
      if (!ref || !ref.querySelector('.entry')) return;
      var note = notes.filter(function (n) { return n.id === id; })[0];
      if (!note) {
        var el = document.createElement('p');
        el.className = 'sidenote';
        el.innerHTML = '<span class="key">' + ref.querySelector('.key').innerHTML + '</span> ' + ref.querySelector('.entry').innerHTML;
        el.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });   // the list below is the one to tab through
        aside.appendChild(el);
        note = { id: id, el: el, cite: c }; notes.push(note);
      }
      ['mouseenter', 'focus'].forEach(function (ev) { c.addEventListener(ev, function () { note.el.classList.add('lit'); }); });
      ['mouseleave', 'blur'].forEach(function (ev) { c.addEventListener(ev, function () { note.el.classList.remove('lit'); }); });
    });
    article.appendChild(aside);
    // each note's first line sits on the baseline of the line that cites it, unless the note above is in the way
    var baseline = function (el) {   // a box of no height, set on the baseline at the start of el
      var probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      el.insertBefore(probe, el.firstChild);
      var y = probe.getBoundingClientRect().top; el.removeChild(probe); return y;
    };
    var placeNotes = function () {
      if (getComputedStyle(aside).display === 'none') return;
      var top = article.getBoundingClientRect().top, floor = 0;
      notes.forEach(function (n) {
        var drop = baseline(n.el) - n.el.getBoundingClientRect().top;   // from the note's top to its first baseline
        var y = Math.max(baseline(n.cite) - top - drop, floor);
        n.el.style.top = y + 'px';
        n.el.classList.add('placed');
        floor = y + n.el.offsetHeight + 14;
      });
    };
    // Placing them needs the final layout, and that changes: when KaTeX sets the maths (after load), whenever a
    // font arrives (KaTeX's own come later still), when the text reflows, and when the window is resized or zoomed,
    // which is also when the margin appears or goes. So they are placed again on each of these, at most once a
    // frame; and a note stays hidden until it has been placed, so none ever shows stacked in the corner.
    var pending = 0;
    var schedule = function () { if (!pending) pending = requestAnimationFrame(function () { pending = 0; placeNotes(); }); };
    window.addEventListener('load', function () { setTimeout(schedule, 0); });   // after KaTeX, and the maths' glue
    window.addEventListener('resize', schedule);
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(schedule);
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', schedule);
    }
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(article);
  }

  // Inline maths, as in TeX, is not broken across lines unless it is long, and it keeps the punctuation against it:
  // browsers will otherwise break between KaTeX's boxes, after a relation or before a comma or full stop, and
  // start the next line with what is left (or end a line on an opening bracket). A formula is measured by its
  // boxes, so that one already split across two lines is not mistaken for a long one.
  var glueMaths = function () {
    document.querySelectorAll('.katex').forEach(function (k) {
      if (k.parentNode.classList.contains('katex-display') || k.closest('.cd, .lab, .math-glue')) return;
      var width = 0;
      k.querySelectorAll('.katex-html > .base').forEach(function (b) { width += b.getBoundingClientRect().width; });
      if (k.parentNode.tagName === 'SPAN' && !k.parentNode.className && k.parentNode.childNodes.length === 1) k = k.parentNode;   // auto-render's wrapper
      if (width > 12 * parseFloat(getComputedStyle(k.parentNode).fontSize)) return;   // a long one may break where KaTeX allows
      var after = k.nextSibling, before = k.previousSibling;
      var a = after && after.nodeType === 3 ? /^[,.;:!?)\]’”'"]+/.exec(after.nodeValue) : null;
      var b = before && before.nodeType === 3 ? /[(\[‘“]+$/.exec(before.nodeValue) : null;
      var w = document.createElement('span'); w.className = 'math-glue';
      k.parentNode.insertBefore(w, k);
      if (b) { before.nodeValue = before.nodeValue.slice(0, -b[0].length); w.appendChild(document.createTextNode(b[0])); }
      w.appendChild(k);
      if (a) { after.nodeValue = after.nodeValue.slice(a[0].length); w.appendChild(document.createTextNode(a[0])); }
    });
  };
  window.addEventListener('load', function () { setTimeout(glueMaths, 0); });   // after KaTeX has set the page

  // Diagrams in notes and articles (.cd): KaTeX nodes on a grid, with arrows drawn between them.
  //   data-arrows="a>b c>d"  straight arrows, in any direction, from the node data-node="a" to data-node="b".
  //                          data-dashed="a>b" on the diagram dashes one; an element with class cd-label and
  //                          data-label="a>b" is set beside it, on its left as you travel along it
  //                          (data-side="right" for the other side), as tikz-cd places labels.
  //   data-snakes="a>b"      arrows that curve round from the end of one line to the start of the next, the
  //                          curve tikz-cd draws for [out=0, in=180, looseness=2] (data-looseness changes the 2).
  //                          Their label (class snake-label, data-label="a>b") sits on the curve, which breaks
  //                          round it.
  // The arrows end on KaTeX's maths axis, found from each node's strut, so they meet KaTeX's own arrows level.
  var cds = document.querySelectorAll('.cd[data-snakes], .cd[data-arrows]');
  if (cds.length) {
    var NS = 'http://www.w3.org/2000/svg';
    var axisOf = function (el, top) {
      var strut = el.querySelector('.strut'), r = el.getBoundingClientRect();
      if (!strut) return (r.top + r.bottom) / 2 - top;
      var fs = parseFloat(getComputedStyle(strut).fontSize), depth = -parseFloat(strut.style.verticalAlign) || 0;
      return strut.getBoundingClientRect().bottom - depth * fs - 0.25 * fs - top;   // baseline, then up to the axis
    };
    var make = function (svg, d) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); svg.appendChild(p); return p; };
    // an arrowhead the size of KaTeX's, with its tip at (x, y), pointing along the unit vector (ux, uy)
    var head = function (svg, x, y, ux, uy, em) {
      var l = 0.3 * em, w = 0.19 * em;
      var at = function (back, side) { return (x - ux * back - uy * side) + ' ' + (y - uy * back + ux * side); };
      make(svg, 'M' + at(l, w) + ' Q' + at(l * 0.35, w * 0.2) + ' ' + x + ' ' + y + ' Q' + at(l * 0.35, -w * 0.2) + ' ' + at(l, -w));
    };
    var ends = function (cd, pair) { var e = pair.split('>'); return [cd.querySelector('[data-node="' + e[0] + '"]'), cd.querySelector('[data-node="' + e[1] + '"]')]; };
    var place = function (label, x, y) { label.style.left = (x - label.offsetWidth / 2) + 'px'; label.style.top = (y - label.offsetHeight / 2) + 'px'; label.classList.add('placed'); };
    var list = function (cd, name) { return (cd.getAttribute(name) || '').split(/\s+/).filter(Boolean); };
    // A diagram in a .cd-wrap that is too wide for its column (a long exact sequence on a phone) is fitted to it:
    // first its side padding (room for snakes that loop outside it) comes down to half an em, then the whole
    // diagram is set smaller, to no less than 60% of its size. Past that, its wrapper scrolls sideways.
    var fitDiagrams = function () {
      cds.forEach(function (cd) {
        var wrap = cd.parentNode; if (!wrap.classList.contains('cd-wrap')) return;
        var room = wrap.clientWidth; cd.style.fontSize = ''; cd.style.paddingLeft = cd.style.paddingRight = '';
        if (cd.offsetWidth <= room) return;
        cd.style.paddingLeft = cd.style.paddingRight = '0.5em';
        if (cd.offsetWidth > room) cd.style.fontSize = Math.max(0.6, room / cd.offsetWidth) + 'em';
      });
    };
    var drawDiagrams = function () {
      cds.forEach(function (cd) {
        var box = cd.getBoundingClientRect(), svg = cd.querySelector('svg.snakes');
        if (!svg) { svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'snakes'); svg.setAttribute('aria-hidden', 'true'); cd.appendChild(svg); }
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        var em = parseFloat(getComputedStyle(cd).fontSize), dashed = list(cd, 'data-dashed');

        // straight arrows: aimed from one node's point on the axis to the other's, and cut where they leave the
        // nodes' boxes (KaTeX's own box for the symbols, plus a little air)
        var frame = function (el) {
          var bs = el.querySelectorAll('.base'), gx = 0.3 * em, gy = 0.2 * em, r = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
          (bs.length ? Array.prototype.slice.call(bs) : [el]).forEach(function (b) {   // the union of KaTeX's boxes
            var q = b.getBoundingClientRect();
            r.left = Math.min(r.left, q.left); r.right = Math.max(r.right, q.right); r.top = Math.min(r.top, q.top); r.bottom = Math.max(r.bottom, q.bottom);
          });
          return { x0: r.left - box.left - gx, x1: r.right - box.left + gx, y0: r.top - box.top - gy, y1: r.bottom - box.top + gy,
                   cx: (r.left + r.right) / 2 - box.left, cy: axisOf(el, box.top) };
        };
        var exit = function (f, tx, ty) {
          var dx = tx - f.cx, dy = ty - f.cy;
          var sx = dx > 0 ? (f.x1 - f.cx) / dx : dx < 0 ? (f.x0 - f.cx) / dx : Infinity;
          var sy = dy > 0 ? (f.y1 - f.cy) / dy : dy < 0 ? (f.y0 - f.cy) / dy : Infinity;
          var s = Math.min(sx, sy);
          return [f.cx + dx * s, f.cy + dy * s];
        };
        list(cd, 'data-arrows').forEach(function (pair) {
          var n = ends(cd, pair); if (!n[0] || !n[1]) return;
          var A = frame(n[0]), B = frame(n[1]), p = exit(A, B.cx, B.cy), q = exit(B, A.cx, A.cy);
          var len = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / len, uy = (q[1] - p[1]) / len;
          var line = make(svg, 'M' + p[0] + ' ' + p[1] + ' L' + q[0] + ' ' + q[1]);
          if (dashed.indexOf(pair) >= 0) line.setAttribute('stroke-dasharray', (0.3 * em) + ' ' + (0.22 * em));
          head(svg, q[0], q[1], ux, uy, em);
          var label = cd.querySelector('.cd-label[data-label="' + pair + '"]');
          if (label) {
            var side = label.getAttribute('data-side') === 'right' ? -1 : 1, nx = side * uy, ny = -side * ux;   // left of travel
            var reach = Math.abs(nx) * label.offsetWidth / 2 + Math.abs(ny) * label.offsetHeight / 2 + 0.25 * em;
            place(label, (p[0] + q[0]) / 2 + nx * reach, (p[1] + q[1]) / 2 + ny * reach);
          }
        });

        // curved arrows from the end of one line to the start of the next
        list(cd, 'data-snakes').forEach(function (pair) {
          var n = ends(cd, pair); if (!n[0] || !n[1]) return;
          var ra = n[0].getBoundingClientRect(), rb = n[1].getBoundingClientRect(), gap = 0.3 * em;
          var ax = ra.right - box.left + gap, ay = axisOf(n[0], box.top), bx = rb.left - box.left - gap, by = axisOf(n[1], box.top);
          // TikZ puts each control point looseness * 0.3915 * (distance between the ends) away, along out and in
          var loose = parseFloat(cd.getAttribute('data-looseness')) || 2, L = loose * 0.3915 * Math.hypot(ax - bx, ay - by);
          var line = make(svg, 'M' + ax + ' ' + ay + ' C' + (ax + L) + ' ' + ay + ' ' + (bx - L) + ' ' + by + ' ' + bx + ' ' + by);
          head(svg, bx, by, 1, 0, em);
          var label = cd.querySelector('.snake-label[data-label="' + pair + '"]');
          if (label) {
            place(label, (ax + bx) / 2, (ay + by) / 2);   // the middle of the curve, its centre of symmetry
            // break the curve where it passes the label, with a little air on either side
            var r = label.getBoundingClientRect(), pad = 0.2 * em;
            var x0 = r.left - box.left - pad, x1 = r.right - box.left + pad, y0 = r.top - box.top - pad, y1 = r.bottom - box.top + pad;
            var total = line.getTotalLength(), half = total / 2, g = 0;
            var inside = function (pt) { return pt.x > x0 && pt.x < x1 && pt.y > y0 && pt.y < y1; };
            while (g < half && (inside(line.getPointAtLength(half + g)) || inside(line.getPointAtLength(half - g)))) g += 0.5;
            line.setAttribute('stroke-dasharray', (half - g) + ' ' + (2 * g) + ' ' + total);
          }
        });
      });
    };
    // after KaTeX has set the page (it runs on load), once the fonts are in, and whenever a diagram changes size
    var fitAndDraw = function () { fitDiagrams(); drawDiagrams(); };
    window.addEventListener('load', function () { setTimeout(fitAndDraw, 0); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAndDraw);
    var fitting = false;
    window.addEventListener('resize', function () {
      if (fitting) return; fitting = true;
      requestAnimationFrame(function () { fitting = false; fitAndDraw(); });
    });
    if (window.ResizeObserver) { var ro = new ResizeObserver(function () { requestAnimationFrame(drawDiagrams); }); cds.forEach(function (cd) { ro.observe(cd); }); }
  }
})();
