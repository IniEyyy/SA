const AUTH_URL    = 'http://localhost:3001';
const PRODUCT_URL = 'http://localhost:3002';
const TXN_URL     = 'http://localhost:3003';

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23ede4d3'/%3E%3Ccircle cx='60' cy='62' r='26' fill='none' stroke='%23b08968' stroke-width='6'/%3E%3Crect x='84' y='52' width='14' height='18' rx='7' fill='none' stroke='%23b08968' stroke-width='6'/%3E%3C/svg%3E";

function saveToken(token) {
  localStorage.setItem('jk_token', token);
}

function getToken() {
  return localStorage.getItem('jk_token');
}

function saveUser(user) {
  localStorage.setItem('jk_user', JSON.stringify(user));
}

function getUser() {
  const raw = localStorage.getItem('jk_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function logout() {
  localStorage.removeItem('jk_token');
  localStorage.removeItem('jk_user');
  window.location.href = 'login.html';
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}

function requireAdmin() {
  requireAuth();
  const user = getUser();
  if (!user || user.role !== 'ADMIN') {
    window.location.href = 'menu.html';
  }
}

function productImage(url, alt, className) {
  const src = url ? url : PLACEHOLDER_IMG;
  const safeAlt = alt || 'product';
  return `<img class="${className}" src="${src}" alt="${safeAlt}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'" />`;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function apiGet(baseUrl, path) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = Array.isArray(err.message) ? err.message.join(', ') : err.message;
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function apiPost(baseUrl, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = Array.isArray(err.message) ? err.message.join(', ') : err.message;
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

function showAlert(container, message, type = 'error') {
  const el = document.getElementById(container);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = message;
  el.style.display = 'block';
}

function hideAlert(container) {
  const el = document.getElementById(container);
  if (el) el.style.display = 'none';
}

function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`;
}
