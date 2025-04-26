import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  FitnessCenter,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as ViewIcon
} from '@mui/icons-material';
import SidebarMenu from '../components/SidebarMenu';
import { authService, programasPersonalizadosService } from '../services/api';

const ProgramasPersonalizados = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Verificar usuario y cargar programas
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar usuario
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          console.log('===== INFORMACIÓN DE USUARIO EN PROGRAMAS PERSONALIZADOS =====');
          console.log('ID:', currentUser.id);
          console.log('Nombre:', currentUser.nombre, currentUser.apellidos);
          console.log('ROL DEL USUARIO:', currentUser.rol);
          console.log('Empresa ID:', currentUser.empresaId);
          
          // Verificar permisos
          if (currentUser.rol !== 'DUENO' && currentUser.rol !== 'FISIOTERAPEUTA') {
            setNotification({ open: true, message: 'No tienes permisos para acceder a esta sección.', severity: 'error' });
            setTimeout(() => navigate('/dashboard'), 2000);
            return;
          }
          
          // Cargar programas
          const data = await programasPersonalizadosService.getProgramas();
          setProgramas(Array.isArray(data) ? data : []);
        } else {
          setError('Debe iniciar sesión para acceder a esta página');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Error en ProgramasPersonalizados:', error);
        setError('Error al cargar los programas personalizados');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [navigate]);
  
  const handleCreateProgram = () => {
    navigate('/programas-personalizados/nuevo');
  };
  
  const handleViewProgram = (programaId) => {
    navigate(`/programas-personalizados/${programaId}`);
  };
  
  const handleEditProgram = (programaId, event) => {
    event.stopPropagation();
    navigate(`/programas-personalizados/editar/${programaId}`);
  };
  
  return (
    <SidebarMenu>
      <Container maxWidth="xl">
        <Box sx={{ mt: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
              Programas Personalizados
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              size={isMobile ? "small" : "medium"}
              onClick={handleCreateProgram}
            >
              Crear Programa
            </Button>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : (
            <Box>
              {programas.length === 0 ? (
                <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom>
                    No hay programas disponibles
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Comienza creando tu primer programa personalizado.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateProgram}
                    sx={{ mt: 2 }}
                  >
                    Crear Primer Programa
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {programas.map((programa) => (
                    <Grid item xs={12} sm={6} md={4} key={programa.id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 4
                          }
                        }}
                        onClick={() => handleViewProgram(programa.id)}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h2" gutterBottom noWrap>
                            {programa.nombre || 'Programa sin nombre'}
                          </Typography>
                          {programa.tipoPrograma && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Tipo: {programa.tipoPrograma}
                            </Typography>
                          )}
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {programa.subprogramas?.length || 0} subprograma(s)
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                          <Tooltip title="Ver programa">
                            <IconButton size="small" color="primary">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar programa">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => handleEditProgram(programa.id, e)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
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

export default ProgramasPersonalizados; 