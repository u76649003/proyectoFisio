package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

    List<UsuarioEntity> findByEmpresaId(Long empresaId);
    
    List<UsuarioEntity> findByRol(RolUsuario rol);
    
    Optional<UsuarioEntity> findByEmail(String email);
    
    Optional<UsuarioEntity> findByDni(String dni);
    
    boolean existsByEmail(String email);
    
    boolean existsByDni(String dni);
} 