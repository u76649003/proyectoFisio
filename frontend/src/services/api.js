import axios from 'axios';

// Crear instancia de Axios con configuración base
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 segundos
});

// Interceptor para las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error en la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error('Sesión expirada o no autorizada');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else if (error.response.status === 403) {
                console.error('Acceso prohibido');
            } else if (error.response.status === 500) {
                console.error('Error del servidor');
            }
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor');
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        return Promise.reject(error);
    }
);

// Función auxiliar para realizar peticiones con autenticación
const fetchWithAuth = async (url, method = 'GET', data = null, options = {}) => {
    try {
        const config = {
            ...options,
            method,
            url,
        };

        if (data) {
            config.data = data;
        }

        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        console.error(`Error en ${method} ${url}:`, error);
        throw error;
    }
};

// Servicio de autenticación
export const authService = {
    login: async (credenciales) => {
        try {
            const response = await axiosInstance.post('/auth/login', credenciales);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.usuario));
                // Guardar timestamp de autenticación
                localStorage.setItem('lastAuthentication', Date.now().toString());
            }
            return response.data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastAuthentication');
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },

    registerComplete: async (userData) => {
        try {
            const formData = new FormData();
            
            // Preparar datos del usuario y empresa en formato JSON
            const usuarioData = {
                nombre: userData.nombre,
                apellidos: userData.apellidos,
                email: userData.email,
                contraseña: userData.password,
                telefono: userData.telefono,
                dni: userData.dni,
                numeroColegiado: userData.numeroColegiado || '',
                especialidad: userData.especialidad || '',
                rol: userData.rol || 'DUENO',
                fechaAlta: new Date().toISOString().split('T')[0]
            };
            
            const empresaData = {
                nombre: userData.nombreEmpresa,
                nif: userData.cifNif,
                direccion: userData.direccion,
                codigoPostal: userData.codigoPostal,
                ciudad: userData.ciudad,
                provincia: userData.provincia,
                pais: userData.pais,
                email: userData.email,
                telefono: userData.telefono,
                web: userData.web || ''
            };
            
            // Añadir partes al FormData
            formData.append('usuario', JSON.stringify(usuarioData));
            formData.append('empresa', JSON.stringify(empresaData));
            
            // Añadir logo si existe
            if (userData.logo && userData.logo instanceof File) {
                formData.append('logo', userData.logo);
            }
            
            // Configuración específica para envío de FormData
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            
            const response = await axiosInstance.post('/auth/registro-completo', formData, config);
            return response.data;
        } catch (error) {
            console.error('Error en registro completo:', error);
            throw error;
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },
    
    getToken: () => {
        return localStorage.getItem('token');
    },
    
    validateToken: async () => {
        try {
            const response = await axiosInstance.get('/auth/validate');
            return response.data;
        } catch (error) {
            console.error('Error validando token:', error);
            throw error;
        }
    },
    
    refreshSession: async () => {
        try {
            // Actualizar timestamp de última autenticación
            localStorage.setItem('lastAuthentication', Date.now().toString());
            
            // Opcionalmente, validar el token con el backend
            const token = localStorage.getItem('token');
            if (token) {
                // Solo intentar validar si hay un token
                try {
                    await axiosInstance.get('/auth/validate');
                    console.log('Sesión refrescada exitosamente');
                } catch (validationError) {
                    console.error('Error validando token durante el refresco:', validationError);
                    // Si hay error al validar, considerar cerrar sesión
                    if (validationError.response && validationError.response.status === 401) {
                        this.logout();
                        window.location.href = '/';
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Error al refrescar la sesión:', error);
            return false;
        }
    },
};

// Servicio para gestión de la agenda
export const agendaService = {
    getAgenda: async (fecha, usuarioId) => {
        try {
            let url = '/agenda';
            const params = new URLSearchParams();
            
            if (fecha) {
                params.append('fecha', fecha);
            }
            
            if (usuarioId) {
                params.append('usuarioId', usuarioId);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            return await fetchWithAuth(url);
        } catch (error) {
            console.error('Error al obtener agenda:', error);
            throw error;
        }
    },
    
    getAgendaByEmpresa: async (empresaId, fecha) => {
        try {
            let url = `/agenda/empresa/${empresaId}`;
            
            if (fecha) {
                url += `?fecha=${fecha}`;
            }
            
            return await fetchWithAuth(url);
        } catch (error) {
            console.error('Error al obtener agenda por empresa:', error);
            throw error;
        }
    },
    
    getAgendaByPaciente: async (pacienteId) => {
        try {
            return await fetchWithAuth(`/agenda/paciente/${pacienteId}`);
        } catch (error) {
            console.error('Error al obtener agenda por paciente:', error);
            throw error;
        }
    },
    
    createCita: async (citaData) => {
        try {
            return await fetchWithAuth('/agenda', 'POST', citaData);
        } catch (error) {
            console.error('Error al crear cita:', error);
            throw error;
        }
    },
    
    updateCita: async (id, citaData) => {
        try {
            return await fetchWithAuth(`/agenda/${id}`, 'PUT', citaData);
        } catch (error) {
            console.error('Error al actualizar cita:', error);
            throw error;
        }
    },
    
    deleteCita: async (id) => {
        try {
            return await fetchWithAuth(`/agenda/${id}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            throw error;
        }
    },
    
    cambiarEstadoCita: async (id, estado) => {
        try {
            return await fetchWithAuth(`/agenda/${id}/estado`, 'PUT', { estado });
        } catch (error) {
            console.error('Error al cambiar estado de cita:', error);
            throw error;
        }
    },
};

// Servicio para gestión de pacientes
export const pacienteService = {
    getPacientesByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/pacientes/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener pacientes por empresa:', error);
            throw error;
        }
    },
    
    getPacienteById: async (id) => {
        try {
            return await fetchWithAuth(`/pacientes/${id}`);
        } catch (error) {
            console.error('Error al obtener paciente por ID:', error);
            throw error;
        }
    },
    
    createPaciente: async (pacienteData) => {
        try {
            return await fetchWithAuth('/pacientes', 'POST', pacienteData);
        } catch (error) {
            console.error('Error al crear paciente:', error);
            throw error;
        }
    },
    
    updatePaciente: async (id, pacienteData) => {
        try {
            return await fetchWithAuth(`/pacientes/${id}`, 'PUT', pacienteData);
        } catch (error) {
            console.error('Error al actualizar paciente:', error);
            throw error;
        }
    },
    
    deletePaciente: async (id) => {
        try {
            return await fetchWithAuth(`/pacientes/${id}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar paciente:', error);
            throw error;
        }
    },
    
    searchPacientes: async (empresaId, searchTerm) => {
        try {
            return await fetchWithAuth(`/pacientes/search?empresaId=${empresaId}&term=${searchTerm}`);
        } catch (error) {
            console.error('Error al buscar pacientes:', error);
            throw error;
        }
    },
};

// Servicio para gestión de usuarios
export const usuarioService = {
    getUsuariosByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/usuarios/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener usuarios por empresa:', error);
            throw error;
        }
    },
    
    getUsuarioById: async (id) => {
        try {
            return await fetchWithAuth(`/usuarios/${id}`);
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            throw error;
        }
    },
    
    createUsuario: async (usuarioData) => {
        try {
            return await fetchWithAuth('/usuarios', 'POST', usuarioData);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },
    
    updateUsuario: async (id, usuarioData) => {
        try {
            return await fetchWithAuth(`/usuarios/${id}`, 'PUT', usuarioData);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    },
    
    deleteUsuario: async (id) => {
        try {
            return await fetchWithAuth(`/usuarios/${id}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    },
    
    updatePassword: async (id, passwordData) => {
        try {
            return await fetchWithAuth(`/usuarios/${id}/password`, 'PUT', passwordData);
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            throw error;
        }
    },
};

// Servicio para gestión de empresas
export const empresaService = {
    getEmpresaById: async (id) => {
        try {
            return await fetchWithAuth(`/empresas/${id}`);
        } catch (error) {
            console.error('Error al obtener empresa por ID:', error);
            throw error;
        }
    },
    
    createEmpresa: async (empresaData) => {
        try {
            return await fetchWithAuth('/empresas', 'POST', empresaData);
        } catch (error) {
            console.error('Error al crear empresa:', error);
            throw error;
        }
    },
    
    updateEmpresa: async (id, empresaData) => {
        try {
            return await fetchWithAuth(`/empresas/${id}`, 'PUT', empresaData);
        } catch (error) {
            console.error('Error al actualizar empresa:', error);
            throw error;
        }
    },
    
    updateLogoEmpresa: async (id, logoFile) => {
        try {
            const formData = new FormData();
            formData.append('logo', logoFile);
            
            const response = await axiosInstance.post(`/files/empresas/${id}/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error al actualizar logo de empresa:', error);
            throw error;
        }
    },
};

// Servicios para bonos de pacientes
export const bonoPacienteService = {
    getBonosByPaciente: async (pacienteId) => {
        try {
            return await fetchWithAuth(`/bonos/paciente/${pacienteId}`);
        } catch (error) {
            console.error('Error al obtener bonos del paciente:', error);
            throw error;
        }
    },
    
    getBonoById: async (id) => {
        try {
            return await fetchWithAuth(`/bonos/${id}`);
        } catch (error) {
            console.error('Error al obtener bono por ID:', error);
            throw error;
        }
    },
    
    createBono: async (bonoData) => {
        try {
            return await fetchWithAuth('/bonos', 'POST', bonoData);
        } catch (error) {
            console.error('Error al crear bono:', error);
            throw error;
        }
    },
    
    updateBono: async (id, bonoData) => {
        try {
            return await fetchWithAuth(`/bonos/${id}`, 'PUT', bonoData);
        } catch (error) {
            console.error('Error al actualizar bono:', error);
            throw error;
        }
    },
    
    deleteBono: async (id) => {
        try {
            return await fetchWithAuth(`/bonos/${id}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar bono:', error);
            throw error;
        }
    },
    
    getBonosByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/bonos/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener bonos por empresa:', error);
            throw error;
        }
    },
    
    consumirSesion: async (bonoId) => {
        try {
            return await fetchWithAuth(`/bonos/${bonoId}/consumir`, 'PUT');
        } catch (error) {
            console.error('Error al consumir sesión del bono:', error);
            throw error;
        }
    },
};

// Servicios para productos
export const productoService = {
  // Obtener todos los productos
  getAllProductos: async () => {
    try {
      const response = await axiosInstance.get('/productos');
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },
  
  // Obtener un producto específico
  getProductoById: async (productoId) => {
    try {
      const response = await axiosInstance.get(`/productos/${productoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },
  
  getProductosByEmpresa: async (empresaId) => {
    try {
      return await fetchWithAuth(`/productos/empresa/${empresaId}`);
    } catch (error) {
      console.error('Error al obtener productos por empresa:', error);
      throw error;
    }
  },
  
  createProducto: async (productoData) => {
    try {
      return await fetchWithAuth('/productos', 'POST', productoData);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },
  
  updateProducto: async (id, productoData) => {
    try {
      return await fetchWithAuth(`/productos/${id}`, 'PUT', productoData);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },
  
  deleteProducto: async (id) => {
    try {
      return await fetchWithAuth(`/productos/${id}`, 'DELETE');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },
};

// Servicios para gestión de servicios
export const servicioService = {
  // Obtener todos los servicios
  getAllServicios: async () => {
    try {
      const response = await axiosInstance.get('/servicios');
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      throw error;
    }
  },
  
  // Obtener un servicio específico
  getServicioById: async (servicioId) => {
    try {
      const response = await axiosInstance.get(`/servicios/${servicioId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicio:", error);
      throw error;
    }
  },
  
  // Obtener servicios de tipo bono
  getServiciosBonos: async (empresaId) => {
    try {
      const response = await axiosInstance.get(`/servicios/empresa/${empresaId}/bonos`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios de bonos:", error);
      throw error;
    }
  },
  
  getServiciosByEmpresa: async (empresaId) => {
    try {
      return await fetchWithAuth(`/servicios/empresa/${empresaId}`);
    } catch (error) {
      console.error('Error al obtener servicios por empresa:', error);
      throw error;
    }
  },
  
  createServicio: async (servicioData) => {
    try {
      return await fetchWithAuth('/servicios', 'POST', servicioData);
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  },
  
  updateServicio: async (id, servicioData) => {
    try {
      return await fetchWithAuth(`/servicios/${id}`, 'PUT', servicioData);
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  },
  
  deleteServicio: async (id) => {
    try {
      return await fetchWithAuth(`/servicios/${id}`, 'DELETE');
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      throw error;
    }
  },
};

// Programas personalizados
export const programasPersonalizadosService = {
  getProgramas: async (empresaId) => {
    try {
      const response = await axiosInstance.get(`/programas-personalizados`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programas personalizados:', error);
      throw error;
    }
  },
  
  getProgramaById: async (id) => {
    try {
      const response = await axiosInstance.get(`/programas-personalizados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programa personalizado:', error);
      throw error;
    }
  },
  
  createPrograma: async (programaData) => {
    try {
      const response = await axiosInstance.post(
        `/programas-personalizados`, 
        programaData
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear programa personalizado:', error);
      throw error;
    }
  },
  
  updatePrograma: async (id, programaData) => {
    try {
      const response = await axiosInstance.put(
        `/programas-personalizados/${id}`, 
        programaData
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar programa personalizado:', error);
      throw error;
    }
  },
  
  deletePrograma: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programas-personalizados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar programa personalizado:', error);
      throw error;
    }
  },
  
  generarTokensAcceso: async (programaId, pacienteIds) => {
    try {
      const response = await axiosInstance.post(
        `/programas-personalizados/${programaId}/generar-tokens`,
        { pacientesIds: pacienteIds }
      );
      return response.data;
    } catch (error) {
      console.error('Error al generar tokens de acceso:', error);
      throw error;
    }
  },
  
  getTokensByProgramaId: async (programaId) => {
    try {
      const response = await axiosInstance.get(`/programas-personalizados/${programaId}/tokens`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tokens de programa:', error);
      throw error;
    }
  },
  
  verificarToken: async (token) => {
    try {
      const response = await axiosInstance.post(`/programas-personalizados/validar-token`, { token });
      return response.data;
    } catch (error) {
      console.error('Error al verificar token:', error);
      throw error;
    }
  },
};

// Servicio para gestión de facturas
export const facturaService = {
    getFacturasByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/facturas/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener facturas de la empresa:', error);
            throw error;
        }
    },
    
    getFacturaById: async (id) => {
        try {
            return await fetchWithAuth(`/facturas/${id}`);
        } catch (error) {
            console.error('Error al obtener factura por ID:', error);
            throw error;
        }
    },
    
    createFactura: async (facturaData) => {
        try {
            return await fetchWithAuth('/facturas', 'POST', facturaData);
        } catch (error) {
            console.error('Error al crear factura:', error);
            throw error;
        }
    },
    
    updateFactura: async (id, facturaData) => {
        try {
            return await fetchWithAuth(`/facturas/${id}`, 'PUT', facturaData);
        } catch (error) {
            console.error('Error al actualizar factura:', error);
            throw error;
        }
    },
    
    deleteFactura: async (id) => {
        try {
            return await fetchWithAuth(`/facturas/${id}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar factura:', error);
            throw error;
        }
    },
    
    getFacturasByPaciente: async (pacienteId) => {
        try {
            return await fetchWithAuth(`/facturas/paciente/${pacienteId}`);
        } catch (error) {
            console.error('Error al obtener facturas del paciente:', error);
            throw error;
        }
    },
    
    generarPDF: async (facturaId) => {
        try {
            return await fetchWithAuth(`/facturas/${facturaId}/pdf`, 'GET', null, 'blob');
        } catch (error) {
            console.error('Error al generar PDF de la factura:', error);
            throw error;
        }
    },
    
    enviarPorEmail: async (facturaId) => {
        try {
            return await fetchWithAuth(`/facturas/${facturaId}/enviar`, 'POST');
        } catch (error) {
            console.error('Error al enviar factura por email:', error);
            throw error;
        }
    },
};

// Servicios relacionados con estadísticas
export const estadisticasService = {
  getEstadisticasGenerales: async (empresaId) => {
    try {
      const response = await axiosInstance.get(`/estadisticas/empresa/${empresaId}/general`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  }
};

// Servicio para gestión de salas
export const salaService = {
    getSalasByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/salas/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener salas por empresa:', error);
            throw error;
        }
    },
    
    getSalaById: async (id) => {
        try {
            return await fetchWithAuth(`/salas/${id}`);
        } catch (error) {
            console.error('Error al obtener sala por ID:', error);
            throw error;
        }
    },
    
    createSala: async (salaData) => {
        try {
            return await fetchWithAuth('/salas', 'POST', salaData);
        } catch (error) {
            console.error('Error al crear sala:', error);
            throw error;
        }
    },
    
    updateSala: async (id, salaData) => {
        try {
            return await fetchWithAuth(`/salas/${id}`, 'PUT', salaData);
        } catch (error) {
            console.error('Error al actualizar sala:', error);
            throw error;
        }
    },
    
    deleteSala: async (id) => {
        try {
            return await fetchWithAuth(`/salas/${id}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar sala:', error);
            throw error;
        }
    },
};



// Exportamos la API
export default axiosInstance; 
