document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("lang-toggle");

  // 🌍 LANGUAGE TOGGLE
  if (toggle) {
    const cookieLang = document.cookie
      .split("; ")
      .find((c) => c.startsWith("preferredLang="));
    const preferredLang = cookieLang?.split("=")[1];
    toggle.checked = preferredLang === "es";

    toggle.addEventListener("change", () => {
      const lang = toggle.checked ? "es" : "en";
      document.cookie = `preferredLang=${lang}; path=/; max-age=31536000`;
      const target = lang === "es" ? "/es/privacy" : "/privacy";
      window.location.href = target;
    });
  }

  // 📄 DOWNLOAD PDF
  const downloadBtn = document.getElementById("download-pdf");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;

      // Clonar contenido y limpiar botones
      const originalContent = document.getElementById("privacy-content");
      const clone = originalContent.cloneNode(true);
      clone.querySelectorAll(".btn").forEach((el) => el.remove());

      // Crear contenedor temporal visible
      const printableContainer = document.createElement("div");
      printableContainer.style.position = "fixed";
      printableContainer.style.top = "0";
      printableContainer.style.left = "0";
      printableContainer.style.width = "210mm";
      printableContainer.style.maxWidth = "210mm";
      printableContainer.style.padding = "20px";
      printableContainer.style.background = "#fff";
      printableContainer.style.color = "#000";
      printableContainer.style.fontSize = "12pt";
      printableContainer.style.lineHeight = "1.6";
      printableContainer.style.zIndex = "-1";

      printableContainer.appendChild(clone);
      document.body.appendChild(printableContainer);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.html(clone, {
        x: 10,
        y: 10,
        html2canvas: {
          scale: 0.6,
          useCORS: true,
        },
        callback: function (doc) {
          doc.save("privacy-policy-braisgfdev.pdf");
          document.body.removeChild(printableContainer);
        },
      });
    });
  }
});
