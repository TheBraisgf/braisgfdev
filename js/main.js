import { initI18n } from "./i18n.js";
import { initLangToggle } from "./lang-toggle.js";
import { initAnalytics } from "./analytics.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initI18n();
  initLangToggle();
  initAnalytics();

  const cookieBanner = document.getElementById("cookie-banner");
  const cookieBtn = document.getElementById("cookie-accept");
  if (cookieBanner && cookieBtn) {
    const accepted = document.cookie.split("; ").find((c) => c.startsWith("cookiesAccepted="));
    if (!accepted) {
      cookieBanner.style.display = "block";
    }
    cookieBtn.addEventListener("click", () => {
      document.cookie = "cookiesAccepted=true; path=/; max-age=31536000; SameSite=Lax";
      cookieBanner.style.display = "none";
    });
  }
});
