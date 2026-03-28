import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
  updateCartCount
} from "./utils.mjs";

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function getItemImage(item) {
  if (item.Images?.PrimaryMedium) {
    return fixImageUrl(item.Images.PrimaryMedium);
  }

  if (item.Image) {
    return fixImageUrl(item.Image.replace("..", ""));
  }

  return "/images/tent.svg";
}

function removeFromCart(productId) {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === productId);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
  }

  renderCartContents();
  updateCartCount();
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      removeFromCart(productId);
    });
  });
}

function renderCartTotal(cartItems) {
  const totalElement = document.querySelector("#cart-total");
  const cartFooter = document.querySelector(".cart-footer");

  if (!totalElement || !cartFooter) return;

  if (!cartItems.length) {
    cartFooter.classList.add("hide");
    totalElement.textContent = "0.00";
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);

  totalElement.textContent = total.toFixed(2);
  cartFooter.classList.remove("hide");
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <button class="remove-item" data-id="${item.Id}" aria-label="Remove ${item.Name}">×</button>
      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${getItemImage(item)}" alt="${item.Name}" />
      </a>
      <a href="../product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (!productList) return;

  if (!cartItems.length) {
    productList.innerHTML = "<li class='empty-cart'>Your cart is empty.</li>";
    renderCartTotal(cartItems);
    return;
  }

  const htmlItems = cartItems.map(cartItemTemplate);
  productList.innerHTML = htmlItems.join("");

  renderCartTotal(cartItems);
  addRemoveListeners();
}

async function init() {
  await loadHeaderFooter();
  updateCartCount();
  renderCartContents();
}

init();