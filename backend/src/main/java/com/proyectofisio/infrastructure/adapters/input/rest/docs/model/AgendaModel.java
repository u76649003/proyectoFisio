package com.proyectofisio.infrastructure.adapters.input.rest.docs.model;

import java.time.LocalDate;
import java.time.LocalTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Modelo para la gestión de citas en la agenda")
public class AgendaModel {
    
    @Schema(description = "Identificador único de la cita", example = "1")
    private Long id;
    
    @Schema(description = "ID del paciente asignado a la cita", example = "42", required = true)
    private Long pacienteId;
    
    @Schema(description = "ID del usuario/profesional asignado a la cita", example = "15", required = true)
    private Long usuarioId;
    
    @Schema(description = "Fecha de la cita", example = "2023-06-15", required = true)
    private LocalDate fecha;
    
    @Schema(description = "Hora de inicio de la cita", example = "10:30", required = true)
    private LocalTime hora;
    
    @Schema(description = "Duración de la cita en minutos", example = "45", required = true)
    private Integer duracion;
    
    @Schema(description = "Estado actual de la cita", example = "CONFIRMADA", 
            allowableValues = {"PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"}, required = true)
    private String estado;
    
    @Schema(description = "Tipo de sesión o tratamiento", example = "Fisioterapia General")
    private String tipoSesion;
    
    @Schema(description = "Notas o comentarios sobre la cita", example = "Primera sesión, valoración inicial")
    private String notas;
} 