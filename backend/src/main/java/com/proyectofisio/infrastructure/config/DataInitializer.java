package com.proyectofisio.infrastructure.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Clase para inicializar datos adicionales en la aplicación al arrancar
 * El usuario admin se crea en AdminInitializer
 */
@Component
@Slf4j
@Order(2) // Se ejecuta después del AdminInitializer
public class DataInitializer implements CommandLineRunner {

    @Autowired
    public DataInitializer() {
        // Constructor vacío
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Inicializando datos adicionales...");
        
        // Aquí puedes añadir más inicializaciones si son necesarias en el futuro
        
        log.info("Inicialización de datos completada");
    }
} 