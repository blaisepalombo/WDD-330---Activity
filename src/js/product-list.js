import productList from "./productList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const category = getParam("category") || "tents";
  productList(".product-list", category);

  const titleElement = document.querySelector(".page-title");
  if (titleElement) {
    const formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    titleElement.textContent = `Top Products: ${formattedCategory}`;
  }
}

init();