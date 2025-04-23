package com.proyectofisio.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sala {
    private UUID id;
    private String nombre;
    private Integer capacidad;
    private String equipamiento;
    private EstadoSala estado;
    private UUID empresaId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public enum EstadoSala {
        DISPONIBLE, OCUPADA, MANTENIMIENTO
    }
} 