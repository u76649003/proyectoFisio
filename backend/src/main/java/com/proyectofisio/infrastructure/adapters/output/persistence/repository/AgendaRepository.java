package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AgendaEntity;

@Repository
public interface AgendaRepository extends JpaRepository<AgendaEntity, Long> {
    
    List<AgendaEntity> findByPacienteId(Long pacienteId);
    
    List<AgendaEntity> findByUsuarioId(Long usuarioId);
    
    List<AgendaEntity> findByFecha(LocalDate fecha);
    
    List<AgendaEntity> findByUsuarioIdAndFecha(Long usuarioId, LocalDate fecha);
    
    /**
     * Encuentra citas que se solapan con el horario especificado.
     * En lugar de usar funciones específicas de bases de datos para calcular el tiempo final,
     * trasladamos esa lógica a la implementación Java en AgendaJpaAdapter.
     */
    @Query("SELECT a FROM AgendaEntity a " +
           "WHERE a.usuario.id = :usuarioId " +
           "AND a.fecha = :fecha " +
           "AND a.id <> :idExcluir")
    List<AgendaEntity> findAppointmentsByUsuarioAndFecha(
        @Param("usuarioId") Long usuarioId,
        @Param("fecha") LocalDate fecha, 
        @Param("idExcluir") Long idExcluir);
} 