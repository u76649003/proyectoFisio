// Configuración centralizada de la aplicación
const config = {
  // URL base de la API
  API_URL: process.env.REACT_APP_API_URL || 'https://proyectofisio.onrender.com/api',
  
  // URL base de la aplicación
  BASE_URL: process.env.REACT_APP_BASE_URL || 'https://proyectofisio-frontend.onrender.com',
  
  // Configuración de timeout para peticiones
  API_TIMEOUT: 30000, // 30 segundos
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

export default config; 