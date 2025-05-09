package com.proyectofisio.application.ports.input;

import java.util.List;
import java.util.UUID;

import com.proyectofisio.domain.model.AccessToken;
import com.proyectofisio.domain.model.ComentarioPaciente;
import com.proyectofisio.domain.model.Ejercicio;
import com.proyectofisio.domain.model.ProgramaPersonalizado;
import com.proyectofisio.domain.model.Subprograma;

public interface ProgramaPersonalizadoServicePort {
    
    // Métodos para gestionar programas personalizados
    ProgramaPersonalizado crearProgramaPersonalizado(ProgramaPersonalizado programa);
    
    ProgramaPersonalizado getProgramaPersonalizadoById(Long id);
    
    List<ProgramaPersonalizado> getAllProgramasPersonalizados();
    
    List<ProgramaPersonalizado> getProgramasPersonalizadosByEmpresaId(Long empresaId);
    
    List<ProgramaPersonalizado> getProgramasPersonalizadosByUsuarioId(Long usuarioId);
    
    ProgramaPersonalizado updateProgramaPersonalizado(Long id, ProgramaPersonalizado programa);
    
    void deleteProgramaPersonalizado(Long id);
    
    // Validaciones para borrado de programas
    boolean puedeEliminarPrograma(Long programaId);
    
    boolean tienePacientesAsociados(Long programaId);
    
    boolean tieneSubprogramasCreados(Long programaId);
    
    // Métodos para gestionar subprogramas
    Subprograma crearSubprograma(Subprograma subprograma);
    
    Subprograma getSubprogramaById(Long id);
    
    List<Subprograma> getSubprogramasByProgramaId(Long programaId);
    
    Subprograma updateSubprograma(Long id, Subprograma subprograma);
    
    void deleteSubprograma(Long id);
    
    // Métodos para gestionar ejercicios
    Ejercicio crearEjercicio(Ejercicio ejercicio);
    
    Ejercicio getEjercicioById(Long id);
    
    List<Ejercicio> getAllEjerciciosByEmpresaId(Long empresaId);
    
    List<Ejercicio> searchEjerciciosByNombre(String nombre, Long empresaId);
    
    Ejercicio updateEjercicio(Long id, Ejercicio ejercicio);
    
    void deleteEjercicio(Long id);
    
    // Métodos para asignar ejercicios a subprogramas
    Subprograma asignarEjercicioASubprograma(Long subprogramaId, Long ejercicioId, Integer orden);
    
    void removerEjercicioDeSubprograma(Long subprogramaId, Long ejercicioId);
    
    void reordenarEjerciciosEnSubprograma(Long subprogramaId, List<Long> ejerciciosIds);
    
    // Métodos para gestionar tokens de acceso
    AccessToken generarTokenAcceso(Long programaId, Long pacienteId);
    
    List<AccessToken> getTokensByProgramaId(Long programaId);
    
    List<AccessToken> generarTokensParaPacientes(Long programaId, List<Long> pacientesIds);
    
    ProgramaPersonalizado getProgramaPersonalizadoByToken(UUID token);
    
    AccessToken getAccessTokenByToken(UUID token);
    
    // Métodos para comentarios de pacientes
    ComentarioPaciente crearComentarioPaciente(ComentarioPaciente comentario);
    
    List<ComentarioPaciente> getComentariosByTokenAndSubprogramaId(UUID token, Long subprogramaId);
    
    List<ComentarioPaciente> getComentariosByProgramaAndPacienteId(Long programaId, Long pacienteId);
    
    void marcarComentarioComoLeido(Long comentarioId);
    
    List<ComentarioPaciente> getComentariosNoLeidos();
    
    long getCountComentariosNoLeidos();
} 