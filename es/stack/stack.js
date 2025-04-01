document.addEventListener("DOMContentLoaded", async () => {
  const cloud = document.getElementById("cloud");
  const tooltip = document.getElementById("tooltip");
  const tooltipContent = document.getElementById("tooltip-content");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const rerollBtn = document.querySelector(".reroll-btn");

  const res = await fetch("tech.json");
  const techs = await res.json();
  let currentCategory = "all";
  const bubbleMap = new Map(); // Guarda posiciones originales

  const usedPositions = new Set();

  function getNonOverlappingPosition(gridSize = 10) {
    let x, y, key;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
      key = `${x}-${y}`;
      attempts++;
    } while (usedPositions.has(key) && attempts < 100);
    usedPositions.add(key);
    return {
      left: x * (100 / gridSize) + Math.random() * 2 + "%",
      top: y * (100 / gridSize) + Math.random() * 2 + "%",
    };
  }

  function clearCloud() {
    cloud.innerHTML = "";
    usedPositions.clear();
  }

  function renderBubbles(
    category = "all",
    isReroll = false,
    animateAsList = false
  ) {
    clearCloud();
    const visibleTechs = techs.filter(
      (t) => category === "all" || t.layer === category
    );

    visibleTechs.forEach((tech, index) => {
      const div = document.createElement("div");
      div.className = `bubble ${tech.layer} show`;
      div.textContent = tech.name;
      div.dataset.category = tech.layer;
      div.dataset.description = tech.description;
      div.id = `bubble-${tech.name.replace(/\s+/g, "-").toLowerCase()}`;

      let top, left;
      if (isReroll || !bubbleMap.has(tech.name)) {
        const pos = getNonOverlappingPosition();
        top = pos.top;
        left = pos.left;
        bubbleMap.set(tech.name, { top, left });
      } else {
        ({ top, left } = bubbleMap.get(tech.name));
      }

      // Estilos para escritorio (no móvil)
      if (window.innerWidth > 768) {
        if (animateAsList && category !== "all") {
          div.style.position = "absolute";
          const margin = 8;
          const itemHeight = 50;
          const spacing = itemHeight + margin;
          div.animate(
            [
              { top: top, left: left, transform: "scale(1)" },
              {
                top: `${20 + index * spacing}px`,
                left: `40%`,
                transform: "scale(1.1)",
              },
            ],
            { duration: 500, fill: "forwards" }
          );
        } else if (category === "all" && !isReroll) {
          div.style.top = "45%";
          div.style.left = "45%";
          div.animate(
            [
              { top: "45%", left: "45%", transform: "scale(1.1)" },
              { top: top, left: left, transform: "scale(1)" },
            ],
            { duration: 500, fill: "forwards" }
          );
        } else {
          div.style.top = top;
          div.style.left = left;
        }
      }

      // Móvil: dejar que el CSS lo maneje
      if (window.innerWidth <= 768) {
        div.style.position = "static";
      }

      div.addEventListener("click", (e) => {
        tooltipContent.textContent = tech.description;
        tooltip.style.top = `${e.clientY + window.scrollY + 10}px`;
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.display = "block";

        clearTimeout(tooltip.hideTimeout);
        tooltip.hideTimeout = setTimeout(() => {
          tooltip.style.display = "none";
        }, 4000);
      });

      cloud.appendChild(div);
    });
  }

  // Inicial
  renderBubbles();

  // Tooltip click fuera
  window.addEventListener("click", (e) => {
    if (!e.target.classList.contains("bubble")) {
      tooltip.style.display = "none";
    }
  });

  // Filtros
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      currentCategory = category;
      renderBubbles(category, false, category !== "all");
    });
  });

  // Reroll
  rerollBtn.addEventListener("click", () => {
    renderBubbles(currentCategory, true, currentCategory !== "all");
  });

  // Resize: adaptamos
  window.addEventListener("resize", () => {
    renderBubbles(currentCategory);
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
      window.location.href = "/es/stack";
    } else {
      window.location.href = "/stack";
    }
  });
});
