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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.RegistroCompletoDTO;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.EmpresaDTO;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.UsuarioDTO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
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
        if (registroDTO == null) {
            throw new IllegalArgumentException("Los datos de registro no pueden ser nulos");
        }
        
        UsuarioDTO usuarioDTO = registroDTO.getUsuario();
        EmpresaDTO empresaDTO = registroDTO.getEmpresa();
        
        if (usuarioDTO == null) {
            throw new IllegalArgumentException("Los datos del usuario no pueden ser nulos");
        }
        
        if (empresaDTO == null) {
            throw new IllegalArgumentException("Los datos de la empresa no pueden ser nulos");
        }
        
        // Validar datos obligatorios de la empresa
        validarDatosEmpresa(empresaDTO);
        
        // Validar datos obligatorios del usuario
        validarDatosUsuario(usuarioDTO);
        
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
        
        log.info("Creando empresa con nombre: {}, NIF: {}", empresaDTO.getNombre(), empresaDTO.getNif());
        
        // 1. Crear la empresa primero
        Empresa empresa = Empresa.builder()
                .nombre(empresaDTO.getNombre())
                .nif(empresaDTO.getNif())
                .direccion(construirDireccion(empresaDTO))
                .telefono(empresaDTO.getTelefono())
                .email(empresaDTO.getEmail())
                .web(empresaDTO.getWeb() != null ? empresaDTO.getWeb() : "")
                .logoUrl(logoUrl)
                .build();
        
        Empresa empresaGuardada = empresaService.crearEmpresa(empresa);
        log.info("Empresa creada con ID: {}", empresaGuardada.getId());
        
        if (empresaGuardada == null || empresaGuardada.getId() == null) {
            throw new RuntimeException("Error al crear la empresa: la empresa guardada o su ID es nulo");
        }
        
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
        
        log.info("Creando usuario con nombre: {}, email: {}, vinculado a empresa ID: {}", 
                usuarioDTO.getNombre(), usuarioDTO.getEmail(), empresaGuardada.getId());
        
        // 2. Crear el usuario asociado a la empresa
        Usuario usuario = Usuario.builder()
                .nombre(usuarioDTO.getNombre())
                .apellidos(usuarioDTO.getApellidos())
                .email(usuarioDTO.getEmail())
                .contraseña(passwordEncoder.encode(usuarioDTO.getContraseña()))
                .telefono(usuarioDTO.getTelefono())
                .dni(usuarioDTO.getDni())
                .numeroColegiado(usuarioDTO.getNumeroColegiado() != null ? usuarioDTO.getNumeroColegiado() : "")
                .especialidad(usuarioDTO.getEspecialidad() != null ? usuarioDTO.getEspecialidad() : "")
                .rol(rol)
                .empresaId(empresaGuardada.getId())
                .fechaAlta(fechaAlta)
                .emailVerificado(false)
                .build();
        
        Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
        log.info("Usuario creado con ID: {}", usuarioCreado.getId());
        
        return usuarioCreado;
    }
    
    private void validarDatosEmpresa(EmpresaDTO empresaDTO) {
        if (StringUtils.isEmpty(empresaDTO.getNombre())) {
            throw new IllegalArgumentException("El nombre de la empresa es obligatorio");
        }
        
        if (StringUtils.isEmpty(empresaDTO.getNif())) {
            throw new IllegalArgumentException("El NIF/CIF de la empresa es obligatorio");
        }
        
        if (StringUtils.isEmpty(empresaDTO.getTelefono())) {
            throw new IllegalArgumentException("El teléfono de la empresa es obligatorio");
        }
        
        if (StringUtils.isEmpty(empresaDTO.getEmail())) {
            throw new IllegalArgumentException("El email de la empresa es obligatorio");
        }
    }
    
    private void validarDatosUsuario(UsuarioDTO usuarioDTO) {
        if (StringUtils.isEmpty(usuarioDTO.getNombre())) {
            throw new IllegalArgumentException("El nombre del usuario es obligatorio");
        }
        
        if (StringUtils.isEmpty(usuarioDTO.getApellidos())) {
            throw new IllegalArgumentException("Los apellidos del usuario son obligatorios");
        }
        
        if (StringUtils.isEmpty(usuarioDTO.getEmail())) {
            throw new IllegalArgumentException("El email del usuario es obligatorio");
        }
        
        if (StringUtils.isEmpty(usuarioDTO.getContraseña())) {
            throw new IllegalArgumentException("La contraseña del usuario es obligatoria");
        }
        
        if (StringUtils.isEmpty(usuarioDTO.getDni())) {
            throw new IllegalArgumentException("El DNI del usuario es obligatorio");
        }
    }
    
    private String construirDireccion(EmpresaDTO empresaDTO) {
        StringBuilder direccion = new StringBuilder();
        
        if (!StringUtils.isEmpty(empresaDTO.getDireccion())) {
            direccion.append(empresaDTO.getDireccion());
        }
        
        if (!StringUtils.isEmpty(empresaDTO.getCodigoPostal())) {
            if (direccion.length() > 0) direccion.append(", ");
            direccion.append(empresaDTO.getCodigoPostal());
        }
        
        if (!StringUtils.isEmpty(empresaDTO.getCiudad())) {
            if (direccion.length() > 0) direccion.append(", ");
            direccion.append(empresaDTO.getCiudad());
        }
        
        if (!StringUtils.isEmpty(empresaDTO.getProvincia())) {
            if (direccion.length() > 0) direccion.append(", ");
            direccion.append(empresaDTO.getProvincia());
        }
        
        return direccion.length() > 0 ? direccion.toString() : "";
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
            log.error("Error al guardar el logo: {}", e.getMessage());
            // No propagamos la excepción para que no falle todo el registro por un problema con el logo
            return null;
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