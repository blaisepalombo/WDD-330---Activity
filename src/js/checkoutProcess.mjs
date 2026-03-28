import externalServices from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function calculateItemSubtotal(items) {
  return items.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
}

function calculateShipping(items) {
  if (!items.length) return 0;
  return 10 + (items.length - 1) * 2;
}

function calculateTax(subtotal) {
  return subtotal * 0.06;
}

function packageItems(items) {
  const packagedItems = [];

  items.forEach((item) => {
    const existingItem = packagedItems.find(
      (packagedItem) => packagedItem.id === item.Id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      packagedItems.push({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1
      });
    }
  });

  return packagedItems;
}

const checkoutProcess = {
  key: "",
  outputSelector: "",
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,

  init(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.items = getLocalStorage(this.key) || [];
    this.calculateAndDisplaySubtotal();
  },

  calculateAndDisplaySubtotal() {
    this.subtotal = calculateItemSubtotal(this.items);
    document.querySelector(`${this.outputSelector} #item-subtotal`).textContent =
      this.subtotal.toFixed(2);
  },

  calculateAndDisplayOrderTotals() {
    this.shipping = calculateShipping(this.items);
    this.tax = calculateTax(this.subtotal);
    this.orderTotal = this.subtotal + this.shipping + this.tax;

    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      this.shipping.toFixed(2);
    document.querySelector(`${this.outputSelector} #tax`).textContent =
      this.tax.toFixed(2);
    document.querySelector(`${this.outputSelector} #order-total`).textContent =
      this.orderTotal.toFixed(2);
  },

  clearOrder() {
    this.items = [];
    this.subtotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;

    setLocalStorage(this.key, []);

    document.querySelector(`${this.outputSelector} #item-subtotal`).textContent = "0.00";
    document.querySelector(`${this.outputSelector} #shipping`).textContent = "0.00";
    document.querySelector(`${this.outputSelector} #tax`).textContent = "0.00";
    document.querySelector(`${this.outputSelector} #order-total`).textContent = "0.00";
  },

  async checkout(form) {
    const formData = new FormData(form);

    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: formData.get("cardNumber"),
      expiration: formData.get("expiration"),
      code: formData.get("code"),
      items: packageItems(this.items),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };

    const result = await externalServices.checkout(orderData);
    console.log(result);

    this.clearOrder();
    form.reset();

    return result;
  }
};

export default checkoutProcess;