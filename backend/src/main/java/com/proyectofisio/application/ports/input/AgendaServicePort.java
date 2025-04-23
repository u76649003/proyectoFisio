package com.proyectofisio.application.ports.input;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.domain.model.Agenda.EstadoCita;

public interface AgendaServicePort {
    
    Agenda crearCita(Agenda agenda);
    
    Agenda getCitaById(Long id);
    
    List<Agenda> getAllCitas();
    
    List<Agenda> getCitasByPacienteId(Long pacienteId);
    
    List<Agenda> getCitasByProfesionalId(Long usuarioId);
    
    List<Agenda> getCitasByFecha(LocalDate fecha);
    
    List<Agenda> getCitasByRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    List<Agenda> getCitasByEmpresaId(Long empresaId);
    
    List<Agenda> getCitasBySalaId(Long salaId);
    
    List<Agenda> getCitasByServicioId(Long servicioId);
    
    List<Agenda> getCitasByEstado(EstadoCita estado);
    
    Agenda updateCita(Long id, Agenda agenda);
    
    Agenda cancelarCita(Long id);
    
    Agenda completarCita(Long id);
    
    void deleteCita(Long id);
    
    boolean existeCitaConflictiva(Agenda agenda);
} 