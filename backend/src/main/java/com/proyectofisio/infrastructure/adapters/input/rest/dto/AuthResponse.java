package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String rol;
    private String token;
    private Long empresaId; // ID de la empresa asociada, si existe
    
    // Constructor sin empresaId para compatibilidad con código existente
    public AuthResponse(Long id, String nombre, String apellidos, String email, String rol, String token) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.rol = rol;
        this.token = token;
    }
} 