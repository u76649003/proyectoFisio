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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.UsuarioServicePort;
import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.UsuarioControllerDocs;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController implements UsuarioControllerDocs {

    private final UsuarioServicePort usuarioService;

    @Autowired
    public UsuarioController(UsuarioServicePort usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    @PostMapping
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioService.obtenerUsuarioPorId(id)
                .map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        return new ResponseEntity<>(usuarioService.obtenerTodosLosUsuarios(), HttpStatus.OK);
    }

    @Override
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
    public ResponseEntity<List<Usuario>> obtenerUsuariosPorEmpresa(@PathVariable Long empresaId) {
        return new ResponseEntity<>(usuarioService.obtenerUsuariosPorEmpresa(empresaId), HttpStatus.OK);
    }

    @Override
    @GetMapping("/rol")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
    public ResponseEntity<List<Usuario>> obtenerUsuariosPorRol(@RequestParam RolUsuario rol) {
        return new ResponseEntity<>(usuarioService.obtenerUsuariosPorRol(rol), HttpStatus.OK);
    }

    @Override
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> obtenerUsuarioPorEmail(@PathVariable String email) {
        return usuarioService.obtenerUsuarioPorEmail(email)
                .map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO') or @securityService.isCurrentUser(#id)")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            usuario.setId(id);
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(usuario);
            return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 