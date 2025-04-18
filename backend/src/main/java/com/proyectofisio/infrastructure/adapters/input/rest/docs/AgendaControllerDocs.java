package com.proyectofisio.infrastructure.adapters.input.rest.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.proyectofisio.domain.model.Agenda;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Agenda", description = "API para la gestión de citas y horarios")
public interface AgendaControllerDocs {

    @Operation(summary = "Crear nueva cita", description = "Crea una nueva cita o reserva de horario para un paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cita creada correctamente", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o conflicto de horarios"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> crearCita(
            @Parameter(description = "Objeto agenda con los datos de la cita a crear", required = true) Agenda agenda);

    @Operation(summary = "Obtener cita por ID", description = "Recupera los datos de una cita específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Datos de la cita encontrados",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerCitaPorId(
            @Parameter(description = "ID de la cita a buscar", required = true) Long id);

    @Operation(summary = "Listar todas las citas", description = "Recupera la lista completa de todas las citas registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Agenda>> obtenerTodasLasCitas();

    @Operation(summary = "Listar citas por paciente", description = "Recupera la lista de citas filtrada por un paciente específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas del paciente recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Agenda>> obtenerCitasPorPaciente(
            @Parameter(description = "ID del paciente para filtrar citas", required = true) Long pacienteId);

    @Operation(summary = "Listar citas por profesional", description = "Recupera la lista de citas filtrada por un profesional/usuario específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas del profesional recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Agenda>> obtenerCitasPorProfesional(
            @Parameter(description = "ID del profesional para filtrar citas", required = true) Long usuarioId);

    @Operation(summary = "Listar citas por fecha", description = "Recupera la lista de citas filtrada por una fecha específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas de la fecha recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Agenda>> obtenerCitasPorFecha(
            @Parameter(description = "Fecha para filtrar citas (formato YYYY-MM-DD)", required = true) String fecha);

    @Operation(summary = "Actualizar cita", description = "Actualiza los datos de una cita existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita actualizada correctamente",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o conflicto de horarios"),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> actualizarCita(
            @Parameter(description = "ID de la cita a actualizar", required = true) Long id,
            @Parameter(description = "Objeto agenda con los datos actualizados", required = true) Agenda agenda);

    @Operation(summary = "Cancelar cita", description = "Cambia el estado de una cita a 'Cancelada'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita cancelada correctamente",
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> cancelarCita(
            @Parameter(description = "ID de la cita a cancelar", required = true) Long id);

    @Operation(summary = "Eliminar cita", description = "Elimina una cita del sistema por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cita eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<Void> eliminarCita(
            @Parameter(description = "ID de la cita a eliminar", required = true) Long id);
} 