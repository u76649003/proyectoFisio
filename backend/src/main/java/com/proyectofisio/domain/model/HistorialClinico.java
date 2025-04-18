package com.proyectofisio.domain.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistorialClinico {
    private Long id;
    private Long pacienteId;
    private String descripcion;
    private String diagnostico;
    private String tratamiento;
    private LocalDate fechaInicio;
    private LocalDate fechaUltimaActualizacion;
    private String documentosUrl;
} 