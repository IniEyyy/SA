document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  if (getToken()) await refreshCartBadge();
});

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '<div class="spinner"></div>';

  try {
    const products = await apiGet(PRODUCT_URL, '/products');
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">☕</div>
          <h3>No products available right now</h3>
          <p>Check back soon!</p>
        </div>`;
      return;
    }
    grid.innerHTML = products.map(renderProductCard).join('');
  } catch (err) {
    grid.innerHTML = `<div class="alert alert-error" style="grid-column:1/-1">${err.message}</div>`;
  }
}

function renderProductCard(p) {
  const categoryName = p.category?.name ?? '';
  const soldOut = p.stock <= 0;

  return `
    <div class="product-card" id="product-${p.id}">
      ${productImage(p.imageUrl, p.name, 'product-card-img')}
      <div class="product-card-body">
        <div class="product-card-category">${categoryName}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-desc">${p.description}</div>
        <div class="product-card-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="btn btn-primary btn-sm" id="btn-add-${p.id}" onclick="addToCart(${p.id})" ${soldOut ? 'disabled' : ''}>
            ${soldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>`;
}

async function addToCart(productId) {
  if (!getToken()) {
    window.location.href = 'login.html';
    return;
  }

  const btn = document.getElementById(`btn-add-${productId}`);
  if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }

  try {
    const cart = await apiGet(TXN_URL, '/cart');
    const existing = (cart.items ?? []).find(i => i.productId === productId);

    if (existing) {
      await apiPost(TXN_URL, `/cart/${productId}/update`, { quantity: existing.quantity + 1 });
    } else {
      await apiPost(TXN_URL, '/cart', { productId, quantity: 1 });
    }

    if (btn) {
      btn.textContent = 'Added!';
      setTimeout(() => { btn.textContent = 'Add to Cart'; btn.disabled = false; }, 800);
    }
    await refreshCartBadge();
  } catch (err) {
    if (btn) { btn.textContent = 'Add to Cart'; btn.disabled = false; }
    alert(err.message);
  }
}

async function refreshCartBadge() {
  try {
    const cart = await apiGet(TXN_URL, '/cart');
    const total = (cart.items ?? []).reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? 'inline-flex' : 'none';
    }
  } catch {
  }
}
