package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PasoSubprogramaEntity;

@Repository
public interface PasoSubprogramaRepository extends JpaRepository<PasoSubprogramaEntity, Long> {
    
    List<PasoSubprogramaEntity> findBySubprogramaIdOrderByNumeroPasoAsc(Long subprogramaId);
    
    @Query("SELECT MAX(p.numeroPaso) FROM PasoSubprogramaEntity p WHERE p.subprograma.id = ?1")
    Integer findMaxNumeroPasoBySubprogramaId(Long subprogramaId);
} 