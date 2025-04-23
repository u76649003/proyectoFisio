package com.proyectofisio.application.ports.input;

import com.proyectofisio.domain.model.Servicio;

import java.util.List;

public interface ServicioServicePort {
    
    Servicio createServicio(Servicio servicio);
    
    Servicio updateServicio(Long id, Servicio servicio);
    
    Servicio getServicioById(Long id);
    
    List<Servicio> getAllServicios();
    
    List<Servicio> getServiciosByEmpresaId(Long empresaId);
    
    List<Servicio> getServiciosByEmpresaIdAndEsBono(Long empresaId, Boolean esBono);
    
    void deleteServicio(Long id);
} 