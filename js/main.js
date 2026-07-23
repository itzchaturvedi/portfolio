/* ============================================
   Priyanshu Kuldeep — Portfolio Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initThemeToggle();
  initNavbar();
  initMobileNav();
  initScrollProgress();
  initCursorGlow();
  initScrollReveal();
  initTypewriter();
  initCounters();
  initActiveNavLink();
  initBackToTop();
  initParticles();
  initCardTilt();
  initButtonRipple();
  initContactForm();
});

/* ---------- Theme toggle (light / dark) ---------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem("portfolio-theme", next);
      apply(next);
    });
  }

  // Theme is already set synchronously by the inline head script (no-flash init);
  // just make sure listeners get the current value on load.
  apply(root.getAttribute("data-theme") || "light");
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = "2026";
}

/* ---------- Navbar background on scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Top scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* ---------- Cursor glow follow (desktop) ---------- */
function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow || window.matchMedia("(pointer: coarse)").matches) return;
  window.addEventListener("mousemove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

/* ---------- Scroll reveal via IntersectionObserver ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), (i % 6) * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Hero typewriter effect ---------- */
function initTypewriter() {
  const el = document.getElementById("typedRole");
  if (!el) return;

  const roles = [
    "Sitecore Developer",
    ".NET Developer",
    "Enterprise CMS Architect",
    "Backend Engineer",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 40 : 80);
  }

  tick();
}

/* ---------- Animated stat counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ---------- Active nav link highlighting on scroll (index page) ---------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("visible", window.scrollY > 500),
    { passive: true }
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Lightweight canvas particle background (hero) ---------- */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particleRGB = document.documentElement.getAttribute("data-theme") === "light"
    ? "55, 99, 214"
    : "120, 170, 255";
  document.addEventListener("themechange", (e) => {
    particleRGB = e.detail.theme === "light" ? "55, 99, 214" : "120, 170, 255";
  });

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleRGB}, ${p.alpha})`;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

/* ---------- 3D tilt-on-hover for cards ---------- */
function initCardTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selectors = ".project-card, .skill-card, .timeline-card, .stat-card, .education-card";
  document.querySelectorAll(selectors).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = "transform 0.08s ease-out";
      card.style.transform = `perspective(700px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.4s ease";
      card.style.transform = "";
    });
  });
}

/* ---------- Ripple effect on button click ---------- */
function initButtonRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

/* ---------- Confetti burst (celebratory success feedback) ---------- */
function fireConfetti(originEl) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#4f8cff", "#8b5cf6", "#22d3c7", "#2ecc71"];
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top;

  for (let i = 0; i < 26; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 5;
    piece.style.position = "fixed";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.4}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.borderRadius = "2px";
    piece.style.zIndex = "300";
    piece.style.pointerEvents = "none";
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 60;
    const rotation = Math.random() * 720 - 360;

    piece
      .animate(
        [
          { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${dx}px, ${dy + 220}px) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(0.25, 0.8, 0.25, 1)" }
      )
      .onfinish = () => piece.remove();
  }
}

/* ---------- Contact form: validation + Formspree AJAX submit ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const toast = document.getElementById("toast");

  const rules = {
    name: (v) => v.trim().length > 1,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    subject: (v) => v.trim().length > 2,
    message: (v) => v.trim().length > 9,
  };

  function validateField(input) {
    const key = input.name === "_replyto" ? "email" : input.name;
    const rule = rules[key];
    if (!rule) return true;
    const valid = rule(input.value);
    const wrap = input.closest(".form-field");
    if (wrap) wrap.classList.toggle("invalid", !valid);
    return valid;
  }

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".form-field")?.classList.contains("invalid")) validateField(input);
    });
  });

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("error", !!isError);
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 4500);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently drop (bot submission)
    const honeypot = form.querySelector(".honeypot");
    if (honeypot && honeypot.value) return;

    const inputs = Array.from(form.querySelectorAll("input[name], textarea[name]")).filter(
      (i) => i.name !== "_gotcha"
    );
    const allValid = inputs.every((input) => validateField(input));
    if (!allValid) {
      showToast("Please fix the highlighted fields.", true);
      return;
    }

    const endpoint = form.getAttribute("action");
    if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
      showToast("Form endpoint not configured yet — see the note below the form.", true);
      return;
    }

    const nameVal = form.querySelector('[name="name"]').value.trim();
    const subjectVal = form.querySelector('[name="subject"]').value.trim();
    const subjectField = form.querySelector('[name="_subject"]');
    if (subjectField) subjectField.value = `Portfolio contact from ${nameVal} — ${subjectVal}`;

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        showToast("Message sent — thanks for reaching out! I'll reply soon.", false);
        fireConfetti(submitBtn);
        form.reset();
        form.querySelectorAll(".form-field").forEach((f) => f.classList.remove("invalid"));
      } else {
        showToast("Something went wrong sending your message. Please try again.", true);
      }
    } catch (err) {
      showToast("Network error — please check your connection and try again.", true);
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
}
