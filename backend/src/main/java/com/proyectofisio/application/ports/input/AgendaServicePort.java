package com.proyectofisio.application.ports.input;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.domain.model.Agenda.EstadoCita;

public interface AgendaServicePort {
    
    Agenda crearCita(Agenda agenda);
    
    Agenda getCitaById(Long id);
    
    List<Agenda> getAllCitas();
    
    List<Agenda> getCitasByPacienteId(UUID pacienteId);
    
    List<Agenda> getCitasByProfesionalId(UUID usuarioId);
    
    List<Agenda> getCitasByFecha(LocalDate fecha);
    
    List<Agenda> getCitasByRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    List<Agenda> getCitasByEmpresaId(UUID empresaId);
    
    List<Agenda> getCitasBySalaId(UUID salaId);
    
    List<Agenda> getCitasByServicioId(UUID servicioId);
    
    List<Agenda> getCitasByEstado(EstadoCita estado);
    
    Agenda updateCita(Long id, Agenda agenda);
    
    Agenda cancelarCita(Long id);
    
    Agenda completarCita(Long id);
    
    void deleteCita(Long id);
    
    boolean existeCitaConflictiva(Agenda agenda);
} 