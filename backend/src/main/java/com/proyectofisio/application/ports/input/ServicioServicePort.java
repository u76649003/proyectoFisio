package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.Servicio;

import java.util.List;
import java.util.UUID;

public interface ServicioServicePort {
    
    Servicio createServicio(Servicio servicio);
    
    Servicio updateServicio(UUID id, Servicio servicio);
    
    Servicio getServicioById(UUID id);
    
    List<Servicio> getAllServicios();
    
    List<Servicio> getServiciosByEmpresaId(UUID empresaId);
    
    List<Servicio> getServiciosByEmpresaIdAndEsBono(UUID empresaId, Boolean esBono);
    
    void deleteServicio(UUID id);
} 