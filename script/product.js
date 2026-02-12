let product = [];
let categories = [];
// localStorage.setItem("cart", JSON.stringify([]));
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// if (cart.length <= 0) {
//   // return;
// } else {
//   updateCart(cart);
// }
// console.log(cart);
// localStorage.clear();

const cardSection = document.getElementById(`product-cards`);
const productCarusel = document.getElementById(`product-carousel`);
let itemCarouselProduct = document.getElementsByClassName(
  `item-carousel-product`,
);

function addProductClickHandlers(container) {
  const carouselItems = container.querySelectorAll(".carousel-item");
  cart = [];
  carouselItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const productId = item.id;
      //კალათაში დამატება--------
      if (e.target.closest(".add-to-cart-btn")) {
        const addToCartBtn = Array.from(
          item.getElementsByClassName(`add-to-cart-btn`),
        );
        const correctProd = product.products.find(
          (item) => item._id === productId,
        );

        if (correctProd && !cart.find((item) => item.id === correctProd._id)) {
          let cartNew = {
            id: correctProd._id,
            title: correctProd.title,
            price: correctProd.price.current,
            currency: correctProd.price.currency,
            stock: correctProd.stock,
            image: `../assets/productIMG/${correctProd.category.name}/${correctProd.brand}.png`,
            quantiti: 1,
          };

          if (!localStorage.getItem("accessToken")) {
            alert("გთოვთ შეხვიდეთ ანგარიშში ჯერ");
            return;
          }

          if (cartNew.stock < 1) {
            alert(
              "მონაცემთა ბაზაში ამ პროდუქტის მარაგი ამოიწურა, გთხოვთ შეარჩიოთ სხვა პროდუქტი",
            );
            return;
          }

          cart.push(cartNew);
          saveCart(cartNew);
          updateCart(cart);
          // updateCart(cart);

          console.log(cart);
        }

        console.log(cart);
        return;
      }
      //კალათაში დამატება--------

      if (productId) {
        console.log("Navigating to product:", productId);
        changeContentPage(productId);
      }
    });
  });
}

async function saveCart(cartNew) {
  try {
    let response = await fetch(
      `https://api.everrest.educata.dev/shop/cart/product`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: cartNew.id,
          quantity: cartNew.quantiti,
        }),
      },
    );
    let data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("Error saving cart:", error);
  }
  return false;
}
async function changeContentPage(id) {
  let productURL = `product_page/product.html?id=${id}`;
  window.location.href = productURL;
}

async function uploadBestSale(element) {
  try {
    const response = await fetch(
      `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
    );
    const data = await response.json();

    product = data;

    let discountedProduct = product.products.filter(
      (discount) => discount.price.discountPercentage !== 0,
    );

    element.innerHTML = ``;

    for (let item of discountedProduct) {
      element.innerHTML += `
        <div id="${item._id}" class="carousel-item">
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
                 <div class="review">  
              ${generateReview(item.rating) === "" ? `<i class="fa-solid fa-star-half"></i>` : generateReview(item.rating)}
                </div>
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

    addProductClickHandlers(element);

    // <---------------------------------Carousel-sliders---------------------------------------->
    let productItems = Array.from(document.querySelectorAll(`.carousel-item`));
    const nextProduct = cardSection.querySelector(`.arrow.right`);
    const prevProduct = cardSection.querySelector(`.arrow.left`);

    let total = 0;
    let count = 6;

    nextProduct.addEventListener("click", () => {
      count++;
      total -= 190;
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
      total += 190;
      count--;
      productCarusel.style.transform = `translateX(${total}px)`;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
// localStorage.clear();

async function uploadCategory(element, Name) {
  let response = await fetch(
    `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
  );
  let data = await response.json();

  let fillterBycategory = data.products.filter(
    (category) => category.category.name === `${Name}`,
  );

  element.innerHTML = ``;

  for (let item of fillterBycategory) {
    element.innerHTML += `
        <div id="${item._id}" class="carousel-item">
              <div class="image-wrapper">
                <img
                  src= "${imageSeperator(item.category.name, item.brand)}"
                  alt=""
                />
              </div>
              <div class="content">
              ${item.price.current !== item.price.beforeDiscount ? `<button class="best-price">Best Price</button>` : `<button style="opacity:0;" class="best-price">Best Price</button>`}
                <div class="price-wrapper">
                  <label ${item.price.current === item.price.beforeDiscount ? `style="color:#000"` : ``} class="price" for="">${item.price.current} ${item.price.currency === "USD" ? "$" : "₾"}</label>
                  ${item.price.beforeDiscount === item.price.current ? "" : `<p class="discount">${` ${item.price.beforeDiscount}  ${item.price.currency === "USD" ? "$" : "₾"}`}</p>`}
                  
                </div>
                <label for="carousel-item"
                  >${sliceName(String(item.title))} ...</label
                >
                 <div class="review">  
              ${generateReview(item.rating) === "" ? `<i class="fa-solid fa-star-half"></i>` : generateReview(item.rating)}
                </div>
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

  addProductClickHandlers(element);

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

  nextProduct.addEventListener("click", () => {
    count++;
    total -= 190;
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
    total += 190;
    count--;
    element.style.transform = `translateX(${total}px)`;
  });
}

async function uploadByFilter(element, Name, index) {
  let response = await fetch(
    `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
  );
  let data = await response.json();

  let fillterByCategoryDiscount = data.products.filter(
    (category) =>
      category.category.name === `${Name}` &&
      category.price.current === category.price.beforeDiscount,
  );

  element.innerHTML = ``;

  for (let item of fillterByCategoryDiscount) {
    element.innerHTML += `
        <div id="${item._id}" class="carousel-item">
              <div class="image-wrapper">
                <img
                  src= "${imageSeperator(item.category.name, item.brand)}"
                  alt=""
                />
              </div>
              <div class="content">
              ${item.price.current !== item.price.beforeDiscount ? `<button class="best-price">Best Price</button>` : `<button style="opacity:0;" class="best-price">Best Price</button>`}
                <div class="price-wrapper">
                  <label ${item.price.current === item.price.beforeDiscount ? `style="color:#000"` : ``} class="price" for="">${item.price.current} ${item.price.currency === "USD" ? "$" : "₾"}</label>
                  ${item.price.beforeDiscount === item.price.current ? "" : `<p class="discount">${` ${item.price.beforeDiscount}  ${item.price.currency === "USD" ? "$" : "₾"}`}</p>`}
                  
                </div>
                <label for="carousel-item"
                  >${sliceName(String(item.title))} ...</label
                >
                 <div class="review">  
              ${generateReview(item.rating) === "" ? `<i class="fa-solid fa-star-half"></i>` : generateReview(item.rating)}
                </div>
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

  addProductClickHandlers(element);

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

  const nextProduct = productCategoryName[index].querySelector(`.arrow.right`);
  const prevProduct = productCategoryName[index].querySelector(`.arrow.left`);

  let total = 0;
  let count = 6;
  let px = 0;

  nextProduct.addEventListener("click", () => {
    total -= 190;
    px += 20;
    if (count >= productItems.length) {
      total = 0;
      count = 6;
      px = 0;
      return;
    }
    count++;
    element.style.transform = `translateX(calc(${total}px - ${px}px))`;
  });

  prevProduct.addEventListener("click", () => {
    total += 190;
    px -= 20;
    if (count === 6) {
      total = 0;
      count = 6;
      px = 0;
      return;
    }
    count--;
    element.style.transform = `translateX(calc(${total}px - ${px}px))`;
  });
}

async function uploadByFilterBestSale(element, Name, index) {
  let response = await fetch(
    `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
  );
  let data = await response.json();

  let fillterByCategoryDiscount = data.products.filter(
    (category) =>
      category.category.name === `${Name}` &&
      category.price.current !== category.price.beforeDiscount,
  );

  element.innerHTML = ``;

  for (let item of fillterByCategoryDiscount) {
    element.innerHTML += `
        <div id="${item._id}" class="carousel-item">
              <div class="image-wrapper">
                <img
                  src= "${imageSeperator(item.category.name, item.brand)}"
                  alt=""
                />
              </div>
              <div class="content">
              ${item.price.current !== item.price.beforeDiscount ? `<button class="best-price">Best Price</button>` : `<button style="opacity:0;" class="best-price">Best Price</button>`}
                <div class="price-wrapper">
                  <label ${item.price.current === item.price.beforeDiscount ? `style="color:#000"` : ``} class="price" for="">${item.price.current} ${item.price.currency === "USD" ? "$" : "₾"}</label>
                  ${item.price.beforeDiscount === item.price.current ? "" : `<p class="discount">${` ${item.price.beforeDiscount}  ${item.price.currency === "USD" ? "$" : "₾"}`}</p>`}
                  
                </div>
                <label for="carousel-item"
                  >${sliceName(String(item.title))} ...</label
                >
                <div class="review">  
              ${generateReview(item.rating) === "" ? `<i class="fa-solid fa-star-half"></i>` : generateReview(item.rating)}
                </div>
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

  addProductClickHandlers(element);

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

  const nextProduct = productCategoryName[index].querySelector(`.arrow.right`);
  const prevProduct = productCategoryName[index].querySelector(`.arrow.left`);

  if (productItems.length <= 6) {
    nextProduct.style.display = `none`;
    prevProduct.style.display = `none`;
  }

  let total = 0;
  let count = 6;
  let px = 0;

  nextProduct.addEventListener("click", () => {
    total -= 190;
    px += 20;
    if (count >= productItems.length) {
      total = 0;
      count = 6;
      px = 0;
      return;
    }
    count++;
    element.style.transform = `translateX(calc(${total}px - ${px}px))`;
  });

  prevProduct.addEventListener("click", () => {
    total += 190;
    px -= 20;
    if (count === 6) {
      total = 0;
      count = 6;
      px = 0;
      return;
    }
    count--;
    element.style.transform = `translateX(calc(${total}px - ${px}px))`;
  });
}

// <----------------------Best-Sale მონაცემების დამუშავება-------------------------->
function sliceName(input) {
  let slicedName = input.slice(0, 25);
  return slicedName;
}

function imageSeperator(name, brand) {
  return `/assets/productIMG/${name}/${brand}.png`;
}
// <----------------------Best-Sale მონაცემების დამუშავება-------------------------->

// <------------------------------შეფასების-სისტემა------------------------------->

// function generateReview(rating) {
//   const rateAmount = Math.round(rating);
//   let ratingResult = "";
//   for (let i = 0; i < rateAmount; i++) {
//     ratingResult += `
//      <i class="fa-solid fa-star"></i>`;
//   }
//   return ratingResult;
// }

// <------------------------------შეფასების-სისტემა------------------------------->

// localStorage.clear();
