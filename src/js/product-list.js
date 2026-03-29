import externalServices from "./externalServices.mjs";
import {
  getParam,
  loadHeaderFooter,
  updateCartCount
} from "./utils.mjs";
import {
  initQuickView,
  renderProductList
} from "./productList.mjs";

function formatCategory(category) {
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function updateBreadcrumb(text) {
  const el = document.querySelector("#breadcrumb");
  if (!el) return;
  el.textContent = text;
}

function sortProducts(products, sortValue) {
  const sortedProducts = [...products];

  switch (sortValue) {
    case "name-asc":
      sortedProducts.sort((a, b) =>
        a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
      );
      break;

    case "name-desc":
      sortedProducts.sort((a, b) =>
        b.NameWithoutBrand.localeCompare(a.NameWithoutBrand)
      );
      break;

    case "price-asc":
      sortedProducts.sort(
        (a, b) => Number(a.FinalPrice) - Number(b.FinalPrice)
      );
      break;

    case "price-desc":
      sortedProducts.sort(
        (a, b) => Number(b.FinalPrice) - Number(a.FinalPrice)
      );
      break;

    default:
      break;
  }

  return sortedProducts;
}

async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const category = getParam("category") || "tents";
  const searchQuery = getParam("q")?.trim() || "";
  const sortSelect = document.querySelector("#sortProducts");
  const title = document.querySelector(".page-title");

  let products = [];
  let quickViewCategory = category;

  if (searchQuery) {
    products = await externalServices.searchProducts(searchQuery);
    quickViewCategory = "search";

    if (title) {
      title.textContent = `Search Results: "${searchQuery}"`;
    }

    updateBreadcrumb(
      `Search -> "${searchQuery}" (${products.length} ${
        products.length === 1 ? "item" : "items"
      })`
    );
  } else {
    products = await externalServices.getProductsByCategory(category);

    if (title) {
      title.textContent = `Top Products: ${formatCategory(category)}`;
    }

    updateBreadcrumb(
      `${formatCategory(category)} -> (${products.length} ${
        products.length === 1 ? "item" : "items"
      })`
    );
  }

  renderProductList(".product-list", products, category);
  initQuickView(".product-list", quickViewCategory);

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sortedProducts = sortProducts(products, sortSelect.value);
      renderProductList(".product-list", sortedProducts, category);
    });
  }
}

init();