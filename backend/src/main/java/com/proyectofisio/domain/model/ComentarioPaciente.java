package com.proyectofisio.domain.model;

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
public class ComentarioPaciente {
    private Long id;
    private Long subprogramaId;
    private UUID token;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private Boolean leido;
} 