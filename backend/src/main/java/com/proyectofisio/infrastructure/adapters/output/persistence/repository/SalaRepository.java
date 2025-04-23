package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SalaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaRepository extends JpaRepository<SalaEntity, Long> {
    
    List<SalaEntity> findByEmpresaId(Long empresaId);
    
    boolean existsByNombreAndEmpresaId(String nombre, Long empresaId);
} 