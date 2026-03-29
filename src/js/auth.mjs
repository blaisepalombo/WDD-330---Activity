import { jwtDecode } from "jwt-decode";
import { loginRequest, createUserRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

const tokenKey = "so-token";

function getMessage(err, fallback) {
  return (
    err?.message?.message ||
    err?.message?.error ||
    err?.message ||
    fallback
  );
}

export async function login(creds, redirect = "/") {
  try {
    const response = await loginRequest(creds);
    const token =
      typeof response === "string"
        ? response
        : response.accessToken || response.token;

    if (!token) {
      throw new Error("No token returned from login.");
    }

    setLocalStorage(tokenKey, token);
    window.location = redirect;
  } catch (err) {
    alertMessage(getMessage(err, "Login failed. Please try again."));
  }
}

export async function register(user, redirect = "/login/index.html") {
  try {
    await createUserRequest(user);
    window.location = redirect;
  } catch (err) {
    alertMessage(getMessage(err, "Signup failed. Please try again."));
  }
}

export function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentDate = new Date();
    return decoded.exp * 1000 >= currentDate.getTime();
  } catch {
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