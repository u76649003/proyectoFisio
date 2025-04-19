import React, { useState } from 'react';
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
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleLoginOpen = () => {
    setOpenLogin(true);
  };

  const handleLoginClose = () => {
    setOpenLogin(false);
    setErrors({});
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
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

    if (!loginData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'El formato del email no es válido';
      isValid = false;
    }

    if (!loginData.password) {
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
      // Llamar al servicio de autenticación
      const response = await authService.login(loginData.email, loginData.password);
      
      // Extraer información relevante de la respuesta
      const { token, id, rol, empresaId } = response;
      
      // Guardar información adicional si es necesario
      if (empresaId) {
        localStorage.setItem('empresaId', empresaId);
      }
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: '¡Inicio de sesión exitoso! Redirigiendo...',
        severity: 'success'
      });
      
      // Cerrar el modal
      handleLoginClose();
      
      // Decidir a dónde redirigir según el rol del usuario
      let redirectPath = '/dashboard';
      if (rol === 'ADMINISTRADOR') {
        redirectPath = '/admin/dashboard';
      } else if (rol === 'DUENO') {
        redirectPath = '/dashboard';
      } else if (rol === 'FISIOTERAPEUTA') {
        redirectPath = '/fisio/dashboard';
      } else if (rol === 'RECEPCIONISTA') {
        redirectPath = '/recepcion/dashboard';
      }
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Mostrar mensaje de error específico según el código de error
      let errorMessage = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Email o contraseña incorrectos.';
        } else if (error.response.status === 403) {
          errorMessage = 'No tienes permisos para acceder al sistema.';
        } else if (error.response.status === 500) {
          errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde.';
        } else if (error.response.data) {
          errorMessage = error.response.data;
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
              value={loginData.email}
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
              value={loginData.password}
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