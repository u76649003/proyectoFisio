package com.proyectofisio.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.PacienteServicePort;
import com.proyectofisio.application.ports.output.PacienteRepositoryPort;
import com.proyectofisio.domain.model.Paciente;

@Service
public class PacienteService implements PacienteServicePort {

    private final PacienteRepositoryPort pacienteRepository;

    @Autowired
    public PacienteService(PacienteRepositoryPort pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    @Transactional
    public Paciente crearPaciente(Paciente paciente) {
        // Validaciones
        if (paciente.getDni() != null && existePacienteConDni(paciente.getDni())) {
            throw new IllegalArgumentException("Ya existe un paciente con ese DNI");
        }
        if (paciente.getEmail() != null && existePacienteConEmail(paciente.getEmail())) {
            throw new IllegalArgumentException("Ya existe un paciente con ese email");
        }
        
        return pacienteRepository.save(paciente);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Paciente> obtenerPacientePorId(Long id) {
        return pacienteRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Paciente> obtenerTodosLosPacientes() {
        return pacienteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Paciente> obtenerPacientesPorEmpresa(Long empresaId) {
        return pacienteRepository.findByEmpresaId(empresaId);
    }

    @Override
    @Transactional
    public Paciente actualizarPaciente(Paciente paciente) {
        // Verificar si existe el paciente
        if (!pacienteRepository.findById(paciente.getId()).isPresent()) {
            throw new IllegalArgumentException("No existe un paciente con ese ID");
        }
        
        // Verificar que el DNI no esté en uso por otro paciente
        if (paciente.getDni() != null) {
            Optional<Paciente> pacienteExistente = pacienteRepository.findByDni(paciente.getDni());
            if (pacienteExistente.isPresent() && !pacienteExistente.get().getId().equals(paciente.getId())) {
                throw new IllegalArgumentException("Ya existe otro paciente con ese DNI");
            }
        }
        
        // Verificar que el email no esté en uso por otro paciente
        if (paciente.getEmail() != null) {
            Optional<Paciente> pacienteExistente = pacienteRepository.findByEmail(paciente.getEmail());
            if (pacienteExistente.isPresent() && !pacienteExistente.get().getId().equals(paciente.getId())) {
                throw new IllegalArgumentException("Ya existe otro paciente con ese email");
            }
        }
        
        return pacienteRepository.save(paciente);
    }

    @Override
    @Transactional
    public void eliminarPaciente(Long id) {
        pacienteRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePacienteConDni(String dni) {
        return pacienteRepository.existsByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePacienteConEmail(String email) {
        return pacienteRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Paciente> obtenerPacientePorDni(String dni) {
        return pacienteRepository.findByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Paciente> obtenerPacientePorEmail(String email) {
        return pacienteRepository.findByEmail(email);
    }
} 