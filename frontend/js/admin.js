let categoryCache = [];

document.addEventListener('DOMContentLoaded', async () => {
  requireAdmin();
  await loadCategories();
  await loadProducts();
});

async function loadCategories() {
  const select = document.getElementById('p-category');
  try {
    categoryCache = await apiGet(PRODUCT_URL, '/categories');
  } catch (err) {
    categoryCache = [];
  }

  if (categoryCache.length === 0) {
    select.innerHTML = '<option value="">No categories found</option>';
    return;
  }
  select.innerHTML = categoryCache
    .map(c => `<option value="${c.id}">${c.name}</option>`)
    .join('');
}

async function loadProducts() {
  const tbody = document.getElementById('admin-products-body');
  tbody.innerHTML = '<tr><td colspan="5"><div class="spinner"></div></td></tr>';

  try {
    const products = await apiGet(PRODUCT_URL, '/products');
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--clr-muted)">No products yet</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(renderProductRow).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="alert alert-error">${err.message}</div></td></tr>`;
  }
}

function renderProductRow(p) {
  const categoryName = p.category?.name ?? '';
  const data = encodeURIComponent(JSON.stringify(p));

  return `
    <tr>
      <td>${p.id}</td>
      <td>
        <div style="display:flex;align-items:center;gap:12px">
          ${productImage(p.imageUrl, p.name, 'admin-thumb')}
          <div>
            <strong>${p.name}</strong><br>
            <small style="color:var(--clr-muted)">${categoryName}</small>
          </div>
        </div>
      </td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openEditModal('${data}')">Edit</button>
        <button class="btn btn-danger btn-sm" style="margin-left:6px" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>`;
}

function openCreateModal() {
  document.getElementById('product-modal-title').textContent = 'Add Product';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  hideAlert('product-modal-alert');
  if (categoryCache.length === 0) {
    showAlert('product-modal-alert', 'No categories available. Import the SQL file or run the product seed first.');
  }
  openModal('product-modal');
}

function openEditModal(encoded) {
  const product = JSON.parse(decodeURIComponent(encoded));
  document.getElementById('product-modal-title').textContent = 'Edit Product';
  hideAlert('product-modal-alert');
  document.getElementById('product-id').value = product.id;
  document.getElementById('p-name').value = product.name;
  document.getElementById('p-description').value = product.description;
  document.getElementById('p-price').value = product.price;
  document.getElementById('p-stock').value = product.stock;
  document.getElementById('p-category').value = String(product.categoryId);
  document.getElementById('p-imageUrl').value = product.imageUrl || '';
  openModal('product-modal');
}

async function saveProduct(e) {
  e.preventDefault();
  hideAlert('product-modal-alert');

  const categoryId = parseInt(document.getElementById('p-category').value, 10);
  if (!categoryId) {
    showAlert('product-modal-alert', 'Pick a valid category first.');
    return;
  }

  const id = document.getElementById('product-id').value;
  const imageUrl = document.getElementById('p-imageUrl').value.trim();
  const payload = {
    name:        document.getElementById('p-name').value.trim(),
    description: document.getElementById('p-description').value.trim(),
    price:       parseInt(document.getElementById('p-price').value, 10),
    stock:       parseInt(document.getElementById('p-stock').value, 10),
    categoryId,
  };
  if (imageUrl) payload.imageUrl = imageUrl;

  try {
    if (id) {
      await apiPost(PRODUCT_URL, `/admin/products/${id}/update`, payload);
    } else {
      await apiPost(PRODUCT_URL, '/admin/products', payload);
    }
    closeModal('product-modal');
    await loadProducts();
  } catch (err) {
    showAlert('product-modal-alert', err.message);
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try {
    await apiPost(PRODUCT_URL, `/admin/products/${id}/delete`, {});
    await loadProducts();
  } catch (err) {
    alert(err.message);
  }
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
