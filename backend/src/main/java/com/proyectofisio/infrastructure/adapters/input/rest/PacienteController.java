package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.proyectofisio.application.ports.input.PacienteServicePort;
import com.proyectofisio.domain.model.Paciente;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.PacienteControllerDocs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/pacientes")
@Tag(name = "Pacientes", description = "API para la gestión de pacientes")
@SecurityRequirement(name = "bearerAuth")
public class PacienteController implements PacienteControllerDocs {

    private final PacienteServicePort pacienteService;

    @Autowired
    public PacienteController(PacienteServicePort pacienteService) {
        this.pacienteService = pacienteService;
    }

    @Operation(summary = "Crear un nuevo paciente", description = "Crea un nuevo paciente en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Paciente creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos del paciente inválidos")
    })
    @Override
    @PostMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> crearPaciente(@RequestBody Paciente paciente) {
        try {
            Paciente nuevoPaciente = pacienteService.crearPaciente(paciente);
            return new ResponseEntity<>(nuevoPaciente, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Obtener paciente por ID", description = "Obtiene la información de un paciente específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> obtenerPacientePorId(
            @Parameter(description = "ID del paciente", required = true) @PathVariable Long id) {
        return pacienteService.obtenerPacientePorId(id)
                .map(paciente -> new ResponseEntity<>(paciente, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Paciente>> obtenerTodosLosPacientes() {
        return new ResponseEntity<>(pacienteService.obtenerTodosLosPacientes(), HttpStatus.OK);
    }

    @Override
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Paciente>> obtenerPacientesPorEmpresa(@PathVariable Long empresaId) {
        return new ResponseEntity<>(pacienteService.obtenerPacientesPorEmpresa(empresaId), HttpStatus.OK);
    }

    @Override
    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<?> obtenerPacientePorDni(@PathVariable String dni) {
        return pacienteService.obtenerPacientePorDni(dni)
                .map(paciente -> new ResponseEntity<>(paciente, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<?> obtenerPacientePorEmail(@PathVariable String email) {
        return pacienteService.obtenerPacientePorEmail(email)
                .map(paciente -> new ResponseEntity<>(paciente, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> actualizarPaciente(@PathVariable Long id, @RequestBody Paciente paciente) {
        try {
            paciente.setId(id);
            Paciente pacienteActualizado = pacienteService.actualizarPaciente(paciente);
            return new ResponseEntity<>(pacienteActualizado, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<Void> eliminarPaciente(@PathVariable Long id) {
        try {
            pacienteService.eliminarPaciente(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 