package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AccessTokenEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ComentarioPacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEntity;

@Repository
public interface ComentarioPacienteRepository extends JpaRepository<ComentarioPacienteEntity, Long> {
    
    List<ComentarioPacienteEntity> findBySubprograma(SubprogramaEntity subprograma);
    
    List<ComentarioPacienteEntity> findBySubprogramaId(Long subprogramaId);
    
    List<ComentarioPacienteEntity> findByAccessToken(AccessTokenEntity accessToken);
    
    List<ComentarioPacienteEntity> findByAccessTokenToken(UUID token);
    
    List<ComentarioPacienteEntity> findBySubprogramaIdAndAccessTokenToken(Long subprogramaId, UUID token);
    
    List<ComentarioPacienteEntity> findBySubprogramaProgramaPersonalizadoIdAndAccessTokenPacienteId(Long programaId, Long pacienteId);
    
    List<ComentarioPacienteEntity> findByLeidoFalseOrderByFechaCreacionDesc();
    
    long countByLeidoFalse();
} 