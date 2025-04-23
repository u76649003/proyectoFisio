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
    
    boolean existsByEmail(String email);
    
    boolean existsByTelefono(String telefono);
    
    boolean existsByDni(String dni);
    
    Optional<Paciente> findByEmail(String email);
    
    Optional<Paciente> findByTelefono(String telefono);
    
    Optional<Paciente> findByDni(String dni);
} 