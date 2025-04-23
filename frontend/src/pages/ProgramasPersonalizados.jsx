import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  FitnessCenter,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { programasPersonalizadosService, authService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

const ProgramasPersonalizados = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [programas, setProgramas] = useState([]);
  const [filteredProgramas, setFilteredProgramas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programaToDelete, setProgramaToDelete] = useState(null);
  const [tipos, setTipos] = useState([]);
  
  // Cargar datos del usuario al inicio
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  // Cargar programas al inicializar el componente
  useEffect(() => {
    const loadProgramas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await programasPersonalizadosService.getAllProgramas();
        setProgramas(data);
        setFilteredProgramas(data);
        
        // Extraer tipos únicos para el filtro
        const tiposUnicos = [...new Set(data.map(p => p.tipoPrograma))].filter(Boolean);
        setTipos(tiposUnicos);
      } catch (err) {
        console.error('Error al cargar programas:', err);
        setError('No se pudieron cargar los programas. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProgramas();
  }, []);
  
  // Función para filtrar programas
  useEffect(() => {
    let result = programas;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(
        programa => programa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por tipo
    if (filterTipo) {
      result = result.filter(
        programa => programa.tipoPrograma === filterTipo
      );
    }
    
    setFilteredProgramas(result);
  }, [searchTerm, filterTipo, programas]);
  
  // Manejadores para filtros
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleFilterChange = (tipo) => {
    if (filterTipo === tipo) {
      setFilterTipo(''); // Quitar filtro si se hace clic en el mismo
    } else {
      setFilterTipo(tipo);
    }
  };
  
  // Manejadores para CRUD
  const handleCreatePrograma = () => {
    navigate('/programas-personalizados/nuevo');
  };
  
  const handleEditPrograma = (id) => {
    navigate(`/programas-personalizados/editar/${id}`);
  };
  
  const handleViewPrograma = (id) => {
    navigate(`/programas-personalizados/${id}`);
  };
  
  const handleSharePrograma = (id) => {
    navigate(`/programas-personalizados/${id}/compartir`);
  };
  
  const handleDeletePrograma = (programa) => {
    setProgramaToDelete(programa);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeletePrograma = async () => {
    if (!programaToDelete) return;
    
    try {
      await programasPersonalizadosService.deletePrograma(programaToDelete.id);
      
      // Actualizar la lista de programas
      setProgramas(prevProgramas => 
        prevProgramas.filter(p => p.id !== programaToDelete.id)
      );
      
      // Cerrar el diálogo
      setDeleteDialogOpen(false);
      setProgramaToDelete(null);
    } catch (err) {
      console.error('Error al eliminar programa:', err);
      setError('No se pudo eliminar el programa. Inténtalo de nuevo más tarde.');
      setDeleteDialogOpen(false);
    }
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
              onClick={handleCreatePrograma}
              size={isMobile ? "small" : "medium"}
            >
              Crear Programa
            </Button>
          </Box>
          
          {/* Búsqueda y filtros */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar programa..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterIcon fontSize="small" sx={{ mr: 0.5 }} /> Filtrar:
                  </Typography>
                  
                  {tipos.map((tipo) => (
                    <Chip
                      key={tipo}
                      label={tipo}
                      onClick={() => handleFilterChange(tipo)}
                      color={filterTipo === tipo ? "primary" : "default"}
                      variant={filterTipo === tipo ? "filled" : "outlined"}
                      size="small"
                    />
                  ))}
                  
                  {filterTipo && (
                    <Chip
                      label="Limpiar filtros"
                      onClick={() => setFilterTipo('')}
                      onDelete={() => setFilterTipo('')}
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Lista de programas */}
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : filteredProgramas.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No hay programas personalizados
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {searchTerm || filterTipo ? 
                  'No se encontraron programas que coincidan con los criterios de búsqueda.' : 
                  'Comienza creando tu primer programa personalizado.'}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleCreatePrograma}
                sx={{ mt: 2 }}
              >
                Crear Programa
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredProgramas.map((programa) => (
                <Grid item xs={12} sm={6} md={4} key={programa.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {programa.nombre}
                      </Typography>
                      
                      {programa.tipoPrograma && (
                        <Chip 
                          label={programa.tipoPrograma} 
                          size="small" 
                          sx={{ mb: 2 }} 
                        />
                      )}
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box mt={2} display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                          {programa.subprogramas?.length || 0} subprogramas
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Creado: {new Date(programa.fechaCreacion).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Box display="flex" width="100%" justifyContent="space-between">
                        <Button 
                          size="small" 
                          onClick={() => handleViewPrograma(programa.id)}
                        >
                          Ver
                        </Button>
                        
                        <Box>
                          <Tooltip title="Compartir">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleSharePrograma(programa.id)}
                            >
                              <ShareIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => handleEditPrograma(programa.id)}
                              sx={{ ml: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeletePrograma(programa)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el programa "{programaToDelete?.nombre}"? 
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmDeletePrograma} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarMenu>
  );
};

export default ProgramasPersonalizados; 