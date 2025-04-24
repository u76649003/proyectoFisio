import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import SidebarMenu from '../components/SidebarMenu';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';

const Citas = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [citas, setCitas] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    // Generar las fechas de la semana actual
    generateWeekDates(currentWeek);
    
    // Cargar citas
    setIsLoading(false);
  }, [currentWeek, navigate]);

  // Función para generar las fechas de la semana
  const generateWeekDates = (date) => {
    const currentDate = new Date(date);
    const day = currentDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Ajustar para que la semana comience en lunes (si día es 0/domingo, restar 6 días, de lo contrario restar día - 1)
    const diff = day === 0 ? -6 : -(day - 1);
    
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      weekDays.push(nextDay);
    }
    
    setWeekDates(weekDays);
  };

  // Avanzar a la siguiente semana
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };
  
  // Retroceder a la semana anterior
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };
 
  return (
    <SidebarMenu>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Agenda de Citas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/nueva-cita')}
          >
            Nueva Cita
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button onClick={goToPreviousWeek} variant="outlined">
            Semana Anterior
          </Button>
          <Typography variant="h6">
            {weekDates.length > 0 
              ? `${weekDates[0].toLocaleDateString()} - ${weekDates[6].toLocaleDateString()}`
              : 'Cargando...'}
          </Typography>
          <Button onClick={goToNextWeek} variant="outlined">
            Semana Siguiente
          </Button>
        </Box>
        
        {isLoading ? (
          <Typography>Cargando agenda...</Typography>
        ) : (
          <Grid container spacing={2}>
            {weekDates.map((date, index) => (
              <Grid item xs={12} md key={index}>
                <Box 
                  sx={{ 
                    border: '1px solid #ddd', 
                    borderRadius: 1,
                    p: 1,
                    minHeight: '200px',
                    bgcolor: new Date().toDateString() === date.toDateString() ? '#f0f7ff' : 'white'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                    {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                    {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </Typography>
                  
                  {/* Aquí se renderizarían las citas del día */}
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    No hay citas para este día
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </SidebarMenu>
  );
};

export default Citas; 