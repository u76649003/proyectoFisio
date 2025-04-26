package com.proyectofisio.application.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.AgendaServicePort;
import com.proyectofisio.application.ports.input.BonoPacienteServicePort;
import com.proyectofisio.application.ports.output.AgendaRepositoryPort;
import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.domain.model.Agenda.EstadoCita;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AgendaService implements AgendaServicePort {

    private final AgendaRepositoryPort agendaRepository;
    private final BonoPacienteServicePort bonoPacienteService;
    
    @Autowired
    public AgendaService(AgendaRepositoryPort agendaRepository, BonoPacienteServicePort bonoPacienteService) {
        this.agendaRepository = agendaRepository;
        this.bonoPacienteService = bonoPacienteService;
    }
    
    @Override
    @Transactional
    public Agenda crearCita(Agenda agenda) {
        if (existeCitaConflictiva(agenda)) {
            throw new IllegalArgumentException("Ya existe una cita programada para ese profesional en el horario indicado");
        }
        
        // Establecer estado por defecto si no viene especificado
        if (agenda.getEstado() == null) {
            agenda.setEstado(EstadoCita.PENDIENTE.name());
        }
        
        return agendaRepository.save(agenda);
    }

    @Override
    @Transactional(readOnly = true)
    public Agenda getCitaById(Long id) {
        return agendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getAllCitas() {
        return agendaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByPacienteId(Long pacienteId) {
        return agendaRepository.findByPacienteId(pacienteId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByProfesionalId(Long usuarioId) {
        return agendaRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByFecha(LocalDate fecha) {
        return agendaRepository.findByFecha(fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        LocalDate inicio = fechaInicio.toLocalDate();
        LocalDate fin = fechaFin.toLocalDate();
        return agendaRepository.findByFechaBetween(inicio, fin);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByEmpresaId(Long empresaId) {
        return agendaRepository.findByEmpresaId(empresaId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasBySalaId(Long salaId) {
        return agendaRepository.findBySalaId(salaId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByServicioId(Long servicioId) {
        return agendaRepository.findByServicioId(servicioId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Agenda> getCitasByEstado(EstadoCita estado) {
        return agendaRepository.findByEstado(estado.name());
    }

    @Override
    @Transactional
    public Agenda updateCita(Long id, Agenda agenda) {
        // Verificar que la cita existe
        if (!agendaRepository.existsById(id)) {
            throw new EntityNotFoundException("La cita no existe");
        }
        
        // Asegurar que el ID de la cita no se modifique
        agenda.setId(id);
        
        // Si la fecha, hora o duración han cambiado, verificar conflictos
        if (existeCitaConflictiva(agenda)) {
            throw new IllegalArgumentException("La actualización genera un conflicto con otra cita existente");
        }
        
        return agendaRepository.save(agenda);
    }

    @Override
    @Transactional
    public Agenda cancelarCita(Long id) {
        Agenda cita = getCitaById(id);
        
        // Verificar que la cita no esté ya cancelada o completada
        if (EstadoCita.CANCELADA.name().equals(cita.getEstado()) || 
            EstadoCita.COMPLETADA.name().equals(cita.getEstado())) {
            throw new IllegalStateException("No se puede cancelar una cita que ya está " + cita.getEstado());
        }
        
        cita.setEstado(EstadoCita.CANCELADA.name());
        return agendaRepository.save(cita);
    }
    
    @Override
    @Transactional
    public Agenda completarCita(Long id) {
        Agenda cita = getCitaById(id);
        
        // Verificar que la cita no esté ya completada o cancelada
        if (EstadoCita.COMPLETADA.name().equals(cita.getEstado()) || 
            EstadoCita.CANCELADA.name().equals(cita.getEstado())) {
            throw new IllegalStateException("No se puede completar una cita que ya está " + cita.getEstado());
        }
        
        // Actualizar el estado de la cita
        cita.setEstado(EstadoCita.COMPLETADA.name());
        
        // Si hay un bono asociado, actualizar sus sesiones restantes
        if (cita.getBonoId() != null) {
            bonoPacienteService.actualizarSesionesRestantesBono(cita.getBonoId());
        }
        
        // Guardar y devolver la cita actualizada
        return agendaRepository.save(cita);
    }

    @Override
    @Transactional
    public void deleteCita(Long id) {
        if (!agendaRepository.existsById(id)) {
            throw new EntityNotFoundException("La cita no existe");
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