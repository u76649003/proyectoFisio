package com.proyectofisio.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Factura {
    private Long id;
    private Long pacienteId;
    private Long empresaId;
    private LocalDate fecha;
    private BigDecimal total;
    private String estadoPago;
    private String metodoPago;
    private String numeroFactura;
} 