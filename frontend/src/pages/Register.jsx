import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  IconButton,
  InputAdornment,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import logoImg from '../assets/logo.svg';
import { authService } from '../services/api';

const Logo = styled('img')({
  height: '50px',
  marginRight: '10px'
});

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '12px',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  }
}));

const steps = ['Datos personales', 'Datos de la empresa', 'Confirmación'];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    // Datos de empresa
    nombreEmpresa: '',
    cifNif: '',
    direccion: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: 'España',
    // Términos
    aceptaTerminos: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    if (step === 0) {
      // Validar datos personales
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es obligatorio';
        isValid = false;
      }
      
      if (!formData.apellidos.trim()) {
        newErrors.apellidos = 'Los apellidos son obligatorios';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El formato del email no es válido';
        isValid = false;
      }
      
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        isValid = false;
      } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos un número, una letra y un carácter especial';
        isValid = false;
      }
      
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es obligatorio';
        isValid = false;
      } else if (!/^\+?[0-9]{9,15}$/.test(formData.telefono)) {
        newErrors.telefono = 'El formato del teléfono no es válido';
        isValid = false;
      }
    } else if (step === 1) {
      // Validar datos de empresa
      if (!formData.nombreEmpresa.trim()) {
        newErrors.nombreEmpresa = 'El nombre de la empresa es obligatorio';
        isValid = false;
      }
      
      if (!formData.cifNif.trim()) {
        newErrors.cifNif = 'El CIF/NIF es obligatorio';
        isValid = false;
      } else if (!/^[A-Z0-9]{9}$/.test(formData.cifNif)) {
        newErrors.cifNif = 'El formato del CIF/NIF no es válido (9 caracteres alfanuméricos en mayúsculas)';
        isValid = false;
      }
      
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es obligatoria';
        isValid = false;
      }
      
      if (!formData.codigoPostal.trim()) {
        newErrors.codigoPostal = 'El código postal es obligatorio';
        isValid = false;
      }
      
      if (!formData.ciudad.trim()) {
        newErrors.ciudad = 'La ciudad es obligatoria';
        isValid = false;
      }
      
      if (!formData.provincia.trim()) {
        newErrors.provincia = 'La provincia es obligatoria';
        isValid = false;
      }
    } else if (step === 2) {
      // Validar términos y condiciones
      if (!formData.aceptaTerminos) {
        newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar los datos para enviar a la API según el formato esperado por el backend
      const registerData = {
        // Datos de usuario
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        // Datos de empresa
        nombreEmpresa: formData.nombreEmpresa,
        cifNif: formData.cifNif,
        direccion: formData.direccion,
        codigoPostal: formData.codigoPostal,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        pais: formData.pais
      };
      
      // Enviar los datos a la API
      const response = await authService.registerComplete(registerData);
      
      // Extraer información de la respuesta del backend
      const { token, id, rol, empresaId } = response;
      
      // Guardar información adicional si es necesario
      localStorage.setItem('empresaId', empresaId);
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: '¡Registro completado con éxito! Redirigiendo al dashboard...',
        severity: 'success'
      });
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error al registrar:', error);
      
      // Mostrar mensaje de error específico si existe
      let errorMessage = 'Ha ocurrido un error al registrar. Por favor, inténtalo de nuevo.';
      
      if (error.response) {
        if (error.response.status === 400) {
          // Error de validación o datos duplicados
          errorMessage = error.response.data || 'Los datos ingresados no son válidos. Por favor, revísalos.';
        } else if (error.response.status === 409) {
          // Conflicto (email o CIF/NIF ya existente)
          errorMessage = error.response.data || 'El email o CIF/NIF ya está registrado en el sistema.';
        } else if (error.response.status === 500) {
          // Error del servidor
          errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde.';
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="apellidos"
                name="apellidos"
                label="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="nombreEmpresa"
                name="nombreEmpresa"
                label="Nombre de la empresa"
                value={formData.nombreEmpresa}
                onChange={handleChange}
                error={!!errors.nombreEmpresa}
                helperText={errors.nombreEmpresa}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="cifNif"
                name="cifNif"
                label="CIF/NIF"
                value={formData.cifNif}
                onChange={handleChange}
                error={!!errors.cifNif}
                helperText={errors.cifNif}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="direccion"
                name="direccion"
                label="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                error={!!errors.direccion}
                helperText={errors.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="codigoPostal"
                name="codigoPostal"
                label="Código Postal"
                value={formData.codigoPostal}
                onChange={handleChange}
                error={!!errors.codigoPostal}
                helperText={errors.codigoPostal}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="ciudad"
                name="ciudad"
                label="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                error={!!errors.ciudad}
                helperText={errors.ciudad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="provincia"
                name="provincia"
                label="Provincia"
                value={formData.provincia}
                onChange={handleChange}
                error={!!errors.provincia}
                helperText={errors.provincia}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="pais"
                name="pais"
                label="País"
                value={formData.pais}
                onChange={handleChange}
                error={!!errors.pais}
                helperText={errors.pais}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen de registro
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Datos personales
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre completo
                </Typography>
                <Typography variant="body1">
                  {formData.nombre} {formData.apellidos}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {formData.email}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body1">
                  {formData.telefono}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Datos de la empresa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre de la empresa
                </Typography>
                <Typography variant="body1">
                  {formData.nombreEmpresa}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  CIF/NIF
                </Typography>
                <Typography variant="body1">
                  {formData.cifNif}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Dirección
                </Typography>
                <Typography variant="body1">
                  {formData.direccion}, {formData.codigoPostal}, {formData.ciudad}, {formData.provincia}, {formData.pais}
                </Typography>
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Acepto los términos y condiciones y la política de privacidad"
              sx={{ mt: 3 }}
            />
            {errors.aceptaTerminos && (
              <Typography color="error" variant="caption">
                {errors.aceptaTerminos}
              </Typography>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      {/* Navbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logoImg} alt="FisioAyuda Logo" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            FisioAyuda
          </Typography>
        </Box>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />}
        >
          Volver al inicio
        </Button>
      </Box>
      
      <Container maxWidth="md">
        <RegisterPaper elevation={3}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Registro de cuenta
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  size="large"
                  disabled={loading}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </form>
        </RegisterPaper>
        
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta? <Link to="/" style={{ textDecoration: 'none', color: 'primary.main' }}>Inicia sesión</Link>
          </Typography>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register; 