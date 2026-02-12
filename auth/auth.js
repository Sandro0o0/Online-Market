let authenticated = false;
// console.log(Date.now());

checkAuthentication();

const signinBtn = document.querySelector(`.sign-in`);
const closeBtn = document.querySelector(`.close`);
console.log(signinBtn);
console.log(closeBtn);

const formCover = document.querySelector(`.form-cover`);
const loginContainer = document.querySelector(`.login-model`);
const registerContainer = document.querySelector(`.register-model`);
let login = registerContainer.querySelector(`.logini`);
let register = loginContainer.querySelector(`.registeri`);

console.log(register);
console.log(registerContainer);
const lineContainer = document.querySelector(`.line`);

// <-----------------------Animation-Start-------------------------->

signinBtn.addEventListener("click", () => {
  formCover.classList.add("active");
  closeBtn.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  formCover.classList.remove(`active`);
  closeBtn.style.display = "none";
});

loginContainer
  .getElementsByClassName(`registeri`)[0]
  .addEventListener("click", () => {
    loginContainer.classList.remove("show");
    registerContainer.classList.add("show");
  });
registerContainer
  .getElementsByClassName(`logini`)[0]
  .addEventListener("click", () => {
    registerContainer.classList.remove("show");
    loginContainer.classList.add("show");
  });
// <-----------------------Animation-END-------------------------->

// -----------------------form Start-------------------------->

const loginForm = document.getElementsByClassName(`login-form`)[0];
const registerForm = document.getElementsByClassName(`register-form`)[0];

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = registerForm.getElementsByClassName(`name`)[0].value;
  const email = registerForm.getElementsByClassName(`email`)[0].value;
  const password = registerForm.getElementsByClassName(`password`)[0].value;
  const phone = registerForm.getElementsByClassName(`phone`)[0].value;
  const age = registerForm.getElementsByClassName(`age`)[0].value;

  registerUser(name, email, password, age, phone);
});
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.getElementsByClassName(`email`)[0].value;
  const password = loginForm.getElementsByClassName(`password`)[0].value;
  await loginUser(email, password);
});

async function loginUser(email, password) {
  try {
    const response = await fetch(
      `https://api.everrest.educata.dev/auth/sign_in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    const accessToken = data.access_token;
    localStorage.setItem("accessToken", accessToken);
    const decodedPayload = jwt_decode(accessToken);
    console.log(decodedPayload.exp);
    // console.log(decodedPayload);

    localStorage.setItem(`exp`, decodedPayload.exp);
    checkAuthentication();

    // <-------------date expired----------------->
    //
    if (decodedPayload.exp < Date.now() / 1000) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("accessToken");
      document.getElementById(`sign-in`).style.display = "flex";
      return;
    }
    // <-------------date expired----------------->

    if (authenticated) {
      window.location.href = "../index.html";
    }

    console.log(decodedPayload);
  } catch (error) {
    console.error(error);
  }
}
async function getCart() {
  try {
    const response = await fetch(`https://api.everrest.educata.dev/shop/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();

    authupdateCart(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
async function authupdateCart(data) {
  cart = [];

  for (let item of data.products) {
    try {
      let response = await fetch(
        `https://api.everrest.educata.dev/shop/products/id/${item.productId}`,
      );
      let productData = await response.json();

      cart.push({
        title: productData.title,
        price: productData.price.current,
        currency: productData.price.currency,
        id: productData._id,
        stock: productData.stock,
        image: `assets/productIMG/${productData.category.name}/${productData.brand}.png`,
        quantiti: item.quantity,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error(`Error fetching product ${item.productId}:`, error);
    }
  }

  updateCart(cart);
}
async function checkAuthentication() {
  if (localStorage.getItem("accessToken")) {
    authenticated = true;
    console.log("User is authenticated");
    document.querySelector(`.sign-in`).style.display = "none";
    getCart();
  }
  const exp = Number(localStorage.getItem("exp"));
  if (!exp) return;

  if (exp * 1000 < Date.now()) {
    const response = await fetch(
      "https://api.everrest.educata.dev/auth/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return;
  }

  // if (!window.cartLoaded) {
  //   window.cartLoaded = true; // <-- we set this flag here
  //   getCart(); // <-- now getCart() runs only once
  // }
  console.log("User is still authenticated");
}

function convertCurrency(currency, price) {
  if (currency === "USD") {
    price = price * 2.69;
    return `${price}₾`;
  } else {
    return `${price}${currency === "USD" ? "$" : "₾"}`;
  }
}
async function registerUser(name, email, password, age, phone) {
  try {
    const response = await fetch(
      `https://api.everrest.educata.dev/auth/sign_up`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: name,
          lastName: "string",
          age: age,
          email: email,
          password: password,
          address: "ragac",
          phone: phone,
          zipcode: "12345-6789",
          avatar: "https://chatgpt.com/",
          gender: "MALE",
        }),
      },
    );
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error registering user:", error);
  }
}

// -----------------------form END-------------------------->

//  ----------------Check-Validation-Start-------------------------->

//  <-----------------Check-Validation-END-------------------------->
