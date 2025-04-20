package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.UsuarioDTO;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.EmpresaDTO;

/**
 * DTO para el registro completo que combina usuario y empresa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroCompletoDTO {
    
    @Valid
    @NotNull(message = "Los datos de usuario son obligatorios")
    private UsuarioDTO usuario;
    
    @Valid
    @NotNull(message = "Los datos de empresa son obligatorios")
    private EmpresaDTO empresa;
} 