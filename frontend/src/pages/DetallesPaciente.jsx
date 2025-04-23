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
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { pacienteService, authService } from '../services/api';
import { BonosList } from '../components';
import SidebarMenu from '../components/SidebarMenu';

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
        
        {/* Pestaña de Bonos */}
        <TabPanel value={tabValue} index={2}>
          <BonosList pacienteId={paciente.id} />
        </TabPanel>
      </Paper>
    </SidebarMenu>
  );
};

export default DetallesPaciente; 