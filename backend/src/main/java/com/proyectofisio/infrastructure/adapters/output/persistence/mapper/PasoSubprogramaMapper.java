package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.PasoSubprograma;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PasoSubprogramaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SubprogramaRepository;

@Component
public class PasoSubprogramaMapper {
    
    @Autowired
    private SubprogramaRepository subprogramaRepository;
    
    public PasoSubprograma toModel(PasoSubprogramaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return PasoSubprograma.builder()
            .id(entity.getId())
            .numeroPaso(entity.getNumeroPaso())
            .descripcion(entity.getDescripcion())
            .videoReferencia(entity.getVideoReferencia())
            .esEnlaceExterno(entity.getEsEnlaceExterno())
            .imagenesUrls(entity.getImagenesUrls())
            .subprogramaId(entity.getSubprograma() != null ? entity.getSubprograma().getId() : null)
            .fechaCreacion(entity.getFechaCreacion())
            .fechaActualizacion(entity.getFechaActualizacion())
            .build();
    }
    
    public PasoSubprogramaEntity toEntity(PasoSubprograma model) {
        if (model == null) {
            return null;
        }
        
        SubprogramaEntity subprogramaEntity = null;
        if (model.getSubprogramaId() != null) {
            subprogramaEntity = subprogramaRepository.findById(model.getSubprogramaId())
                .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado"));
        }
        
        return PasoSubprogramaEntity.builder()
            .id(model.getId())
            .numeroPaso(model.getNumeroPaso())
            .descripcion(model.getDescripcion())
            .videoReferencia(model.getVideoReferencia())
            .esEnlaceExterno(model.getEsEnlaceExterno())
            .imagenesUrls(model.getImagenesUrls())
            .subprograma(subprogramaEntity)
            .fechaCreacion(model.getFechaCreacion())
            .fechaActualizacion(model.getFechaActualizacion())
            .build();
    }
    
    public List<PasoSubprograma> toModelList(List<PasoSubprogramaEntity> entities) {
        if (entities == null) {
            return List.of();
        }
        
        return entities.stream()
            .map(this::toModel)
            .collect(Collectors.toList());
    }
} 