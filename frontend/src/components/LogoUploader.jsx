import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  FormControl, 
  FormHelperText,
  IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';

// Estilos personalizados para el input de archivo
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

const PreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 150,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(1),
  overflow: 'hidden',
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

/**
 * Componente para subir y previsualizar logos de empresa
 * 
 * @param {Object} props
 * @param {Function} props.onChange - Función a llamar cuando se selecciona un archivo
 * @param {string} props.error - Mensaje de error (si existe)
 * @param {string} props.value - Valor actual (archivo o URL)
 * @param {string} props.defaultPreview - URL para mostrar como vista previa por defecto
 * @param {string} props.name - Nombre del campo
 * @returns {JSX.Element} Componente de carga de logo
 */
const LogoUploader = ({
  onChange,
  error,
  value,
  defaultPreview = '',
  name = 'logo',
}) => {
  const [preview, setPreview] = useState('');
  
  // Validar el archivo seleccionado
  const validateFile = (file) => {
    // Verificar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return 'El archivo es demasiado grande. El tamaño máximo es de 2MB.';
    }
    
    // Verificar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de archivo no permitido. Use: JPG, PNG, GIF o SVG.';
    }
    
    return '';
  };
  
  // Manejar cambio de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      setPreview('');
      onChange && onChange(null, null);
      return;
    }
    
    // Validar archivo
    const validationError = validateFile(file);
    
    if (validationError) {
      onChange && onChange(null, validationError);
      return;
    }
    
    // Crear URL de vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Pasar archivo al componente padre
    onChange && onChange(file, '');
  };
  
  // Eliminar el archivo
  const handleRemove = () => {
    setPreview('');
    onChange && onChange(null, '');
  };
  
  // Actualizar la vista previa cuando cambia el valor por defecto
  useEffect(() => {
    if (defaultPreview && !preview) {
      setPreview(defaultPreview);
    }
  }, [defaultPreview, preview]);
  
  return (
    <FormControl error={!!error} fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" component="label" htmlFor={`${name}-upload`}>
          Logo de empresa
        </Typography>
        
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          size="small"
        >
          Seleccionar archivo
          <VisuallyHiddenInput 
            id={`${name}-upload`}
            type="file" 
            accept="image/png, image/jpeg, image/gif, image/svg+xml"
            onChange={handleFileChange} 
          />
        </Button>
      </Box>
      
      <PreviewContainer>
        {preview ? (
          <>
            <PreviewImage src={preview} alt="Vista previa del logo" />
            <IconButton 
              sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)' }}
              onClick={handleRemove}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No se ha seleccionado ningún logo
            </Typography>
          </>
        )}
      </PreviewContainer>
      
      <FormHelperText>
        {error || "Formatos permitidos: JPG, PNG, GIF, SVG. Tamaño máximo: 2MB"}
      </FormHelperText>
    </FormControl>
  );
};

export default LogoUploader; 