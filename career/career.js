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
      window.location.href = "/es/career";
    } else {
      window.location.href = "/career";
    }
  });
});
