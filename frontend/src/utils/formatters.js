/**
 * Utilidades para formatear datos en la aplicación
 */

/**
 * Formatea un CIF/NIF según las reglas españolas
 * 
 * - CIF (empresas): Letra-Números o Letra-Guión-Números
 * - NIF (personas): Números-Letra
 * 
 * @param {string} value - El valor a formatear
 * @returns {string} - El valor formateado
 */
export const formatCifNif = (value) => {
  if (!value) return '';

  // Eliminar espacios y convertir a mayúsculas
  value = value.trim().toUpperCase();
  
  // Eliminar todos los caracteres no alfanuméricos excepto el guión
  value = value.replace(/[^A-Z0-9-]/g, '');
  
  // Si empieza con letra (CIF)
  if (/^[A-Z]/.test(value)) {
    // Si ya tiene guión después de la letra, mantenerlo
    if (value.charAt(1) === '-') {
      return value;
    }
    
    // Separar la letra inicial de los números
    const letra = value.charAt(0);
    const resto = value.substring(1);
    
    // Para CIF, devolvemos letra-resto
    return letra + resto;
  } 
  // Si es un NIF (comienza con números)
  else if (/^[0-9]/.test(value)) {
    // Eliminar cualquier guión
    value = value.replace(/-/g, '');
    return value;
  }
  
  // Si no se pudo procesar, devolver el valor original
  return value;
};

/**
 * Valida si un CIF/NIF tiene un formato correcto
 * 
 * @param {string} value - El valor a validar
 * @returns {boolean} - True si es válido, false en caso contrario
 */
export const isValidCifNif = (value) => {
  if (!value) return false;
  
  // Patrón para CIF: una letra seguida de 7-8 números
  const patronCIF = /^[A-HJNPQRSUVW][0-9]{7,8}[A-J]?$/;
  
  // Patrón para NIF: 8 números seguidos de una letra
  const patronNIF = /^[0-9]{8}[A-Z]$/;
  
  // Patrón para NIE: X, Y o Z seguido de 7 números y una letra
  const patronNIE = /^[XYZ][0-9]{7}[A-Z]$/;
  
  // Eliminar guiones y espacios
  const cleaned = value.replace(/[-\s]/g, '').toUpperCase();
  
  // Comprobar si coincide con alguno de los patrones
  return patronCIF.test(cleaned) || patronNIF.test(cleaned) || patronNIE.test(cleaned);
}; 