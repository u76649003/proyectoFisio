package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.Sala;

import java.util.List;

public interface SalaServicePort {
    
    Sala createSala(Sala sala);
    
    Sala updateSala(Long id, Sala sala);
    
    Sala getSalaById(Long id);
    
    List<Sala> getAllSalas();
    
    List<Sala> getSalasByEmpresaId(Long empresaId);
    
    void deleteSala(Long id);
} 