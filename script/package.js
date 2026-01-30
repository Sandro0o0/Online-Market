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
// nextBtn
// prevBtn

const cardSection = document.getElementById(`product-cards`);
const productCarusel = document.getElementById(`product-carousel`);
let productItems = Array.from(document.querySelectorAll(`.carousel-item`));
const nextProduct = cardSection.querySelector(`.arrow.right`);
const prevProduct = cardSection.querySelector(`.arrow.left`);
let total = 0;
let count = 5;

nextProduct.addEventListener("click", () => {
  count++;
  total -= 220;
  if (count === productItems.length) {
    total = 0;
    count = 5;
  }
  productCarusel.style.transform = `translateX(${total}px)`;
});
prevProduct.addEventListener("click", () => {
  if (count === 5) {
    total = 0;
    count = 5;
    return;
  }
  total += 220;
  count--;
  productCarusel.style.transform = `translateX(${total}px)`;
});
