package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.ProgramaPersonalizadoEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;

@Repository
public interface ProgramaPersonalizadoRepository extends JpaRepository<ProgramaPersonalizadoEntity, Long> {
    
    List<ProgramaPersonalizadoEntity> findByEmpresa(EmpresaEntity empresa);
    
    List<ProgramaPersonalizadoEntity> findByEmpresaId(Long empresaId);
    
    List<ProgramaPersonalizadoEntity> findByCreadoPorUsuario(UsuarioEntity usuario);
    
    List<ProgramaPersonalizadoEntity> findByCreadoPorUsuarioId(Long usuarioId);
} 