/* ===== Año dinámico en el footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Menú móvil ===== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ===== Efecto de escritura (typing) en el HERO ===== */
function typeText(el, text, speed) {
  return new Promise(resolve => {
    let i = 0;
    (function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i++);
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    })();
  });
}

async function runHeroAnimation() {
  const t1 = document.querySelector('.typed');
  const t2 = document.querySelector('.typed-2');
  const out1 = document.querySelector('.out-1');
  const out2 = document.querySelector('.out-2');

  await typeText(t1, t1.dataset.text, 70);
  await new Promise(r => setTimeout(r, 250));
  out1.style.opacity = '1';
  await new Promise(r => setTimeout(r, 500));
  await typeText(t2, t2.dataset.text, 70);
  await new Promise(r => setTimeout(r, 250));
  out2.style.opacity = '1';
}
window.addEventListener('load', runHeroAnimation);

/* ===== Scroll reveal + barras de habilidad ===== */
document.querySelectorAll('.section').forEach(s => s.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animar barras de habilidad cuando entran en pantalla
      entry.target.querySelectorAll('.bar').forEach(b => b.classList.add('animate'));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===== Fondo de código binario (matrix) — OPTIMIZADO ===== */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d', { alpha: true });
let columns, drops, width, height;
const chars = '01';
const fontSize = 16; // mayor = menos columnas = más rendimiento

function initMatrix() {
  // Limitamos la resolución del canvas (sin devicePixelRatio) para ahorrar GPU
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = new Array(columns).fill(0).map(() => Math.random() * height / fontSize);
  ctx.font = fontSize + 'px monospace';
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(13, 17, 23, 0.10)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#6fbf4f';
  for (let i = 0; i < columns; i++) {
    const text = chars[(Math.random() * 2) | 0];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}

/* Control de FPS y pausa automática para fluidez */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TARGET_FPS = 18;            // suficiente para el efecto, muy ligero
const frameInterval = 1000 / TARGET_FPS;
let lastTime = 0, rafId = null, running = false;

function loop(now) {
  if (!running) return;
  rafId = requestAnimationFrame(loop);
  if (now - lastTime < frameInterval) return; // throttle de FPS
  lastTime = now;
  drawMatrix();
}

function startMatrix() {
  if (running || prefersReduced) return;
  running = true;
  rafId = requestAnimationFrame(loop);
}
function stopMatrix() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
}

if (!prefersReduced) {
  initMatrix();
  startMatrix();
  // Pausa cuando la pestaña no está visible (ahorra CPU/batería)
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stopMatrix() : startMatrix()
  );
  // Redimensionar con "debounce" para no recalcular en cada pixel
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMatrix, 200);
  });
}
