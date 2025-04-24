import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { authService, pacienteService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';
import es from 'date-fns/locale/es';

const NuevoPaciente = () => {
  const navigate = useNavigate();
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    dni: '',
    fechaNacimiento: null,
    direccion: '',
    sexo: '',
    fechaAlta: new Date()
  });
  
  // Estado para control de errores y carga
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar datos del usuario actual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verificar autenticación primero
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }
        
        // Obtener usuario actual
        const user = authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        showNotification('Error al cargar datos del usuario', 'error');
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Manejar cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Manejar cambio en la fecha de nacimiento
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      fechaNacimiento: date
    });
    
    // Limpiar errores al editar
    if (errors.fechaNacimiento) {
      setErrors({
        ...errors,
        fechaNacimiento: null
      });
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos requeridos
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
    
    // Validar email (si se proporciona)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    // Validar teléfono (formato español)
    if (formData.telefono && !/^[6-9]\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9';
    }
    
    // Validar DNI (formato español)
    if (formData.dni && !/^\d{8}[A-Za-z]$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos seguidos de una letra';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Preparar datos del paciente
      const pacienteData = {
        ...formData,
        empresaId: currentUser.empresaId,
        fechaNacimiento: formData.fechaNacimiento ? formData.fechaNacimiento.toISOString().split('T')[0] : null,
        fechaAlta: formData.fechaAlta.toISOString().split('T')[0]
      };
      
      // Enviar datos al servidor
      const response = await pacienteService.createPaciente(pacienteData);
      
      showNotification('Paciente creado con éxito');
      
      // Redirigir a la página de detalles del nuevo paciente
      setTimeout(() => {
        navigate(`/pacientes/${response.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error al crear paciente:', error);
      showNotification('Error al crear el paciente: ' + (error.response?.data?.mensaje || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Volver a la lista de pacientes
  const handleCancel = () => {
    navigate('/pacientes');
  };
  
  return (
    <SidebarMenu>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Volver a Pacientes
        </Button>
        
        <Typography variant="h4" component="h1" fontWeight="bold">
          Nuevo Paciente
        </Typography>
      </Box>
      
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información personal */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
                sx={{ minWidth: '200px', width: '100%' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                required
                sx={{ minWidth: '200px', width: '100%' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ minWidth: '200px', width: '100%' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+34</InputAdornment>,
                }}
                sx={{ minWidth: '200px', width: '100%' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                error={!!errors.dni}
                helperText={errors.dni}
                sx={{ minWidth: '200px', width: '100%' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de nacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.fechaNacimiento,
                      helperText: errors.fechaNacimiento,
                      sx: { minWidth: '200px', width: '100%' }
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                sx={{ minWidth: '200px', width: '100%' }}
              >
                <MenuItem value="">
                  <em>Seleccionar</em>
                </MenuItem>
                <MenuItem value="Hombre">Hombre</MenuItem>
                <MenuItem value="Mujer">Mujer</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{ minWidth: '200px', width: '100%' }}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Guardando...
                    </>
                  ) : 'Guardar Paciente'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default NuevoPaciente; 