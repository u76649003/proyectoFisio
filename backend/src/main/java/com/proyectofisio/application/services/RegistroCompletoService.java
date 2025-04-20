package com.proyectofisio.application.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.RegistroCompletoDTO;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.EmpresaDTO;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.UsuarioDTO;

@Service
public class RegistroCompletoService {

    private final UsuarioServicePort usuarioService;
    private final EmpresaServicePort empresaService;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${app.uploads.dir:uploads}")
    private String uploadDir;
    
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
        UsuarioDTO usuarioDTO = registroDTO.getUsuario();
        EmpresaDTO empresaDTO = registroDTO.getEmpresa();
        
        // Validaciones previas
        if (usuarioService.existeUsuarioConEmail(usuarioDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        if (empresaService.existeEmpresaConNif(empresaDTO.getNif())) {
            throw new IllegalArgumentException("Ya existe una empresa con ese CIF/NIF");
        }
        
        // Procesar y guardar la imagen del logo si existe
        String logoUrl = null;
        if (empresaDTO.getLogo() != null && !empresaDTO.getLogo().isEmpty()) {
            logoUrl = guardarLogo(empresaDTO.getLogo());
        }
        
        // 1. Crear la empresa primero
        Empresa empresa = Empresa.builder()
                .nombre(empresaDTO.getNombre())
                .nif(empresaDTO.getNif())
                .direccion(String.format("%s, %s, %s, %s", 
                        empresaDTO.getDireccion(), 
                        empresaDTO.getCodigoPostal(),
                        empresaDTO.getCiudad(),
                        empresaDTO.getProvincia()))
                .telefono(empresaDTO.getTelefono())
                .email(empresaDTO.getEmail())
                .web(empresaDTO.getWeb())
                .logoUrl(logoUrl)
                .build();
        
        Empresa empresaGuardada = empresaService.crearEmpresa(empresa);
        
        // Determinar el rol del usuario
        RolUsuario rol;
        try {
            rol = RolUsuario.valueOf(usuarioDTO.getRol());
        } catch (IllegalArgumentException e) {
            // Si el rol no es válido, asignar DUEÑO por defecto
            rol = RolUsuario.DUENO;
        }
        
        // Si la fecha de alta es nula, usar la fecha actual
        LocalDate fechaAlta = usuarioDTO.getFechaAlta() != null ? 
                usuarioDTO.getFechaAlta() : LocalDate.now();
        
        // 2. Crear el usuario asociado a la empresa
        Usuario usuario = Usuario.builder()
                .nombre(usuarioDTO.getNombre())
                .apellidos(usuarioDTO.getApellidos())
                .email(usuarioDTO.getEmail())
                .contraseña(passwordEncoder.encode(usuarioDTO.getContraseña()))
                .telefono(usuarioDTO.getTelefono())
                .dni(usuarioDTO.getDni())
                .numeroColegiado(usuarioDTO.getNumeroColegiado())
                .especialidad(usuarioDTO.getEspecialidad())
                .rol(rol)
                .empresaId(empresaGuardada.getId())
                .fechaAlta(fechaAlta)
                .build();
        
        return usuarioService.crearUsuario(usuario);
    }
    
    /**
     * Guarda el logo de la empresa en el sistema de archivos
     * @param logoFile Archivo de logo subido
     * @return URL relativa del logo guardado
     */
    private String guardarLogo(MultipartFile logoFile) {
        try {
            // Crear el directorio de uploads si no existe
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generar un nombre único para el archivo
            String fileExtension = getFileExtension(logoFile.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            
            // Guardar el archivo
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(logoFile.getInputStream(), filePath);
            
            // Devolver la URL relativa
            return "/uploads/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar el logo: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene la extensión de un archivo
     * @param fileName Nombre del archivo
     * @return Extensión del archivo incluyendo el punto
     */
    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0) {
            return "";
        }
        return fileName.substring(lastDotIndex);
    }
} 