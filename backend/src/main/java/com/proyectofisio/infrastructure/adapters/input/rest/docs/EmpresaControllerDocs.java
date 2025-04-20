package com.proyectofisio.infrastructure.adapters.input.rest.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.EmpresaDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Empresas", description = "API para la gestión de empresas y clínicas")
public interface EmpresaControllerDocs {

    @Operation(summary = "Crear una nueva empresa", description = "Crea una nueva empresa o clínica en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Empresa creada correctamente", 
                    content = @Content(schema = @Schema(implementation = Empresa.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o NIF duplicado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos de administrador"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> crearEmpresa(
            @Parameter(description = "Objeto empresa con los datos a crear", required = true) Empresa empresa);

    @Operation(summary = "Obtener empresa por ID", description = "Recupera los datos de una empresa específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Datos de la empresa encontrados",
                    content = @Content(schema = @Schema(implementation = Empresa.class))),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerEmpresaPorId(
            @Parameter(description = "ID de la empresa a buscar", required = true) Long id);

    @Operation(summary = "Listar todas las empresas", description = "Recupera la lista completa de todas las empresas registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de empresas recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Empresa.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Empresa>> obtenerTodasLasEmpresas();

    @Operation(summary = "Actualizar empresa", description = "Actualiza los datos de una empresa existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Empresa actualizada correctamente",
                    content = @Content(schema = @Schema(implementation = Empresa.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o NIF duplicado"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> actualizarEmpresa(
            @Parameter(description = "ID de la empresa a actualizar", required = true) Long id,
            @Parameter(description = "Objeto empresa con los datos actualizados", required = true) Empresa empresa);
    
    @Operation(summary = "Actualizar empresa con logo", description = "Actualiza los datos de una empresa existente incluyendo su logo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Empresa actualizada correctamente",
                    content = @Content(schema = @Schema(implementation = Empresa.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o NIF duplicado"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> actualizarEmpresaConLogo(
            @Parameter(description = "ID de la empresa a actualizar", required = true) Long id,
            @Parameter(description = "Objeto EmpresaDTO con los datos actualizados", required = true) EmpresaDTO empresaDTO,
            @Parameter(description = "Archivo del logo de la empresa", required = false) MultipartFile logo);

    @Operation(summary = "Eliminar empresa", description = "Elimina una empresa del sistema por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Empresa eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos de administrador"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<Void> eliminarEmpresa(
            @Parameter(description = "ID de la empresa a eliminar", required = true) Long id);
} 