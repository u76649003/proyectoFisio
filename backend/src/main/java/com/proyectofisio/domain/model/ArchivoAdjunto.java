package com.proyectofisio.domain.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchivoAdjunto {
    private Long id;
    private String tipo;
    private String url;
    private LocalDate fecha;
    private String entidadReferencia;
    private Long referenciaId;
} 