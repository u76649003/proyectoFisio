package com.proyectofisio.application.services;

import com.proyectofisio.application.ports.input.BonoPacienteServicePort;
import com.proyectofisio.application.ports.input.PacienteServicePort;
import com.proyectofisio.application.ports.input.ServicioServicePort;
import com.proyectofisio.application.ports.output.BonoPacienteRepositoryPort;
import com.proyectofisio.application.ports.output.ServicioRepositoryPort;
import com.proyectofisio.domain.model.BonoPaciente;
import com.proyectofisio.domain.model.Servicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class BonoPacienteService implements BonoPacienteServicePort {
    
    private final BonoPacienteRepositoryPort bonoPacienteRepositoryPort;
    private final ServicioRepositoryPort servicioRepositoryPort;
    
    @Autowired
    public BonoPacienteService(BonoPacienteRepositoryPort bonoPacienteRepositoryPort, 
                               ServicioRepositoryPort servicioRepositoryPort) {
        this.bonoPacienteRepositoryPort = bonoPacienteRepositoryPort;
        this.servicioRepositoryPort = servicioRepositoryPort;
    }
    
    @Override
    public BonoPaciente createBonoPaciente(BonoPaciente bonoPaciente) {
        // Verificar que el servicio existe y es de tipo bono
        Servicio servicio = servicioRepositoryPort.findById(bonoPaciente.getServicioId())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado con ID: " + bonoPaciente.getServicioId()));
        
        if (Boolean.FALSE.equals(servicio.getEsBono())) {
            throw new IllegalArgumentException("El servicio con ID " + bonoPaciente.getServicioId() + " no es de tipo bono");
        }
        
        // Establecer valores iniciales por defecto
        bonoPaciente.setEstado(BonoPaciente.EstadoBono.ACTIVO);
        
        // Si no se especifican las sesiones iniciales, usar las del servicio
        if (bonoPaciente.getSesionesIniciales() == null || bonoPaciente.getSesionesIniciales() <= 0) {
            bonoPaciente.setSesionesIniciales(servicio.getNumeroSesiones());
        }
        
        // Inicializar sesiones restantes al mismo valor que sesiones iniciales
        bonoPaciente.setSesionesRestantes(bonoPaciente.getSesionesIniciales());
        
        return bonoPacienteRepositoryPort.save(bonoPaciente);
    }
    
    @Override
    public BonoPaciente updateBonoPaciente(Long id, BonoPaciente bonoPaciente) {
        // Verificar que el bono existe
        BonoPaciente bonoExistente = bonoPacienteRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bono no encontrado con ID: " + id));
        
        // Mantener el ID existente
        bonoPaciente.setId(id);
        
        // Si las sesiones restantes llegan a 0, marcar el bono como completado
        if (bonoPaciente.getSesionesRestantes() != null && bonoPaciente.getSesionesRestantes() <= 0) {
            bonoPaciente.setEstado(BonoPaciente.EstadoBono.COMPLETADO);
            bonoPaciente.setSesionesRestantes(0);
        }
        
        return bonoPacienteRepositoryPort.save(bonoPaciente);
    }
    
    @Override
    public BonoPaciente getBonoPacienteById(Long id) {
        return bonoPacienteRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bono no encontrado con ID: " + id));
    }
    
    @Override
    public List<BonoPaciente> getAllBonosPaciente() {
        return bonoPacienteRepositoryPort.findAll();
    }
    
    @Override
    public List<BonoPaciente> getBonosByPacienteId(Long pacienteId) {
        return bonoPacienteRepositoryPort.findByPacienteId(pacienteId);
    }
    
    @Override
    public List<BonoPaciente> getBonosByPacienteIdAndEstado(Long pacienteId, BonoPaciente.EstadoBono estado) {
        return bonoPacienteRepositoryPort.findByPacienteIdAndEstado(pacienteId, estado);
    }
    
    @Override
    public List<BonoPaciente> getBonosByServicioId(Long servicioId) {
        return bonoPacienteRepositoryPort.findByServicioId(servicioId);
    }
    
    @Override
    public void deleteBonoPaciente(Long id) {
        // Verificar que el bono existe antes de eliminarlo
        if (!bonoPacienteRepositoryPort.findById(id).isPresent()) {
            throw new EntityNotFoundException("Bono no encontrado con ID: " + id);
        }
        
        // TODO: Verificar que el bono no tenga citas asociadas
        
        bonoPacienteRepositoryPort.deleteById(id);
    }
    
    @Override
    public BonoPaciente actualizarSesionesRestantesBono(Long bonoId) {
        // Obtener el bono
        BonoPaciente bono = bonoPacienteRepositoryPort.findById(bonoId)
                .orElseThrow(() -> new EntityNotFoundException("Bono no encontrado con ID: " + bonoId));
        
        // Verificar que el bono esté activo
        if (bono.getEstado() != BonoPaciente.EstadoBono.ACTIVO) {
            throw new IllegalStateException("El bono con ID " + bonoId + " no está activo");
        }
        
        // Reducir las sesiones restantes
        int sesionesRestantes = bono.getSesionesRestantes() - 1;
        bono.setSesionesRestantes(sesionesRestantes);
        
        // Si las sesiones restantes llegan a 0, marcar el bono como completado
        if (sesionesRestantes <= 0) {
            bono.setEstado(BonoPaciente.EstadoBono.COMPLETADO);
            bono.setSesionesRestantes(0);
        }
        
        // Guardar y devolver el bono actualizado
        return bonoPacienteRepositoryPort.save(bono);
    }
} 