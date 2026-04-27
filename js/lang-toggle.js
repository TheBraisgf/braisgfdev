import { getLang, setLanguage } from "./i18n.js";

function initLangToggle() {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;

  toggle.checked = getLang() === "es";

  toggle.addEventListener("change", () => {
    const lang = toggle.checked ? "es" : "en";
    setLanguage(lang);
  });

  document.addEventListener("langchange", (e) => {
    toggle.checked = e.detail.lang === "es";
  });
}

export { initLangToggle };
