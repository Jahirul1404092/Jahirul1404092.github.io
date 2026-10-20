/* Md Jahirul Islam — portfolio behavior
   Plain JavaScript, no dependencies: mobile menu, theme toggle,
   active-section highlighting, and the contact form. */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('site-nav');
  var menuBtn = document.getElementById('menu-toggle');
  var themeBtn = document.getElementById('theme-toggle');
  var root = document.documentElement;

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(!header.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Theme ---------- */
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return mql.matches ? 'dark' : 'light';
  }

  function labelThemeButton() {
    if (!themeBtn) return;
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    themeBtn.setAttribute('title', 'Switch to ' + next + ' theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      labelThemeButton();
    });
    if (mql.addEventListener) mql.addEventListener('change', labelThemeButton);
    labelThemeButton();
  }

  /* ---------- Active section in the nav ---------- */
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var current = null;
    var visible = new Map();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      var best = null;
      var bestRatio = 0;
      sections.forEach(function (s) {
        var r = visible.get(s.id) || 0;
        if (r > bestRatio) { bestRatio = r; best = s.id; }
      });
      if (best !== current) {
        current = best;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + best);
        });
      }
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('contact-status');

  function showStatus(text, kind) {
    if (!status) return;
    status.textContent = text;
    status.className = 'contact-form__status' + (kind ? ' is-' + kind : '');
  }

  if (form) {
    // Returning from the no-JavaScript fallback redirect (?sent=1).
    if (/[?&]sent=1/.test(window.location.search)) {
      form.classList.add('is-sent');
      showStatus('Message sent. Thanks — I’ll reply by email soon.', 'success');
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + '#contact');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll('input[name="email"], textarea[name="message"]');
      var valid = true;
      Array.prototype.forEach.call(fields, function (f) {
        var ok = f.checkValidity();
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) valid = false;
      });
      if (!valid) {
        showStatus('Add a valid email address and a message, then send again.', 'error');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      var payload = {};
      Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (f) {
        if (f.name && f.name !== '_next') payload[f.name] = f.value;
      });

      btn.disabled = true;
      showStatus('Sending…');

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && String(data.success) === 'true') {
            form.classList.add('is-sent');
            form.reset();
            showStatus('Message sent. Thanks — I’ll reply by email soon.', 'success');
          } else {
            // FormSubmit declined the AJAX request (for example, the address is not
            // activated yet). Hand off to a regular submission so FormSubmit can show
            // its own activation or verification page, then redirect back via _next.
            form.submit();
          }
        })
        .catch(function () {
          showStatus('The message couldn’t be sent. Please email me directly at jahirul.amsa@gmail.com.', 'error');
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
