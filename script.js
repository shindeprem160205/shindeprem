const q = (s, p = document) => p.querySelector(s);
const qa = (s, p = document) => [...p.querySelectorAll(s)];

const nav = q('#site-header');
const menuToggle = q('#menu-toggle');
const navLinksWrap = q('#primary-nav');
const navLinks = qa('.nav-link');
const sections = qa('main section[id]');
const progress = q('#scroll-progress');
const backToTop = q('#back-to-top');

function onScroll() {
  const top = document.documentElement.scrollTop || document.body.scrollTop;
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = h > 0 ? (top / h) * 100 : 0;
  progress.style.width = `${percent}%`;

  if (top > 200) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  if (top > 520) backToTop.classList.add('show');
  else backToTop.classList.remove('show');

  let current = sections[0]?.id;
  sections.forEach((section) => {
    const offset = section.offsetTop - 130;
    if (top >= offset) current = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          entry.target.style.transitionDelay = `${delay * 80}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  qa('[data-reveal]').forEach((el) => observer.observe(el));
}

function initMenu() {
  if (!menuToggle || !navLinksWrap) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initRipple() {
  qa('.ripple').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--x', `${event.clientX - rect.left}px`);
      button.style.setProperty('--y', `${event.clientY - rect.top}px`);
      button.classList.remove('rippling');
      void button.offsetWidth;
      button.classList.add('rippling');
    });
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

initMenu();
initReveal();
initRipple();
onScroll();
