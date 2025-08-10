import axios from "axios";
const headers = { "x-user-id": "demo" };

export const createOrder = (payload) => axios.post("/api/orders", payload, { headers }).then(r => r.data);
