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
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  TablePagination,
  TableSortLabel,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  FitnessCenter,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon
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

  // Estados para búsqueda, paginación y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('nombre');
  const [order, setOrder] = useState('asc');
  const [filteredProgramas, setFilteredProgramas] = useState([]);
  
  // Cargar programas al montar el componente
  useEffect(() => {
    const cargarProgramas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar usuario
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setError('Debe iniciar sesión para acceder a esta página');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        // Verificar permisos
        if (currentUser.rol !== 'DUENO' && currentUser.rol !== 'FISIOTERAPEUTA') {
          setNotification({ 
            open: true, 
            message: 'No tienes permisos para acceder a esta sección.', 
            severity: 'error' 
          });
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        
        // Cargar programas
        const data = await programasPersonalizadosService.getProgramas();
        const programasData = Array.isArray(data) ? data : [];
        setProgramas(programasData);
        setFilteredProgramas(programasData);
        
      } catch (error) {
        console.error('Error al cargar programas:', error);
        setError('Error al cargar los programas personalizados');
      } finally {
        setLoading(false);
      }
    };
    
    cargarProgramas();
  }, [navigate]);

  // Efecto para filtrar programas cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProgramas(programas);
      return;
    }

    const filtered = programas.filter(programa => 
      (programa.nombre && programa.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (programa.tipoPrograma && programa.tipoPrograma.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (programa.descripcion && programa.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredProgramas(filtered);
    setPage(0); // Regresar a la primera página al filtrar
  }, [searchTerm, programas]);

  // Función para ordenar programas
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedProgramas = [...filteredProgramas].sort((a, b) => {
      const aValue = a[property] || '';
      const bValue = b[property] || '';
      
      if (order === 'desc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredProgramas(sortedProgramas);
  };
  
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
  
  const handleDeleteProgram = (programaId, event) => {
    event.stopPropagation();
    // Aquí iría la lógica para eliminar un programa
    // Por ahora solo mostramos una notificación
    setNotification({
      open: true,
      message: 'Funcionalidad de eliminación pendiente de implementar',
      severity: 'info'
    });
  };

  // Manejadores para paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Obtener programas paginados
  const getPaginatedData = () => {
    return filteredProgramas.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
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

          {/* Barra de búsqueda */}
          {!loading && !error && programas.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar programas por nombre, tipo o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small"
                        onClick={() => setSearchTerm('')}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />
              {searchTerm && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {filteredProgramas.length} resultado(s) encontrado(s)
                  </Typography>
                  {filteredProgramas.length > 0 && (
                    <Chip 
                      label={`Buscando: "${searchTerm}"`} 
                      size="small" 
                      onDelete={() => setSearchTerm('')}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : programas.length === 0 ? (
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
          ) : filteredProgramas.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                No se encontraron resultados
              </Typography>
              <Typography variant="body1" paragraph>
                No hay programas que coincidan con tu búsqueda.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSearchTerm('')}
                sx={{ mt: 2 }}
              >
                Limpiar búsqueda
              </Button>
            </Paper>
          ) : (
            <>
              {/* Vista en tarjetas para pantallas grandes */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Grid container spacing={3}>
                  {getPaginatedData().map((programa) => (
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
              </Box>
              
              {/* Vista en tabla para pantallas pequeñas y medianas */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'nombre'}
                            direction={orderBy === 'nombre' ? order : 'asc'}
                            onClick={() => handleRequestSort('nombre')}
                          >
                            Nombre
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'tipoPrograma'}
                            direction={orderBy === 'tipoPrograma' ? order : 'asc'}
                            onClick={() => handleRequestSort('tipoPrograma')}
                          >
                            Tipo
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Subprogramas</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getPaginatedData().map((programa) => (
                        <TableRow 
                          key={programa.id}
                          hover
                          onClick={() => handleViewProgram(programa.id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{programa.nombre || 'Sin nombre'}</TableCell>
                          <TableCell>{programa.tipoPrograma || '-'}</TableCell>
                          <TableCell>{programa.subprogramas?.length || 0}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Editar programa">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={(e) => handleEditProgram(programa.id, e)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar programa">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={(e) => handleDeleteProgram(programa.id, e)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Paginación */}
              <TablePagination
                component="div"
                count={filteredProgramas.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Programas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Box>
      </Container>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default ProgramasPersonalizados; 