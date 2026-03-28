import checkoutProcess from "./checkoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

checkoutProcess.init("so-cart", "#order-summary");

const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkoutProcess.calculateAndDisplayOrderTotals();
  });
}

const form = document.querySelector("#checkout-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const result = await checkoutProcess.checkout(form);

    if (result?.message === "Order Placed") {
      alert("Order placed successfully!");
      window.location.href = "../cart/";
    }
  });
}