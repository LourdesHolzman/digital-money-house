# Docker Deployment Guide - Digital Money House

## Información General
Este documento describe cómo deployar la aplicación Digital Money House usando Docker y docker-compose.

## Archivos de Docker

### 1. Dockerfile (Producción)
- **Imagen base**: node:18-alpine
- **Multi-stage build**: Optimizado para producción
- **Usuario no-root**: nextjs (uid: 1001)
- **Health check**: Incluido
- **Puerto**: 3000

### 2. Dockerfile.dev (Desarrollo)
- **Hot reload**: Habilitado
- **Volúmenes**: Código fuente montado
- **Puerto**: 3000

### 3. docker-compose.yml (Producción)
Servicios incluidos:
- **app**: Aplicación Next.js
- **redis**: Cache y sesiones
- **nginx**: Reverse proxy con rate limiting

### 4. docker-compose.dev.yml (Desarrollo)
- **app-dev**: Con hot reload
- **redis-dev**: Para desarrollo

## Comandos Disponibles

### Scripts NPM
```bash
# Construir imagen de producción
npm run docker:build

# Ejecutar contenedor individual
npm run docker:run

# Levantar todos los servicios (producción)
npm run docker:up

# Parar todos los servicios
npm run docker:down

# Modo desarrollo con hot reload
npm run docker:dev

# Ver logs de contenedores
npm run docker:logs
```

### Comandos Docker Directos

#### Producción
```bash
# Construir imagen
docker build -t digital-money-house .

# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar servicios
docker-compose down
```

#### Desarrollo
```bash
# Modo desarrollo
docker-compose -f docker-compose.dev.yml up

# Reconstruir y ejecutar
docker-compose -f docker-compose.dev.yml up --build
```

## Configuración para AWS

### 1. Preparación de la Imagen
```bash
# Construir imagen para AWS
docker build -t digital-money-house:latest .

# Taggear para ECR
docker tag digital-money-house:latest <account-id>.dkr.ecr.<region>.amazonaws.com/digital-money-house:latest
```

### 2. Subir a Amazon ECR
```bash
# Login a ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

# Crear repositorio (si no existe)
aws ecr create-repository --repository-name digital-money-house

# Subir imagen
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/digital-money-house:latest
```

### 3. Deployment en ECS
Archivo `ecs-task-definition.json`:
```json
{
  "family": "digital-money-house",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "digital-money-house",
      "image": "<account-id>.dkr.ecr.<region>.amazonaws.com/digital-money-house:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/digital-money-house",
          "awslogs-region": "<region>",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 4. Load Balancer (ALB)
- **Puerto**: 80/443
- **Target Group**: Puerto 3000
- **Health Check**: `/health`

## Variables de Entorno

### Producción
```env
NODE_ENV=production
PORT=3000
REDIS_URL=redis://redis:6379
```

### Desarrollo
```env
NODE_ENV=development
PORT=3000
CHOKIDAR_USEPOLLING=true
```

## Volúmenes y Datos

### Redis Data
- **Volumen**: `redis_data`
- **Persistencia**: Habilitada con appendonly
- **Backup**: Recomendado para producción

### Logs
- **Aplicación**: stdout/stderr capturados por Docker
- **Nginx**: Logs de acceso y error
- **Redis**: Logs internos

## Monitoreo y Salud

### Health Checks
- **Aplicación**: `/api/health`
- **Nginx**: `/health`
- **Redis**: Ping automático

### Métricas
- **CPU/Memory**: Via Docker stats
- **Logs**: Centralizados con Docker logging
- **APM**: Integrar con AWS X-Ray o similar

## Seguridad

### Dockerfile
- Usuario no-root (nextjs)
- Imagen Alpine (menor superficie de ataque)
- Multi-stage build (dependencias de build no incluidas)

### Nginx
- Rate limiting configurado
- Headers de seguridad
- Compresión gzip habilitada

### Red
- Red interna para comunicación entre servicios
- Puertos mínimos expuestos
- Proxy reverso para SSL termination

## Troubleshooting

### Problemas Comunes

#### 1. Error de permisos
```bash
# Verificar usuario en contenedor
docker exec -it digital-money-house-app whoami

# Verificar permisos de archivos
docker exec -it digital-money-house-app ls -la /app
```

#### 2. Problemas de red
```bash
# Verificar conectividad entre servicios
docker-compose exec app ping redis

# Verificar puertos
docker-compose ps
```

#### 3. Logs para debugging
```bash
# Logs específicos del servicio
docker-compose logs app

# Logs en tiempo real
docker-compose logs -f --tail=100 app
```

### Comandos Útiles
```bash
# Acceder al contenedor
docker-compose exec app sh

# Verificar procesos
docker-compose exec app ps aux

# Verificar configuración
docker-compose config

# Limpiar recursos
docker system prune -a
```

## CI/CD Pipeline

### GitHub Actions (Ejemplo)
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Build and push to ECR
        run: |
          docker build -t digital-money-house .
          docker tag digital-money-house:latest $ECR_REGISTRY/digital-money-house:latest
          docker push $ECR_REGISTRY/digital-money-house:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster production --service digital-money-house --force-new-deployment
```

## Mantenimiento

### Actualizaciones
1. Construir nueva imagen con tag de versión
2. Actualizar docker-compose.yml con nueva versión
3. Rolling deployment sin downtime

### Backups
- Redis: Snapshot automático
- Logs: Rotación configurada
- Configuración: Versionado en Git

### Escalamiento
- Horizontal: Múltiples instancias del contenedor app
- Vertical: Ajustar CPU/memory en docker-compose.yml
- Auto-scaling: Configurar en AWS ECS