package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Ejercicio;
import com.proyectofisio.domain.model.Subprograma;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ProgramaPersonalizadoRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubprogramaMapper {
    
    private final ProgramaPersonalizadoRepository programaPersonalizadoRepository;
    private final EjercicioMapper ejercicioMapper;
    
    public Subprograma toModel(SubprogramaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        List<Ejercicio> ejercicios = List.of();
        if (entity.getSubprogramaEjercicios() != null) {
            ejercicios = entity.getSubprogramaEjercicios().stream()
                .sorted(Comparator.comparing(se -> se.getOrden()))
                .map(se -> ejercicioMapper.toModel(se.getEjercicio()))
                .collect(Collectors.toList());
        }
        
        return Subprograma.builder()
            .id(entity.getId())
            .nombre(entity.getNombre())
            .descripcion(entity.getDescripcion())
            .orden(entity.getOrden())
            .programaPersonalizadoId(entity.getProgramaPersonalizado() != null ? 
                entity.getProgramaPersonalizado().getId() : null)
            .ejercicios(ejercicios)
            .fechaCreacion(entity.getFechaCreacion())
            .fechaActualizacion(entity.getFechaActualizacion())
            .build();
    }
    
    public SubprogramaEntity toEntity(Subprograma model) {
        if (model == null) {
            return null;
        }
        
        ProgramaPersonalizadoEntity programaEntity = null;
        if (model.getProgramaPersonalizadoId() != null) {
            programaEntity = programaPersonalizadoRepository.findById(model.getProgramaPersonalizadoId())
                .orElseThrow(() -> new IllegalArgumentException("Programa personalizado no encontrado"));
        }
        
        SubprogramaEntity entity = SubprogramaEntity.builder()
            .id(model.getId())
            .nombre(model.getNombre())
            .descripcion(model.getDescripcion())
            .orden(model.getOrden())
            .programaPersonalizado(programaEntity)
            .fechaCreacion(model.getFechaCreacion())
            .fechaActualizacion(model.getFechaActualizacion())
            .build();
        
        return entity;
    }
    
    public List<Subprograma> toModelList(List<SubprogramaEntity> entities) {
        if (entities == null) {
            return List.of();
        }
        
        return entities.stream()
            .map(this::toModel)
            .collect(Collectors.toList());
    }
} 