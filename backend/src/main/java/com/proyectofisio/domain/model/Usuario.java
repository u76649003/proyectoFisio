package com.proyectofisio.domain.model;

import java.time.LocalDate;

import com.proyectofisio.domain.model.enums.RolUsuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private String dni;
    private String numeroColegiado;
    private String especialidad;
    private RolUsuario rol;
    private String contraseña;
    private Long empresaId;
    private LocalDate fechaAlta;
    private boolean emailVerificado;
} 