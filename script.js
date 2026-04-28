// Open Art Festival — Interaktionen

// 1. No-Cookie Toast
const noCookieToast = document.getElementById('no-cookie-toast');
if (noCookieToast) {
  const dismiss = () => {
    noCookieToast.classList.add('is-hidden');
    sessionStorage.setItem('oag-nocookie', '1');
  };
  if (sessionStorage.getItem('oag-nocookie')) {
    noCookieToast.classList.add('is-hidden');
  } else {
    setTimeout(dismiss, 7000);
  }
  document.getElementById('no-cookie-close').addEventListener('click', dismiss);
}

// 2. Menu Overlay
const navToggle = document.querySelector('.nav-toggle');
const mainMenu  = document.getElementById('main-menu');
if (navToggle && mainMenu) {
  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !mainMenu.classList.contains('is-open');
    mainMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  navToggle.addEventListener('click', () => toggleMenu());
  const closeBtn = mainMenu.querySelector('.menu-close');
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
  mainMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
}

// 3. Sprache-Toggle (visuell)
document.querySelectorAll('.lang__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang__btn').forEach(b => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
  });
});

// 4. Bild-Slider
const sliderTrack = document.getElementById('slider-track');
if (sliderTrack) {
  document.querySelectorAll('.slider__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir  = Number(btn.dataset.dir) || 1;
      const slide = sliderTrack.querySelector('.slider__slide');
      const step  = slide ? slide.getBoundingClientRect().width + 20 : 320;
      sliderTrack.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
  });
}

// 5. Handschrift-Animation: Buchstabe für Buchstabe mit Blur-Fade
(async () => {
  await document.fonts.ready;
  const container = document.querySelector('.handwrite');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hw-char').forEach(c => c.classList.add('visible'));
    return;
  }

  // Split each .hw-line into individual .hw-char spans
  const lines = container.querySelectorAll('.hw-line');
  const allChars = [];
  lines.forEach((line, li) => {
    const text = line.textContent;
    line.textContent = '';
    [...text].forEach((ch, ci) => {
      const span = document.createElement('span');
      span.className = 'hw-char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      line.appendChild(span);
      allChars.push({ span, li, ci });
    });
  });

  // Animate: each char appears after a staggered delay
  // ~85ms between chars, 220ms extra pause between lines
  let delay = 200;
  let prevLine = 0;
  allChars.forEach(({ span, li }) => {
    if (li > prevLine) { delay += 220; prevLine = li; }
    setTimeout(() => span.classList.add('visible'), delay);
    delay += 85;
  });
})();

// 6. Team-Foto: Namens-Tooltip bei Hover
const teamPhoto = document.getElementById('team-photo');
const teamTooltip = document.getElementById('team-tooltip');
if (teamPhoto && teamTooltip) {
  teamPhoto.querySelectorAll('.team-hotspot').forEach(spot => {
    spot.addEventListener('mouseenter', () => {
      const role = spot.dataset.role || '';
      teamTooltip.innerHTML = `<strong>${spot.dataset.name}</strong>${role ? `<br><span class="team-tooltip__role">${role}</span>` : ''}`;
      teamTooltip.hidden = false;
    });
    spot.addEventListener('mouseleave', () => {
      teamTooltip.hidden = true;
    });
  });
  teamPhoto.addEventListener('mousemove', (e) => {
    teamTooltip.style.left = e.clientX + 'px';
    teamTooltip.style.top  = e.clientY + 'px';
  });
}

// 7. Scroll-Reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
