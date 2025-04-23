package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EmpresaRepository;

@Component
public class UsuarioMapper {

    private final EmpresaRepository empresaRepository;

    @Autowired
    public UsuarioMapper(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    public Usuario toDomain(UsuarioEntity entity) {
        if (entity == null) {
            return null;
        }

        return Usuario.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .apellidos(entity.getApellidos())
                .email(entity.getEmail())
                .telefono(entity.getTelefono())
                .dni(entity.getDni())
                .numeroColegiado(entity.getNumeroColegiado())
                .especialidad(entity.getEspecialidad())
                .rol(entity.getRol())
                .contraseña(entity.getContraseña())
                .empresaId(entity.getEmpresa() != null ? entity.getEmpresa().getId() : null)
                .fechaAlta(entity.getFechaAlta())
                .emailVerificado(entity.isEmailVerificado())
                .build();
    }

    public UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) {
            return null;
        }

        UsuarioEntity.UsuarioEntityBuilder builder = UsuarioEntity.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .apellidos(domain.getApellidos())
                .email(domain.getEmail())
                .telefono(domain.getTelefono())
                .dni(domain.getDni())
                .numeroColegiado(domain.getNumeroColegiado())
                .especialidad(domain.getEspecialidad())
                .rol(domain.getRol())
                .contraseña(domain.getContraseña())
                .fechaAlta(domain.getFechaAlta())
                .emailVerificado(domain.isEmailVerificado());

        if (domain.getEmpresaId() != null) {
            EmpresaEntity empresaEntity = empresaRepository.findById(domain.getEmpresaId()).orElse(null);
            builder.empresa(empresaEntity);
        }

        return builder.build();
    }
} 