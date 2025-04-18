package com.proyectofisio.domain.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private String dni;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String sexo;
    private Long empresaId;
    private LocalDate fechaAlta;
} 