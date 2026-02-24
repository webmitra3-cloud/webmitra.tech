const ACCESS_TOKEN_KEY = "wm_access_token";
const CSRF_TOKEN_KEY = "wm_csrf_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getCsrfToken() {
  return localStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token: string) {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function clearCsrfToken() {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

export function clearSession() {
  clearAccessToken();
  clearCsrfToken();
}
