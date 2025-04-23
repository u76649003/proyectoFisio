package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.BonoPaciente;

import java.util.List;
import java.util.UUID;

public interface BonoPacienteServicePort {
    
    BonoPaciente createBonoPaciente(BonoPaciente bonoPaciente);
    
    BonoPaciente updateBonoPaciente(UUID id, BonoPaciente bonoPaciente);
    
    BonoPaciente getBonoPacienteById(UUID id);
    
    List<BonoPaciente> getAllBonosPaciente();
    
    List<BonoPaciente> getBonosByPacienteId(UUID pacienteId);
    
    List<BonoPaciente> getBonosByPacienteIdAndEstado(UUID pacienteId, BonoPaciente.EstadoBono estado);
    
    List<BonoPaciente> getBonosByServicioId(UUID servicioId);
    
    void deleteBonoPaciente(UUID id);
    
    /**
     * Actualizar el bono después de completar una cita
     * @param bonoId ID del bono a actualizar
     * @return El bono actualizado
     */
    BonoPaciente actualizarSesionesRestantesBono(UUID bonoId);
} 