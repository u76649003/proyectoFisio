package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyectofisio.application.ports.input.ProgramaPersonalizadoServicePort;
import com.proyectofisio.domain.model.AccessToken;
import com.proyectofisio.domain.model.ProgramaPersonalizado;
import com.proyectofisio.domain.model.Subprograma;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.GenerarTokenRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.MessageResponse;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.ProgramaPersonalizadoRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.ReordenarEjerciciosRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.SubprogramaRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.TokenResponse;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.ValidarTokenRequest;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PacienteEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PacienteRepository;
import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.domain.model.Usuario;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/programas-personalizados")
@RequiredArgsConstructor
@Slf4j
public class ProgramaPersonalizadoController {

    private final ProgramaPersonalizadoServicePort programaService;
    private final PacienteRepository pacienteRepository;
    private final UsuarioServicePort usuarioService;
    
    // Endpoint para crear un programa personalizado
    @PostMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<ProgramaPersonalizado> crearProgramaPersonalizado(
            @RequestBody ProgramaPersonalizadoRequest request) {
        
        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        log.info("=== DEBUG AUTENTICACIÓN DETALLADA ===");
        log.info("Nombre de usuario autenticado: {}", auth.getName());
        log.info("Autoridades del usuario: {}", auth.getAuthorities());
        log.info("Clase de autoridades: {}", auth.getAuthorities().getClass().getName());
        log.info("Lista de autoridades:");
        auth.getAuthorities().forEach(authority -> {
            log.info("- Autoridad: {}, Clase: {}", authority, authority.getClass().getName());
        });
        log.info("¿Está autenticado?: {}", auth.isAuthenticated());
        log.info("Tipo de autenticación: {}", auth.getClass().getName());
        log.info("Detalles de la autenticación: {}", auth.getDetails());
        log.info("Principal: {}", auth.getPrincipal());
        log.info("Clase del Principal: {}", auth.getPrincipal().getClass().getName());
        log.info("Credenciales: {}", auth.getCredentials());
        
        // Comprobar si el usuario tiene los roles necesarios
        boolean tieneRolFisio = auth.getAuthorities().contains(new SimpleGrantedAuthority("FISIOTERAPEUTA"));
        boolean tieneRolDueno = auth.getAuthorities().contains(new SimpleGrantedAuthority("DUENO"));
        log.info("¿Tiene rol FISIOTERAPEUTA?: {}", tieneRolFisio);
        log.info("¿Tiene rol DUENO?: {}", tieneRolDueno);
        
        String email = auth.getName();
        log.info("Email del usuario: {}", email);
        
        // Obtener usuario por email
        Usuario usuario = usuarioService.obtenerUsuarioPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        
        log.info("Usuario encontrado: ID={}, Nombre={}, Rol={}", 
                usuario.getId(), usuario.getNombre(), usuario.getRol());
        log.info("EmpresaId del usuario: {}", usuario.getEmpresaId());
        
        Long userId = usuario.getId();
        Long empresaId = usuario.getEmpresaId();
        
        log.info("Datos del programa a crear:");
        log.info("Nombre: {}", request.getNombre());
        log.info("Tipo: {}", request.getTipoPrograma());
        log.info("Descripción: {}", request.getDescripcion());
        log.info("EmpresaId: {}", empresaId);
        log.info("CreadoPorUsuarioId: {}", userId);
        
        ProgramaPersonalizado programa = ProgramaPersonalizado.builder()
                .nombre(request.getNombre())
                .tipoPrograma(request.getTipoPrograma())
                .descripcion(request.getDescripcion())
                .empresaId(empresaId)
                .creadoPorUsuarioId(userId)
                .build();
        
        ProgramaPersonalizado createdPrograma = programaService.crearProgramaPersonalizado(programa);
        log.info("Programa creado correctamente con ID: {}", createdPrograma.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPrograma);
    }
    
    // Endpoint para obtener un programa personalizado por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<ProgramaPersonalizado> getProgramaPersonalizadoById(@PathVariable Long id) {
        return ResponseEntity.ok(programaService.getProgramaPersonalizadoById(id));
    }
    
    // Endpoint para obtener todos los programas personalizados de una empresa
    @GetMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<ProgramaPersonalizado>> getProgramasPersonalizadosByEmpresa() {
        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        // Obtener usuario por email
        Usuario usuario = usuarioService.obtenerUsuarioPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        
        Long empresaId = usuario.getEmpresaId();
        
        return ResponseEntity.ok(programaService.getProgramasPersonalizadosByEmpresaId(empresaId));
    }
    
    // Endpoint para actualizar un programa personalizado
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<ProgramaPersonalizado> updateProgramaPersonalizado(
            @PathVariable Long id, 
            @RequestBody ProgramaPersonalizadoRequest request) {
        
        // Obtener el programa existente para mantener los datos actuales
        ProgramaPersonalizado existingPrograma = programaService.getProgramaPersonalizadoById(id);
        
        // Actualizar solo los campos proporcionados
        ProgramaPersonalizado programaToUpdate = ProgramaPersonalizado.builder()
                .id(id)
                .nombre(request.getNombre())
                .tipoPrograma(request.getTipoPrograma())
                .descripcion(request.getDescripcion())
                .empresaId(existingPrograma.getEmpresaId())
                .creadoPorUsuarioId(existingPrograma.getCreadoPorUsuarioId())
                .build();
        
        return ResponseEntity.ok(programaService.updateProgramaPersonalizado(id, programaToUpdate));
    }
    
    // Endpoint para eliminar un programa personalizado
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<MessageResponse> deleteProgramaPersonalizado(@PathVariable Long id) {
        programaService.deleteProgramaPersonalizado(id);
        return ResponseEntity.ok(new MessageResponse("Programa personalizado eliminado correctamente"));
    }
    
    // Endpoint para crear un subprograma
    @PostMapping("/{programaId}/subprogramas")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Subprograma> crearSubprograma(
            @PathVariable Long programaId,
            @RequestBody SubprogramaRequest request) {
        
        Subprograma subprograma = Subprograma.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .orden(request.getOrden())
                .videoReferencia(request.getVideoReferencia())
                .esEnlaceExterno(request.getEsEnlaceExterno())
                .imagenesUrls(request.getImagenesUrls())
                .programaPersonalizadoId(programaId)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(programaService.crearSubprograma(subprograma));
    }
    
    // Endpoint para obtener los subprogramas de un programa
    @GetMapping("/{programaId}/subprogramas")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Subprograma>> getSubprogramasByProgramaId(@PathVariable Long programaId) {
        return ResponseEntity.ok(programaService.getSubprogramasByProgramaId(programaId));
    }
    
    // Endpoint para actualizar un subprograma
    @PutMapping("/subprogramas/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Subprograma> updateSubprograma(
            @PathVariable Long id,
            @RequestBody SubprogramaRequest request) {
        
        // Obtener el subprograma existente para mantener los datos actuales
        Subprograma existingSubprograma = programaService.getSubprogramaById(id);
        
        Subprograma subprogramaToUpdate = Subprograma.builder()
                .id(id)
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .orden(request.getOrden())
                .videoReferencia(request.getVideoReferencia())
                .esEnlaceExterno(request.getEsEnlaceExterno())
                .imagenesUrls(request.getImagenesUrls())
                .programaPersonalizadoId(existingSubprograma.getProgramaPersonalizadoId())
                .build();
        
        return ResponseEntity.ok(programaService.updateSubprograma(id, subprogramaToUpdate));
    }
    
    // Endpoint para eliminar un subprograma
    @DeleteMapping("/subprogramas/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<MessageResponse> deleteSubprograma(@PathVariable Long id) {
        programaService.deleteSubprograma(id);
        return ResponseEntity.ok(new MessageResponse("Subprograma eliminado correctamente"));
    }
    
    // Endpoint para subir video de un subprograma
    @PostMapping(value = "/subprogramas/{id}/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<?> uploadSubprogramaVideo(
            @PathVariable Long id,
            @RequestParam("video") MultipartFile videoFile) {
        
        try {
            // Obtener el subprograma existente
            Subprograma existingSubprograma = programaService.getSubprogramaById(id);
            
            // Guardar video en el servidor y obtener URL
            String videoUrl = guardarMultimedia(videoFile, "videos");
            
            // Actualizar el subprograma con la URL del video
            Subprograma subprogramaToUpdate = Subprograma.builder()
                    .id(id)
                    .nombre(existingSubprograma.getNombre())
                    .descripcion(existingSubprograma.getDescripcion())
                    .orden(existingSubprograma.getOrden())
                    .videoReferencia(videoUrl)
                    .esEnlaceExterno(false)
                    .imagenesUrls(existingSubprograma.getImagenesUrls())
                    .programaPersonalizadoId(existingSubprograma.getProgramaPersonalizadoId())
                    .build();
            
            programaService.updateSubprograma(id, subprogramaToUpdate);
            
            Map<String, String> response = new HashMap<>();
            response.put("videoUrl", videoUrl);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al subir video: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error al subir video: " + e.getMessage()));
        }
    }
    
    // Endpoint para subir imágenes de un subprograma
    @PostMapping(value = "/subprogramas/{id}/imagenes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<?> uploadSubprogramaImagenes(
            @PathVariable Long id,
            @RequestParam("imagenes") List<MultipartFile> imagenesFiles) {
        
        try {
            // Obtener el subprograma existente
            Subprograma existingSubprograma = programaService.getSubprogramaById(id);
            
            // Lista para almacenar las URLs de las imágenes
            List<String> imagenesUrls = new ArrayList<>();
            
            // Si ya hay imágenes, mantenerlas
            if (existingSubprograma.getImagenesUrls() != null) {
                imagenesUrls.addAll(existingSubprograma.getImagenesUrls());
            }
            
            // Guardar cada imagen y añadir su URL
            for (MultipartFile imagenFile : imagenesFiles) {
                String imagenUrl = guardarMultimedia(imagenFile, "imagenes");
                imagenesUrls.add(imagenUrl);
            }
            
            // Actualizar el subprograma con las URLs de las imágenes
            Subprograma subprogramaToUpdate = Subprograma.builder()
                    .id(id)
                    .nombre(existingSubprograma.getNombre())
                    .descripcion(existingSubprograma.getDescripcion())
                    .orden(existingSubprograma.getOrden())
                    .videoReferencia(existingSubprograma.getVideoReferencia())
                    .esEnlaceExterno(existingSubprograma.getEsEnlaceExterno())
                    .imagenesUrls(imagenesUrls)
                    .programaPersonalizadoId(existingSubprograma.getProgramaPersonalizadoId())
                    .build();
            
            programaService.updateSubprograma(id, subprogramaToUpdate);
            
            return ResponseEntity.ok(imagenesUrls);
            
        } catch (Exception e) {
            log.error("Error al subir imágenes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error al subir imágenes: " + e.getMessage()));
        }
    }
    
    // Método para guardar archivos multimedia
    private String guardarMultimedia(MultipartFile file, String subFolder) throws IOException {
        // Directorio base para archivos multimedia
        String uploadDir = "uploads/" + subFolder;
        
        // Crear el directorio si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generar un nombre único para el archivo
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Guardar el archivo
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        
        // URL para acceder al archivo
        String baseUrl = "http://localhost:8080"; // Ajustar según configuración
        return baseUrl + "/api/files/uploads/" + subFolder + "/" + uniqueFileName;
    }
    
    // Método para obtener la extensión de un archivo
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
    
    // Endpoint para asignar un ejercicio a un subprograma
    @PostMapping("/subprogramas/{subprogramaId}/ejercicios/{ejercicioId}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Subprograma> asignarEjercicioASubprograma(
            @PathVariable Long subprogramaId,
            @PathVariable Long ejercicioId,
            @RequestParam(required = false) Integer orden) {
        
        return ResponseEntity.ok(programaService.asignarEjercicioASubprograma(subprogramaId, ejercicioId, orden));
    }
    
    // Endpoint para remover un ejercicio de un subprograma
    @DeleteMapping("/subprogramas/{subprogramaId}/ejercicios/{ejercicioId}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<MessageResponse> removerEjercicioDeSubprograma(
            @PathVariable Long subprogramaId,
            @PathVariable Long ejercicioId) {
        
        programaService.removerEjercicioDeSubprograma(subprogramaId, ejercicioId);
        return ResponseEntity.ok(new MessageResponse("Ejercicio removido del subprograma correctamente"));
    }
    
    // Endpoint para reordenar ejercicios en un subprograma
    @PutMapping("/subprogramas/{subprogramaId}/ejercicios/reordenar")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<MessageResponse> reordenarEjerciciosEnSubprograma(
            @PathVariable Long subprogramaId,
            @RequestBody ReordenarEjerciciosRequest request) {
        
        programaService.reordenarEjerciciosEnSubprograma(subprogramaId, request.getEjerciciosIds());
        return ResponseEntity.ok(new MessageResponse("Ejercicios reordenados correctamente"));
    }
    
    // Endpoint para generar tokens de acceso para pacientes
    @PostMapping("/{programaId}/generar-tokens")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<TokenResponse>> generarTokensAcceso(
            @PathVariable Long programaId,
            @RequestBody GenerarTokenRequest request) {
        
        List<TokenResponse> tokensResponse = new ArrayList<>();
        
        for (Long pacienteId : request.getPacientesIds()) {
            AccessToken token = programaService.generarTokenAcceso(programaId, pacienteId);
            
            // Obtener nombre del paciente
            PacienteEntity paciente = pacienteRepository.findById(pacienteId)
                .orElse(null);
            
            // Obtener nombre del programa
            ProgramaPersonalizado programa = programaService.getProgramaPersonalizadoById(programaId);
            
            // Construir enlace de acceso
            String enlaceAcceso = "/acceso-programa?token=" + token.getToken().toString();
            
            tokensResponse.add(TokenResponse.builder()
                .id(token.getId())
                .token(token.getToken())
                .pacienteId(token.getPacienteId())
                .pacienteNombre(paciente != null ? paciente.getNombre() + " " + paciente.getApellidos() : "")
                .programaPersonalizadoId(token.getProgramaPersonalizadoId())
                .programaNombre(programa.getNombre())
                .fechaCreacion(token.getFechaCreacion())
                .fechaExpiracion(token.getFechaExpiracion())
                .usado(token.getUsado())
                .enlaceAcceso(enlaceAcceso)
                .build());
        }
        
        return ResponseEntity.ok(tokensResponse);
    }
    
    // Endpoint para obtener tokens de un programa
    @GetMapping("/{programaId}/tokens")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<TokenResponse>> getTokensByProgramaId(@PathVariable Long programaId) {
        List<AccessToken> tokens = programaService.getTokensByProgramaId(programaId);
        
        List<TokenResponse> tokensResponse = tokens.stream()
            .map(token -> {
                // Obtener nombre del paciente
                PacienteEntity paciente = pacienteRepository.findById(token.getPacienteId())
                    .orElse(null);
                
                // Obtener nombre del programa
                ProgramaPersonalizado programa = programaService.getProgramaPersonalizadoById(token.getProgramaPersonalizadoId());
                
                // Construir enlace de acceso
                String enlaceAcceso = "/acceso-programa?token=" + token.getToken().toString();
                
                return TokenResponse.builder()
                    .id(token.getId())
                    .token(token.getToken())
                    .pacienteId(token.getPacienteId())
                    .pacienteNombre(paciente != null ? paciente.getNombre() + " " + paciente.getApellidos() : "")
                    .programaPersonalizadoId(token.getProgramaPersonalizadoId())
                    .programaNombre(programa.getNombre())
                    .fechaCreacion(token.getFechaCreacion())
                    .fechaExpiracion(token.getFechaExpiracion())
                    .usado(token.getUsado())
                    .enlaceAcceso(enlaceAcceso)
                    .build();
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(tokensResponse);
    }
    
    // Endpoint público para validar tokens de acceso
    @PostMapping("/validar-token")
    public ResponseEntity<?> validarToken(@RequestBody ValidarTokenRequest request) {
        try {
            UUID tokenUUID = UUID.fromString(request.getToken());
            ProgramaPersonalizado programa = programaService.getProgramaPersonalizadoByToken(tokenUUID);
            return ResponseEntity.ok(programa);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Endpoint de prueba solo para verificar autenticación
    @GetMapping("/test-auth")
    public ResponseEntity<Map<String, Object>> testAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("nombre", auth.getName());
        response.put("autoridades", auth.getAuthorities().toString());
        response.put("autenticado", auth.isAuthenticated());
        response.put("detalles", auth.getDetails());
        
        // Obtener usuario por email
        try {
            Usuario usuario = usuarioService.obtenerUsuarioPorEmail(auth.getName())
                    .orElse(null);
            
            if (usuario != null) {
                response.put("usuario_id", usuario.getId());
                response.put("usuario_nombre", usuario.getNombre());
                response.put("usuario_rol", usuario.getRol().name());
                response.put("usuario_empresa_id", usuario.getEmpresaId());
            } else {
                response.put("usuario_error", "No se encontró el usuario");
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
} 