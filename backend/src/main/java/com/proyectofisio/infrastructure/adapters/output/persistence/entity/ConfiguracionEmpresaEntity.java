package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

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
@Table(name = "configuraciones_empresa")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionEmpresaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaEntity empresa;
    
    @Column(nullable = false)
    private String clave;
    
    @Column(columnDefinition = "TEXT")
    private String valor;
} 