package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ejercicios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EjercicioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    private String descripcion;
    
    @Column(name = "url_video")
    private String urlVideo;
    
    @Column(name = "es_video_externo")
    private Boolean esVideoExterno;
    
    @Column(columnDefinition = "TEXT")
    private String instrucciones;
    
    private Integer repeticiones;
    
    @Column(name = "duracion_segundos")
    private Integer duracionSegundos;
    
    private Integer orden;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaEntity empresa;
    
    @ManyToOne
    @JoinColumn(name = "creado_por_usuario_id", nullable = false)
    private UsuarioEntity creadoPorUsuario;
    
    @ManyToMany(mappedBy = "ejercicios")
    @Builder.Default
    private List<SubprogramaEntity> subprogramas = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
} 