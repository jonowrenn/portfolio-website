/* ============================================================
   YEAR
============================================================ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealSelectors = [
  ".projects-intro",
  ".pcard",
  ".skill-group",
  ".experience-item",
  ".outcome-card",
  ".contact-left",
  ".contact-right",
  ".section-heading-light",
];

document.querySelectorAll(revealSelectors.join(", ")).forEach((el) => {
  el.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
);

// Simple index-based stagger within each parent group
const groups = new Map();
document.querySelectorAll(".reveal").forEach((el) => {
  const key = el.parentElement;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(el);
});

groups.forEach((els) => {
  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 70}ms`;
    revealObserver.observe(el);
  });
});

/* ============================================================
   OUTCOME COUNTERS
============================================================ */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el) {
  const raw = el.textContent.trim();
  const isPercent = raw.endsWith("%");
  const isHrs = raw.endsWith("hrs");
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(easeOutQuart(progress) * num);
    if (isPercent) el.textContent = `${value}%`;
    else if (isHrs) el.textContent = `${value}hrs`;
    else el.textContent = `${value}+`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".outcome-stat").forEach((el) => {
  counterObserver.observe(el);
});

/* ============================================================
   ACTIVE NAV
============================================================ */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".site-nav__links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "nav-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((s) => navObserver.observe(s));
