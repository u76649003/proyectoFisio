package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.BonoPacienteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BonoPacienteRepository extends JpaRepository<BonoPacienteEntity, Long> {
    
    List<BonoPacienteEntity> findByPacienteId(Long pacienteId);
    
    List<BonoPacienteEntity> findByPacienteIdAndEstado(Long pacienteId, BonoPacienteEntity.EstadoBono estado);
    
    List<BonoPacienteEntity> findByServicioId(Long servicioId);
} 