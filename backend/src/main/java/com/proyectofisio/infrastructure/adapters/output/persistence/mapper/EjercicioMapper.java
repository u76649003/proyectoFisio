package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Ejercicio;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EjercicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EmpresaRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EjercicioMapper {
    
    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    
    public Ejercicio toModel(EjercicioEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Ejercicio.builder()
            .id(entity.getId())
            .nombre(entity.getNombre())
            .descripcion(entity.getDescripcion())
            .urlVideo(entity.getUrlVideo())
            .esVideoExterno(entity.getEsVideoExterno())
            .instrucciones(entity.getInstrucciones())
            .repeticiones(entity.getRepeticiones())
            .duracionSegundos(entity.getDuracionSegundos())
            .orden(entity.getOrden())
            .empresaId(entity.getEmpresa() != null ? entity.getEmpresa().getId() : null)
            .creadoPorUsuarioId(entity.getCreadoPorUsuario() != null ? entity.getCreadoPorUsuario().getId() : null)
            .fechaCreacion(entity.getFechaCreacion())
            .fechaActualizacion(entity.getFechaActualizacion())
            .build();
    }
    
    public EjercicioEntity toEntity(Ejercicio model) {
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
        
        return EjercicioEntity.builder()
            .id(model.getId())
            .nombre(model.getNombre())
            .descripcion(model.getDescripcion())
            .urlVideo(model.getUrlVideo())
            .esVideoExterno(model.getEsVideoExterno())
            .instrucciones(model.getInstrucciones())
            .repeticiones(model.getRepeticiones())
            .duracionSegundos(model.getDuracionSegundos())
            .orden(model.getOrden())
            .empresa(empresaEntity)
            .creadoPorUsuario(usuarioEntity)
            .fechaCreacion(model.getFechaCreacion())
            .fechaActualizacion(model.getFechaActualizacion())
            .build();
    }
    
    public List<Ejercicio> toModelList(List<EjercicioEntity> entities) {
        if (entities == null) {
            return List.of();
        }
        
        return entities.stream()
            .map(this::toModel)
            .collect(Collectors.toList());
    }
} 