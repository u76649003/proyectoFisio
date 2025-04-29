package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.PacienteServicePort;
import com.proyectofisio.domain.model.Paciente;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.PacienteControllerDocs;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController implements PacienteControllerDocs {

    private final PacienteServicePort pacienteService;

    @Autowired
    public PacienteController(PacienteServicePort pacienteService) {
        this.pacienteService = pacienteService;
    }

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

    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> obtenerPacientePorId(@PathVariable Long id) {
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