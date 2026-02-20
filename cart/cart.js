const itemCountElement = document.getElementById(`product-amount`);
const cartBody = document.getElementById(`cart-body-container`);

const cartTotalPrice = document.getElementById(`cart-total-price`);
const cartBeforeDiscount = document.getElementById(`before-discount-price`);
const total = document.getElementById(`total`);

const clearCartElement = document.getElementById(`clear-cart-container`);

clearCartElement.addEventListener("click", async () => {
  const accessToken = localStorage.getItem(`accessToken`);

  const response = await fetch(`https://api.everrest.educata.dev/shop/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!response.ok) {
    return;
  }
  const data = await response.json();
  cartBody.innerHTML = ``;
  const itemCountElement = document.getElementById(`product-amount`);
  itemCountElement.innerHTML = `შენს კალათაში არის 0 ნივთი`;
  for (let products of data.products) {
    let request = await fetch(
      `https://api.everrest.educata.dev/shop/cart/product`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: products.productId,
        }),
      },
    );
  }
  getTotal();
  // return;

  // cartBody.innerHTML = "";
  // cart = [];
  // localStorage.removeItem("cart");
  // const itemCountElement = document.getElementById(`product-amount`);
  // itemCountElement.innerHTML = `შენს კალათაში არის 0 ნივთი`;
});

console.log(itemCountElement);

console.log(cart);
async function generateCartitems() {
  cartBody.innerHTML = ``;

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
  itemCountElement.innerHTML = `შენს კალათაში არის ${data.total.products} ნივთი`;

  cartTotalPrice.textContent = ``;

  for (let i of data.products) {
    const productId = i.productId;
    const resp = await fetch(
      `https://api.everrest.educata.dev/shop/products/id/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Typee": "application/json",
        },
      },
    );
    let dt = await resp.json();
    console.log(dt);
    cartBody.innerHTML += `
      <div  id="${dt._id}" class="cart-item">
              <div class="cart-item-content">
                <img src="../assets/productIMG/${dt.category.name}/${dt.brand}.png" alt="" />
                <div class="cart-item-text">
                  <label for="">${dt.title}</label>
                  <div class="price-wrapper">
                     <label class="price" for="">${convertCurency(dt.price.current, dt.price.currency, "")}</label>
                  <p class="discount">${convertCurency(dt.price.current, dt.price.currency, dt.price.beforeDiscount)}</p>
                  </div>
                </div>
              </div>
              <div class="cart-manipulation">
                <div class= "quantity-controls">
                  <span onclick="decreament('${dt._id}')">-</span>
                  <div id="product-quantiti">${i.quantity}</div>
                  <span onclick="increament('${dt._id}')">+</span>
                </div>
                <i onclick="removeProduct('${dt._id}')" id="remove-product" class="fa-solid fa-trash"></i>
              </div>
            </div>`;
  }
  let cartItem = Array.from(document.getElementsByClassName(`cart-item`));

  cartItem.forEach((item) => {
    item.addEventListener(`click`, (e) => {
      if (e.target.closest(`.cart-manipulation`)) {
        return;
      }

      window.location.href = `/product_page/product.html?id=${item.id}`;
    });
  });

  getTotal();

  console.log(data);
}

window.addEventListener("DOMContentLoaded", async () => {
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
  console.log(data);
  itemCountElement.innerHTML = `შენს კალათაში არის ${data.total.products} ნივთი`;
});

function getTotal() {
  const items = document.querySelectorAll(`.cart-item`);

  let total = 0;
  let discountTotal = 0;

  items.forEach((el) => {
    const price = el.getElementsByClassName(`price`)[0];
    const discount = el.getElementsByClassName(`discount`)[0];
    const quantity = el.querySelector(`#product-quantiti`);

    const clean = price.textContent
      .replace(/[^\d.]/g, "")
      .replace(/,/g, ".")
      .trim();

    const value = Number(clean);

    if (!isNaN(value)) {
      total += value * quantity.textContent;
    } else {
      console.warn("Invalid price format:", el.textContent);
    }

    if (discount && discount.textContent.trim()) {
      const discountClean = discount.textContent
        .replace(/[^\d.]/g, "")
        .replace(/,/g, ".")
        .trim();
      const discountValue = Number(discountClean);
      if (!isNaN(discountValue)) {
        discountTotal += discountValue * quantity.textContent;
      }
    } else {
      discountTotal += value * quantity.textContent;
    }
  });

  console.log("Total:", total);
  console.log("Discount Total:", discountTotal);

  document.getElementById("cart-total-price").textContent = total + " ₾";
  document.getElementById(`before-discount-price`).textContent =
    discountTotal + " ₾";
  document.getElementById(`total`).textContent = total + " ₾";
}
async function checkOut() {
  const accessToken = localStorage.getItem("accessToken");
  if (cart.length < 1) {
    return;
  }
  if (!accessToken) {
    Swal.fire({
      title: "შეცდომა",
      text: "გთხოვთ, შეხვიდეთ ანგარიშში",
      icon: "error",
    });
    return;
  }

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  try {
    const result = await swalWithBootstrapButtons.fire({
      title: "დარწმუნებული ხართ რომ გსურთ გადახდა?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "გადახდა",
      cancelButtonText: "გაუქმება",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      swalWithBootstrapButtons.fire({
        title: "გაუქმებულია",
        text: "გადახდა არ განხორციელდა",
        icon: "info",
      });
      return;
    }

    swalWithBootstrapButtons.fire({
      title: "წარმატებულია",
      text: "გადახდა განხორციელდა წარმატებით",
      icon: "info",
    });

    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Checkout success:", data);

    // Clean up & UI feedback
    localStorage.removeItem("cart");

    // await swalWithBootstrapButtons.fire({
    //   title: "წარმატებულია!",
    //   text: "გადახდა დასრულებულია",
    //   icon: "success",
    // });

    window.location.reload(); // or redirect to /orders or thank-you page
    // updateCartPage();      // if you have such function
  } catch (error) {
    console.error("Checkout error:", error);

    Swal.fire({
      title: "შეცდომა",
      text: "გადახდისას წარმოიშვა პრობლემა. სცადეთ მოგვიანებით.",
      icon: "error",
    });
  }
}

generateCartitems();
