const LANG_COOKIE = "preferredLang";
const DEFAULT_LANG = "en";
const SUPPORTED_LANGS = ["en", "es"];

let translations = {};
let currentLang = DEFAULT_LANG;

function getCookie(name) {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
}

function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

function detectLanguage() {
  const cookie = getCookie(LANG_COOKIE);
  if (cookie && SUPPORTED_LANGS.includes(cookie)) return cookie;

  const browserLang = navigator.language?.slice(0, 2);
  if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

  return DEFAULT_LANG;
}

async function loadTranslations(lang) {
  const res = await fetch(`/i18n/${lang}.json`);
  return res.json();
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.placeholder = value;
    }
  });

  document.documentElement.lang = currentLang;

  const metaKey = document.body.dataset.page;
  if (metaKey) {
    const title = getNestedValue(translations, `meta.${metaKey}_title`);
    const description = getNestedValue(translations, `meta.${metaKey}_description`);
    if (title) document.title = title;
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = description;
    }
  }
}

async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  setCookie(LANG_COOKIE, lang);
  translations = await loadTranslations(lang);
  applyTranslations();
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function getTranslation(key) {
  return getNestedValue(translations, key);
}

function getLang() {
  return currentLang;
}

async function initI18n() {
  currentLang = detectLanguage();
  translations = await loadTranslations(currentLang);
  applyTranslations();
  return currentLang;
}

export { initI18n, setLanguage, getTranslation, getLang };
