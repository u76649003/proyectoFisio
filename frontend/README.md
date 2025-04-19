# FisioAyuda - Frontend

Este proyecto es el frontend de la aplicación FisioAyuda, una plataforma de gestión para clínicas de fisioterapia.

## Requisitos previos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

## Instalación

1. Clona el repositorio:
```
git clone https://github.com/tu-usuario/proyectoFisio.git
cd proyectoFisio/frontend
```

2. Instala las dependencias:
```
npm install
```

## Configuración

El proyecto utiliza variables de entorno para la configuración. Estas se encuentran en los archivos:

- `.env.development` - Configuración para desarrollo
- `.env.production` - Configuración para producción

## Ejecución

### Desarrollo

Para iniciar el servidor de desarrollo:

```
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Producción

Para crear una versión optimizada para producción:

```
npm run build
```

Los archivos de la build se generarán en la carpeta `build/`.

## Estructura del proyecto

- `src/` - Código fuente
  - `assets/` - Recursos estáticos (imágenes, etc.)
  - `components/` - Componentes React reutilizables
  - `pages/` - Páginas principales de la aplicación
  - `services/` - Servicios para comunicación con la API
  - `utils/` - Utilidades y helpers

## Conexión con el backend

El frontend se comunica con el backend a través de los servicios definidos en `src/services/api.js`. Por defecto, en desarrollo se conecta a `http://localhost:8080/api` y en producción a `https://proyectofisio.onrender.com/api`.

## Tecnologías utilizadas

- React
- Material UI
- React Router
- Axios

## Licencia

Este proyecto es propiedad de FisioAyuda. 