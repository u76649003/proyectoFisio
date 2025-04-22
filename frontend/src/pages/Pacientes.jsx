import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService, pacienteService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

const Pacientes = () => {
  const navigate = useNavigate();
  
  // Estado para almacenar la lista de pacientes
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Cargar pacientes al montar el componente
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        // Verificar autenticación primero
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }
        
        // Obtener usuario actual
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.empresaId) {
          throw new Error('No se pudo obtener información del usuario o de la empresa');
        }
        
        // Cargar pacientes por empresa
        const data = await pacienteService.getPacientesByEmpresa(currentUser.empresaId);
        setPacientes(data);
        setFilteredPacientes(data);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPacientes();
  }, [navigate]);
  
  // Manejar búsqueda
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredPacientes(pacientes);
      return;
    }
    
    const filtered = pacientes.filter(paciente => 
      paciente.nombre.toLowerCase().includes(term) || 
      paciente.apellidos.toLowerCase().includes(term) ||
      paciente.email.toLowerCase().includes(term) ||
      paciente.telefono.includes(term)
    );
    
    setFilteredPacientes(filtered);
  };
  
  // Navegar a la página de detalles de paciente
  const handleViewPatient = (id) => {
    navigate(`/pacientes/${id}`);
  };
  
  // Navegar a la página de nuevo paciente
  const handleNewPatient = () => {
    navigate('/pacientes/nuevo');
  };
  
  return (
    <SidebarMenu>
      {/* Header con título y botones */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Pacientes
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleNewPatient}
        >
          Nuevo Paciente
        </Button>
      </Box>
      
      {/* Buscador */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar pacientes por nombre, email o teléfono..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Tabla de pacientes */}
      <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Alta</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Cargando pacientes...</TableCell>
                </TableRow>
              ) : filteredPacientes.length > 0 ? (
                filteredPacientes.map((paciente) => (
                  <TableRow 
                    key={paciente.id} 
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={() => handleViewPatient(paciente.id)}
                  >
                    <TableCell>
                      {paciente.nombre} {paciente.apellidos}
                    </TableCell>
                    <TableCell>{paciente.email}</TableCell>
                    <TableCell>{paciente.telefono}</TableCell>
                    <TableCell>{new Date(paciente.fechaAlta).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="text" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPatient(paciente.id);
                        }}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {searchTerm ? 'No se encontraron pacientes con esos criterios' : 'No hay pacientes registrados'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SidebarMenu>
  );
};

export default Pacientes; 