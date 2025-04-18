package com.proyectofisio.infrastructure.adapters.output.persistence;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.application.ports.output.PacienteRepositoryPort;
import com.proyectofisio.domain.model.Paciente;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.PacienteMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PacienteRepository;

@Component
public class PacienteJpaAdapter implements PacienteRepositoryPort {

    private final PacienteRepository pacienteRepository;
    private final PacienteMapper pacienteMapper;

    @Autowired
    public PacienteJpaAdapter(PacienteRepository pacienteRepository, PacienteMapper pacienteMapper) {
        this.pacienteRepository = pacienteRepository;
        this.pacienteMapper = pacienteMapper;
    }

    @Override
    public Paciente save(Paciente paciente) {
        PacienteEntity entity = pacienteMapper.toEntity(paciente);
        PacienteEntity savedEntity = pacienteRepository.save(entity);
        return pacienteMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Paciente> findById(Long id) {
        return pacienteRepository.findById(id)
                .map(pacienteMapper::toDomain);
    }

    @Override
    public List<Paciente> findAll() {
        return pacienteRepository.findAll().stream()
                .map(pacienteMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Paciente> findByEmpresaId(Long empresaId) {
        return pacienteRepository.findByEmpresaId(empresaId).stream()
                .map(pacienteMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        pacienteRepository.deleteById(id);
    }

    @Override
    public boolean existsByDni(String dni) {
        return pacienteRepository.existsByDni(dni);
    }

    @Override
    public boolean existsByEmail(String email) {
        return pacienteRepository.existsByEmail(email);
    }

    @Override
    public Optional<Paciente> findByDni(String dni) {
        return pacienteRepository.findByDni(dni)
                .map(pacienteMapper::toDomain);
    }

    @Override
    public Optional<Paciente> findByEmail(String email) {
        return pacienteRepository.findByEmail(email)
                .map(pacienteMapper::toDomain);
    }
} 