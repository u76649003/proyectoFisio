package com.proyectofisio.infrastructure.adapters.input.rest.docs.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Modelo para la gestión de usuarios del sistema")
public class UsuarioModel {
    
    @Schema(description = "Identificador único del usuario", example = "1")
    private Long id;
    
    @Schema(description = "Nombre del usuario", example = "María", required = true)
    private String nombre;
    
    @Schema(description = "Apellidos del usuario", example = "Rodríguez Pérez", required = true)
    private String apellidos;
    
    @Schema(description = "Correo electrónico del usuario (usado para login)", example = "maria.rodriguez@fisioclinica.com", required = true)
    private String email;
    
    @Schema(description = "Contraseña del usuario (solo requerida en creación)", example = "********")
    private String contraseña;
    
    @Schema(description = "DNI/NIE del usuario", example = "12345678A")
    private String dni;
    
    @Schema(description = "Número de teléfono del usuario", example = "612345678")
    private String telefono;
    
    @Schema(description = "Rol del usuario en el sistema", example = "FISIOTERAPEUTA", 
            allowableValues = {"ADMINISTRADOR", "DUENO", "FISIOTERAPEUTA", "RECEPCIONISTA"}, 
            required = true)
    private String rol;
    
    @Schema(description = "ID de la empresa a la que pertenece el usuario", example = "1")
    private Long empresaId;
    
    @Schema(description = "Número de colegiado (solo para fisioterapeutas)", example = "12345")
    private String numeroColegiado;
    
    @Schema(description = "Especialidad del profesional", example = "Fisioterapia Deportiva")
    private String especialidad;
    
    @Schema(description = "URL de la foto de perfil del usuario", example = "https://cdn.fisioclinica.com/perfiles/maria.jpg")
    private String fotoUrl;
    
    @Schema(description = "Estado del usuario", example = "ACTIVO", 
            allowableValues = {"ACTIVO", "INACTIVO", "SUSPENDIDO"})
    private String estado;
} 