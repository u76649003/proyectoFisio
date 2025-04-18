package com.proyectofisio.application.ports.input;

import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Empresa;

public interface EmpresaServicePort {
    
    Empresa crearEmpresa(Empresa empresa);
    
    Optional<Empresa> obtenerEmpresaPorId(Long id);
    
    List<Empresa> obtenerTodasLasEmpresas();
    
    Empresa actualizarEmpresa(Empresa empresa);
    
    void eliminarEmpresa(Long id);
    
    boolean existeEmpresaConNif(String nif);
} 