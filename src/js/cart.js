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

function changeQuantity(productId, amount) {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === productId);

  if (itemIndex === -1) return;

  const currentQty = Number(cartItems[itemIndex].quantity || 1);
  const newQty = currentQty + amount;

  if (newQty <= 0) {
    cartItems.splice(itemIndex, 1);
  } else {
    cartItems[itemIndex].quantity = newQty;
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

function addCartActionListeners() {
  const removeButtons = document.querySelectorAll(".remove-item");
  const decreaseButtons = document.querySelectorAll(".quantity-decrease");
  const increaseButtons = document.querySelectorAll(".quantity-increase");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      removeFromCart(productId);
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      changeQuantity(productId, -1);
    });
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      changeQuantity(productId, 1);
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

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * Number(item.quantity || 1),
    0
  );

  totalElement.textContent = total.toFixed(2);
  cartFooter.classList.remove("hide");
}

function cartItemTemplate(item) {
  const qty = Number(item.quantity || 1);
  const itemPrice = Number(item.FinalPrice).toFixed(2);
  const lineTotal = (Number(item.FinalPrice) * qty).toFixed(2);

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

      <div class="cart-card__quantity">
        <button
          class="quantity-button quantity-decrease"
          data-id="${item.Id}"
          aria-label="Decrease quantity of ${item.Name}"
          type="button"
        >
          −
        </button>
        <span class="quantity-value">qty: ${qty}</span>
        <button
          class="quantity-button quantity-increase"
          data-id="${item.Id}"
          aria-label="Increase quantity of ${item.Name}"
          type="button"
        >
          +
        </button>
      </div>

      <p class="cart-card__price">
        $${itemPrice} each<br />
        <strong>Total: $${lineTotal}</strong>
      </p>
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
  addCartActionListeners();
}

async function init() {
  await loadHeaderFooter();
  updateCartCount();
  renderCartContents();
}

init();