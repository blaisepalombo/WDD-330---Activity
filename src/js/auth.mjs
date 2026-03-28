import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

const tokenKey = "so-token";

export async function login(creds, redirect = "/") {
  try {
    const token = await loginRequest(creds);
    setLocalStorage(tokenKey, token);
    window.location = redirect;
  } catch (err) {
    const message =
      err?.message?.message ||
      err?.message?.error ||
      err?.message ||
      "Login failed. Please try again.";

    alertMessage(message);
  }
}

export function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentDate = new Date();

    if (decoded.exp * 1000 < currentDate.getTime()) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export function checkLogin() {
  const token = getLocalStorage(tokenKey);
  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.removeItem(tokenKey);
    const location = window.location;
    window.location = `/login/index.html?redirect=${location.pathname}`;
    return null;
  }

  return token;
}