// 1. SPLIT HERO NAME INTO ANIMATED LETTERS
const nameHeading = document.getElementById("animated-name");
if (nameHeading) {
  const text = nameHeading.textContent;
  nameHeading.innerHTML = "";
  text.split("").forEach((char, idx) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.animationDelay = `${idx * 0.045}s`;
    nameHeading.appendChild(span);
  });
}

// 2. TYPEWRITER EFFECT
const roles = [
  "Full Stack Developer.",
  "Python & Django Builder.",
  "UI/UX Animation Enthusiast.",
  "AI & Data Science Graduate."
];
let rIdx = 0, cIdx = 0, isDel = false;
const tw = document.getElementById("typewriter");

function runTypewriter() {
  const current = roles[rIdx];
  tw.textContent = current.slice(0, cIdx);
  if (!isDel && cIdx < current.length) {
    cIdx++;
    setTimeout(runTypewriter, 85);
  } else if (!isDel) {
    isDel = true;
    setTimeout(runTypewriter, 1500);
  } else if (isDel && cIdx > 0) {
    cIdx--;
    setTimeout(runTypewriter, 45);
  } else {
    isDel = false;
    rIdx = (rIdx + 1) % roles.length;
    setTimeout(runTypewriter, 300);
  }
}
if (tw) runTypewriter();

// 3. CUSTOM CURSOR & MAGNETIC BUTTONS
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
window.addEventListener("mousemove", (e) => {
  if (dot && ring) {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    ring.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 250, fill: "forwards" });
  }
});

document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

// 4. 3D TILT EFFECT ON HERO CARD
const heroCard = document.getElementById("hero-card");
if (heroCard) {
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg)`;
  });
  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

// 5. DUPLICATE MARQUEE ITEMS FOR SEAMLESS INFINITE LOOP
document.querySelectorAll(".marquee-track").forEach((track) => {
  const items = Array.from(track.children);
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
});

// 6. SCROLL REVEAL & ANIMATED COUNTERS
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("active");

    entry.target.querySelectorAll(".counter").forEach((counter) => {
      const target = +counter.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target + (target === 100 ? "%" : "+");
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 30);
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// 7. SCROLL PROGRESS BAR & STICKY PROJECT STACKING SCALE
const progressBar = document.getElementById("scroll-progress");
const stackCards = Array.from(document.querySelectorAll(".project-stack-card"));

window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  if (progressBar) progressBar.style.width = pct + "%";

  stackCards.forEach((card, i) => {
    const next = stackCards[i + 1];
    if (!next) return;
    const diff = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, 1 - (diff - 40) / 400));
    card.style.transform = `scale(${1 - progress * 0.06})`;
    card.style.filter = `brightness(${1 - progress * 0.45})`;
  });
});

// 8. INTERACTIVE PARTICLE NETWORK CANVAS
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];
  const mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  for (let i = 0; i < 65; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2 + 1
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(138, 77, 255, 0.7)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }

      if (mouse.x) {
        const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mDist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 61, 139, ${0.35 * (1 - mDist / 150)})`;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// 9. CONTACT FORM MAILTO
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const [name, email, msg] = form.querySelectorAll("input, textarea");
    document.getElementById("form-msg").textContent = "Opening your mail app...";
    location.href = `mailto:abinayan985@gmail.com?subject=${encodeURIComponent("Portfolio Message from " + name.value)}&body=${encodeURIComponent(msg.value + "\n\nFrom: " + email.value)}`;
    form.reset();
  });
}