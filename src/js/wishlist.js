import { loadHeaderFooter, updateCartCount, animateCartIcon } from "./utils.mjs";
import {
  getWishlist,
  removeFromWishlist,
  moveWishlistItemToCart
} from "./wishlist.mjs";

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function getProductLink(item) {
  const category = item._category || item.category || "tents";
  return `/product_pages/index.html?product=${item.Id}&category=${category}`;
}

function wishlistCardTemplate(item) {
  const category = item._category || item.category || "tents";

  return `
    <li class="product-card wishlist-card">
      <a
        class="product-card__link"
        href="${getProductLink(item)}"
      >
        <img
          src="${fixImageUrl(item.Images?.PrimaryLarge || item.Images?.PrimaryMedium || item.Image)}"
          alt="${item.Name}"
        />
        <h3 class="card__brand">${item.Brand?.Name || ""}</h3>
        <h2 class="card__name">${item.NameWithoutBrand || item.Name}</h2>
        <p class="wishlist-card__category">${category.replace("-", " ")}</p>
        <p class="product-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>
      </a>

      <div class="wishlist-card__actions">
        <button
          type="button"
          class="wishlist-move-button"
          data-id="${item.Id}"
        >
          Move to Cart
        </button>

        <button
          type="button"
          class="wishlist-remove-button"
          data-id="${item.Id}"
        >
          Remove
        </button>
      </div>
    </li>
  `;
}

function attachWishlistEvents() {
  document.querySelectorAll(".wishlist-move-button").forEach((button) => {
    button.addEventListener("click", () => {
      moveWishlistItemToCart(button.dataset.id);
      updateCartCount();
      animateCartIcon();
      renderWishlist();
    });
  });

  document.querySelectorAll(".wishlist-remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromWishlist(button.dataset.id);
      renderWishlist();
    });
  });
}

function renderWishlist() {
  const list = document.querySelector("#wishlistList");
  const empty = document.querySelector("#wishlistEmpty");

  if (!list || !empty) return;

  const items = getWishlist();

  if (!items.length) {
    list.innerHTML = "";
    empty.classList.remove("hide");
    return;
  }

  empty.classList.add("hide");
  list.innerHTML = items.map(wishlistCardTemplate).join("");
  attachWishlistEvents();
}

async function init() {
  await loadHeaderFooter();
  updateCartCount();
  renderWishlist();
}

init();