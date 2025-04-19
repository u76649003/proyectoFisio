package com.proyectofisio.application.ports.input;

import java.util.Optional;

import com.proyectofisio.domain.model.VerificationToken;

public interface VerificationTokenServicePort {
    
    /**
     * Crea un nuevo token de verificación para un usuario
     * 
     * @param email El email del usuario
     * @param usuarioId El ID del usuario (opcional)
     * @return El token generado
     */
    String crearToken(String email, Long usuarioId);
    
    /**
     * Verifica si un token es válido
     * 
     * @param token El token a verificar
     * @return true si el token es válido, false en caso contrario
     */
    boolean esValido(String token);
    
    /**
     * Marca un token como usado
     * 
     * @param token El token a marcar como usado
     * @return true si se pudo marcar, false en caso contrario
     */
    boolean marcarComoUsado(String token);
    
    /**
     * Busca un token por su valor
     * 
     * @param token El valor del token
     * @return El token si existe
     */
    Optional<VerificationToken> buscarPorToken(String token);
    
    /**
     * Busca un token por email
     * 
     * @param email El email asociado al token
     * @return El token si existe
     */
    Optional<VerificationToken> buscarPorEmail(String email);
} 