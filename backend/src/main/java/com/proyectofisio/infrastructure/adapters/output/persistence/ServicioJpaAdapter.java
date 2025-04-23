package com.proyectofisio.infrastructure.adapters.output.persistence;

import com.proyectofisio.application.ports.output.ServicioRepositoryPort;
import com.proyectofisio.domain.model.Servicio;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ServicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.ServicioMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ServicioJpaAdapter implements ServicioRepositoryPort {
    
    private final ServicioRepository servicioRepository;
    private final ServicioMapper servicioMapper;
    
    @Autowired
    public ServicioJpaAdapter(ServicioRepository servicioRepository, ServicioMapper servicioMapper) {
        this.servicioRepository = servicioRepository;
        this.servicioMapper = servicioMapper;
    }
    
    @Override
    public Servicio save(Servicio servicio) {
        ServicioEntity servicioEntity = servicioMapper.toEntity(servicio);
        servicioEntity = servicioRepository.save(servicioEntity);
        return servicioMapper.toDomain(servicioEntity);
    }
    
    @Override
    public Optional<Servicio> findById(Long id) {
        return servicioRepository.findById(id)
                .map(servicioMapper::toDomain);
    }
    
    @Override
    public List<Servicio> findAll() {
        return servicioRepository.findAll().stream()
                .map(servicioMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Servicio> findByEmpresaId(Long empresaId) {
        return servicioRepository.findByEmpresaId(empresaId).stream()
                .map(servicioMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Servicio> findByEmpresaIdAndEsBono(Long empresaId, Boolean esBono) {
        return servicioRepository.findByEmpresaIdAndEsBono(empresaId, esBono).stream()
                .map(servicioMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long id) {
        servicioRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByNombreAndEmpresaId(String nombre, Long empresaId) {
        return servicioRepository.existsByNombreAndEmpresaId(nombre, empresaId);
    }
} 