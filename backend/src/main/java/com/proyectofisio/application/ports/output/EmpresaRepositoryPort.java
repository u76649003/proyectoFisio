package com.proyectofisio.application.ports.output;

import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Empresa;

public interface EmpresaRepositoryPort {
    
    Empresa save(Empresa empresa);
    
    Optional<Empresa> findById(Long id);
    
    List<Empresa> findAll();
    
    void deleteById(Long id);
    
    Optional<Empresa> findByNif(String nif);
    
    boolean existsByNif(String nif);
} 