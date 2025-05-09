package com.proyectofisio.infrastructure.adapters.input.rest;

import com.proyectofisio.application.ports.input.SalaServicePort;
import com.proyectofisio.domain.model.Sala;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaController {
    
    private final SalaServicePort salaServicePort;
    
    @Autowired
    public SalaController(SalaServicePort salaServicePort) {
        this.salaServicePort = salaServicePort;
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<Sala> crearSala(@RequestBody Sala sala) {
        Sala nuevaSala = salaServicePort.createSala(sala);
        return new ResponseEntity<>(nuevaSala, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Sala> getSalaPorId(@PathVariable Long id) {
        try {
            Sala sala = salaServicePort.getSalaById(id);
            return new ResponseEntity<>(sala, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Sala>> getAllSalas() {
        List<Sala> salas = salaServicePort.getAllSalas();
        return new ResponseEntity<>(salas, HttpStatus.OK);
    }
    
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Sala>> getSalasByEmpresaId(@PathVariable Long empresaId) {
        List<Sala> salas = salaServicePort.getSalasByEmpresaId(empresaId);
        return new ResponseEntity<>(salas, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('ADMINISTRADOR') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<Sala> actualizarSala(@PathVariable Long id, @RequestBody Sala sala) {
        try {
            Sala salaActualizada = salaServicePort.updateSala(id, sala);
            return new ResponseEntity<>(salaActualizada, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarSala(@PathVariable Long id) {
        try {
            salaServicePort.deleteSala(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
} 