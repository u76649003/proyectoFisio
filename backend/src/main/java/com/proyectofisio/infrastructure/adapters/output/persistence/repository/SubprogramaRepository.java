package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEntity;

@Repository
public interface SubprogramaRepository extends JpaRepository<SubprogramaEntity, Long> {
    
    List<SubprogramaEntity> findByProgramaPersonalizado(ProgramaPersonalizadoEntity programaPersonalizado);
    
    List<SubprogramaEntity> findByProgramaPersonalizadoIdOrderByOrdenAsc(Long programaPersonalizadoId);
    
    @Query("SELECT s FROM SubprogramaEntity s LEFT JOIN FETCH s.subprogramaEjercicios WHERE s.id = ?1")
    SubprogramaEntity findByIdWithEjercicios(Long id);
    
    @Query("SELECT s FROM SubprogramaEntity s LEFT JOIN FETCH s.subprogramaEjercicios WHERE s.programaPersonalizado.id = ?1 ORDER BY s.orden ASC")
    List<SubprogramaEntity> findByProgramaPersonalizadoIdWithEjerciciosOrderByOrdenAsc(Long programaPersonalizadoId);
} 