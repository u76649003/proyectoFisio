package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;

@Component
public class EmpresaMapper {

    public Empresa toDomain(EmpresaEntity entity) {
        if (entity == null) {
            return null;
        }

        return Empresa.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .direccion(entity.getDireccion())
                .telefono(entity.getTelefono())
                .email(entity.getEmail())
                .nif(entity.getNif())
                .web(entity.getWeb())
                .logoUrl(entity.getLogoUrl())
                .build();
    }

    public EmpresaEntity toEntity(Empresa domain) {
        if (domain == null) {
            return null;
        }

        return EmpresaEntity.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .direccion(domain.getDireccion())
                .telefono(domain.getTelefono())
                .email(domain.getEmail())
                .nif(domain.getNif())
                .web(domain.getWeb())
                .logoUrl(domain.getLogoUrl())
                .build();
    }
} 