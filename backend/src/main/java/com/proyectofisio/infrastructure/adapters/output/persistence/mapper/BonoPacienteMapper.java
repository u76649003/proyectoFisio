package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import com.proyectofisio.domain.model.BonoPaciente;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.BonoPacienteEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BonoPacienteMapper {
    
    BonoPacienteMapper INSTANCE = Mappers.getMapper(BonoPacienteMapper.class);
    
    @Mapping(target = "id", source = "id")
    BonoPaciente toDomain(BonoPacienteEntity bonoPacienteEntity);
    
    @Mapping(target = "id", source = "id")
    BonoPacienteEntity toEntity(BonoPaciente bonoPaciente);
} 