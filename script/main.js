let cart = JSON.parse(localStorage.getItem("cart")) || [];
let searchContainer = document.getElementById(`search-bar`);

console.log(searchContainer);

if (searchContainer) {
  searchContainer.addEventListener("keydown", (e) => {
    if (searchContainer.value === " ") {
      return;
    }
    if (e.key === "Enter") {
      window.location.href = `../navigation/navigation.html?page_index=1&page_size=15&keywords=${searchContainer.value}&price_min=5&price_max=100000`;
    }
  });
}

async function load() {
  addCategorie();
  uploadBestSale(itemCarouselProduct[0]);
  uploadCategory(itemCarouselProduct[1], "laptops");
  uploadCategory(itemCarouselProduct[2], "phones");
  uploadByFilter(itemCarouselProduct[3], "phones", 1);
  uploadByFilter(itemCarouselProduct[4], "laptops", 1);
  uploadByFilterBestSale(itemCarouselProduct[5], "laptops", 2);
  uploadByFilterBestSale(itemCarouselProduct[6], "phones", 2);
  // ჩატვირთვა
}

load();

// <--------------------cart-manipulation------------------->
async function removeProduct(d) {
  // let found;
  let found = Array.from(document.getElementsByClassName(`cart-item`)).find(
    (item) => item.id === d,
  );
  found.remove();
  const index = cart.findIndex((item) => item.id === d);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  let response = await fetch(
    `https://api.everrest.educata.dev/shop/cart/product`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        id: d,
      }),
    },
  );
  if (window.location.pathname === `/cart/cart.html`) {
    const cartBody = document.getElementById(`cart-body-container`);
    console.log(cartBody);
    let item = document.getElementById(`${d}`);
    console.log(item);
    await updateCartPage();
  }

  updateCart(cart);
}

async function increament(d) {
  let found = cart.find((item) => item.id === d);
  if (found.stock < found.quantiti + 1) {
    alert(`მარაგში არ არის საკმარისი`);
    return;
  }
  found.quantiti++;

  console.log(found);
  let response = await fetch(
    `https://api.everrest.educata.dev/shop/cart/product`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        id: d,
        quantity: found.quantiti,
      }),
    },
  );
  if (window.location.pathname === `/cart/cart.html`) {
    const cartBody = document.getElementById(`cart-body-container`);
    console.log(cartBody);

    let item = document.getElementById(`${d}`);
    let e = item.querySelector(`#product-quantiti`);
    e.textContent = `${found.quantiti}`;
    updateCartPage();
  }
  let data = await response.json();
  updateCart(cart);
}
async function decreament(d) {
  let found = cart.find((item) => item.id === d);
  if (found.quantiti <= 1) {
    return;
  } else {
    found.quantiti--;

    let response = await fetch(
      `https://api.everrest.educata.dev/shop/cart/product`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: d,
          quantity: found.quantiti,
        }),
      },
    );

    if (window.location.pathname === `/cart/cart.html`) {
      const cartBody = document.getElementById(`cart-body-container`);
      console.log(cartBody);

      let item = document.getElementById(`${d}`);
      console.log(found);
      let e = item.querySelector(`#product-quantiti`);
      e.textContent = `${found.quantiti}`;
      console.log(e);
      console.log(d);
      updateCartPage();
      // item.getElementById;
      // return;
    }
  }
  updateCart(cart);
}
// <--------------------cart-manipulation------------------->
function updateCart(cart) {
  const cartWrapper = document.getElementById(`cart-body`);

  if (!cartWrapper) {
    return;
  }

  cartWrapper.innerHTML = ``;
  if (cart.length < 1) {
    cartWrapper.innerHTML = `
     <img src="../assets/emptybag.svg" alt="NOT" />`;
  } else {
    cart.forEach((item) => {
      cartWrapper.innerHTML += `
                <span id="${item.id}" class="cart-item">
                  <span class="cart-item-content">
                    <img src="../${item.image}" alt="" />
                    <span class="cart-text">
                      <p>${item.title.slice(0, 25)}...</p>
                      <p class="cart-item-price">${item.price}${item.currency === "USD" ? "$" : "₾"}</p>
                    </span>
                  </span>
                  <span class="interact">
                    <i onclick="removeProduct('${item.id}')" class="fa-solid fa-delete-left"></i>
                    <span class="cart-item-manipulations">
                    <span onclick="decreament('${item.id}')">-</span>
                    <div class="item-amount">${item.quantiti}</div>
                    <span class="increament" onclick="increament('${item.id}')" >+</span>
                    </span>
                  </span>
                </span>
              `;
    });
  }

  const cartAmount = document.getElementById(`cart-amount`);
  const cartTotal = document.getElementById(`cart-total`);
  const rates = {
    USD: 2.69,
    GEL: 1,
  };
  console.log(cart);
  cartTotal.textContent = `${cart.reduce(
    (sum, item) =>
      Math.round(sum + item.price * rates[item.currency] * item.quantiti),
    0,
  )}₾ `;
  cartAmount.textContent = `${cart.reduce((sum, item) => sum + item.quantiti, 0)}`;
}

function generateReview(rating) {
  const rateAmount = Math.round(rating);
  let ratingResult = "";
  for (let i = 0; i < rateAmount; i++) {
    ratingResult += `
     <i class="fa-solid fa-star"></i>`;
  }
  return ratingResult;
}

function convertCurency(price, currency, discount) {
  const rate = {
    USD: 2.69,
    GEL: 1,
  };
  if (discount !== price && discount !== "") {
    console.log(discount);
    return `${Math.round(discount * rate[currency])} ₾ `;
  } else if (discount === price) {
    return ``;
  }
  // console.log(price);
  return `${Math.round(price * rate[currency])} ₾`;
}

async function updateCartPage() {
  try {
    const accessToken = localStorage.getItem(`accessToken`);
    const response = await fetch(`https://api.everrest.educata.dev/shop/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return;
    }

    let data = await response.json();
    const itemCountElement = document.getElementById(`product-amount`);
    itemCountElement.innerHTML = `შენს კალათაში არის ${data.total.products} ნივთი`;
    getTotal();
  } catch (error) {
    console.error(error);
  }
}
