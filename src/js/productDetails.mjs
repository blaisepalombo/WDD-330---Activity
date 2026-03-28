import externalServices from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

let product = {};

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function addProductToCart(productToAdd) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(productToAdd);
  setLocalStorage("so-cart", cartItems);
}

function addToCart() {
  addProductToCart(product);
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