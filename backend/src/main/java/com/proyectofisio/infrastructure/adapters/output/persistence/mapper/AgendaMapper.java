package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AgendaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.UsuarioRepository;

@Component
public class AgendaMapper {
    
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PacienteMapper pacienteMapper;
    private final UsuarioMapper usuarioMapper;
    
    @Autowired
    public AgendaMapper(
            PacienteRepository pacienteRepository, 
            UsuarioRepository usuarioRepository,
            PacienteMapper pacienteMapper,
            UsuarioMapper usuarioMapper) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.pacienteMapper = pacienteMapper;
        this.usuarioMapper = usuarioMapper;
    }
    
    public Agenda toModel(AgendaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Agenda.builder()
                .id(entity.getId())
                .pacienteId(entity.getPaciente() != null ? entity.getPaciente().getId() : null)
                .usuarioId(entity.getUsuario().getId())
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
        
        UsuarioEntity usuarioEntity = usuarioRepository.findById(model.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        return AgendaEntity.builder()
                .id(model.getId())
                .paciente(pacienteEntity)
                .usuario(usuarioEntity)
                .fecha(model.getFecha())
                .hora(model.getHora())
                .duracion(model.getDuracion())
                .estado(model.getEstado())
                .tipoSesion(model.getTipoSesion())
                .notas(model.getNotas())
                .build();
    }
} 