package com.proyectofisio.application.ports.input;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Agenda;

public interface AgendaServicePort {
    
    Agenda crearCita(Agenda agenda);
    
    Optional<Agenda> obtenerCitaPorId(Long id);
    
    List<Agenda> obtenerTodasLasCitas();
    
    List<Agenda> obtenerCitasPorPaciente(Long pacienteId);
    
    List<Agenda> obtenerCitasPorProfesional(Long usuarioId);
    
    List<Agenda> obtenerCitasPorFecha(LocalDate fecha);
    
    List<Agenda> obtenerCitasPorProfesionalYFecha(Long usuarioId, LocalDate fecha);
    
    Agenda actualizarCita(Agenda agenda);
    
    Agenda cancelarCita(Long id);
    
    void eliminarCita(Long id);
    
    boolean existeCitaConflictiva(Agenda agenda);
} 