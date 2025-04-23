package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubprogramaRequest {
    private String nombre;
    private String descripcion;
    private Integer orden;
    private Long programaPersonalizadoId;
} 