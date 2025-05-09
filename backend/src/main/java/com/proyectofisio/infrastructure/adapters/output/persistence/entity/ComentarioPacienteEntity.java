package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "comentarios_paciente")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioPacienteEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "subprograma_id", nullable = false)
    private SubprogramaEntity subprograma;
    
    @ManyToOne
    @JoinColumn(name = "access_token_id", nullable = false)
    private AccessTokenEntity accessToken;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean leido = false;
} 