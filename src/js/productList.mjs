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
  const productCategory = product._category || category;

  return `
    <li class="product-card">
      <a
        class="product-card__link"
        href="../product_pages/index.html?product=${product.Id}&category=${productCategory}"
      >
        <img
          src="${fixImageUrl(product.Images?.PrimaryLarge || product.Image)}"
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
          data-category="${productCategory}"
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

  if (!products.length) {
    element.innerHTML = `
      <li class="product-error-card">
        <img
          class="product-error-card__image"
          src="/images/noun_Tent_2517.svg"
          alt="No products found"
        />
        <h2>No products found</h2>
        <p>Try a different search term or browse one of the categories.</p>
      </li>
    `;
    return;
  }

  const htmlStrings = products.map((product) =>
    productCardTemplate(product, category)
  );
  element.innerHTML = htmlStrings.join("");
}

function setupQuickView(listElement, category) {
  const modal = document.querySelector("#quickViewModal");
  const modalContent = document.querySelector("#quickViewContent");
  const closeButton = document.querySelector("#quickViewClose");

  if (!modal || !modalContent || !closeButton || !listElement) return;

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modalContent.innerHTML = "";
  }

  async function openModal(productId, productCategory) {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modalContent.innerHTML = `<p class="quick-view-loading">Loading...</p>`;

    const product = await externalServices.findProductById(productId);
    const detailCategory = productCategory || category;

    modalContent.innerHTML = `
      <div class="quick-view-product">
        <div class="quick-view-product__image">
          <img
            src="${fixImageUrl(product.Images?.PrimaryLarge || product.Image)}"
            alt="${product.Name}"
          />
        </div>

        <div class="quick-view-product__details">
          <p class="quick-view-product__brand">${product.Brand.Name}</p>
          <h2 class="quick-view-product__name">${product.NameWithoutBrand}</h2>
          <p class="quick-view-product__price">$${product.FinalPrice}</p>
          <p class="quick-view-product__color">
            ${
              product.Colors?.[0]?.ColorName
                ? `Color: ${product.Colors[0].ColorName}`
                : ""
            }
          </p>
          <div class="quick-view-product__description">
            ${product.DescriptionHtmlSimple || ""}
          </div>

          <a
            class="button-link quick-view-product__link"
            href="../product_pages/index.html?product=${product.Id}&category=${detailCategory}"
          >
            View Full Details
          </a>
        </div>
      </div>
    `;
  }

  listElement.addEventListener("click", async (event) => {
    const btn = event.target.closest(".quick-view-button");
    if (!btn) return;

    await openModal(btn.dataset.productId, btn.dataset.category);
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

export default async function productList(selector, category) {
  const element = document.querySelector(selector);
  const products = await externalServices.getProductsByCategory(category);

  renderProductList(selector, products, category);
  setupQuickView(element, category);

  return products;
}

export function initQuickView(selector, category) {
  const element = document.querySelector(selector);
  setupQuickView(element, category);
}