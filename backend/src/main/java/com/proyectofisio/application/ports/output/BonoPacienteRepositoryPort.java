package com.proyectofisio.application.ports.output;

import com.proyectofisio.domain.model.BonoPaciente;

import java.util.List;
import java.util.Optional;

public interface BonoPacienteRepositoryPort {
    
    BonoPaciente save(BonoPaciente bonoPaciente);
    
    Optional<BonoPaciente> findById(Long id);
    
    List<BonoPaciente> findAll();
    
    List<BonoPaciente> findByPacienteId(Long pacienteId);
    
    List<BonoPaciente> findByPacienteIdAndEstado(Long pacienteId, BonoPaciente.EstadoBono estado);
    
    List<BonoPaciente> findByServicioId(Long servicioId);
    
    void deleteById(Long id);
} 