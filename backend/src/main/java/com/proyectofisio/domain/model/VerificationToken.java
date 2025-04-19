package com.proyectofisio.domain.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationToken {
    private Long id;
    private String token;
    private String email;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaExpiracion;
    private boolean usado;
    private Long usuarioId;
} 