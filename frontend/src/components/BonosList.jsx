import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { bonoPacienteService, productoService } from '../services/api';
import BonoForm from './BonoForm';

const getChipColor = (estado) => {
  switch (estado) {
    case 'ACTIVO':
      return 'success';
    case 'COMPLETADO':
      return 'info';
    case 'CANCELADO':
      return 'error';
    default:
      return 'default';
  }
};

const BonosList = ({ pacienteId }) => {
  const [bonos, setBonos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBono, setSelectedBono] = useState(null);
  
  // Cargar bonos y productos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar bonos del paciente
        const bonosData = await bonoPacienteService.getBonosByPacienteId(pacienteId);
        
        // Cargar productos para mostrar nombres
        const productosData = await productoService.getAllProductos();
        
        setBonos(bonosData);
        setProductos(productosData);
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('No se pudieron cargar los bonos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pacienteId]);
  
  // Encontrar el nombre del producto por su ID
  const getProductoNombre = (productoId) => {
    if (!productoId) return 'No asignado';
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.nombre : 'Producto no encontrado';
  };
  
  // Gestión de formulario
  const handleOpenDialog = (bono = null) => {
    setSelectedBono(bono);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSaveBono = async (bonoData) => {
    try {
      let updatedBono;
      
      if (selectedBono && selectedBono.id) {
        // Actualizar bono existente
        updatedBono = await bonoPacienteService.updateBonoPaciente(
          pacienteId, 
          selectedBono.id, 
          bonoData
        );
        
        // Actualizar la lista de bonos
        setBonos(bonos.map(bono => 
          bono.id === updatedBono.id ? updatedBono : bono
        ));
      } else {
        // Crear nuevo bono
        const newBono = await bonoPacienteService.createBonoPaciente(
          pacienteId, 
          bonoData
        );
        
        // Añadir a la lista de bonos
        setBonos([...bonos, newBono]);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar bono:', error);
      setError('Error al guardar el bono. Por favor, inténtalo de nuevo.');
    }
  };
  
  // Gestión de eliminación
  const handleOpenDeleteDialog = (bono) => {
    setSelectedBono(bono);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleDeleteBono = async () => {
    try {
      await bonoPacienteService.deleteBonoPaciente(pacienteId, selectedBono.id);
      
      // Eliminar de la lista local
      setBonos(bonos.filter(bono => bono.id !== selectedBono.id));
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error al eliminar bono:', error);
      setError('Error al eliminar el bono. Por favor, inténtalo de nuevo.');
    }
  };
  
  // Renderizar componente
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Bonos del Paciente
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Bono
        </Button>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {bonos.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {bonos.map((bono) => (
            <Card key={bono.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getProductoNombre(bono.productoId)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={bono.estado} 
                        color={getChipColor(bono.estado)} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" component="span">
                        Sesiones: {bono.sesionesRestantes}/{bono.sesionesIniciales}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Válido: {new Date(bono.fechaInicio).toLocaleDateString()} 
                      {bono.fechaFin && ` - ${new Date(bono.fechaFin).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(bono)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(bono)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No hay bonos registrados para este paciente.
        </Typography>
      )}
      
      {/* Diálogo de formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedBono ? 'Editar Bono' : 'Nuevo Bono'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BonoForm 
            pacienteId={pacienteId}
            bono={selectedBono}
            productos={productos}
            onSave={handleSaveBono}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Bono</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este bono? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteBono} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BonosList; 