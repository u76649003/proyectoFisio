package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la creación y actualización de empresas
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaDTO {
    
    @NotBlank(message = "El nombre de la empresa es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre de la empresa debe tener entre 2 y 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El CIF/NIF es obligatorio")
    @Pattern(regexp = "^([A-Z][0-9]{8}|[A-Z]-[0-9]{8}|[0-9]{8}[A-Z])$", 
             message = "El formato del CIF/NIF no es válido. Debe ser formato empresarial (B12345678 o B-12345678) o personal (12345678Z)")
    private String nif;
    
    private String direccion;
    
    private String codigoPostal;
    
    private String ciudad;
    
    private String provincia;
    
    private String pais;
    
    private String web;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String email;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "El formato del teléfono no es válido")
    private String telefono;
    
    private MultipartFile logo;
    
    private String logoUrl;
    
    // Constructor de conveniencia para crear un DTO a partir de un objeto de dominio
    public static EmpresaDTO fromDomainModel(com.proyectofisio.domain.model.Empresa empresa) {
        return EmpresaDTO.builder()
                .nombre(empresa.getNombre())
                .nif(empresa.getNif())
                .direccion(empresa.getDireccion())
                .email(empresa.getEmail())
                .telefono(empresa.getTelefono())
                .web(empresa.getWeb())
                .logoUrl(empresa.getLogoUrl())
                .build();
    }
} 