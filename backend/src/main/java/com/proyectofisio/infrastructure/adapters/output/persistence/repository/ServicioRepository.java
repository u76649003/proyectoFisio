package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ServicioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<ServicioEntity, Long> {
    
    List<ServicioEntity> findByEmpresaId(Long empresaId);
    
    List<ServicioEntity> findByEmpresaIdAndEsBono(Long empresaId, Boolean esBono);
    
    boolean existsByNombreAndEmpresaId(String nombre, Long empresaId);
} 