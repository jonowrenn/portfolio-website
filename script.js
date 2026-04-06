/* ============================================================
   YEAR
============================================================ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   SCROLL REVEAL — staggered fade + slide up
============================================================ */
const revealSelectors = [
  ".hero__sidebar",
  ".hero__main",
  ".projects-intro",
  ".pcard",
  ".skill-group",
  ".experience-item",
  ".outcome-card",
  ".contact-left",
  ".contact-right",
  ".section-heading-light",
  ".section-heading",
  ".section-label",
];

const revealEls = document.querySelectorAll(revealSelectors.join(", "));

revealEls.forEach((el) => {
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
  { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
);

// Stagger siblings in the same parent
revealEls.forEach((el) => {
  const siblings = Array.from(el.parentElement.querySelectorAll(":scope > .reveal"));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 80}ms`;
  revealObserver.observe(el);
});

/* ============================================================
   OUTCOME COUNTERS — count up on scroll into view
============================================================ */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el) {
  const raw = el.textContent.trim();
  const isPercent = raw.endsWith("%");
  const isHrs = raw.endsWith("hrs");
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * num);
    el.textContent = isPercent ? `${value}%` : isHrs ? `${value}hrs` : `${value}+`;
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
  { threshold: 0.5 }
);

document.querySelectorAll(".outcome-stat").forEach((el) => {
  counterObserver.observe(el);
});

/* ============================================================
   ACTIVE NAV — highlight current section
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
  { threshold: 0.3 }
);

sections.forEach((section) => navObserver.observe(section));
