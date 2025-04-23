package com.proyectofisio.infrastructure.adapters.input.rest;

import com.proyectofisio.application.ports.input.SalaServicePort;
import com.proyectofisio.domain.model.Sala;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salas")
public class SalaController {
    
    private final SalaServicePort salaServicePort;
    
    @Autowired
    public SalaController(SalaServicePort salaServicePort) {
        this.salaServicePort = salaServicePort;
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA')")
    public ResponseEntity<Sala> crearSala(@RequestBody Sala sala) {
        Sala nuevaSala = salaServicePort.createSala(sala);
        return new ResponseEntity<>(nuevaSala, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<Sala> getSalaPorId(@PathVariable UUID id) {
        try {
            Sala sala = salaServicePort.getSalaById(id);
            return new ResponseEntity<>(sala, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<List<Sala>> getAllSalas() {
        List<Sala> salas = salaServicePort.getAllSalas();
        return new ResponseEntity<>(salas, HttpStatus.OK);
    }
    
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<List<Sala>> getSalasByEmpresaId(@PathVariable UUID empresaId) {
        List<Sala> salas = salaServicePort.getSalasByEmpresaId(empresaId);
        return new ResponseEntity<>(salas, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA')")
    public ResponseEntity<Sala> actualizarSala(@PathVariable UUID id, @RequestBody Sala sala) {
        try {
            Sala salaActualizada = salaServicePort.updateSala(id, sala);
            return new ResponseEntity<>(salaActualizada, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarSala(@PathVariable UUID id) {
        try {
            salaServicePort.deleteSala(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
} 