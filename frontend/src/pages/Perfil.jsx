import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import { authService, usuarioService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

const Perfil = () => {
  const navigate = useNavigate();
  
  // Estados
  const [usuario, setUsuario] = useState({
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    dni: '',
    rol: '',
    numeroColegiado: '',
    especialidad: '',
    empresaId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Cargar datos del usuario actual
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar autenticación primero
        if (!authService.isAuthenticated()) {
          navigate('/dashboard');
          return;
        }
        
        setLoadingData(true);
        
        try {
          const currentUser = authService.getCurrentUser();
          
          if (!currentUser) {
            throw new Error('No se pudo obtener información del usuario');
          }
          
          if (!currentUser.id) {
            throw new Error('Información de usuario incompleta');
          }
          
          // Hacemos una nueva verificación de autenticación antes de la solicitud HTTP
          if (!authService.isAuthenticated()) {
            throw new Error('La sesión ha expirado');
          }
          
          // Obtener datos completos del usuario
          try {
            const userData = await usuarioService.getUsuarioById(currentUser.id);
            
            if (!userData) {
              throw new Error('No se recibieron datos del usuario del backend');
            }
            
            setUsuario(userData);
          } catch (apiError) {
            showNotification('Error al obtener los datos actualizados del perfil', 'error');
            throw new Error('Error al obtener datos del usuario desde el backend');
          }
        } catch (innerError) {
          // Si hay un error interno pero tenemos datos básicos del usuario, al menos mostramos esos
          if (authService.getCurrentUser()) {
            setUsuario(authService.getCurrentUser());
          } else {
            throw innerError;
          }
        }
      } catch (error) {
        showNotification('Error al cargar los datos del perfil', 'error');
        
        // Si hay cualquier error crítico, redirigir al dashboard en lugar de la página principal
        // authService.logout(); // Comentamos esta línea para evitar cerrar la sesión
        navigate('/dashboard');
      } finally {
        setLoadingData(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  // Mostrar notificación
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!usuario.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!usuario.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }
    
    if (!usuario.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(usuario.email.trim())) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (usuario.telefono && !/^\+?[0-9]{9,15}$/.test(usuario.telefono.trim())) {
      newErrors.telefono = 'El formato del teléfono no es válido';
    }
    
    // Validaciones específicas según el rol
    if (usuario.rol === 'FISIOTERAPEUTA') {
      if (!usuario.numeroColegiado || !usuario.numeroColegiado.trim()) {
        newErrors.numeroColegiado = 'El número de colegiado es obligatorio para fisioterapeutas';
      }
      
      if (!usuario.especialidad || !usuario.especialidad.trim()) {
        newErrors.especialidad = 'La especialidad es obligatoria para fisioterapeutas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar datos para actualizar (sin incluir password)
      const usuarioData = {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono,
        dni: usuario.dni,
        numeroColegiado: usuario.numeroColegiado,
        especialidad: usuario.especialidad
      };
      
      // Actualizar usuario
      const updatedUsuario = await usuarioService.updateUsuario(usuario.id, usuarioData);
      
      // Actualizar estado
      setUsuario(updatedUsuario);
      
      // Actualizar información del usuario en el localStorage
      const currentUser = authService.getCurrentUser();
      const updatedCurrentUser = {
        ...currentUser,
        nombre: updatedUsuario.nombre,
        apellidos: updatedUsuario.apellidos,
        email: updatedUsuario.email
      };
      localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      
      showNotification('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      showNotification('Error al actualizar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Cambiar contraseña (se podría implementar en un componente separado)
  const handleResetPassword = () => {
    navigate('/reset-password');
  };
  
  // Renderizado condicional durante la carga
  if (loadingData) {
    return (
      <SidebarMenu>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </SidebarMenu>
    );
  }
  
  return (
    <SidebarMenu>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* Cabecera */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                mr: 2
              }}
            >
              {usuario.nombre?.charAt(0)}{usuario.apellidos?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Mi Perfil
              </Typography>
              <Chip 
                label={usuario.rol} 
                color={
                  usuario.rol === 'DUENO' ? 'primary' : 
                  usuario.rol === 'ADMINISTRADOR' ? 'secondary' :
                  usuario.rol === 'FISIOTERAPEUTA' ? 'info' : 'default'
                } 
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
          
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Volver al Dashboard
            </Button>
            
            {/* Mostrar enlace a Editar Empresa solo para DUEÑO */}
            {usuario.rol === 'DUENO' && usuario.empresaId && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<BusinessIcon />}
                component={Link}
                to={`/editar-empresa/${usuario.empresaId}`}
              >
                Editar Mi Empresa
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={usuario.nombre || ''}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={usuario.apellidos || ''}
                onChange={handleChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={usuario.email || ''}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={usuario.telefono || ''}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI/NIE"
                name="dni"
                value={usuario.dni || ''}
                onChange={handleChange}
                error={!!errors.dni}
                helperText={errors.dni}
                InputProps={{
                  readOnly: true, // El DNI no se puede editar una vez establecido
                }}
              />
            </Grid>
            
            {/* Campos específicos para fisioterapeutas */}
            {usuario.rol === 'FISIOTERAPEUTA' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de Colegiado"
                    name="numeroColegiado"
                    value={usuario.numeroColegiado || ''}
                    onChange={handleChange}
                    error={!!errors.numeroColegiado}
                    helperText={errors.numeroColegiado}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Especialidad"
                    name="especialidad"
                    value={usuario.especialidad || ''}
                    onChange={handleChange}
                    error={!!errors.especialidad}
                    helperText={errors.especialidad}
                    required
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetPassword}
                >
                  Cambiar Contraseña
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default Perfil; 