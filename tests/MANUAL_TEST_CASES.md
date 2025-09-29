# Casos de Prueba Manuales - Sprint 4
## Digital Money House

### Información General
- **Versión**: Sprint 4
- **Fecha**: 2024-01-28
- **Responsable**: QA Team
- **Clasificación**: Smoke Tests / Regression Tests

---

## 1. ÉPICA: PAGO DE SERVICIOS

### TC-001: Lista de Servicios - Visualización sin Paginación
**Clasificación**: Smoke Test
**Prioridad**: Alta
**Duración estimada**: 2 minutos

**Precondiciones**:
- Usuario autenticado en la aplicación
- Navegar a `/pay-services`

**Pasos**:
1. Acceder a la página "Pagar Servicios"
2. Verificar que se muestren todos los servicios disponibles
3. Contar el número total de servicios mostrados

**Resultado esperado**:
- Se muestran 6 servicios: Edesur, Metrogas, AySA, Telecom, Movistar, Claro
- No hay paginación
- Todos los servicios se muestran en una sola página

**Criterios de aceptación**:
- ✅ Todos los servicios están visibles
- ✅ No hay controles de paginación
- ✅ La página carga en menos de 3 segundos

---

### TC-002: Buscador de Servicios por Título
**Clasificación**: Smoke Test, Regression Test
**Prioridad**: Alta
**Duración estimada**: 3 minutos

**Precondiciones**:
- Usuario en la página de Pagar Servicios

**Pasos**:
1. Localizar el campo de búsqueda
2. Escribir "Edesur" en el buscador
3. Verificar los resultados filtrados
4. Limpiar búsqueda y escribir "Telefonía"
5. Verificar filtrado por categoría
6. Escribir "NoExiste"
7. Verificar mensaje de sin resultados

**Resultado esperado**:
- Búsqueda por "Edesur": Solo muestra Edesur
- Búsqueda por "Telefonía": Muestra Telecom, Movistar, Claro
- Búsqueda sin coincidencias: Mensaje "No se encontraron servicios"

**Criterios de aceptación**:
- ✅ Búsqueda funciona en tiempo real
- ✅ Filtrado correcto por nombre y categoría
- ✅ Mensaje claro cuando no hay resultados

---

### TC-003: Validación de Número de Cuenta - Cuenta Válida
**Clasificación**: Smoke Test
**Prioridad**: Crítica
**Duración estimada**: 3 minutos

**Precondiciones**:
- Usuario ha seleccionado un servicio (ej: Edesur)

**Pasos**:
1. Ver el formulario de número de cuenta
2. Verificar que se muestren las cuentas de prueba válidas
3. Ingresar "123456789" (cuenta válida para Edesur)
4. Hacer clic en "Validar número de cuenta"
5. Esperar respuesta del sistema

**Resultado esperado**:
- Se muestra "Cuenta válida - Facturas pendientes encontradas"
- El formulario avanza al paso de selección de monto y medio de pago
- Se muestra el número de cuenta validado

**Criterios de aceptación**:
- ✅ Validación exitosa en menos de 2 segundos
- ✅ Mensaje de confirmación claro
- ✅ Progresión correcta del flujo

---

### TC-004: Validación de Número de Cuenta - Cuenta Inválida
**Clasificación**: Regression Test
**Prioridad**: Alta
**Duración estimada**: 2 minutos

**Precondiciones**:
- Usuario ha seleccionado un servicio

**Pasos**:
1. Ingresar "999999999" (cuenta inválida)
2. Hacer clic en "Validar número de cuenta"
3. Observar la respuesta del sistema

**Resultado esperado**:
- Mensaje de error: "Número de cuenta inválido o sin facturas pendientes de pago"
- El usuario permanece en el paso de validación
- No se permite continuar con el flujo

**Criterios de aceptación**:
- ✅ Error mostrado claramente
- ✅ No progresión del flujo
- ✅ Posibilidad de reintentar

---

### TC-005: Validación de Formato de Número de Cuenta
**Clasificación**: Regression Test
**Prioridad**: Media
**Duración estimada**: 3 minutos

**Precondiciones**:
- Usuario en formulario de validación de cuenta

**Datos de prueba**:
- Cuenta con letras: "abc123def"
- Cuenta muy corta: "123"
- Cuenta muy larga: "123456789012345678"
- Cuenta vacía: ""

**Pasos**:
1. Probar cada dato de prueba
2. Intentar validar cada caso
3. Verificar mensajes de error específicos

**Resultado esperado**:
- Letras: "Solo se permiten números"
- Muy corta: "El número debe tener al menos 6 dígitos"
- Muy larga: "El número no puede tener más de 15 dígitos"
- Vacía: "El número de cuenta es requerido"

**Criterios de aceptación**:
- ✅ Validación en tiempo real
- ✅ Mensajes de error específicos
- ✅ Prevención de envío inválido

---

### TC-006: Selección de Medio de Pago - Saldo de Billetera
**Clasificación**: Smoke Test
**Prioridad**: Crítica
**Duración estimada**: 2 minutos

**Precondiciones**:
- Usuario ha validado cuenta exitosamente
- Usuario tiene saldo disponible ($50,000)

**Pasos**:
1. Ingresar monto: $1,000
2. Seleccionar "Pagar con saldo de billetera"
3. Verificar información mostrada
4. Revisar resumen de transacción

**Resultado esperado**:
- Se muestra saldo disponible actual
- Resumen muestra servicio, cuenta, monto
- Se calcula y muestra nuevo saldo
- Botón de pago habilitado

**Criterios de aceptación**:
- ✅ Información clara y precisa
- ✅ Cálculos correctos
- ✅ Resumen completo

---

### TC-007: Selección de Medio de Pago - Tarjeta
**Clasificación**: Smoke Test
**Prioridad**: Alta
**Duración estimada**: 2 minutos

**Precondiciones**:
- Usuario ha validado cuenta exitosamente

**Pasos**:
1. Seleccionar "Pagar con tarjeta"
2. Verificar opciones disponibles
3. Revisar botón "Agregar nueva tarjeta"

**Resultado esperado**:
- Se muestra dropdown con tarjetas disponibles
- Opciones demo: "Tarjeta de Crédito **** 1234", "Tarjeta de Débito **** 5678"
- Botón "Agregar nueva tarjeta" visible y funcional

**Criterios de aceptación**:
- ✅ Lista de tarjetas cargada
- ✅ Opción de agregar nueva funcional
- ✅ Selección required cuando aplica

---

### TC-008: Validación de Fondos Insuficientes
**Clasificación**: Regression Test
**Prioridad**: Crítica
**Duración estimada**: 2 minutos

**Precondiciones**:
- Usuario en formulario de pago
- Saldo disponible: $50,000

**Pasos**:
1. Ingresar monto: $100,000 (mayor al saldo)
2. Seleccionar "Pagar con saldo de billetera"
3. Verificar mensaje de error
4. Intentar proceder con el pago

**Resultado esperado**:
- Mensaje: "Saldo insuficiente. Tu saldo actual es $50.000,00"
- Botón de pago deshabilitado
- No se permite procesar transacción

**Criterios de aceptación**:
- ✅ Validación en tiempo real
- ✅ Botón deshabilitado correctamente
- ✅ Mensaje claro de error

---

### TC-009: Flujo Completo de Pago Exitoso
**Clasificación**: Smoke Test, Regression Test
**Prioridad**: Crítica
**Duración estimada**: 5 minutos

**Precondiciones**:
- Usuario autenticado con saldo suficiente

**Pasos**:
1. Seleccionar servicio "Edesur"
2. Ingresar cuenta válida "123456789"
3. Validar cuenta
4. Ingresar monto $5,000
5. Seleccionar pago con billetera
6. Confirmar pago
7. Verificar resultado

**Resultado esperado**:
- Transacción procesada exitosamente
- Mensaje: "¡Pago exitoso! Se pagó $5.000,00 al servicio Edesur"
- Redirección al dashboard
- Saldo actualizado

**Criterios de aceptación**:
- ✅ Flujo completo sin errores
- ✅ Confirmación clara de éxito
- ✅ Datos persistidos correctamente

---

## 2. CASOS DE PRUEBA EXPLORATORIOS

### Sesión Exploratoria 1: Usabilidad del Flujo de Pago
**Duración**: 30 minutos
**Objetivo**: Evaluar la experiencia de usuario en el flujo completo

**Tours a realizar**:
1. **Tour del Usuario Nuevo**: Simular primera vez usando la funcionalidad
2. **Tour del Usuario Experto**: Completar flujo rápidamente
3. **Tour de Errores**: Intentar romper el flujo intencionalmente

**Escenarios**:
- Usuario con prisa intentando pagar rápidamente
- Usuario cauteloso que revisa cada paso
- Usuario que comete errores comunes

**Aspectos a evaluar**:
- Claridad de instrucciones
- Tiempo de respuesta
- Facilidad de corrección de errores
- Intuitividad del flujo

---

### Sesión Exploratoria 2: Comportamiento con Datos Edge Cases
**Duración**: 20 minutos
**Objetivo**: Probar límites y casos extremos

**Casos a probar**:
- Montos muy pequeños ($1)
- Montos máximos ($100,000)
- Búsquedas con caracteres especiales
- Navegación entre servicios múltiples veces
- Abandono del flujo y retorno

---

## 3. MÉTRICAS DE CALIDAD (QA SIGN OFF)

### Resumen de Ejecución
- **Total de casos ejecutados**: 9 casos principales + 2 sesiones exploratorias
- **Casos pasados**: [A completar durante ejecución]
- **Casos fallidos**: [A completar durante ejecución]
- **Defectos encontrados**: [A documentar durante ejecución]
- **Casos automatizados**: 3 suites de pruebas automatizadas

### Criterios de Aceptación para Sign Off
- ✅ 100% de casos smoke test pasados
- ✅ 95% de casos regression test pasados
- ✅ 0 defectos críticos abiertos
- ✅ Máximo 2 defectos menores abiertos
- ✅ Tiempo de respuesta < 3 segundos para operaciones críticas

### Clasificación de Defectos
- **Crítico**: Bloquea funcionalidad principal
- **Alto**: Impacta experiencia de usuario significativamente
- **Medio**: Problema menor que no impide uso
- **Bajo**: Cosmético o mejora sugerida

---

## 4. NOTAS DE EJECUCIÓN

### Ambiente de Pruebas
- **URL**: http://localhost:3000
- **Usuario de prueba**: test@example.com
- **Datos de cuenta válidos por servicio**: Ver implementación en código

### Precondiciones Generales
- Navegador: Chrome/Firefox/Safari última versión
- Resolución: 1920x1080 (desktop), 375x667 (mobile)
- JavaScript habilitado
- Local Storage habilitado

### Post-condiciones
- Limpiar datos de sesión entre pruebas
- Verificar que no quedan transacciones pendientes
- Reset de saldo si es necesario