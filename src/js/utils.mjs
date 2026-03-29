export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data = {},
  callback,
  position = "afterbegin",
  clear = true
) {
  const template = await templateFn(data);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, template);

  if (callback) {
    callback(data);
  }
}

export function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
    throw new Error(`Template not found: ${path}`);
  };
}

function setupHeaderSearch() {
  const searchInput = document.querySelector("#siteSearch");
  if (!searchInput) return;

  const currentSearch = getParam("q");
  if (currentSearch) {
    searchInput.value = currentSearch;
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = loadTemplate("/partials/header.html");
  const footerTemplate = loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    await renderWithTemplate(headerTemplate, headerElement);
    setupHeaderSearch();
  }

  if (footerElement) {
    await renderWithTemplate(footerTemplate, footerElement);
  }
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");
  if (!main) return;

  const existingAlert = main.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `
    <p>${message}</p>
    <span class="alert-close" aria-label="Close alert">X</span>
  `;

  alert.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("alert-close") ||
      e.target.tagName === "SPAN"
    ) {
      this.remove();
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const count = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const cartLink = document.querySelector(".cart");
  if (!cartLink) return;

  let badge = cartLink.querySelector(".cart-count");

  if (!badge) {
    badge = document.createElement("span");
    badge.classList.add("cart-count");
    cartLink.appendChild(badge);
  }

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

export function animateCartIcon() {
  const cartLink = document.querySelector(".cart");
  if (!cartLink) return;

  cartLink.classList.remove("cart-animate");

  void cartLink.offsetWidth;

  cartLink.classList.add("cart-animate");

  cartLink.addEventListener(
    "animationend",
    () => {
      cartLink.classList.remove("cart-animate");
    },
    { once: true }
  );
}