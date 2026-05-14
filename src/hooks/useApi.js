// hooks/useApi.js
import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { token, logout } = useAuth();

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); 
      const error = new Error(errorData.error || `Error ${res.status}`);
      error.status = res.status;
      error.data = errorData; // Guardamos el JSON del backend 
      throw error; 
    }

    return res;
  };

  return { apiFetch };
}