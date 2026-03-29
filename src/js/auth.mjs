import { jwtDecode } from "jwt-decode";
import { loginRequest, createUserRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

const tokenKey = "so-token";
const userKey = "so-user";

function getMessage(err, fallback) {
  return (
    err?.message?.message ||
    err?.message?.error ||
    err?.message ||
    fallback
  );
}

function decodeTokenSafely(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function getTokenFromResponse(response) {
  if (typeof response === "string") {
    return response;
  }

  return (
    response?.accessToken ||
    response?.token ||
    response?.jwt ||
    response?.Result?.accessToken ||
    response?.Result?.token ||
    null
  );
}

function saveUserProfile(profile = {}) {
  const existingProfile = getLocalStorage(userKey) || {};

  const nextProfile = {
    name: profile.name || existingProfile.name || "",
    email: profile.email || existingProfile.email || ""
  };

  setLocalStorage(userKey, nextProfile);
}

export async function login(creds, redirect = "/index.html") {
  try {
    const response = await loginRequest(creds);
    const token = getTokenFromResponse(response);

    if (!token) {
      throw new Error("No token returned from login.");
    }

    const decoded = decodeTokenSafely(token);

    setLocalStorage(tokenKey, token);
    saveUserProfile({
      name:
        decoded?.name ||
        decoded?.userName ||
        decoded?.username ||
        decoded?.fullName ||
        "",
      email: decoded?.email || creds.email || ""
    });

    window.location = redirect;
  } catch (err) {
    alertMessage(getMessage(err, "Login failed. Please try again."));
  }
}

export async function register(user, redirect = "/login/index.html") {
  try {
    const response = await createUserRequest(user);

    saveUserProfile({
      name: user.name || "",
      email: user.email || ""
    });

    const successMessage =
      response?.message ||
      response?.Result?.message ||
      "Account created successfully. Please log in.";

    sessionStorage.setItem("signup-success", successMessage);
    window.location = redirect;
  } catch (err) {
    alertMessage(getMessage(err, "Signup failed. Please try again."));
  }
}

export function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    if (!decoded?.exp) {
      return true;
    }

    const currentDate = new Date();
    return decoded.exp * 1000 >= currentDate.getTime();
  } catch {
    return true;
  }
}

export function checkLogin() {
  const token = getLocalStorage(tokenKey);
  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    const location = window.location;
    window.location = `/login/index.html?redirect=${location.pathname}`;
    return null;
  }

  return token;
}