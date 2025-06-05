# Configuración de Entornos para ProyectoFisio

Este documento explica cómo alternar entre los entornos de producción y desarrollo local con Docker.

## Entornos disponibles

El proyecto soporta dos entornos principales:

- **Producción (prod)**: Configurado para el entorno de Render.com
- **Local**: Para desarrollo en entorno local con Docker

## Configuración para desarrollo local con Docker en Windows

### Requisitos previos
- Docker Desktop para Windows instalado
- Docker Compose instalado

### Pasos para ejecutar el entorno local

1. **Iniciar el entorno con Docker Compose**

   ```bash
   docker-compose -f docker-compose-local.yml up -d
   ```

   Esto iniciará:
   - El backend Spring Boot con el perfil local activado
   - Una base de datos PostgreSQL local

2. **Verificar que todo funciona**

   Accede a la aplicación en: http://localhost:8080

3. **Detener los contenedores**

   ```bash
   docker-compose -f docker-compose-local.yml down
   ```

### Persistencia de datos

Los datos de PostgreSQL se mantienen en un volumen Docker llamado `postgres-data`, por lo que no se perderán al detener los contenedores.

## Alternando entre entornos

### Usando Docker (recomendado para desarrollo)

- Para entorno local: `docker-compose -f docker-compose-local.yml up -d`
- La configuración usa automáticamente el perfil `local` mediante variables de entorno

### Ejecutando la aplicación directamente (sin Docker)

1. **Para usar el entorno local:**
   
   Modifica `application.properties`:
   ```properties
   spring.profiles.active=local
   ```

2. **Para usar el entorno de producción:**
   
   Modifica `application.properties`:
   ```properties
   spring.profiles.active=prod
   ```

## Notas importantes

- El perfil `local` está configurado para conectarse a PostgreSQL usando `host.docker.internal`, que permite a los contenedores Docker comunicarse con servicios en el host de Windows
- No comprometas credenciales sensibles en Git. Las credenciales actuales son solo para desarrollo
- La configuración de producción apunta a una base de datos en Render.com 