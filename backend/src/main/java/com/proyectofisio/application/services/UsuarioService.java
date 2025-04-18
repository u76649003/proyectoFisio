package com.proyectofisio.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.application.ports.output.UsuarioRepositoryPort;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;

@Service
public class UsuarioService implements UsuarioServicePort {

    private final UsuarioRepositoryPort usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        if (existeUsuarioConEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }
        if (usuario.getDni() != null && existeUsuarioConDni(usuario.getDni())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese DNI");
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public List<Usuario> obtenerUsuariosPorEmpresa(Long empresaId) {
        return usuarioRepository.findByEmpresaId(empresaId);
    }

    @Override
    public List<Usuario> obtenerUsuariosPorRol(RolUsuario rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Override
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        if (!usuarioRepository.findById(usuario.getId()).isPresent()) {
            throw new IllegalArgumentException("No existe un usuario con ese ID");
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existeUsuarioConEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    public boolean existeUsuarioConDni(String dni) {
        return usuarioRepository.existsByDni(dni);
    }
} 