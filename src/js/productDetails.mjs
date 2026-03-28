import externalServices from "./externalServices.mjs";
import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  animateCartIcon
} from "./utils.mjs";

let product = {};

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function getDiscount(product) {
  const original = Number(product.SuggestedRetailPrice);
  const sale = Number(product.FinalPrice);

  if (!original || sale >= original) {
    return null;
  }

  const amountOff = original - sale;
  const percentOff = Math.round((amountOff / original) * 100);

  return {
    amountOff: amountOff.toFixed(2),
    percentOff,
    original: original.toFixed(2)
  };
}

function addProductToCart(productToAdd) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(productToAdd);
  setLocalStorage("so-cart", cartItems);
}

function addToCart() {
  addProductToCart(product);
  updateCartCount();
  animateCartIcon();
}

function renderProductDetails() {
  document.querySelector("#productName").textContent = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").textContent =
    product.NameWithoutBrand;
  document.querySelector("#productImage").src = fixImageUrl(product.Images.PrimaryLarge);
  document.querySelector("#productImage").alt = product.Name;
  document.querySelector("#productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.querySelector("#productColorName").textContent =
    product.Colors?.[0]?.ColorName || "";
  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;

  const discount = getDiscount(product);
  let discountElement = document.querySelector("#productDiscount");

  if (!discountElement) {
    discountElement = document.createElement("p");
    discountElement.id = "productDiscount";
    discountElement.classList.add("discount-tag", "discount-tag-detail");

    const priceElement = document.querySelector("#productFinalPrice");
    priceElement.insertAdjacentElement("afterend", discountElement);
  }

  if (discount) {
    discountElement.textContent = `Save $${discount.amountOff} (${discount.percentOff}% off) • Was $${discount.original}`;
    discountElement.style.display = "inline-block";
  } else {
    discountElement.style.display = "none";
  }

  const addButton = document.querySelector("#addToCart");
  addButton.dataset.id = product.Id;
  addButton.style.display = "block";
}

function renderProductNotFound() {
  const detail = document.querySelector(".product-detail");
  if (!detail) return;

  detail.innerHTML = `
    <div class="product-error-card">
      <h2>Sorry, we couldn't find that product.</h2>
      <p>
        The link may be wrong, outdated, or the product may no longer be available.
      </p>
      <a class="button-link" href="/index.html">Back to shopping</a>
    </div>
  `;
}

export default async function productDetails(productId) {
  try {
    product = await externalServices.findProductById(productId);

    if (!product || !product.Id) {
      renderProductNotFound();
      return;
    }

    renderProductDetails();

    const addButton = document.querySelector("#addToCart");
    if (addButton) {
      addButton.addEventListener("click", addToCart);
    }
  } catch (err) {
    renderProductNotFound();
  }
}