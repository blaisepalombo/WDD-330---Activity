import productList from "./productList.mjs";
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

async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const category = getParam("category") || "tents";

  const products = await productList(".product-list", category);

  const title = document.querySelector(".page-title");
  if (title) {
    title.textContent = `Top Products: ${formatCategory(category)}`;
  }

  updateBreadcrumb(category, products.length);
}

init();