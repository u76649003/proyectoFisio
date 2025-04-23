package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.AccessToken;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AccessTokenEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ProgramaPersonalizadoRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccessTokenMapper {
    
    private final PacienteRepository pacienteRepository;
    private final ProgramaPersonalizadoRepository programaPersonalizadoRepository;
    
    public AccessToken toModel(AccessTokenEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return AccessToken.builder()
            .id(entity.getId())
            .token(entity.getToken())
            .pacienteId(entity.getPaciente() != null ? entity.getPaciente().getId() : null)
            .programaPersonalizadoId(entity.getProgramaPersonalizado() != null ? 
                entity.getProgramaPersonalizado().getId() : null)
            .fechaCreacion(entity.getFechaCreacion())
            .fechaExpiracion(entity.getFechaExpiracion())
            .usado(entity.getUsado())
            .build();
    }
    
    public AccessTokenEntity toEntity(AccessToken model) {
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
        
        return AccessTokenEntity.builder()
            .id(model.getId())
            .token(model.getToken())
            .paciente(pacienteEntity)
            .programaPersonalizado(programaEntity)
            .fechaCreacion(model.getFechaCreacion())
            .fechaExpiracion(model.getFechaExpiracion())
            .usado(model.getUsado())
            .build();
    }
    
    public List<AccessToken> toModelList(List<AccessTokenEntity> entities) {
        if (entities == null) {
            return List.of();
        }
        
        return entities.stream()
            .map(this::toModel)
            .collect(Collectors.toList());
    }
} 