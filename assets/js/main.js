/* ===================================================================
   Chris F — Portfolio JavaScript
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ──────── PRELOADER ──────── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 600);
  });

  /* ──────── CUSTOM CURSOR ──────── */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left  = `${mouseX}px`;
      dot.style.top   = `${mouseY}px`;
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      requestAnimationFrame(animateRing);
    })();

    const hoverTargets = document.querySelectorAll('a, button, .project-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  /* ──────── THEME TOGGLE ──────── */
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle.querySelector('i');
  const saved = localStorage.getItem('theme');

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateIcon(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateIcon('dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  /* ──────── MOBILE NAVIGATION ──────── */
  const navToggle = document.getElementById('navToggle');
  const navClose  = document.getElementById('navClose');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => navMenu.classList.add('open'));
  navClose.addEventListener('click',  () => navMenu.classList.remove('open'));

  navLinks.forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  /* ──────── HEADER SCROLL ──────── */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ──────── ACTIVE NAV LINK ──────── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ──────── TYPED TEXT EFFECT ──────── */
  const typedEl = document.getElementById('typedText');
  const titles = [
    'Software Developer',
    'Problem Solver',
    'Creative Thinker',
    'Tech Enthusiast'
  ];
  let titleIdx = 0, charIdx = 0, deleting = false;

  function typeEffect() {
    const currentTitle = titles[titleIdx];
    if (!deleting) {
      typedEl.textContent = currentTitle.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentTitle.length) {
        deleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
      setTimeout(typeEffect, 80);
    } else {
      typedEl.textContent = currentTitle.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(typeEffect, 400);
        return;
      }
      setTimeout(typeEffect, 40);
    }
  }

  setTimeout(typeEffect, 1200);

  /* ──────── PARTICLE BACKGROUND ──────── */
  const particlesContainer = document.getElementById('particles');

  function createParticles() {
    const count = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(var(--clr-accent-rgb), ${Math.random() * 0.3 + 0.05});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * -20}s;
      `;
      particlesContainer.appendChild(particle);
    }
  }

  // Inject particle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%   { transform: translate(0, 0) scale(1);   opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200 + 50}px, -${Math.random() * 400 + 200}px) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  createParticles();

  /* ──────── SCROLL REVEAL ──────── */
  const reveals = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  /* ──────── COUNTER ANIMATION ──────── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  /* ──────── SKILL BAR ANIMATION ──────── */
  const skillFills = document.querySelectorAll('.skill-card__fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.getAttribute('data-width');
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(el => skillObserver.observe(el));

  /* ──────── PROJECT FILTER ──────── */
  const filterBtns  = document.querySelectorAll('.projects__filter');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp .5s var(--ease) forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ──────── PROJECT IMAGE CAROUSELS ──────── */
  document.querySelectorAll('.project-card__carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel__slide');
    const prevBtn = carousel.querySelector('.carousel__btn--prev');
    const nextBtn = carousel.querySelector('.carousel__btn--next');
    const dotsContainer = carousel.querySelector('.carousel__dots');
    let current = 0;

    // Generate dot indicators
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel__dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); });
  });

  /* ──────── FORM HANDLING ──────── */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';
    btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });

  /* ──────── FOOTER YEAR ──────── */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ──────── SMOOTH SCROLL (fallback) ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
