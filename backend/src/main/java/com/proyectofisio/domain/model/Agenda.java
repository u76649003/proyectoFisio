package com.proyectofisio.domain.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agenda {
    private Long id;
    private UUID pacienteId;
    private UUID usuarioId;
    private UUID salaId;
    private UUID servicioId;
    private UUID bonoId;
    private LocalDate fecha;
    private LocalTime hora;
    private Integer duracion;
    private String estado;
    private String tipoSesion;
    private String notas;
    
    public enum EstadoCita {
        PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA
    }
} 