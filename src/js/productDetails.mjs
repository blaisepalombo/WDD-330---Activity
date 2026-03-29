import externalServices from "./externalServices.mjs";
import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  animateCartIcon
} from "./utils.mjs";
import {
  isInWishlist,
  toggleWishlist
} from "./wishlist.mjs";

let product = {};
let currentCategory = "tents";

function fixImageUrl(url) {
  if (!url) return "";
  return url.replace("http://server-nodejs.cit.byui.edu:3000", "/api");
}

function getDiscount(productToCheck) {
  const original = Number(
    productToCheck.SuggestedRetailPrice || productToCheck.ListPrice
  );
  const sale = Number(productToCheck.FinalPrice);

  if (!original || sale >= original) {
    return null;
  }

  const amountOff = original - sale;
  const percentOff = Math.round((amountOff / original) * 100);

  return {
    amountOff: amountOff.toFixed(2),
    percentOff,
    original: original.toFixed(2)
  };
}

function buildStoredProduct(productToStore) {
  return {
    ...productToStore,
    _category: currentCategory
  };
}

function addProductToCart(productToAdd) {
  const cartItems = getLocalStorage("so-cart") || [];
  const storedProduct = buildStoredProduct(productToAdd);

  const existingIndex = cartItems.findIndex(
    (item) => item.Id === storedProduct.Id
  );

  if (existingIndex !== -1) {
    const currentQty = Number(cartItems[existingIndex].quantity) || 1;
    cartItems[existingIndex].quantity = currentQty + 1;
  } else {
    cartItems.push({
      ...storedProduct,
      quantity: 1
    });
  }

  setLocalStorage("so-cart", cartItems);
}

function updateWishlistButton() {
  const wishlistButton = document.querySelector("#addToWishlist");
  if (!wishlistButton) return;

  wishlistButton.textContent = isInWishlist(product.Id)
    ? "Remove from Wishlist"
    : "Add to Wishlist";
}

function addToCart() {
  addProductToCart(product);
  updateCartCount();
  animateCartIcon();
}

function handleWishlistToggle() {
  toggleWishlist(buildStoredProduct(product));
  updateWishlistButton();
}

function renderProductDetails() {
  document.querySelector("#productName").textContent = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").textContent =
    product.NameWithoutBrand;

  const img = document.querySelector("#productImage");
  img.src = fixImageUrl(
    product.Images.PrimaryExtraLarge || product.Images.PrimaryLarge
  );
  img.alt = product.Name;

  document.querySelector("#productFinalPrice").textContent =
    `$${Number(product.FinalPrice).toFixed(2)}`;

  document.querySelector("#productColorName").textContent =
    product.Colors?.[0]?.ColorName || "";

  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;

  const discountElement = document.querySelector("#productDiscount");
  if (discountElement) {
    const discount = getDiscount(product);

    if (discount) {
      discountElement.className = "discount-tag discount-tag-detail";
      discountElement.textContent =
        `Save $${discount.amountOff} (${discount.percentOff}% off) • Was $${discount.original}`;
      discountElement.style.display = "inline-block";
    } else {
      discountElement.textContent = "";
      discountElement.className = "";
      discountElement.style.display = "none";
    }
  }

  const addButton = document.querySelector("#addToCart");
  if (addButton) {
    addButton.addEventListener("click", addToCart);
  }

  const wishlistButton = document.querySelector("#addToWishlist");
  if (wishlistButton) {
    wishlistButton.addEventListener("click", handleWishlistToggle);
    updateWishlistButton();
  }
}

function shuffleArray(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function recommendationCardTemplate(item, category) {
  return `
    <li class="product-card recommendation-card">
      <a
        class="product-card__link"
        href="../product_pages/index.html?product=${item.Id}&category=${category}"
      >
        <img
          src="${fixImageUrl(item.Images?.PrimaryLarge || item.Image)}"
          alt="${item.Name}"
        />
        <h3 class="card__brand">${item.Brand?.Name || ""}</h3>
        <h2 class="card__name">${item.NameWithoutBrand || item.Name}</h2>
        <p class="product-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>
      </a>
    </li>
  `;
}

function renderRecommendations(products) {
  const section = document.querySelector("#recommendedProductsSection");
  const list = document.querySelector("#recommendedProductsList");

  if (!section || !list || !products.length) return;

  const html = products
    .map((item) => recommendationCardTemplate(item, item._category || "tents"))
    .join("");

  list.innerHTML = html;
  section.hidden = false;
}

async function loadRecommendations(productId) {
  try {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

    const results = await Promise.all(
      categories.map(async (categoryName) => {
        try {
          const products = await externalServices.getProductsByCategory(categoryName);
          return products.map((item) => ({
            ...item,
            _category: categoryName
          }));
        } catch (error) {
          console.error(`Could not load products for ${categoryName}`, error);
          return [];
        }
      })
    );

    const allProducts = results.flat();

    const filteredProducts = allProducts.filter(
      (item) => String(item.Id) !== String(productId)
    );

    if (!filteredProducts.length) return;

    const randomizedProducts = shuffleArray(filteredProducts);
    const recommendations = randomizedProducts.slice(0, 3);

    renderRecommendations(recommendations);
  } catch (error) {
    console.error("Could not load recommendations.", error);
  }
}

function getCommentsKey(productId) {
  return `so-comments-${productId}`;
}

function getComments(productId) {
  return getLocalStorage(getCommentsKey(productId)) || [];
}

function saveComments(productId, comments) {
  setLocalStorage(getCommentsKey(productId), comments);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function commentTemplate(comment) {
  return `
    <article class="comment-card">
      <div class="comment-card__header">
        <h3 class="comment-card__name">${escapeHtml(comment.name)}</h3>
        <p class="comment-card__date">${escapeHtml(comment.date)}</p>
      </div>
      <p class="comment-card__text">${escapeHtml(comment.text)}</p>
    </article>
  `;
}

function renderComments(productId) {
  const commentsList = document.querySelector("#commentsList");
  if (!commentsList) return;

  const comments = getComments(productId);

  if (!comments.length) {
    commentsList.innerHTML =
      `<p class="comments-empty">No comments yet. Be the first to add one.</p>`;
    return;
  }

  commentsList.innerHTML = comments
    .slice()
    .reverse()
    .map(commentTemplate)
    .join("");
}

function setupComments(productId) {
  const form = document.querySelector("#commentForm");
  if (!form) return;

  renderComments(productId);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.querySelector("#commentName");
    const textInput = document.querySelector("#commentText");

    const name = nameInput?.value.trim() || "";
    const text = textInput?.value.trim() || "";

    if (!name || !text) return;

    const comments = getComments(productId);

    comments.push({
      name,
      text,
      date: new Date().toLocaleDateString()
    });

    saveComments(productId, comments);
    form.reset();
    renderComments(productId);
  });
}

export default async function productDetails(productId, category = "tents") {
  currentCategory = category;
  product = await externalServices.findProductById(productId);
  renderProductDetails();
  await loadRecommendations(productId);
  setupComments(productId);
}