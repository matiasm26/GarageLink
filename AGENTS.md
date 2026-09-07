# AGENTS.md — GarageLink Evaluación Unidad 3

## Documentación obligatoria

Expo ha cambiado.

Antes de escribir o modificar código, consultar la documentación exacta de Expo SDK 57:

https://docs.expo.dev/versions/v57.0.0/

No utilizar APIs, configuraciones ni recomendaciones correspondientes a versiones anteriores de Expo.

Para funcionalidades de la Evaluación Unidad 3, revisar la documentación versionada o vigente de los módulos Expo que se usen:

- Cámara: `expo-camera`.
- Ubicación/GPS: `expo-location`.
- Almacenamiento local: preferir una solución simple y compatible con Expo SDK 57.
- APIs externas: usar `fetch` nativo salvo que exista una razón justificada para otra herramienta.
- Pruebas unitarias: usar Jest, `jest-expo` y Testing Library según el alcance.
- Pruebas E2E: mantener Appium, UiAutomator2 y WebdriverIO sin romper la configuración existente.

## Contexto del proyecto

GarageLink es una aplicación móvil creada para la asignatura Desarrollo de Aplicaciones Móviles.

La Evaluación U1 implementó una entrada simple al sistema:

- Pantalla de bienvenida personalizada.
- Pantalla de login interactiva.
- Navegación local entre pantallas.
- Validaciones visuales.
- Retroalimentación al intentar iniciar sesión.

La Evaluación Unidad 3 mantiene y valida ese prototipo evolucionado, conservando el dominio de talleres mecánicos y priorizando confiabilidad, pruebas unitarias, coverage y debugging/E2E.

- Interacción con periféricos del dispositivo.
- Gestión segura y clara de permisos.
- Almacenamiento local.
- Autenticación básica.
- Comunicación con servicios web y APIs.
- Pruebas de funcionalidades críticas.

## Objetivo funcional actual

La aplicación debe permitir gestionar registros simples asociados a servicios o tareas de taller.

Cada registro debe poder incluir, de forma simple y explicable:

- Título o descripción del servicio/tarea.
- Estado o información básica del trabajo.
- Imagen capturada con la cámara del dispositivo.
- Ubicación GPS donde se crea o registra el servicio/tarea.
- Persistencia local para conservar datos en el dispositivo.
- Sincronización o consulta básica con una API externa.

El alcance debe seguir siendo académico y mantenible. No construir un sistema empresarial completo.

## Stack obligatorio

El proyecto debe mantener:

- React Native.
- Expo SDK 57.
- TypeScript.
- React 19.
- Componentes funcionales.
- React Hooks.

No convertir archivos a JavaScript.

No utilizar Flutter, Ionic ni otros frameworks móviles.

## Alcance actual de la aplicación

La aplicación implementa el siguiente alcance funcional, que debe conservarse y extenderse solo cuando sea necesario:

1. Cámara
   - Capturar una imagen desde el dispositivo.
   - Asociar la imagen a un registro de servicio/tarea.
   - Manejar permiso concedido, denegado y no solicitado.

2. GPS
   - Obtener ubicación actual al crear o actualizar un registro.
   - Guardar latitud y longitud.
   - Mostrar feedback cuando la ubicación no esté disponible.
   - Manejar permiso concedido, denegado y no solicitado.

3. Almacenamiento local
   - Persistir registros en el dispositivo.
   - Cargar registros al iniciar la app.
   - Mantener comportamiento útil sin conexión.

4. Autenticación básica
   - Proteger el acceso a los registros con un flujo simple.
   - Mantener autenticación local o demostrativa salvo autorización explícita para backend.
   - No almacenar secretos reales ni credenciales sensibles.

5. APIs externas
   - Consultar o sincronizar datos con una API externa simple.
   - Manejar estados de carga, éxito y error.
   - Validar datos recibidos antes de usarlos en la interfaz.
   - No depender de claves privadas ni servicios difíciles de explicar.

6. Pruebas
   - Probar validaciones y transformaciones de datos.
   - Probar manejo de permisos mediante funciones aislables o mocks.
   - Probar integración con API mediante casos controlados.
   - Documentar pruebas manuales para cámara, GPS y flujo completo en dispositivo o navegador cuando aplique.

## Pruebas automatizadas actuales

- La suite unitaria usa Jest con `jest-expo` y Testing Library.
- El estado validado es 6 suites y 31 tests aprobados.
- El coverage se ejecuta con `npm run test:coverage` y debe mostrar Statements, Branches, Functions y Lines.
- La prueba E2E usa Appium, UiAutomator2 y WebdriverIO contra Expo Go.
- El escenario E2E actual valida la navegación desde bienvenida hasta inicio de sesión.
- El emulador documentado es `emulator-5554` (Pixel 7, Android 14, API 34).
- Appium debe estar disponible en `127.0.0.1:4723`.
- Ejecutar la prueba con `npm run test:e2e:appium`.

## Prioridad de la Evaluación Unidad 3

El desarrollo debe maximizar evidencia en estos indicadores:

- Periféricos: cámara y GPS deben funcionar de manera clara y robusta.
- Permisos: solicitar permisos en contexto, explicar por qué se necesitan y manejar rechazos.
- Pruebas de periféricos: verificar captura de imagen y obtención de ubicación.
- APIs: integrar comunicación externa con manejo correcto de datos, errores y estados.
- Pruebas de APIs: validar respuestas exitosas, fallas y datos inválidos.

Si hay conflicto entre agregar muchas pantallas y mejorar confiabilidad, priorizar confiabilidad.

## Principios de desarrollo

El agente debe:

1. Leer este archivo antes de trabajar.
2. Leer `RULES.md`.
3. Revisar la estructura existente del proyecto.
4. Proponer una solución breve antes de implementarla.
5. Crear únicamente lo necesario para cumplir la Evaluación Unidad 3.
6. Priorizar código simple y fácil de explicar.
7. Evitar dependencias innecesarias.
8. Justificar cualquier dependencia nueva antes de instalarla.
9. Mantener el proyecto ejecutable después de cada cambio.
10. No eliminar código funcional sin justificación.
11. Informar qué archivos creó o modificó.
12. No realizar commits sin autorización del usuario.
13. No cambiar versiones de Expo SDK, React Native o React sin una razón explícita, compatibilidad documentada y autorización.

## Reglas de TypeScript

- No utilizar `any`.
- No utilizar `@ts-ignore`.
- No ocultar errores de TypeScript.
- Tipar correctamente propiedades, estados, funciones y respuestas de API.
- Utilizar uniones literales cuando representen estados limitados.
- Modelar estados de permisos, carga, error y éxito de forma explícita.
- Corregir los errores antes de terminar una tarea.

Ejemplo:

```ts
type PermissionState = 'unknown' | 'granted' | 'denied';
type SyncState = 'idle' | 'loading' | 'success' | 'error';
```

## Restricciones importantes

- No agregar backend propio salvo autorización explícita.
- No agregar base de datos remota propia salvo autorización explícita.
- No implementar autenticación real con contraseñas remotas salvo autorización explícita.
- No guardar tokens, claves privadas ni secretos en el repositorio.
- No realizar commits sin autorización explícita.
- No modificar archivos fuera del alcance indicado.

## Verificación esperada

Antes de entregar cambios funcionales futuros, se debe verificar como mínimo:

- TypeScript con `npx tsc --noEmit`.
- Pruebas unitarias con `npm test -- --runInBand`.
- Coverage con `npm run test:coverage` cuando se modifique lógica cubierta.
- Prueba E2E con `npm run test:e2e:appium` cuando se modifique el flujo E2E o la configuración Appium.
- Flujo manual principal de la app.
- Permisos de cámara y GPS.
- Creación de registro con imagen y ubicación.
- Persistencia local al cerrar y abrir la app.
- Flujo de autenticación básica.
- Comunicación con API externa en éxito y error.
- Pruebas automatizadas disponibles para la lógica crítica.