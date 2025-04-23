package com.proyectofisio.application.ports.output;

import com.proyectofisio.domain.model.Servicio;

import java.util.List;
import java.util.Optional;

public interface ServicioRepositoryPort {
    
    Servicio save(Servicio servicio);
    
    Optional<Servicio> findById(Long id);
    
    List<Servicio> findAll();
    
    List<Servicio> findByEmpresaId(Long empresaId);
    
    List<Servicio> findByEmpresaIdAndEsBono(Long empresaId, Boolean esBono);
    
    void deleteById(Long id);
    
    boolean existsByNombreAndEmpresaId(String nombre, Long empresaId);
} 