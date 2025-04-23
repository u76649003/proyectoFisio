package com.proyectofisio.application.ports.output;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.proyectofisio.domain.model.Agenda;

public interface AgendaRepositoryPort {
    
    Agenda save(Agenda agenda);
    
    Optional<Agenda> findById(Long id);
    
    List<Agenda> findAll();
    
    List<Agenda> findByPacienteId(UUID pacienteId);
    
    List<Agenda> findByUsuarioId(UUID usuarioId);
    
    List<Agenda> findByFecha(LocalDate fecha);
    
    List<Agenda> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    List<Agenda> findByEmpresaId(UUID empresaId);
    
    List<Agenda> findBySalaId(UUID salaId);
    
    List<Agenda> findByServicioId(UUID servicioId);
    
    List<Agenda> findByEstado(String estado);
    
    List<Agenda> findByUsuarioIdAndFecha(UUID usuarioId, LocalDate fecha);
    
    boolean existsById(Long id);
    
    void deleteById(Long id);
    
    List<Agenda> findConflictingAppointments(UUID usuarioId, LocalDate fecha, 
                                           LocalTime horaInicio, LocalTime horaFin, Long idCitaExcluir);
} 