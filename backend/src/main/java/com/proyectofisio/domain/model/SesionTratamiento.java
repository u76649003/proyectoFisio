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
public class SesionTratamiento {
    private Long id;
    private Long pacienteId;
    private Long usuarioId;
    private LocalDate fecha;
    private String descripcion;
    private String tecnicasAplicadas;
    private String recomendaciones;
    private String evolucion;
    private String adjuntosUrl;
} 