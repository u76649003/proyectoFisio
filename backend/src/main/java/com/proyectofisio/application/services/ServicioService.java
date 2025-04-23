package com.proyectofisio.application.services;

import com.proyectofisio.application.ports.input.ServicioServicePort;
import com.proyectofisio.application.ports.output.ServicioRepositoryPort;
import com.proyectofisio.domain.model.Servicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;

@Service
public class ServicioService implements ServicioServicePort {
    
    private final ServicioRepositoryPort servicioRepositoryPort;
    
    @Autowired
    public ServicioService(ServicioRepositoryPort servicioRepositoryPort) {
        this.servicioRepositoryPort = servicioRepositoryPort;
    }
    
    @Override
    public Servicio createServicio(Servicio servicio) {
        // Verificar que no exista otro servicio con el mismo nombre en la empresa
        if (servicioRepositoryPort.existsByNombreAndEmpresaId(servicio.getNombre(), servicio.getEmpresaId())) {
            throw new IllegalArgumentException("Ya existe un servicio con el mismo nombre en esta empresa");
        }
        
        // Si es un bono, debe tener un número de sesiones
        if (Boolean.TRUE.equals(servicio.getEsBono()) && (servicio.getNumeroSesiones() == null || servicio.getNumeroSesiones() <= 0)) {
            throw new IllegalArgumentException("Un servicio de tipo bono debe tener un número de sesiones mayor que cero");
        }
        
        // Si no es un bono, el número de sesiones debe ser nulo
        if (Boolean.FALSE.equals(servicio.getEsBono())) {
            servicio.setNumeroSesiones(null);
        }
        
        return servicioRepositoryPort.save(servicio);
    }
    
    @Override
    public Servicio updateServicio(UUID id, Servicio servicio) {
        // Verificar que el servicio existe
        Servicio servicioExistente = servicioRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado con ID: " + id));
        
        // Verificar que no exista otro servicio con el mismo nombre en la empresa
        if (!servicioExistente.getNombre().equals(servicio.getNombre()) && 
                servicioRepositoryPort.existsByNombreAndEmpresaId(servicio.getNombre(), servicio.getEmpresaId())) {
            throw new IllegalArgumentException("Ya existe otro servicio con el mismo nombre en esta empresa");
        }
        
        // Si es un bono, debe tener un número de sesiones
        if (Boolean.TRUE.equals(servicio.getEsBono()) && (servicio.getNumeroSesiones() == null || servicio.getNumeroSesiones() <= 0)) {
            throw new IllegalArgumentException("Un servicio de tipo bono debe tener un número de sesiones mayor que cero");
        }
        
        // Si no es un bono, el número de sesiones debe ser nulo
        if (Boolean.FALSE.equals(servicio.getEsBono())) {
            servicio.setNumeroSesiones(null);
        }
        
        // Mantener el ID existente
        servicio.setId(id);
        
        return servicioRepositoryPort.save(servicio);
    }
    
    @Override
    public Servicio getServicioById(UUID id) {
        return servicioRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado con ID: " + id));
    }
    
    @Override
    public List<Servicio> getAllServicios() {
        return servicioRepositoryPort.findAll();
    }
    
    @Override
    public List<Servicio> getServiciosByEmpresaId(UUID empresaId) {
        return servicioRepositoryPort.findByEmpresaId(empresaId);
    }
    
    @Override
    public List<Servicio> getServiciosByEmpresaIdAndEsBono(UUID empresaId, Boolean esBono) {
        return servicioRepositoryPort.findByEmpresaIdAndEsBono(empresaId, esBono);
    }
    
    @Override
    public void deleteServicio(UUID id) {
        // Verificar que el servicio existe antes de eliminarlo
        if (!servicioRepositoryPort.findById(id).isPresent()) {
            throw new EntityNotFoundException("Servicio no encontrado con ID: " + id);
        }
        
        // TODO: Verificar que el servicio no tenga citas o bonos asociados
        
        servicioRepositoryPort.deleteById(id);
    }
} 