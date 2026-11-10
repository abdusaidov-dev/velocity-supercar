// VELOCITY — motion and interaction
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Subtle cursor light.
const glow = document.querySelector('.cursor-glow');
if (glow && !reduceMotion) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

// Parallax layers — deliberately restrained for a cinematic feel.
const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let ticking = false;
function updateParallax() {
  const scrollY = window.scrollY;
  parallaxItems.forEach(el => {
    const speed = Number(el.dataset.parallax || 0);
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      el.style.setProperty('--parallax', `${scrollY * speed}px`);
    }
  });
  ticking = false;
}
if (!reduceMotion) {
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
}

// Gentle 3D card tilt on pointer devices.
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Count-up statistics.
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const decimals = String(target).includes('.') ? 1 : 0;
    const start = performance.now();
    const duration = 1500;
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(el => countObserver.observe(el));

// Mobile navigation.
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
