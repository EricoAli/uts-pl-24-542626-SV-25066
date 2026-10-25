import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ProductsView from '../views/ProductsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/products',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard untuk proteksi route
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' });
  } else if (to.meta.guestOnly && token) {
    next({ name: 'Products' });
  } else {
    next();
  }
});

export default router;
