package com.proyectofisio.application.ports.output;

import com.proyectofisio.domain.model.Sala;

import java.util.List;
import java.util.Optional;

public interface SalaRepositoryPort {
    
    Sala save(Sala sala);
    
    Optional<Sala> findById(Long id);
    
    List<Sala> findAll();
    
    List<Sala> findByEmpresaId(Long empresaId);
    
    void deleteById(Long id);
    
    boolean existsByNombreAndEmpresaId(String nombre, Long empresaId);
} 