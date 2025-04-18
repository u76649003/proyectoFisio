package com.proyectofisio.application.ports.output;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Agenda;

public interface AgendaRepositoryPort {
    
    Agenda save(Agenda agenda);
    
    Optional<Agenda> findById(Long id);
    
    List<Agenda> findAll();
    
    List<Agenda> findByPacienteId(Long pacienteId);
    
    List<Agenda> findByUsuarioId(Long usuarioId);
    
    List<Agenda> findByFecha(LocalDate fecha);
    
    List<Agenda> findByUsuarioIdAndFecha(Long usuarioId, LocalDate fecha);
    
    boolean existsById(Long id);
    
    void deleteById(Long id);
    
    List<Agenda> findConflictingAppointments(Long usuarioId, LocalDate fecha, 
                                           LocalTime horaInicio, LocalTime horaFin, Long idCitaExcluir);
} 