package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AgendaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.BonoPacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SalaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ServicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.BonoPacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SalaRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ServicioRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.UsuarioRepository;

import java.util.UUID;

@Component
public class AgendaMapper {
    
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final SalaRepository salaRepository;
    private final ServicioRepository servicioRepository;
    private final BonoPacienteRepository bonoPacienteRepository;
    
    @Autowired
    public AgendaMapper(
            PacienteRepository pacienteRepository, 
            UsuarioRepository usuarioRepository,
            SalaRepository salaRepository,
            ServicioRepository servicioRepository,
            BonoPacienteRepository bonoPacienteRepository) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.salaRepository = salaRepository;
        this.servicioRepository = servicioRepository;
        this.bonoPacienteRepository = bonoPacienteRepository;
    }
    
    public Agenda toModel(AgendaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Agenda.builder()
                .id(entity.getId())
                .pacienteId(entity.getPaciente() != null ? entity.getPaciente().getId() : null)
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .salaId(entity.getSala() != null ? entity.getSala().getId() : null)
                .servicioId(entity.getServicio() != null ? entity.getServicio().getId() : null)
                .bonoId(entity.getBono() != null ? entity.getBono().getId() : null)
                .fecha(entity.getFecha())
                .hora(entity.getHora())
                .duracion(entity.getDuracion())
                .estado(entity.getEstado())
                .tipoSesion(entity.getTipoSesion())
                .notas(entity.getNotas())
                .build();
    }
    
    public AgendaEntity toEntity(Agenda model) {
        if (model == null) {
            return null;
        }
        
        // Obtener las entidades relacionadas
        PacienteEntity pacienteEntity = null;
        if (model.getPacienteId() != null) {
            pacienteEntity = pacienteRepository.findById(model.getPacienteId()).orElse(null);
        }
        
        UsuarioEntity usuarioEntity = null;
        if (model.getUsuarioId() != null) {
            usuarioEntity = usuarioRepository.findById(model.getUsuarioId())
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + model.getUsuarioId()));
        }
        
        SalaEntity salaEntity = null;
        if (model.getSalaId() != null) {
            salaEntity = salaRepository.findById(model.getSalaId()).orElse(null);
        }
        
        ServicioEntity servicioEntity = null;
        if (model.getServicioId() != null) {
            servicioEntity = servicioRepository.findById(model.getServicioId()).orElse(null);
        }
        
        BonoPacienteEntity bonoEntity = null;
        if (model.getBonoId() != null) {
            bonoEntity = bonoPacienteRepository.findById(model.getBonoId()).orElse(null);
        }
        
        return AgendaEntity.builder()
                .id(model.getId())
                .paciente(pacienteEntity)
                .usuario(usuarioEntity)
                .sala(salaEntity)
                .servicio(servicioEntity)
                .bono(bonoEntity)
                .fecha(model.getFecha())
                .hora(model.getHora())
                .duracion(model.getDuracion())
                .estado(model.getEstado())
                .tipoSesion(model.getTipoSesion())
                .notas(model.getNotas())
                .build();
    }
} 