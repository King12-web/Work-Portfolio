// ---- NAV: background on scroll ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- MOBILE MENU ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
function openMenu() { mobileMenu.classList.add('open'); navToggle.setAttribute('aria-expanded', 'true'); }
function closeMenu() { mobileMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
navToggle.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ---- TECH MARQUEE: stagger the pulse animation per item so the highlight sweeps across ----
document.querySelectorAll('.marquee-track .tech').forEach((el, i) => {
  el.style.animationDelay = (i * 0.9) + 's';
});

// ---- SCROLL REVEALS ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- HERO NAME: terminal-style decode/scramble effect ----
function scrambleIn(el, finalText, { startDelay = 0, stepMs = 45, perCharTicks = 3, holdTicks = 6, onComplete } = {}) {
  const glyphs = '!<>-_\\/[]{}=+*^?#$%01';
  const letters = finalText.split('');
  el.innerHTML = '';
  const spans = letters.map(ch => {
    const s = document.createElement('span');
    s.className = 'scrambling';
    s.textContent = ch === ' ' ? '\u00A0' : glyphs[Math.floor(Math.random() * glyphs.length)];
    el.appendChild(s);
    return s;
  });
  setTimeout(() => {
    let tick = 0;
    const timer = setInterval(() => {
      tick++;
      let doneCount = 0;
      spans.forEach((s, i) => {
        const lockTick = i * perCharTicks + holdTicks;
        if (tick >= lockTick) {
          if (!s.classList.contains('locked')) {
            s.textContent = letters[i] === ' ' ? '\u00A0' : letters[i];
            s.classList.remove('scrambling');
            s.classList.add('locked');
          }
          doneCount++;
        } else if (letters[i] !== ' ') {
          s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      });
      if (doneCount === spans.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, stepMs);
  }, startDelay);
}

// aligns line 2's left edge to the horizontal position of the apostrophe in line 1
function alignLine2ToApostrophe() {
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  if (!line1 || !line2 || line1.children.length < 5) return;
  const apostrophe = line1.children[4]; // K-I-N-G-'-S -> index 4 is "'"
  line2.style.marginLeft = apostrophe.offsetLeft + 'px';
}

window.addEventListener('load', () => {
  scrambleIn(document.getElementById('line1'), "KING'S", {
    startDelay: 150,
    onComplete: () => {
      alignLine2ToApostrophe();
      scrambleIn(document.getElementById('line2'), "TECH", { startDelay: 100 });
    }
  });
});

let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(alignLine2ToApostrophe, 120);
});

// ---- CONTACT FORM ----
// This is a static site with no backend yet, so the form currently just
// prevents the default page reload. Wire it up to a form service (Formspree,
// Resend, a serverless function, etc.) when you're ready to receive messages.
const contactForm = document.querySelector('#contact form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: send form data somewhere real.
    console.log('Form submitted (not yet wired to a backend).');
  });
}