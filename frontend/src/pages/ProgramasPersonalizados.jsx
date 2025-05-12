import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
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
  Chip,
  Collapse,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemButton
} from '@mui/material';
import {
  Add as AddIcon,
  FitnessCenter,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Link as LinkIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  PlayCircleOutline as PlayIcon
} from '@mui/icons-material';
import SidebarMenu from '../components/SidebarMenu';
import { authService, programasPersonalizadosService } from '../services/api';
import SubprogramaMultimediaViewer from '../components/SubprogramaMultimediaViewer';

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
  
  // Estado para expandir filas y mostrar subprogramas
  const [expandedRows, setExpandedRows] = useState({});
  const [loadingSubprogramas, setLoadingSubprogramas] = useState({});
  const [subprogramasPorPrograma, setSubprogramasPorPrograma] = useState({});
  
  // Estado para diálogo de compartir
  const [compartirDialogOpen, setCompartirDialogOpen] = useState(false);
  const [programaCompartir, setProgramaCompartir] = useState(null);
  const [pacientesSeleccionados, setPacientesSeleccionados] = useState([]);
  
  const [selectedSubprograma, setSelectedSubprograma] = useState(null);
  const [openSubprogramaDetail, setOpenSubprogramaDetail] = useState(false);
  
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

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = programas.filter(programa => 
      (programa.nombre && programa.nombre.toLowerCase().includes(searchTermLower)) ||
      (programa.tipoPrograma && programa.tipoPrograma.toLowerCase().includes(searchTermLower)) ||
      (programa.descripcion && programa.descripcion.toLowerCase().includes(searchTermLower)) ||
      // También buscar en otros campos como fechas
      (programa.fechaCreacion && new Date(programa.fechaCreacion).toLocaleDateString().includes(searchTerm))
    );
    
    setFilteredProgramas(filtered);
    setPage(0); // Regresar a la primera página al filtrar
  }, [searchTerm, programas]);

  // Función para cargar subprogramas de un programa
  const cargarSubprogramas = async (programaId) => {
    // Si ya tenemos los subprogramas, no es necesario cargarlos de nuevo
    if (subprogramasPorPrograma[programaId]) {
      return;
    }
    
    try {
      setLoadingSubprogramas(prev => ({ ...prev, [programaId]: true }));
      
      const subprogramas = await programasPersonalizadosService.getSubprogramasByProgramaId(programaId);
      
      setSubprogramasPorPrograma(prev => ({
        ...prev,
        [programaId]: subprogramas || []
      }));
      
    } catch (error) {
      console.error(`Error al cargar subprogramas del programa ${programaId}:`, error);
      setNotification({
        open: true,
        message: 'Error al cargar los subprogramas',
        severity: 'error'
      });
    } finally {
      setLoadingSubprogramas(prev => ({ ...prev, [programaId]: false }));
    }
  };

  // Función para ordenar programas
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedProgramas = [...filteredProgramas].sort((a, b) => {
      // Manejar diferentes tipos de datos para ordenamiento
      if (property === 'fechaCreacion' || property === 'fechaActualizacion') {
        // Ordenar fechas
        const dateA = a[property] ? new Date(a[property]).getTime() : 0;
        const dateB = b[property] ? new Date(b[property]).getTime() : 0;
        return isAsc ? dateA - dateB : dateB - dateA;
      } else if (property === 'cantidadSubprogramas' || property === 'cantidadEjercicios') {
        // Ordenar números
        const numA = a[property] || 0;
        const numB = b[property] || 0;
        return isAsc ? numA - numB : numB - numA;
      } else {
        // Ordenar texto
        const aValue = (a[property] || '').toString().toLowerCase();
        const bValue = (b[property] || '').toString().toLowerCase();
        return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });

    setFilteredProgramas(sortedProgramas);
  };
  
  // Función para expandir/colapsar fila y mostrar subprogramas
  const handleToggleRow = async (programaId) => {
    const newExpandedRows = {
      ...expandedRows,
      [programaId]: !expandedRows[programaId]
    };
    
    setExpandedRows(newExpandedRows);
    
    // Si estamos expandiendo y no tenemos subprogramas, cargarlos
    if (newExpandedRows[programaId] && !subprogramasPorPrograma[programaId]) {
      await cargarSubprogramas(programaId);
    }
  };

  const handleCreateProgram = () => {
    navigate('/programas-personalizados/nuevo');
  };
  
  const handleViewProgram = (programaId) => {
    navigate(`/programas-personalizados/${programaId}`);
  };
  
  const handleViewSubprograma = (subprograma) => {
    setSelectedSubprograma(subprograma);
    setOpenSubprogramaDetail(true);
  };
  
  const handleEditProgram = (programaId, event) => {
    event.stopPropagation();
    navigate(`/programas-personalizados/editar/${programaId}`);
  };
  
  const handleDeleteProgram = (programaId, event) => {
    event.stopPropagation();
    
    // Primero verificar si el programa se puede eliminar
    programasPersonalizadosService.puedeEliminarPrograma(programaId)
      .then(response => {
        if (response.puedeEliminar) {
          // Si se puede eliminar, mostrar confirmación
          if (window.confirm('¿Estás seguro de que deseas eliminar este programa?')) {
            programasPersonalizadosService.deletePrograma(programaId)
              .then(() => {
                // Eliminar el programa de la lista local
                setProgramas(prevProgramas => prevProgramas.filter(p => p.id !== programaId));
                setFilteredProgramas(prevProgramas => prevProgramas.filter(p => p.id !== programaId));
                
                // Mostrar notificación de éxito
                setNotification({
                  open: true,
                  message: 'Programa eliminado correctamente',
                  severity: 'success'
                });
              })
              .catch(error => {
                console.error('Error al eliminar programa:', error);
                setNotification({
                  open: true,
                  message: 'Error al eliminar el programa',
                  severity: 'error'
                });
              });
          }
        } else {
          // Si no se puede eliminar, mostrar el motivo
          let mensaje = 'No se puede eliminar el programa porque:';
          if (response.tieneSubprogramas) {
            mensaje += ' tiene subprogramas asociados.';
          }
          if (response.tienePacientes) {
            mensaje += ' tiene pacientes (tokens) asociados.';
          }
          
          setNotification({
            open: true,
            message: mensaje,
            severity: 'warning'
          });
        }
      })
      .catch(error => {
        console.error('Error al verificar si el programa se puede eliminar:', error);
        setNotification({
          open: true,
          message: 'Error al verificar si el programa se puede eliminar',
          severity: 'error'
        });
      });
  };

  // Manejadores para compartir programa
  const handleOpenCompartir = (programa, event) => {
    event.stopPropagation();
    setProgramaCompartir(programa);
    setCompartirDialogOpen(true);
  };

  const handleCloseCompartir = () => {
    setCompartirDialogOpen(false);
    setProgramaCompartir(null);
    setPacientesSeleccionados([]);
  };

  const handleCompartirPrograma = () => {
    // Aquí iría la lógica para compartir el programa con pacientes
    setNotification({
      open: true,
      message: 'Programa compartido correctamente',
      severity: 'success'
    });
    handleCloseCompartir();
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

  const handleCloseSubprogramaDetail = () => {
    setOpenSubprogramaDetail(false);
    setSelectedSubprograma(null);
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
                placeholder="Buscar por nombre, tipo, descripción o fecha..."
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
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="tabla de programas personalizados" size="medium">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                    <TableCell width="50px"></TableCell>
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
                    <TableCell>Descripción</TableCell>
                    <TableCell align="center">Contenido</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'fechaCreacion'}
                        direction={orderBy === 'fechaCreacion' ? order : 'asc'}
                        onClick={() => handleRequestSort('fechaCreacion')}
                      >
                        Fecha creación
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((programa) => (
                    <React.Fragment key={programa.id}>
                      <TableRow 
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          '& > *': { borderBottom: 'unset' }
                        }}
                      >
                        <TableCell>
                          <Tooltip title={expandedRows[programa.id] ? "Ocultar subprogramas" : "Ver subprogramas"}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleRow(programa.id);
                              }}
                            >
                              {expandedRows[programa.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell 
                          component="th" 
                          scope="row"
                          onClick={() => handleViewProgram(programa.id)}
                        >
                          <Typography fontWeight="medium">
                            {programa.nombre || 'Sin nombre'}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={() => handleViewProgram(programa.id)}>
                          {programa.tipoPrograma ? (
                            <Chip 
                              label={programa.tipoPrograma} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell 
                          onClick={() => handleViewProgram(programa.id)}
                          sx={{
                            maxWidth: '200px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {programa.descripcion || 'Sin descripción'}
                        </TableCell>
                        <TableCell 
                          align="center"
                          onClick={() => handleViewProgram(programa.id)}
                        >
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <Chip 
                              label={programa.cantidadSubprogramas || 0} 
                              size="small"
                              color={programa.cantidadSubprogramas > 0 ? 'success' : 'default'}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              {programa.cantidadEjercicios || 0} ejercicios
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell 
                          align="center"
                          onClick={() => handleViewProgram(programa.id)}
                        >
                          {programa.fechaCreacion ? (
                            <Typography variant="body2" color="text.secondary">
                              {new Date(programa.fechaCreacion).toLocaleDateString()}
                            </Typography>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver programa">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewProgram(programa.id)}
                            >
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
                          <Tooltip title="Compartir programa">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => handleOpenCompartir(programa, e)}
                            >
                              <ShareIcon />
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
                      
                      {/* Fila expandible para subprogramas */}
                      <TableRow>
                        <TableCell colSpan={6} style={{ paddingTop: 0, paddingBottom: 0 }}>
                          <Collapse in={expandedRows[programa.id]} timeout="auto" unmountOnExit>
                            <Box p={3} bgcolor={theme.palette.action.hover} borderRadius={1} m={1}>
                              <Typography variant="h6" gutterBottom component="div">
                                Subprogramas
                              </Typography>
                              
                              {loadingSubprogramas[programa.id] ? (
                                <Box display="flex" justifyContent="center" my={2}>
                                  <CircularProgress size={30} />
                                </Box>
                              ) : !subprogramasPorPrograma[programa.id] ? (
                                <Typography color="text.secondary">
                                  Error al cargar subprogramas
                                </Typography>
                              ) : subprogramasPorPrograma[programa.id].length === 0 ? (
                                <Typography color="text.secondary">
                                  No hay subprogramas disponibles
                                </Typography>
                              ) : (
                                <List>
                                  {subprogramasPorPrograma[programa.id].map((subprograma) => (
                                    <ListItem
                                      key={subprograma.id}
                                      disablePadding
                                      sx={{
                                        mb: 1.5,
                                        borderRadius: 1,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        bgcolor: theme.palette.background.paper,
                                        position: 'relative'
                                      }}
                                    >
                                      <ListItemButton
                                        onClick={() => handleViewSubprograma(subprograma)}
                                        sx={{ borderRadius: 1, pr: '100px' }}
                                      >
                                        <ListItemIcon>
                                          <Box
                                            sx={{
                                              borderRadius: '50%',
                                              width: 32,
                                              height: 32,
                                              bgcolor: theme.palette.primary.main,
                                              color: 'white',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontWeight: 'bold',
                                              mr: 1
                                            }}
                                          >
                                            {subprograma.id}
                                          </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={
                                            <Typography variant="subtitle1" fontWeight="bold">
                                              {subprograma.nombre}
                                            </Typography>
                                          }
                                          secondary={
                                            subprograma.descripcion ? (
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                  display: '-webkit-box',
                                                  WebkitLineClamp: 2,
                                                  WebkitBoxOrient: 'vertical'
                                                }}
                                              >
                                                {subprograma.descripcion}
                                              </Typography>
                                            ) : (
                                              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                Sin descripción
                                              </Typography>
                                            )
                                          }
                                        />
                                        <ListItemSecondaryAction>
                                          <Tooltip title="Ver detalles">
                                            <IconButton
                                              edge="end"
                                              color="primary"
                                              onClick={e => {
                                                e.stopPropagation();
                                                handleViewSubprograma(subprograma);
                                              }}
                                            >
                                              <ViewIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </ListItemSecondaryAction>
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                              
                              <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/programas-personalizados/${programa.id}`)}
                                sx={{ mt: 1 }}
                              >
                                Añadir subprograma
                              </Button>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              
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
              />
            </TableContainer>
          )}
        </Box>
      </Container>
      
      {/* Diálogo para compartir programa */}
      <Dialog 
        open={compartirDialogOpen} 
        onClose={handleCloseCompartir}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Compartir Programa</DialogTitle>
        <DialogContent>
          {programaCompartir && (
            <>
              <Typography variant="h6" gutterBottom>
                {programaCompartir.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Generar enlaces de acceso para pacientes a este programa.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Opciones de compartir
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={() => navigate(`/programas-personalizados/${programaCompartir.id}/compartir`)}
                fullWidth
                sx={{ mb: 2 }}
              >
                Ir a pantalla de compartir
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompartir}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificaciones */}
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

      {/* Modal para ver detalles del subprograma */}
      <Dialog
        open={openSubprogramaDetail}
        onClose={handleCloseSubprogramaDetail}
        maxWidth="md"
        fullWidth
      >
        {selectedSubprograma && (
          <>
            <DialogTitle>{selectedSubprograma.nombre}</DialogTitle>
            <DialogContent>
              <SubprogramaMultimediaViewer
                subprograma={selectedSubprograma}
                onClose={handleCloseSubprogramaDetail}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </SidebarMenu>
  );
};

export default ProgramasPersonalizados;