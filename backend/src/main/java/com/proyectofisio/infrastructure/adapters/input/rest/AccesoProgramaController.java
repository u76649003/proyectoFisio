package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.ProgramaPersonalizadoServicePort;
import com.proyectofisio.domain.model.AccessToken;
import com.proyectofisio.domain.model.ComentarioPaciente;
import com.proyectofisio.domain.model.ProgramaPersonalizado;
import com.proyectofisio.domain.model.Subprograma;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.ComentarioPacienteRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.ComentarioSubprogramaRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.MessageResponse;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.ValidarTokenRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/acceso-programa")
@RequiredArgsConstructor
public class AccesoProgramaController {

    private final ProgramaPersonalizadoServicePort programaService;
    
    // Endpoint para validar token y obtener programa personalizado
    @GetMapping("")
    public ResponseEntity<?> validarTokenYObtenerPrograma(@RequestParam String token) {
        try {
            UUID tokenUUID = UUID.fromString(token);
            
            // Validar token
            AccessToken accessToken = programaService.getAccessTokenByToken(tokenUUID);
            if (accessToken == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Token no válido"));
            }
            
            // Si el token ha expirado, devolver error
            if (accessToken.getFechaExpiracion().isBefore(java.time.LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("El token ha expirado"));
            }
            
            // Obtener programa personalizado
            ProgramaPersonalizado programa = programaService.getProgramaPersonalizadoById(accessToken.getProgramaPersonalizadoId());
            
            // Obtener subprogramas con ejercicios
            List<Subprograma> subprogramas = programaService.getSubprogramasByProgramaId(programa.getId());
            
            // Crear un mapa con toda la información
            Map<String, Object> response = new HashMap<>();
            response.put("programa", programa);
            response.put("subprogramas", subprogramas);
            response.put("token", accessToken.getToken().toString());
            response.put("pacienteId", accessToken.getPacienteId());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Endpoint para agregar comentario de paciente a un subprograma
    @PostMapping("/comentario")
    public ResponseEntity<?> agregarComentarioSubprograma(@RequestBody ComentarioSubprogramaRequest request) {
        try {
            UUID tokenUUID = UUID.fromString(request.getToken());
            
            // Verificar que el token sea válido
            AccessToken accessToken = programaService.getAccessTokenByToken(tokenUUID);
            if (accessToken == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Token no válido"));
            }
            
            ComentarioPaciente comentario = ComentarioPaciente.builder()
                .subprogramaId(request.getSubprogramaId())
                .token(tokenUUID)
                .contenido(request.getContenido())
                .leido(false)
                .build();
            
            ComentarioPaciente savedComentario = programaService.crearComentarioPaciente(comentario);
            
            return ResponseEntity.ok(savedComentario);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Endpoint para obtener comentarios de un subprograma para un token específico
    @GetMapping("/comentarios")
    public ResponseEntity<?> getComentariosByTokenAndSubprograma(
            @RequestParam String token,
            @RequestParam Long subprogramaId) {
        
        try {
            UUID tokenUUID = UUID.fromString(token);
            List<ComentarioPaciente> comentarios = programaService.getComentariosByTokenAndSubprogramaId(
                tokenUUID, subprogramaId);
            
            return ResponseEntity.ok(comentarios);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Endpoint para marcar un comentario como leído
    @PostMapping("/comentario/leido")
    public ResponseEntity<?> marcarComentarioComoLeido(@RequestParam Long comentarioId) {
        try {
            programaService.marcarComentarioComoLeido(comentarioId);
            return ResponseEntity.ok(new MessageResponse("Comentario marcado como leído"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(e.getMessage()));
        }
    }
} 