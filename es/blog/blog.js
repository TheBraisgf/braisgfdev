document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.getElementById("blog-posts");
  const modal = document.getElementById("global-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalContent = document.getElementById("modal-content");
  const modalVideo = document.getElementById("modal-video");
  const modalVideoSource = document.getElementById("modal-video-source");
  const closeBtn = document.querySelector(".close-btn");

  try {
    const files = ["posts/post1.json", "posts/post2.json", "posts/post3.json"];

    const posts = await Promise.all(
      files.map((file) => fetch(file).then((res) => res.json()))
    );

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    posts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "blog-post";

      postCard.innerHTML = `
        <div class="blog-post-header">
          <h2>${post.title}</h2>
          <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
        </div>
        ${
          post.image
            ? `<img src="${post.image}" class="post-image" alt="${post.title}" />`
            : ""
        }
        <p class="blog-summary">${post.content.substring(0, 150)}...</p>
        <button class="read-more-btn">Read more</button>
      `;

      blogContainer.appendChild(postCard);

      postCard.querySelector(".read-more-btn").addEventListener("click", () => {
        modalTitle.textContent = post.title;
        modalContent.innerHTML = marked.parse(post.content);

        if (post.image) {
          modalImage.src = post.image;
          modalImage.style.display = "block";
        } else {
          modalImage.style.display = "none";
        }

        if (post.video) {
          modalVideoSource.src = post.video;
          modalVideo.load();
          modalVideo.style.display = "block";
        } else {
          modalVideoSource.src = "";
          modalVideo.load();
          modalVideo.style.display = "none";
        }

        modal.style.display = "block";
      });
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  } catch (err) {
    blogContainer.innerHTML = "<p>Error loading posts.</p>";
    console.error(err);
  }

  // Particle animation
  const canvas = document.getElementById("stars");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: 0.1 + Math.random() * 0.3,
      dy: 0.1 + Math.random() * 0.3,
    }));

    function animateStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      for (let s of stars) {
        s.x -= s.dx;
        s.y += s.dy;
        if (s.x < 0) s.x = canvas.width;
        if (s.y > canvas.height) s.y = 0;
        ctx.moveTo(s.x, s.y);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = "#7be43e";
      ctx.fill();
      requestAnimationFrame(animateStars);
    }

    animateStars();
  }

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
      window.location.href = "/es/blog";
    } else {
      window.location.href = "/blog";
    }
  });
});
