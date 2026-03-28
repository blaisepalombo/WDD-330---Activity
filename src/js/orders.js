import { loadHeaderFooter } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import { getOrders } from "./externalServices.mjs";
import { renderOrderList } from "./currentOrders.mjs";

loadHeaderFooter();

const token = checkLogin();

if (token) {
  init();
}

async function init() {
  const orders = await getOrders(token);
  renderOrderList(".orders-list", orders);
}