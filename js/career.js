function initCareer() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      }
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => initCareer());
