# GarageLink - Reglas del Proyecto

Estas reglas aplican a cualquier cambio realizado en GarageLink.

## Tecnología obligatoria

- Usar React Native para construir la interfaz de la aplicación.
- Mantener compatibilidad con Expo SDK 57.
- Escribir el proyecto en TypeScript.
- No convertir archivos TypeScript a JavaScript.

## Contexto y documentación

- Leer `AGENTS.md` antes de modificar el proyecto.
- Consultar la documentación oficial versionada de Expo SDK 57 cuando exista duda sobre APIs, configuración, comandos o compatibilidad: https://docs.expo.dev/versions/v57.0.0/
- Priorizar las APIs ya disponibles en Expo SDK 57 y React Native antes de agregar nuevas herramientas.

## Calidad de TypeScript

- No usar `any`.
- No usar `@ts-ignore`.
- Preferir tipos explícitos y simples cuando ayuden a entender props, estados y funciones.
- Resolver errores de tipos en la causa, no ocultarlos.

## Dependencias

- No instalar dependencias sin autorización explícita.
- No agregar librerías de navegación, UI, formularios, validación, backend o almacenamiento si la funcionalidad puede resolverse de forma simple con React Native, Expo y TypeScript.

## Alcance funcional

- Priorizar soluciones simples, limpias y fáciles de explicar durante la evaluación.
- Evitar sobreingeniería, abstracciones innecesarias y estructuras que no aporten al requerimiento actual.
- No agregar backend.
- No agregar base de datos.
- No agregar autenticación real.
- Para flujos de login educativos o demostrativos, usar estado local y validaciones de interfaz salvo que se autorice otro alcance.

## Control de cambios

- No realizar commits sin autorización explícita.
- No modificar archivos fuera del alcance solicitado.
- Informar al finalizar qué archivos se crearon o modificaron y para qué sirve cada cambio.

## Verificación

- Ejecutar `npx tsc --noEmit` después de cambios importantes en TypeScript.
- Cuando se cambie la interfaz, indicar cómo probar manualmente el flujo afectado.
- Antes de entregar, explicar el comportamiento esperado y los pasos mínimos para verificarlo.
