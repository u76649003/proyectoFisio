package com.proyectofisio.infrastructure.config;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;

import lombok.extern.slf4j.Slf4j;

/**
 * Clase para inicializar datos en la aplicación al arrancar
 */
@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioServicePort usuarioService;
    private final EmpresaServicePort empresaService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(
            UsuarioServicePort usuarioService,
            EmpresaServicePort empresaService,
            PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.empresaService = empresaService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario administrador por defecto si no existe
        try {
            crearUsuarioAdminPorDefecto();
        } catch (Exception e) {
            log.error("Error al inicializar datos: {}", e.getMessage());
            // No propagar la excepción para permitir que la aplicación se inicie
        }
    }

    /**
     * Crea un usuario administrador por defecto si no existe ningún usuario
     * con el email "admin@fisioayuda.com"
     */
    private void crearUsuarioAdminPorDefecto() {
        String adminEmail = "admin@fisioayuda.com";
        String adminNif = "A12345678";
        
        // Verificar si ya existe un usuario admin
        Optional<Usuario> usuarioExistente = usuarioService.obtenerUsuarioPorEmail(adminEmail);
        
        if (usuarioExistente.isEmpty()) {
            log.info("Creando usuario administrador por defecto...");
            
            Empresa empresaAdmin;
            Long empresaId;
            
            // Verificar si ya existe una empresa con el NIF
            boolean empresaExiste = empresaService.existeEmpresaConNif(adminNif);
            
            if (empresaExiste) {
                // Si la empresa ya existe, intentar obtenerla para usar su ID
                log.info("Ya existe una empresa con NIF {}. Buscando su ID...", adminNif);
                Optional<Empresa> empresaExistente = empresaService.obtenerEmpresaPorNif(adminNif);
                
                if (empresaExistente.isPresent()) {
                    empresaId = empresaExistente.get().getId();
                    log.info("Usando empresa existente con ID: {}", empresaId);
                } else {
                    // Si por alguna razón no se puede obtener, crear una con un NIF único
                    String nuevoNif = adminNif + "_" + System.currentTimeMillis();
                    log.info("No se pudo obtener la empresa existente. Creando nueva con NIF: {}", nuevoNif);
                    empresaAdmin = Empresa.builder()
                            .nombre("FisioAyuda Admin")
                            .nif(nuevoNif)
                            .direccion("Calle Administración, 1")
                            .telefono("600000000")
                            .email(adminEmail)
                            .build();
                    
                    empresaAdmin = empresaService.crearEmpresa(empresaAdmin);
                    empresaId = empresaAdmin.getId();
                }
            } else {
                // Crear empresa para el administrador
                log.info("Creando empresa administrativa...");
                empresaAdmin = Empresa.builder()
                        .nombre("FisioAyuda Admin")
                        .nif(adminNif)
                        .direccion("Calle Administración, 1")
                        .telefono("600000000")
                        .email(adminEmail)
                        .build();
                
                empresaAdmin = empresaService.crearEmpresa(empresaAdmin);
                empresaId = empresaAdmin.getId();
            }
            
            // Crear usuario administrador
            Usuario usuarioAdmin = Usuario.builder()
                    .nombre("Admin")
                    .apellidos("FisioAyuda")
                    .email(adminEmail)
                    .contraseña(passwordEncoder.encode("admin"))
                    .telefono("600000000")
                    .dni("12345678Z")
                    .rol(RolUsuario.ADMINISTRADOR)
                    .empresaId(empresaId)
                    .fechaAlta(LocalDate.now())
                    .emailVerificado(true)
                    .build();
            
            usuarioService.crearUsuario(usuarioAdmin);
            log.info("Usuario administrador creado con éxito");
        } else {
            log.info("El usuario administrador ya existe, no se creará uno nuevo");
        }
    }
} 