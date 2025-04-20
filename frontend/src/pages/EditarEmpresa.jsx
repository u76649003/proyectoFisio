import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { empresaService } from '../services/api';
import { LogoUploader } from '../components';

const EditarEmpresa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [empresa, setEmpresa] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    nif: '',
    web: '',
    logoUrl: ''
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Cargar datos de la empresa
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setLoadingData(true);
        const data = await empresaService.getEmpresaById(id);
        setEmpresa(data);
      } catch (error) {
        showNotification('Error al cargar datos de la empresa', 'error');
        console.error('Error cargando empresa:', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchEmpresa();
  }, [id]);
  
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
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };
  
  // Manejar cambio de logo
  const handleLogoChange = (file, error) => {
    setLogoFile(file);
    
    if (error) {
      setErrors({
        ...errors,
        logo: error
      });
    } else {
      // Limpiar error si existía
      const newErrors = { ...errors };
      delete newErrors.logo;
      setErrors(newErrors);
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!empresa.nombre.trim()) {
      newErrors.nombre = 'El nombre de la empresa es obligatorio';
    }
    
    if (!empresa.nif.trim()) {
      newErrors.nif = 'El NIF/CIF es obligatorio';
    } else if (!/^[A-Z0-9]{9}$/.test(empresa.nif.trim())) {
      newErrors.nif = 'El formato del NIF/CIF no es válido';
    }
    
    if (!empresa.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(empresa.email.trim())) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (!empresa.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\+?[0-9]{9,15}$/.test(empresa.telefono.trim())) {
      newErrors.telefono = 'El formato del teléfono no es válido';
    }
    
    if (empresa.web && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(empresa.web)) {
      newErrors.web = 'El formato de la URL no es válido';
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
      let updatedEmpresa;
      
      if (logoFile) {
        // Si hay un nuevo logo, usar el método que incluye el logo
        updatedEmpresa = await empresaService.updateEmpresaConLogo(id, empresa, logoFile);
      } else {
        // Si no hay nuevo logo, usar el método normal
        updatedEmpresa = await empresaService.updateEmpresa(id, empresa);
      }
      
      setEmpresa(updatedEmpresa);
      setLogoFile(null);
      showNotification('Empresa actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando empresa:', error);
      showNotification('Error al actualizar la empresa', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Actualizar solo el logo
  const handleUpdateOnlyLogo = async () => {
    if (!logoFile) {
      return;
    }
    
    setLoading(true);
    
    try {
      const logoUrl = await empresaService.updateLogoEmpresa(id, logoFile);
      
      // Actualizar el estado con la nueva URL
      setEmpresa({
        ...empresa,
        logoUrl
      });
      
      setLogoFile(null);
      showNotification('Logo actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando logo:', error);
      showNotification('Error al actualizar el logo', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingData) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            Editar Empresa
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Volver
          </Button>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de la empresa"
                name="nombre"
                value={empresa.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIF/CIF"
                name="nif"
                value={empresa.nif}
                onChange={handleChange}
                error={!!errors.nif}
                helperText={errors.nif}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={empresa.direccion}
                onChange={handleChange}
                error={!!errors.direccion}
                helperText={errors.direccion}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={empresa.email}
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
                value={empresa.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sitio Web"
                name="web"
                value={empresa.web || ''}
                onChange={handleChange}
                error={!!errors.web}
                helperText={errors.web || 'Ej: https://www.miempresa.com'}
              />
            </Grid>
            
            <Grid item xs={12}>
              <LogoUploader
                onChange={handleLogoChange}
                error={errors.logo}
                defaultPreview={empresa.logoUrl}
                name="logo"
              />
              
              {logoFile && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleUpdateOnlyLogo}
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    Actualizar solo el logo
                  </Button>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditarEmpresa; 