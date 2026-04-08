/* ============================================================
   YEAR
============================================================ */
document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
);

const groups = new Map();
document.querySelectorAll(".reveal").forEach((el) => {
  const key = el.parentElement;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(el);
});

groups.forEach((els) => {
  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    revealObserver.observe(el);
  });
});

/* ============================================================
   OUTCOME COUNTERS
============================================================ */
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

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

new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        entry.target._counted = true;
      }
    });
  },
  { threshold: 0.6 }
).observe && document.querySelectorAll(".outcome-stat").forEach((el) => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !el._counted) {
        animateCounter(el);
        el._counted = true;
      }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
});

/* ============================================================
   ACTIVE TAB / FILE TREE / STATUS BAR — update on scroll
============================================================ */
const sections = document.querySelectorAll("section[id]");
const tabs = document.querySelectorAll(".tab[data-tab]");
const ftItems = document.querySelectorAll(".ft-item[data-file]");
const titleFile = document.getElementById("title-file");
const statusFile = document.getElementById("status-file");

function setActive(id) {
  tabs.forEach((t) => t.classList.toggle("tab--active", t.dataset.tab === id));
  ftItems.forEach((f) => f.classList.toggle("ft-active", f.dataset.file === id));
  const name = `${id}.tsx`;
  if (titleFile) titleFile.textContent = name;
  if (statusFile) statusFile.textContent = name;
}

new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { threshold: 0.3 }
).observe ? (() => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    },
    { threshold: 0.3 }
  );
  sections.forEach((s) => obs.observe(s));
})() : null;

/* ============================================================
   TYPING ANIMATION — hero code block
============================================================ */
const heroCodeBlock = document.getElementById('hero-code-block');
if (heroCodeBlock) {
  const fullHTML = heroCodeBlock.innerHTML;
  heroCodeBlock.innerHTML = '';
  let i = 0;
  let buffer = '';

  function typeNextChar() {
    if (i >= fullHTML.length) return;

    // Consume all HTML tags instantly (no visual delay)
    while (i < fullHTML.length && fullHTML[i] === '<') {
      const end = fullHTML.indexOf('>', i);
      buffer += fullHTML.slice(i, end + 1);
      i = end + 1;
    }

    if (i < fullHTML.length) {
      buffer += fullHTML[i++];
      heroCodeBlock.innerHTML = buffer;
      setTimeout(typeNextChar, 11);
    } else {
      heroCodeBlock.innerHTML = buffer;
    }
  }

  setTimeout(typeNextChar, 350);
}

/* ============================================================
   LN X, COL X — status bar scroll tracker
============================================================ */
const statusLn = document.getElementById('status-ln');
if (statusLn) {
  function updateLn() {
    const scrolled = window.scrollY;
    const total = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const ln = Math.max(1, Math.round((scrolled / total) * 310));
    statusLn.textContent = `Ln ${ln}, Col 1`;
  }
  window.addEventListener('scroll', updateLn, { passive: true });
  updateLn();
}

/* ============================================================
   COPY EMAIL
============================================================ */
const copyEmailBtn = document.querySelector('.copy-email-btn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('jw4544@columbia.edu').then(() => {
      copyEmailBtn.textContent = '✓ Copied!';
      copyEmailBtn.classList.add('copy-email-btn--copied');
      setTimeout(() => {
        copyEmailBtn.textContent = 'Copy email';
        copyEmailBtn.classList.remove('copy-email-btn--copied');
      }, 2000);
    });
  });
}
