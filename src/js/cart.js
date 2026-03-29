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

function findCartItemIndex(cartItems, productId, colorCode = "") {
  return cartItems.findIndex(
    (item) =>
      String(item.Id) === String(productId) &&
      String(item.selectedColorCode || "") === String(colorCode || "")
  );
}

function removeFromCart(productId, colorCode = "") {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = findCartItemIndex(cartItems, productId, colorCode);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
  }

  renderCartContents();
  updateCartCount();
}

function changeQuantity(productId, colorCode = "", amount) {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = findCartItemIndex(cartItems, productId, colorCode);

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
      const colorCode = button.dataset.colorCode || "";
      removeFromCart(productId, colorCode);
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      const colorCode = button.dataset.colorCode || "";
      changeQuantity(productId, colorCode, -1);
    });
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      const colorCode = button.dataset.colorCode || "";
      changeQuantity(productId, colorCode, 1);
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
  const colorName = item.selectedColorName || item.Colors?.[0]?.ColorName || "";
  const colorCode = item.selectedColorCode || "";

  return `
    <li class="cart-card divider">
      <button
        class="remove-item"
        data-id="${item.Id}"
        data-color-code="${colorCode}"
        aria-label="Remove ${item.Name}"
      >
        ×
      </button>

      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${getItemImage(item)}" alt="${item.Name}" />
      </a>

      <a href="../product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${colorName ? `Color: ${colorName}` : ""}</p>

      <div class="cart-card__quantity">
        <button
          class="quantity-button quantity-decrease"
          data-id="${item.Id}"
          data-color-code="${colorCode}"
          aria-label="Decrease quantity of ${item.Name}"
          type="button"
        >
          −
        </button>
        <span class="quantity-value">qty: ${qty}</span>
        <button
          class="quantity-button quantity-increase"
          data-id="${item.Id}"
          data-color-code="${colorCode}"
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