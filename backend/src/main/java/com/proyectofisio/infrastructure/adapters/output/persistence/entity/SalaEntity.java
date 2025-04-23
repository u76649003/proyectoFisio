package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sala")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private Integer capacidad;
    
    private String equipamiento;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoSala estado;
    
    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    public enum EstadoSala {
        DISPONIBLE, OCUPADA, MANTENIMIENTO
    }
} 