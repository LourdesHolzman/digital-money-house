# Planificación Digital Money House

## Objetivo del Proyecto

Cuando arranqué con este proyecto, la idea era desarrollar una aplicación de billetera virtual completa que cumpliera con todos los requerimientos del desafío. La verdad es que fue más complejo de lo que pensé inicialmente, pero el resultado final me deja bastante conforme.

El desafío requería:
- Desarrollar una app de billetera virtual funcional
- Crear documentación del proceso de desarrollo
- Implementar tests para asegurar la calidad
- Configurar la infraestructura necesaria
- Entregar todo en un repositorio bien organizado

## Reflexión Personal

Este proyecto me sirvió para poner en práctica varios conceptos que venía estudiando, especialmente Next.js 15 con App Router y Zustand para el manejo de estado. Al principio dudé si usar Redux o Zustand, pero al final Zustand resultó mucho más simple para este caso de uso.

## Proceso de Testing

### Lo que aprendí sobre testing
Al principio no tenía muy claro cómo estructurar los tests, especialmente para los componentes de React. Después de investigar un poco, me decidí por React Testing Library porque se enfoca más en cómo el usuario interactúa con la app, que al final es lo que importa.

Implementé tests para:
- Componentes UI (Button, CardPreview)
- Funciones utilitarias (validaciones, formateo)
- Store de autenticación (login, registro, manejo de tarjetas)

Lo que más me costó fue testear el comportamiento asíncrono del store, pero usando `renderHook` y `act` de React Testing Library pude resolver la mayoría de problemas.

### Testing Manual
Además de los tests automatizados, hice un montón de pruebas manuales, especialmente para:
- El flujo completo de registro y login
- La funcionalidad de agregar tarjetas (que resultó más compleja de lo esperado)
- Los formularios de pago de servicios
- La responsividad en diferentes dispositivos

## Infraestructura y Herramientas

### Setup del Proyecto
Para este proyecto decidí usar:
- **Git** para el control de versiones (obvio)
- **Docker** para facilitar el deployment y evitar el típico "funciona en mi máquina"
- **Next.js 15** porque quería probar las nuevas features del App Router

La configuración de Docker me llevó más tiempo de lo esperado. Al principio tenía problemas con las variables de entorno y el hot reload, pero después de ajustar el docker-compose.yml todo funcionó como esperaba.

El proyecto está pensado para funcionar como microservicio. El frontend está completamente separado y se puede integrar fácilmente con cualquier backend que implemente la API correspondiente.

## Funcionalidades Desarrolladas

### Lo que terminé implementando

**Autenticación y Registro**
El sistema de auth fue de las primeras cosas que hice. Implementé tanto login como registro con validaciones bastante robustas. Una cosa que me gustó fue cómo quedó la persistencia de sesión usando localStorage.

**Dashboard Principal**
El dashboard es el corazón de la app. Acá el usuario ve su saldo, las últimas transacciones y puede acceder rápidamente a las funciones principales. Me enfoqué en que la información más importante esté siempre visible.

**Gestión de Perfil**
Esta parte me llevó más tiempo de lo esperado. Implementé edición inline de todos los datos personales. La funcionalidad de copiar CVU y alias con feedback visual quedó bastante bien - es uno de esos detalles que mejoran mucho la experiencia de usuario.

**Tarjetas de Pago**
El preview en tiempo real de la tarjeta mientras el usuario tipea quedó bien. Agregué soporte para tarjetas argentinas (Cabal, Naranja) además de las internacionales. La animación de flip para mostrar el CVV fue un detalle que me gustó mucho.

**Carga de Dinero**
Interface simple pero efectiva. El usuario puede elegir el monto, seleccionar la tarjeta y confirmar la transacción. Todo se actualiza en tiempo real en el saldo.

**Pago de Servicios**
Implementé un catálogo de servicios con formularios específicos para cada tipo. Las validaciones varían según el servicio (por ejemplo, un número de medidor para luz vs un número de cliente para telefonía).

**Actividad y Transacciones**
Lista completa de transacciones con filtros y búsqueda. Esta sección es clave para que el usuario tenga control total sobre su historial financiero.

## Stack Tecnológico

### Decisiones técnicas

**Frontend**
- **Next.js 15.5.4** con App Router - Quería probar las nuevas features y la verdad que el nuevo sistema de routing es bastante más intuitivo
- **React 19** con TypeScript - TypeScript era obligatorio para un proyecto de esta envergadura
- **Tailwind CSS** - Al principio pensé en usar styled-components pero Tailwind me dio mucha más velocidad de desarrollo
- **Zustand** - Como mencioné antes, mucho más simple que Redux para este caso
- **React Hook Form** - Para el manejo de formularios, especialmente útil para las validaciones

**Herramientas de Desarrollo**
- **ESLint** - Configuré las reglas más estrictas para mantener la calidad del código
- **Jest** + **React Testing Library** - Para los tests unitarios
- **Docker** - Pensando en deployment y para que cualquiera pueda levantar el proyecto sin problemas

### Decisiones de UX/UI
Una cosa en la que me enfoqué mucho fue en la experiencia de usuario:
- **Diseño responsive** - Probé en varios dispositivos y tamaños de pantalla
- **Animaciones** - Sutiles pero efectivas, especialmente en las transiciones
- **Feedback visual** - Cada acción del usuario tiene algún tipo de respuesta visual
- **Validaciones en tiempo real** - Para que el usuario sepa inmediatamente si algo está mal
- **Estados de carga** - Para que el usuario siempre sepa qué está pasando

## Organización del Código

Traté de mantener una estructura lo más limpia posible:

```
src/
├── app/                 # Rutas de Next.js (App Router)
├── components/          # Componentes reutilizables
│   ├── layout/         # Header, Footer, etc.
│   └── ui/             # Botones, Cards, Forms
├── stores/             # Gestión de estado con Zustand
├── types/              # Todas las definiciones de TypeScript
├── lib/                # Funciones auxiliares y utils
└── contexts/           # Contextos de React (aunque usé poco)
```

Al principio todo estaba más desordenado, pero después de un refactor general quedó bastante más mantenible.

## Reflexiones Finales

### Qué aprendí

**A nivel técnico:**
- Next.js 15 tiene features muy copadas, especialmente el App Router
- Zustand realmente es mucho más simple que Redux para proyectos medianos
- TypeScript te salva de muchos errores, especialmente en formularios
- Los tests unitarios te dan mucha más confianza para refactorizar

**A nivel de UX:**
- Los pequeños detalles hacen la diferencia (animaciones, feedback, estados de carga)
- La responsividad no es opcional, hay que pensarla desde el principio
- Los usuarios esperan que todo funcione rápido y sin problemas

**A nivel de desarrollo:**
- Los commits frecuentes y descriptivos te salvan cuando algo se rompe
- La documentación es tan importante como el código
- Tener tests te permite cambiar cosas sin miedo
- Docker realmente resuelve el problema de "funciona en mi máquina"

### Lo que haría diferente

Si tuviera que empezar de nuevo, probablemente:
- Habría empezado con los tests desde el día uno
- Me habría tomado más tiempo para definir bien el diseño que muestran en Figma antes de empezar a codear

### Estado actual

El proyecto está funcionando bien y cumple con todos los requerimientos. Estoy conforme con el resultado.

---

**Finalizado:** Septiembre 2025
**Estado:** Proyecto completado y funcionando