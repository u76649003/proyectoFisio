package com.proyectofisio.infrastructure.util;

import org.springframework.util.StringUtils;

/**
 * Utilidades para formatear y validar NIF/CIF
 */
public class NifCifUtils {

    /**
     * Formatea un NIF/CIF al formato estándar
     * - CIF (empresas): Letra seguida de números, sin guión (B12345678)
     * - NIF (personas): Números seguidos de letra (12345678Z)
     *
     * @param value El NIF/CIF a formatear
     * @return El NIF/CIF formateado
     */
    public static String formatearNifCif(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }

        // Convertir a mayúsculas y eliminar espacios
        String formatted = value.trim().toUpperCase();
        
        // Eliminar caracteres no alfanuméricos excepto guiones
        formatted = formatted.replaceAll("[^A-Z0-9-]", "");
        
        // Formato para CIF (empieza con letra)
        if (formatted.matches("^[A-Z].*")) {
            // Eliminar guiones si existen
            if (formatted.charAt(1) == '-') {
                formatted = formatted.charAt(0) + formatted.substring(2);
            }
        } 
        // Formato para NIF (empieza con número)
        else if (formatted.matches("^[0-9].*")) {
            // Eliminar cualquier guión
            formatted = formatted.replaceAll("-", "");
        }
        
        return formatted;
    }
    
    /**
     * Valida si un NIF/CIF tiene un formato correcto
     *
     * @param value El NIF/CIF a validar
     * @return true si el formato es correcto, false en caso contrario
     */
    public static boolean esNifCifValido(String value) {
        if (!StringUtils.hasText(value)) {
            return false;
        }
        
        // Eliminar guiones y espacios
        String cleaned = value.replaceAll("[-\\s]", "").toUpperCase();
        
        // CIF: Una letra seguida de 8 dígitos
        boolean esCIF = cleaned.matches("^[A-HJNPQRSUVW][0-9]{7}[0-9A-J]$");
        
        // NIF: 8 dígitos seguidos de una letra
        boolean esNIF = cleaned.matches("^[0-9]{8}[A-Z]$");
        
        // NIE: X, Y o Z seguido de 7 dígitos y una letra
        boolean esNIE = cleaned.matches("^[XYZ][0-9]{7}[A-Z]$");
        
        return esCIF || esNIF || esNIE;
    }
} 