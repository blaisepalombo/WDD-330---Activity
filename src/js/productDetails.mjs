import { findProductById } from './productData.mjs';
import { getLocalStorage, setLocalStorage } from './utils.mjs';

let product = {};

function renderProductDetails() {
  document.querySelector('#productName').textContent = product.Brand.Name;
  document.querySelector('#productNameWithoutBrand').textContent =
    product.NameWithoutBrand;
  document.querySelector('#productImage').src = product.Images.PrimaryLarge;
  document.querySelector('#productImage').alt = product.Name;
  document.querySelector('#productFinalPrice').textContent =
    `$${product.FinalPrice}`;
  document.querySelector('#productColorName').textContent =
    product.Colors[0].ColorName;
  document.querySelector('#productDescriptionHtmlSimple').innerHTML =
    product.DescriptionHtmlSimple;
  document.querySelector('#addToCart').dataset.id = product.Id;
}

function addProductToCart(productToAdd) {
  const cartItems = getLocalStorage('so-cart') || [];
  cartItems.push(productToAdd);
  setLocalStorage('so-cart', cartItems);
}

function addToCart() {
  addProductToCart(product);
}

export default async function productDetails(productId) {
  product = await findProductById(productId);
  renderProductDetails();
  document.querySelector('#addToCart').addEventListener('click', addToCart);
}