package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.BonoPacienteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BonoPacienteRepository extends JpaRepository<BonoPacienteEntity, UUID> {
    
    List<BonoPacienteEntity> findByPacienteId(UUID pacienteId);
    
    List<BonoPacienteEntity> findByPacienteIdAndEstado(UUID pacienteId, BonoPacienteEntity.EstadoBono estado);
    
    List<BonoPacienteEntity> findByServicioId(UUID servicioId);
} 