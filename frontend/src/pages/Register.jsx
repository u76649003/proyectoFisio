import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  IconButton,
  InputAdornment,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, ArrowBack, CloudUpload } from '@mui/icons-material';
import logoImg from '../assets/logo.svg';
import { authService } from '../services/api';
import { countries, provinces, getCitiesByProvince } from '../data/locationData';

const Logo = styled('img')({
  height: '50px',
  marginRight: '10px'
});

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '12px',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  }
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CompanyLogoPreview = styled('img')({
  width: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  marginTop: '16px',
  borderRadius: '8px',
  border: '1px solid #ddd'
});

const steps = ['Datos personales', 'Datos de la empresa', 'Confirmación'];

// Lista de dominios de email temporales
const TEMP_EMAIL_DOMAINS = [
  'mailinator.com', 
  '10minutemail.com', 
  'guerrillamail.com',
  'tempmail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'throwawaymail.com',
  'yopmail.com',
  'getnada.com',
  'dispostable.com'
];

// Lista de provincias españolas
const PROVINCIAS_ESPANA = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 
  'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 
  'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 
  'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 
  'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 
  'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 
  'Vizcaya', 'Zamora', 'Zaragoza'
];

// Tamaño máximo de logo en bytes (2MB)
const MAX_LOGO_SIZE = 2 * 1024 * 1024;
// Tipos de archivo permitidos
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

// Lista de roles disponibles
const ROLES = ['FISIOTERAPEUTA', 'RECEPCIONISTA', 'DUENO'];

// Lista de especialidades comunes de fisioterapia
const ESPECIALIDADES = [
  'Fisioterapia General',
  'Fisioterapia Deportiva',
  'Fisioterapia Neurológica',
  'Fisioterapia Pediátrica',
  'Fisioterapia Geriátrica',
  'Fisioterapia Respiratoria',
  'Fisioterapia Traumatológica',
  'Fisioterapia Reumatológica',
  'Terapia Manual',
  'Osteopatía',
  'Rehabilitación',
  'Otro'
];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [provinciasOptions, setProvinciasOptions] = useState([]);
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    dni: '',
    numeroColegiado: '',
    especialidad: '',
    rol: 'FISIOTERAPEUTA',
    esFisioterapeuta: false,
    // Datos de empresa
    nombreEmpresa: '',
    cifNif: '',
    direccion: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: 'España',
    web: '',
    logo: null,
    // Términos
    aceptaTerminos: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [logoPreview, setLogoPreview] = useState(null);

  // Actualizar ciudades cuando cambia la provincia
  useEffect(() => {
    if (formData.provincia) {
      const cities = getCitiesByProvince(formData.provincia);
      setAvailableCities(cities);
      
      // Si la ciudad actual no está en la nueva lista de ciudades, resetearla
      if (cities.length > 0 && !cities.includes(formData.ciudad)) {
        setFormData(prev => ({
          ...prev,
          ciudad: ''
        }));
      }
    }
  }, [formData.provincia]);

  // Efecto para actualizar las provincias cuando cambia el país
  useEffect(() => {
    if (formData.pais === 'España') {
      // Si el país es España, cargar las provincias de España
      setProvinciasOptions(PROVINCIAS_ESPANA);
      
      // Verificar si la ciudad necesita actualizarse basada en la provincia
      if (formData.provincia && formData.ciudad) {
        // Lógica adicional si es necesaria
      }
    } else {
      // Si es otro país, resetear las provincias o cargar otras según el país
      setProvinciasOptions([]);
    }
  }, [formData.pais, formData.provincia, formData.ciudad]);

  const handleChange = (e) => {
    const { name, value, checked, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      // Validar tamaño y tipo de archivo
      if (file) {
        if (file.size > MAX_LOGO_SIZE) {
          setErrors(prev => ({
            ...prev,
            logo: `El archivo es demasiado grande. El tamaño máximo es de 2MB.`
          }));
          return;
        }
        
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            logo: `Tipo de archivo no permitido. Use: JPG, PNG, GIF o SVG.`
          }));
          return;
        }
        
        // Crear URL para previsualización
        const fileUrl = URL.createObjectURL(file);
        setLogoPreview(fileUrl);
        
        setFormData({
          ...formData,
          logo: file
        });
        
        // Limpiar error si existe
        if (errors.logo) {
          setErrors({
            ...errors,
            logo: ''
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      
      // Limpiar error del campo cuando el usuario escribe
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    if (step === 0) {
      // Validar datos personales
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es obligatorio';
        isValid = false;
      }
      
      if (!formData.apellidos.trim()) {
        newErrors.apellidos = 'Los apellidos son obligatorios';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El formato del email no es válido';
        isValid = false;
      }
      
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        isValid = false;
      } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!,.])/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos un número, una letra y un carácter especial';
        isValid = false;
      }
      
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es obligatorio';
        isValid = false;
      } else if (!/^\+?[0-9]{9,15}$/.test(formData.telefono)) {
        newErrors.telefono = 'El formato del teléfono no es válido';
        isValid = false;
      }
      
      if (!formData.dni.trim()) {
        newErrors.dni = 'El DNI es obligatorio';
        isValid = false;
      } else if (!/^[0-9]{8}[A-Z]$/.test(formData.dni)) {
        newErrors.dni = 'El formato del DNI no es válido (8 números seguidos de una letra mayúscula)';
        isValid = false;
      }
      
      if (formData.rol === 'FISIOTERAPEUTA' && !formData.numeroColegiado.trim()) {
        newErrors.numeroColegiado = 'El número de colegiado es obligatorio para fisioterapeutas';
        isValid = false;
      }
      
      if (formData.rol === 'FISIOTERAPEUTA' && !formData.especialidad) {
        newErrors.especialidad = 'La especialidad es obligatoria para fisioterapeutas';
        isValid = false;
      }

      if (formData.rol === 'DUENO' && formData.esFisioterapeuta) {
        if (!formData.numeroColegiado.trim()) {
          newErrors.numeroColegiado = 'El número de colegiado es obligatorio para fisioterapeutas';
          isValid = false;
        }
        
        if (!formData.especialidad) {
          newErrors.especialidad = 'La especialidad es obligatoria para fisioterapeutas';
          isValid = false;
        }
      }
    } else if (step === 1) {
      // Validar datos de empresa
      if (!formData.nombreEmpresa.trim()) {
        newErrors.nombreEmpresa = 'El nombre de la empresa es obligatorio';
        isValid = false;
      }
      
      if (!formData.cifNif.trim()) {
        newErrors.cifNif = 'El CIF/NIF es obligatorio';
        isValid = false;
      } else if (!/^[A-Z0-9]{9}$/.test(formData.cifNif)) {
        newErrors.cifNif = 'El formato del CIF/NIF no es válido (9 caracteres alfanuméricos en mayúsculas)';
        isValid = false;
      }
      
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es obligatoria';
        isValid = false;
      }
      
      if (!formData.codigoPostal.trim()) {
        newErrors.codigoPostal = 'El código postal es obligatorio';
        isValid = false;
      }
      
      if (!formData.ciudad.trim()) {
        newErrors.ciudad = 'La ciudad es obligatoria';
        isValid = false;
      }
      
      if (!formData.provincia.trim()) {
        newErrors.provincia = 'La provincia es obligatoria';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'El email de la empresa es obligatorio';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El formato del email no es válido';
        isValid = false;
      }
      
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono de la empresa es obligatorio';
        isValid = false;
      }
      
      // La web no es obligatoria, pero si se proporciona, validar el formato
      if (formData.web && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+\/?.*$/.test(formData.web)) {
        newErrors.web = 'El formato de la URL no es válido';
        isValid = false;
      }
    } else if (step === 2) {
      // Validar términos y condiciones
      if (!formData.aceptaTerminos) {
        newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    // Verificar si el dominio es un email temporal
    const emailDomain = formData.email.split('@')[1].toLowerCase();
    if (TEMP_EMAIL_DOMAINS.includes(emailDomain)) {
      setSnackbar({
        open: true,
        message: 'No se permiten correos electrónicos temporales. Por favor, utilice una dirección de correo permanente.',
        severity: 'error'
      });
      setErrors({
        ...errors,
        email: 'No se permiten correos electrónicos temporales'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar los datos para el registro completo
      const registerData = {
        // Datos del usuario
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        dni: formData.dni,
        numeroColegiado: (formData.rol === 'FISIOTERAPEUTA' || (formData.rol === 'DUENO' && formData.esFisioterapeuta)) 
          ? formData.numeroColegiado 
          : '',
        especialidad: (formData.rol === 'FISIOTERAPEUTA' || (formData.rol === 'DUENO' && formData.esFisioterapeuta)) 
          ? formData.especialidad 
          : '',
        rol: formData.rol || 'DUENO',
        
        // Datos de la empresa
        nombreEmpresa: formData.nombreEmpresa,
        cifNif: formData.cifNif,
        direccion: formData.direccion,
        codigoPostal: formData.codigoPostal,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        pais: formData.pais,
        web: formData.web || '',
        
        // Usar directamente 'logo' como nombre del campo
        logo: formData.logo
      };
      
      console.log('Enviando datos de registro:', registerData);
      
      // Enviar los datos a través del servicio de autenticación
      await authService.registerComplete(registerData);
      
      // Mostrar mensaje de éxito con instrucciones para verificar el email
      setSnackbar({
        open: true,
        message: '¡Registro completado! Por favor, verifica tu correo electrónico para activar tu cuenta.',
        severity: 'success'
      });
      
      // Redirigir a la página de inicio después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error al registrar:', error);
      
      // Mostrar mensaje de error específico si existe
      let errorMessage = 'Ha ocurrido un error al registrar. Por favor, inténtalo de nuevo.';
      
      if (error.response) {
        if (error.response.status === 400) {
          // Error de validación o datos duplicados
          errorMessage = error.response.data || 'Los datos ingresados no son válidos. Por favor, revísalos.';
        } else if (error.response.status === 409) {
          // Conflicto (email o CIF/NIF ya existente)
          errorMessage = error.response.data || 'El email o CIF/NIF ya está registrado en el sistema.';
        } else if (error.response.status === 500) {
          // Error del servidor
          errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde.';
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        // Datos personales (con campos adicionales)
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="apellidos"
                name="apellidos"
                label="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="dni"
                name="dni"
                label="DNI"
                value={formData.dni}
                onChange={handleChange}
                error={!!errors.dni}
                helperText={errors.dni || "Formato: 12345678A"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="rol-label">Rol</InputLabel>
                <Select
                  labelId="rol-label"
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  label="Rol"
                >
                  {ROLES.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {formData.rol === 'DUENO' && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.esFisioterapeuta}
                      onChange={handleChange}
                      name="esFisioterapeuta"
                    />
                  }
                  label="También soy fisioterapeuta"
                />
              </Grid>
            )}
            
            {(formData.rol === 'FISIOTERAPEUTA' || (formData.rol === 'DUENO' && formData.esFisioterapeuta)) && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="numeroColegiado"
                    name="numeroColegiado"
                    label="Número de colegiado"
                    value={formData.numeroColegiado}
                    onChange={handleChange}
                    error={!!errors.numeroColegiado}
                    helperText={errors.numeroColegiado}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.especialidad}>
                    <InputLabel id="especialidad-label">Especialidad</InputLabel>
                    <Select
                      labelId="especialidad-label"
                      id="especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      label="Especialidad"
                    >
                      {ESPECIALIDADES.map((especialidad) => (
                        <MenuItem key={especialidad} value={especialidad}>
                          {especialidad}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.especialidad && (
                      <FormHelperText>{errors.especialidad}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="nombreEmpresa"
                name="nombreEmpresa"
                label="Nombre de la empresa"
                value={formData.nombreEmpresa}
                onChange={handleChange}
                error={!!errors.nombreEmpresa}
                helperText={errors.nombreEmpresa}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="cifNif"
                name="cifNif"
                label="CIF/NIF"
                value={formData.cifNif}
                onChange={handleChange}
                error={!!errors.cifNif}
                helperText={errors.cifNif}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="direccion"
                name="direccion"
                label="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                error={!!errors.direccion}
                helperText={errors.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="codigoPostal"
                name="codigoPostal"
                label="Código Postal"
                value={formData.codigoPostal}
                onChange={handleChange}
                error={!!errors.codigoPostal}
                helperText={errors.codigoPostal}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.pais}>
                <InputLabel id="pais-label">País</InputLabel>
                <Select
                  labelId="pais-label"
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  label="País"
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.pais && (
                  <Typography variant="caption" color="error">
                    {errors.pais}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.provincia}>
                <InputLabel id="provincia-label">Provincia</InputLabel>
                <Select
                  labelId="provincia-label"
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  label="Provincia"
                >
                  {provinciasOptions.map((provincia) => (
                    <MenuItem key={provincia} value={provincia}>
                      {provincia}
                    </MenuItem>
                  ))}
                </Select>
                {errors.provincia && (
                  <Typography variant="caption" color="error">
                    {errors.provincia}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.ciudad} disabled={!formData.provincia}>
                <InputLabel id="ciudad-label">Ciudad</InputLabel>
                <Select
                  labelId="ciudad-label"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  label="Ciudad"
                >
                  {availableCities.map((ciudad) => (
                    <MenuItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ciudad && (
                  <Typography variant="caption" color="error">
                    {errors.ciudad}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="web"
                name="web"
                label="Página web (opcional)"
                value={formData.web}
                onChange={handleChange}
                error={!!errors.web}
                helperText={errors.web || "Ej: https://www.miempresa.com"}
                placeholder="https://www.miempresa.com"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl error={!!errors.logo} fullWidth>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ height: '56px' }}
                >
                  Subir logo de empresa
                  <VisuallyHiddenInput 
                    type="file" 
                    name="logo"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.gif,.svg"
                  />
                </Button>
                <FormHelperText>
                  {errors.logo || "Formatos permitidos: JPG, PNG, GIF, SVG. Tamaño máximo: 2MB"}
                </FormHelperText>
                {logoPreview && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Vista previa:
                    </Typography>
                    <CompanyLogoPreview src={logoPreview} alt="Logo de empresa" />
                  </Box>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        // Confirmación
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen de registro
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Datos personales
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre completo
                </Typography>
                <Typography variant="body1">
                  {formData.nombre} {formData.apellidos}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  DNI
                </Typography>
                <Typography variant="body1">
                  {formData.dni}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {formData.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body1">
                  {formData.telefono}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Rol
                </Typography>
                <Typography variant="body1">
                  {formData.rol}
                  {formData.rol === 'DUENO' && formData.esFisioterapeuta && " (También fisioterapeuta)"}
                </Typography>
              </Grid>
              
              {(formData.rol === 'FISIOTERAPEUTA' || (formData.rol === 'DUENO' && formData.esFisioterapeuta)) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Número de colegiado
                    </Typography>
                    <Typography variant="body1">
                      {formData.numeroColegiado}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Especialidad
                    </Typography>
                    <Typography variant="body1">
                      {formData.especialidad}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Datos de la empresa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre de la empresa
                </Typography>
                <Typography variant="body1">
                  {formData.nombreEmpresa}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  CIF/NIF
                </Typography>
                <Typography variant="body1">
                  {formData.cifNif}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Dirección
                </Typography>
                <Typography variant="body1">
                  {formData.direccion}, {formData.codigoPostal}, {formData.ciudad}, {formData.provincia}, {formData.pais}
                </Typography>
              </Grid>
              {formData.web && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Página web
                  </Typography>
                  <Typography variant="body1">
                    {formData.web}
                  </Typography>
                </Grid>
              )}
              {logoPreview && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Logo de la empresa
                  </Typography>
                  <Box sx={{ maxWidth: '200px', mt: 1 }}>
                    <CompanyLogoPreview src={logoPreview} alt="Logo de empresa" />
                  </Box>
                </Grid>
              )}
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
              Al registrarte, recibirás un correo electrónico de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </Alert>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los términos y condiciones y la <Link to="/politica-privacidad" target="_blank" rel="noopener">política de privacidad</Link>
                </Typography>
              }
              sx={{ mt: 1 }}
            />
            {errors.aceptaTerminos && (
              <Typography color="error" variant="caption">
                {errors.aceptaTerminos}
              </Typography>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      {/* Navbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logoImg} alt="FisioAyuda Logo" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            FisioAyuda
          </Typography>
        </Box>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />}
        >
          Volver al inicio
        </Button>
      </Box>
      
      <Container maxWidth="md">
        <RegisterPaper elevation={3}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Registro de cuenta
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  size="large"
                  disabled={loading}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </form>
        </RegisterPaper>
        
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta? <Link to="/" style={{ textDecoration: 'none', color: 'primary.main' }}>Inicia sesión</Link>
          </Typography>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register; 