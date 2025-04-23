package com.proyectofisio.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sala {
    private Long id;
    private String nombre;
    private Integer capacidad;
    private String equipamiento;
    private EstadoSala estado;
    private Long empresaId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public enum EstadoSala {
        DISPONIBLE, OCUPADA, MANTENIMIENTO
    }
} 