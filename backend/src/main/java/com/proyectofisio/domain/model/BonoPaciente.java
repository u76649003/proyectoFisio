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
public class BonoPaciente {
    private Long id;
    private Long pacienteId;
    private Long productoId;
    private LocalDate fechaInicio;
    private Integer totalSesiones;
    private Integer sesionesUtilizadas;
    private Boolean activo;
} 