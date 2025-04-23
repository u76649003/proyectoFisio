package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioPacienteRequest {
    private String contenido;
    private Long programaPersonalizadoId;
    private Long pacienteId;
} 