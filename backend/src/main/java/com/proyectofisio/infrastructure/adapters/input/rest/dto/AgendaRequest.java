package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para las solicitudes de creación y actualización de citas
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendaRequest {
    private String pacienteId;
    private String profesionalId;
    private String fechaHoraInicio;
    private String fechaHoraFin;
    private String salaId;
    private String servicioId;
    private String empresaId;
    private String observaciones;
    private String estado;
} 