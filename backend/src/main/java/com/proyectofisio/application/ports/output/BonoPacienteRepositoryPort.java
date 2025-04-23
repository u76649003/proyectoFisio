package com.proyectofisio.application.ports.output;

import com.proyectofisio.domain.model.BonoPaciente;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BonoPacienteRepositoryPort {
    
    BonoPaciente save(BonoPaciente bonoPaciente);
    
    Optional<BonoPaciente> findById(UUID id);
    
    List<BonoPaciente> findAll();
    
    List<BonoPaciente> findByPacienteId(UUID pacienteId);
    
    List<BonoPaciente> findByPacienteIdAndEstado(UUID pacienteId, BonoPaciente.EstadoBono estado);
    
    List<BonoPaciente> findByServicioId(UUID servicioId);
    
    void deleteById(UUID id);
} 