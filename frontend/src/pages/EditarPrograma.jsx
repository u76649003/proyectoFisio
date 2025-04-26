import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Divider,
  FormControl,
  Autocomplete,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
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

const EditarPrograma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [programaData, setProgramaData] = useState({
    nombre: '',
    tipoPrograma: '',
    descripcion: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });

  // Verificar permisos
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (currentUser.rol !== 'DUENO' && currentUser.rol !== 'FISIOTERAPEUTA') {
      setNotification({ open: true, message: 'No tienes permisos para acceder a esta sección.', severity: 'error' });
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }
  }, [navigate]);

  // Cargar datos del programa existente
  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        setLoading(true);
        const data = await programasPersonalizadosService.getProgramaById(id);
        setProgramaData({
          nombre: data.nombre || '',
          tipoPrograma: data.tipoPrograma || '',
          descripcion: data.descripcion || ''
        });
      } catch (error) {
        console.error('Error al cargar programa:', error);
        setError('Error al cargar los datos del programa');
        setNotification({ open: true, message: 'Error al cargar los datos del programa', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrograma();
    }
  }, [id]);

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
      setSaving(true);
      setError(null);
      
      // Enviar datos al servidor
      await programasPersonalizadosService.updatePrograma(id, programaData);
      
      setSuccess(true);
      setNotification({
        open: true,
        message: 'Programa actualizado correctamente',
        severity: 'success'
      });
      
      // Redirigir al detalle del programa
      setTimeout(() => {
        navigate(`/programas-personalizados/${id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error al actualizar programa:', err);
      setError('No se pudo actualizar el programa. Inténtalo de nuevo más tarde.');
      setNotification({
        open: true,
        message: 'Error al actualizar el programa',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              color="inherit"
              onClick={() => navigate(`/programas-personalizados/${id}`)}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
              {loading ? 'Cargando...' : `Editar: ${programaData.nombre}`}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Programa actualizado correctamente. Redirigiendo...
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
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
                      disabled={saving}
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
                            disabled={saving}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      name="descripcion"
                      value={programaData.descripcion}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Describe en qué consiste este programa y para qué tipo de pacientes está indicado"
                      disabled={saving}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => navigate(`/programas-personalizados/${id}`)}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={saving}
                      >
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}
        </Box>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default EditarPrograma; 