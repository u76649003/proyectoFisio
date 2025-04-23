package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ComentarioPacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;

@Repository
public interface ComentarioPacienteRepository extends JpaRepository<ComentarioPacienteEntity, Long> {
    
    List<ComentarioPacienteEntity> findByProgramaPersonalizado(ProgramaPersonalizadoEntity programaPersonalizado);
    
    List<ComentarioPacienteEntity> findByProgramaPersonalizadoId(Long programaPersonalizadoId);
    
    List<ComentarioPacienteEntity> findByPaciente(PacienteEntity paciente);
    
    List<ComentarioPacienteEntity> findByPacienteId(Long pacienteId);
    
    List<ComentarioPacienteEntity> findByPacienteIdAndProgramaPersonalizadoIdOrderByFechaCreacionDesc(Long pacienteId, Long programaPersonalizadoId);
    
    List<ComentarioPacienteEntity> findByLeidoFalseOrderByFechaCreacionDesc();
    
    long countByLeidoFalse();
} 