package com.proyectofisio.domain.model;

import java.time.LocalDate;
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
public class BonoPaciente {
    private UUID id;
    private UUID pacienteId;
    private UUID servicioId;
    private Long productoId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer sesionesIniciales;
    private Integer sesionesRestantes;
    private EstadoBono estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public enum EstadoBono {
        ACTIVO, COMPLETADO, CANCELADO
    }
} 