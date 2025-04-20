package com.proyectofisio.infrastructure.adapters.input.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.EmailServicePort;
import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.application.ports.input.VerificationTokenServicePort;
import com.proyectofisio.application.services.RegistroCompletoService;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.VerificationToken;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.AuthRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.AuthResponse;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.RegistroCompletoDTO;
import com.proyectofisio.infrastructure.config.security.JwtTokenProvider;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioServicePort usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final RegistroCompletoService registroCompletoService;
    private final EmailServicePort emailService;
    private final VerificationTokenServicePort verificationTokenService;

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
            
            // Por defecto, establecer email como no verificado
            usuario.setEmailVerificado(false);
            
            // Guardar usuario
            Usuario usuarioGuardado = usuarioService.crearUsuario(usuario);
            
            // Generar token de verificación
            String tokenVerificacion = verificationTokenService.crearToken(usuario.getEmail(), usuarioGuardado.getId());
            
            // Enviar correo de verificación
            emailService.enviarCorreoVerificacion(usuarioGuardado, tokenVerificacion);
            
            // Generar token JWT
            String jwtToken = jwtTokenProvider.createToken(usuarioGuardado.getEmail(), usuarioGuardado.getRol().name());
            
            // Crear respuesta
            AuthResponse response = new AuthResponse(usuarioGuardado.getId(), usuarioGuardado.getNombre(), 
                    usuarioGuardado.getApellidos(), usuarioGuardado.getEmail(), 
                    usuarioGuardado.getRol().name(), jwtToken, usuarioGuardado.getEmpresaId());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario: " + e.getMessage());
        }
    }
    
    @PostMapping(value = "/registro-completo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registroCompleto(@ModelAttribute @Valid RegistroCompletoDTO registroDTO) {
        try {
            // Verificar que los objetos no son nulos (ya lo hace @Valid, pero por si acaso)
            if (registroDTO.getUsuario() == null || registroDTO.getEmpresa() == null) {
                return ResponseEntity.badRequest().body("Los datos de usuario y empresa son obligatorios");
            }
            
            // Si la fecha de alta es nula, establecerla
            if (registroDTO.getUsuario().getFechaAlta() == null) {
                registroDTO.getUsuario().setFechaAlta(LocalDate.now());
            }
            
            // Usar el servicio de registro completo para crear empresa y usuario
            Usuario usuarioGuardado = registroCompletoService.registrarUsuarioYEmpresa(registroDTO);
            
            // Por defecto, establecer email como no verificado
            usuarioGuardado.setEmailVerificado(false);
            usuarioGuardado = usuarioService.actualizarUsuario(usuarioGuardado);
            
            // Generar token de verificación
            String tokenVerificacion = verificationTokenService.crearToken(usuarioGuardado.getEmail(), usuarioGuardado.getId());
            
            // Enviar correo de verificación
            emailService.enviarCorreoVerificacion(usuarioGuardado, tokenVerificacion);
            
            // Generar token JWT
            String jwtToken = jwtTokenProvider.createToken(usuarioGuardado.getEmail(), usuarioGuardado.getRol().name());
            
            // Crear respuesta
            AuthResponse response = new AuthResponse(
                    usuarioGuardado.getId(), 
                    usuarioGuardado.getNombre(), 
                    usuarioGuardado.getApellidos(), 
                    usuarioGuardado.getEmail(), 
                    usuarioGuardado.getRol().name(), 
                    jwtToken,
                    usuarioGuardado.getEmpresaId());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario y empresa: " + e.getMessage());
        }
    }
    
    @GetMapping("/verificar-email/{token}")
    public ResponseEntity<?> verificarEmail(@PathVariable String token) {
        try {
            // Verificar que el token es válido
            if (!verificationTokenService.esValido(token)) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "El token no es válido o ha expirado");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Obtener datos del token
            Optional<VerificationToken> verificationToken = verificationTokenService.buscarPorToken(token);
            if (verificationToken.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Token no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Buscar usuario por email
            String email = verificationToken.get().getEmail();
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorEmail(email);
            if (usuarioOpt.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Actualizar estado de verificación del usuario
            Usuario usuario = usuarioOpt.get();
            usuario.setEmailVerificado(true);
            usuarioService.actualizarUsuario(usuario);
            
            // Marcar token como usado
            verificationTokenService.marcarComoUsado(token);
            
            // Retornar respuesta exitosa
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "¡Email verificado correctamente!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error al verificar email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 