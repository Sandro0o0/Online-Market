// let authenticated = false;
// checkAuthentication();
// let cart = JSON.parse(localStorage.getItem("cart")) || [];

// async function checkAuthentication() {
//   if (localStorage.getItem("accessToken")) {
//     authenticated = true;
//     console.log("User is authenticated");

//     await getCart();
//   }
// }

// async function getCart() {
//   console.log(cart);
//   try {
//     const response = await fetch(`https://api.everrest.educata.dev/shop/cart`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//     });
//     const data = await response.json();
//     await authupdateCart(data);
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//   }
// }

// async function authupdateCart(data) {
//   cart = [];

//   for (let item of data.products) {
//     try {
//       let response = await fetch(
//         `https://api.everrest.educata.dev/shop/products/id/${item.productId}`,
//       );
//       let productData = await response.json();

//       cart.push({
//         title: productData.title,
//         price: productData.price.current,
//         currency: productData.price.currency,
//         id: productData._id,
//         stock: productData.stock,
//         image: `../assets/productIMG/${productData.category.name}/${productData.brand}.png`,
//         quantiti: item.quantity,
//       });
//     } catch (error) {
//       console.error(`Error fetching product ${item.productId}:`, error);
//     }
//   }

//   updateCart(cart);
// }

// updateCart(cart);
async function productPageLoad() {
  function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }
  const productId = getProductIdFromURL();
  const fetchById = await fetch(
    `https://api.everrest.educata.dev/shop/products/id/${productId}`,
  );
  let data = await fetchById.json();

  //   console.log("Product ID:", productId);
  const productContainer = document.getElementById(`product-holder`);
  const priceContainer = document.getElementById(`product-price`);
  const similarProduct = document.getElementById(`similar-carousel-container`);

  generateProductContent(productContainer, data);
  generatePrice(priceContainer, data);
  generateSimilarProduct(similarProduct, data);
  const alternativeContainer = Array.from(
    document.querySelectorAll(`.alternative-img-wrapper`),
  );
  const currentImg = document.getElementById(`current-img`);

  alternativeContainer.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector(`img`);
      currentImg.src = img.src;
      console.log(img.src);
    });
  });
  console.log(alternativeContainer);
}

productPageLoad();

function generateProductContent(element, data) {
  sessionStorage.setItem(
    "Current Image",
    `../assets/productIMG/${data.category.name}/${data.brand}.png`,
  );
  let result = `${(element.innerHTML = `
            <nav>
              <div class="links">
                <a href="/index.html">
                  <h5>მთავარი</h5>
                </a>
                &#10095;
                <a href="">
                  <h4>${data.category.name === "laptops" ? "ლეპტოპები" : "ტელეფონები"}</h4>
                </a>
                &#10095;
                <a href="">
                  <h3>${data.brand}</h3>
                </a>
              </div>
              <div id="product-id"># ${data._id}</div>
            </nav>
            <div id="product-content" class="product-content">
              <div class="img-wrapper">
                <h2>${data.title}</h2>
                <img
                   id ="current-img"
                  src="${sessionStorage.getItem("Current Image")}"
                  alt="NOT FOUND!"
                />
                  <div id="alternative-img" class="alternative-img ">
                    <div  class="alternative-img-wrapper">
                    <input id="input-1" type="radio" name= "img"/>
                    <img 
                    id="img-1"
                    src="${sessionStorage.getItem("Current Image")}"
                    alt="NOT FOUND!"
                    />
                    </div>
                    <div  class="alternative-img-wrapper">
                    <input id="input-2" type="radio" name= "img"/>
                    <img 
                    id="img-2"
                    src="../assets/pc-banner.jpg"
                    alt="NOT FOUND!"
                    />
                    </div>
                    <div  class="alternative-img-wrapper">
                    <input id="input-3" type="radio" name= "img"/>
                    <img 
                    id="img-3"
                    src="${sessionStorage.getItem("Current Image")}"
                    alt="NOT FOUND!"
                    />
                    </div>
                    <div  class="alternative-img-wrapper">
                    <input id="input-4" type="radio" name= "img"/>
                    <img 
                    id="img-4"
                    src="${sessionStorage.getItem("Current Image")}"
                    alt="NOT FOUND!"
                    />
                    </div>
                  </div>
              </div>
              <div style="width: 70%" class="description">
                <ul>
                  <li>
                    დასახელება :
                    <p>-${data.title}</p>
                  </li>
                  <li>
                    კატეგორია :
                    <p>-${data.category.name.toUpperCase()}</p>
                  </li>
                  <li>
                    გამოშვების თარიღი :
                    <p>${data.issueDate.toUpperCase().slice(0, 10)} Date</p>
                  </li>
                  <li>
                    ბრენდი :
                    <p>${data.brand.toUpperCase()}</p>
                  </li>
                  <li>
                    რაოდენობა :
                    <p>(${data.stock}) ცალი</p>
                  </li>
                  <li>
                    გარანტია :
                    <p>(${data.warranty}) წელი</p>
                  </li>
                  <li>
                  რეიტინგი:
                    <div id="review" class="review">
                     ${generateReview(data.rating)}(${data.ratings.length})
                    </div>
                  </li>
                  <li>
                    <button id="review-btn">შეფასების დატოვება</button>
                  </li>
                  
                </ul>

              </div>

            </div>
            <div class="product-description">
            <h2>პროდუქტის დახასიათება</h2>
            <br/
            <p>${data.description}</p>
            </div>
          `)}`;

  rateUs(data._id);
  console.log(element);
  return result;
}

function generatePrice(element, data) {
  const result = (element.innerHTML = ` 
    <div class="price-head">
                             <label class="price" for="">${convertCurency(data.price.current, data.price.currency, "")}</label>
                  <span class="discount">${convertCurency(data.price.current, data.price.currency, data.price.beforeDiscount)}</span>
            </div>
        <button id="${data._id}" onclick="addToCart('${data._id}')" class="add-to-cart-btn">დამატება</button>`);
  return result;
}

async function generateSimilarProduct(element, d) {
  let response = await fetch(
    `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38`,
  );
  let data = await response.json();

  let fillterBycategory = data.products.filter(
    (category) =>
      category.category.name === `${d.category.name}` && category._id !== d._id,
  );
  console.log(fillterBycategory);

  element.innerHTML = ``;

  for (let item of fillterBycategory) {
    element.innerHTML += `
        <div  id="${item._id}" class="similar-carousel-item">
              <div class="image-wrapper">
                <img
                  src= "${imageSeperator(item.category.name, item.brand)}"
                  alt=""
                />
              </div>
              <div class="content">
              ${item.price.current !== item.price.beforeDiscount ? `<button class="best-price">Best Price</button>` : `<button style="opacity:0;" class="best-price">Best Price</button>`}
                <label for="carousel-item"
                  >${sliceName(String(item.title))} ...</label
                >
                 <div class="review">  
              ${generateReview(item.rating) === "" ? `<i class="fa-solid fa-star-half"></i>` : generateReview(item.rating)}
                </div>
                <div class="price-wrapper">
                                                 <label class="price" for="">${convertCurency(item.price.current, item.price.currency, "")}</label>
                  <p class="discount">${convertCurency(item.price.current, item.price.currency, item.price.beforeDiscount)}</p>  </div>
                <div class="button-wrapper">
                  <button onclick="addToCart('${item._id}')" class="add-to-cart-btn">
                    <i class="fa-solid fa-cart-shopping"></i>
                    დამატება
                  </button>
                </div>
              </div>
            </div>
        `;
  }

  addProductClickHandlers(element, ".similar-carousel-item");
  let productItems = Array.from(
    element.querySelectorAll(`.similar-carousel-item`),
  );
  const nextProduct = document.querySelector(`.similar-products .arrow.right`);
  const prevProduct = document.querySelector(`.similar-products .arrow.left`);

  let total = 0;
  let count = 6;

  nextProduct.addEventListener("click", () => {
    if (count < productItems.length) {
      count++;
      total -= 210;
      element.style.transform = `translateX(${total}px)`;
    }
  });

  prevProduct.addEventListener("click", () => {
    if (count > 6) {
      count--;
      total += 210;
      element.style.transform = `translateX(${total}px)`;
    }
  });
}
async function rateUs(id) {
  try {
    const reviewCover = Array.from(
      document.getElementsByClassName(`review-cover`),
    )[0];
    const reviewClose = document.getElementById(`review-close`);
    const reviewButton = document.getElementById(`review-btn`);
    console.log(reviewButton);
    let stars = Array.from(
      reviewCover.getElementsByClassName(`fa-solid fa-star`),
    );
    const body = Array.from(document.getElementsByTagName(`body`))[0];
    reviewButton.addEventListener(`click`, () => {
      const accessToken = localStorage.getItem(`accessToken`);
      if (!accessToken) {
        Swal.fire({
          text: "ჯერ უნდა შეხვიდეთ ანგარიშზე",
          icon: "error",
        });
        body.style.overflow = `visible`;
        return;
      }
      reviewCover.style.display = `flex`;
      body.style.overflow = `hidden`;
    });
    reviewClose.addEventListener("click", () => {
      reviewCover.style.display = `none`;
      body.style.overflow = `visible`;
    });

    for (let item of stars) {
      item.addEventListener("click", async () => {
        const number = item.id.slice(item.id.length - 1, item.id.length);
        const accessToken = localStorage.getItem(`accessToken`);
        console.log(accessToken);
        const response = await fetch(
          `https://api.everrest.educata.dev/shop/products/rate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              productId: id,
              rate: number,
            }),
          },
        );
        Swal.fire({
          text: "წარმატებით დაემატა შეფასება",
          icon: "success",
        });
      });
    }
    // if (response.ok) {
    // }

    // console.log(reviewCover);
    // console.log(stars);
  } catch (error) {
    console.error(`erorr is ${error}`);
  }
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

function sliceName(input) {
  let slicedName = input.slice(0, 25);
  return slicedName;
}

function imageSeperator(name, brand) {
  return `../assets/productIMG/${name}/${brand}.png`;
}

function addProductClickHandlers(container, selector = ".carousel-item") {
  const carouselItems = container.querySelectorAll(selector);
  console.log(carouselItems);

  carouselItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart-btn")) {
        return;
      }

      const productId = item.id;
      if (productId) {
        console.log("Navigating to product:", productId);
        changeContentPage(productId);
      }
    });
  });
}

async function changeContentPage(id) {
  let productURL = `product.html?id=${id}`;
  window.location.href = productURL;
}

async function addToCart(productid) {
  let response = await fetch(
    ` https://api.everrest.educata.dev/shop/products/id/${productid}`,
  );
  let data = await response.json();

  const existingProduct = cart.find((item) => item.id === data._id);
  console.log(existingProduct);

  if (existingProduct) {
    Swal.fire({
      title: "პროდუქტი უკვე კალათაშია",
      icon: "warning",
    });
    return;
  } else {
    let cartNew = {
      id: data._id,
      title: data.title,
      price: data.price.current,
      currency: data.price.currency,
      image: `../assets/productIMG/${data.category.name}/${data.brand}.png`,
      quantiti: 1,
      stock: data.stock,
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

    cart.push(cartNew);
    updateCart(cart);
    saveCart(cartNew);
  }

  console.log(cart);
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

    if (response.ok) {
    }
  } catch (error) {
    console.error("Error saving to cart:", error);
    alert("შეცდომა პროდუქტის დამატებისას");
  }
}

// localStorage.clear();
