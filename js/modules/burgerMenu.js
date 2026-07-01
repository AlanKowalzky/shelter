const MOBILE_BREAKPOINT = 768;

export function initBurgerMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const navCloseBtn = document.querySelector('.nav__close');
  const header = document.querySelector('.header');

  if (!burgerBtn || !nav || !header) {
    return;
  }

  let isOpen = false;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  // append overlay to header so it stays in the same stacking context as nav
  header.appendChild(overlay);

  function setBodyScrollBlocked(blocked) {
    document.body.style.overflow = blocked ? 'hidden' : '';
    document.documentElement.style.overflow = blocked ? 'hidden' : '';
  }

  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    nav.classList.add('nav--open');
    burgerBtn.classList.add('burger-btn--open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    overlay.classList.add('nav-overlay--visible');
    setBodyScrollBlocked(true);
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    nav.classList.remove('nav--open');
    burgerBtn.classList.remove('burger-btn--open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('nav-overlay--visible');
    setBodyScrollBlocked(false);
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function shouldUseMobileMenu() {
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  burgerBtn.addEventListener('click', () => {
    toggleMenu();
  });

  overlay.addEventListener('click', closeMenu);

  if (navCloseBtn) {
    navCloseBtn.addEventListener('click', closeMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // If this is a placeholder anchor, close menu and do nothing else.
      if (href === '#') {
        e.preventDefault();
        if (shouldUseMobileMenu()) {
          closeMenu();
        }
        return;
      }

      // If link is an in-page anchor (e.g. "#contacts"), handle scrolling.
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        // close menu first
        closeMenu();
        // wait for menu close animation then scroll to target
        setTimeout(() => {
          const target = document.getElementById(id);
          if (target) {
            const headerStyle = window.getComputedStyle(header).position;
            const headerHeight = headerStyle === 'fixed' || headerStyle === 'sticky'
              ? header.offsetHeight
              : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 350);
        return;
      }

      // For links that navigate to other pages, just close the menu on mobile.
      if (shouldUseMobileMenu()) {
        closeMenu();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (!shouldUseMobileMenu()) {
      closeMenu();
    }
  });
}
