package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EjercicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EmpresaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;

@Repository
public interface EjercicioRepository extends JpaRepository<EjercicioEntity, Long> {
    
    List<EjercicioEntity> findByEmpresa(EmpresaEntity empresa);
    
    List<EjercicioEntity> findByEmpresaId(Long empresaId);
    
    List<EjercicioEntity> findByCreadoPorUsuario(UsuarioEntity usuario);
    
    List<EjercicioEntity> findByCreadoPorUsuarioId(Long usuarioId);
    
    List<EjercicioEntity> findByEmpresaIdOrderByNombreAsc(Long empresaId);
    
    List<EjercicioEntity> findByNombreContainingIgnoreCaseAndEmpresaId(String nombre, Long empresaId);
} 