package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import com.proyectofisio.domain.model.Servicio;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ServicioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ServicioMapper {
    
    ServicioMapper INSTANCE = Mappers.getMapper(ServicioMapper.class);
    
    Servicio toDomain(ServicioEntity servicioEntity);
    
    ServicioEntity toEntity(Servicio servicio);
} 