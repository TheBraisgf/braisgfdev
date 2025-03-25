document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  const container = document.getElementById("planet-container");
  const spaceship = document.querySelector(".spaceship");
  const intro = document.querySelector(".intro-text");

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // === ESTRELLAS EN MOVIMIENTO ===
  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    dx: 0.1 + Math.random() * 0.2,
    dy: 0.1 + Math.random() * 0.2,
  }));

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let s of stars) {
      s.x -= s.dx;
      s.y += s.dy;
      if (s.x < 0) s.x = canvas.width;
      if (s.y > canvas.height) s.y = 0;
      ctx.moveTo(s.x, s.y);
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    }
    ctx.fillStyle = "white";
    ctx.fill();
    requestAnimationFrame(animateStars);
  }
  animateStars();

  // === PLANETAS ===
  const socials = await fetch("/social/socials.json").then((res) => res.json());
  let focused = null;
  let orbitAnimation = null;

  socials.forEach((data, i) => {
    const el = document.createElement("div");
    el.className = "planet";
    el.style.top = data.position.top;
    el.style.left = data.position.left;
    el.style.background = data.gradient;
    el.style.zIndex = i;

    const info = document.createElement("div");
    info.className = "planet-info";
    info.innerHTML = `
      <strong>${data.name}</strong><br/>
      <p>${data.description}</p>
      <a href="${data.link}" target="_blank" style="color:#7be43e;">🌐 Visit</a>
    `;
    el.appendChild(info);

    container.appendChild(el);

    // === FLOTAR PLANETAS ===
    const baseTop = parseFloat(data.position.top);
    const baseLeft = parseFloat(data.position.left);
    const offset = 30 + Math.random() * 40;
    const speed = 0.0006 + Math.random() * 0.001;
    const angleStart = Math.random() * Math.PI * 2;

    function float(t) {
      if (!el.classList.contains("focused")) {
        const angle = angleStart + t * speed;
        const top = baseTop + Math.sin(angle) * offset;
        const left = baseLeft + Math.cos(angle) * offset;
        el.style.top = `calc(${baseTop}% + ${Math.sin(angle) * offset}px)`;
        el.style.left = `calc(${baseLeft}% + ${Math.cos(angle) * offset}px)`;
      }
      requestAnimationFrame(float);
    }
    requestAnimationFrame(float);

    // === CLICK ZOOM ===
    el.addEventListener("click", () => {
      if (focused && focused !== el) focused.classList.remove("focused");
      const isSame = el.classList.contains("focused");
      el.classList.toggle("focused");
      focused = el.classList.contains("focused") ? el : null;
      intro.style.display = "none";

      if (orbitAnimation) cancelAnimationFrame(orbitAnimation);

      if (focused) {
        moveSpaceshipToPlanet(focused);
      }
    });

    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      el.click();
    });
  });

  // === NAVE ESPACIAL FLUIDA ===
  function moveSpaceshipToPlanet(planetEl) {
    const rect = planetEl.getBoundingClientRect();
    const destX = rect.left + rect.width / 2;
    const destY = rect.top + rect.height / 2 - 150;

    let posX = spaceship.offsetLeft;
    let posY = spaceship.offsetTop;

    let vx = 0;
    let vy = 0;

    function flyToTarget() {
      const dx = destX - posX;
      const dy = destY - posY;

      vx += dx * 0.01;
      vy += dy * 0.01;

      vx *= 0.9; // amortiguación
      vy *= 0.9;

      posX += vx;
      posY += vy;

      spaceship.style.left = `${posX}px`;
      spaceship.style.top = `${posY}px`;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 2 && planetEl.classList.contains("focused")) {
        requestAnimationFrame(flyToTarget);
      } else {
        orbitPlanet(planetEl);
      }
    }

    requestAnimationFrame(flyToTarget);
  }

  // === ORBITA DESPUÉS DE LLEGAR ===
  function orbitPlanet(planetEl) {
    const rect = planetEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle = 0;
    function orbit() {
      if (!planetEl.classList.contains("focused")) return;
      angle += 0.02;
      const orbitX = centerX + Math.cos(angle) * 60;
      const orbitY = centerY + Math.sin(angle) * 30;
      spaceship.style.left = `${orbitX}px`;
      spaceship.style.top = `${orbitY}px`;
      orbitAnimation = requestAnimationFrame(orbit);
    }
    orbitAnimation = requestAnimationFrame(orbit);
  }

  // === GRAVEDAD SIMPLIFICADA ===
  function simulateGravity(planets) {
    setInterval(() => {
      for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
          const p1 = planets[i];
          const p2 = planets[j];

          const dx = p1.offsetLeft - p2.offsetLeft;
          const dy = p1.offsetTop - p2.offsetTop;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const repulse = 1;
            p1.style.top = `${p1.offsetTop + (dy / dist) * repulse}px`;
            p1.style.left = `${p1.offsetLeft + (dx / dist) * repulse}px`;
            p2.style.top = `${p2.offsetTop - (dy / dist) * repulse}px`;
            p2.style.left = `${p2.offsetLeft - (dx / dist) * repulse}px`;
          }
        }
      }
    }, 100);
  }
  simulateGravity([...document.querySelectorAll(".planet")]);
});
