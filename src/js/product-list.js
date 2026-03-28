import productList, { renderProductList } from "./productList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

function formatCategory(category) {
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function updateBreadcrumb(category, count) {
  const el = document.querySelector("#breadcrumb");
  if (!el) return;

  const label = count === 1 ? "item" : "items";
  el.textContent = `${formatCategory(category)} -> (${count} ${label})`;
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
      sortedProducts.sort((a, b) => Number(a.FinalPrice) - Number(b.FinalPrice));
      break;

    case "price-desc":
      sortedProducts.sort((a, b) => Number(b.FinalPrice) - Number(a.FinalPrice));
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
  const sortSelect = document.querySelector("#sortProducts");

  const products = await productList(".product-list", category);

  const title = document.querySelector(".page-title");
  if (title) {
    title.textContent = `Top Products: ${formatCategory(category)}`;
  }

  updateBreadcrumb(category, products.length);

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sortedProducts = sortProducts(products, sortSelect.value);
      renderProductList(".product-list", sortedProducts, category);
    });
  }
}

init();