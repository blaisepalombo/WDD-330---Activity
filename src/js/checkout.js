import checkoutProcess from "./checkoutProcess.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  updateCartCount();

  checkoutProcess.init("so-cart", "#order-summary");

  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("input", () => {
      checkoutProcess.calculateAndDisplayOrderTotals();
    });

    zipInput.addEventListener("blur", () => {
      checkoutProcess.calculateAndDisplayOrderTotals();
    });
  }

  const form = document.querySelector("#checkout-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const isValid = form.checkValidity();
      form.reportValidity();

      if (isValid) {
        await checkoutProcess.checkout(form);
      }
    });
  }
}

init();