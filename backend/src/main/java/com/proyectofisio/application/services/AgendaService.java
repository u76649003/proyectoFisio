package com.proyectofisio.application.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.AgendaServicePort;
import com.proyectofisio.application.ports.output.AgendaRepositoryPort;
import com.proyectofisio.domain.model.Agenda;

@Service
public class AgendaService implements AgendaServicePort {

    private final AgendaRepositoryPort agendaRepository;
    
    @Autowired
    public AgendaService(AgendaRepositoryPort agendaRepository) {
        this.agendaRepository = agendaRepository;
    }
    
    @Override
    @Transactional
    public Agenda crearCita(Agenda agenda) {
        if (existeCitaConflictiva(agenda)) {
            throw new IllegalArgumentException("Ya existe una cita programada para ese profesional en el horario indicado");
        }
        return agendaRepository.save(agenda);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Agenda> obtenerCitaPorId(Long id) {
        return agendaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> obtenerTodasLasCitas() {
        return agendaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> obtenerCitasPorPaciente(Long pacienteId) {
        return agendaRepository.findByPacienteId(pacienteId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> obtenerCitasPorProfesional(Long usuarioId) {
        return agendaRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> obtenerCitasPorFecha(LocalDate fecha) {
        return agendaRepository.findByFecha(fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> obtenerCitasPorProfesionalYFecha(Long usuarioId, LocalDate fecha) {
        return agendaRepository.findByUsuarioIdAndFecha(usuarioId, fecha);
    }

    @Override
    @Transactional
    public Agenda actualizarCita(Agenda agenda) {
        if (!agendaRepository.existsById(agenda.getId())) {
            throw new IllegalArgumentException("La cita no existe");
        }
        
        // Si la fecha, hora o duración han cambiado, verificar conflictos
        if (existeCitaConflictiva(agenda)) {
            throw new IllegalArgumentException("La actualización genera un conflicto con otra cita existente");
        }
        
        return agendaRepository.save(agenda);
    }

    @Override
    @Transactional
    public Agenda cancelarCita(Long id) {
        Optional<Agenda> citaOpt = agendaRepository.findById(id);
        if (citaOpt.isEmpty()) {
            throw new IllegalArgumentException("La cita no existe");
        }
        
        Agenda cita = citaOpt.get();
        cita.setEstado("CANCELADA");
        return agendaRepository.save(cita);
    }

    @Override
    @Transactional
    public void eliminarCita(Long id) {
        if (!agendaRepository.existsById(id)) {
            throw new IllegalArgumentException("La cita no existe");
        }
        agendaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeCitaConflictiva(Agenda agenda) {
        LocalTime horaInicio = agenda.getHora();
        LocalTime horaFin = horaInicio.plusMinutes(agenda.getDuracion());
        
        List<Agenda> citasExistentes = agendaRepository.findConflictingAppointments(
            agenda.getUsuarioId(), 
            agenda.getFecha(), 
            horaInicio, 
            horaFin, 
            agenda.getId() != null ? agenda.getId() : 0L
        );
        
        return !citasExistentes.isEmpty();
    }
} 