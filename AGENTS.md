# AGENTS.md — GarageLink

## Documentación obligatoria

Expo ha cambiado.

Antes de escribir o modificar código, consultar la documentación exacta de Expo SDK 57:

https://docs.expo.dev/versions/v57.0.0/

No utilizar APIs, configuraciones ni recomendaciones correspondientes a versiones anteriores de Expo.

## Contexto del proyecto

GarageLink es una aplicación móvil creada para la Evaluación 1 de la asignatura Desarrollo de Aplicaciones Móviles.

La aplicación representa la entrada a una futura plataforma para:

- Registrar vehículos.
- Administrar mantenciones.
- Consultar fallas mecánicas.
- Almacenar historiales de reparación.

El alcance actual es deliberadamente acotado.

La aplicación debe incluir:

- Una pantalla de bienvenida personalizada.
- Una pantalla de login interactiva.
- Navegación simple entre ambas pantallas.
- Validaciones visuales.
- Retroalimentación al intentar iniciar sesión.

No requiere backend, base de datos ni autenticación real.

## Stack obligatorio

El proyecto debe utilizar:

- React Native.
- Expo SDK 57.
- TypeScript.
- React 19.
- Componentes funcionales.
- React Hooks.

No convertir archivos a JavaScript.

No utilizar Flutter, Ionic ni otros frameworks móviles.

## Principios de desarrollo

El agente debe:

1. Leer este archivo antes de trabajar.
2. Leer `RULES.md`.
3. Revisar la estructura existente del proyecto.
4. Proponer una solución breve antes de implementarla.
5. Crear únicamente lo necesario para cumplir la evaluación.
6. Priorizar código simple y fácil de explicar.
7. Evitar dependencias innecesarias.
8. Mantener el proyecto ejecutable después de cada cambio.
9. No eliminar código funcional sin justificación.
10. Informar qué archivos creó o modificó.
11. No realizar commits sin autorización del usuario.

## Reglas de TypeScript

- No utilizar `any`.
- No utilizar `@ts-ignore`.
- No ocultar errores de TypeScript.
- Tipar correctamente propiedades, estados y funciones.
- Utilizar uniones literales cuando representen estados limitados.
- Corregir los errores antes de terminar una tarea.

Ejemplo:

```ts
type ScreenName = 'welcome' | 'login';