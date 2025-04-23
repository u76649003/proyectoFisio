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
    @Mapping(target = "pacienteId", source = "paciente.id")
    @Mapping(target = "servicioId", source = "servicio.id")
    @Mapping(target = "productoId", source = "producto.id")
    BonoPaciente toDomain(BonoPacienteEntity bonoPacienteEntity);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "paciente.id", source = "pacienteId")
    @Mapping(target = "servicio.id", source = "servicioId")
    @Mapping(target = "producto.id", source = "productoId")
    BonoPacienteEntity toEntity(BonoPaciente bonoPaciente);
} 