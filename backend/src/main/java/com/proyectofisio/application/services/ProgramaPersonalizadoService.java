package com.proyectofisio.application.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.ProgramaPersonalizadoServicePort;
import com.proyectofisio.domain.model.AccessToken;
import com.proyectofisio.domain.model.ComentarioPaciente;
import com.proyectofisio.domain.model.Ejercicio;
import com.proyectofisio.domain.model.ProgramaPersonalizado;
import com.proyectofisio.domain.model.Subprograma;
import com.proyectofisio.domain.model.PasoSubprograma;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.EjercicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.SubprogramaEjercicioEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.entity.PasoSubprogramaEntity;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.AccessTokenMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.ComentarioPacienteMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.EjercicioMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.ProgramaPersonalizadoMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.SubprogramaMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.PasoSubprogramaMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.AccessTokenRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ComentarioPacienteRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.EjercicioRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.ProgramaPersonalizadoRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SubprogramaRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.SubprogramaEjercicioRepository;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.PasoSubprogramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramaPersonalizadoService implements ProgramaPersonalizadoServicePort {

    private final ProgramaPersonalizadoRepository programaRepository;
    private final SubprogramaRepository subprogramaRepository;
    private final EjercicioRepository ejercicioRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final ComentarioPacienteRepository comentarioRepository;
    private final SubprogramaEjercicioRepository subprogramaEjercicioRepository;
    private final PasoSubprogramaRepository pasoSubprogramaRepository;
    
    private final ProgramaPersonalizadoMapper programaMapper;
    private final SubprogramaMapper subprogramaMapper;
    private final EjercicioMapper ejercicioMapper;
    private final AccessTokenMapper accessTokenMapper;
    private final ComentarioPacienteMapper comentarioMapper;
    private final PasoSubprogramaMapper pasoSubprogramaMapper;
    
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
        
        // Verificar si se puede eliminar el programa
        if (!puedeEliminarPrograma(id)) {
            throw new IllegalArgumentException("No se puede eliminar el programa porque tiene pacientes asociados o subprogramas creados");
        }
        
        programaRepository.deleteById(id);
    }
    
    @Override
    public boolean puedeEliminarPrograma(Long programaId) {
        return !tienePacientesAsociados(programaId) && !tieneSubprogramasCreados(programaId);
    }
    
    @Override
    public boolean tienePacientesAsociados(Long programaId) {
        var tokens = accessTokenRepository.findByProgramaPersonalizadoId(programaId);
        return !tokens.isEmpty();
    }
    
    @Override
    public boolean tieneSubprogramasCreados(Long programaId) {
        var subprogramas = subprogramaRepository.findByProgramaPersonalizadoIdOrderByOrdenAsc(programaId);
        return !subprogramas.isEmpty();
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
        var entity = subprogramaRepository.findByIdWithEjercicios(id);
        if (entity == null) {
            throw new IllegalArgumentException("Subprograma no encontrado con id: " + id);
        }
        return subprogramaMapper.toModel(entity);
    }
    
    @Override
    public List<Subprograma> getSubprogramasByProgramaId(Long programaId) {
        var entities = subprogramaRepository.findByProgramaPersonalizadoIdWithEjerciciosOrderByOrdenAsc(programaId);
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
        Optional<SubprogramaEjercicioEntity> existing = subprogramaEjercicioRepository
            .findBySubprogramaIdAndEjercicioId(subprogramaId, ejercicioId);
            
        if (existing.isPresent()) {
            throw new IllegalArgumentException("El ejercicio ya está asignado a este subprograma");
        }
        
        // Determinar el orden para el nuevo ejercicio
        int ordenFinal;
        if (orden != null) {
            ordenFinal = orden;
        } else {
            // Obtener el último orden y sumar 1
            Integer maxOrden = subprogramaEjercicioRepository.findMaxOrdenBySubprogramaId(subprogramaId);
            ordenFinal = (maxOrden != null) ? maxOrden + 1 : 1;
        }
        
        // Crear la entidad de relación
        SubprogramaEjercicioEntity relacion = SubprogramaEjercicioEntity.builder()
            .subprograma(subprogramaEntity)
            .ejercicio(ejercicioEntity)
            .orden(ordenFinal)
            .build();
            
        // Guardar la relación
        subprogramaEjercicioRepository.save(relacion);
        
        // Refrescar la entidad del subprograma para obtener las relaciones actualizadas
        subprogramaEntity = subprogramaRepository.findById(subprogramaId).get();
        
        return subprogramaMapper.toModel(subprogramaEntity);
    }
    
    @Override
    @Transactional
    public void removerEjercicioDeSubprograma(Long subprogramaId, Long ejercicioId) {
        // Verificar si el subprograma existe
        if (!subprogramaRepository.existsById(subprogramaId)) {
            throw new IllegalArgumentException("Subprograma no encontrado con id: " + subprogramaId);
        }
        
        // Verificar si el ejercicio existe
        if (!ejercicioRepository.existsById(ejercicioId)) {
            throw new IllegalArgumentException("Ejercicio no encontrado con id: " + ejercicioId);
        }
        
        // Eliminar la relación
        subprogramaEjercicioRepository.deleteBySubprogramaIdAndEjercicioId(subprogramaId, ejercicioId);
        
        // Reordenar los ejercicios restantes
        List<SubprogramaEjercicioEntity> relaciones = subprogramaEjercicioRepository
            .findBySubprogramaIdOrderByOrdenAsc(subprogramaId);
            
        int orden = 1;
        for (SubprogramaEjercicioEntity relacion : relaciones) {
            relacion.setOrden(orden++);
            subprogramaEjercicioRepository.save(relacion);
        }
    }
    
    @Override
    @Transactional
    public void reordenarEjerciciosEnSubprograma(Long subprogramaId, List<Long> ejerciciosIds) {
        // Verificar si el subprograma existe
        if (!subprogramaRepository.existsById(subprogramaId)) {
            throw new IllegalArgumentException("Subprograma no encontrado con id: " + subprogramaId);
        }
        
        // Validar que todos los ejercicios existan y estén asignados al subprograma
        for (Long ejercicioId : ejerciciosIds) {
            if (!ejercicioRepository.existsById(ejercicioId)) {
                throw new IllegalArgumentException("Ejercicio no encontrado con id: " + ejercicioId);
            }
            
            if (!subprogramaEjercicioRepository.findBySubprogramaIdAndEjercicioId(subprogramaId, ejercicioId).isPresent()) {
                throw new IllegalArgumentException("El ejercicio con id " + ejercicioId + 
                    " no está asignado al subprograma con id " + subprogramaId);
            }
        }
        
        // Actualizar el orden de cada ejercicio según la lista proporcionada
        int orden = 1;
        for (Long ejercicioId : ejerciciosIds) {
            Optional<SubprogramaEjercicioEntity> relacion = subprogramaEjercicioRepository
                .findBySubprogramaIdAndEjercicioId(subprogramaId, ejercicioId);
                
            if (relacion.isPresent()) {
                SubprogramaEjercicioEntity entity = relacion.get();
                entity.setOrden(orden++);
                subprogramaEjercicioRepository.save(entity);
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
    
    @Override
    @Transactional
    public List<AccessToken> generarTokensParaPacientes(Long programaId, List<Long> pacientesIds) {
        // Verificar que el programa exista
        var programaEntity = programaRepository.findById(programaId)
            .orElseThrow(() -> new IllegalArgumentException("Programa personalizado no encontrado con id: " + programaId));
        
        List<AccessToken> tokensGenerados = new ArrayList<>();
        
        for (Long pacienteId : pacientesIds) {
            // Generar token para cada paciente
            AccessToken token = generarTokenAcceso(programaId, pacienteId);
            tokensGenerados.add(token);
        }
        
        return tokensGenerados;
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
    public List<ComentarioPaciente> getComentariosByTokenAndSubprogramaId(UUID token, Long subprogramaId) {
        var entities = comentarioRepository.findBySubprogramaIdAndAccessTokenToken(subprogramaId, token);
        return comentarioMapper.toModelList(entities);
    }
    
    @Override
    public List<ComentarioPaciente> getComentariosByProgramaAndPacienteId(Long programaId, Long pacienteId) {
        var entities = comentarioRepository
            .findBySubprogramaProgramaPersonalizadoIdAndAccessTokenPacienteId(programaId, pacienteId);
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
    
    // Implementación de métodos para pasos de subprograma
    @Override
    @Transactional
    public PasoSubprograma crearPasoSubprograma(PasoSubprograma paso) {
        // Verificar que el subprograma existe
        if (!subprogramaRepository.existsById(paso.getSubprogramaId())) {
            throw new IllegalArgumentException("Subprograma no encontrado con id: " + paso.getSubprogramaId());
        }
        
        // Obtener el último número de paso para este subprograma y asignar el siguiente
        Integer ultimoNumeroPaso = pasoSubprogramaRepository.findMaxNumeroPasoBySubprogramaId(paso.getSubprogramaId());
        int nuevoPaso = (ultimoNumeroPaso != null) ? ultimoNumeroPaso + 1 : 1;
        paso.setNumeroPaso(nuevoPaso);
        
        var entity = pasoSubprogramaMapper.toEntity(paso);
        var savedEntity = pasoSubprogramaRepository.save(entity);
        return pasoSubprogramaMapper.toModel(savedEntity);
    }
    
    @Override
    public PasoSubprograma getPasoSubprogramaById(Long id) {
        var entity = pasoSubprogramaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Paso no encontrado con id: " + id));
        return pasoSubprogramaMapper.toModel(entity);
    }
    
    @Override
    public List<PasoSubprograma> getPasosBySubprogramaId(Long subprogramaId) {
        var entities = pasoSubprogramaRepository.findBySubprogramaIdOrderByNumeroPasoAsc(subprogramaId);
        return pasoSubprogramaMapper.toModelList(entities);
    }
    
    @Override
    @Transactional
    public PasoSubprograma updatePasoSubprograma(Long id, PasoSubprograma paso) {
        var existingEntity = pasoSubprogramaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Paso no encontrado con id: " + id));
        
        // Actualizar campos
        existingEntity.setDescripcion(paso.getDescripcion());
        
        if (paso.getVideoReferencia() != null) {
            existingEntity.setVideoReferencia(paso.getVideoReferencia());
        }
        
        if (paso.getEsEnlaceExterno() != null) {
            existingEntity.setEsEnlaceExterno(paso.getEsEnlaceExterno());
        }
        
        if (paso.getImagenesUrls() != null) {
            existingEntity.setImagenesUrls(paso.getImagenesUrls());
        }
        
        var updatedEntity = pasoSubprogramaRepository.save(existingEntity);
        return pasoSubprogramaMapper.toModel(updatedEntity);
    }
    
    @Override
    @Transactional
    public void deletePasoSubprograma(Long id) {
        if (!pasoSubprogramaRepository.existsById(id)) {
            throw new IllegalArgumentException("Paso no encontrado con id: " + id);
        }
        
        // Obtener el paso actual para conocer su subprograma y número
        var pasoEntity = pasoSubprogramaRepository.findById(id).orElseThrow();
        Long subprogramaId = pasoEntity.getSubprograma().getId();
        int numeroPasoEliminado = pasoEntity.getNumeroPaso();
        
        // Eliminar el paso
        pasoSubprogramaRepository.deleteById(id);
        
        // Reordenar los pasos restantes
        var pasosRestantes = pasoSubprogramaRepository.findBySubprogramaIdOrderByNumeroPasoAsc(subprogramaId);
        int nuevoOrden = 1;
        
        for (var paso : pasosRestantes) {
            if (paso.getNumeroPaso() > numeroPasoEliminado) {
                paso.setNumeroPaso(nuevoOrden++);
                pasoSubprogramaRepository.save(paso);
            }
        }
    }
} 