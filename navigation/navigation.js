// import { checkAuthentication } from "../auth/auth.js";
// checkAuthentication();

// function checkAuthentication() {
//   if (localStorage.getItem("accessToken")) {
//     authenticated = true;
//     console.log("User is authenticated");
//     document.getElementById(`sign-in`).style.display = "none";
//     getCart();
//   }
// }

cart = JSON.parse(localStorage.getItem("cart")) || [];
// console.log(cart);
updateCart(cart);

const fillterItemContainer = document.getElementById("fillter-item-container");
const navigate = document.getElementById("navigate");

const rangeInput = document.getElementById("range");
const currentRange = document.getElementById("current-range");

const laptopInput = document.getElementById("check-laptops");
const phoneInput = document.getElementById("check-phones");
const searchInput = document.getElementById("navigate-search");
const brandsInput = document.getElementById("brands-input");
const ratingInput = document.getElementById("rating-input");

const nextBtn = document.getElementById("next-page");
const prevBtn = document.getElementById("prev-page");
const pages = document.getElementById("pages");
let currentHtml = document.getElementById(`current-html`);

// Global
let currentData = null;
let pageSize = 15;
let currentPage = 1;

currentRange.textContent = rangeInput.value;

rangeInput.addEventListener("input", () => {
  currentRange.textContent = rangeInput.value;
  currentPage = 1;
  applyFilters();
});

navigate.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});

nextBtn.addEventListener("click", () => {
  if (!currentData || currentData.products.length < pageSize) return;
  currentPage++;
  currentHtml.textContent = `${currentPage}`;
  applyFilters();
});

prevBtn.addEventListener("click", () => {
  if (currentPage === 1) return;
  currentPage--;
  currentHtml.textContent = `${currentPage}`;
  applyFilters();
});

function applyFilters() {
  let category = "";
  document.getElementById(`fillter-wrapper`).style.height = `100%`;

  if (laptopInput.checked && !phoneInput.checked) {
    category = laptopInput.value;
  } else if (phoneInput.checked && !laptopInput.checked) {
    category = phoneInput.value;
  }
  // console.log(currentPage);

  changeOnFillter(
    currentPage,
    pageSize,
    searchInput.value,
    category,
    brandsInput.value,
    ratingInput.value,
    5,
    rangeInput.value,
  );
}

async function changeOnFillter(
  index,
  size,
  keys,
  category,
  brand,
  rating,
  pricemin,
  pricemax,
) {
  const response = await fetch(
    `https://api.everrest.educata.dev/shop/products/search?${index ? `page_index=${index}` : ""}&${size ? `&page_size=${size}` : ""}&${keys ? `&keywords=${keys}` : ""}&${category ? `&category_id=${category}` : ""}&${brand ? `&brand=${brand}` : ""}&${rating ? `&rating=${rating}` : ""}&${pricemin ? `&price_min=${pricemin}` : ""}&${pricemax ? `&price_max=${pricemax}` : ""}`,
  );

  currentData = await response.json();
  renderProducts(currentData);
}

function renderProducts(data) {
  fillterItemContainer.innerHTML = "";

  data.products.forEach((element) => {
    fillterItemContainer.innerHTML += `
      <div id="${element._id}"  class="carousel-item">
        <div class="image-wrapper">
          <img src="../assets/productIMG/${element.category.name}/${element.brand}.png" />
        </div>

        <div class="content">
          ${
            element.price.current !== element.price.beforeDiscount
              ? `<button class="best-price">Best Price</button>`
              : ""
          }

          <div class="price-wrapper">
            <label class="price">
              ${element.price.current}${element.price.currency === "USD" ? "$" : "₾"}
            </label>

            ${
              element.price.current !== element.price.beforeDiscount
                ? `<p class="discount">${element.price.beforeDiscount}</p>`
                : ""
            }
          </div>

          <label>${element.title.slice(0, 20)}...</label>

          <div class="review">
            ${generateReview(element.rating)}
          </div>

          <div class="button-wrapper">
            <button   class="add-to-cart-btn">
              <i class="fa-solid fa-cart-shopping"></i> დამატება
            </button>
          </div>
        </div>
      </div>
    `;
  });
  let item = Array.from(document.getElementsByClassName(`carousel-item`));

  item.forEach((e) => {
    const addBtn = e.querySelector(".add-to-cart-btn");

    // Redirect when clicking the card
    e.addEventListener("click", () => {
      window.location.href = `../product_page/product.html?id=${e.id}`;
    });

    // Prevent redirect when clicking Add to Cart
    if (addBtn) {
      addBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        addToCart(e.id);
        return;
      });
    }
  });
  console.log(item);

  pages.style.display = "flex";
}

function loadProductPage(id) {
  window.location.href = `../product_page/product.html?id=${id}`;
}

async function addToCart(productid) {
  const response = await fetch(
    `https://api.everrest.educata.dev/shop/products/id/${productid}`,
  );

  const data = await response.json();
  console.log(cart);

  const existingProduct = cart.find((item) => item.id === data._id);
  if (existingProduct) return;

  const cartNew = {
    id: data._id,
    title: data.title,
    price: data.price.current,
    currency: data.price.currency,
    stock: data.stock,
    image: `../assets/productIMG/${data.category.name}/${data.brand}.png`,
    quantiti: 1,
  };

  if (!localStorage.getItem("accessToken")) {
    Swal.fire({
      title: "ჯერ უნდა შეხვიდეთ ანგარიშში",
      icon: "warning",
    });
    return;
  }
  const checkVerified = JSON.parse(localStorage.getItem("temp"));
  if (!checkVerified.verified) {
    Swal.fire({
      title: "თქვენი ანგარიში არ არის ვერიპიცირებული",
      icon: "warning",
      html: `
    
    <a style="text-decoration:none;" href="../auth/account.html" autofocus>დააჭირეთ აქ</a>,
  `,
    });
    return;
  }
  if (cartNew.stock < 1) {
    Swal.fire({
      title: "მარაგში რაოდენობა ამოიწურა",
      icon: "error",
    });

    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem(`cart`));
  cart.push(cartNew);

  saveCart(cartNew);
  updateCart(cart);
}
async function saveCart(cartNew) {
  try {
    if (!localStorage.getItem("cart")) {
      await fetch(`https://api.everrest.educata.dev/shop/cart/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: `${cartNew.id}`,
          quantity: 1,
        }),
      });
      return;
    } else {
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
    }
    let data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("Error saving cart:", error);
  }
  return false;
}

// function getUrlParam() {
//   const params = new URLSearchParams(window.location.search);
//   console.log(params);
// }

// getUrlParam();
