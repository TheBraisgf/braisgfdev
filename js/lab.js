import { getLang, getTranslation } from "./i18n.js";

function initLab() {
  const grid = document.querySelector(".lab-grid");
  const bootLog = document.querySelector(".boot-log");
  if (!grid) return;

  runBootSequence(bootLog);
  loadProjects(grid);
  document.addEventListener("langchange", () => {
    loadProjects(grid);
    runBootSequence(bootLog);
  });
}

function runBootSequence(logEl) {
  if (!logEl) return;

  const logs = getTranslation("lab.logs") || [];
  let i = 0;

  logEl.textContent = "";

  function typeLine() {
    if (i >= logs.length) return;
    logEl.textContent = `> ${logs[i]}`;
    i++;
    setTimeout(typeLine, 700);
  }

  typeLine();
}

async function loadProjects(grid) {
  try {
    const res = await fetch("/data/projects.json");
    const projects = await res.json();
    renderProjects(projects, grid);
  } catch {
    grid.innerHTML = "<p>Error loading projects.</p>";
  }
}

function renderProjects(projects, grid) {
  const lang = getLang();
  grid.innerHTML = "";

  projects.forEach((project, i) => {
    const title = project.title;
    const description = project.description[lang] || project.description.en;
    const isLocked = project.status === "locked";

    const card = document.createElement("div");
    card.className = `card${isLocked ? " locked" : ""}`;
    card.dataset.extension = project.extension || ".EXE";
    card.style.animationDelay = `${i * 0.15}s`;
    card.style.setProperty("--delay", `${i * 0.15}s`);

    if (project.backgroundColor) {
      card.style.backgroundColor = project.backgroundColor;
    }

    card.innerHTML = `
      ${project.image ? `<img src="${project.image}" alt="${title}" class="card-image" loading="lazy" />` : ""}
      <h2>${title}</h2>
      <p>${description}</p>
      ${isLocked ? `<input type="text" class="unlock-input" data-i18n-placeholder="lab.enter_code" placeholder="${getTranslation("lab.enter_code")}" data-code="${project.unlockCode}" />` : ""}
    `;

    if (isLocked) {
      const input = card.querySelector(".unlock-input");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (input.value.trim().toLowerCase() === project.unlockCode) {
            card.classList.remove("locked");
            input.remove();
          } else {
            input.value = "";
            input.placeholder = getTranslation("lab.wrong_code");
          }
        }
      });
    } else {
      card.addEventListener("click", () => openProjectModal(project, lang));
    }

    grid.appendChild(card);
  });
}

function openProjectModal(project, lang) {
  const modal = document.getElementById("labModal");
  if (!modal) return;

  const title = project.title;
  const description = project.description[lang] || project.description.en;
  const techLabel = getTranslation("lab.technologies");
  const linkLabel = getTranslation("lab.link");

  let html = `<h2>${title}</h2><p>${description}</p>`;

  if (project.image) {
    html += `<img src="${project.image}" alt="${title}" />`;
  }

  if (project.video) {
    html += `<video controls src="${project.video}"></video>`;
  }

  if (project.technologies?.length) {
    html += `<p><strong>${techLabel}</strong> ${project.technologies.join(", ")}</p>`;
  }

  if (project.link) {
    html += `<p><strong>${linkLabel}</strong> <a href="${project.link}" target="_blank">${project.link}</a></p>`;
  }

  if (project.gallery?.length > 1) {
    html += '<div class="gallery">';
    for (const img of project.gallery) {
      html += `<img src="${img}" alt="Gallery" class="gallery-img" />`;
    }
    html += "</div>";
  }

  modal.querySelector(".modal-content").innerHTML = `
    <span class="close-btn" aria-label="Close">&times;</span>
    ${html}
  `;

  modal.style.display = "flex";

  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", () => initLab());
