/* SafeLift Modern — front-end interactions */
(function() {
  'use strict';

  // ===== Mobile nav toggle =====
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== Nav background on scroll =====
  var nav = document.getElementById('siteNav');
  if (nav) {
    var lastY = 0;
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (y > 30) {
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
      } else {
        nav.style.boxShadow = 'none';
      }
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Anchor scroll for hash links =====
  document.querySelectorAll('a[href*="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href') || '';
      // Only handle in-page anchors like #scissor, #boom, #dock, #material
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      var hash = href.substring(hashIndex);
      if (hash.length <= 1) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var navHeight = (nav ? nav.offsetHeight : 68) + 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ===== Active nav highlight (covers non-home pages) =====
  var path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if (href && href !== '#' && (path === href || path.indexOf(href) === 0)) {
      a.classList.add('active');
    }
  });

})();

// ===== Contact form handler =====
// Posts the inquiry to a Cloudflare Worker which emails it via Resend.
// Defined globally so inline onsubmit can reach it.
function handleSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector('.form-submit');
  if (!btn) return false;
  var original = btn.textContent;

  var fields = ['name', 'company', 'email', 'country', 'product', 'quantity', 'message', 'website'];
  var payload = {};
  fields.forEach(function(f) {
    var el = form.elements[f];
    payload[f] = el ? String(el.value || '').trim() : '';
  });

  // Client-side required check (server validates again)
  if (!payload.name || !payload.email || !payload.message) {
    btn.textContent = 'Please fill in Name, Email and Message.';
    setTimeout(function() { btn.textContent = original; }, 2500);
    return false;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function(res) { return res.json().then(function(d) { return { ok: res.ok, data: d }; }); })
    .then(function(r) {
      if (r.ok && r.data.code === 200) {
        btn.textContent = "Inquiry Sent! We'll reply within 24h.";
        btn.style.background = '#2E7D32';
        btn.style.borderColor = '#2E7D32';
        form.reset();
      } else {
        btn.textContent = r.data.message || 'Failed to send. Please email us directly.';
        btn.style.background = '#C62828';
        btn.style.borderColor = '#C62828';
      }
      setTimeout(function() {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 4000);
    })
    .catch(function() {
      btn.textContent = 'Network error. Please email sales@safelift.de5.net';
      btn.style.background = '#C62828';
      btn.style.borderColor = '#C62828';
      setTimeout(function() {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 4000);
    });
  return false;
}
