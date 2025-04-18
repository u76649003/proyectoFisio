package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "facturas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private PacienteEntity paciente;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaEntity empresa;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(nullable = false)
    private BigDecimal total;
    
    @Column(name = "estado_pago", nullable = false)
    private String estadoPago;
    
    @Column(name = "metodo_pago")
    private String metodoPago;
    
    @Column(name = "numero_factura", unique = true, nullable = false)
    private String numeroFactura;
    
    @OneToMany(mappedBy = "factura")
    private List<FacturaProductoEntity> lineasFactura;
} 