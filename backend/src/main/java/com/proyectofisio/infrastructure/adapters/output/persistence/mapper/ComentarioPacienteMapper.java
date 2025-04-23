package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.ComentarioPaciente;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ComentarioPacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ProgramaPersonalizadoRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ComentarioPacienteMapper {
    
    private final PacienteRepository pacienteRepository;
    private final ProgramaPersonalizadoRepository programaPersonalizadoRepository;
    
    public ComentarioPaciente toModel(ComentarioPacienteEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return ComentarioPaciente.builder()
            .id(entity.getId())
            .pacienteId(entity.getPaciente() != null ? entity.getPaciente().getId() : null)
            .programaPersonalizadoId(entity.getProgramaPersonalizado() != null ? 
                entity.getProgramaPersonalizado().getId() : null)
            .contenido(entity.getContenido())
            .fechaCreacion(entity.getFechaCreacion())
            .leido(entity.getLeido())
            .build();
    }
    
    public ComentarioPacienteEntity toEntity(ComentarioPaciente model) {
        if (model == null) {
            return null;
        }
        
        PacienteEntity pacienteEntity = null;
        if (model.getPacienteId() != null) {
            pacienteEntity = pacienteRepository.findById(model.getPacienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        }
        
        ProgramaPersonalizadoEntity programaEntity = null;
        if (model.getProgramaPersonalizadoId() != null) {
            programaEntity = programaPersonalizadoRepository.findById(model.getProgramaPersonalizadoId())
                .orElseThrow(() -> new IllegalArgumentException("Programa personalizado no encontrado"));
        }
        
        return ComentarioPacienteEntity.builder()
            .id(model.getId())
            .paciente(pacienteEntity)
            .programaPersonalizado(programaEntity)
            .contenido(model.getContenido())
            .fechaCreacion(model.getFechaCreacion())
            .leido(model.getLeido())
            .build();
    }
    
    public List<ComentarioPaciente> toModelList(List<ComentarioPacienteEntity> entities) {
        if (entities == null) {
            return List.of();
        }
        
        return entities.stream()
            .map(this::toModel)
            .collect(Collectors.toList());
    }
} 