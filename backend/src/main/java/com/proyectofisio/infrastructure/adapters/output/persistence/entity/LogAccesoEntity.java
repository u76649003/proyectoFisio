package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDateTime;

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
@Table(name = "logs_acceso")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogAccesoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioEntity usuario;
    
    @Column(nullable = false)
    private String accion;
    
    @Column(name = "entidad_afectada")
    private String entidadAfectada;
    
    @Column(name = "referencia_id")
    private Long referenciaId;
    
    @Column(nullable = false)
    private LocalDateTime fecha;
    
    @Column(nullable = false)
    private String ip;
} 