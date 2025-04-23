package com.proyectofisio.infrastructure.adapters.output.persistence;

import com.proyectofisio.application.ports.output.SalaRepositoryPort;
import com.proyectofisio.domain.model.Sala;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SalaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.SalaMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class SalaJpaAdapter implements SalaRepositoryPort {
    
    private final SalaRepository salaRepository;
    private final SalaMapper salaMapper;
    
    @Autowired
    public SalaJpaAdapter(SalaRepository salaRepository, SalaMapper salaMapper) {
        this.salaRepository = salaRepository;
        this.salaMapper = salaMapper;
    }
    
    @Override
    public Sala save(Sala sala) {
        SalaEntity salaEntity = salaMapper.toEntity(sala);
        salaEntity = salaRepository.save(salaEntity);
        return salaMapper.toDomain(salaEntity);
    }
    
    @Override
    public Optional<Sala> findById(Long id) {
        return salaRepository.findById(id)
                .map(salaMapper::toDomain);
    }
    
    @Override
    public List<Sala> findAll() {
        return salaRepository.findAll().stream()
                .map(salaMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Sala> findByEmpresaId(Long empresaId) {
        return salaRepository.findByEmpresaId(empresaId).stream()
                .map(salaMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long id) {
        salaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByNombreAndEmpresaId(String nombre, Long empresaId) {
        return salaRepository.existsByNombreAndEmpresaId(nombre, empresaId);
    }
} 