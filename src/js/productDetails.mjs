import externalServices from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

let product = {};

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function renderProductDetails() {
  document.querySelector("#productName").textContent = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").textContent =
    product.NameWithoutBrand;
  document.querySelector("#productImage").src = fixImageUrl(product.Images.PrimaryLarge);
  document.querySelector("#productImage").alt = product.Name;
  document.querySelector("#productFinalPrice").textContent =
    `$${product.FinalPrice}`;
  document.querySelector("#productColorName").textContent =
    product.Colors[0].ColorName;
  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;
  document.querySelector("#addToCart").dataset.id = product.Id;
}

function addProductToCart(productToAdd) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(productToAdd);
  setLocalStorage("so-cart", cartItems);
}

function addToCart() {
  addProductToCart(product);
  alertMessage(`${product.Name} was added to your cart.`, false);
}

export default async function productDetails(productId) {
  product = await externalServices.findProductById(productId);
  renderProductDetails();
  document.querySelector("#addToCart").addEventListener("click", addToCart);
}