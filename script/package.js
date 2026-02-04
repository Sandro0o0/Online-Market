const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-track img");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");

let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});

function slidePages() {
  setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 2500);
}
slidePages();
///////////////////////////
