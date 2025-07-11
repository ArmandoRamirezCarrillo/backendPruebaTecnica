# Guía de Despliegue

## Requisitos
- Docker instalado.
- Acceso a un proveedor de nube (AWS recomendado).

## Pasos
1. Construir las imágenes de Docker:
   ```bash
   docker-compose build
   ```
2. Iniciar los contenedores:
   ```bash
   docker-compose up
   ```
3. Configurar las variables de entorno en el archivo `.env`.
4. Acceder a la aplicación en `http://localhost:4000`.
