// frontend/src/lib/api.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: BASE,
  // timeout: 15000,
});

export default api;