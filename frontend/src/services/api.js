import axios from 'axios';

// Crear instancia de Axios con configuración base
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://proyectofisio.onrender.com',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    timeout: 30000, // 30 segundos para dar más tiempo al backend
});

// Interceptor para las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar que el token no esté expirado
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000; // Convertir a milisegundos
          if (Date.now() >= exp) {
            console.error('Token expirado');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lastAuthentication');
            throw new Error('Token expirado');
          }
        }
      } catch (e) {
        console.error('Error al verificar token:', e);
      }
      
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('=== INTERCEPTOR REQUEST ===');
      console.log('URL:', config.url);
      console.log('Headers:', config.headers);
    } else {
      console.warn('Solicitud sin token de autenticación:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('=== INTERCEPTOR RESPONSE SUCCESS ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    return response;
  },
  (error) => {
    console.log('=== INTERCEPTOR RESPONSE ERROR ===');
    if (error.response) {
      console.error('URL:', error.config.url);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('Sesión expirada o no autorizada');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastAuthentication');
        
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register') &&
            !window.location.pathname === '/') {
          window.location.href = '/';
        }
      } else if (error.response.status === 403) {
        console.error('Acceso prohibido');
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          console.error('Usuario actual:', user);
          console.error('Rol:', user.rol);
          console.error('Empresa ID:', user.empresaId);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Función auxiliar para realizar peticiones con autenticación
const fetchWithAuth = async (url, method = 'GET', data = null, options = {}) => {
    try {
        // Verificar que hay un token disponible
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No hay token para realizar la solicitud autenticada:', url);
            // NO redirigimos automáticamente
            throw new Error('No hay token de autenticación');
        }
        
        const config = {
            ...options,
            method,
            url,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        };

        if (data) {
            config.data = data;
        }

        console.log(`Enviando solicitud ${method} a ${url}...`);
        const response = await axiosInstance(config);
        console.log(`Respuesta recibida de ${url}:`, response.status);
        return response.data;
    } catch (error) {
        console.error(`Error en ${method} ${url}:`, error);
        
        // Contador de intentos para evitar ciclos infinitos
        const retryCount = options.retryCount || 0;
        
        // Si es un 403, propagamos el error sin intentar refrescar la sesión
        // ya que probablemente es un problema de permisos, no de autenticación
        if (error.response && error.response.status === 403) {
            console.log('Error 403: Acceso prohibido. Posible problema de permisos.');
            throw error;
        }
        
        // Solo intentamos refrescar la sesión para errores 401 (no autenticado)
        if (error.response && error.response.status === 401 && retryCount < 1) {
            console.log('Intentando refrescar la sesión...');
            try {
                const refreshed = await authService.refreshSession();
                if (refreshed) {
                    // Reintentar la solicitud original
                    console.log('Sesión refrescada, reintentando solicitud original...');
                    return fetchWithAuth(url, method, data, {...options, retryCount: retryCount + 1});
                }
                // No hacemos redirección automática
            } catch (refreshError) {
                console.error('Error al refrescar la sesión:', refreshError);
                // No hacemos redirección automática
            }
        } else if (error.response && error.response.status === 401 && retryCount >= 1) {
            // Si ya intentamos refrescar la sesión, cerramos sesión pero NO redirigimos automáticamente
            authService.logout();
        }
        
        throw error;
    }
};
  
// Servicio de autenticación
const authService = {
    login: async (credenciales) => {
        try {
            console.log('Enviando solicitud de login...');
            const response = await axiosInstance.post('/auth/login', credenciales);
            console.log('Respuesta login recibida:', response.data);
            
            if (response.data && response.data.token) {
                // Guardar token
                localStorage.setItem('token', response.data.token);
                
                // La estructura del usuario puede variar, así que intentamos ser flexibles
                let userData = null;
                if (response.data.id) {
                    // El usuario viene directamente en la respuesta
                    userData = response.data;
                } else if (response.data.usuario) {
                    // El usuario viene en un campo usuario
                    userData = response.data.usuario;
                }
                
                if (userData) {
                    console.log('Guardando datos de usuario:', userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    // Guardar timestamp de autenticación
                    localStorage.setItem('lastAuthentication', Date.now().toString());
                    
                    // Forzar un valor para evitar el ciclo de validación inmediato
                    localStorage.setItem('tokenValidated', 'true');
                    
                    // Esperar un poco para asegurar que los datos se guarden antes de continuar
                    await new Promise(resolve => setTimeout(resolve, 100));
                } else {
                    console.error('Datos de usuario incompletos en la respuesta de login', response.data);
                }
            } else {
                console.error('Respuesta de login incompleta o sin token', response.data);
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
        try {
    const user = localStorage.getItem('user');
            if (!user) {
                return null;
            }
            return JSON.parse(user);
        } catch (error) {
            console.error('Error al obtener usuario actual:', error);
            // Si hay un error al analizar el JSON, limpiar el almacenamiento
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('lastAuthentication');
            return null;
        }
  },
  
  isAuthenticated: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }
            
            // Verificar que exista información del usuario
            const user = localStorage.getItem('user');
            if (!user) {
                return false;
            }
            
            // Opcional: Verificar que el token no ha expirado basado en alguna lógica
            // Por ejemplo, si guardamos la fecha de última autenticación
            const lastAuth = localStorage.getItem('lastAuthentication');
            if (lastAuth) {
                const now = Date.now();
                const lastAuthTime = parseInt(lastAuth, 10);
                // Si han pasado más de 24 horas, considerar la sesión expirada
                const MAX_SESSION_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
                if (now - lastAuthTime > MAX_SESSION_TIME) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            return false;
        }
    },
    
    getToken: () => {
        return localStorage.getItem('token');
    },
    
    validateToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No hay token para validar');
                return { valid: false, message: 'No token available' };
            }
            
            // Verificar si se acaba de iniciar sesión (hace menos de 3 segundos)
            const tokenValidated = localStorage.getItem('tokenValidated');
            if (tokenValidated === 'true') {
                console.log('Token ya validado en login reciente, omitiendo validación adicional');
                // Limpiamos esta marca después de usarla
                localStorage.removeItem('tokenValidated');
                return { valid: true, message: 'Token reciente asumido como válido' };
            }
            
            console.log('Validando token con el backend...');
            // Intentar validar el token con el servidor con timeout reducido
            const response = await axiosInstance.get('/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 5000 // 5 segundos de timeout para evitar esperas largas
            });
            console.log('Respuesta de validación:', response.data);
            
            return { valid: true, data: response.data };
        } catch (error) {
            console.error('Error validando token:', error);
            
            // Si es un error 403 (Forbidden), consideramos el token como válido
            // porque 403 generalmente significa que el token es válido pero no tiene permisos
            // para acceder a ese recurso específico
            if (error.response && error.response.status === 403) {
                console.log('Permiso denegado (403) pero token podría ser válido, continuando sesión');
                return { valid: true, message: 'Token válido pero con permisos insuficientes' };
            }
            
            // Solo para errores 401 (Unauthorized) cerramos sesión
            if (error.response && error.response.status === 401) {
                console.log('Token no autorizado (401), cerrando sesión');
                authService.logout();
                return { valid: false, message: 'Token inválido o expirado' };
            }
            
            // Para cualquier otro error, asumimos que el token podría ser válido
            // para evitar cerrar sesión debido a errores temporales de red
            return { valid: true, message: 'Error de conexión al validar token' };
        }
    },
    
    refreshSession: async () => {
        try {
            // Actualizar timestamp de última autenticación
            localStorage.setItem('lastAuthentication', Date.now().toString());
            
            // Verificar que todos los datos necesarios existen
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (!token || !user) {
                console.error('Datos de sesión incompletos, cerrando sesión');
                authService.logout();
                // NO redirigimos automáticamente
                return false;
            }
            
            // Validar el token con el backend sin usar fetchWithAuth para evitar bucles
            try {
                // Usar un timeout más corto para la validación para evitar esperas largas
                const response = await axiosInstance.get('/auth/validate', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 5000 // timeout de 5 segundos para esta solicitud específica
                });
                console.log('Sesión refrescada exitosamente');
                return true;
            } catch (validationError) {
                console.error('Error validando token durante el refresco:', validationError);
                
                // Si es error 403 (Forbidden), consideramos la sesión como válida
                // porque probablemente tiene token válido pero sin permisos para ese endpoint
                if (validationError.response && validationError.response.status === 403) {
                    console.log('Error 403 en refresco: el token podría ser válido pero sin permisos suficientes');
                    return true; // Continuamos la sesión
                }
                
                // Solo para errores 401 (Unauthorized) cerramos sesión
                if (validationError.response && validationError.response.status === 401) {
                    console.log('Token no autorizado (401), cerrando sesión');
                    authService.logout();
                    return false;
                }
                
                // Para otros errores, como problemas de red, mantenemos la sesión
                console.log('Error de conexión durante refresco, manteniendo sesión');
                return true;
            }
        } catch (error) {
            console.error('Error al refrescar la sesión:', error);
            // Solo cerramos sesión si hay un error crítico (no de conexión)
            if (error.response) {
                authService.logout();
                return false;
            }
            // Para errores de conexión, mantener la sesión
            return true;
        }
    },
};

// Servicio para gestión de la agenda
const agendaService = {
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
            
            // Si es un error 403, devolvemos un array vacío en lugar de propagar el error
            // Esto permitirá que el Dashboard funcione aunque no se puedan cargar las citas
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar agenda - Devolviendo lista vacía');
                return []; // Devolvemos array vacío
            }
            
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
const pacienteService = {
    getPacientes: async () => {
        try {
            return await fetchWithAuth('/pacientes');
        } catch (error) {
            console.error('Error al obtener pacientes:', error);
            
            // Si es un error 403, devolvemos un array vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar pacientes - Devolviendo lista vacía');
                return []; // Devolvemos array vacío
            }
            
            throw error;
        }
    },
    
    getPacientesByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/pacientes/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener pacientes por empresa:', error);
            
            // Si es un error 403, devolvemos un array vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar pacientes por empresa - Devolviendo lista vacía');
                return []; // Devolvemos array vacío
            }
            
            throw error;
        }
    },
    
    getPacienteById: async (id) => {
        try {
            return await fetchWithAuth(`/pacientes/${id}`);
        } catch (error) {
            console.error('Error al obtener paciente por ID:', error);
            
            // Si es un error 403, devolvemos un objeto vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar paciente - Devolviendo objeto vacío');
                return {}; // Devolvemos objeto vacío
            }
            
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
const usuarioService = {
    getUsuariosByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/usuarios/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener usuarios por empresa:', error);
            
            // Si es un error 403, devolvemos un array vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar usuarios - Devolviendo lista vacía');
                return []; // Devolvemos array vacío
            }
            
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
const empresaService = {
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
const bonoPacienteService = {
    getBonosByPaciente: async (pacienteId) => {
        try {
            return await fetchWithAuth(`/bonos/paciente/${pacienteId}`);
        } catch (error) {
            console.error('Error al obtener bonos del paciente:', error);
            
            // Si es un error 403, devolvemos un array vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar bonos del paciente - Devolviendo lista vacía');
                return []; // Devolvemos array vacío
            }
            
            throw error;
        }
    },
    
    // Alias para mantener compatibilidad con el componente BonosList
    getBonosByPacienteId: async (pacienteId) => {
        return bonoPacienteService.getBonosByPaciente(pacienteId);
    },
    
    getBonoById: async (id) => {
        try {
            return await fetchWithAuth(`/bonos/${id}`);
        } catch (error) {
            console.error('Error al obtener bono por ID:', error);
            
            // Si es un error 403, devolvemos un objeto vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar bono - Devolviendo objeto vacío');
                return {}; // Devolvemos objeto vacío
            }
            
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
    
    createBonoPaciente: async (pacienteId, bonoData) => {
        try {
            // Aseguramos que el pacienteId esté en los datos
            const datos = { ...bonoData, pacienteId };
            return await fetchWithAuth('/bonos', 'POST', datos);
        } catch (error) {
            console.error('Error al crear bono para el paciente:', error);
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
    
    updateBonoPaciente: async (pacienteId, bonoId, bonoData) => {
        try {
            // Aseguramos que el pacienteId esté en los datos
            const datos = { ...bonoData, pacienteId };
            return await fetchWithAuth(`/bonos/${bonoId}`, 'PUT', datos);
        } catch (error) {
            console.error('Error al actualizar bono del paciente:', error);
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
    
    deleteBonoPaciente: async (pacienteId, bonoId) => {
        try {
            return await fetchWithAuth(`/bonos/${bonoId}`, 'DELETE');
        } catch (error) {
            console.error('Error al eliminar bono del paciente:', error);
            throw error;
        }
    },
    
    getBonosByEmpresa: async (empresaId) => {
        try {
            return await fetchWithAuth(`/bonos/empresa/${empresaId}`);
        } catch (error) {
            console.error('Error al obtener bonos por empresa:', error);
            
            // Si es un error 403, devolvemos un array vacío
            if (error.response && error.response.status === 403) {
                console.log('Error 403 al cargar bonos por empresa - Devolviendo lista vacía');
                return []; // Devolvemos array vacío
            }
            
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
const productoService = {
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
const servicioService = {
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
const programasPersonalizadosService = {
  getProgramas: async () => {
    try {
      console.log('Intentando obtener programas personalizados...');
      
      // Verificar autenticación antes de hacer la petición
      if (!localStorage.getItem('token')) {
        console.error('No hay token disponible para obtener programas personalizados');
        return [];
      }
      
      // Obtener token de autenticación
      const token = localStorage.getItem('token');
      
      // Obtener URL base
      const baseURL = axiosInstance.defaults.baseURL || 'https://proyectofisio.onrender.com';
      
      // La URL no necesita incluir el ID de empresa porque el backend ya filtra
      // por la empresa del usuario autenticado basado en el token JWT
      const url = `${baseURL}/programas-personalizados`;
      console.log('URL completa de solicitud:', url);
      
      // Hacer la petición con el token de autenticación
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Respuesta de programas personalizados recibida:', response.data);
      
      // La respuesta ahora contiene información más detallada
      return response.data;
    } catch (error) {
      console.error('Error al obtener programas personalizados:', error);
      
      // Si es un error 403, devolvemos un array vacío
      if (error.response && error.response.status === 403) {
        console.log('Error 403 al cargar programas personalizados - Devolviendo lista vacía');
        return []; // Devolvemos array vacío
      }
      
      // Para cualquier otro error, también devolvemos array vacío para evitar fallos en la UI
      console.log('Error general al cargar programas - Devolviendo lista vacía');
      return [];
    }
  },
  
  // Alias para mantener compatibilidad con el componente ProgramasPersonalizados
  getAllProgramas: async () => {
    console.log('Llamando a getAllProgramas...');
    return programasPersonalizadosService.getProgramas();
  },

  getProgramaById: async (id) => {
    try {
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${id}`;
      console.log('URL completa de solicitud getProgramaById:', url);
      
      // Usar axios directamente con la URL completa
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Respuesta de programa personalizado recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programa personalizado:', error);
      
      // Si es un error 403, devolvemos un objeto vacío
      if (error.response && error.response.status === 403) {
        console.log('Error 403 al cargar programa personalizado - Devolviendo objeto vacío');
        return {}; // Devolvemos objeto vacío
      }
      
      // Para cualquier otro error, también devolvemos objeto vacío
      return {};
    }
  },

  createPrograma: async (programaData) => {
    try {
      // Verificar token y datos del usuario
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('=== DEPURACIÓN DE TOKEN Y USUARIO ===');
      console.log('Token presente:', token ? 'Sí' : 'No');
      console.log('Datos de usuario presentes:', userStr ? 'Sí' : 'No');
      
      if (!userStr) {
        throw new Error('No hay datos de usuario disponibles');
      }
      
      const user = JSON.parse(userStr);
      console.log('Datos del usuario:', user);
      console.log('Rol del usuario:', user.rol);
      console.log('ID de empresa:', user.empresaId);
      
      if (!user.empresaId) {
        throw new Error('No se encontró el ID de empresa del usuario');
      }
      
      // Asegurar que el programa incluye el ID de empresa
      const programaConEmpresa = {
        ...programaData,
        empresaId: user.empresaId
      };
      
      console.log('=== DATOS DEL PROGRAMA ===');
      console.log('Programa a crear:', programaConEmpresa);
      
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados`;
      console.log('URL completa para crear programa:', url);
      
      // Configurar headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log('Headers de la solicitud:', headers);
      
      // Usar axios directamente con la URL completa
      const response = await axios.post(url, programaConEmpresa, {
        headers,
        timeout: 30000
      });
      
      console.log('Programa creado correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear programa personalizado:', error);
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
        console.error('Headers de la respuesta:', error.response.headers);
        console.error('Status de la respuesta:', error.response.status);
      }
      throw error;
    }
  },
  
  updatePrograma: async (id, programaData) => {
    try {
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${id}`;
      console.log('URL completa para actualizar programa:', url);
      
      // Usar axios directamente con la URL completa
      const response = await axios.put(url, programaData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Programa actualizado correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar programa personalizado:', error);
      throw error;
    }
  },
  
  deletePrograma: async (id) => {
    try {
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${id}`;
      console.log('URL completa para eliminar programa:', url);
      
      // Usar axios directamente con la URL completa
      const response = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Programa eliminado correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar programa personalizado:', error);
      throw error;
    }
  },
  
  generarTokensAcceso: async (programaId, pacienteIds) => {
    try {
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${programaId}/generar-tokens`;
      console.log('URL completa para generar tokens:', url);
      
      // Usar axios directamente con la URL completa
      const response = await axios.post(url, { pacientesIds: pacienteIds }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Tokens generados correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al generar tokens de acceso:', error);
      throw error;
    }
  },

  getTokensByProgramaId: async (programaId) => {
    try {
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${programaId}/tokens`;
      console.log('URL completa para obtener tokens:', url);
      
      // Usar axios directamente con la URL completa
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Tokens obtenidos correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tokens de programa:', error);
      throw error;
    }
  },
  
  verificarToken: async (token) => {
    try {
      // Forzar URL absoluta para evitar problemas de proxy
      const url = `${axiosInstance.defaults.baseURL}/acceso-programa/validar`;
      console.log('URL completa para verificar token:', url);
      
      // Usar axios directamente con la URL completa
      const response = await axios.post(url, { token }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('Token verificado correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al verificar token:', error);
      throw error;
    }
  },

  // Subprogramas
  getSubprogramasByProgramaId: async (programaId) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${programaId}/subprogramas`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener subprogramas:', error);
      return [];
    }
  },
  
  getSubprogramaById: async (subprogramaId) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/subprogramas/${subprogramaId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener subprograma:', error);
      throw error;
    }
  },
  
  createSubprograma: async (programaId, subprogramaData) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/${programaId}/subprogramas`;
      
      const response = await axios.post(url, subprogramaData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al crear subprograma:', error);
      throw error;
    }
  },
  
  updateSubprograma: async (subprogramaId, subprogramaData) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/subprogramas/${subprogramaId}`;
      
      const response = await axios.put(url, subprogramaData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar subprograma:', error);
      throw error;
    }
  },
  
  deleteSubprograma: async (subprogramaId) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/subprogramas/${subprogramaId}`;
      
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar subprograma:', error);
      throw error;
    }
  },
  
  // Nuevos métodos para multimedia
  uploadSubprogramaVideo: async (subprogramaId, formData) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/subprogramas/${subprogramaId}/video`;
      
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al subir video:', error);
      throw error;
    }
  },
  
  uploadSubprogramaImagenes: async (subprogramaId, formData) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/programas-personalizados/subprogramas/${subprogramaId}/imagenes`;
      
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      throw error;
    }
  },

  // Acceso externo a programa para pacientes
  validarTokenPrograma: async (token) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/acceso-programa/validar`;
      
      const response = await axios.post(url, { token });
      
      return response.data;
    } catch (error) {
      console.error('Error al validar token:', error);
      throw error;
    }
  },
  
  enviarComentario: async (comentario) => {
    try {
      const url = `${axiosInstance.defaults.baseURL}/acceso-programa/comentario`;
      
      const response = await axios.post(url, comentario);
      
      return response.data;
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      throw error;
    }
  }
};

// Servicio para gestión de facturas
const facturaService = {
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
const estadisticasService = {
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
const salaService = {
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

// Exportamos todos los servicios juntos
export {
    authService,
    usuarioService,
    agendaService,
    pacienteService,
    empresaService,
    servicioService,
    productoService,
    bonoPacienteService,
    salaService,
    programasPersonalizadosService
};

export default axiosInstance; 
