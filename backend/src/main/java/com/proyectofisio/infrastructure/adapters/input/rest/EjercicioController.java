package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

import com.proyectofisio.application.ports.input.ProgramaPersonalizadoServicePort;
import com.proyectofisio.domain.model.Ejercicio;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.EjercicioRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.MessageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ejercicios")
@RequiredArgsConstructor
public class EjercicioController {

    private final ProgramaPersonalizadoServicePort programaService;
    
    // Endpoint para crear un ejercicio
    @PostMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Ejercicio> crearEjercicio(@RequestBody EjercicioRequest request) {
        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());
        Long empresaId = obtenerEmpresaIdDelUsuario(userId);
        
        Ejercicio ejercicio = Ejercicio.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .urlVideo(request.getUrlVideo())
                .esVideoExterno(request.getEsVideoExterno())
                .instrucciones(request.getInstrucciones())
                .repeticiones(request.getRepeticiones())
                .duracionSegundos(request.getDuracionSegundos())
                .empresaId(empresaId)
                .creadoPorUsuarioId(userId)
                .build();
        
        Ejercicio createdEjercicio = programaService.crearEjercicio(ejercicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEjercicio);
    }
    
    // Endpoint para obtener un ejercicio por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Ejercicio> getEjercicioById(@PathVariable Long id) {
        return ResponseEntity.ok(programaService.getEjercicioById(id));
    }
    
    // Endpoint para obtener todos los ejercicios de una empresa
    @GetMapping
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Ejercicio>> getEjerciciosByEmpresa() {
        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());
        Long empresaId = obtenerEmpresaIdDelUsuario(userId);
        
        return ResponseEntity.ok(programaService.getAllEjerciciosByEmpresaId(empresaId));
    }
    
    // Endpoint para buscar ejercicios por nombre
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<List<Ejercicio>> searchEjerciciosByNombre(
            @RequestParam String query) {
        
        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());
        Long empresaId = obtenerEmpresaIdDelUsuario(userId);
        
        return ResponseEntity.ok(programaService.searchEjerciciosByNombre(query, empresaId));
    }
    
    // Método para obtener el empresaId del usuario
    private Long obtenerEmpresaIdDelUsuario(Long userId) {
        // Consultar la base de datos para obtener el empresaId del usuario
        try {
            // Aquí deberías inyectar y usar el UsuarioRepository para obtener la información
            // Por ahora, utilizamos un valor por defecto para pruebas
            return 1L; // ID de empresa por defecto para pruebas
        } catch (Exception e) {
            // En caso de error, devolvemos un valor por defecto
            return 1L;
        }
    }
    
    // Endpoint para actualizar un ejercicio
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Ejercicio> updateEjercicio(
            @PathVariable Long id,
            @RequestBody EjercicioRequest request) {
        
        // Obtener el ejercicio existente para mantener los datos actuales
        Ejercicio existingEjercicio = programaService.getEjercicioById(id);
        
        Ejercicio ejercicioToUpdate = Ejercicio.builder()
                .id(id)
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .urlVideo(request.getUrlVideo())
                .esVideoExterno(request.getEsVideoExterno())
                .instrucciones(request.getInstrucciones())
                .repeticiones(request.getRepeticiones())
                .duracionSegundos(request.getDuracionSegundos())
                .orden(existingEjercicio.getOrden())
                .empresaId(existingEjercicio.getEmpresaId())
                .creadoPorUsuarioId(existingEjercicio.getCreadoPorUsuarioId())
                .build();
        
        return ResponseEntity.ok(programaService.updateEjercicio(id, ejercicioToUpdate));
    }
    
    // Endpoint para eliminar un ejercicio
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<MessageResponse> deleteEjercicio(@PathVariable Long id) {
        programaService.deleteEjercicio(id);
        return ResponseEntity.ok(new MessageResponse("Ejercicio eliminado correctamente"));
    }
} 