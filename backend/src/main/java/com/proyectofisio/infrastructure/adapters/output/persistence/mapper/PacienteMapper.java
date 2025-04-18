package com.proyectofisio.infrastructure.adapters.output.persistence.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.domain.model.Paciente;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EmpresaRepository;

@Component
public class PacienteMapper {

    private final EmpresaRepository empresaRepository;

    @Autowired
    public PacienteMapper(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    public Paciente toDomain(PacienteEntity entity) {
        if (entity == null) {
            return null;
        }

        return Paciente.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .apellidos(entity.getApellidos())
                .email(entity.getEmail())
                .telefono(entity.getTelefono())
                .dni(entity.getDni())
                .fechaNacimiento(entity.getFechaNacimiento())
                .direccion(entity.getDireccion())
                .sexo(entity.getSexo())
                .empresaId(entity.getEmpresa() != null ? entity.getEmpresa().getId() : null)
                .fechaAlta(entity.getFechaAlta())
                .build();
    }

    public PacienteEntity toEntity(Paciente domain) {
        if (domain == null) {
            return null;
        }

        PacienteEntity.PacienteEntityBuilder builder = PacienteEntity.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .apellidos(domain.getApellidos())
                .email(domain.getEmail())
                .telefono(domain.getTelefono())
                .dni(domain.getDni())
                .fechaNacimiento(domain.getFechaNacimiento())
                .direccion(domain.getDireccion())
                .sexo(domain.getSexo())
                .fechaAlta(domain.getFechaAlta());

        if (domain.getEmpresaId() != null) {
            EmpresaEntity empresaEntity = empresaRepository.findById(domain.getEmpresaId()).orElse(null);
            builder.empresa(empresaEntity);
        }

        return builder.build();
    }
} 