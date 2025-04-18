package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "archivos_adjuntos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchivoAdjuntoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(nullable = false)
    private String url;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(name = "entidad_referencia", nullable = false)
    private String entidadReferencia;
    
    @Column(name = "referencia_id", nullable = false)
    private Long referenciaId;
} 