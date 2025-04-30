package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase para representar la relación entre Subprograma y Ejercicio
 * con un atributo adicional para el orden del ejercicio en el subprograma
 */
@Entity
@Table(name = "subprograma_ejercicio")
@IdClass(SubprogramaEjercicioId.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubprogramaEjercicioEntity {
    
    @Id
    @ManyToOne
    @JoinColumn(name = "subprograma_id")
    private SubprogramaEntity subprograma;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "ejercicio_id")
    private EjercicioEntity ejercicio;
    
    @Column(nullable = false)
    private Integer orden;
}

/**
 * Clase para la clave compuesta de SubprogramaEjercicioEntity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
class SubprogramaEjercicioId implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long subprograma;
    private Long ejercicio;
} 