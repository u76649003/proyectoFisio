package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEjercicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEjercicioId;

@Repository
public interface SubprogramaEjercicioRepository extends JpaRepository<SubprogramaEjercicioEntity, SubprogramaEjercicioId> {
    
    List<SubprogramaEjercicioEntity> findBySubprogramaIdOrderByOrdenAsc(Long subprogramaId);
    
    Optional<SubprogramaEjercicioEntity> findBySubprogramaIdAndEjercicioId(Long subprogramaId, Long ejercicioId);
    
    void deleteBySubprogramaIdAndEjercicioId(Long subprogramaId, Long ejercicioId);
    
    @Modifying
    @Query("DELETE FROM SubprogramaEjercicioEntity se WHERE se.subprograma.id = ?1")
    void deleteAllBySubprogramaId(Long subprogramaId);
    
    @Query("SELECT MAX(se.orden) FROM SubprogramaEjercicioEntity se WHERE se.subprograma.id = ?1")
    Integer findMaxOrdenBySubprogramaId(Long subprogramaId);
} 