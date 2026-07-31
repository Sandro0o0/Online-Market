const API_BASE_URL = "http://localhost:8000";
let authenticated = false;
checkAuthentication();

const signinBtn = document.querySelector(`.sign-in`);
const closeBtn = document.querySelector(`.close`);

const formCover = document.querySelector(`.form-cover`);
const loginContainer = document.querySelector(`.login-model`);
const registerContainer = document.querySelector(`.register-model`);
let login = registerContainer.querySelector(`.logini`);
let register = loginContainer.querySelector(`.registeri`);

const lineContainer = document.querySelector(`.line`);

const forgetPassword =
  document.getElementsByClassName(`forgot-passwork-link`)[0];
const forgetTab = document.getElementById(`forget-tab`);
const forgetForm = document.getElementById(`forget-form`);
const forgetEmail = document.getElementsByClassName(`forgot-email`)[0];
// console.log(forgetEmail);
// console.log(forgetForm);
forgetForm.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const response = await fetch(
    `https://api.everrest.educata.dev/auth/recovery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: forgetEmail.value,
      }),
    },
  );
  if (!response.ok) {
    console.error(`${response.status}`);
    Swal.fire({
      title: "დაფიქსირდა შეცდომა",
      text: "ემაილი ვერ მოიძებნა",
      icon: "error",
    });
    forgetEmail.value = ``;
    return;
  }
  Swal.fire({
    title: "პაროლს გამოგიგზავნით ემაილზე",
    text: `${forgetEmail.value}`,
    icon: "success",
  });
  window.location.reload();
});
forgetPassword.addEventListener("click", () => {
  loginContainer.classList.remove(`show`);
  forgetTab.style.display = `flex`;
  forgetTab.classList.add(`show`);
});
// console.log(forgetPassword);
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
  const confirmPassword =
    registerForm.getElementsByClassName(`confirm-password`)[0].value;
  // const phone = registerForm.getElementsByClassName(`phone`)[0].value;
  // const age = registerForm.getElementsByClassName(`age`)[0].value;

  if (password !== confirmPassword) {
    Swal.fire({
      title: "პაროლები არ ემთხვევა",
      icon: "error",
    });
    return;
  }
  registerUser(name, email, password, confirmPassword);
});
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginForm.getElementsByClassName(`username`)[0].value;
  const password = loginForm.getElementsByClassName(`password`)[0].value;
  await loginUser(username, password);
});

async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      document.getElementById(`login-message`).textContent =
        `პაროლი ან მომხმარებლის სახელი არასწორია`;
      document.getElementById(`login-message`).style.color = `red`;
      throw new Error("Failed to login");
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const decodedPayload = jwt_decode(accessToken);

    console.log(decodedPayload);

    localStorage.setItem(`exp`, decodedPayload.exp);
    localStorage.setItem(`temp`, JSON.stringify(decodedPayload));
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
    // console.log(document.getElementsByTagName(`body`));
    document.getElementsByTagName(`body`)[0].style.overflow = `visible`;
    closeBtn.style.display = `none`;

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
    if (!response.ok) {
      return;
    }

    authupdateCart(data);
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
async function authupdateCart(data) {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

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
      // localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error(`Error fetching product ${item.productId}:`, error);
    }
  }

  updateCart(cart);
}
async function checkAuthentication() {
  if (localStorage.getItem("accessToken")) {
    document.querySelector(`.sign-in`).style.display = "none";

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.log("No refresh token found in localStorage");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();
    console.log(data.access_token);

    localStorage.setItem("accessToken", data.access_token);

    const decoded = jwt_decode(data.access_token);
    localStorage.setItem("exp", decoded.exp);
    localStorage.setItem("temp", JSON.stringify(decoded));

    authenticated = true;
    console.log("User is authenticated");
    document.getElementById(`account-container`).style.display = `flex`;
    document.getElementById(`account-name-input`).innerHTML =
      `${JSON.parse(localStorage.getItem(`temp`)).firstName.slice(0, 1)}`;
    getCart();
  } else {
    document.getElementById(`account-container`).style.display = `none`;
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
          Authorization: `Bearer ${localStorage.getItem(`accessToken`)}`,
        },
      },
    );

    localStorage.removeItem("exp");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("cart");
    localStorage.removeItem("temp");
    console.log("Token expired");
    return;
  }

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
async function registerUser(name, email, password, confirmPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/sign_up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name,
        password: password,
        confirm_password: password,
        email: email,
        // age: age,
        // address: "ragac",
        // phone: `+995 ${phone}`,
        // zipcode: "12345-6789",
        // avatar: "https://chatgpt.com/",
        // gender: "MALE",
      }),
    });
    let data = await response.json();
    let formError = document.getElementsByClassName(`form-error`)[0];
    formError.textContent = `${checkRegValidations(data.errorKeys, formError)}`;
    console.log(data.errorKeys);
  } catch (error) {
    console.log("Error registering user:", error);
  }
}

// -----------------------form END-------------------------->

//  ----------------Check-Validation-Start-------------------------->
function checkRegValidations(error, message) {
  console.log(error);
  if (!error) {
    message.style.color = `green`;
    window.location.reload();
    closeBtn.style.display = `none`;
    return "თქვენ წარმატებით გაიარეთ რეგისტრაცია";
  }
  for (let element of error) {
    console.log(typeof Array(element));

    if (element === "errors.invalid_age") {
      message.style.color = `red`;
      return "ასაკი არასწორია";
    } else if (element === "errors.email_in_use") {
      message.style.color = `red`;
      return "ემაილი უკვე გამოყენებულია";
    } else if (element === "errors.invalid_phone_number") {
      message.style.color = `red`;
      return "ნომერი არასწორია";
    } else if (element === "errors.password_too_short") {
      message.style.color = `red`;
      return "პაროლი უნდა შეადგენდეს მინიმუმ 6 ასოს";
    }
  }
}
//  <-----------------Check-Validation-END-------------------------->
