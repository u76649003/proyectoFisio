package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.ProgramaPersonalizado;
import com.proyectofisio.domain.model.Subprograma;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EmpresaRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProgramaPersonalizadoMapper {
    
    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SubprogramaMapper subprogramaMapper;
    
    public ProgramaPersonalizado toModel(ProgramaPersonalizadoEntity entity) {
        if (entity == null) {
            return null;
        }
        
        List<Subprograma> subprogramas = new ArrayList<>();
        if (entity.getSubprogramas() != null) {
            subprogramas = entity.getSubprogramas().stream()
                .map(subprogramaMapper::toModel)
                .collect(Collectors.toList());
        }
        
        return ProgramaPersonalizado.builder()
            .id(entity.getId())
            .nombre(entity.getNombre())
            .tipoPrograma(entity.getTipoPrograma())
            .descripcion(entity.getDescripcion())
            .empresaId(entity.getEmpresa() != null ? entity.getEmpresa().getId() : null)
            .creadoPorUsuarioId(entity.getCreadoPorUsuario() != null ? entity.getCreadoPorUsuario().getId() : null)
            .subprogramas(subprogramas)
            .fechaCreacion(entity.getFechaCreacion())
            .fechaActualizacion(entity.getFechaActualizacion())
            .build();
    }
    
    public ProgramaPersonalizadoEntity toEntity(ProgramaPersonalizado model) {
        if (model == null) {
            return null;
        }
        
        EmpresaEntity empresaEntity = null;
        if (model.getEmpresaId() != null) {
            empresaEntity = empresaRepository.findById(model.getEmpresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));
        }
        
        UsuarioEntity usuarioEntity = null;
        if (model.getCreadoPorUsuarioId() != null) {
            usuarioEntity = usuarioRepository.findById(model.getCreadoPorUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        }
        
        ProgramaPersonalizadoEntity entity = ProgramaPersonalizadoEntity.builder()
            .id(model.getId())
            .nombre(model.getNombre())
            .tipoPrograma(model.getTipoPrograma())
            .descripcion(model.getDescripcion())
            .empresa(empresaEntity)
            .creadoPorUsuario(usuarioEntity)
            .fechaCreacion(model.getFechaCreacion())
            .fechaActualizacion(model.getFechaActualizacion())
            .build();
        
        return entity;
    }
    
    public List<ProgramaPersonalizado> toModelList(List<ProgramaPersonalizadoEntity> entities) {
        if (entities == null) {
            return List.of();
        }
        
        return entities.stream()
            .map(this::toModel)
            .collect(Collectors.toList());
    }
} 