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
public class PasoSubprograma {
    private Long id;
    private Integer numeroPaso;
    private String descripcion;
    private String videoReferencia;
    private Boolean esEnlaceExterno;
    private List<String> imagenesUrls;
    private Long subprogramaId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 