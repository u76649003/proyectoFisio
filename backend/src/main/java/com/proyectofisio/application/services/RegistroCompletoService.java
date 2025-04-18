package com.proyectofisio.application.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.RegistroCompletoDTO;

@Service
public class RegistroCompletoService {

    private final UsuarioServicePort usuarioService;
    private final EmpresaServicePort empresaService;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public RegistroCompletoService(
            UsuarioServicePort usuarioService,
            EmpresaServicePort empresaService,
            PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.empresaService = empresaService;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public Usuario registrarUsuarioYEmpresa(RegistroCompletoDTO registroDTO) {
        // Validaciones previas
        if (usuarioService.existeUsuarioConEmail(registroDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        if (empresaService.existeEmpresaConNif(registroDTO.getCifNif())) {
            throw new IllegalArgumentException("Ya existe una empresa con ese CIF/NIF");
        }
        
        // 1. Crear la empresa primero
        Empresa empresa = Empresa.builder()
                .nombre(registroDTO.getNombreEmpresa())
                .cifNif(registroDTO.getCifNif())
                .direccion(registroDTO.getDireccion())
                .codigoPostal(registroDTO.getCodigoPostal())
                .ciudad(registroDTO.getCiudad())
                .provincia(registroDTO.getProvincia())
                .pais(registroDTO.getPais())
                .build();
        
        Empresa empresaGuardada = empresaService.crearEmpresa(empresa);
        
        // 2. Crear el usuario asociado a la empresa
        Usuario usuario = Usuario.builder()
                .nombre(registroDTO.getNombre())
                .apellidos(registroDTO.getApellidos())
                .email(registroDTO.getEmail())
                .contraseña(passwordEncoder.encode(registroDTO.getPassword()))
                .telefono(registroDTO.getTelefono())
                .rol(RolUsuario.DUENO) // Por defecto es DUEÑO al registrar una empresa
                .empresaId(empresaGuardada.getId())
                .build();
        
        return usuarioService.crearUsuario(usuario);
    }
} 