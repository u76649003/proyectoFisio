package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.ComentarioPaciente;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.AccessTokenEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ComentarioPacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.AccessTokenRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SubprogramaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ComentarioPacienteMapper {
    
    private final SubprogramaRepository subprogramaRepository;
    private final AccessTokenRepository accessTokenRepository;
    
    public ComentarioPaciente toModel(ComentarioPacienteEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return ComentarioPaciente.builder()
            .id(entity.getId())
            .subprogramaId(entity.getSubprograma().getId())
            .token(entity.getAccessToken().getToken())
            .contenido(entity.getContenido())
            .fechaCreacion(entity.getFechaCreacion())
            .leido(entity.getLeido())
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
    
    public ComentarioPacienteEntity toEntity(ComentarioPaciente model) {
        if (model == null) {
            return null;
        }
        
        SubprogramaEntity subprogramaEntity = null;
        if (model.getSubprogramaId() != null) {
            subprogramaEntity = subprogramaRepository.findById(model.getSubprogramaId())
                .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado con id: " + model.getSubprogramaId()));
        }
        
        AccessTokenEntity accessTokenEntity = null;
        if (model.getToken() != null) {
            accessTokenEntity = accessTokenRepository.findByToken(model.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Token no válido: " + model.getToken()));
        }
        
        return ComentarioPacienteEntity.builder()
            .id(model.getId())
            .subprograma(subprogramaEntity)
            .accessToken(accessTokenEntity)
            .contenido(model.getContenido())
            .fechaCreacion(model.getFechaCreacion())
            .leido(model.getLeido())
            .build();
    }
    
    public List<ComentarioPacienteEntity> toEntityList(List<ComentarioPaciente> models) {
        if (models == null) {
            return List.of();
        }
        
        return models.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
} 