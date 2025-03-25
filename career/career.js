document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active"); // reversible animation
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  reveals.forEach((el) => observer.observe(el));
});
