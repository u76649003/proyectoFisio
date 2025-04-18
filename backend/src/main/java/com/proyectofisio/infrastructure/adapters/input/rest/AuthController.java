package com.proyectofisio.infrastructure.adapters.input.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.application.services.RegistroCompletoService;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.AuthRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.AuthResponse;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.RegistroCompletoDTO;
import com.proyectofisio.infrastructure.config.security.JwtTokenProvider;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioServicePort usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final RegistroCompletoService registroCompletoService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // Autenticar usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            
            // Obtener datos del usuario
            Usuario usuario = usuarioService.obtenerUsuarioPorEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Generar token
            String token = jwtTokenProvider.createToken(usuario.getEmail(), usuario.getRol().name());
            
            // Crear respuesta
            AuthResponse response = new AuthResponse(usuario.getId(), usuario.getNombre(), usuario.getApellidos(), 
                    usuario.getEmail(), usuario.getRol().name(), token, usuario.getEmpresaId());
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        try {
            // Verificar si ya existe el email
            if (usuarioService.existeUsuarioConEmail(usuario.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está registrado");
            }
            
            // Encriptar contraseña
            usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
            
            // Guardar usuario
            Usuario usuarioGuardado = usuarioService.crearUsuario(usuario);
            
            // Generar token
            String token = jwtTokenProvider.createToken(usuarioGuardado.getEmail(), usuarioGuardado.getRol().name());
            
            // Crear respuesta
            AuthResponse response = new AuthResponse(usuarioGuardado.getId(), usuarioGuardado.getNombre(), 
                    usuarioGuardado.getApellidos(), usuarioGuardado.getEmail(), 
                    usuarioGuardado.getRol().name(), token, usuarioGuardado.getEmpresaId());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario: " + e.getMessage());
        }
    }
    
    @PostMapping("/registro-completo")
    public ResponseEntity<?> registroCompleto(@Valid @RequestBody RegistroCompletoDTO registroDTO) {
        try {
            // Usar el servicio de registro completo para crear empresa y usuario
            Usuario usuarioGuardado = registroCompletoService.registrarUsuarioYEmpresa(registroDTO);
            
            // Generar token
            String token = jwtTokenProvider.createToken(usuarioGuardado.getEmail(), usuarioGuardado.getRol().name());
            
            // Crear respuesta
            AuthResponse response = new AuthResponse(
                    usuarioGuardado.getId(), 
                    usuarioGuardado.getNombre(), 
                    usuarioGuardado.getApellidos(), 
                    usuarioGuardado.getEmail(), 
                    usuarioGuardado.getRol().name(), 
                    token,
                    usuarioGuardado.getEmpresaId());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario y empresa: " + e.getMessage());
        }
    }
} 