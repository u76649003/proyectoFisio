package com.proyectofisio.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {
    private Long id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String email;
    private String nif;
    private String web;
    private String logoUrl;
} 