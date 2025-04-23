package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
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
@Table(name = "programas_personalizados")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaPersonalizadoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(name = "tipo_programa")
    private String tipoPrograma;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaEntity empresa;
    
    @ManyToOne
    @JoinColumn(name = "creado_por_usuario_id", nullable = false)
    private UsuarioEntity creadoPorUsuario;
    
    @OneToMany(mappedBy = "programaPersonalizado", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubprogramaEntity> subprogramas = new ArrayList<>();
    
    @OneToMany(mappedBy = "programaPersonalizado", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AccessTokenEntity> accessTokens = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
} 