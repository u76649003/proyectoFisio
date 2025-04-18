# Proyecto Fisio

Este proyecto utiliza una arquitectura moderna con Spring Boot en el backend (arquitectura hexagonal), React con Bootstrap en el frontend, y Docker con PostgreSQL como base de datos.

## Estructura del Proyecto

### Backend (Arquitectura Hexagonal)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── proyectofisio/
│   │   │           ├── application/
│   │   │           │   ├── ports/
│   │   │           │   │   ├── input/
│   │   │           │   │   └── output/
│   │   │           │   └── services/
│   │   │           ├── domain/
│   │   │           │   └── model/
│   │   │           └── infrastructure/
│   │   │               ├── adapters/
│   │   │               │   ├── input/
│   │   │               │   │   └── rest/
│   │   │               │   └── output/
│   │   │               │       └── persistence/
│   │   │               └── config/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── Dockerfile
```

### Frontend (React con Bootstrap)

```
frontend/
├── public/
├── src/
├── package.json
├── Dockerfile
└── nginx.conf
```

## Tecnologías Utilizadas

- **Backend**: Spring Boot, Spring Security, Spring Data JPA
- **Frontend**: React, Bootstrap, React Router
- **Base de Datos**: PostgreSQL
- **Contenedores**: Docker, Docker Compose

## Cómo ejecutar el proyecto

1. Asegúrate de tener Docker y Docker Compose instalados
2. Clona este repositorio
3. En la raíz del proyecto, ejecuta:

```bash
docker-compose up
```

4. Accede a la aplicación en:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - Base de datos PostgreSQL: localhost:5432 