package com.proyectofisio.application.ports.input;

import java.util.List;
import java.util.Optional;

import com.proyectofisio.domain.model.Paciente;

public interface PacienteServicePort {
    
    Paciente crearPaciente(Paciente paciente);
    
    Optional<Paciente> obtenerPacientePorId(Long id);
    
    List<Paciente> obtenerTodosLosPacientes();
    
    List<Paciente> obtenerPacientesPorEmpresa(Long empresaId);
    
    Paciente actualizarPaciente(Paciente paciente);
    
    void eliminarPaciente(Long id);
    
    boolean existePacienteConDni(String dni);
    
    boolean existePacienteConEmail(String email);
    
    Optional<Paciente> obtenerPacientePorDni(String dni);
    
    Optional<Paciente> obtenerPacientePorEmail(String email);
} 