package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEntity;

@Repository
public interface SubprogramaRepository extends JpaRepository<SubprogramaEntity, Long> {
    
    List<SubprogramaEntity> findByProgramaPersonalizado(ProgramaPersonalizadoEntity programaPersonalizado);
    
    List<SubprogramaEntity> findByProgramaPersonalizadoIdOrderByOrdenAsc(Long programaPersonalizadoId);
} 