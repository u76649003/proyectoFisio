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
public class Producto {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer iva;
    private String tipoProducto;
} 