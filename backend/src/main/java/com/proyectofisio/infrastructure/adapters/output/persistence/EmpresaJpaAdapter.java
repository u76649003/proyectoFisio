package com.proyectofisio.infrastructure.adapters.output.persistence;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.application.ports.output.EmpresaRepositoryPort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.EmpresaMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EmpresaRepository;

@Component
public class EmpresaJpaAdapter implements EmpresaRepositoryPort {

    private final EmpresaRepository empresaRepository;
    private final EmpresaMapper empresaMapper;

    @Autowired
    public EmpresaJpaAdapter(EmpresaRepository empresaRepository, EmpresaMapper empresaMapper) {
        this.empresaRepository = empresaRepository;
        this.empresaMapper = empresaMapper;
    }

    @Override
    public Empresa save(Empresa empresa) {
        EmpresaEntity entity = empresaMapper.toEntity(empresa);
        EmpresaEntity savedEntity = empresaRepository.save(entity);
        return empresaMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Empresa> findById(Long id) {
        return empresaRepository.findById(id)
                .map(empresaMapper::toDomain);
    }

    @Override
    public List<Empresa> findAll() {
        return empresaRepository.findAll().stream()
                .map(empresaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        empresaRepository.deleteById(id);
    }

    @Override
    public Optional<Empresa> findByNif(String nif) {
        return empresaRepository.findByNif(nif)
                .map(empresaMapper::toDomain);
    }

    @Override
    public boolean existsByNif(String nif) {
        return empresaRepository.existsByNif(nif);
    }
} 