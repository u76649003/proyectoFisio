package com.proyectofisio.infrastructure.adapters.input.rest;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.EmpresaControllerDocs;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.EmpresaDTO;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/empresas")
@Slf4j
public class EmpresaController implements EmpresaControllerDocs {

    private final EmpresaServicePort empresaService;
    
    @Value("${app.uploads.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.base.url:http://localhost:8081}")
    private String baseUrl;

    @Autowired
    public EmpresaController(EmpresaServicePort empresaService) {
        this.empresaService = empresaService;
    }

    @Override
    @PostMapping
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
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
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<?> obtenerEmpresaPorId(@PathVariable Long id) {
        return empresaService.obtenerEmpresaPorId(id)
                .map(empresa -> new ResponseEntity<>(empresa, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<List<Empresa>> obtenerTodasLasEmpresas() {
        return new ResponseEntity<>(empresaService.obtenerTodasLasEmpresas(), HttpStatus.OK);
    }

    @Override
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
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
    @PutMapping(value = "/{id}/with-logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMINISTRADOR') or hasAuthority('DUENO')")
    public ResponseEntity<?> actualizarEmpresaConLogo(
            @PathVariable Long id, 
            @RequestPart("empresa") EmpresaDTO empresaDTO,
            @RequestPart(value = "logo", required = false) MultipartFile logo) {
        try {
            // Verificar que la empresa existe
            if (!empresaService.obtenerEmpresaPorId(id).isPresent()) {
                return new ResponseEntity<>("Empresa no encontrada", HttpStatus.NOT_FOUND);
            }
            
            // Transferir datos del DTO al modelo
            Empresa empresa = Empresa.builder()
                    .id(id)
                    .nombre(empresaDTO.getNombre())
                    .direccion(empresaDTO.getDireccion())
                    .telefono(empresaDTO.getTelefono())
                    .email(empresaDTO.getEmail())
                    .nif(empresaDTO.getNif())
                    .web(empresaDTO.getWeb())
                    .logoUrl(empresaDTO.getLogoUrl())
                    .build();
            
            // Guardar logo si se ha proporcionado
            if (logo != null && !logo.isEmpty()) {
                String logoUrl = guardarLogo(logo);
                empresa.setLogoUrl(logoUrl);
            }
            
            // Actualizar la empresa
            Empresa empresaActualizada = empresaService.actualizarEmpresa(empresa);
            return new ResponseEntity<>(empresaActualizada, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error al actualizar la empresa con logo: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable Long id) {
        try {
            empresaService.eliminarEmpresa(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Guarda un archivo de logo en el sistema de archivos
     * @param file Archivo a guardar
     * @return URL del archivo guardado
     * @throws Exception Si ocurre un error al guardar el archivo
     */
    private String guardarLogo(MultipartFile file) throws Exception {
        try {
            // Crear directorio si no existe, generar nombre único y guardar
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            
            // Generar nombre único
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFileName = java.util.UUID.randomUUID().toString() + fileExtension;
            
            // Guardar archivo
            java.nio.file.Path filePath = uploadPath.resolve(uniqueFileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath);
            
            // Devolver URL completa
            return baseUrl + "/api/files/uploads/" + uniqueFileName;
        } catch (java.io.IOException e) {
            log.error("Error al guardar el logo: {}", e.getMessage());
            throw new Exception("No se pudo guardar el logo: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene la extensión de un archivo
     * @param fileName Nombre del archivo
     * @return Extensión del archivo incluyendo el punto
     */
    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0) {
            return "";
        }
        return fileName.substring(lastDotIndex);
    }
} 