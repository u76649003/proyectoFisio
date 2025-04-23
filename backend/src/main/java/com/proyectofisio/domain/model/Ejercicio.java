package com.proyectofisio.domain.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ejercicio {
    private Long id;
    private String nombre;
    private String descripcion;
    private String urlVideo;
    private Boolean esVideoExterno;
    private String instrucciones;
    private Integer repeticiones;
    private Integer duracionSegundos;
    private Integer orden;
    private Long empresaId;
    private Long creadoPorUsuarioId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 