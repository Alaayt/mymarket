/* ================================================================
   GAMEOVER — Custom JS
   Built by PixelCore
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     UTILS
  ---------------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ----------------------------------------------------------------
     HEADER — sticky + backdrop on scroll
  ---------------------------------------------------------------- */
  const header = $('#site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------------- */
  const menuToggle = $('#menu-toggle');
  const navLinks   = $('#nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------------
     NAV DROPDOWN — keyboard accessible
  ---------------------------------------------------------------- */
  $$('.nav-dropdown').forEach(drop => {
    const trigger = drop.querySelector('.dropdown-trigger');
    const menu    = drop.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !open);
    });

    drop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') trigger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------------------------------------------------------------
     SMOOTH SCROLL — all .scroll-to and [href^="#"]
  ---------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"], .scroll-to[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });

    if (window.innerWidth <= 680 && navLinks) {
      menuToggle && menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ----------------------------------------------------------------
     ACTIVE NAV LINK — highlight on scroll
  ---------------------------------------------------------------- */
  const sections = $$('section[id]');
  const navItems = $$('.nav-links .nav-link[href^="#"]');

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(link => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', matches);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => activeObserver.observe(sec));

  /* ----------------------------------------------------------------
     SCROLL REVEAL — [data-reveal]
  ---------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------------
     COUNTER ANIMATION — stat-value elements
  ---------------------------------------------------------------- */
  let countersStarted = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);

      el.textContent = value.toLocaleString();

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    };

    requestAnimationFrame(tick);
  }

  const statsSection = $('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          $$('[data-target]').forEach(animateCounter);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* ----------------------------------------------------------------
     ACCORDION
  ---------------------------------------------------------------- */
  $$('.acc-item').forEach(item => {
    const trigger = item.querySelector('.acc-trigger');
    const body    = item.querySelector('.acc-body');
    if (!trigger || !body) return;

    if (item.classList.contains('is-open')) {
      body.style.height = body.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      $$('.acc-item').forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          closeAccordion(other);
        }
      });

      if (isOpen) {
        closeAccordion(item);
      } else {
        openAccordion(item);
      }
    });
  });

  function openAccordion(item) {
    const body    = item.querySelector('.acc-body');
    const trigger = item.querySelector('.acc-trigger');
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    body.style.height = body.scrollHeight + 'px';
  }

  function closeAccordion(item) {
    const body    = item.querySelector('.acc-body');
    const trigger = item.querySelector('.acc-trigger');
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    body.style.height = '0';
  }

  /* ----------------------------------------------------------------
     PRODUCT CARD — staggered reveal
  ---------------------------------------------------------------- */
  $$('.product-card[data-reveal]').forEach((card, i) => {
    card.style.transitionDelay = `${i * 70}ms`;
  });

})();
