document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  await renderCart();
});

async function renderCart() {
  const tbody     = document.getElementById('cart-body');
  const emptyEl   = document.getElementById('cart-empty');
  const tableEl   = document.getElementById('cart-table');
  const summaryEl = document.getElementById('cart-summary');

  try {
    const cart  = await apiGet(TXN_URL, '/cart');
    const items = cart.items ?? [];

    if (items.length === 0) {
      emptyEl.style.display   = 'block';
      tableEl.style.display   = 'none';
      summaryEl.style.display = 'none';
      return;
    }

    emptyEl.style.display   = 'none';
    tableEl.style.display   = 'table';
    summaryEl.style.display = 'block';

    tbody.innerHTML = items.map(item => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:12px">
              ${productImage(item.imageUrl, item.name, 'cart-thumb')}
              <span>${item.name}</span>
            </div>
          </td>
          <td>${formatPrice(item.price)}</td>
          <td>
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(${item.productId}, -1)">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQty(${item.productId}, 1)">+</button>
            </div>
          </td>
          <td>${formatPrice(item.subtotal)}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="removeItem(${item.productId})">Remove</button>
          </td>
        </tr>`).join('');

    document.getElementById('cart-total').textContent = formatPrice(cart.total);
    document.getElementById('cart-item-count').textContent = `${items.length} item(s)`;
  } catch (err) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (tableEl) tableEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'none';
    showAlert('cart-alert', err.message);
  }
}

async function changeQty(productId, delta) {
  try {
    const cart = await apiGet(TXN_URL, '/cart');
    const item = (cart.items ?? []).find(i => i.productId === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) {
      await removeItem(productId);
      return;
    }
    await apiPost(TXN_URL, `/cart/${productId}/update`, { quantity: newQty });
    await renderCart();
  } catch (err) {
    showAlert('cart-alert', err.message);
  }
}

async function removeItem(productId) {
  try {
    await apiPost(TXN_URL, `/cart/${productId}/delete`, {});
    await renderCart();
  } catch (err) {
    showAlert('cart-alert', err.message);
  }
}

async function placeOrder() {
  const btn = document.getElementById('place-order-btn');
  btn.disabled    = true;
  btn.textContent = 'Placing order...';
  hideAlert('cart-alert');

  try {
    const res = await apiPost(TXN_URL, '/orders', {});
    const orderId = res.order?.id;
    showAlert('cart-alert', `Order #${orderId} placed successfully!`, 'success');
    setTimeout(() => { window.location.href = 'orders.html'; }, 1500);
  } catch (err) {
    showAlert('cart-alert', err.message);
    btn.disabled    = false;
    btn.textContent = 'Place Order';
  }
}
