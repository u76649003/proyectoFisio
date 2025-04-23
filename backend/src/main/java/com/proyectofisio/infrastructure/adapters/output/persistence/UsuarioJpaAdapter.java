package com.proyectofisio.infrastructure.adapters.output.persistence;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.proyectofisio.application.ports.output.UsuarioRepositoryPort;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.UsuarioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.UsuarioMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.UsuarioRepository;

@Component
public class UsuarioJpaAdapter implements UsuarioRepositoryPort {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Autowired
    public UsuarioJpaAdapter(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = usuarioMapper.toEntity(usuario);
        UsuarioEntity savedEntity = usuarioRepository.save(entity);
        return usuarioMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll().stream()
                .map(usuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Usuario> findByEmpresaId(Long empresaId) {
        return usuarioRepository.findByEmpresaId(empresaId).stream()
                .map(usuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Usuario> findByRol(RolUsuario rol) {
        return usuarioRepository.findByRol(rol).stream()
                .map(usuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByDni(String dni) {
        return usuarioRepository.findByDni(dni)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByDni(String dni) {
        return usuarioRepository.existsByDni(dni);
    }
} 