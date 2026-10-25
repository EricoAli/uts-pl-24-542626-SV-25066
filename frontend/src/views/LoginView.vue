<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🛒</div>
        <h2>Aplikasi POS Kasir</h2>
        <p>Silakan masuk menggunakan akun kasir / admin</p>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Alamat Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="admin@pos.com"
            :disabled="isLoading"
          />
          <span v-if="validationErrors.email" class="error-text">
            {{ validationErrors.email[0] }}
          </span>
        </div>

        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="password123"
            :disabled="isLoading"
          />
          <span v-if="validationErrors.password" class="error-text">
            {{ validationErrors.password[0] }}
          </span>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span>{{ isLoading ? 'Memproses...' : 'Masuk ke POS' }}</span>
        </button>
      </form>

      <div class="demo-hint">
        <small><strong>Kredensial Default:</strong> admin@pos.com / password123</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const email = ref('admin@pos.com');
const password = ref('password123');
const isLoading = ref(false);
const errorMessage = ref('');
const validationErrors = ref({});

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  validationErrors.value = {};

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    const { access_token, user } = response.data;

    // Simpan token & user di localStorage
    localStorage.setItem('token', access_token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Arahkan ke halaman Dashboard Produk
    router.push('/products');
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422) {
        validationErrors.value = error.response.data.errors || {};
        errorMessage.value = error.response.data.message || 'Data login tidak valid.';
      } else if (error.response.status === 401) {
        errorMessage.value = error.response.data.message || 'Email atau kata sandi tidak cocok.';
      } else {
        errorMessage.value = 'Terjadi kesalahan pada server. Coba lagi nanti.';
      }
    } else {
      errorMessage.value = 'Tidak dapat terhubung ke server API backend.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  padding: 2.5rem 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.login-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 700;
}

.login-header p {
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  padding: 0.75rem 0.875rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.error-text {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
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

.demo-hint {
  margin-top: 1.75rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
  text-align: center;
  color: #64748b;
}
</style>
