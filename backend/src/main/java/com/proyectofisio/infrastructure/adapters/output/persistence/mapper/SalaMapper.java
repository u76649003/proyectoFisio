package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import com.proyectofisio.domain.model.Sala;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SalaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SalaMapper {
    
    SalaMapper INSTANCE = Mappers.getMapper(SalaMapper.class);
    
    @Mapping(source = "estado", target = "estado")
    Sala toDomain(SalaEntity salaEntity);
    
    @Mapping(source = "estado", target = "estado")
    SalaEntity toEntity(Sala sala);
} 