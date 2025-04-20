package com.proyectofisio.infrastructure.adapters.input.rest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyectofisio.application.ports.input.EmpresaServicePort;
import com.proyectofisio.domain.model.Empresa;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.FileControllerDocs;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/files")
@Slf4j
public class FileController implements FileControllerDocs {

    @Value("${app.uploads.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;
    
    private final EmpresaServicePort empresaService;
    
    @Autowired
    public FileController(EmpresaServicePort empresaService) {
        this.empresaService = empresaService;
    }
    
    /**
     * Actualiza el logo de una empresa
     * @param empresaId ID de la empresa
     * @param file Archivo de logo
     * @return ResponseEntity con la URL del nuevo logo
     */
    @Override
    @PostMapping("/empresas/{empresaId}/logo")
    @PreAuthorize("hasAnyRole('DUENO', 'ADMINISTRADOR')")
    public ResponseEntity<?> actualizarLogoEmpresa(
            @PathVariable Long empresaId,
            @RequestParam("logo") MultipartFile file) {
        
        try {
            // Verificar que la empresa existe
            Optional<Empresa> empresaOpt = empresaService.obtenerEmpresaPorId(empresaId);
            if (empresaOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Empresa empresa = empresaOpt.get();
            
            // Guardar el nuevo logo
            String logoUrl = guardarLogo(file);
            
            // Actualizar la empresa con la nueva URL del logo
            empresa.setLogoUrl(logoUrl);
            empresaService.actualizarEmpresa(empresa);
            
            // Devolver la URL del nuevo logo
            Map<String, String> response = new HashMap<>();
            response.put("logoUrl", logoUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al actualizar el logo de la empresa: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el logo: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene un archivo de logo por su nombre
     * @param filename Nombre del archivo
     * @return ResponseEntity con el archivo
     */
    @Override
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                // Determinar el tipo de contenido
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                log.error("Archivo no encontrado: {}", filename);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error al obtener el archivo: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Guarda un archivo de logo en el sistema de archivos
     * @param file Archivo a guardar
     * @return URL del archivo guardado
     * @throws IOException Si ocurre un error al guardar el archivo
     */
    private String guardarLogo(MultipartFile file) throws IOException {
        // Crear el directorio de uploads si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generar un nombre único para el archivo
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Guardar el archivo
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        
        // Devolver la URL completa para acceder al logo
        return baseUrl + "/api/files/uploads/" + uniqueFileName;
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
    
    /**
     * Determina el tipo de contenido basado en la extensión del archivo
     * @param filename Nombre del archivo
     * @return Tipo de contenido MIME
     */
    private String determineContentType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        switch (extension) {
            case ".jpg":
            case ".jpeg":
                return "image/jpeg";
            case ".png":
                return "image/png";
            case ".gif":
                return "image/gif";
            case ".svg":
                return "image/svg+xml";
            case ".pdf":
                return "application/pdf";
            case ".doc":
                return "application/msword";
            case ".docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".xls":
                return "application/vnd.ms-excel";
            case ".xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            default:
                return "application/octet-stream";
        }
    }
} 