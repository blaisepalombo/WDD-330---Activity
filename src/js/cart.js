import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
}

function renderCartTotal(cartItems) {
  const totalElement = document.querySelector("#cart-total");
  if (!totalElement) return;

  const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
  totalElement.textContent = total.toFixed(2);
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

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${getItemImage(item)}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

loadHeaderFooter();
renderCartContents();