package com.proyectofisio.infrastructure.adapters.input.rest;

import com.proyectofisio.application.ports.input.ServicioServicePort;
import com.proyectofisio.domain.model.Servicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {
    
    private final ServicioServicePort servicioServicePort;
    
    @Autowired
    public ServicioController(ServicioServicePort servicioServicePort) {
        this.servicioServicePort = servicioServicePort;
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR')")
    public ResponseEntity<Servicio> crearServicio(@RequestBody Servicio servicio) {
        Servicio nuevoServicio = servicioServicePort.createServicio(servicio);
        return new ResponseEntity<>(nuevoServicio, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<Servicio> getServicioPorId(@PathVariable Long id) {
        try {
            Servicio servicio = servicioServicePort.getServicioById(id);
            return new ResponseEntity<>(servicio, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<List<Servicio>> getAllServicios() {
        List<Servicio> servicios = servicioServicePort.getAllServicios();
        return new ResponseEntity<>(servicios, HttpStatus.OK);
    }
    
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<List<Servicio>> getServiciosByEmpresaId(@PathVariable Long empresaId) {
        List<Servicio> servicios = servicioServicePort.getServiciosByEmpresaId(empresaId);
        return new ResponseEntity<>(servicios, HttpStatus.OK);
    }
    
    @GetMapping("/empresa/{empresaId}/bonos")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR', 'RECEPCIONISTA', 'FISIOTERAPEUTA')")
    public ResponseEntity<List<Servicio>> getServiciosByEmpresaIdAndEsBono(
            @PathVariable Long empresaId,
            @RequestParam Boolean esBono) {
        List<Servicio> servicios = servicioServicePort.getServiciosByEmpresaIdAndEsBono(empresaId, esBono);
        return new ResponseEntity<>(servicios, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR')")
    public ResponseEntity<Servicio> actualizarServicio(@PathVariable Long id, @RequestBody Servicio servicio) {
        try {
            Servicio servicioActualizado = servicioServicePort.updateServicio(id, servicio);
            return new ResponseEntity<>(servicioActualizado, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        try {
            servicioServicePort.deleteServicio(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
} 