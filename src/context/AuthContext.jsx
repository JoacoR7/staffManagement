import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    const res = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        email, password 
      }),
    });

    if (!res.ok) {
        throw new Error("Credenciales inválidas");
    }

    const data = await res.json();

    localStorage.setItem("token", data.accessToken);
    setToken(data.accessToken);
    
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);