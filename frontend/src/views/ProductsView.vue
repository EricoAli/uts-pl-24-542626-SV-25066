<template>
  <div class="pos-layout">
    <!-- Navbar -->
    <header class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🛒</span>
        <div>
          <h1 class="brand-title">POS Kasir System</h1>
          <span class="brand-subtitle">Manajemen Inventaris & Produk</span>
        </div>
      </div>

      <div class="nav-user">
        <div class="user-info">
          <span class="user-name">{{ user?.name || 'Kasir / Admin' }}</span>
          <span class="user-email">{{ user?.email || 'admin@pos.com' }}</span>
        </div>
        <button @click="handleLogout" class="btn btn-outline-danger" :disabled="isLoggingOut">
          <span>{{ isLoggingOut ? 'Keluar...' : '🚪 Logout' }}</span>
        </button>
      </div>
    </header>

    <!-- Main Container -->
    <main class="main-content">
      <!-- Notification Alert -->
      <div v-if="notification.message" :class="['alert', `alert-${notification.type}`]">
        <span>{{ notification.message }}</span>
        <button @click="clearNotification" class="alert-close">&times;</button>
      </div>

      <!-- Action & Filter Bar -->
      <div class="dashboard-header">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Total Produk</span>
            <span class="stat-value">{{ products.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Total Stok Tersedia</span>
            <span class="stat-value">{{ totalStock }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Kategori Unik</span>
            <span class="stat-value">{{ uniqueCategoriesCount }}</span>
          </div>
        </div>

        <div class="controls-bar">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari SKU, nama, atau kategori..."
            />
          </div>
          <button @click="openCreateModal" class="btn btn-primary">
            <span>➕ Tambah Produk</span>
          </button>
        </div>
      </div>

      <!-- Products Table Card -->
      <div class="card table-card">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Memuat daftar produk...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <span class="empty-icon">📦</span>
          <h3>Tidak ada produk yang ditemukan</h3>
          <p v-if="searchQuery">Coba gunakan kata kunci pencarian yang lain.</p>
          <p v-else>Klik tombol "Tambah Produk" untuk mulai menginput data.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>SKU</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in filteredProducts" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td><span class="sku-badge">{{ product.sku }}</span></td>
                <td class="font-bold">{{ product.name }}</td>
                <td><span class="category-badge">{{ product.category }}</span></td>
                <td>Rp {{ formatNumber(product.price) }}</td>
                <td>
                  <span :class="['stock-badge', product.stock <= 5 ? 'stock-low' : 'stock-ok']">
                    {{ product.stock }} unit
                  </span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button
                      @click="openEditModal(product)"
                      class="btn-icon btn-edit"
                      title="Ubah Produk"
                    >
                      ✏️ Ubah
                    </button>
                    <button
                      @click="confirmDelete(product)"
                      class="btn-icon btn-delete"
                      title="Hapus Produk"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal Form (Tambah / Ubah Produk) -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Ubah Informasi Produk' : 'Tambah Produk Baru' }}</h3>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>

        <form @submit.prevent="handleSubmitProduct">
          <div class="modal-body">
            <div v-if="modalErrorMessage" class="alert alert-danger">
              {{ modalErrorMessage }}
            </div>

            <div class="form-group">
              <label for="prod-sku">Kode SKU (Unique) *</label>
              <input
                id="prod-sku"
                v-model="form.sku"
                type="text"
                required
                placeholder="Contoh: POS-CF-001"
                :disabled="isSubmitting"
              />
              <span v-if="formErrors.sku" class="error-text">{{ formErrors.sku[0] }}</span>
            </div>

            <div class="form-group">
              <label for="prod-name">Nama Produk *</label>
              <input
                id="prod-name"
                v-model="form.name"
                type="text"
                required
                placeholder="Contoh: Kopi Espresso Blend"
                :disabled="isSubmitting"
              />
              <span v-if="formErrors.name" class="error-text">{{ formErrors.name[0] }}</span>
            </div>

            <div class="form-group">
              <label for="prod-category">Kategori *</label>
              <input
                id="prod-category"
                v-model="form.category"
                type="text"
                required
                placeholder="Contoh: Minuman, Makanan, Snack"
                :disabled="isSubmitting"
              />
              <span v-if="formErrors.category" class="error-text">{{ formErrors.category[0] }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="prod-price">Harga Satuan (Rp) *</label>
                <input
                  id="prod-price"
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="25000"
                  :disabled="isSubmitting"
                />
                <span v-if="formErrors.price" class="error-text">{{ formErrors.price[0] }}</span>
              </div>

              <div class="form-group">
                <label for="prod-stock">Stok Awal *</label>
                <input
                  id="prod-stock"
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  required
                  placeholder="50"
                  :disabled="isSubmitting"
                />
                <span v-if="formErrors.stock" class="error-text">{{ formErrors.stock[0] }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn btn-secondary" :disabled="isSubmitting">
              Batal
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-small"></span>
              <span>{{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Produk') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

// User state
const user = ref(null);
const isLoggingOut = ref(false);

// Products state
const products = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

// Notification state
const notification = ref({ message: '', type: 'success' });

// Modal state
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const modalErrorMessage = ref('');
const formErrors = ref({});

const form = ref({
  sku: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
});

// Format Angka ke Rupiah
const formatNumber = (num) => {
  const n = parseFloat(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString('id-ID');
};

// Summary stats
const totalStock = computed(() => {
  return products.value.reduce((acc, p) => acc + (parseInt(p.stock) || 0), 0);
});

const uniqueCategoriesCount = computed(() => {
  const cats = new Set(products.value.map((p) => p.category));
  return cats.size;
});

// Filter produk berdasarkan search bar
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter(
    (p) =>
      p.sku?.toLowerCase().includes(q) ||
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
  );
});

const showNotification = (message, type = 'success') => {
  notification.value = { message, type };
  setTimeout(() => {
    if (notification.value.message === message) {
      notification.value = { message: '', type: 'success' };
    }
  }, 4000);
};

const clearNotification = () => {
  notification.value = { message: '', type: 'success' };
};

// Fetch data produk dari backend
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/products');
    products.value = response.data.data || [];
  } catch (error) {
    showNotification('Gagal memuat daftar produk dari server.', 'danger');
  } finally {
    isLoading.value = false;
  }
};

// Buka Modal Tambah
const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    sku: '',
    name: '',
    category: '',
    price: '',
    stock: '',
  };
  modalErrorMessage.value = '';
  formErrors.value = {};
  showModal.value = true;
};

// Buka Modal Edit
const openEditModal = (product) => {
  isEditing.value = true;
  editingId.value = product.id;
  form.value = {
    sku: product.sku,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
  };
  modalErrorMessage.value = '';
  formErrors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  if (!isSubmitting.value) {
    showModal.value = false;
  }
};

// Submit Form (Tambah atau Ubah)
const handleSubmitProduct = async () => {
  isSubmitting.value = true;
  modalErrorMessage.value = '';
  formErrors.value = {};

  try {
    if (isEditing.value) {
      await api.put(`/products/${editingId.value}`, form.value);
      showNotification('Produk berhasil diperbarui!', 'success');
    } else {
      await api.post('/products', form.value);
      showNotification('Produk baru berhasil ditambahkan!', 'success');
    }
    showModal.value = false;
    await fetchProducts();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      formErrors.value = error.response.data.errors || {};
      modalErrorMessage.value = error.response.data.message || 'Validasi formulir gagal.';
    } else {
      modalErrorMessage.value = 'Gagal menyimpan data produk ke server.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Hapus Produk
const confirmDelete = async (product) => {
  const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}" (${product.sku})?`);
  if (!confirmed) return;

  try {
    await api.delete(`/products/${product.id}`);
    showNotification(`Produk "${product.name}" berhasil dihapus!`, 'success');
    await fetchProducts();
  } catch (error) {
    showNotification('Gagal menghapus produk.', 'danger');
  }
};

// Logout
const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isLoggingOut.value = false;
    router.push('/login');
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      user.value = null;
    }
  }
  fetchProducts();
});
</script>

<style scoped>
.pos-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.875rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 2rem;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.8rem;
  color: #64748b;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.user-info {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
}

/* Main Content */
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

/* Alert Notification */
.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.alert-success {
  background-color: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.alert-danger {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
}

/* Header & Stats */
.dashboard-header {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 260px;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background: #ffffff;
  transition: all 0.2s;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Cards & Table */
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.sku-badge {
  font-family: monospace;
  font-size: 0.8rem;
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 600;
}

.category-badge {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-weight: 500;
}

.stock-badge {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-weight: 600;
}

.stock-ok {
  background-color: #ecfdf5;
  color: #059669;
}

.stock-low {
  background-color: #fef2f2;
  color: #dc2626;
}

.font-bold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.action-buttons {
  display: inline-flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.btn-edit:hover {
  background: #dbeafe;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.btn-delete:hover {
  background: #fee2e2;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

.spinner-large {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 1rem;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.2rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-outline-danger {
  background: transparent;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.btn-outline-danger:hover:not(:disabled) {
  background: #fef2f2;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 999;
}

.modal-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 520px;
  border-radius: 14px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
}

.modal-close:hover {
  color: #334155;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  padding: 0.65rem 0.85rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error-text {
  font-size: 0.8rem;
  color: #dc2626;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.spinner-small {
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
