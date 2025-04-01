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
    window.location.href = "/es/about";
  } else {
    window.location.href = "/about";
  }
});
