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
public class LogAcceso {
    private Long id;
    private Long usuarioId;
    private String accion;
    private String entidadAfectada;
    private Long referenciaId;
    private LocalDateTime fecha;
    private String ip;
} 