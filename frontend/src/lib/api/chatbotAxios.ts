import axios, { InternalAxiosRequestConfig } from "axios";
import { ENV } from "@/lib/env";

export const chatbotAxios = axios.create({
  baseURL: ENV.CHATBOT.BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add X-API-KEY header if configured
chatbotAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (ENV.CHATBOT.API_KEY && config.headers) {
      config.headers["X-API-KEY"] = ENV.CHATBOT.API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

