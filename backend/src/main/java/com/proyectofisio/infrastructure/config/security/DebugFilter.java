package com.proyectofisio.infrastructure.config.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DebugFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Obtener la autenticación actual
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Registrar información de depuración para cada solicitud
        log.info("=== SOLICITUD HTTP RECIBIDA ===");
        log.info("URL: {}", request.getRequestURI());
        log.info("Método: {}", request.getMethod());
        log.info("Headers:");
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            log.info("    {}: {}", headerName, request.getHeader(headerName));
        });
        
        if (auth != null) {
            log.info("--- DATOS DE AUTENTICACIÓN ---");
            log.info("Principal: {}", auth.getPrincipal());
            log.info("Autoridades: {}", auth.getAuthorities());
            log.info("Autenticado: {}", auth.isAuthenticated());
        } else {
            log.info("--- NO HAY AUTENTICACIÓN ---");
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
        
        // Registrar información después de procesar la solicitud
        log.info("=== RESPUESTA HTTP ENVIADA ===");
        log.info("Código de estado: {}", response.getStatus());
    }
} 