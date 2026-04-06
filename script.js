// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal — fade + slide up on entry
const revealEls = document.querySelectorAll(
  ".hero__sidebar, .hero__main, .projects-intro, .projects-sublabel, .project-card, .skills-heading, .skill-row, .experience-item, .outcome-card, .contact-left, .contact-right, .freelance-bar"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = `opacity 600ms ease ${i % 4 * 80}ms, transform 600ms ease ${i % 4 * 80}ms`;
  revealObserver.observe(el);
});

// is-visible state
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = ".is-visible { opacity: 1 !important; transform: translateY(0) !important; }";
  document.head.appendChild(style);
});
