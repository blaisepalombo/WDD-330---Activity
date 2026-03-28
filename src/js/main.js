import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import loadAlerts from "./alert.js";

async function init() {
  await loadHeaderFooter();
  updateCartCount();
  loadAlerts();
}

init();