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
    const files = ["posts/post1.json", "posts/post2.json"];

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

      // Al hacer clic en "Read more"
      postCard.querySelector(".read-more-btn").addEventListener("click", () => {
        modalTitle.textContent = post.title;
        modalContent.textContent = post.content;

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

    // Cerrar modal al hacer clic en la X
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  } catch (err) {
    blogContainer.innerHTML = "<p>Error loading posts.</p>";
    console.error(err);
  }
});
