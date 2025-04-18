package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "facturas_productos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturaProductoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "factura_id", nullable = false)
    private FacturaEntity factura;
    
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private ProductoEntity producto;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;
    
    @Column(name = "total_linea", nullable = false)
    private BigDecimal totalLinea;
} 