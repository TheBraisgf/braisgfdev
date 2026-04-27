import { getLang, getTranslation } from "./i18n.js";

function initSocial() {
  loadSocials();
  initStarfield();
  document.addEventListener("langchange", () => loadSocials());
}

async function loadSocials() {
  try {
    const res = await fetch("/data/socials.json");
    const socials = await res.json();
    renderPlanets(socials);
  } catch {
    const planets = document.querySelector(".planets");
    if (planets) planets.innerHTML = "<p>Error loading socials.</p>";
  }
}

function renderPlanets(socials) {
  const container = document.querySelector(".planets");
  if (!container) return;

  const lang = getLang();
  const visitLabel = getTranslation("social.visit");
  container.innerHTML = "";

  socials.forEach((social) => {
    const description = social.description[lang] || social.description.en;
    const planet = document.createElement("div");
    planet.className = "planet";
    planet.style.background = social.gradient;
    planet.style.top = social.position.top;
    planet.style.left = social.position.left;

    planet.innerHTML = `
      <img src="${social.icon}" alt="${social.name}" width="40" height="40" />
      <div class="planet-info">
        <strong>${social.name}</strong>
        <p>${description}</p>
        <a href="${social.link}" target="_blank" rel="noopener">${visitLabel} ${social.name}</a>
      </div>
    `;

    planet.addEventListener("click", () => {
      document.querySelectorAll(".planet").forEach((p) => p.classList.remove("focused"));
      planet.classList.toggle("focused");
    });

    container.appendChild(planet);
  });

  animateSpaceship(socials);
}

function animateSpaceship(socials) {
  const spaceship = document.querySelector(".spaceship");
  if (!spaceship || socials.length === 0) return;

  let index = 0;

  function move() {
    const target = socials[index % socials.length];
    spaceship.style.top = target.position.top;
    spaceship.style.left = target.position.left;
    index++;
    setTimeout(move, 5000);
  }

  move();
}

function initStarfield() {
  const canvas = document.getElementById("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const stars = [];
  const STAR_COUNT = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random(),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  createStars();
  draw();
}

document.addEventListener("DOMContentLoaded", () => initSocial());
