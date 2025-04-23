package com.proyectofisio.infrastructure.adapters.input.rest.docs;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.domain.model.Agenda.EstadoCita;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.AgendaRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.MessageResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Agenda", description = "API para la gestión de citas")
public interface AgendaControllerDocs {

    @Operation(summary = "Crear una nueva cita", description = "Crea una nueva cita en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cita creada correctamente", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<Agenda> crearCita(@RequestBody AgendaRequest agendaRequest);

    @Operation(summary = "Obtener una cita por su ID", description = "Devuelve una cita según su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita encontrada", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<Agenda> getCitaById(@PathVariable Long id);

    @Operation(summary = "Obtener todas las citas", description = "Devuelve todas las citas registradas en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getAllCitas();

    @Operation(summary = "Obtener citas por ID de paciente", description = "Devuelve las citas de un paciente específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas del paciente", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByPacienteId(@PathVariable Long pacienteId);

    @Operation(summary = "Obtener citas por ID de profesional", description = "Devuelve las citas de un profesional específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas del profesional", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByProfesionalId(@PathVariable Long profesionalId);

    @Operation(summary = "Obtener citas por fecha", description = "Devuelve las citas programadas para una fecha específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas para la fecha", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha);

    @Operation(summary = "Obtener citas por rango de fechas", description = "Devuelve las citas programadas dentro de un rango de fechas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas en el rango de fechas", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin);
            
    @Operation(summary = "Obtener citas por ID de empresa", description = "Devuelve las citas asociadas a una empresa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas de la empresa", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByEmpresaId(@PathVariable Long empresaId);

    @Operation(summary = "Obtener citas por ID de sala", description = "Devuelve las citas programadas en una sala específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas de la sala", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasBySalaId(@PathVariable Long salaId);

    @Operation(summary = "Obtener citas por ID de servicio", description = "Devuelve las citas asociadas a un servicio específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas del servicio", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByServicioId(@PathVariable Long servicioId);

    @Operation(summary = "Obtener citas por estado", description = "Devuelve las citas que tienen un estado específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas con el estado especificado", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Estado inválido", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content)
    })
    ResponseEntity<List<Agenda>> getCitasByEstado(@PathVariable String estado);

    @Operation(summary = "Actualizar cita", description = "Actualiza la información de una cita existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita actualizada correctamente", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada", 
                    content = @Content)
    })
    ResponseEntity<Agenda> updateCita(@PathVariable Long id, @RequestBody AgendaRequest agendaRequest);

    @Operation(summary = "Cancelar cita", description = "Cambia el estado de una cita a CANCELADA")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita cancelada correctamente", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada", 
                    content = @Content)
    })
    ResponseEntity<Agenda> cancelarCita(@PathVariable Long id);

    @Operation(summary = "Completar cita", description = "Cambia el estado de una cita a COMPLETADA")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita completada correctamente", 
                    content = @Content(schema = @Schema(implementation = Agenda.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada", 
                    content = @Content)
    })
    ResponseEntity<Agenda> completarCita(@PathVariable Long id);

    @Operation(summary = "Eliminar cita", description = "Elimina una cita del sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita eliminada correctamente", 
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", 
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado", 
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada", 
                    content = @Content)
    })
    ResponseEntity<MessageResponse> deleteCita(@PathVariable Long id);
} 