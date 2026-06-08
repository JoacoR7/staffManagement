// URL base del backend. Se configura con la variable de entorno VITE_API_URL
// (ver archivo .env). Si no está definida, usa localhost por defecto.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000'
