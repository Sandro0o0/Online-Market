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

//==========================
//   currentPage,
// pageSize,
// searchInput.value,
// category,
// brandsInput.value,
// ratingInput.value,
// 5,
// rangeInput.value,

API_BASE_URL = "http://localhost:8000";

//api.everrest.educata.dev/shop/products/search?page_index=1&page_size=2&keywords=3&category_id=4&brand=5&rating=5&price_min=7&price_max=7
const navigateMenu = document.getElementById(`navigate-menu`);
const sideBar = document.getElementById(`sidebar`);
console.log(navigateMenu.className);

navigateMenu.addEventListener("click", () => {
  if (navigateMenu.className === "fa-solid fa-bars") {
    navigateMenu.classList.remove("fa-solid", "fa-bars");
    navigateMenu.classList.add("fa-solid", "fa-x");
    // navigateMenu.classList.add("fa-x");
    sideBar.style.display = `flex`;
  } else {
    navigateMenu.classList.remove("fa-solid", "fa-x");
    navigateMenu.classList.add("fa-solid", "fa-bars");
    // navigateMenu.classList.add("fa-bars");
    sideBar.style.display = `none`;
  }
});

function fillterByUrl() {
  if (window.location.pathname === " ") {
  }

  // GET Seatch Params------------------->
  let param = new URLSearchParams(window.location.search);
  let pageIndex = param.get("page_index") || "";
  let pageSize = param.get("page_size") || param.get("page") || "";
  let pageInput = param.get("keywords") || "";
  let categoryId = param.get("category_id") || "";
  let pageBrand = param.get("brand") || "";
  let pageRation = param.get("rating") || "";
  let pagemin = param.get("price_min") || "";
  let pageMax = param.get("price_max") || "";
  // GET Seatch Params------------------->
  //change style of element-Wrapper
  document.getElementById(`fillter-wrapper`).style.height = `100%`;
  //change style of element-Wrapper

  rangeInput.value = pageMax;
  searchInput.value = pageInput;
  brandsInput.value = pageBrand;
  ratingInput.value = pageRation;
  currentPage = pageIndex;

  currentHtml.textContent = `${currentPage}`;

  if (categoryId === "1" || phoneInput.checked === true) {
    phoneInput.checked = false;
    laptopInput.checked = true;
  } else if (categoryId === "") {
    laptopInput.checked = false;
    phoneInput.checked = false;
  } else {
    laptopInput.checked = false;
    phoneInput.checked = true;
  }

  currentRange.textContent = rangeInput.value;
  // console.log(id);
  changeOnFillter(
    pageIndex,
    pageSize,
    pageInput,
    categoryId,
    pageBrand,
    pageRation,
    pagemin,
    pageMax,
  );
  // console.log(getUrl.href);

  rangeInput.addEventListener(
    "mousemove",
    () => (currentRange.textContent = rangeInput.value),
  );

  rangeInput.addEventListener("mouseup", () => {
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
    if (currentPage <= 1) return;
    currentPage--;
    currentHtml.textContent = `${currentPage}`;
    applyFilters();
  });
}

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
fillterByUrl();
const fillterContainer = document.getElementById(`fillter-item-container`);

function applyFilters() {
  let category = "";
  document.getElementById(`fillter-wrapper`).style.height = `100%`;

  if (laptopInput.checked && !phoneInput.checked) {
    category = laptopInput.value;
  } else if (phoneInput.checked && !laptopInput.checked) {
    category = phoneInput.value;
  }
  // console.log(currentPage);

  changeURl(
    currentPage,
    currentPage,
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
    `${API_BASE_URL}/shop/products/search?${index ? `page_index=${index}` : ""}&${size ? `&page=${size}` : ""}&${keys ? `&keywords=${keys}` : ""}&${category ? `&category_id=${category}` : ""}&${brand ? `&brand=${brand}` : ""}&${rating ? `&rating=${rating}` : ""}&${pricemin ? `&price_min=${pricemin}` : ""}&${pricemax ? `&price_max=${Math.round(pricemax / 2.66)}` : ""}`,
  );

  currentData = await response.json();
  renderProducts(currentData);
}
async function changeURl(
  index,
  size,
  keys,
  category,
  brand,
  rating,
  pricemin,
  pricemax,
) {
  // const response = await fetch(
  //   `https://api.everrest.educata.dev/shop/products/search?${index ? `page_index=${index}` : ""}&${size ? `&page_size=${size}` : ""}&${keys ? `&keywords=${keys}` : ""}&${category ? `&category_id=${category}` : ""}&${brand ? `&brand=${brand}` : ""}&${rating ? `&rating=${rating}` : ""}&${pricemin ? `&price_min=${pricemin}` : ""}&${pricemax ? `&price_max=${pricemax}` : ""}`,
  // );

  window.location.href = `?${index ? `page_index=${index}` : ""}${size ? `&page=${size}` : ""}${keys ? `&keywords=${keys}` : ""}${category ? `&category_id=${category}` : ""}${brand ? `&brand=${brand}` : ""}${rating ? `&rating=${rating}` : ""}${pricemin ? `&price_min=${pricemin}` : ""}${pricemax ? `&price_max=${pricemax}` : ""}`;

  // currentData = await response.json();
  // renderProducts(currentData);
}

function renderProducts(data) {
  // fillterItemContainer.innerHTML = "";
  fillterContainer.innerHTML = ``;

  data.products.forEach((element) => {
    fillterItemContainer.innerHTML += `
      <div id="${element._id}"  class="carousel-item">
        <div class="image-wrapper">
          <img src="../assets/productIMG/${element.category_detail.name}/${element.brand}.png" />
        </div>

        <div class="content">
          ${
            element.price.current !== element.price.beforeDiscount
              ? `<button class="best-price">Best Price</button>`
              : ""
          }

          <div class="price-wrapper">
                                                    <label class="price" for="">${convertCurency(element.price.current, element.price.currency, "")}</label>
                  <p class="discount">${convertCurency(element.price.current, element.price.currency, element.price.beforeDiscount)}</p>
          </div>

          <label>${element.title.slice(0, 20)}...</label>

          <div class="review">
            ${generateReview(element.ratings)}
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
  const response = await fetch(`${API_BASE_URL}/shop/products/id/${productid}`);

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
  // localStorage.setItem("cart", JSON.stringify(cart));
  // cart = JSON.parse(localStorage.getItem(`cart`));
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
