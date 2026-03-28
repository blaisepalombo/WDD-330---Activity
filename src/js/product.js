import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const productId = getParam("product");
  productDetails(productId);
}

init();