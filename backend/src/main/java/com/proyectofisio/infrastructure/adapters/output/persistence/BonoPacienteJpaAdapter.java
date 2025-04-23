package com.proyectofisio.infrastructure.adapters.output.persistence;

import com.proyectofisio.application.ports.output.BonoPacienteRepositoryPort;
import com.proyectofisio.domain.model.BonoPaciente;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.BonoPacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.BonoPacienteMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.BonoPacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class BonoPacienteJpaAdapter implements BonoPacienteRepositoryPort {
    
    private final BonoPacienteRepository bonoPacienteRepository;
    private final BonoPacienteMapper bonoPacienteMapper;
    
    @Autowired
    public BonoPacienteJpaAdapter(BonoPacienteRepository bonoPacienteRepository, BonoPacienteMapper bonoPacienteMapper) {
        this.bonoPacienteRepository = bonoPacienteRepository;
        this.bonoPacienteMapper = bonoPacienteMapper;
    }
    
    @Override
    public BonoPaciente save(BonoPaciente bonoPaciente) {
        BonoPacienteEntity bonoPacienteEntity = bonoPacienteMapper.toEntity(bonoPaciente);
        bonoPacienteEntity = bonoPacienteRepository.save(bonoPacienteEntity);
        return bonoPacienteMapper.toDomain(bonoPacienteEntity);
    }
    
    @Override
    public Optional<BonoPaciente> findById(UUID id) {
        return bonoPacienteRepository.findById(id)
                .map(bonoPacienteMapper::toDomain);
    }
    
    @Override
    public List<BonoPaciente> findAll() {
        return bonoPacienteRepository.findAll().stream()
                .map(bonoPacienteMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BonoPaciente> findByPacienteId(UUID pacienteId) {
        return bonoPacienteRepository.findByPacienteId(pacienteId).stream()
                .map(bonoPacienteMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BonoPaciente> findByPacienteIdAndEstado(UUID pacienteId, BonoPaciente.EstadoBono estado) {
        BonoPacienteEntity.EstadoBono estadoEntity = BonoPacienteEntity.EstadoBono.valueOf(estado.name());
        return bonoPacienteRepository.findByPacienteIdAndEstado(pacienteId, estadoEntity).stream()
                .map(bonoPacienteMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BonoPaciente> findByServicioId(UUID servicioId) {
        return bonoPacienteRepository.findByServicioId(servicioId).stream()
                .map(bonoPacienteMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(UUID id) {
        bonoPacienteRepository.deleteById(id);
    }
} 