package com.proyectofisio.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Servicio {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer duracion;
    private BigDecimal precio;
    private Boolean esBono;
    private Integer numeroSesiones;
    private Long empresaId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 