package com.proyectofisio.infrastructure.adapters.input.rest.docs.model;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Modelo para la gestión de pacientes")
public class PacienteModel {
    
    @Schema(description = "Identificador único del paciente", example = "1")
    private Long id;
    
    @Schema(description = "Nombre del paciente", example = "Juan", required = true)
    private String nombre;
    
    @Schema(description = "Apellidos del paciente", example = "García López", required = true)
    private String apellidos;
    
    @Schema(description = "Correo electrónico del paciente", example = "juangarcia@email.com")
    private String email;
    
    @Schema(description = "Número de teléfono del paciente", example = "612345678")
    private String telefono;
    
    @Schema(description = "DNI/NIE del paciente", example = "12345678A")
    private String dni;
    
    @Schema(description = "Fecha de nacimiento del paciente", example = "1985-07-15")
    private LocalDate fechaNacimiento;
    
    @Schema(description = "Dirección postal del paciente", example = "Calle Principal 23, 28001 Madrid")
    private String direccion;
    
    @Schema(description = "Sexo del paciente", example = "M", allowableValues = {"M", "F"})
    private String sexo;
    
    @Schema(description = "ID de la empresa a la que pertenece el paciente", example = "1")
    private Long empresaId;
    
    @Schema(description = "Fecha de alta del paciente en el sistema", example = "2023-01-15")
    private LocalDate fechaAlta;
} 