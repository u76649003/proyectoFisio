package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EjercicioRequest {
    private String nombre;
    private String descripcion;
    private String urlVideo;
    private Boolean esVideoExterno;
    private String instrucciones;
    private Integer repeticiones;
    private Integer duracionSegundos;
} 