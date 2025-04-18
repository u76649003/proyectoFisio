package com.proyectofisio.infrastructure.adapters.input.rest.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.proyectofisio.domain.model.Paciente;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Pacientes", description = "API para la gestión de pacientes")
public interface PacienteControllerDocs {

    @Operation(summary = "Crear un nuevo paciente", description = "Crea un nuevo paciente en el sistema con validación de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Paciente creado correctamente", 
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados (DNI o email ya existen)"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> crearPaciente(
            @Parameter(description = "Objeto paciente con los datos a crear", required = true) Paciente paciente);

    @Operation(summary = "Obtener paciente por ID", description = "Recupera los datos de un paciente específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Datos del paciente encontrados",
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerPacientePorId(
            @Parameter(description = "ID del paciente a buscar", required = true) Long id);

    @Operation(summary = "Listar todos los pacientes", description = "Recupera la lista completa de todos los pacientes registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pacientes recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Paciente>> obtenerTodosLosPacientes();

    @Operation(summary = "Listar pacientes por empresa", description = "Recupera la lista de pacientes filtrada por una empresa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pacientes de la empresa recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Paciente>> obtenerPacientesPorEmpresa(
            @Parameter(description = "ID de la empresa para filtrar pacientes", required = true) Long empresaId);

    @Operation(summary = "Buscar paciente por DNI", description = "Recupera los datos de un paciente específico por su DNI")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente encontrado por DNI",
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerPacientePorDni(
            @Parameter(description = "DNI del paciente a buscar", required = true) String dni);

    @Operation(summary = "Buscar paciente por email", description = "Recupera los datos de un paciente específico por su email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente encontrado por email",
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerPacientePorEmail(
            @Parameter(description = "Email del paciente a buscar", required = true) String email);

    @Operation(summary = "Actualizar paciente", description = "Actualiza los datos de un paciente existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente actualizado correctamente",
                    content = @Content(schema = @Schema(implementation = Paciente.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o conflicto con datos existentes"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> actualizarPaciente(
            @Parameter(description = "ID del paciente a actualizar", required = true) Long id,
            @Parameter(description = "Objeto paciente con los datos actualizados", required = true) Paciente paciente);

    @Operation(summary = "Eliminar paciente", description = "Elimina un paciente del sistema por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Paciente eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<Void> eliminarPaciente(
            @Parameter(description = "ID del paciente a eliminar", required = true) Long id);
} 