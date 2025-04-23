import axios from 'axios';
import { formatCifNif } from '../utils/formatters';

// Crear una instancia de axios con la URL base de la API
const API_URL = 'https://proyectofisio.onrender.com/api';

// Crear diferentes instancias para cada microservicio si es necesario
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configuración global para todas las peticiones
  timeout: 15000, // 15 segundos por defecto
  withCredentials: true, // Añadido para permitir cookies en peticiones CORS
});

// Añadir interceptor para incluir el token en las solicitudes
api.interceptors.request.use(
  (config) => {
    // Obtener token y añadirlo a la cabecera
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Optimización para evitar caché en peticiones críticas
    if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }
    
    return config;
  },
  (error) => {
    console.error("Error en interceptor de petición:", error);
    return Promise.reject(error);
  }
);

// Manejo de errores global
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Error en respuesta:", error.message);
    
    // Mostrar detalles del error
    if (error.response) {
      console.error("Estado de respuesta:", error.response.status);
      console.error("Cabeceras de respuesta:", error.response.headers);
      console.error("Datos de respuesta:", error.response.data);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor");
      console.error("Detalles de la petición:", error.request);
    }
    
    // Capturar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      // Si el token ha expirado o es inválido, cerrar sesión
      authService.logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    try {
      // Configurar timeout y opciones para optimizar la petición
      const config = {
        timeout: 60000, // Aumentado a 60 segundos para dar más tiempo al servidor
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      };
      
      // Intentamos hacer ping al servidor primero para verificar que está disponible
      try {
        await axios.get(`${API_URL}/health-check`, { timeout: 5000 });
      } catch (pingError) {
        console.warn("No se pudo verificar el estado del servidor", pingError.message);
        // No bloqueamos el flujo, continuamos con el intento de login
      }
      
      const response = await api.post('/auth/login', { email, password }, config);
      
      if (response.data && response.data.token) {
        // Almacenar token y datos de usuario de forma segura
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Guardar la fecha de la última autenticación
        const now = new Date().getTime();
        localStorage.setItem('lastAuthentication', now.toString());
        
        // Establecer el header de autorización para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      } else {
        console.error("Login: Respuesta sin token", response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      
      // Mensajes de error más descriptivos según el tipo de error
      let errorMessage = error.message;
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "El servidor tardó demasiado en responder. El servicio puede estar iniciándose o sobrecargado. Por favor, espera unos minutos e inténtalo de nuevo.";
        console.error("Error de timeout detectado. Tiempo de espera agotado:", error.config?.timeout || 60000, "ms");
      } else if (error.message.includes('Network Error')) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet o si el servicio está disponible.";
        console.error("Error de red detectado. Detalles:", error);
      }
      
      if (error.response) {
        console.error("Estado de respuesta:", error.response.status);
        console.error("Datos de respuesta:", error.response.data);
        
        // Mensajes específicos según el código de estado
        if (error.response.status === 401) {
          errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
        } else if (error.response.status === 403) {
          errorMessage = "No tienes permisos para acceder.";
        } else if (error.response.status >= 500) {
          errorMessage = "Error en el servidor. Inténtalo de nuevo más tarde.";
        }
      }
      
      // Propagar el error con mensaje mejorado
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/registro', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  registerComplete: async (registerData) => {
    try {
      // Crear un objeto FormData para enviar los datos, incluyendo archivos
      const formData = new FormData();
      
      // Prepara los datos del usuario
      const usuarioData = {
        nombre: registerData.nombre,
        apellidos: registerData.apellidos,
        email: registerData.email,
        contraseña: registerData.password,
        telefono: registerData.telefono,
        dni: registerData.dni ? formatCifNif(registerData.dni) : '',
        numeroColegiado: registerData.numeroColegiado || '',
        especialidad: registerData.especialidad || '',
        rol: registerData.rol || 'DUENO',
        fechaAlta: new Date().toISOString().split('T')[0],
        emailVerificado: false // Por defecto, no está verificado
      };
      
      // Prepara los datos de la empresa
      const empresaData = {
        nombre: registerData.nombreEmpresa,
        nif: registerData.cifNif ? formatCifNif(registerData.cifNif) : '',
        direccion: registerData.direccion,
        codigoPostal: registerData.codigoPostal,
        ciudad: registerData.ciudad,
        provincia: registerData.provincia,
        pais: registerData.pais,
        web: registerData.web || '',
        email: registerData.email,
        telefono: registerData.telefono
      };
      
      // Agregar los objetos JSON como strings al FormData
      formData.append('usuario', JSON.stringify(usuarioData));
      formData.append('empresa', JSON.stringify(empresaData));
      
      // Añadir el logo si existe (usamos registerData.logo directamente)
      // El frontend debe asegurarse de que este campo se llame 'logo' para que coincida 
      // con lo que espera el backend (ver método handleSubmit en Register.jsx)
      if (registerData.logo) {
        formData.append('logo', registerData.logo);
      } else if (registerData.logoEmpresa) {
        // Compatibilidad con versiones anteriores por si aún se usa logoEmpresa
        formData.append('logo', registerData.logoEmpresa);
      }
      
      // Configurar la petición para manejar FormData
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 segundos para permitir la subida de archivos
      };
      
      const response = await api.post('/auth/registro-completo', formData, config);
      return response.data;
    } catch (error) {
      console.error('Error en registro completo:', error);
      throw error;
    }
  },
  
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verificar-email/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastAuthentication');
    localStorage.removeItem('empresaId');
    
    // Limpiar header de autorización
    delete api.defaults.headers.common['Authorization'];
  },
  
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        return null;
      }
      
      // Intentar parsear los datos del usuario
      try {
        const userData = JSON.parse(userStr);
        
        // Verificar que los datos del usuario contienen información mínima necesaria
        if (!userData || !userData.id) {
          return null;
        }
        
        // Actualizar la fecha de última actividad
        authService.refreshSession();
        
        return userData;
      } catch (parseError) {
        // Si hay error al parsear, limpiar el almacenamiento corrupto
        localStorage.removeItem('user');
        return null;
      }
    } catch (error) {
      // Si hay error, limpiar el almacenamiento
      localStorage.removeItem('user');
      return null;
    }
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const lastAuth = localStorage.getItem('lastAuthentication');
    
    if (!token || !user || !lastAuth) {
      return false;
    }
    
    try {
      // Verificar que los datos del usuario son válidos
      const userData = JSON.parse(user);
      
      if (!userData || !userData.id || !userData.rol) {
        return false;
      }
      
      // Verificar si la sesión ha expirado (24 horas por defecto)
      const lastAuthTime = parseInt(lastAuth, 10);
      const now = new Date().getTime();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      const timeElapsed = now - lastAuthTime;
      
      if (timeElapsed > sessionDuration) {
        authService.logout();
        return false;
      }
      
      // Actualizar timestamp de actividad
      authService.refreshSession();
      
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Método para refrescar la sesión del usuario
  refreshSession: () => {
    try {
      const now = new Date().getTime();
      localStorage.setItem('lastAuthentication', now.toString());
      
      // Asegurarse de que el token esté configurado en los headers
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      return true;
    } catch (error) {
      console.error("Error al refrescar sesión:", error);
      return false;
    }
  },
  
  // Método para verificar el estado del token con el servidor
  verifyToken: async () => {
    try {
      // Verificar primero si hay token en local storage
      if (!authService.isAuthenticated()) {
        return false;
      }
      
      // Hacer una petición simple al endpoint de verificación de token
      const response = await api.get('/auth/verify-token');
      
      // Si la respuesta es exitosa, el token es válido
      if (response.status === 200) {
        authService.refreshSession();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error verificando token con el servidor:", error);
      
      // Si es un error 401 o 403, el token es inválido
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        authService.logout();
      }
      
      return false;
    }
  }
};

// Servicios para gestionar citas (microservicio de agenda)
export const agendaService = {
  getAllCitas: async () => {
    try {
      const response = await api.get('/agenda');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCitaById: async (id) => {
    try {
      const response = await api.get(`/agenda/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCitasByPacienteId: async (pacienteId) => {
    try {
      const response = await api.get(`/agenda/paciente/${pacienteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCitasByUsuarioId: async (usuarioId) => {
    try {
      const response = await api.get(`/agenda/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCitasByFecha: async (fecha) => {
    try {
      const response = await api.get(`/agenda/fecha/${fecha}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createCita: async (citaData) => {
    try {
      const response = await api.post('/agenda', citaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateCita: async (id, citaData) => {
    try {
      const response = await api.put(`/agenda/${id}`, citaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  cancelarCita: async (id) => {
    try {
      const response = await api.patch(`/agenda/${id}/cancelar`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCita: async (id) => {
    try {
      const response = await api.delete(`/agenda/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para gestionar pacientes (microservicio de pacientes)
export const pacienteService = {
  getAllPacientes: async () => {
    try {
      const response = await api.get('/pacientes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getPacienteById: async (id) => {
    try {
      const response = await api.get(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPacientesByEmpresa: async (empresaId) => {
    try {
      const response = await api.get(`/pacientes/empresa/${empresaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createPaciente: async (pacienteData) => {
    try {
      const response = await api.post('/pacientes', pacienteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePaciente: async (id, pacienteData) => {
    try {
      const response = await api.put(`/pacientes/${id}`, pacienteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deletePaciente: async (id) => {
    try {
      const response = await api.delete(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para gestionar usuarios (microservicio de usuarios)
export const usuarioService = {
  getAllUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUsuarioById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUsuariosByEmpresa: async (empresaId) => {
    try {
      const response = await api.get(`/usuarios/empresa/${empresaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUsuariosByRol: async (rol) => {
    try {
      const response = await api.get(`/usuarios/rol?rol=${rol}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createUsuario: async (usuarioData) => {
    try {
      // Formatear el DNI
      if (usuarioData.dni) {
        usuarioData.dni = formatCifNif(usuarioData.dni);
      }
      
      const response = await api.post('/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  
  updateUsuario: async (id, usuarioData) => {
    try {
      // Formatear el DNI
      if (usuarioData.dni) {
        usuarioData.dni = formatCifNif(usuarioData.dni);
      }
      
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  
  changePassword: async (id, passwordData) => {
    try {
      const response = await api.post(`/usuarios/${id}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },
  
  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para gestionar empresas (microservicio de empresas)
export const empresaService = {
  getAllEmpresas: async () => {
    try {
      const response = await api.get('/empresas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getEmpresaById: async (id) => {
    try {
      const response = await api.get(`/empresas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createEmpresa: async (empresaData) => {
    try {
      // Formatear el NIF/CIF
      if (empresaData.nif) {
        empresaData.nif = formatCifNif(empresaData.nif);
      }
      
      const response = await api.post('/empresas', empresaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear empresa:', error);
      throw error;
    }
  },
  
  updateEmpresa: async (id, empresaData) => {
    try {
      // Formatear el NIF/CIF
      if (empresaData.nif) {
        empresaData.nif = formatCifNif(empresaData.nif);
      }
      
      const response = await api.put(`/empresas/${id}`, empresaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      throw error;
    }
  },
  
  // Nuevo método para actualizar una empresa con su logo
  updateEmpresaConLogo: async (id, empresaData, logoFile) => {
    try {
      const formData = new FormData();
      
      // Formatear CIF/NIF si existe
      if (empresaData.nif) {
        empresaData.nif = formatCifNif(empresaData.nif);
      }
      
      // Añadir los datos de la empresa como un JSON string
      formData.append('empresa', JSON.stringify(empresaData));
      
      // Añadir el archivo de logo si existe
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      const response = await api.put(
        `/empresas/${id}/with-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 segundos para permitir la subida de archivos
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar empresa con logo:', error);
      throw error;
    }
  },
  
  // Nuevo método para actualizar solo el logo de una empresa
  updateLogoEmpresa: async (id, logoFile) => {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      const response = await api.post(
        `/files/empresas/${id}/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 segundos para permitir la subida de archivos
        }
      );
      
      return response.data.logoUrl;
    } catch (error) {
      console.error('Error al actualizar logo:', error);
      throw error;
    }
  },
  
  deleteEmpresa: async (id) => {
    try {
      const response = await api.delete(`/empresas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para bonos de pacientes
export const bonoPacienteService = {
  // Obtener todos los bonos de un paciente
  getBonosByPacienteId: async (pacienteId, estado = null) => {
    try {
      let url = `/pacientes/${pacienteId}/bonos`;
      if (estado) {
        url += `?estado=${estado}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al obtener bonos del paciente:", error);
      throw error;
    }
  },
  
  // Obtener un bono específico
  getBonoPacienteById: async (pacienteId, bonoId) => {
    try {
      const response = await api.get(`/pacientes/${pacienteId}/bonos/${bonoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener bono:", error);
      throw error;
    }
  },
  
  // Crear un nuevo bono
  createBonoPaciente: async (pacienteId, bonoData) => {
    try {
      const response = await api.post(`/pacientes/${pacienteId}/bonos`, bonoData);
      return response.data;
    } catch (error) {
      console.error("Error al crear bono:", error);
      throw error;
    }
  },
  
  // Actualizar un bono existente
  updateBonoPaciente: async (pacienteId, bonoId, bonoData) => {
    try {
      const response = await api.put(`/pacientes/${pacienteId}/bonos/${bonoId}`, bonoData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar bono:", error);
      throw error;
    }
  },
  
  // Eliminar un bono
  deleteBonoPaciente: async (pacienteId, bonoId) => {
    try {
      await api.delete(`/pacientes/${pacienteId}/bonos/${bonoId}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar bono:", error);
      throw error;
    }
  }
};

// Servicios para productos
export const productoService = {
  // Obtener todos los productos
  getAllProductos: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },
  
  // Obtener un producto específico
  getProductoById: async (productoId) => {
    try {
      const response = await api.get(`/productos/${productoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  }
};

// Servicios para gestión de servicios
export const servicioService = {
  // Obtener todos los servicios
  getAllServicios: async () => {
    try {
      const response = await api.get('/servicios');
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      throw error;
    }
  },
  
  // Obtener un servicio específico
  getServicioById: async (servicioId) => {
    try {
      const response = await api.get(`/servicios/${servicioId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicio:", error);
      throw error;
    }
  },
  
  // Obtener servicios de tipo bono
  getServiciosBonos: async (empresaId) => {
    try {
      const response = await api.get(`/servicios/empresa/${empresaId}/bonos`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios de bonos:", error);
      throw error;
    }
  }
};

// Programas personalizados
export const programasPersonalizadosService = {
  getProgramas: async (empresaId) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/programas-personalizados/empresa/${empresaId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener programas personalizados:', error);
      throw error;
    }
  },
  
  getProgramaById: async (id) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/programas-personalizados/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener programa personalizado:', error);
      throw error;
    }
  },
  
  createPrograma: async (programaData) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/programas-personalizados`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(programaData),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear programa personalizado:', error);
      throw error;
    }
  },
  
  updatePrograma: async (id, programaData) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/programas-personalizados/${id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(programaData),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar programa personalizado:', error);
      throw error;
    }
  },
  
  deletePrograma: async (id) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/programas-personalizados/${id}`,
        {
          method: 'DELETE',
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar programa personalizado:', error);
      throw error;
    }
  },
  
  generarTokensAcceso: async (programaId, pacienteIds) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/programas-personalizados/${programaId}/generar-tokens`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pacienteIds }),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al generar tokens de acceso:', error);
      throw error;
    }
  },
  
  getTokensByProgramaId: async (programaId) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/programas-personalizados/${programaId}/tokens`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener tokens de programa:', error);
      throw error;
    }
  },
  
  verificarToken: async (token) => {
    try {
      const response = await fetch(`${API_URL}/programas-personalizados/verificar-token/${token}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al verificar token:', error);
      throw error;
    }
  },
};

export {
  authService,
  userService,
  pacienteService,
  agendaService,
  salaService,
  servicioService,
  empresaService,
  productoBonificadoService,
  programasPersonalizadosService
};

export default api; 