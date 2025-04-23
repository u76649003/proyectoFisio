package com.proyectofisio.domain.model;

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
public class AccessToken {
    private Long id;
    private UUID token;
    private Long pacienteId;
    private Long programaPersonalizadoId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaExpiracion;
    private Boolean usado;
} 