package com.proyectofisio.domain.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaPersonalizado {
    private Long id;
    private String nombre;
    private String tipoPrograma;
    private Long empresaId;
    private Long creadoPorUsuarioId;
    private List<Subprograma> subprogramas;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 