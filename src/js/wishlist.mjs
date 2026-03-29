import {
  getLocalStorage,
  setLocalStorage
} from "./utils.mjs";

function getCurrentWishlistKey() {
  const user = getLocalStorage("so-user");
  const userId =
    user?.email ||
    user?.name ||
    "guest";

  return `so-wishlist-${userId}`;
}

export function getWishlist() {
  return getLocalStorage(getCurrentWishlistKey()) || [];
}

function saveWishlist(items) {
  setLocalStorage(getCurrentWishlistKey(), items);
}

export function isInWishlist(productId) {
  const items = getWishlist();
  return items.some((item) => String(item.Id) === String(productId));
}

export function addToWishlist(item) {
  const items = getWishlist();

  if (items.some((existing) => String(existing.Id) === String(item.Id))) {
    return;
  }

  items.push(item);
  saveWishlist(items);
}

export function removeFromWishlist(productId) {
  const items = getWishlist().filter(
    (item) => String(item.Id) !== String(productId)
  );

  saveWishlist(items);
}

export function toggleWishlist(item) {
  if (isInWishlist(item.Id)) {
    removeFromWishlist(item.Id);
    return false;
  }

  addToWishlist(item);
  return true;
}

export function addItemToCart(item) {
  const cartItems = getLocalStorage("so-cart") || [];
  const existingIndex = cartItems.findIndex(
    (cartItem) => String(cartItem.Id) === String(item.Id)
  );

  if (existingIndex !== -1) {
    const currentQty = Number(cartItems[existingIndex].quantity || 1);
    cartItems[existingIndex].quantity = currentQty + 1;
  } else {
    cartItems.push({
      ...item,
      quantity: 1
    });
  }

  setLocalStorage("so-cart", cartItems);
}

export function moveWishlistItemToCart(productId) {
  const wishlistItems = getWishlist();
  const item = wishlistItems.find(
    (wishlistItem) => String(wishlistItem.Id) === String(productId)
  );

  if (!item) return;

  addItemToCart(item);
  removeFromWishlist(productId);
}