import { getTranslation } from "./i18n.js";

function initPrivacy() {
  renderPrivacyLists();
  document.addEventListener("langchange", () => renderPrivacyLists());
}

function renderPrivacyLists() {
  renderList("privacy-items-1", getTranslation("privacy.section1_items"));
  renderList("privacy-items-2", getTranslation("privacy.section2_items"));
}

function renderList(elementId, items) {
  const ul = document.getElementById(elementId);
  if (!ul || !items) return;
  ul.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

document.addEventListener("DOMContentLoaded", () => initPrivacy());
