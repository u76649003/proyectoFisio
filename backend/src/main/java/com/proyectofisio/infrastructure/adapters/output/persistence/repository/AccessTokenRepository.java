package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AccessTokenEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessTokenEntity, Long> {
    
    Optional<AccessTokenEntity> findByToken(UUID token);
    
    List<AccessTokenEntity> findByProgramaPersonalizado(ProgramaPersonalizadoEntity programaPersonalizado);
    
    List<AccessTokenEntity> findByProgramaPersonalizadoId(Long programaPersonalizadoId);
    
    List<AccessTokenEntity> findByPaciente(PacienteEntity paciente);
    
    List<AccessTokenEntity> findByPacienteId(Long pacienteId);
    
    List<AccessTokenEntity> findByPacienteIdAndProgramaPersonalizadoId(Long pacienteId, Long programaPersonalizadoId);
} 