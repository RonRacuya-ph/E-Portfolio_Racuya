/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function () {
  const btn  = document.getElementById('themeToggle');
  const moon = btn.querySelector('.theme-icon-moon');
  const sun  = btn.querySelector('.theme-icon-sun');
  const root = document.documentElement;

  // Load saved preference, default = light
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  btn.addEventListener('click', function () {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      moon.style.display = 'none';
      sun.style.display  = 'flex';
      btn.title = 'Switch to Light Mode';
    } else {
      root.removeAttribute('data-theme');
      moon.style.display = 'flex';
      sun.style.display  = 'none';
      btn.title = 'Switch to Dark Mode';
    }
  }
})();


/* ============================================================
   NAVBAR SCROLL SHADOW
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});


/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (link) {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(function (s) { sectionObserver.observe(s); });


/* ============================================================
   HAMBURGER MENU
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

function openMenu() {
  hamburger.classList.add('active');
  navLinksEl.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  hamburger.classList.remove('active');
  navLinksEl.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

function isMenuOpen() {
  return navLinksEl.classList.contains('open');
}

// Toggle on hamburger click
hamburger.addEventListener('click', function (e) {
  e.stopPropagation(); // prevent the document click from firing immediately
  isMenuOpen() ? closeMenu() : openMenu();
});

// Close when any nav link is clicked
navLinksEl.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

// Close when clicking outside the navbar
document.addEventListener('click', function (e) {
  if (isMenuOpen() && !navbar.contains(e.target)) {
    closeMenu();
  }
});

// Close when pressing Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && isMenuOpen()) {
    closeMenu();
    hamburger.focus(); // return focus for accessibility
  }
});

// Close when user scrolls (optional but common UX pattern)
window.addEventListener('scroll', function () {
  if (isMenuOpen()) {
    closeMenu();
  }
}, { passive: true });
