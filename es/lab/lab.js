document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("lab-grid");
  const log = document.getElementById("boot-log");
  const title = document.querySelector(".lab-header h1");
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalDesc = document.getElementById("modal-desc");
  const modalVideo = document.getElementById("modal-video");
  const modalTechs = document.getElementById("modal-techs");
  const closeBtn = document.querySelector(".close-btn");

  const projects = await fetch("projects_es.json").then((res) => res.json());

  const logs = [
    "[🤖] Iniciando consola retro...",
    "[☕] Preparando café para la IA...",
    "[🧠] Sincronizando circuitos neuronales...",
    "[💾] Montando disquetes...",
    `[📁] ${projects.length} archivos sospechosos encontrados.`,
    "[🔥] Compilando creatividad...",
    "[✨] Intensidad del brillo del terminal: 9000%",
    "[LISTO] Todos los sistemas nominales. ¡Despegamos!",
  ];

  let logIndex = 0;
  const randomDelay = () => Math.floor(1000 + Math.random() * 1000);

  const showLogs = () => {
    log.textContent = logs[logIndex++];
    if (logIndex < logs.length) {
      setTimeout(() => showLogs(), randomDelay());
    } else {
      setTimeout(() => {
        title.textContent = "CREATORS LAB";
        log.style.display = "none";
        renderProjects();
      }, randomDelay());
    }
  };

  showLogs();

  function renderProjects() {
    grid.innerHTML = "";
    const shuffledProjects = [...projects].sort(() => Math.random() - 0.5);

    shuffledProjects.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-extension", project.extension || ".EXE");
      card.setAttribute("data-status", project.status || "stable");
      card.style.setProperty("--delay", `${index * 0.3}s`);

      const isLocked = project.status === "locked";

      const glitchText = () =>
        [...Array(8)]
          .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))
          .join("");
      console.log(shuffledProjects);
      // CONTENIDO DE LA CARD
      card.innerHTML = `
        ${
          project.image
            ? `<img src="${project.image}" alt="WIP" class="card-image" />`
            : ""
        }
        <h2>> ${isLocked ? glitchText() : project.title}</h2>
        <p>${
          isLocked
            ? `${glitchText()} ${glitchText()} ${glitchText()}`
            : project.description
        }</p>
      `;

      if (isLocked) {
        card.classList.add("locked");

        card.addEventListener("click", () => {
          if (card.querySelector(".unlock-input")) return;

          const input = document.createElement("input");
          input.className = "unlock-input";
          input.placeholder = "Enter access code...";

          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              const value = input.value.trim();
              if (value === project.unlockCode) {
                card.removeChild(input);
                openModal(project); // Mostrar modal sin desbloquear permanentemente
              } else {
                input.value = "";
                input.placeholder = "❌ Wrong code";
              }
            }
          });

          card.appendChild(input);
          input.focus();
        });
      } else {
        card.addEventListener("click", () => openModal(project));
      }

      grid.appendChild(card);
    });
  }

  function openModal(project) {
    modal.style.display = "flex";
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.description;

    // Mostrar imagen solo si existe
    if (project.image) {
      modalImage.src = project.image;
      modalImage.style.display = "block";
    } else {
      modalImage.style.display = "none";
    }

    // Mostrar video solo si existe
    if (project.video) {
      modalVideo.src = project.video;
      modalVideo.style.display = "block";
    } else {
      modalVideo.style.display = "none";
    }
    console.log(project.gallery);

    // Mostrar tecnologías, link y galería solo si están disponibles
    const galleryHTML =
      project.gallery && project.gallery.length
        ? `<br/><div class="gallery">${project.gallery
            .map((img) => `<img src="${img}" class="gallery-img" />`)
            .join("")}</div>`
        : "";

    modalTechs.innerHTML = `
    <strong>🔧 Technologies:</strong> ${
      project.technologies?.join(", ") || "???"
    }
    ${
      project.link
        ? `<br/><strong>🌐 Link:</strong> <a href="${project.link}" target="_blank">${project.link}</a>`
        : ""
    }
  
  `;

    //  // ${galleryHTML}
  }

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalVideo.pause();
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modalVideo.pause();
    }
  });

  const toggle = document.getElementById("lang-toggle");

  const cookieLang = document.cookie
    .split("; ")
    .find((c) => c.startsWith("preferredLang="));
  const preferredLang = cookieLang?.split("=")[1];
  if (preferredLang === "es") toggle.checked = true;

  toggle.addEventListener("change", () => {
    const lang = toggle.checked ? "es" : "en";
    document.cookie = `preferredLang=${lang}; path=/; max-age=31536000`;
    if (lang === "es") {
      window.location.href = "/es/lab";
    } else {
      window.location.href = "/lab";
    }
  });
});
