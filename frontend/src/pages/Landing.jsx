import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Modal, 
  TextField, 
  IconButton, 
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, CalendarMonth, Description, People, BarChart, WhatsApp, SmartToy } from '@mui/icons-material';
import logoImg from '../assets/logo.svg';
import heroImg from '../assets/fisio-hero.jpg';
import { authService } from '../services/api';

const Logo = styled('img')({
  height: '50px',
  marginRight: '10px'
});

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url(${heroImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  padding: theme.spacing(15, 2),
  position: 'relative',
  borderRadius: '0 0 20px 20px',
  marginBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(20, 2),
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
  borderRadius: '12px'
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: '#fff'
}));

const LoginModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LoginForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  outline: 'none',
  maxWidth: '450px',
  width: '100%',
  borderRadius: '12px',
}));

const Landing = () => {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('verifiedEmail') || '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const verifiedEmail = localStorage.getItem('verifiedEmail');
    if (verifiedEmail) {
      setFormData(prev => ({
        ...prev,
        email: verifiedEmail
      }));
      
      setSnackbar({
        open: true,
        message: '¡Tu cuenta ha sido verificada correctamente! Ahora puedes iniciar sesión.',
        severity: 'success'
      });
      
      localStorage.removeItem('verifiedEmail');
    }
  }, []);

  const handleLoginOpen = () => {
    setOpenLogin(true);
  };

  const handleLoginClose = () => {
    setOpenLogin(false);
    setErrors({});
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

  const validateLoginForm = () => {
    let isValid = true;
    const newErrors = {};

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Iniciando proceso de login...");
      
      // Llamar al servicio de autenticación
      const response = await authService.login(formData.email, formData.password);
      
      console.log("Respuesta de login recibida:", response);
      
      // Extraer información relevante de la respuesta
      const { token, id, rol, empresaId } = response;
      
      console.log("Token recibido:", token ? "Presente" : "Ausente");
      console.log("ID de usuario:", id);
      console.log("Rol de usuario:", rol);
      console.log("ID de empresa:", empresaId);
      
      // Guardar información adicional si es necesario
      if (empresaId) {
        localStorage.setItem('empresaId', empresaId);
        console.log("ID de empresa guardado en localStorage");
      }
      
      // Verificar que el token se guardó correctamente
      const storedToken = localStorage.getItem('token');
      console.log("Token almacenado en localStorage:", storedToken ? "Presente" : "Ausente");
      
      // Verificar que los datos de usuario se guardaron correctamente
      const storedUser = localStorage.getItem('user');
      console.log("Datos de usuario almacenados en localStorage:", storedUser ? "Presentes" : "Ausentes");
      
      // Log para depuración
      console.log('Login exitoso. Token recibido:', token?.substring(0, 15) + '...');
      console.log('Redirigiendo a Dashboard...');
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: '¡Inicio de sesión exitoso!',
        severity: 'success'
      });
      
      // Cerrar el modal
      handleLoginClose();
      
      // Usar setTimeout con 0ms para asegurar que otros procesos terminen primero
      setTimeout(() => {
        try {
          // Intentar usar el hook de navegación 
          console.log("Navegando a /dashboard usando React Router");
          navigate('/dashboard');
        } catch (navError) {
          console.error('Error en navigate:', navError);
          // Como fallback, usar window.location que siempre funciona
          console.log("Fallback: Navegando a /dashboard usando window.location");
          window.location.href = '/dashboard';
        }
      }, 0);
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Mostrar detalles del error para diagnóstico
      if (error.response) {
        console.error('Estado de respuesta:', error.response.status);
        console.error('Datos de respuesta:', error.response.data);
        
        setSnackbar({
          open: true,
          message: `Error: ${error.response.data || 'Credenciales inválidas'}`,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: `Error de conexión: ${error.message}`,
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <CalendarMonth fontSize="large" />,
      title: 'Gestión de citas online',
      description: 'Programa, modifica y cancela citas de manera sencilla. Sincroniza con calendarios externos y envía recordatorios automáticos.'
    },
    {
      icon: <Description fontSize="large" />,
      title: 'Registro de historiales clínicos',
      description: 'Mantén un registro detallado de cada paciente con diagnósticos, tratamientos y evolución. Accede a la información cuando la necesites.'
    },
    {
      icon: <People fontSize="large" />,
      title: 'Gestión de profesionales y horarios',
      description: 'Administra los horarios de tu equipo, asigna citas según disponibilidad y optimiza la ocupación de tus instalaciones.'
    },
    {
      icon: <BarChart fontSize="large" />,
      title: 'Reportes y estadísticas personalizadas',
      description: 'Analiza el rendimiento de tu clínica con informes detallados sobre ingresos, ocupación y satisfacción de pacientes.'
    },
    {
      icon: <WhatsApp fontSize="large" />,
      title: 'Mensajes automáticos de WhatsApp',
      description: 'Envía recordatorios, confirmaciones y seguimientos de forma automática a través de WhatsApp para mejorar la comunicación con tus pacientes.'
    },
    {
      icon: <SmartToy fontSize="large" />,
      title: 'Asistente con Inteligencia Artificial',
      description: 'Utiliza nuestro asistente IA para optimizar diagnósticos, sugerir tratamientos y automatizar tareas administrativas.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logoImg} alt="FisioAyuda Logo" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            FisioAyuda
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleLoginOpen} 
            sx={{ mr: 2 }}
          >
            Iniciar sesión
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/register"
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bienvenido a FisioAyuda
              </Typography>
              <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
                Optimiza la gestión de pacientes, citas y tratamientos en un solo lugar.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: '30px'
                }}
                component={Link}
                to="/register"
              >
                Iniciar ahora
              </Button>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container sx={{ mb: 10 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
          ¿Qué te ofrece nuestra plataforma?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard elevation={2}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Login Modal */}
      <LoginModal
        open={openLogin}
        onClose={handleLoginClose}
        aria-labelledby="login-modal-title"
      >
        <LoginForm elevation={4}>
          <Typography id="login-modal-title" variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Iniciar sesión
          </Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleLoginChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleLoginChange}
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
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, borderRadius: '8px', mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar sesión'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                ¿No tienes una cuenta? <Link to="/register" style={{ textDecoration: 'none', color: 'primary.main' }} onClick={handleLoginClose}>Regístrate</Link>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <Link to="/recuperar-password" style={{ textDecoration: 'none', color: 'primary.main' }} onClick={handleLoginClose}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Typography>
            </Box>
          </form>
        </LoginForm>
      </LoginModal>
      
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

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} FisioAyuda - Todos los derechos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 