import externalServices from "./externalServices.mjs";

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img
        src="${fixImageUrl(product.Images.PrimaryMedium)}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

function renderList(products, element) {
  const htmlStrings = products.map(productCardTemplate);
  element.innerHTML = htmlStrings.join("");
}

export default async function productList(selector, category) {
  const element = document.querySelector(selector);
  const products = await externalServices.getProductsByCategory(category);
  renderList(products, element);
}