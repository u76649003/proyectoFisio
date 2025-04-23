package com.proyectofisio.application.services;

import com.proyectofisio.application.ports.input.SalaServicePort;
import com.proyectofisio.application.ports.output.SalaRepositoryPort;
import com.proyectofisio.domain.model.Sala;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class SalaService implements SalaServicePort {
    
    private final SalaRepositoryPort salaRepositoryPort;
    
    @Autowired
    public SalaService(SalaRepositoryPort salaRepositoryPort) {
        this.salaRepositoryPort = salaRepositoryPort;
    }
    
    @Override
    public Sala createSala(Sala sala) {
        // Verificar que no exista otra sala con el mismo nombre en la empresa
        if (salaRepositoryPort.existsByNombreAndEmpresaId(sala.getNombre(), sala.getEmpresaId())) {
            throw new IllegalArgumentException("Ya existe una sala con el mismo nombre en esta empresa");
        }
        
        // Por defecto, una sala nueva está disponible
        if (sala.getEstado() == null) {
            sala.setEstado(Sala.EstadoSala.DISPONIBLE);
        }
        
        return salaRepositoryPort.save(sala);
    }
    
    @Override
    public Sala updateSala(Long id, Sala sala) {
        // Verificar que la sala existe
        Sala salaExistente = salaRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con ID: " + id));
        
        // Verificar que no exista otra sala con el mismo nombre en la empresa
        if (!salaExistente.getNombre().equals(sala.getNombre()) && 
                salaRepositoryPort.existsByNombreAndEmpresaId(sala.getNombre(), sala.getEmpresaId())) {
            throw new IllegalArgumentException("Ya existe otra sala con el mismo nombre en esta empresa");
        }
        
        // Mantener el ID existente
        sala.setId(id);
        
        return salaRepositoryPort.save(sala);
    }
    
    @Override
    public Sala getSalaById(Long id) {
        return salaRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con ID: " + id));
    }
    
    @Override
    public List<Sala> getAllSalas() {
        return salaRepositoryPort.findAll();
    }
    
    @Override
    public List<Sala> getSalasByEmpresaId(Long empresaId) {
        return salaRepositoryPort.findByEmpresaId(empresaId);
    }
    
    @Override
    public void deleteSala(Long id) {
        // Verificar que la sala existe antes de eliminarla
        if (!salaRepositoryPort.findById(id).isPresent()) {
            throw new EntityNotFoundException("Sala no encontrada con ID: " + id);
        }
        
        // TODO: Verificar que la sala no tenga citas asociadas
        
        salaRepositoryPort.deleteById(id);
    }
} 