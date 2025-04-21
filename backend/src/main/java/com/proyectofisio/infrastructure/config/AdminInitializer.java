package com.proyectofisio.infrastructure.config;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Crea un usuario administrador y empresa por defecto usando SQL nativo
 * para evitar problemas con JPA/Hibernate
 */
@Component
@Slf4j
public class AdminInitializer {
    
    private final DataSource dataSource;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AdminInitializer(DataSource dataSource, PasswordEncoder passwordEncoder) {
        this.dataSource = dataSource;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Bean
    @Order(1) // Para que se ejecute antes que el DataInitializer
    public CommandLineRunner initializeAdmin() {
        return args -> {
            log.info("Intentando crear usuario administrador por defecto (SQL nativo)...");
            
            try (Connection conn = dataSource.getConnection()) {
                // Comprobar si ya existe el usuario admin
                if (!existeUsuarioAdmin(conn)) {
                    // Crear o recuperar la empresa
                    Long empresaId = obtenerOCrearEmpresa(conn);
                    
                    // Crear el usuario admin
                    crearUsuarioAdmin(conn, empresaId);
                    
                    log.info("Usuario administrador creado con éxito mediante SQL nativo");
                } else {
                    log.info("El usuario administrador ya existe, no se creará uno nuevo");
                }
            } catch (SQLException e) {
                log.error("Error al crear admin: {}", e.getMessage());
                // No lanzar excepción para permitir que la aplicación continúe
            }
        };
    }
    
    private boolean existeUsuarioAdmin(Connection conn) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuarios WHERE email = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, "admin@fisioayuda.com");
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
    
    private Long obtenerOCrearEmpresa(Connection conn) throws SQLException {
        String sql = "SELECT id FROM empresas WHERE nif = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, "A12345678");
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    // La empresa ya existe
                    Long id = rs.getLong("id");
                    log.info("Empresa encontrada con ID: {}", id);
                    return id;
                }
            }
        }
        
        // La empresa no existe, crearla
        log.info("Creando empresa por defecto...");
        String insertSql = "INSERT INTO empresas (nombre, nif, direccion, telefono, email, web) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, "FisioAyuda Admin");
            ps.setString(2, "A12345678");
            ps.setString(3, "Calle Administración, 1");
            ps.setString(4, "600000000");
            ps.setString(5, "admin@fisioayuda.com");
            ps.setString(6, "");
            
            int affectedRows = ps.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Falló la creación de la empresa, no se insertaron filas");
            }
            
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    Long id = generatedKeys.getLong(1);
                    log.info("Empresa creada con ID: {}", id);
                    return id;
                } else {
                    throw new SQLException("Falló la creación de la empresa, no se obtuvo ID");
                }
            }
        }
    }
    
    private void crearUsuarioAdmin(Connection conn, Long empresaId) throws SQLException {
        String insertSql = "INSERT INTO usuarios (nombre, apellidos, email, telefono, dni, numero_colegiado, especialidad, rol, contraseña, empresa_id, fecha_alta, email_verificado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, "Admin");
            ps.setString(2, "FisioAyuda");
            ps.setString(3, "admin@fisioayuda.com");
            ps.setString(4, "600000000");
            ps.setString(5, "12345678Z");
            ps.setString(6, ""); // numero_colegiado
            ps.setString(7, ""); // especialidad
            ps.setString(8, "ADMINISTRADOR");
            ps.setString(9, passwordEncoder.encode("admin"));
            ps.setLong(10, empresaId);
            ps.setObject(11, LocalDate.now());
            ps.setBoolean(12, true);
            
            int affectedRows = ps.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Falló la creación del usuario admin, no se insertaron filas");
            }
            
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    Long id = generatedKeys.getLong(1);
                    log.info("Usuario admin creado con ID: {}", id);
                } else {
                    throw new SQLException("Falló la creación del usuario admin, no se obtuvo ID");
                }
            }
        }
    }
} 