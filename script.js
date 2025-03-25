document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded with JavaScript");
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1; // Slightly smaller particles
    this.speedX = (Math.random() - 0.5) * 2; // Faster particle movement
    this.speedY = (Math.random() - 0.5) * 2;
    this.color = "#77B254"; // Soft green color to match the theme
    this.opacity = Math.random() * 0.5 + 0.5; // Slight opacity for a more futuristic feel
  }

  function createParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for next frame
    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Particle bouncing on canvas edges
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

      // Draw the particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity; // Apply opacity
      ctx.fill();
    }
    requestAnimationFrame(animate); // Continue the animation
  }

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles(100); // Re-create particles on resize
  });

  createParticles(100); // Initialize particles
  animate(); // Start the animation loop
});
