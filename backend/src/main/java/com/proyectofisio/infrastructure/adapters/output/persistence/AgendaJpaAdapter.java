package com.proyectofisio.infrastructure.adapters.output.persistence;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.application.ports.output.AgendaRepositoryPort;
import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AgendaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.AgendaMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.AgendaRepository;

@Component
public class AgendaJpaAdapter implements AgendaRepositoryPort {

    private final AgendaRepository agendaRepository;
    private final AgendaMapper agendaMapper;
    
    @Autowired
    public AgendaJpaAdapter(AgendaRepository agendaRepository, AgendaMapper agendaMapper) {
        this.agendaRepository = agendaRepository;
        this.agendaMapper = agendaMapper;
    }

    @Override
    public Agenda save(Agenda agenda) {
        AgendaEntity entity = agendaMapper.toEntity(agenda);
        AgendaEntity savedEntity = agendaRepository.save(entity);
        return agendaMapper.toModel(savedEntity);
    }

    @Override
    public Optional<Agenda> findById(Long id) {
        return agendaRepository.findById(id)
                .map(agendaMapper::toModel);
    }

    @Override
    public List<Agenda> findAll() {
        return agendaRepository.findAll().stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByPacienteId(UUID pacienteId) {
        return agendaRepository.findByPacienteId(pacienteId).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByUsuarioId(UUID usuarioId) {
        return agendaRepository.findByUsuarioId(usuarioId).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByFecha(LocalDate fecha) {
        return agendaRepository.findByFecha(fecha).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return agendaRepository.findByFechaBetween(fechaInicio, fechaFin).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByEmpresaId(UUID empresaId) {
        return agendaRepository.findByEmpresaId(empresaId).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findBySalaId(UUID salaId) {
        return agendaRepository.findBySalaId(salaId).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByServicioId(UUID servicioId) {
        return agendaRepository.findByServicioId(servicioId).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByEstado(String estado) {
        return agendaRepository.findByEstado(estado).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public List<Agenda> findByUsuarioIdAndFecha(UUID usuarioId, LocalDate fecha) {
        return agendaRepository.findByUsuarioIdAndFecha(usuarioId, fecha).stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(Long id) {
        return agendaRepository.existsById(id);
    }

    @Override
    public void deleteById(Long id) {
        agendaRepository.deleteById(id);
    }

    @Override
    public List<Agenda> findConflictingAppointments(UUID usuarioId, LocalDate fecha, 
                                                  LocalTime horaInicio, LocalTime horaFin, Long idCitaExcluir) {
        // Obtenemos todas las citas del profesional en esa fecha (excluyendo la cita actual)
        List<AgendaEntity> citas = agendaRepository.findAppointmentsByUsuarioAndFecha(usuarioId, fecha, idCitaExcluir);
        
        // Filtramos en memoria las citas que se solapan con el horario proporcionado
        List<AgendaEntity> citasConflictivas = citas.stream()
                .filter(cita -> {
                    LocalTime citaInicio = cita.getHora();
                    LocalTime citaFin = citaInicio.plusMinutes(cita.getDuracion());
                    
                    // Existe conflicto si:
                    // - La cita existente comienza durante la nueva cita (citaInicio >= horaInicio && citaInicio < horaFin)
                    // - La nueva cita comienza durante la cita existente (horaInicio >= citaInicio && horaInicio < citaFin)
                    return (citaInicio.compareTo(horaInicio) >= 0 && citaInicio.compareTo(horaFin) < 0) || 
                           (horaInicio.compareTo(citaInicio) >= 0 && horaInicio.compareTo(citaFin) < 0);
                })
                .collect(Collectors.toList());
        
        // Convertimos las entidades a modelos de dominio
        return citasConflictivas.stream()
                .map(agendaMapper::toModel)
                .collect(Collectors.toList());
    }
} 