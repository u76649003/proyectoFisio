import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  Download as DownloadIcon,
  DateRange,
  Print as PrintIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

// Componente para mostrar gráficos simulados
const ChartPlaceholder = ({ type, height = 300 }) => {
  return (
    <Box 
      sx={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        border: '1px dashed #ccc'
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Gráfico {type} (Placeholder)
      </Typography>
    </Box>
  );
};

const Informes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [tipoInforme, setTipoInforme] = useState('pacientes');
  const [tabValue, setTabValue] = useState(0);
  
  // Datos simulados para la demostración
  const estadisticas = {
    pacientesNuevos: 24,
    citasRealizadas: 145,
    ingresosTotales: '3.450€',
    tasaOcupacion: '78%'
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }
        
        // En una aplicación real, aquí cargaríamos los datos de informes desde la API
        // Por ahora solo simulamos una carga
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);
  
  // Manejar cambio de período
  const handlePeriodoChange = (event) => {
    setPeriodo(event.target.value);
  };
  
  // Manejar cambio de tipo de informe
  const handleTipoInformeChange = (event) => {
    setTipoInforme(event.target.value);
  };
  
  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Simular descarga de informes
  const handleDownloadReport = () => {
    alert('Descarga de informe simulada');
  };
  
  // Simular impresión de informes
  const handlePrintReport = () => {
    alert('Impresión de informe simulada');
  };
  
  return (
    <SidebarMenu>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Informes y Estadísticas
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
          >
            Exportar
          </Button>
          <Button 
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintReport}
          >
            Imprimir
          </Button>
        </Box>
      </Box>
      
      {/* Filtros y selección de período */}
      <Box 
        sx={{ 
          mb: 4, 
          p: 2, 
          bgcolor: '#f5f5f5', 
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="periodo-label">Período</InputLabel>
          <Select
            labelId="periodo-label"
            id="periodo-select"
            value={periodo}
            label="Período"
            onChange={handlePeriodoChange}
          >
            <MenuItem value="semana">Última semana</MenuItem>
            <MenuItem value="mes">Último mes</MenuItem>
            <MenuItem value="trimestre">Último trimestre</MenuItem>
            <MenuItem value="año">Último año</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="tipo-informe-label">Tipo de Informe</InputLabel>
          <Select
            labelId="tipo-informe-label"
            id="tipo-informe-select"
            value={tipoInforme}
            label="Tipo de Informe"
            onChange={handleTipoInformeChange}
          >
            <MenuItem value="pacientes">Pacientes</MenuItem>
            <MenuItem value="citas">Citas</MenuItem>
            <MenuItem value="ingresos">Ingresos</MenuItem>
            <MenuItem value="profesionales">Profesionales</MenuItem>
          </Select>
        </FormControl>
        
        <Button 
          variant="contained" 
          startIcon={<DateRange />}
          sx={{ ml: 'auto' }}
        >
          Seleccionar Fechas
        </Button>
      </Box>
      
      {/* Cards de estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Pacientes Nuevos
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {estadisticas.pacientesNuevos}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12% vs. periodo anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Citas Realizadas
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {estadisticas.citasRealizadas}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +8% vs. periodo anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Ingresos Totales
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {estadisticas.ingresosTotales}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +15% vs. periodo anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Tasa de Ocupación
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {estadisticas.tasaOcupacion}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +5% vs. periodo anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Pestañas para diferentes visualizaciones */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3, mb: 4, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<BarChartIcon />} label="Gráfico de Barras" />
          <Tab icon={<PieChartIcon />} label="Gráfico Circular" />
          <Tab icon={<TrendingUp />} label="Tendencias" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Contenido según la pestaña seleccionada */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {tipoInforme === 'pacientes' && 'Nuevos Pacientes por Período'}
                {tipoInforme === 'citas' && 'Citas por Período'}
                {tipoInforme === 'ingresos' && 'Ingresos por Período'}
                {tipoInforme === 'profesionales' && 'Rendimiento por Profesional'}
              </Typography>
              <ChartPlaceholder type="de barras" height={400} />
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {tipoInforme === 'pacientes' && 'Distribución de Pacientes'}
                {tipoInforme === 'citas' && 'Distribución de Tipos de Citas'}
                {tipoInforme === 'ingresos' && 'Distribución de Ingresos por Servicio'}
                {tipoInforme === 'profesionales' && 'Distribución de Carga de Trabajo'}
              </Typography>
              <ChartPlaceholder type="circular" height={400} />
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {tipoInforme === 'pacientes' && 'Tendencia de Captación de Pacientes'}
                {tipoInforme === 'citas' && 'Tendencia de Citas Realizadas'}
                {tipoInforme === 'ingresos' && 'Tendencia de Ingresos'}
                {tipoInforme === 'profesionales' && 'Tendencia de Productividad'}
              </Typography>
              <ChartPlaceholder type="de líneas" height={400} />
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Sección de análisis detallado */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Análisis Detallado
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          {tipoInforme === 'pacientes' && 'El análisis de pacientes muestra un incremento sostenido en el número de nuevos registros. La tasa de retención se mantiene estable, con un 85% de pacientes que regresan para al menos una consulta de seguimiento.'}
          {tipoInforme === 'citas' && 'El análisis de citas muestra que los horarios de mayor demanda son entre las 17:00 y 19:00 horas. La tasa de cancelación se ha reducido un 7% respecto al periodo anterior.'}
          {tipoInforme === 'ingresos' && 'El análisis financiero muestra un crecimiento de ingresos del 15% respecto al mismo periodo del año anterior. Los servicios de fisioterapia deportiva son los que más ingresos generan.'}
          {tipoInforme === 'profesionales' && 'El análisis de desempeño muestra que los profesionales tienen una carga de trabajo equilibrada. La tasa de satisfacción de pacientes ha aumentado un 12% respecto al periodo anterior.'}
        </Typography>
        
        <Typography variant="body1" paragraph>
          Se recomienda:
        </Typography>
        
        <ul>
          <li>
            <Typography variant="body1">
              {tipoInforme === 'pacientes' && 'Implementar un programa de fidelización para los nuevos pacientes.'}
              {tipoInforme === 'citas' && 'Considerar aumentar la disponibilidad en horarios de mayor demanda.'}
              {tipoInforme === 'ingresos' && 'Potenciar los servicios de fisioterapia deportiva y considerar ampliar la oferta.'}
              {tipoInforme === 'profesionales' && 'Mantener el sistema actual de asignación de citas para preservar el equilibrio.'}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              {tipoInforme === 'pacientes' && 'Realizar un seguimiento más personalizado para los pacientes recurrentes.'}
              {tipoInforme === 'citas' && 'Implementar un sistema de recordatorio de citas más efectivo.'}
              {tipoInforme === 'ingresos' && 'Revisar la tarifación de servicios menos solicitados.'}
              {tipoInforme === 'profesionales' && 'Planificar sesiones de formación continua para mejorar competencias.'}
            </Typography>
          </li>
        </ul>
      </Card>
    </SidebarMenu>
  );
};

export default Informes; 