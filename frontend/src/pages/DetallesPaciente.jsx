import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  CircularProgress,
  Button,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  pacienteService, 
  authService, 
  programasPersonalizadosService 
} from '../services/api';
import { BonosList } from '../components';
import SidebarMenu from '../components/SidebarMenu';
import { 
  ExpandMore as ExpandMoreIcon,
  FitnessCenter,
  Comment as CommentIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

// Componente TabPanel para el contenido de cada pestaña
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`paciente-tabpanel-${index}`}
      aria-labelledby={`paciente-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DetallesPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Nuevos estados para programas y comentarios
  const [programasCompartidos, setProgramasCompartidos] = useState([]);
  const [loadingProgramas, setLoadingProgramas] = useState(false);
  
  // Cargar datos del paciente
  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }
        
        // Obtener usuario actual
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        // Cargar datos del paciente
        const data = await pacienteService.getPacienteById(id);
        setPaciente(data);
        
        // Cargar programas compartidos y comentarios
        setLoadingProgramas(true);
        try {
          // Este endpoint debería devolver los programas compartidos con el paciente
          // y los comentarios asociados
          const programasResponse = await pacienteService.getProgramasCompartidosConPaciente(id);
          setProgramasCompartidos(programasResponse || []);
        } catch (programasError) {
          console.error('Error al cargar programas compartidos:', programasError);
        } finally {
          setLoadingProgramas(false);
        }
      } catch (error) {
        console.error('Error al cargar paciente:', error);
        setError('No se pudo cargar la información del paciente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaciente();
  }, [id, navigate]);
  
  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Volver a la lista de pacientes
  const handleBack = () => {
    navigate('/pacientes');
  };
  
  // Renderizar sección de programas compartidos
  const renderProgramasCompartidos = () => {
    if (loadingProgramas) {
      return <CircularProgress size={24} />;
    }
    
    if (programasCompartidos.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No hay programas compartidos con este paciente todavía.
        </Alert>
      );
    }
    
    return (
      <>
        {programasCompartidos.map(programa => (
          <Accordion key={programa.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`programa-${programa.id}-content`}
              id={`programa-${programa.id}-header`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {programa.nombre}
                </Typography>
                <Chip 
                  label={`Compartido: ${new Date(programa.fechaCompartido).toLocaleDateString()}`}
                  size="small"
                  sx={{ ml: 2 }}
                  icon={<CalendarIcon fontSize="small" />}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {programa.descripcion || 'Sin descripción'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Comentarios del paciente:
              </Typography>
              
              {programa.comentarios && programa.comentarios.length > 0 ? (
                <List>
                  {programa.comentarios.map(comentario => (
                    <ListItem 
                      key={comentario.id}
                      sx={{ 
                        bgcolor: 'background.default', 
                        mb: 1, 
                        borderRadius: 1,
                        border: comentario.leido ? '1px solid #e0e0e0' : '1px solid #c8e6c9'
                      }}
                    >
                      <ListItemIcon>
                        <CommentIcon color={comentario.leido ? 'action' : 'success'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={comentario.leido ? 'normal' : 'bold'}>
                              Sobre: <strong>{comentario.subprogramaNombre}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comentario.fechaCreacion).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 1,
                              fontStyle: 'italic',
                              color: 'text.primary'
                            }}
                          >
                            "{comentario.contenido}"
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  El paciente no ha dejado comentarios todavía.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    );
  };
  
  if (loading) {
    return (
      <SidebarMenu>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </SidebarMenu>
    );
  }
  
  if (error) {
    return (
      <SidebarMenu>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Volver a Pacientes
        </Button>
      </SidebarMenu>
    );
  }
  
  if (!paciente) {
    return (
      <SidebarMenu>
        <Alert severity="info" sx={{ mb: 3 }}>
          No se encontró el paciente solicitado.
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Volver a Pacientes
        </Button>
      </SidebarMenu>
    );
  }
  
  return (
    <SidebarMenu>
      {/* Cabecera */}
      <Box sx={{ mb: 4 }}>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Volver a Pacientes
        </Button>
        
        <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
          {paciente.nombre} {paciente.apellidos}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Alta: {new Date(paciente.fechaAlta).toLocaleDateString()}
        </Typography>
      </Box>
      
      {/* Tarjeta con pestañas */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Información" />
          <Tab label="Historial" />
          <Tab label="Programas" />
          <Tab label="Bonos" />
        </Tabs>
        
        {/* Pestaña de Información */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Información Personal
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" component="div">
                  <strong>Email:</strong> {paciente.email || 'No disponible'}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Teléfono:</strong> {paciente.telefono || 'No disponible'}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>DNI:</strong> {paciente.dni || 'No disponible'}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Fecha de Nacimiento:</strong> {paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString() : 'No disponible'}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Dirección
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" component="div">
                  {paciente.direccion || 'No disponible'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Pestaña de Historial Clínico */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" color="text.secondary">
            Esta sección mostrará el historial clínico del paciente.
          </Typography>
        </TabPanel>
        
        {/* Nueva pestaña de Programas Compartidos */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Programas Compartidos con el Paciente
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Aquí se muestran los programas personalizados que han sido compartidos con el paciente y sus comentarios.
          </Typography>
          
          {renderProgramasCompartidos()}
        </TabPanel>
        
        {/* Pestaña de Bonos */}
        <TabPanel value={tabValue} index={3}>
          <BonosList pacienteId={id} />
        </TabPanel>
      </Paper>
    </SidebarMenu>
  );
};

export default DetallesPaciente; 