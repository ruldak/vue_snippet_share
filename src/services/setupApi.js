import api from "./api";
import { useAuthStore } from "../store/auth";

export function setupInterceptors() {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.data?.detail === "Authentication credentials were not provided." || error.response?.data?.code === "token_not_valid") {
        const authStore = useAuthStore();
        authStore.logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}