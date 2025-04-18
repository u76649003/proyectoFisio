package com.proyectofisio.application.ports.output;

import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;

public interface UsuarioRepositoryPort {
    
    Usuario save(Usuario usuario);
    
    Optional<Usuario> findById(Long id);
    
    List<Usuario> findAll();
    
    List<Usuario> findByEmpresaId(Long empresaId);
    
    List<Usuario> findByRol(RolUsuario rol);
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByDni(String dni);
    
    void deleteById(Long id);
    
    boolean existsByEmail(String email);
    
    boolean existsByDni(String dni);
} 