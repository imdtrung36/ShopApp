// src/controllers/cartController.js
const LS_KEY = "cart_v1";

export const getCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const cart = JSON.parse(raw);
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  localStorage.setItem(LS_KEY, JSON.stringify(cart));
};

export const addToCart = (cart, product) => {
  const idx = cart.findIndex((p) => p.id === product.id);
  if (idx !== -1) {
    const updated = [...cart];
    updated[idx] = { ...updated[idx], qty: (updated[idx].qty || 0) + 1 };
    return updated;
  }
  return [...cart, { ...product, qty: 1 }];
};

export const increaseQty = (cart, id) =>
  cart.map((p) => (p.id === id ? { ...p, qty: (p.qty || 0) + 1 } : p));

export const decreaseQty = (cart, id) =>
  cart
    .map((p) => (p.id === id ? { ...p, qty: (p.qty || 0) - 1 } : p))
    .filter((p) => (p.qty || 0) > 0);

export const removeFromCart = (cart, id) =>
  cart.filter((p) => p.id !== id);

export const clearCart = () => [];
