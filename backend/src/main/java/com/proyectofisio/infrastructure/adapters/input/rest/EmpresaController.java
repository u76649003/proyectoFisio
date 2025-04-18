package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.EmpresaControllerDocs;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController implements EmpresaControllerDocs {

    private final EmpresaServicePort empresaService;

    @Autowired
    public EmpresaController(EmpresaServicePort empresaService) {
        this.empresaService = empresaService;
    }

    @Override
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> crearEmpresa(@RequestBody Empresa empresa) {
        try {
            Empresa nuevaEmpresa = empresaService.crearEmpresa(empresa);
            return new ResponseEntity<>(nuevaEmpresa, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerEmpresaPorId(@PathVariable Long id) {
        return empresaService.obtenerEmpresaPorId(id)
                .map(empresa -> new ResponseEntity<>(empresa, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @GetMapping
    public ResponseEntity<List<Empresa>> obtenerTodasLasEmpresas() {
        return new ResponseEntity<>(empresaService.obtenerTodasLasEmpresas(), HttpStatus.OK);
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DUENO')")
    public ResponseEntity<?> actualizarEmpresa(@PathVariable Long id, @RequestBody Empresa empresa) {
        try {
            empresa.setId(id);
            Empresa empresaActualizada = empresaService.actualizarEmpresa(empresa);
            return new ResponseEntity<>(empresaActualizada, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable Long id) {
        try {
            empresaService.eliminarEmpresa(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 