package com.proyectofisio.domain.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subprograma {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer orden;
    private Long programaPersonalizadoId;
    private List<Ejercicio> ejercicios;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 