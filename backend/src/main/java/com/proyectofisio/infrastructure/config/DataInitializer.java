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
        crearUsuarioAdminPorDefecto();
    }

    /**
     * Crea un usuario administrador por defecto si no existe ningún usuario
     * con el email "admin@fisioayuda.com"
     */
    private void crearUsuarioAdminPorDefecto() {
        String adminEmail = "admin@fisioayuda.com";
        
        // Verificar si ya existe un usuario admin
        Optional<Usuario> usuarioExistente = usuarioService.obtenerUsuarioPorEmail(adminEmail);
        
        if (usuarioExistente.isEmpty()) {
            log.info("Creando usuario administrador por defecto...");
            
            // Crear empresa para el administrador
            Empresa empresaAdmin = Empresa.builder()
                    .nombre("FisioAyuda Admin")
                    .nif("A12345678")
                    .direccion("Calle Administración, 1")
                    .telefono("600000000")
                    .email(adminEmail)
                    .build();
            
            Empresa empresaGuardada = empresaService.crearEmpresa(empresaAdmin);
            
            // Crear usuario administrador
            Usuario usuarioAdmin = Usuario.builder()
                    .nombre("Admin")
                    .apellidos("FisioAyuda")
                    .email(adminEmail)
                    .contraseña(passwordEncoder.encode("admin"))
                    .telefono("600000000")
                    .dni("12345678Z")
                    .rol(RolUsuario.ADMINISTRADOR)
                    .empresaId(empresaGuardada.getId())
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