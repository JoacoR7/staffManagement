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
      logout(); // token expirado, manda al login
      return;
    }

    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res;
  };

  return { apiFetch };
}