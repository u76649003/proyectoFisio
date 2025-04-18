package com.proyectofisio.infrastructure.config.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

    @Bean
    @Primary
    public OpenAPI detailedOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url("/").description("Servidor por defecto"))
                .info(new Info()
                        .title("FisioAyuda API - Sistema de Gestión para Fisioterapeutas")
                        .version("1.2.0")
                        .description("API REST completa para la gestión integral de clínicas de fisioterapia. " +
                                "Incluye gestión de pacientes, citas, historiales clínicos, facturación y más.")
                        .contact(new Contact()
                                .name("Soporte FisioAyuda")
                                .email("soporte@fisioayuda.com")
                                .url("https://www.fisioayuda.com/soporte"))
                        .license(new License()
                                .name("Licencia Propietaria")
                                .url("https://www.fisioayuda.com/licencia")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createJWTSecurityScheme()));
    }

    private SecurityScheme createJWTSecurityScheme() {
        return new SecurityScheme()
                .name("JWT")
                .description("Proporcione el token JWT con el prefijo Bearer. Ejemplo: 'Bearer abcde12345'")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");
    }
} 