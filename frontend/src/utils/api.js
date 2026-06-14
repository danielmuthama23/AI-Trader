import axios from "axios";
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000" });
export const getSignals    = ()         => api.get("/api/signals");
export const getNews       = ()         => api.get("/api/news");
export const getTrades     = ()         => api.get("/api/trades");
export const askAdviser    = (msg, ctx) => api.post("/api/adviser", { message: msg, context: ctx });
export const sendMT4Signal = (signal)   => api.post("/api/mt4/signal", signal);
export const configAlerts  = (email)    => api.post("/api/alerts/config", { email });
