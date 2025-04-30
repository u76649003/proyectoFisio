package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase para la clave compuesta de SubprogramaEjercicioEntity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubprogramaEjercicioId implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long subprograma;
    private Long ejercicio;
} 