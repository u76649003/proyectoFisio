package com.proyectofisio.application.ports.output;

import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Paciente;

public interface PacienteRepositoryPort {
    
    Paciente save(Paciente paciente);
    
    Optional<Paciente> findById(Long id);
    
    List<Paciente> findAll();
    
    List<Paciente> findByEmpresaId(Long empresaId);
    
    void deleteById(Long id);
    
    boolean existsByDni(String dni);
    
    boolean existsByEmail(String email);
    
    Optional<Paciente> findByDni(String dni);
    
    Optional<Paciente> findByEmail(String email);
} 