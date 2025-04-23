package com.proyectofisio.application.ports.output;

import com.proyectofisio.domain.model.Sala;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SalaRepositoryPort {
    
    Sala save(Sala sala);
    
    Optional<Sala> findById(UUID id);
    
    List<Sala> findAll();
    
    List<Sala> findByEmpresaId(UUID empresaId);
    
    void deleteById(UUID id);
    
    boolean existsByNombreAndEmpresaId(String nombre, UUID empresaId);
} 