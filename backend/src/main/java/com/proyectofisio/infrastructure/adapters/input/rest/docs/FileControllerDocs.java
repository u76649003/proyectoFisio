package com.proyectofisio.infrastructure.adapters.input.rest.docs;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Archivos", description = "API para la gestión de archivos (logos, documentos, etc.)")
public interface FileControllerDocs {

    @Operation(summary = "Actualizar logo de una empresa", description = "Actualiza la imagen del logo de una empresa y devuelve la URL")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logo actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> actualizarLogoEmpresa(
            @Parameter(description = "ID de la empresa", required = true) Long empresaId,
            @Parameter(description = "Archivo de imagen del logo", required = true) MultipartFile file);

    @Operation(summary = "Obtener archivo por nombre", description = "Recupera un archivo del servidor por su nombre")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Archivo recuperado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud"),
            @ApiResponse(responseCode = "404", description = "Archivo no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<Resource> getFile(
            @Parameter(description = "Nombre del archivo a obtener", required = true) String filename);
} 