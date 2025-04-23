package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;

@Repository
public interface PacienteRepository extends JpaRepository<PacienteEntity, UUID> {
    
    List<PacienteEntity> findByEmpresaId(Long empresaId);
    
    Optional<PacienteEntity> findByDni(String dni);
    
    Optional<PacienteEntity> findByEmail(String email);
    
    Optional<PacienteEntity> findByTelefono(String telefono);
    
    boolean existsByDni(String dni);
    
    boolean existsByEmail(String email);
    
    boolean existsByTelefono(String telefono);
} 