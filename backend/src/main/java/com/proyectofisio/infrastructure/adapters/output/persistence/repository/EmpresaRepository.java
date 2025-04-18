package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;

@Repository
public interface EmpresaRepository extends JpaRepository<EmpresaEntity, Long> {
    
    Optional<EmpresaEntity> findByNif(String nif);
    
    boolean existsByNif(String nif);
    
} 