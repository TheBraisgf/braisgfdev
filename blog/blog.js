document.addEventListener("DOMContentLoaded", () => {
  fetch('https://braisgf.dev/blog/posts')
    .then(response => response.json()) // Obtenemos la lista de los JSON
    .then(posts => {
      // Ordenar los posts por fecha (más reciente primero)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      const blogPostsContainer = document.getElementById("blog-posts");

      // Crear las tarjetas de los posts
      posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");
        postElement.innerHTML = `
          <div class="blog-post-header">
            <h2>${post.title}</h2>
                <h2>paco</h2>
            <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
          </div>
          ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image" />` : ""}
          <p class="blog-summary">${post.content.substring(0, 150)}...</p>
          <button class="read-more-btn">Leer más</button>
          
          <!-- Modal de contenido -->
          <div class="modal" style="display:none;">
            <div class="modal-content">
              <span class="close-btn">&times;</span>
              <h2>${post.title}</h2>
              ${post.image ? `<img src="${post.image}" alt="${post.title}" class="modal-image" />` : ""}
              <p>${post.content}</p>
            </div>
          </div>
        `;

        // Agregar la tarjeta al contenedor
        blogPostsContainer.appendChild(postElement);

        // Agregar funcionalidad para el modal
        const readMoreBtn = postElement.querySelector('.read-more-btn');
        const modal = postElement.querySelector('.modal');
        const closeBtn = postElement.querySelector('.close-btn');

        // Mostrar el modal
        readMoreBtn.addEventListener('click', () => {
          modal.style.display = 'block';
        });

        // Cerrar el modal
        closeBtn.addEventListener('click', () => {
          modal.style.display = 'none';
        });

        // Cerrar el modal cuando se hace clic fuera de él
        window.addEventListener('click', (event) => {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
      });
    })
    .catch(error => console.log('Error al cargar los artículos: ', error));
});
