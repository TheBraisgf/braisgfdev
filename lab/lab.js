document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("lab-container");
  const scrollHint = document.getElementById("scroll-hint");
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalDesc = document.getElementById("modal-desc");
  const modalVideo = document.getElementById("modal-video");
  const modalTechs = document.getElementById("modal-techs");
  const closeBtn = document.querySelector(".close-btn");

  const projects = await fetch("/lab/projects.json").then((res) => res.json());

  let current = 0;

  projects.forEach((project, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = project.background
      ? `url(${project.background})`
      : "none";
    slide.style.backgroundColor = project.backgroundColor || "#111";

    slide.innerHTML = `
      <h2>${project.title}</h2>
      <p>${project.description}</p>
      <button>View more</button>
    `;

    const btn = slide.querySelector("button");
    btn.addEventListener("click", () => {
      modalTitle.textContent = project.title;
      modalDesc.textContent = project.description;
      modalImage.src = project.image || "";
      modalImage.style.display = project.image ? "block" : "none";
      modalVideo.src = project.video || "";
      modalVideo.style.display = project.video ? "block" : "none";
      modalTechs.textContent = `🔧 ${project.technologies.join(", ")}`;
      modal.style.display = "flex";
    });

    // Partículas
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      const size = Math.random() * 12 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      slide.appendChild(particle);
    }

    container.appendChild(slide);
  });

  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) slides[0].classList.add("active");

  let scrolling = false;

  window.addEventListener("wheel", (e) => {
    if (scrolling) return;
    scrolling = true;
    scrollHint.style.display = "none";

    slides[current].classList.remove("active");

    if (e.deltaY > 0) {
      current = (current + 1) % slides.length;
    } else {
      current = (current - 1 + slides.length) % slides.length;
    }

    slides[current].classList.add("active");

    setTimeout(() => (scrolling = false), 800);
  });

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
});
