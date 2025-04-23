import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Alert,
  Grid
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import es from 'date-fns/locale/es';

const BonoForm = ({ pacienteId, bono, productos, onSave }) => {
  // Estado inicial del formulario
  const initialState = {
    pacienteId: pacienteId,
    servicioId: '',
    productoId: '',
    fechaInicio: new Date(),
    fechaFin: null,
    sesionesIniciales: 10,
    sesionesRestantes: 10,
    estado: 'ACTIVO'
  };
  
  // Estado del formulario y errores
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  
  // Cargar datos si estamos editando un bono existente
  useEffect(() => {
    if (bono) {
      setFormData({
        pacienteId: pacienteId,
        servicioId: bono.servicioId || '',
        productoId: bono.productoId || '',
        fechaInicio: bono.fechaInicio ? new Date(bono.fechaInicio) : new Date(),
        fechaFin: bono.fechaFin ? new Date(bono.fechaFin) : null,
        sesionesIniciales: bono.sesionesIniciales || 10,
        sesionesRestantes: bono.sesionesRestantes || 10,
        estado: bono.estado || 'ACTIVO'
      });
    }
  }, [bono, pacienteId]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Si cambia el número de sesiones iniciales, actualizar las restantes en un nuevo bono
    if (name === 'sesionesIniciales' && !bono) {
      setFormData(prev => ({
        ...prev,
        sesionesRestantes: parseInt(value, 10) || 0
      }));
    }
  };
  
  // Manejar cambios en fechas
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.servicioId) {
      newErrors.servicioId = 'Selecciona un servicio';
    }
    
    if (!formData.productoId) {
      newErrors.productoId = 'Selecciona un producto';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }
    
    if (formData.fechaFin && formData.fechaInicio && formData.fechaFin < formData.fechaInicio) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    if (!formData.sesionesIniciales || formData.sesionesIniciales <= 0) {
      newErrors.sesionesIniciales = 'Introduce un número válido de sesiones';
    }
    
    if (formData.sesionesRestantes === undefined || formData.sesionesRestantes < 0) {
      newErrors.sesionesRestantes = 'Las sesiones restantes deben ser un número positivo o cero';
    }
    
    if (formData.sesionesRestantes > formData.sesionesIniciales) {
      newErrors.sesionesRestantes = 'Las sesiones restantes no pueden ser más que las iniciales';
    }
    
    if (!formData.estado) {
      newErrors.estado = 'Selecciona un estado';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      setFormError('Por favor, corrige los errores en el formulario.');
      return;
    }
    
    try {
      // Preparar datos para enviar
      const bonoData = {
        ...formData,
        fechaInicio: formData.fechaInicio ? formData.fechaInicio.toISOString().split('T')[0] : null,
        fechaFin: formData.fechaFin ? formData.fechaFin.toISOString().split('T')[0] : null,
        sesionesIniciales: parseInt(formData.sesionesIniciales, 10),
        sesionesRestantes: parseInt(formData.sesionesRestantes, 10)
      };
      
      // Llamar a la función de guardar
      onSave(bonoData);
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      setFormError('Error al procesar el formulario. Por favor, inténtalo de nuevo.');
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={Boolean(errors.productoId)}>
            <InputLabel>Producto</InputLabel>
            <Select
              name="productoId"
              value={formData.productoId}
              onChange={handleChange}
              label="Producto"
            >
              <MenuItem value="">Selecciona un producto</MenuItem>
              {productos.map((producto) => (
                <MenuItem key={producto.id} value={producto.id}>
                  {producto.nombre} - {producto.precio}€
                </MenuItem>
              ))}
            </Select>
            {errors.productoId && (
              <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                {errors.productoId}
              </Box>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth error={Boolean(errors.servicioId)}>
            <InputLabel>Servicio</InputLabel>
            <Select
              name="servicioId"
              value={formData.servicioId}
              onChange={handleChange}
              label="Servicio"
            >
              <MenuItem value="">Selecciona un servicio</MenuItem>
              {/* Aquí deberías cargar los servicios disponibles */}
              <MenuItem value="servicio1">Servicio 1</MenuItem>
              <MenuItem value="servicio2">Servicio 2</MenuItem>
            </Select>
            {errors.servicioId && (
              <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                {errors.servicioId}
              </Box>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha de inicio"
              value={formData.fechaInicio}
              onChange={(date) => handleDateChange('fechaInicio', date)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  error={Boolean(errors.fechaInicio)}
                  helperText={errors.fechaInicio}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha de fin (opcional)"
              value={formData.fechaFin}
              onChange={(date) => handleDateChange('fechaFin', date)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  error={Boolean(errors.fechaFin)}
                  helperText={errors.fechaFin}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            name="sesionesIniciales"
            label="Número de sesiones"
            type="number"
            fullWidth
            value={formData.sesionesIniciales}
            onChange={handleChange}
            error={Boolean(errors.sesionesIniciales)}
            helperText={errors.sesionesIniciales}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            name="sesionesRestantes"
            label="Sesiones restantes"
            type="number"
            fullWidth
            value={formData.sesionesRestantes}
            onChange={handleChange}
            error={Boolean(errors.sesionesRestantes)}
            helperText={errors.sesionesRestantes}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth error={Boolean(errors.estado)}>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value="ACTIVO">Activo</MenuItem>
              <MenuItem value="COMPLETADO">Completado</MenuItem>
              <MenuItem value="CANCELADO">Cancelado</MenuItem>
            </Select>
            {errors.estado && (
              <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                {errors.estado}
              </Box>
            )}
          </FormControl>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {bono ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
};

export default BonoForm; 