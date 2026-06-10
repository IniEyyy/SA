document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  await loadOrders();
});

async function loadOrders() {
  const container = document.getElementById('orders-container');
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const orders = await apiGet(TXN_URL, '/orders');

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No orders yet</h3>
          <p><a href="menu.html">Browse the menu</a> to place your first order.</p>
        </div>`;
      return;
    }

    const detailed = await Promise.all(
      orders.map(o => apiPost(TXN_URL, `/orders/${o.id}`, {}))
    );
    container.innerHTML = detailed.map(renderOrderCard).join('');
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
  }
}

function renderOrderCard(order) {
  const date = new Date(order.createdAt).toLocaleString();
  let total = 0;

  const rows = order.details.map(d => {
    total += d.subtotal;
    return `
      <tr>
        <td>${d.name}</td>
        <td>${formatPrice(d.price)}</td>
        <td>${d.quantity}</td>
        <td>${formatPrice(d.subtotal)}</td>
      </tr>`;
  }).join('');

  return `
    <div class="card order-card">
      <div class="order-card-head">
        <div>
          <strong>Order #${order.id}</strong>
          <div class="order-date">${date}</div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="order-total">
        Total: <span>${formatPrice(total)}</span>
      </div>
    </div>`;
}
