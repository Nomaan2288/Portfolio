/**
 * ============================================================================
 * SHAIKH NOMAN — REDOYAN ARCHITECTURE ENGINE
 * Interactive Loading Expansion, Cursor Physics, 3D Tilt,
 * Live Telemetry & Micro-Interactions.
 * ============================================================================
 */

(function () {
  'use strict';

  const CONFIG = {
    email: 'shaikhnoman0652@gmail.com'
  };

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- 1. Interactive Loading Screen with Magnetic Button & Circle Expansion ---
  function initLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingWrap = document.getElementById('loading-wrap');
    const enterBtn = document.getElementById('enter-btn');
    const loadingHover = document.getElementById('loading-hover');
    const progressText = document.getElementById('loader-progress-text');

    if (!loadingScreen || !loadingWrap || !enterBtn) return;

    // Magnetic Mouse Tracking on Enter Button
    enterBtn.addEventListener('mousemove', (e) => {
      const rect = enterBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      enterBtn.style.setProperty('--mouse-x', `${x}px`);
      enterBtn.style.setProperty('--mouse-y', `${y}px`);

      if (loadingHover) {
        loadingHover.style.setProperty('--mouse-x', `${x}px`);
        loadingHover.style.setProperty('--mouse-y', `${y}px`);
      }
    });

    // Simulated Loading Counter
    let count = 0;
    const countTimer = setInterval(() => {
      count += Math.floor(Math.random() * 15) + 8;
      if (count >= 100) {
        count = 100;
        clearInterval(countTimer);
        if (progressText) progressText.textContent = 'ENTER';
      } else {
        if (progressText) progressText.textContent = `${count}%`;
      }
    }, 60);

    // Expand & Enter Portfolio Action
    function enterPortfolio() {
      if (loadingWrap.classList.contains('loading-clicked')) return;
      loadingWrap.classList.add('loading-clicked');

      setTimeout(() => {
        loadingScreen.classList.add('dismissed');
        document.body.classList.remove('loading-active');
      }, 750);
    }

    enterBtn.addEventListener('click', enterPortfolio);
    loadingWrap.addEventListener('click', enterPortfolio);

    // Auto-enter fallback after 3.5s if visitor doesn't click
    setTimeout(() => {
      if (!loadingWrap.classList.contains('loading-clicked')) {
        enterPortfolio();
      }
    }, 3500);
  }

  // --- 2. Custom Follower Cursor Physics ---
  function initCursor() {
    if (!isFinePointer) return;

    const cursor = document.getElementById('cursor-main');
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function cursorTick() {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      currentX += dx * 0.22;
      currentY += dy * 0.22;

      cursor.style.setProperty('--cursor-x', `${currentX}px`);
      cursor.style.setProperty('--cursor-y', `${currentY}px`);

      requestAnimationFrame(cursorTick);
    }
    requestAnimationFrame(cursorTick);

    // Hover Expansion on Interactive Elements
    const hoverElements = document.querySelectorAll(
      'a, button, .what-content, .work-box, .techstack-item, .career-info-box, .email-copy-text, .hover-link'
    );

    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  // --- 3. 3D Holographic Portrait Tilt ---
  function init3DTilt() {
    if (!isFinePointer) return;

    const wrap = document.getElementById('portrait-3d-wrap');
    const landing = document.getElementById('landingDiv');
    if (!wrap || !landing) return;

    landing.addEventListener('mousemove', (e) => {
      const rect = landing.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = -y * 18;
      const tiltY = x * 18;

      wrap.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    landing.addEventListener('mouseleave', () => {
      wrap.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // --- 4. Fixed Header Shrink on Scroll ---
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });

    // Smooth Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerOffset = 60;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // --- 5. Live Indian Standard Time (IST) Clock ---
  function initLiveTime() {
    const footerTime = document.getElementById('footer-live-time');

    function update() {
      try {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const istString = now.toLocaleTimeString('en-US', options);
        if (footerTime) footerTime.textContent = `${istString} IST`;
      } catch (err) {
        if (footerTime) footerTime.textContent = 'UTC+05:30';
      }
    }

    update();
    setInterval(update, 1000);
  }

  // --- 6. Copy Email & Toast Notification ---
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  window.copyEmail = function () {
    navigator.clipboard
      .writeText(CONFIG.email)
      .then(() => {
        showToast(`Copied ${CONFIG.email} to clipboard! 📋`);
      })
      .catch(() => {
        showToast(`Email: ${CONFIG.email}`);
      });
  };

  // --- 7. DOM Ready Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    init3DTilt();
    initNavbar();
    initLiveTime();
  });
})();
