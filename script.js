/**
 * ============================================================================
 * SHAIKH NOMAN — CELESTIAL EDITORIAL ENGINE
 * Interactive Cosmic Canvas, Precision Reticle Cursor, Live Telemetry,
 * ScrollSpy, Systems Terminal & Audio Synthesis.
 * ============================================================================
 */

(function () {
  'use strict';

  // --- State Configuration ---
  const CONFIG = {
    email: 'shaikhnoman0652@gmail.com',
    starCountDesktop: 320,
    starCountMobile: 120,
    dustCountDesktop: 45,
    dustCountMobile: 20
  };

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- 1. Sound Synthesis Engine (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.enabled = localStorage.getItem('sn_sound_enabled') === 'true';
      this.ctx = null;
      this.updateUI();
    }

    init() {
      if (!this.ctx && typeof window.AudioContext !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('sn_sound_enabled', this.enabled);
      this.updateUI();
      if (this.enabled) {
        this.init();
        this.playTone(880, 'sine', 0.12, 0.08);
        showToast('Interface audio ambience activated 🔊');
      } else {
        showToast('Interface audio muted 🔇');
      }
    }

    updateUI() {
      const icon = document.getElementById('sound-icon');
      if (icon) {
        icon.className = this.enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (err) {
        console.warn('Audio playback error', err);
      }
    }

    playClick() {
      this.playTone(1200, 'sine', 0.04, 0.03);
    }

    playChime() {
      this.playTone(523.25, 'triangle', 0.18, 0.04);
      setTimeout(() => this.playTone(659.25, 'triangle', 0.22, 0.04), 60);
    }
  }

  const sound = new SoundEngine();

  // --- 2. Interactive Celestial Starfield Canvas ---
  function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const isMobile = window.innerWidth < 768;
    const starTotal = isMobile ? CONFIG.starCountMobile : CONFIG.starCountDesktop;
    const dustTotal = isMobile ? CONFIG.dustCountMobile : CONFIG.dustCountDesktop;

    // Star Class
    class Star {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.7 + 0.2;
        this.baseAlpha = this.alpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        this.parallaxFactor = (this.size / 1.8) * 0.025;

        // Slight blue or violet tint on selected stars
        const roll = Math.random();
        if (roll > 0.75) this.color = '143, 202, 255'; // sky blue
        else if (roll > 0.55) this.color = '194, 164, 255'; // violet
        else this.color = '255, 255, 255'; // neutral white
      }

      update() {
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha > this.baseAlpha + 0.35 || this.alpha > 0.95) {
          this.twinkleDir = -1;
        } else if (this.alpha < this.baseAlpha - 0.25 || this.alpha < 0.1) {
          this.twinkleDir = 1;
        }
      }

      draw(offsetX, offsetY) {
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(0.05, Math.min(1, this.alpha))})`;
        ctx.beginPath();
        const px = this.x + offsetX * this.parallaxFactor;
        const py = this.y + offsetY * this.parallaxFactor;
        ctx.arc(px, py, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Drifting Dust Particle
    class Dust {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = -Math.random() * 0.35 - 0.1;
        this.alpha = Math.random() * 0.25 + 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < 0) this.y = height;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
      }

      draw() {
        ctx.fillStyle = `rgba(143, 202, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const stars = Array.from({ length: starTotal }, () => new Star());
    const dusts = Array.from({ length: dustTotal }, () => new Dust());

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars.forEach((s) => s.reset(true));
      dusts.forEach((d) => d.reset());
    }, { passive: true });

    if (isFinePointer) {
      window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
      }, { passive: true });
    }

    let currentOffsetX = 0;
    let currentOffsetY = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Smooth inertia parallax calculation
      if (!isReducedMotion) {
        currentOffsetX += (targetMouseX - width / 2 - currentOffsetX) * 0.04;
        currentOffsetY += (targetMouseY - height / 2 - currentOffsetY) * 0.04;
      }

      stars.forEach((s) => {
        s.update();
        s.draw(currentOffsetX, currentOffsetY);
      });

      if (!isReducedMotion) {
        dusts.forEach((d) => {
          d.update();
          d.draw();
        });
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  // --- 3. Precision Reticle Cursor (Snapping on Interactive Elements) ---
  function initCursor() {
    if (!isFinePointer) return;

    const dot = document.getElementById('cursor-dot');
    const reticle = document.getElementById('cursor-reticle');
    if (!dot || !reticle) return;

    let mouseX = -100;
    let mouseY = -100;
    let reticleX = -100;
    let reticleY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Smooth reticle follow loop
    function reticleLoop() {
      const dx = mouseX - reticleX;
      const dy = mouseY - reticleY;
      reticleX += dx * 0.16;
      reticleY += dy * 0.16;
      reticle.style.transform = `translate(${reticleX}px, ${reticleY}px)`;
      requestAnimationFrame(reticleLoop);
    }
    requestAnimationFrame(reticleLoop);

    // Hover Expansion on Interactive Elements
    const hoverTargets = document.querySelectorAll(
      'a, button, input, .email-chip, .bento-metric-card, .project-showcase, .timeline-card, .arsenal-card, .term-chip'
    );

    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // --- 4. Live Indian Standard Time (IST) Clock ---
  function initLiveClock() {
    const timeEl = document.getElementById('live-time');
    const footerClock = document.querySelector('.live-clock-footer');

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
        if (timeEl) timeEl.textContent = `${istString} IST`;
        if (footerClock) footerClock.textContent = `${istString} IST`;
      } catch (e) {
        if (timeEl) timeEl.textContent = 'UTC+05:30';
      }
    }

    update();
    setInterval(update, 1000);
  }

  // --- 5. Sticky Navigation & ScrollSpy ---
  function initNavigation() {
    const header = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.nav-link[data-scroll]');
    const sections = document.querySelectorAll('section[id]');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksMenu = document.getElementById('nav-links');

    // Sticky Header Shrink
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Menu Toggle
    if (mobileToggle && navLinksMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navLinksMenu.classList.toggle('mobile-open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        sound.playClick();
      });

      // Close menu when clicking nav link
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          navLinksMenu.classList.remove('mobile-open');
          mobileToggle.setAttribute('aria-expanded', false);
        });
      });
    }

    // ScrollSpy for Active Links
    function highlightNav() {
      const scrollY = window.pageYOffset;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // Smooth Anchor Scroll
    document.querySelectorAll('a[data-scroll]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            const headerOffset = 80;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: isReducedMotion ? 'auto' : 'smooth'
            });
            sound.playClick();
          }
        }
      });
    });
  }

  // --- 6. Toast Notification System ---
  function showToast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 350);
    }, duration);
  }

  // --- 7. Copy Email to Clipboard ---
  function copyEmail() {
    navigator.clipboard
      .writeText(CONFIG.email)
      .then(() => {
        sound.playChime();
        showToast(`Copied ${CONFIG.email} to clipboard! 📋`);
      })
      .catch(() => {
        showToast('Please email directly: ' + CONFIG.email);
      });
  }

  // --- 8. Interactive Systems Terminal Drawer [K] ---
  const terminalCommands = {
    help: () => `
Available system commands:
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('about')">about</span>       - Architectural background & engineering core
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('projects')">projects</span>    - Production systems, marketplaces & deep dives
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('experience')">experience</span>  - Internship at LaunchPad Technology & timeline
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('skills')">skills</span>      - Spring Boot, MySQL concurrency, REST APIs
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('contact')">contact</span>     - Transmit email, LinkedIn & GitHub coordinates
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('clear')">clear</span>       - Wipe terminal screen buffer
  • <span class="term-highlight" onclick="PortfolioApp.runTermCmd('date')">date</span>        - Display active Indian Standard Time`,

    about: () => `
<strong class="text-white">SHAIKH NOMAN</strong> — Software Developer & Backend Systems Architect
Current Role: Software Developer Intern at LaunchPad Technology (Aug 2026 – Present)
Academic Record: B.Tech Computer Science & Engineering (9.32 CGPA)
Location: Surat, Gujarat, India (UTC +05:30)

Specialization:
Engineering thread-safe Java services in Spring Boot, designing normalized 3NF MySQL schemas with explicit composite indexing, and eliminating concurrency race conditions.`,

    projects: () => `
<strong class="text-white">Flagship Production Systems:</strong>
1. <strong>SpotAdz</strong> — Commercial OOH Billboard Advertising Marketplace
   [Spring Boot 3, MySQL, Date-Collision Prevention, B2B GST Invoicing]
   Deep Dive: <a href="Screenshots/spotadz.html" class="text-accent underline">Screenshots/spotadz.html</a>

2. <strong>BookMyEvent</strong> — High-Concurrency Event Ticketing Ecosystem
   [Spring Boot 3, MySQL, Transient Seat Lock, Dynamic QR Verification]
   Deep Dive: <a href="Screenshots/bookmyevent.html" class="text-accent underline">Screenshots/bookmyevent.html</a>

3. <strong>Coding Craft</strong> — Interactive Web Learning Playground
   [HTML5, CSS3 Architecture, JavaScript ES6+, Code Playground]
   Live App: <a href="https://nomaan2288.github.io/Coding-Craft/" target="_blank" class="text-accent underline">nomaan2288.github.io/Coding-Craft/</a>

4. <strong>Smart Home Safety</strong> — Multi-Sensor Hardware IoT Telemetry
   [NodeMCU ESP8266, C++, Python, Alert Protocols, Published Paper]
   Research Paper: <a href="IoT/Smart Home Safety & Awareness System .pdf" target="_blank" class="text-accent underline">Smart Home Safety.pdf</a>`,

    skills: () => `
<strong class="text-white">Engineering Arsenal:</strong>
• <strong>Backend & Systems:</strong> Java 17/21, Spring Boot 3, Spring Data JPA, Hibernate ORM, Multithreading, HikariCP.
• <strong>Databases & Storage:</strong> MySQL, 3NF Normalization, Indexing Optimization, ACID Transactions, Concurrency Locks.
• <strong>Contract APIs & Web:</strong> RESTful APIs, DTO Pattern, JSON Schemas, HTML5/CSS3, Modern Vanilla JavaScript (ES6+).
• <strong>Cloud & Hardware:</strong> Git/GitHub, Postman, AWS Cloud, IBM Cloud, NodeMCU ESP8266, Arduino C++, GenAI Workflows.`,

    experience: () => `
<strong class="text-white">Experience & Academics:</strong>
• <strong>Software Developer Intern @ LaunchPad Technology</strong> (Aug 2026 – Present)
  Architecting Spring Boot backend services, optimizing MySQL database schemas, and building RESTful microservices.
• <strong>B.Tech in Computer Science & Engineering</strong> (2022 – 2026)
  9.32 CGPA, Gold-standard distinction across 8 engineering semesters.`,

    contact: () => `
<strong class="text-white">Transmission Channels:</strong>
• Email: <span class="text-accent">${CONFIG.email}</span>
• GitHub: <a href="https://github.com/Nomaan2288" target="_blank" class="text-accent">github.com/Nomaan2288</a>
• LinkedIn: <a href="https://linkedin.com/in/shaikh-noman" target="_blank" class="text-accent">linkedin.com/in/shaikh-noman</a>
• Verified Resume: <a href="Resume/Noman Resume.pdf" target="_blank" class="text-accent">Noman Resume.pdf</a>`,

    date: () => `Current Local IST: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`,

    sudo: () => `<span style="color:#f43f5e">Access denied: Visitors are restricted from root elevation, but you are welcome to hire Shaikh Noman!</span>`
  };

  function initTerminal() {
    const modal = document.getElementById('terminal-modal');
    const input = document.getElementById('terminal-cli-input');
    const output = document.getElementById('terminal-output');

    if (!modal || !input || !output) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = input.value.trim();
        const cmd = raw.toLowerCase();
        input.value = '';
        if (!raw) return;

        sound.playClick();

        if (cmd === 'clear') {
          output.innerHTML = '';
          return;
        }

        const line = document.createElement('div');
        line.style.marginBottom = '12px';

        const prompt = `<div style="color:#64748b; font-size:0.78rem; margin-bottom:2px;"><span style="color:#8fcaff">guest@shaikh-noman</span>:<span style="color:#34d399">~</span>$ ${raw}</div>`;

        let resp = '';
        if (terminalCommands[cmd]) {
          resp = typeof terminalCommands[cmd] === 'function' ? terminalCommands[cmd]() : terminalCommands[cmd];
        } else {
          resp = `<span style="color:#f87171">Command not recognized: '${raw}'. Type <span style="color:#8fcaff; cursor:pointer;" onclick="PortfolioApp.runTermCmd('help')">help</span> for available commands.</span>`;
        }

        line.innerHTML = prompt + `<div style="padding-left:10px; border-left: 2px solid rgba(143,202,255,0.3); color:#d1d7e0;">${resp}</div>`;
        output.appendChild(line);

        const body = document.querySelector('.terminal-body');
        if (body) body.scrollTop = body.scrollHeight;
      }
    });

    window.runTermCmd = function (cmdName) {
      if (!input) return;
      input.value = cmdName;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.focus();
    };
  }

  function openTerminal() {
    const modal = document.getElementById('terminal-modal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('terminal-cli-input');
      if (input) setTimeout(() => input.focus(), 120);
      document.body.style.overflow = 'hidden';
      sound.playChime();
    }
  }

  function closeTerminal() {
    const modal = document.getElementById('terminal-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      sound.playClick();
    }
  }

  // --- 9. Reveal on Scroll (Intersection Observer) ---
  function initScrollReveal() {
    const nodes = document.querySelectorAll('.reveal-node');
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  // --- 10. Global Keyboard Shortcuts ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          closeTerminal();
        }
        return;
      }

      // DO NOT intercept when modifier keys (Ctrl, Cmd, Alt) are pressed
      // This guarantees native browser shortcuts (Ctrl+C copy text, Ctrl+V, etc.) work without interference
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // DO NOT trigger standalone shortcuts if user has active text selected on the page
      const currentSelection = window.getSelection ? window.getSelection().toString() : '';
      if (currentSelection && currentSelection.trim().length > 0) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'k') {
        e.preventDefault();
        const modal = document.getElementById('terminal-modal');
        if (modal && modal.classList.contains('active')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      } else if (key === 'c') {
        e.preventDefault();
        copyEmail();
      } else if (key === 'm') {
        e.preventDefault();
        sound.toggle();
      } else if (e.key === 'Escape') {
        closeTerminal();
      }
    });
  }

  // --- 11. Initialization on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initCursor();
    initLiveClock();
    initNavigation();
    initTerminal();
    initScrollReveal();
    initKeyboardShortcuts();
  });

  // --- 12. Public API Exposure ---
  window.PortfolioApp = {
    openTerminal,
    closeTerminal,
    runTermCmd: (cmd) => window.runTermCmd && window.runTermCmd(cmd),
    copyEmail,
    toggleSound: () => sound.toggle()
  };
})();
