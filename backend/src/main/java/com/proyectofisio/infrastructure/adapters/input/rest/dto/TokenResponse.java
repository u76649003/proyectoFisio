package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private Long id;
    private UUID token;
    private Long pacienteId;
    private String pacienteNombre;
    private Long programaPersonalizadoId;
    private String programaNombre;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaExpiracion;
    private Boolean usado;
    private String enlaceAcceso;
} 