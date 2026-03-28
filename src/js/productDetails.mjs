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

function getDiscount(productToCheck) {
  const original = Number(
    productToCheck.SuggestedRetailPrice || productToCheck.ListPrice
  );
  const sale = Number(productToCheck.FinalPrice);

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

  const existingIndex = cartItems.findIndex(
    (item) => item.Id === productToAdd.Id
  );

  if (existingIndex !== -1) {
    const currentQty = Number(cartItems[existingIndex].quantity) || 1;
    cartItems[existingIndex].quantity = currentQty + 1;
  } else {
    const newItem = { ...productToAdd, quantity: 1 };
    cartItems.push(newItem);
  }

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

  const img = document.querySelector("#productImage");
  img.src = fixImageUrl(
    product.Images.PrimaryExtraLarge || product.Images.PrimaryLarge
  );
  img.alt = product.Name;

  document.querySelector("#productFinalPrice").textContent =
    `$${Number(product.FinalPrice).toFixed(2)}`;

  document.querySelector("#productColorName").textContent =
    product.Colors?.[0]?.ColorName || "";

  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;

  const discountElement = document.querySelector("#productDiscount");
  if (discountElement) {
    const discount = getDiscount(product);

    if (discount) {
      discountElement.className = "discount-tag discount-tag-detail";
      discountElement.textContent =
        `Save $${discount.amountOff} (${discount.percentOff}% off) • Was $${discount.original}`;
      discountElement.style.display = "inline-block";
    } else {
      discountElement.textContent = "";
      discountElement.className = "";
      discountElement.style.display = "none";
    }
  }

  const addButton = document.querySelector("#addToCart");
  addButton.addEventListener("click", addToCart);
}

export default async function productDetails(productId) {
  product = await externalServices.findProductById(productId);
  renderProductDetails();
}