let categoriesElement = document.getElementById(`categories-item-wrapper`);
const apiURL = "https://api.everrest.educata.dev";

async function addCategorie() {
  let response = await fetch(`${apiURL}/shop/products/brands`);
  if (!response.ok) {
    console.error(`eror`);
  }
  let data = await response.json();
  categoriesElement.innerHTML = ``;

  for (let i = 0; i < data.length; i++) {
    categoriesElement.innerHTML += `
                <div class="categories-items">
            <div class="categories-content"></div>
            <div class="box">
              <button>&#10095;</button>
            </div>
            <img src="./assets/brandLogos/${data[i]}.png" alt="NOT FOUND!" />
          </div>
         `;
  }
  categorieSlider();
}

//  <---------------------------Categories-Slider------------------------------------>

addCategorie();
function categorieSlider() {
  const categorie = document.getElementById(`categories`);
  let categorieArrowLeft = categorie.getElementsByClassName(`arrow left`);
  let categorieArrowRight = categorie.getElementsByClassName(`arrow right`);
  let categoriesItems = categorie.getElementsByClassName(`categories-items`);

  let count = 1;
  let total = 0;

  categorieArrowLeft[0].addEventListener("click", () => {
    if (count <= 1) {
      count = 1;
      total = 0;
      categoriesElement.style.transform = `translateX(${total}px)`;
    } else {
      total -= 370 + 25;
      count--;
      categoriesElement.style.transform = `translateX(-${total}px)`;
    }
  });

  categorieArrowRight[0].addEventListener("click", () => {
    if (count === categoriesItems.length) {
      count = 1;
      total = 0;
      categoriesElement.style.transform = `translateX(-${total}px)`;
    } else {
      count++;
      total += 370 + 25;
      categoriesElement.style.transform = `translateX(-${total}px)`;
    }
  });
}

//  <---------------------------Categories-Slider------------------------------------>
