let product = [];
let categories = [];

const cardSection = document.getElementById(`product-cards`);
const productCarusel = document.getElementById(`product-carousel`);
let itemCarouselProduct = document.getElementsByClassName(
  `item-carousel-product`,
);

function uploadBestSale(element) {
  fetch(
    `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
  )
    .then((Response) => Response.json())
    .then((data) => {
      console.log(data);
      product = data;

      let discountedProduct = product.products.filter(
        (discount) => discount.price.discountPercentage !== 0,
      );

      element.innerHTML = ``;

      for (let item of discountedProduct) {
        element.innerHTML += `
        <div class="carousel-item">
              <div class="image-wrapper">
                <img
                  src= "${imageSeperator(item.category.name, item.brand)}"

                  alt=""
                />
              </div>
              <div class="content">
                <button class="best-price">Best Price</button>
                <div class="price-wrapper">
                  <label class="price" for="">${item.price.current} ${item.price.currency === "USD" ? "$" : "₾"}</label>
                  <p class="discount">${item.price.beforeDiscount} ${item.price.currency === "USD" ? "$" : "₾"}</p>
                </div>
                
                <label for="carousel-item"
                  >${sliceName(String(item.title))} ...</label
                >
                <div class="button-wrapper">
                  <button class="add-to-cart-btn">
                    <i class="fa-solid fa-cart-shopping"></i>
                    დამატება
                  </button>
                </div>
              </div>
            </div>
        `;
      }

      // <---------------------------------Carousel-sliders---------------------------------------->
      let productItems = Array.from(
        document.querySelectorAll(`.carousel-item`),
      );
      const nextProduct = cardSection.querySelector(`.arrow.right`);
      const prevProduct = cardSection.querySelector(`.arrow.left`);

      let total = 0;
      let count = 6;

      nextProduct.addEventListener("click", () => {
        count++;
        total -= 180;
        if (count === productItems.length) {
          total = 0;
          count = 6;
        }
        productCarusel.style.transform = `translateX(${total}px)`;
      });

      prevProduct.addEventListener("click", () => {
        if (count === 6) {
          total = 0;
          count = 6;
          return;
        }
        total += 180;
        count--;
        productCarusel.style.transform = `translateX(${total}px)`;
      });
    });
}
// <---------------------------------Carousel-sliders---------------------------------------->

async function uploadCategory(element, Name) {
  let response = await fetch(
    `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
  );
  let data = await response.json();

  console.log(data);
  let discountedProduct = data.products.filter(
    (discount) => discount.category.name === `${Name}`,
  );

  element.innerHTML = ``;

  for (let item of discountedProduct) {
    element.innerHTML += `
        <div class="carousel-item">
              <div class="image-wrapper">
                <img
                  src= "${imageSeperator(item.category.name, item.brand)}"

                  alt=""
                />
              </div>
              <div class="content">
              ${item.price.current !== item.price.beforeDiscount ? `<button class="best-price">Best Price</button>` : `<button style="opacity:0;" class="best-price">Best Price</button>`}
                <div class="price-wrapper">
                  <label class="price" for="">${item.price.current} ${item.price.currency === "USD" ? "$" : "₾"}</label>
                  ${item.price.beforeDiscount === item.price.current ? "" : `<p class="discount">${` ${item.price.beforeDiscount}  ${item.price.currency === "USD" ? "$" : "₾"}`}</p>`}
                  
                </div>
                <label for="carousel-item"
                  >${sliceName(String(item.title))} ...</label
                >
                <div class="button-wrapper">
                  <button class="add-to-cart-btn">
                    <i class="fa-solid fa-cart-shopping"></i>
                    დამატება
                  </button>
                </div>
              </div>
            </div>
        `;
  }
  let productCategoryName;
  let productItems = Array.from(element.querySelectorAll(`.carousel-item`));
  if (Name === "laptops") {
    productCategoryName = document.getElementsByClassName(
      `product-cards ${Name}`,
    );
  } else {
    productCategoryName = document.getElementsByClassName(
      `product-cards ${Name}`,
    );
  }

  const nextProduct = productCategoryName[0].querySelector(`.arrow.right`);
  const prevProduct = productCategoryName[0].querySelector(`.arrow.left`);
  let total = 0;
  let count = 6;
  console.log(productItems.length);

  nextProduct.addEventListener("click", () => {
    count++;
    total -= 180;
    if (count === productItems.length) {
      total = 0;
      count = 6;
    }
    element.style.transform = `translateX(${total}px)`;
  });

  prevProduct.addEventListener("click", () => {
    if (count === 6) {
      total = 0;
      count = 6;
      return;
    }
    total += 180;
    count--;
    element.style.transform = `translateX(${total}px)`;
  });
}
// <---------------------------------Carousel-sliders---------------------------------------->

// <----------------------Best-Sale მონაცემების დამუშავება-------------------------->
function sliceName(input) {
  let slicedName = input.slice(0, 40);

  return slicedName;
}

function imageSeperator(name, brand) {
  return `./assets/productIMG/${name}/${brand}.png`;
}
// <----------------------Best-Sale მონაცემების დამუშავება-------------------------->

// <------------------------------შეფასების-სისტემა------------------------------->
let productReview = [];

function generateReview(review, id) {}

// <------------------------------შეფასების-სისტემა------------------------------->
