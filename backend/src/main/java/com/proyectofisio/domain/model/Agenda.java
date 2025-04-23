package com.proyectofisio.domain.model;

import java.time.LocalDate;
import java.time.LocalTime;

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
    private Long pacienteId;
    private Long usuarioId;
    private Long salaId;
    private Long servicioId;
    private Long bonoId;
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