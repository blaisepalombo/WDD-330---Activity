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
    percentOff,
    original: original.toFixed(2)
  };
}

function productCardTemplate(product, category) {
  const discount = getDiscount(product);

  return `
    <li class="product-card">
      <a
        class="product-card__link"
        href="../product_pages/index.html?product=${product.Id}&category=${category}"
      >
        <img
          src="${fixImageUrl(product.Images.PrimaryLarge)}"
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

      <div class="product-card__actions">
        <button
          class="quick-view-button"
          type="button"
          data-product-id="${product.Id}"
        >
          Quick View
        </button>
      </div>
    </li>
  `;
}

export function renderProductList(selector, products, category) {
  const element = document.querySelector(selector);
  if (!element) return;

  const htmlStrings = products.map((product) =>
    productCardTemplate(product, category)
  );
  element.innerHTML = htmlStrings.join("");
}

function setupQuickView(listElement, category) {
  const modal = document.querySelector("#quickViewModal");
  const modalContent = document.querySelector("#quickViewContent");
  const closeButton = document.querySelector("#quickViewClose");

  if (!modal || !modalContent || !closeButton) return;

  function closeModal() {
    modal.hidden = true;
    modalContent.innerHTML = "";
  }

  async function openModal(productId) {
    modal.hidden = false;
    modalContent.innerHTML = "Loading...";

    const product = await externalServices.findProductById(productId);

    modalContent.innerHTML = `
      <h2>${product.NameWithoutBrand}</h2>
      <img src="${fixImageUrl(product.Images.PrimaryLarge)}" alt="${product.Name}" />
      <p>$${product.FinalPrice}</p>
      <p>${product.DescriptionHtmlSimple}</p>

      <a
        class="button-link"
        href="../product_pages/index.html?product=${product.Id}&category=${category}"
      >
        View Full Details
      </a>
    `;
  }

  listElement.addEventListener("click", async (event) => {
    const btn = event.target.closest(".quick-view-button");
    if (!btn) return;

    await openModal(btn.dataset.productId);
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
}

export default async function productList(selector, category) {
  const element = document.querySelector(selector);
  const products = await externalServices.getProductsByCategory(category);

  renderProductList(selector, products, category);
  setupQuickView(element, category);

  return products;
}