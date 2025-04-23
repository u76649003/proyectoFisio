package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SalaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SalaRepository extends JpaRepository<SalaEntity, UUID> {
    
    List<SalaEntity> findByEmpresaId(UUID empresaId);
    
    boolean existsByNombreAndEmpresaId(String nombre, UUID empresaId);
} 