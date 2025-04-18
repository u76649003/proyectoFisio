package com.proyectofisio.infrastructure.adapters.input.rest.docs.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Modelo para la gestión de empresas y clínicas")
public class EmpresaModel {
    
    @Schema(description = "Identificador único de la empresa", example = "1")
    private Long id;
    
    @Schema(description = "Nombre comercial de la empresa", example = "FisioClínica Salud", required = true)
    private String nombre;
    
    @Schema(description = "Dirección de la empresa", example = "Avenida Principal 45, 28001 Madrid")
    private String direccion;
    
    @Schema(description = "Número de teléfono de contacto", example = "912345678")
    private String telefono;
    
    @Schema(description = "Correo electrónico de contacto", example = "contacto@fisioclinica.com")
    private String email;
    
    @Schema(description = "NIF/CIF de la empresa", example = "B12345678", required = true)
    private String nif;
    
    @Schema(description = "Sitio web de la empresa", example = "https://www.fisioclinica.com")
    private String web;
    
    @Schema(description = "URL del logotipo de la empresa", example = "https://cdn.fisioclinica.com/logo.png")
    private String logoUrl;
} 