package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de programas personalizados con información detallada.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaPersonalizadoResponse {
    private Long id;
    private String nombre;
    private String tipoPrograma;
    private String descripcion;
    private Long empresaId;
    private String empresaNombre;
    private Long creadoPorUsuarioId;
    private String creadoPorUsuarioNombre;
    private Integer cantidadSubprogramas;
    private Integer cantidadEjercicios;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 