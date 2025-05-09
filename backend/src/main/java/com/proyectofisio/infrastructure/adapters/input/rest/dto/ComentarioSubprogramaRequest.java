package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioSubprogramaRequest {
    private String contenido;
    private Long subprogramaId;
    private String token;
} 