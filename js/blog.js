import { getLang, getTranslation } from "./i18n.js";

const POSTS_DIR = "/data/posts/";

async function loadPosts() {
  const container = document.getElementById("blog-posts");
  if (!container) return;

  try {
    const files = ["post1.json", "post2.json", "post3.json"];
    const posts = [];

    for (const file of files) {
      const res = await fetch(`${POSTS_DIR}${file}`);
      if (res.ok) posts.push(await res.json());
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderPosts(posts, container);
  } catch {
    container.innerHTML = `<p>${getTranslation("blog.error")}</p>`;
  }
}

function renderPosts(posts, container) {
  const lang = getLang();
  container.innerHTML = "";

  for (const post of posts) {
    const title = post.title[lang] || post.title.en;
    const content = post.content[lang] || post.content.en;
    const summary = content.replace(/[#*\[\]()]/g, "").slice(0, 120) + "...";
    const date = new Date(post.date).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const article = document.createElement("article");
    article.className = "blog-post";
    article.innerHTML = `
      <div class="blog-post-header">
        <h2>${title}</h2>
        <span class="post-date">${date}</span>
      </div>
      <p class="blog-summary">${summary}</p>
      ${post.image ? `<img src="${post.image}" alt="${title}" class="post-image" loading="lazy" />` : ""}
      <button class="read-more-btn" data-i18n="blog.read_more">${getTranslation("blog.read_more")}</button>
    `;

    article.querySelector(".read-more-btn").addEventListener("click", () => {
      openModal(title, content, post.image, post.video);
    });

    container.appendChild(article);
  }
}

function openModal(title, content, image, video) {
  const modal = document.getElementById("blogModal");
  if (!modal) return;

  document.getElementById("modal-title").textContent = title;

  const htmlContent = typeof marked !== "undefined" ? marked.parse(content) : content.replace(/\n/g, "<br>");
  document.getElementById("modal-content").innerHTML = htmlContent;

  const modalImg = document.getElementById("modal-image");
  if (modalImg) {
    if (image) {
      modalImg.src = image;
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
    }
  }

  const modalVideo = document.getElementById("modal-video");
  if (modalVideo) {
    if (video) {
      modalVideo.src = video;
      modalVideo.style.display = "block";
    } else {
      modalVideo.style.display = "none";
    }
  }

  modal.style.display = "block";
}

function initBlog() {
  loadPosts();

  const modal = document.getElementById("blogModal");
  const closeBtn = modal?.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  document.addEventListener("langchange", () => loadPosts());
}

document.addEventListener("DOMContentLoaded", () => initBlog());
