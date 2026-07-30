// Enable JS reveal animations
document.documentElement.classList.add('js');

// ===================== INDEX / SLIDE MENU =====================
const menuOpen = document.getElementById('menuOpen');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');

menuOpen.addEventListener('click', () => menuOverlay.classList.add('open'));
menuClose.addEventListener('click', () => menuOverlay.classList.remove('open'));
menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) menuOverlay.classList.remove('open');
});
document.querySelectorAll('.menu-list a').forEach(link => {
  link.addEventListener('click', () => menuOverlay.classList.remove('open'));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') menuOverlay.classList.remove('open');
});

// ===================== TABS (Individual Investigations) =====================
const tabPills = document.querySelectorAll('.tab-pill');
const tabPanels = document.querySelectorAll('.tab-panel');

tabPills.forEach(pill => {
  pill.addEventListener('click', () => {
    tabPills.forEach(p => p.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${pill.dataset.tab}"]`).classList.add('active');
  });
});

// ===================== STRIP SIMULATION (drag & drop) =====================
function initBench(benchEl) {
  const benchKey = benchEl.dataset.bench; // "cabbage" | "turmeric"
  const strip = benchEl.querySelector('.strip');
  const stations = benchEl.querySelectorAll('.station');
  const msg = document.getElementById(`sim-msg-${benchKey}`);
  let soaked = false;

  function setMessage(text, success) {
    msg.innerHTML = `<span class="dot"></span> ${text}`;
    msg.classList.toggle('success', !!success);
  }

  function handleDrop(station) {
    const role = station.dataset.role;

    if (role === 'source') {
      // Soak the strip
      soaked = true;
      strip.classList.add(benchKey === 'cabbage' ? 'soaked-cabbage' : 'soaked-turmeric');
      setMessage('Strip soaked. Now drag it into a reagent to test its pH response.', false);
      return;
    }

    if (role === 'reagent') {
      if (!soaked) {
        setMessage('Soak the strip in the indicator source first, then try a reagent.', false);
        return;
      }
      const color = station.dataset.color;
      const name = station.dataset.name;
      const ph = station.dataset.ph;
      strip.style.background = `linear-gradient(180deg, #efe9da 0%, #efe9da 25%, ${color} 25%)`;

      const phLabel = ph === 'acid' ? 'acidic' : ph === 'alkaline' ? 'alkaline' : 'neutral';
      setMessage(`Reacted with ${name} (${phLabel}) — the strip turned the matching colour. Drag it back to the source to reset and try another reagent.`, true);
    }
  }

  // Native HTML5 drag events (desktop)
  strip.addEventListener('dragstart', (e) => {
    strip.classList.add('dragging');
    e.dataTransfer.setData('text/plain', benchKey);
  });
  strip.addEventListener('dragend', () => strip.classList.remove('dragging'));

  stations.forEach(station => {
    station.addEventListener('dragover', (e) => {
      e.preventDefault();
      station.classList.add('drop-hover');
    });
    station.addEventListener('dragleave', () => station.classList.remove('drop-hover'));
    station.addEventListener('drop', (e) => {
      e.preventDefault();
      station.classList.remove('drop-hover');
      handleDrop(station);
    });
  });

  // Touch / click fallback for mobile: tap strip to "arm" it, then tap a station
  let armed = false;
  strip.addEventListener('click', () => {
    armed = !armed;
    strip.style.outline = armed ? '2px dashed #f0a03c' : 'none';
  });
  stations.forEach(station => {
    station.addEventListener('click', () => {
      if (!armed) return;
      handleDrop(station);
      armed = false;
      strip.style.outline = 'none';
    });
  });
}

document.querySelectorAll('.bench').forEach(initBench);

// ===================== PAGE REVEAL ANIMATIONS =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const revealTargets = document.querySelectorAll('.hero-inner, .tag-row, .btn-row, .scroll-hint, .section, .card, .bench, .sample, .ref-card, .finale-inner, .site-footer, .scale-14 div, .menu-list li, .tab-pill, .ph-ref, .sample-photo');
revealTargets.forEach(el => revealObserver.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('.hero-inner, .tag-row, .btn-row, .scroll-hint').forEach(el => el.classList.add('visible'));
});