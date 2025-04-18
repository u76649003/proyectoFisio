package com.proyectofisio.domain.model;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturaProducto {
    private Long id;
    private Long facturaId;
    private Long productoId;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal totalLinea;
} 