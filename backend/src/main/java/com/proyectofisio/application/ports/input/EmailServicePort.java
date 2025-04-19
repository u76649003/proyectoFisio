package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.Usuario;

public interface EmailServicePort {
    
    /**
     * Envía un correo electrónico de verificación de cuenta
     * 
     * @param usuario El usuario que se ha registrado
     * @param token El token de verificación generado
     * @return true si el correo se envió correctamente, false en caso contrario
     */
    boolean enviarCorreoVerificacion(Usuario usuario, String token);
    
    /**
     * Envía un correo electrónico simple
     * 
     * @param destinatario La dirección de correo del destinatario
     * @param asunto El asunto del correo
     * @param contenido El contenido HTML del correo
     * @return true si el correo se envió correctamente, false en caso contrario
     */
    boolean enviarCorreo(String destinatario, String asunto, String contenido);
} 