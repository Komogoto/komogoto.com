/* ===========================
   KOMOGOTO — Interactions
   =========================== */

// --- Navbar scroll state ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- Mobile nav toggle ---
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  toggle.setAttribute('aria-expanded', isOpen);

  // Animate hamburger lines
  const spans = toggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// --- Reveal on scroll ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger delay for siblings
  const parent = el.parentElement;
  const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
  const idx = siblings.indexOf(el);
  if (idx > 0) {
    el.style.transitionDelay = `${idx * 0.08}s`;
  }
  revealObserver.observe(el);
});

// --- Smooth active nav link highlight ---
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--text)';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// --- Count-up animation for hero stats ---
function countUp(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isLarge = target >= 1000;

  const update = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - elapsed, 4);
    const value = Math.round(ease * target);

    if (isLarge && target === 2018) {
      el.textContent = value;
    } else if (target >= 1000000) {
      el.textContent = (value / 1000000).toFixed(0) + 'M';
    } else if (target >= 1000) {
      el.textContent = value;
    } else {
      el.textContent = value;
    }

    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = isLarge && target !== 2018 ? value : el.textContent;
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = entry.target.querySelectorAll('.stat-num');
        statNums.forEach(el => {
          const text = el.textContent.trim();
          const numStr = text.replace(/[^0-9]/g, '');
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && /^\d+$/.test(text)) countUp(el, num);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// --- Contact form ---
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;

  btn.innerHTML = '<span>Envoi en cours…</span>';
  btn.disabled = true;

  try {
    const res = await fetch('contact.php', {
      method: 'POST',
      body: new FormData(form),
    });
    const data = await res.json();

    if (data.success) {
      btn.innerHTML = '<span>Message envoyé ✓</span>';
      btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 3500);
    } else {
      btn.innerHTML = `<span>${data.message || 'Erreur lors de l\'envoi.'}</span>`;
      btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
    }
  } catch {
    btn.innerHTML = '<span>Erreur réseau. Réessayez.</span>';
    btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
    }, 4000);
  }
});

// --- Cursor glow on bento cards ---
document.querySelectorAll('.bento-card, .project-card, .commitment-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  });
});

// --- Parallax on hero orbs (subtle) ---
document.addEventListener('mousemove', (e) => {
  const { innerWidth: w, innerHeight: h } = window;
  const dx = (e.clientX / w - 0.5) * 2;
  const dy = (e.clientY / h - 0.5) * 2;

  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
  if (orb2) orb2.style.transform = `translate(${-dx * 15}px, ${-dy * 15}px)`;
  if (orb3) {
    const base = 'translate(-50%, -50%)';
    orb3.style.transform = `${base} translate(${dx * 10}px, ${dy * 10}px)`;
  }
}, { passive: true });
