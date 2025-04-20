package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la creación y actualización de usuarios
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
    private String apellidos;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).*$", 
             message = "La contraseña debe contener al menos un número, una letra y un caracter especial")
    private String contraseña;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "El formato del teléfono no es válido")
    private String telefono;
    
    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^[0-9]{8}[A-Za-z]$", message = "El formato del DNI no es válido")
    private String dni;
    
    private String numeroColegiado;
    
    private String especialidad;
    
    @NotNull(message = "El rol es obligatorio")
    private String rol;
    
    private LocalDate fechaAlta;
    
    private Long empresaId;
    
    // Constructor de conveniencia para crear un DTO a partir de un objeto de dominio
    public static UsuarioDTO fromDomainModel(com.proyectofisio.domain.model.Usuario usuario) {
        return UsuarioDTO.builder()
                .nombre(usuario.getNombre())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .dni(usuario.getDni())
                .numeroColegiado(usuario.getNumeroColegiado())
                .especialidad(usuario.getEspecialidad())
                .rol(usuario.getRol().name())
                .fechaAlta(usuario.getFechaAlta())
                .empresaId(usuario.getEmpresaId())
                .build();
    }
} 