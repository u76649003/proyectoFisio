package com.proyectofisio.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.application.ports.output.EmpresaRepositoryPort;
import com.proyectofisio.domain.model.Empresa;

@Service
public class EmpresaService implements EmpresaServicePort {

    private final EmpresaRepositoryPort empresaRepository;

    @Autowired
    public EmpresaService(EmpresaRepositoryPort empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Override
    public Empresa crearEmpresa(Empresa empresa) {
        if (existeEmpresaConNif(empresa.getNif())) {
            throw new IllegalArgumentException("Ya existe una empresa con ese NIF");
        }
        return empresaRepository.save(empresa);
    }

    @Override
    public Optional<Empresa> obtenerEmpresaPorId(Long id) {
        return empresaRepository.findById(id);
    }

    @Override
    public List<Empresa> obtenerTodasLasEmpresas() {
        return empresaRepository.findAll();
    }

    @Override
    public Empresa actualizarEmpresa(Empresa empresa) {
        if (!empresaRepository.findById(empresa.getId()).isPresent()) {
            throw new IllegalArgumentException("No existe una empresa con ese ID");
        }
        
        // Verificar que el NIF no esté siendo usado por otra empresa
        Optional<Empresa> empresaExistente = empresaRepository.findByNif(empresa.getNif());
        if (empresaExistente.isPresent() && !empresaExistente.get().getId().equals(empresa.getId())) {
            throw new IllegalArgumentException("Ya existe otra empresa con ese NIF");
        }
        
        return empresaRepository.save(empresa);
    }

    @Override
    public void eliminarEmpresa(Long id) {
        empresaRepository.deleteById(id);
    }

    @Override
    public boolean existeEmpresaConNif(String nif) {
        return empresaRepository.existsByNif(nif);
    }
    
    @Override
    public Optional<Empresa> obtenerEmpresaPorNif(String nif) {
        return empresaRepository.findByNif(nif);
    }
} 