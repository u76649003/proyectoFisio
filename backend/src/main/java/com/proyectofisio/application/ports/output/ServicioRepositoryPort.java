package com.proyectofisio.application.ports.output;

import com.proyectofisio.domain.model.Servicio;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServicioRepositoryPort {
    
    Servicio save(Servicio servicio);
    
    Optional<Servicio> findById(UUID id);
    
    List<Servicio> findAll();
    
    List<Servicio> findByEmpresaId(UUID empresaId);
    
    List<Servicio> findByEmpresaIdAndEsBono(UUID empresaId, Boolean esBono);
    
    void deleteById(UUID id);
    
    boolean existsByNombreAndEmpresaId(String nombre, UUID empresaId);
} 