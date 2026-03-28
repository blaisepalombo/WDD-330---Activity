import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

function formatCategory(category) {
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function updateBreadcrumb(category) {
  const el = document.querySelector("#breadcrumb");
  if (!el) return;

  el.textContent = formatCategory(category);
}

async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const productId = getParam("product");
  const category = getParam("category") || "tents";

  updateBreadcrumb(category);
  productDetails(productId);
}

init();