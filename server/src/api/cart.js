import axios from "axios";
const headers = { "x-user-id": "demo" };

export const getCart = () => axios.get("/api/cart", { headers }).then(r => r.data);
export const addToCart = (productId, qty=1) => axios.post("/api/cart", { productId, qty }, { headers }).then(r => r.data);
export const incItem = (productId) => axios.patch(`/api/cart/${productId}`, { op: "inc" }, { headers }).then(r => r.data);
export const decItem = (productId) => axios.patch(`/api/cart/${productId}`, { op: "dec" }, { headers }).then(r => r.data);
export const removeItem = (productId) => axios.delete(`/api/cart/${productId}`, { headers }).then(r => r.data);
export const clearCart = () => axios.delete("/api/cart", { headers }).then(r => r.data);
