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
} 