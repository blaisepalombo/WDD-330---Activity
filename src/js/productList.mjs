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

function renderList(products, element, category) {
  const htmlStrings = products.map((product) =>
    productCardTemplate(product, category)
  );
  element.innerHTML = htmlStrings.join("");
}

function quickViewTemplate(product, category) {
  const discount = getDiscount(product);
  const colorName = product.Colors?.[0]?.ColorName || "Color not listed";

  return `
    <div class="quick-view-product">
      <div class="quick-view-product__image">
        <img
          src="${fixImageUrl(
            product.Images.PrimaryLarge || product.Images.PrimaryMedium
          )}"
          alt="${product.Name}"
        />
      </div>

      <div class="quick-view-product__details">
        <p class="quick-view-product__brand">${product.Brand.Name}</p>
        <h2 class="quick-view-product__name" id="quickViewTitle">
          ${product.NameWithoutBrand}
        </h2>

        ${
          discount
            ? `<p class="discount-tag discount-tag-detail">Save $${discount.amountOff} (${discount.percentOff}% off)</p>`
            : ""
        }

        <p class="product-card__price quick-view-product__price">$${product.FinalPrice}</p>
        <p class="quick-view-product__color">${colorName}</p>
        <div class="quick-view-product__description">
          ${product.DescriptionHtmlSimple || ""}
        </div>

        <a
          class="button-link quick-view-product__link"
          href="../product_pages/index.html?product=${product.Id}&category=${category}"
        >
          View Full Details
        </a>
      </div>
    </div>
  `;
}

function setupQuickView(listElement, category) {
  const modal = document.querySelector("#quickViewModal");
  const modalContent = document.querySelector("#quickViewContent");
  const closeButton = document.querySelector("#quickViewClose");

  if (!modal || !modalContent || !closeButton) return;

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalContent.innerHTML = "";
  }

  async function openModal(productId) {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalContent.innerHTML =
      `<p class="quick-view-loading">Loading product details...</p>`;

    try {
      const product = await externalServices.findProductById(productId);
      modalContent.innerHTML = quickViewTemplate(product, category);
    } catch (error) {
      modalContent.innerHTML = `
        <div class="product-error-card">
          <h2 id="quickViewTitle">Unable to load product details.</h2>
          <p>Please try again.</p>
        </div>
      `;
    }
  }

  listElement.addEventListener("click", async (event) => {
    const quickViewButton = event.target.closest(".quick-view-button");
    if (!quickViewButton) return;

    event.preventDefault();
    await openModal(quickViewButton.dataset.productId);
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

export default async function productList(selector, category) {
  const element = document.querySelector(selector);
  const products = await externalServices.getProductsByCategory(category);
  renderList(products, element, category);
  setupQuickView(element, category);
  return products;
}