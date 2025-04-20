import axios from 'axios';

// Crear una instancia de axios con la URL base de la API
const API_URL = 'https://proyectofisio.onrender.com/api';

// Crear diferentes instancias para cada microservicio si es necesario
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir interceptor para incluir el token en las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
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
      
      // Extraer los datos del usuario y empresa
      const usuarioData = {
        nombre: registerData.nombre,
        apellidos: registerData.apellidos,
        email: registerData.email,
        contraseña: registerData.password,
        telefono: registerData.telefono,
        dni: registerData.dni,
        numeroColegiado: registerData.numeroColegiado || '',
        especialidad: registerData.especialidad || '',
        rol: registerData.rol
      };
      
      const empresaData = {
        nombre: registerData.nombreEmpresa,
        nif: registerData.cifNif,
        direccion: registerData.direccion,
        codigoPostal: registerData.codigoPostal,
        ciudad: registerData.ciudad,
        provincia: registerData.provincia,
        pais: registerData.pais,
        web: registerData.web || '',
        email: registerData.email,
        telefono: registerData.telefono
      };
      
      // Convertir los objetos a JSON y agregarlos al FormData
      formData.append('usuario', new Blob([JSON.stringify(usuarioData)], { type: 'application/json' }));
      formData.append('empresa', new Blob([JSON.stringify(empresaData)], { type: 'application/json' }));
      
      // Añadir el logo si existe
      if (registerData.logo) {
        formData.append('empresa.logo', registerData.logo);
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
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
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
      const response = await api.post('/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateUsuario: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
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
      const response = await api.post('/empresas', empresaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateEmpresa: async (id, empresaData) => {
    try {
      const response = await api.put(`/empresas/${id}`, empresaData);
      return response.data;
    } catch (error) {
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

export default api; 