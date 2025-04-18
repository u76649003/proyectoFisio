package com.proyectofisio.infrastructure.adapters.input.rest.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.proyectofisio.domain.model.Usuario;
import com.proyectofisio.domain.model.enums.RolUsuario;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Usuarios", description = "API para la gestión de usuarios del sistema")
public interface UsuarioControllerDocs {

    @Operation(summary = "Crear nuevo usuario", description = "Crea un nuevo usuario en el sistema con validación de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario creado correctamente", 
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados (email ya existe)"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> crearUsuario(
            @Parameter(description = "Objeto usuario con los datos a crear", required = true) Usuario usuario);

    @Operation(summary = "Obtener usuario por ID", description = "Recupera los datos de un usuario específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Datos del usuario encontrados",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerUsuarioPorId(
            @Parameter(description = "ID del usuario a buscar", required = true) Long id);

    @Operation(summary = "Listar todos los usuarios", description = "Recupera la lista completa de todos los usuarios registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios();

    @Operation(summary = "Listar usuarios por empresa", description = "Recupera la lista de usuarios filtrada por una empresa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios de la empresa recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Usuario>> obtenerUsuariosPorEmpresa(
            @Parameter(description = "ID de la empresa para filtrar usuarios", required = true) Long empresaId);

    @Operation(summary = "Listar usuarios por rol", description = "Recupera la lista de usuarios filtrada por un rol específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios del rol recuperada correctamente",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<List<Usuario>> obtenerUsuariosPorRol(
            @Parameter(description = "Rol para filtrar usuarios", required = true) RolUsuario rol);

    @Operation(summary = "Buscar usuario por email", description = "Recupera los datos de un usuario específico por su email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado por email",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> obtenerUsuarioPorEmail(
            @Parameter(description = "Email del usuario a buscar", required = true) String email);

    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o conflicto con datos existentes"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<?> actualizarUsuario(
            @Parameter(description = "ID del usuario a actualizar", required = true) Long id,
            @Parameter(description = "Objeto usuario con los datos actualizados", required = true) Usuario usuario);

    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "403", description = "Prohibido - No tiene permisos suficientes"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    ResponseEntity<Void> eliminarUsuario(
            @Parameter(description = "ID del usuario a eliminar", required = true) Long id);
} 