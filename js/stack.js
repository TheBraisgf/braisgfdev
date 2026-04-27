import { getLang, getTranslation } from "./i18n.js";

let techData = [];
let activeFilter = "all";

function initStack() {
  loadTech();
  setupFilters();
  document.addEventListener("langchange", () => renderBubbles());
}

async function loadTech() {
  try {
    const res = await fetch("/data/tech.json");
    techData = await res.json();
    renderBubbles();
  } catch {
    const cloud = document.querySelector(".cloud");
    if (cloud) cloud.innerHTML = "<p>Error loading tech data.</p>";
  }
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderBubbles();
    });
  });

  const rerollBtn = document.querySelector(".reroll-btn");
  if (rerollBtn) {
    rerollBtn.addEventListener("click", () => renderBubbles());
  }
}

function renderBubbles() {
  const cloud = document.querySelector(".cloud");
  if (!cloud) return;

  const lang = getLang();
  const filtered = activeFilter === "all"
    ? techData
    : techData.filter((t) => t.layer === activeFilter);

  cloud.innerHTML = "";

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.innerHTML = '<div class="arrow"></div><span class="tooltip-text"></span>';
  cloud.appendChild(tooltip);

  const isMobile = window.innerWidth <= 768;

  filtered.forEach((tech, i) => {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${tech.layer}${tech.favorite ? " favorite" : ""}`;
    bubble.textContent = tech.name;

    if (!isMobile) {
      const pos = getRandomPosition(cloud, i, filtered.length);
      bubble.style.top = `${pos.top}px`;
      bubble.style.left = `${pos.left}px`;
    }

    const description = tech.description[lang] || tech.description.en;

    bubble.addEventListener("mouseenter", (e) => {
      tooltip.querySelector(".tooltip-text").textContent = description;
      tooltip.style.display = "block";
      tooltip.style.top = `${e.target.offsetTop + e.target.offsetHeight + 10}px`;
      tooltip.style.left = `${e.target.offsetLeft}px`;
    });

    bubble.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    cloud.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add("show"));
  });
}

function getRandomPosition(container, index, total) {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  const padding = 20;
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  const cellW = (w - padding * 2) / cols;
  const cellH = (h - padding * 2) / rows;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    top: padding + row * cellH + Math.random() * cellH * 0.5,
    left: padding + col * cellW + Math.random() * cellW * 0.3,
  };
}

document.addEventListener("DOMContentLoaded", () => initStack());
