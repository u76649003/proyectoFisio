package com.proyectofisio.application.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.ProgramaPersonalizadoServicePort;
import com.proyectofisio.domain.model.AccessToken;
import com.proyectofisio.domain.model.ComentarioPaciente;
import com.proyectofisio.domain.model.Ejercicio;
import com.proyectofisio.domain.model.ProgramaPersonalizado;
import com.proyectofisio.domain.model.Subprograma;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EjercicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.AccessTokenMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.ComentarioPacienteMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.EjercicioMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.ProgramaPersonalizadoMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.SubprogramaMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.AccessTokenRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ComentarioPacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EjercicioRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ProgramaPersonalizadoRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SubprogramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramaPersonalizadoService implements ProgramaPersonalizadoServicePort {

    private final ProgramaPersonalizadoRepository programaRepository;
    private final SubprogramaRepository subprogramaRepository;
    private final EjercicioRepository ejercicioRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final ComentarioPacienteRepository comentarioRepository;
    
    private final ProgramaPersonalizadoMapper programaMapper;
    private final SubprogramaMapper subprogramaMapper;
    private final EjercicioMapper ejercicioMapper;
    private final AccessTokenMapper accessTokenMapper;
    private final ComentarioPacienteMapper comentarioMapper;
    
    // Implementación de métodos para programas personalizados
    
    @Override
    @Transactional
    public ProgramaPersonalizado crearProgramaPersonalizado(ProgramaPersonalizado programa) {
        var entity = programaMapper.toEntity(programa);
        var savedEntity = programaRepository.save(entity);
        return programaMapper.toModel(savedEntity);
    }
    
    @Override
    public ProgramaPersonalizado getProgramaPersonalizadoById(Long id) {
        var entity = programaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Programa personalizado no encontrado con id: " + id));
        return programaMapper.toModel(entity);
    }
    
    @Override
    public List<ProgramaPersonalizado> getAllProgramasPersonalizados() {
        var entities = programaRepository.findAll();
        return programaMapper.toModelList(entities);
    }
    
    @Override
    public List<ProgramaPersonalizado> getProgramasPersonalizadosByEmpresaId(Long empresaId) {
        var entities = programaRepository.findByEmpresaId(empresaId);
        return programaMapper.toModelList(entities);
    }
    
    @Override
    public List<ProgramaPersonalizado> getProgramasPersonalizadosByUsuarioId(Long usuarioId) {
        var entities = programaRepository.findByCreadoPorUsuarioId(usuarioId);
        return programaMapper.toModelList(entities);
    }
    
    @Override
    @Transactional
    public ProgramaPersonalizado updateProgramaPersonalizado(Long id, ProgramaPersonalizado programa) {
        var existingEntity = programaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Programa personalizado no encontrado con id: " + id));
        
        // Actualizar campos
        existingEntity.setNombre(programa.getNombre());
        existingEntity.setTipoPrograma(programa.getTipoPrograma());
        
        var updatedEntity = programaRepository.save(existingEntity);
        return programaMapper.toModel(updatedEntity);
    }
    
    @Override
    @Transactional
    public void deleteProgramaPersonalizado(Long id) {
        if (!programaRepository.existsById(id)) {
            throw new IllegalArgumentException("Programa personalizado no encontrado con id: " + id);
        }
        programaRepository.deleteById(id);
    }
    
    // Implementación de métodos para subprogramas
    
    @Override
    @Transactional
    public Subprograma crearSubprograma(Subprograma subprograma) {
        // Verificar que el programa personalizado exista
        if (!programaRepository.existsById(subprograma.getProgramaPersonalizadoId())) {
            throw new IllegalArgumentException("Programa personalizado no encontrado con id: " + 
                subprograma.getProgramaPersonalizadoId());
        }
        
        // Determinar el orden si no se ha especificado
        if (subprograma.getOrden() == null) {
            var existingSubprogramas = subprogramaRepository
                .findByProgramaPersonalizadoIdOrderByOrdenAsc(subprograma.getProgramaPersonalizadoId());
            
            subprograma.setOrden(existingSubprogramas.isEmpty() ? 1 : existingSubprogramas.size() + 1);
        }
        
        var entity = subprogramaMapper.toEntity(subprograma);
        var savedEntity = subprogramaRepository.save(entity);
        return subprogramaMapper.toModel(savedEntity);
    }
    
    @Override
    public Subprograma getSubprogramaById(Long id) {
        var entity = subprogramaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado con id: " + id));
        return subprogramaMapper.toModel(entity);
    }
    
    @Override
    public List<Subprograma> getSubprogramasByProgramaId(Long programaId) {
        var entities = subprogramaRepository.findByProgramaPersonalizadoIdOrderByOrdenAsc(programaId);
        return subprogramaMapper.toModelList(entities);
    }
    
    @Override
    @Transactional
    public Subprograma updateSubprograma(Long id, Subprograma subprograma) {
        var existingEntity = subprogramaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado con id: " + id));
        
        // Actualizar campos
        existingEntity.setNombre(subprograma.getNombre());
        existingEntity.setDescripcion(subprograma.getDescripcion());
        if (subprograma.getOrden() != null) {
            existingEntity.setOrden(subprograma.getOrden());
        }
        
        var updatedEntity = subprogramaRepository.save(existingEntity);
        return subprogramaMapper.toModel(updatedEntity);
    }
    
    @Override
    @Transactional
    public void deleteSubprograma(Long id) {
        if (!subprogramaRepository.existsById(id)) {
            throw new IllegalArgumentException("Subprograma no encontrado con id: " + id);
        }
        subprogramaRepository.deleteById(id);
    }
    
    // Implementación de métodos para ejercicios
    
    @Override
    @Transactional
    public Ejercicio crearEjercicio(Ejercicio ejercicio) {
        var entity = ejercicioMapper.toEntity(ejercicio);
        var savedEntity = ejercicioRepository.save(entity);
        return ejercicioMapper.toModel(savedEntity);
    }
    
    @Override
    public Ejercicio getEjercicioById(Long id) {
        var entity = ejercicioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ejercicio no encontrado con id: " + id));
        return ejercicioMapper.toModel(entity);
    }
    
    @Override
    public List<Ejercicio> getAllEjerciciosByEmpresaId(Long empresaId) {
        var entities = ejercicioRepository.findByEmpresaIdOrderByNombreAsc(empresaId);
        return ejercicioMapper.toModelList(entities);
    }
    
    @Override
    public List<Ejercicio> searchEjerciciosByNombre(String nombre, Long empresaId) {
        var entities = ejercicioRepository.findByNombreContainingIgnoreCaseAndEmpresaId(nombre, empresaId);
        return ejercicioMapper.toModelList(entities);
    }
    
    @Override
    @Transactional
    public Ejercicio updateEjercicio(Long id, Ejercicio ejercicio) {
        var existingEntity = ejercicioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ejercicio no encontrado con id: " + id));
        
        // Actualizar campos
        existingEntity.setNombre(ejercicio.getNombre());
        existingEntity.setDescripcion(ejercicio.getDescripcion());
        existingEntity.setUrlVideo(ejercicio.getUrlVideo());
        existingEntity.setEsVideoExterno(ejercicio.getEsVideoExterno());
        existingEntity.setInstrucciones(ejercicio.getInstrucciones());
        existingEntity.setRepeticiones(ejercicio.getRepeticiones());
        existingEntity.setDuracionSegundos(ejercicio.getDuracionSegundos());
        if (ejercicio.getOrden() != null) {
            existingEntity.setOrden(ejercicio.getOrden());
        }
        
        var updatedEntity = ejercicioRepository.save(existingEntity);
        return ejercicioMapper.toModel(updatedEntity);
    }
    
    @Override
    @Transactional
    public void deleteEjercicio(Long id) {
        if (!ejercicioRepository.existsById(id)) {
            throw new IllegalArgumentException("Ejercicio no encontrado con id: " + id);
        }
        ejercicioRepository.deleteById(id);
    }
    
    // Implementación de métodos para asignar ejercicios a subprogramas
    
    @Override
    @Transactional
    public Subprograma asignarEjercicioASubprograma(Long subprogramaId, Long ejercicioId, Integer orden) {
        var subprogramaEntity = subprogramaRepository.findById(subprogramaId)
            .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado con id: " + subprogramaId));
        
        var ejercicioEntity = ejercicioRepository.findById(ejercicioId)
            .orElseThrow(() -> new IllegalArgumentException("Ejercicio no encontrado con id: " + ejercicioId));
        
        // Verificar si el ejercicio ya está asignado
        if (subprogramaEntity.getEjercicios().stream()
                .anyMatch(e -> e.getId().equals(ejercicioId))) {
            throw new IllegalArgumentException("El ejercicio ya está asignado a este subprograma");
        }
        
        // Establecer el orden si se proporciona
        if (orden != null) {
            ejercicioEntity.setOrden(orden);
            ejercicioRepository.save(ejercicioEntity);
        } else {
            // Asignar el siguiente orden disponible
            int nextOrder = subprogramaEntity.getEjercicios().size() + 1;
            ejercicioEntity.setOrden(nextOrder);
            ejercicioRepository.save(ejercicioEntity);
        }
        
        // Añadir el ejercicio al subprograma
        subprogramaEntity.getEjercicios().add(ejercicioEntity);
        var savedEntity = subprogramaRepository.save(subprogramaEntity);
        
        return subprogramaMapper.toModel(savedEntity);
    }
    
    @Override
    @Transactional
    public void removerEjercicioDeSubprograma(Long subprogramaId, Long ejercicioId) {
        var subprogramaEntity = subprogramaRepository.findById(subprogramaId)
            .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado con id: " + subprogramaId));
        
        // Verificar si el ejercicio está asignado
        boolean removed = subprogramaEntity.getEjercicios().removeIf(e -> e.getId().equals(ejercicioId));
        
        if (!removed) {
            throw new IllegalArgumentException("El ejercicio no está asignado a este subprograma");
        }
        
        subprogramaRepository.save(subprogramaEntity);
    }
    
    @Override
    @Transactional
    public void reordenarEjerciciosEnSubprograma(Long subprogramaId, List<Long> ejerciciosIds) {
        var subprogramaEntity = subprogramaRepository.findById(subprogramaId)
            .orElseThrow(() -> new IllegalArgumentException("Subprograma no encontrado con id: " + subprogramaId));
        
        // Verificar que todos los ejercicios en el nuevo orden pertenecen al subprograma
        List<Long> existingIds = subprogramaEntity.getEjercicios().stream()
                .map(EjercicioEntity::getId)
                .collect(Collectors.toList());
        
        if (!existingIds.containsAll(ejerciciosIds) || existingIds.size() != ejerciciosIds.size()) {
            throw new IllegalArgumentException("La lista de ejercicios no coincide con los ejercicios asignados al subprograma");
        }
        
        // Actualizar el orden de cada ejercicio
        for (int i = 0; i < ejerciciosIds.size(); i++) {
            Long ejercicioId = ejerciciosIds.get(i);
            Optional<EjercicioEntity> ejercicioOpt = subprogramaEntity.getEjercicios().stream()
                .filter(e -> e.getId().equals(ejercicioId))
                .findFirst();
            
            if (ejercicioOpt.isPresent()) {
                ejercicioOpt.get().setOrden(i + 1); // Orden base-1
                ejercicioRepository.save(ejercicioOpt.get());
            }
        }
    }
    
    // Implementación de métodos para tokens de acceso
    
    @Override
    @Transactional
    public AccessToken generarTokenAcceso(Long programaId, Long pacienteId) {
        // Verificar que el programa y el paciente existan
        var programaEntity = programaRepository.findById(programaId)
            .orElseThrow(() -> new IllegalArgumentException("Programa personalizado no encontrado con id: " + programaId));
        
        // Crear el token con 7 días de validez
        AccessToken token = AccessToken.builder()
            .token(UUID.randomUUID())
            .programaPersonalizadoId(programaId)
            .pacienteId(pacienteId)
            .fechaExpiracion(LocalDateTime.now().plusDays(7))
            .usado(false)
            .build();
        
        var entity = accessTokenMapper.toEntity(token);
        var savedEntity = accessTokenRepository.save(entity);
        
        return accessTokenMapper.toModel(savedEntity);
    }
    
    @Override
    public List<AccessToken> getTokensByProgramaId(Long programaId) {
        var entities = accessTokenRepository.findByProgramaPersonalizadoId(programaId);
        return accessTokenMapper.toModelList(entities);
    }
    
    @Override
    public ProgramaPersonalizado getProgramaPersonalizadoByToken(UUID token) {
        var tokenEntity = accessTokenRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Token no válido"));
        
        // Verificar si el token ha expirado
        if (tokenEntity.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El token ha expirado");
        }
        
        // Marcar el token como usado
        tokenEntity.setUsado(true);
        accessTokenRepository.save(tokenEntity);
        
        return programaMapper.toModel(tokenEntity.getProgramaPersonalizado());
    }
    
    @Override
    public AccessToken getAccessTokenByToken(UUID token) {
        var entity = accessTokenRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Token no válido"));
        return accessTokenMapper.toModel(entity);
    }
    
    // Implementación de métodos para comentarios de pacientes
    
    @Override
    @Transactional
    public ComentarioPaciente crearComentarioPaciente(ComentarioPaciente comentario) {
        var entity = comentarioMapper.toEntity(comentario);
        var savedEntity = comentarioRepository.save(entity);
        return comentarioMapper.toModel(savedEntity);
    }
    
    @Override
    public List<ComentarioPaciente> getComentariosByProgramaAndPacienteId(Long programaId, Long pacienteId) {
        var entities = comentarioRepository
            .findByPacienteIdAndProgramaPersonalizadoIdOrderByFechaCreacionDesc(pacienteId, programaId);
        return comentarioMapper.toModelList(entities);
    }
    
    @Override
    @Transactional
    public void marcarComentarioComoLeido(Long comentarioId) {
        var comentario = comentarioRepository.findById(comentarioId)
            .orElseThrow(() -> new IllegalArgumentException("Comentario no encontrado con id: " + comentarioId));
        
        comentario.setLeido(true);
        comentarioRepository.save(comentario);
    }
    
    @Override
    public List<ComentarioPaciente> getComentariosNoLeidos() {
        var entities = comentarioRepository.findByLeidoFalseOrderByFechaCreacionDesc();
        return comentarioMapper.toModelList(entities);
    }
    
    @Override
    public long getCountComentariosNoLeidos() {
        return comentarioRepository.countByLeidoFalse();
    }
} 