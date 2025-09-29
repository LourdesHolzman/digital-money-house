# Digital Money House

Aplicación web de billetera virtual desarrollada con Next.js, React y TypeScript para gestión de dinero digital.

## Características

### Funcionalidades Principales

- Registro e inicio de sesión de usuarios
- Gestión de medios de pago (tarjetas de crédito/débito)
- Recarga de saldo en la billetera
- Pago de servicios usando medios de pago o saldo
- Cuenta Virtual Uniforme (CVU) única por usuario
- Registro de transacciones (ingresos y egresos)

### Páginas

- Página de inicio
- Registro de usuario
- Login
- Dashboard
- Perfil de usuario
- Gestión de medios de pago
- Recarga de dinero
- Actividad del usuario
- Pago de servicios

## Stack Tecnológico

- **Framework**: Next.js 15.5.4 con App Router
- **Frontend**: React 18 con TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: Zustand
- **Formularios**: React Hook Form
- **Iconos**: Heroicons

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

1. Clonar el repositorio
   ```bash
   git clone <repository-url>
   cd digital-money-house-app
   ```

2. Instalar dependencias
   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo
   ```bash
   npm run dev
   ```

4. Abrir http://localhost:3000 en el navegador

## Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linter
```

## Funcionalidades

### Autenticación
- Registro con validación de formularios
- Inicio de sesión con email y contraseña
- Persistencia de sesión
- Protección de rutas privadas

### Gestión de Billetera
- Visualización de saldo actual
- CVU único generado automáticamente
- Historial completo de transacciones
- Categorización de ingresos y egresos

### Medios de Pago
- Registro de tarjetas de crédito y débito
- Validación de números de tarjeta y CVV
- Gestión de tarjeta principal
- Enmascaramiento de datos sensibles

### Recarga de Saldo
- Montos predefinidos y personalizados
- Selección de método de pago
- Confirmación de transacción

### Pago de Servicios
- Catálogo de servicios disponibles
- Pago con saldo de billetera o tarjeta
- Validación de saldo suficiente

## Datos de Prueba

**Usuario Demo:**
- Email: `demo@digitalmoney.com`
- Contraseña: `password123`

**Tarjetas de prueba:**
- Crédito: `4111 1111 1111 1111`
- Débito: `5555 5555 5555 4444`
- CVV: `123`

## Licencia

MIT
