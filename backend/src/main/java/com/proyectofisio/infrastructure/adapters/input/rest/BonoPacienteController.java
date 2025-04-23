package com.proyectofisio.infrastructure.adapters.input.rest;

import com.proyectofisio.application.ports.input.BonoPacienteServicePort;
import com.proyectofisio.domain.model.BonoPaciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class BonoPacienteController {
    
    private final BonoPacienteServicePort bonoPacienteServicePort;
    
    @Autowired
    public BonoPacienteController(BonoPacienteServicePort bonoPacienteServicePort) {
        this.bonoPacienteServicePort = bonoPacienteServicePort;
    }
    
    @PostMapping("/{pacienteId}/bonos")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA')")
    public ResponseEntity<BonoPaciente> crearBonoPaciente(
            @PathVariable Long pacienteId,
            @RequestBody BonoPaciente bonoPaciente) {
        // Asegurar que el ID del paciente en el path y en el body coinciden
        bonoPaciente.setPacienteId(pacienteId);
        BonoPaciente nuevoBono = bonoPacienteServicePort.createBonoPaciente(bonoPaciente);
        return new ResponseEntity<>(nuevoBono, HttpStatus.CREATED);
    }
    
    @GetMapping("/{pacienteId}/bonos/{bonoId}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<BonoPaciente> getBonoPorId(
            @PathVariable Long pacienteId,
            @PathVariable Long bonoId) {
        try {
            BonoPaciente bono = bonoPacienteServicePort.getBonoPacienteById(bonoId);
            
            // Verificar que el bono pertenece al paciente solicitado
            if (!bono.getPacienteId().equals(pacienteId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            return new ResponseEntity<>(bono, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/{pacienteId}/bonos")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<List<BonoPaciente>> getBonosByPacienteId(
            @PathVariable Long pacienteId,
            @RequestParam(required = false) String estado) {
        
        List<BonoPaciente> bonos;
        
        // Si se proporciona un estado, filtrar por estado
        if (estado != null && !estado.isEmpty()) {
            try {
                BonoPaciente.EstadoBono estadoBono = BonoPaciente.EstadoBono.valueOf(estado.toUpperCase());
                bonos = bonoPacienteServicePort.getBonosByPacienteIdAndEstado(pacienteId, estadoBono);
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            bonos = bonoPacienteServicePort.getBonosByPacienteId(pacienteId);
        }
        
        return new ResponseEntity<>(bonos, HttpStatus.OK);
    }
    
    @PutMapping("/{pacienteId}/bonos/{bonoId}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA')")
    public ResponseEntity<BonoPaciente> actualizarBonoPaciente(
            @PathVariable Long pacienteId,
            @PathVariable Long bonoId,
            @RequestBody BonoPaciente bonoPaciente) {
        try {
            // Verificar que el bono existe y pertenece al paciente
            BonoPaciente bonoExistente = bonoPacienteServicePort.getBonoPacienteById(bonoId);
            
            if (!bonoExistente.getPacienteId().equals(pacienteId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            // Actualizar el bono
            bonoPaciente.setPacienteId(pacienteId);
            BonoPaciente bonoActualizado = bonoPacienteServicePort.updateBonoPaciente(bonoId, bonoPaciente);
            return new ResponseEntity<>(bonoActualizado, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{pacienteId}/bonos/{bonoId}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarBonoPaciente(
            @PathVariable Long pacienteId,
            @PathVariable Long bonoId) {
        try {
            // Verificar que el bono existe y pertenece al paciente
            BonoPaciente bonoExistente = bonoPacienteServicePort.getBonoPacienteById(bonoId);
            
            if (!bonoExistente.getPacienteId().equals(pacienteId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            bonoPacienteServicePort.deleteBonoPaciente(bonoId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
} 