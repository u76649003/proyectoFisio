package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.VerificationToken;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.VerificationTokenEntity;

@Component
public class VerificationTokenMapper {

    public VerificationToken toDomain(VerificationTokenEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return VerificationToken.builder()
                .id(entity.getId())
                .token(entity.getToken())
                .email(entity.getEmail())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaExpiracion(entity.getFechaExpiracion())
                .usado(entity.isUsado())
                .usuarioId(entity.getUsuarioId())
                .build();
    }
    
    public VerificationTokenEntity toEntity(VerificationToken domain) {
        if (domain == null) {
            return null;
        }
        
        return VerificationTokenEntity.builder()
                .id(domain.getId())
                .token(domain.getToken())
                .email(domain.getEmail())
                .fechaCreacion(domain.getFechaCreacion())
                .fechaExpiracion(domain.getFechaExpiracion())
                .usado(domain.isUsado())
                .usuarioId(domain.getUsuarioId())
                .build();
    }
} 