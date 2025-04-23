package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ServicioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ServicioRepository extends JpaRepository<ServicioEntity, UUID> {
    
    List<ServicioEntity> findByEmpresaId(UUID empresaId);
    
    List<ServicioEntity> findByEmpresaIdAndEsBono(UUID empresaId, Boolean esBono);
    
    boolean existsByNombreAndEmpresaId(String nombre, UUID empresaId);
} 