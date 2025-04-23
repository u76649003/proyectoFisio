import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  MenuItem,
  Divider,
  FormControl,
  FormHelperText,
  Autocomplete,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  FitnessCenter
} from '@mui/icons-material';
import { programasPersonalizadosService, authService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

// Tipos de programas predefinidos
const TIPOS_PROGRAMA = [
  'ATM',
  'Bruxismo',
  'Cervicalgia',
  'Lumbalgia',
  'Hombro',
  'Cadera',
  'Rodilla',
  'Tobillo',
  'Hipopresivos',
  'Suelo Pélvico',
  'Post-parto',
  'Otro'
];

const NuevoPrograma = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [programaData, setProgramaData] = useState({
    nombre: '',
    tipoPrograma: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Cargar datos del usuario al inicio
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);
      
      // Verificar permisos
      if (currentUser.rol !== 'DUENO' && currentUser.rol !== 'FISIOTERAPEUTA') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgramaData({
      ...programaData,
      [name]: value
    });
    
    // Limpiar error al modificar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!programaData.nombre.trim()) {
      newErrors.nombre = 'El nombre del programa es obligatorio';
    }
    
    if (!programaData.tipoPrograma.trim()) {
      newErrors.tipoPrograma = 'El tipo de programa es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Enviar datos al servidor
      const createdPrograma = await programasPersonalizadosService.createPrograma(programaData);
      
      setSuccess(true);
      
      // Redirigir al detalle del programa creado después de un breve retraso
      setTimeout(() => {
        navigate(`/programas-personalizados/${createdPrograma.id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error al crear programa:', err);
      setError('No se pudo crear el programa. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/programas-personalizados')}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
              Nuevo Programa Personalizado
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Programa creado correctamente. Redirigiendo...
            </Alert>
          )}
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Información del programa
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre del programa"
                    name="nombre"
                    value={programaData.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    required
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.tipoPrograma}>
                    <Autocomplete
                      options={TIPOS_PROGRAMA}
                      value={programaData.tipoPrograma}
                      onChange={(event, newValue) => {
                        setProgramaData({
                          ...programaData,
                          tipoPrograma: newValue || ''
                        });
                        
                        if (errors.tipoPrograma) {
                          setErrors({
                            ...errors,
                            tipoPrograma: null
                          });
                        }
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tipo de programa"
                          error={!!errors.tipoPrograma}
                          helperText={errors.tipoPrograma}
                          required
                          disabled={loading}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate('/programas-personalizados')}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar y continuar'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" paragraph>
              Después de crear el programa, podrás añadir subprogramas y ejercicios.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <Card sx={{ width: 180, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    1. Crear programa
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Define el nombre y tipo
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ width: 180, textAlign: 'center', p: 2, opacity: 0.6 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    2. Añadir subprogramas
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Organiza por días o bloques
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ width: 180, textAlign: 'center', p: 2, opacity: 0.6 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    3. Añadir ejercicios
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Selecciona o crea nuevos
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Box>
      </Container>
    </SidebarMenu>
  );
};

export default NuevoPrograma; 