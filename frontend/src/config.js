// Configuración centralizada de la aplicación
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const config = {
  // URL base de la API - Cambiar según el entorno
  API_URL: process.env.REACT_APP_API_URL || (isDevelopment ? 'http://localhost:8081/api' : 'https://proyectofisio.onrender.com/api'),
  
  // URL base de la aplicación
  BASE_URL: process.env.REACT_APP_BASE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://proyectofisio-frontend.onrender.com'),
  
  // Configuración de timeout para peticiones
  API_TIMEOUT: 30000, // 30 segundos
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

// Log de configuración para debug
console.log('🔧 Configuración de la aplicación:');
console.log('   - Entorno:', process.env.NODE_ENV || 'development');
console.log('   - API URL:', config.API_URL);
console.log('   - BASE URL:', config.BASE_URL);

export default config; 