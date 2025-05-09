package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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
@Table(name = "subprogramas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubprogramaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false)
    private Integer orden;
    
    @Column(name = "video_referencia")
    private String videoReferencia;
    
    @Column(name = "es_enlace_externo")
    private Boolean esEnlaceExterno;
    
    @ElementCollection
    @Column(name = "imagen_url")
    private List<String> imagenesUrls = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "programa_personalizado_id", nullable = false)
    private ProgramaPersonalizadoEntity programaPersonalizado;
    
    @OneToMany(mappedBy = "subprograma", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubprogramaEjercicioEntity> subprogramaEjercicios = new ArrayList<>();
    
    @OneToMany(mappedBy = "subprograma", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComentarioPacienteEntity> comentariosPaciente = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
} 