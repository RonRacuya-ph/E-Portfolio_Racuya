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


/* ============================================================
   CONTACT FORM — EmailJS
   ------------------------------------------------------------
   SETUP (one-time, takes ~5 minutes):
   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (connect your Gmail)
   3. Create an Email Template — use these variables in the body:
        Name:    {{from_name}}
        Email:   {{from_email}}
        Message: {{message}}
   4. Replace the three constants below with your real IDs.
      Your Public Key is under Account → API Keys.
   ============================================================ */

const EMAILJS_PUBLIC_KEY  = 'ltVb3hZL0ZDbQW9Mb';
const EMAILJS_SERVICE_ID  = 'service_tyc9et4';
const EMAILJS_TEMPLATE_ID = 'template_yx5irbd';

(function () {
  // Load EmailJS SDK dynamically so no extra <script> tag is needed in HTML
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = function () {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  };
  document.head.appendChild(script);
})();

const contactForm = document.getElementById('contact-form');
const formNote    = document.getElementById('form-note');
const sendBtn     = contactForm ? contactForm.querySelector('.btn-send') : null;

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Guard: remind developer to fill in the IDs
    if (
      EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'  ||
      EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID'  ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
    ) {
      showNote('⚠️ Please set your EmailJS keys in script.js first.', 'error');
      return;
    }

    var name    = document.getElementById('name').value.trim();
    var email   = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showNote('Please fill in all fields.', 'error');
      return;
    }

    // Disable button while sending
    setLoading(true);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      your_name:  name,
      your_email: email,
      message:    message
    })
    .then(function () {
      showNote('✅ Message sent! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    })
    .catch(function (err) {
      console.error('EmailJS error:', err);
      showNote('❌ Something went wrong. Please try again or email me directly.', 'error');
    })
    .finally(function () {
      setLoading(false);
    });
  });
}

function setLoading(isLoading) {
  if (!sendBtn) return;
  sendBtn.disabled = isLoading;
  sendBtn.style.opacity = isLoading ? '0.65' : '1';
  sendBtn.style.cursor  = isLoading ? 'not-allowed' : 'pointer';
  // Swap text while sending
  var textNode = sendBtn.childNodes[0];
  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    textNode.textContent = isLoading ? 'Sending… ' : 'Send Message ';
  }
}

function showNote(msg, type) {
  if (!formNote) return;
  formNote.textContent = msg;
  formNote.style.color = type === 'success' ? '#22863a' : '#c0392b';
  // Clear after 6 seconds
  clearTimeout(formNote._timer);
  formNote._timer = setTimeout(function () {
    formNote.textContent = '';
  }, 6000);
}
