import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import { getOrders } from "./externalServices.mjs";
import { renderOrderList } from "./currentOrders.mjs";

loadHeaderFooter();

const token = checkLogin();

if (token) {
  init();
}

async function init() {
  try {
    const response = await getOrders(token);
    const orders = Array.isArray(response) ? response : response.Result || response.orders || [];
    renderOrderList(".orders-list", orders);
  } catch (err) {
    alertMessage("Could not load orders. Try logging in again.");
    console.error(err);
  }
}