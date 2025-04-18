package com.proyectofisio.application.ports.input;

import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;

public interface UsuarioServicePort {
    
    Usuario crearUsuario(Usuario usuario);
    
    Optional<Usuario> obtenerUsuarioPorId(Long id);
    
    List<Usuario> obtenerTodosLosUsuarios();
    
    List<Usuario> obtenerUsuariosPorEmpresa(Long empresaId);
    
    List<Usuario> obtenerUsuariosPorRol(RolUsuario rol);
    
    Optional<Usuario> obtenerUsuarioPorEmail(String email);
    
    Usuario actualizarUsuario(Usuario usuario);
    
    void eliminarUsuario(Long id);
    
    boolean existeUsuarioConEmail(String email);
    
    boolean existeUsuarioConDni(String dni);
} 