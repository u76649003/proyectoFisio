package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, UUID> {

    List<UsuarioEntity> findByEmpresaId(UUID empresaId);
    
    List<UsuarioEntity> findByRol(RolUsuario rol);
    
    Optional<UsuarioEntity> findByEmail(String email);
    
    Optional<UsuarioEntity> findByDni(String dni);
    
    boolean existsByEmail(String email);
    
    boolean existsByDni(String dni);
} 