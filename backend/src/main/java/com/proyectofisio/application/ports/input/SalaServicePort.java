package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.Sala;

import java.util.List;
import java.util.UUID;

public interface SalaServicePort {
    
    Sala createSala(Sala sala);
    
    Sala updateSala(UUID id, Sala sala);
    
    Sala getSalaById(UUID id);
    
    List<Sala> getAllSalas();
    
    List<Sala> getSalasByEmpresaId(UUID empresaId);
    
    void deleteSala(UUID id);
} 