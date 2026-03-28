import externalServices from "./externalServices.mjs";

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
    percentOff
  };
}

function productCardTemplate(product) {
  const discount = getDiscount(product);

  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img
        src="${fixImageUrl(product.Images.PrimaryMedium)}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      ${
        discount
          ? `<p class="discount-tag">Save $${discount.amountOff} (${discount.percentOff}% off)</p>`
          : ""
      }
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