package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.BonoPaciente;

import java.util.List;

public interface BonoPacienteServicePort {
    
    BonoPaciente createBonoPaciente(BonoPaciente bonoPaciente);
    
    BonoPaciente updateBonoPaciente(Long id, BonoPaciente bonoPaciente);
    
    BonoPaciente getBonoPacienteById(Long id);
    
    List<BonoPaciente> getAllBonosPaciente();
    
    List<BonoPaciente> getBonosByPacienteId(Long pacienteId);
    
    List<BonoPaciente> getBonosByPacienteIdAndEstado(Long pacienteId, BonoPaciente.EstadoBono estado);
    
    List<BonoPaciente> getBonosByServicioId(Long servicioId);
    
    void deleteBonoPaciente(Long id);
    
    /**
     * Actualizar el bono después de completar una cita
     * @param bonoId ID del bono a actualizar
     * @return El bono actualizado
     */
    BonoPaciente actualizarSesionesRestantesBono(Long bonoId);
} 