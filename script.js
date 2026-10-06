/**
 * SHAIKH NOMAN | SENIOR FULL STACK & BACKEND ENGINEER
 * Motion Design Architecture & Interaction Engine
 */

(function () {
  'use strict';

  // --- 1. Sound Synthesis Engine (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.enabled = localStorage.getItem('sound_enabled') === 'true';
      this.ctx = null;
      this.updateUI();
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('sound_enabled', this.enabled ? 'true' : 'false');
      this.updateUI();
      if (this.enabled) {
        this.init();
        this.playChirp(600, 0.05);
      }
    }

    updateUI() {
      const btn = document.getElementById('sound-toggle-btn');
      if (btn) {
        btn.innerHTML = this.enabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        btn.setAttribute('title', this.enabled ? 'Mute Interface Sounds [M]' : 'Enable Tactile Interface Sounds [M]');
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {
        // Audio policy ignore
      }
    }

    playChirp(freq = 550, duration = 0.08) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy ignore
      }
    }
  }

  const sound = new SoundEngine();

  // --- 2. Theme System ---
  function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeBtn(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeBtn(next);
    sound.playChirp(next === 'dark' ? 440 : 880, 0.06);
    showToast(`Switched to ${next.toUpperCase()} theme`);
  }

  function updateThemeBtn(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode [T]' : 'Switch to Dark Mode [T]');
    }
  }

  // --- 3. Subtle Button Micro-Interactions (Native Professional Cursor) ---
  function initButtonInteractions() {
    // Gentle spring pull on CTA buttons (respecting native mouse cursor)
    document.querySelectorAll('.btn-primary-magnetic, .btn-secondary-magnetic, .control-btn').forEach((elem) => {
      elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.15;
        const deltaY = (e.clientY - centerY) * 0.15;
        elem.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      elem.addEventListener('mouseleave', () => {
        elem.style.transform = '';
      });
    });
  }

  // --- 4. Live IST Telemetry Clock ---
  function initTimeClock() {
    function updateClock() {
      const now = new Date();
      // IST is UTC+5:30
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = now.toLocaleTimeString('en-US', options);
      const clockElem = document.getElementById('live-ist-time');
      if (clockElem) {
        clockElem.textContent = `${timeStr} IST (UTC+5:30)`;
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- 5. Project Screenshot Gallery Modal ---
  const projectGalleries = {
    bookmyevent: {
      title: 'BookMyEvent — Full Stack Event & Ticket Platform',
      images: [
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121347.png', caption: 'Home Page — Dynamic Hero with Featured Carousel' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121412.png', caption: 'Events & Movies Listing — Multi-category Filtering' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121608.png', caption: 'Interactive Seat Selection — Real-Time Concurrency Lock' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121623.png', caption: 'Payment Simulation & Order Summary' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121706.png', caption: 'Ticket Confirmation with Unique Booking QR' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121252.png', caption: 'User Authentication & Session Management' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121311.png', caption: 'Sign Up with Input Sanitization' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121326.png', caption: 'Password Recovery with OTP Verification' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 121735.png', caption: 'User Dashboard & Booking History' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 122037.png', caption: 'Admin Control Center & Event Operations' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 122111.png', caption: 'Admin User Management & Role Permissions' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 122147.png', caption: 'Venue & Schedule Slot Manager' },
        { src: 'Screenshots/bookmyevent/Screenshot 2025-10-22 122334.png', caption: 'Event Publishing & Pricing Tiers' }
      ]
    },
    spotadz: {
      title: 'SpotAdz — Billboard & Hoarding Booking Marketplace',
      images: [
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213344.png', caption: 'Advertiser Portal — Registration & KYC Onboarding' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213412.png', caption: 'Secure Login & Role-Based Redirection' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213439.png', caption: 'Password Recovery Flow' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213459.png', caption: 'Admin Inventory & Live Billboard Status' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213556.png', caption: 'Advertiser Booking Dashboard & Slot Calendar' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213614.png', caption: 'Invoice & Payment Ledger' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213712.png', caption: 'Client Directory & Access Governance' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213737.png', caption: 'Create Billboard Campaign & Schedule Slot' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213754.png', caption: 'Central Reservation Pipeline' },
        { src: 'Screenshots/spotadz/Screenshot 2025-10-21 213827.png', caption: 'Analytics & Downloadable Executive Reports' }
      ]
    }
  };

  let currentGalleryKey = null;
  let currentGalleryIndex = 0;

  function openGallery(key, index = 0) {
    if (!projectGalleries[key]) return;
    currentGalleryKey = key;
    currentGalleryIndex = index;
    const gallery = projectGalleries[key];

    const modal = document.getElementById('gallery-modal');
    const title = document.getElementById('gallery-modal-title');
    const strip = document.getElementById('gallery-thumbnails');

    title.textContent = gallery.title;

    // Build thumbnails
    strip.innerHTML = '';
    gallery.images.forEach((item, i) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${i === index ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${item.src}" alt="Thumb ${i + 1}" loading="lazy">`;
      thumb.onclick = () => {
        setGalleryIndex(i);
        sound.playClick();
      };
      strip.appendChild(thumb);
    });

    renderGalleryImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    sound.playChirp(700, 0.08);
  }

  function setGalleryIndex(index) {
    const gallery = projectGalleries[currentGalleryKey];
    if (!gallery) return;
    if (index < 0) index = gallery.images.length - 1;
    if (index >= gallery.images.length) index = 0;
    currentGalleryIndex = index;

    // Update active thumb
    const thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
      if (i === index) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    renderGalleryImage();
  }

  function renderGalleryImage() {
    const gallery = projectGalleries[currentGalleryKey];
    if (!gallery) return;
    const item = gallery.images[currentGalleryIndex];

    const mainImg = document.getElementById('gallery-main-img');
    const caption = document.getElementById('gallery-caption');
    const counter = document.getElementById('gallery-counter');

    mainImg.src = item.src;
    caption.textContent = item.caption;
    counter.textContent = `${currentGalleryIndex + 1} / ${gallery.images.length}`;
  }

  function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      sound.playClick();
    }
  }

  // --- 6. Interactive Developer Console (Terminal Drawer) ---
  const terminalCommands = {
    help: () => `
Available commands:
  <span style="color:#60a5fa">about</span>      - Senior backend engineer background
  <span style="color:#60a5fa">skills</span>     - Comprehensive technical architecture & languages
  <span style="color:#60a5fa">projects</span>   - Production & academic software showcase
  <span style="color:#60a5fa">exp</span>        - Industry internships & engineering experience
  <span style="color:#60a5fa">certs</span>      - Verified cloud credentials (AWS & IBM)
  <span style="color:#60a5fa">contact</span>    - Direct communication channels & email
  <span style="color:#60a5fa">resume</span>     - Open verified curriculum vitae PDF
  <span style="color:#60a5fa">theme</span>      - Toggle obsidian / studio light palette
  <span style="color:#60a5fa">clear</span>      - Clear terminal screen
`,
    about: () => `
<strong style="color:#f8fafc">Shaikh Noman</strong> — Software Developer Intern at <strong style="color:#60a5fa">LaunchPad Technology</strong> (August 2026 – Present) & Computer Science Engineering Undergraduate (9.32 CGPA).
Specialized in Java Backend Systems, Spring Boot Microservices, Concurrency, MySQL Schema Optimization, and Generative AI workflows.
`,
    skills: () => `
<strong style="color:#60a5fa">[Backend]</strong>     Java, Spring Boot, Hibernate, JSP/Servlet, Node.js, Express, REST APIs
<strong style="color:#34d399">[Databases]</strong>   MySQL (Indexes, ACID, Stored Procedures), MongoDB
<strong style="color:#f472b6">[Frontend]</strong>    React.js, JavaScript (ES6+), HTML5, CSS3, Modern UI Systems
<strong style="color:#fbbf24">[Cloud & AI]</strong>   Google Build with AI, AWS Cloud Foundations, IBM Cloud, Git/GitHub, Maven
<strong style="color:#a78bfa">[IoT & Hardware]</strong> Arduino UNO, NodeMCU (ESP8266), Python Telemetry
`,
    projects: () => `
1. <strong style="color:#60a5fa">BookMyEvent</strong>: Enterprise event ticket booking platform with real-time seat lock and payment simulation.
2. <strong style="color:#60a5fa">SpotAdz</strong>: Billboard advertising booking marketplace with advertiser & administrative portals.
3. <strong style="color:#60a5fa">Coding Craft</strong>: Interactive coding portal with real-time browser preview tutorials.
4. <strong style="color:#60a5fa">Smart Home System</strong>: Multi-sensor IoT monitoring framework with real-time hazard alerts.
`,
    exp: () => `
• <strong style="color:#34d399">Software Developer Intern</strong> @ LaunchPad Technology (<span style="color:#60a5fa">Aug 2026 – Present</span>)
  Architecting backend services, full-stack application development, API integrations, and system scalability.
• <strong style="color:#f8fafc">Java Developer Intern</strong> @ Royal Technosoft Pvt. Ltd. (Dec 2024 – Apr 2025)
  Database modeling, Java web apps, backend logic & API implementation.
• <strong style="color:#f8fafc">MERN Stack Intern</strong> @ LaunchPad Technology (Jun 2024 – Jul 2024)
  Full stack web development, REST integration, debugging & quality assurance.
`,
    certs: () => `
• <strong style="color:#60a5fa">Google for Developers: Build with AI Bootcamp</strong> (ID: 2026H2S09BWAIBAHM-P00226 | Sep 2026)
• <strong style="color:#60a5fa">ISRO: Bharatiya Antariksh Hackathon 2026</strong> (ID: 2026H2SO6BAH-P00396 | ISRO & Hack2skill)
• <strong style="color:#60a5fa">AWS Academy Graduate: Cloud Foundations</strong> (Issued Oct 2025) — Credly Verified
• <strong style="color:#60a5fa">IBM Cloud Computing Fundamentals</strong> (Issued Sep 2025) — Credly Verified
`,
    contact: () => `
Email:    <a href="mailto:shaikhnoman0652@gmail.com" style="color:#60a5fa">shaikhnoman0652@gmail.com</a>
GitHub:   <a href="https://github.com/Nomaan2288" target="_blank" style="color:#60a5fa">github.com/Nomaan2288</a>
LinkedIn: <a href="https://www.linkedin.com/in/shaikh-noman-m2288" target="_blank" style="color:#60a5fa">linkedin.com/in/shaikh-noman-m2288</a>
Location: Gujarat, India (UTC +5:30)
`,
    resume: () => {
      window.open('Resume/Noman Resume.pdf', '_blank');
      return 'Opening Noman Resume.pdf in new tab...';
    },
    theme: () => {
      toggleTheme();
      return 'Toggled active interface color scheme.';
    },
    sudo: () => 'Permission denied: Visitors do not have root privileges, but you are welcome to hire me!',
    date: () => new Date().toLocaleString()
  };

  function initTerminal() {
    const modal = document.getElementById('terminal-modal');
    const input = document.getElementById('terminal-cli-input');
    const output = document.getElementById('terminal-output');

    if (!input || !output) return;

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

        const prompt = `<div style="color:#94a3b8; font-size:0.8rem; margin-bottom:2px;"><span style="color:#3b82f6">guest@shaikh-noman</span>:<span style="color:#10b981">~</span>$ ${raw}</div>`;

        let resp = '';
        if (terminalCommands[cmd]) {
          resp = typeof terminalCommands[cmd] === 'function' ? terminalCommands[cmd]() : terminalCommands[cmd];
        } else {
          resp = `<span style="color:#f43f5e">Command not recognized: '${raw}'. Type <span style="color:#60a5fa; cursor:pointer;" onclick="runTermCmd('help')">help</span> for available commands.</span>`;
        }

        line.innerHTML = prompt + `<div style="padding-left:8px; border-left: 2px solid rgba(59,130,246,0.3);">${resp}</div>`;
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
      if (input) setTimeout(() => input.focus(), 100);
      sound.playChirp(800, 0.08);
      document.body.style.overflow = 'hidden';
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

  // --- 7. Project Filtering System ---
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-modern');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        sound.playClick();

        projectCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat.includes(cat)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // --- 8. Copy Email to Clipboard with Toast ---
  function showToast(message) {
    const toast = document.getElementById('toast-feedback');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    sound.playChirp(900, 0.05);

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyEmail() {
    const email = 'shaikhnoman0652@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied shaikhnoman0652@gmail.com to clipboard! 📋');
    }).catch(() => {
      showToast('Failed to copy. Please use mailto link.');
    });
  }

  // --- 9. EmailJS Form Handling & Direct Mail Client ---
  function setFormField(form, name, value) {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
  }

  function openMailClient() {
    const form = document.getElementById('contactForm');
    const name = form ? (form.querySelector('[name="from_name"]')?.value.trim() || '') : '';
    const email = form ? (form.querySelector('[name="reply_to"]')?.value.trim() || '') : '';
    const msg = form ? (form.querySelector('[name="message"]')?.value.trim() || '') : '';

    const subject = encodeURIComponent(name ? `Engineering Discussion — ${name}` : 'Software Engineering Opportunity');
    const body = encodeURIComponent(`Hi Shaikh Noman,\n\n${msg || 'I would like to discuss an engineering opportunity with you.'}\n\nBest regards,\n${name}\n${email}`);
    window.location.href = `mailto:shaikhnoman0652@gmail.com?subject=${subject}&body=${body}`;
  }

  function initEmailForm() {
    const form = document.getElementById('contactForm');
    const statusAlert = document.getElementById('form-status-alert');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form) return;

    if (window.emailjs) {
      emailjs.init("8_b-U2usEu90CDWvj");
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sound.playClick();

      const fromName = form.querySelector('[name="from_name"]').value.trim();
      const userEmail = form.querySelector('[name="reply_to"]').value.trim();

      // Ensure user's email is bound to all potential EmailJS template fields
      setFormField(form, 'reply_to', userEmail);
      setFormField(form, 'user_email', userEmail);
      setFormField(form, 'from_email', userEmail);
      setFormField(form, 'email', userEmail);
      setFormField(form, 'sender_email', userEmail);
      setFormField(form, 'to_name', 'Shaikh Noman');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending Message...';
      }

      if (statusAlert) {
        statusAlert.className = 'form-status-alert';
        statusAlert.style.display = 'none';
      }

      if (!window.emailjs) {
        openMailClient();
        resetBtn();
        return;
      }

      emailjs.sendForm("service_k0f6w2o", "template_5tb4il5", this)
        .then(() => {
          if (statusAlert) {
            statusAlert.className = 'form-status-alert success';
            statusAlert.innerHTML = '<i class="fas fa-check-circle"></i> <span>Thank you! Your message has been sent successfully. Noman will respond directly to ' + userEmail + '.</span>';
            statusAlert.style.display = 'flex';
          }
          form.reset();
          showToast('Message sent successfully! 🚀');
          sound.playChirp(950, 0.12);
          resetBtn();
        })
        .catch((err) => {
          console.error(err);
          showError('Unable to send via web gateway. You can send directly via your mail client.');
          resetBtn();
        });

      function showError(msg) {
        if (statusAlert) {
          statusAlert.className = 'form-status-alert error';
          statusAlert.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>${msg}</span> <button type="button" class="btn btn-sm btn-outline-light ms-2" onclick="PortfolioApp.openMailClient()">Open Mail App</button>`;
          statusAlert.style.display = 'flex';
        }
      }

      function resetBtn() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Send Message';
        }
      }
    });
  }

  // --- 10. Scroll Progress, Navbar Scroll & Scroll to Top ---
  function initScrollBehaviors() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    const nav = document.querySelector('.navbar-custom');
    const scrollTopBtn = document.querySelector('.btn-scroll-top');

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

      if (progressBar) progressBar.style.width = `${scrolled}%`;

      if (nav) {
        nav.classList.toggle('scrolled', winScroll > 40);
      }

      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', winScroll > 400);
      }
    }, { passive: true });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        sound.playClick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile nav toggle
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        sound.playClick();
      });

      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
        });
      });
    }
  }

  // --- 11. Staggered IntersectionObserver Reveal ---
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  }

  // --- 12. Global Keyboard Shortcuts ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing inside input / textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          closeTerminal();
          closeGallery();
        }
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 't') {
        e.preventDefault();
        toggleTheme();
      } else if (key === 'k') {
        e.preventDefault();
        const term = document.getElementById('terminal-modal');
        if (term && term.classList.contains('active')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      } else if (key === 'm') {
        e.preventDefault();
        sound.toggle();
      } else if (key === 'c') {
        e.preventDefault();
        copyEmail();
      } else if (e.key === 'Escape') {
        closeTerminal();
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        const modal = document.getElementById('gallery-modal');
        if (modal && modal.classList.contains('active')) {
          setGalleryIndex(currentGalleryIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        const modal = document.getElementById('gallery-modal');
        if (modal && modal.classList.contains('active')) {
          setGalleryIndex(currentGalleryIndex + 1);
        }
      }
    });
  }

  // --- 13. Expose Public Functions ---
  window.PortfolioApp = {
    toggleTheme,
    toggleSound: () => sound.toggle(),
    openTerminal,
    closeTerminal,
    openGallery,
    closeGallery,
    setGalleryIndex,
    copyEmail,
    openMailClient,
    nextGalleryImg: () => setGalleryIndex(currentGalleryIndex + 1),
    prevGalleryImg: () => setGalleryIndex(currentGalleryIndex - 1)
  };

  // --- Document Ready Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initButtonInteractions();
    initTimeClock();
    initProjectFilters();
    initEmailForm();
    initTerminal();
    initScrollBehaviors();
    initScrollReveal();
    initKeyboardShortcuts();

    // Typed hero loop if Typed.js available
    const typedTarget = document.getElementById('typed-hero');
    if (typedTarget && window.Typed) {
      new Typed('#typed-hero', {
        strings: [
          'Java Backend Specialist',
          'Spring Boot & Microservices',
          'Full Stack Web Architect',
          'REST API & Distributed Systems'
        ],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 1800,
        loop: true,
        showCursor: true,
        cursorChar: '_'
      });
    }
  });

})();

