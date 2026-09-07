# GarageLink — Reglas del Proyecto (Evaluación Unidad 3)

Estas reglas aplican a cualquier cambio realizado en GarageLink durante la Evaluación Unidad 3 y conservan las restricciones válidas de la Evaluación Unidad 2.

## Tecnología obligatoria

- Usar React Native para construir la interfaz de la aplicación.
- Mantener compatibilidad con Expo SDK 57.
- Escribir el proyecto en TypeScript.
- Mantener React 19 y componentes funcionales.
- No convertir archivos TypeScript a JavaScript.
- No migrar el proyecto a Ionic, Flutter ni otro framework.

## Contexto y documentación

- Leer `AGENTS.md` antes de modificar el proyecto.
- Consultar la documentación oficial versionada de Expo SDK 57 cuando exista duda sobre APIs, configuración, comandos o compatibilidad: https://docs.expo.dev/versions/v57.0.0/
- Revisar documentación de los módulos específicos antes de implementar cámara, ubicación, almacenamiento o pruebas.
- Priorizar APIs disponibles en Expo SDK 57, React Native y JavaScript estándar antes de agregar herramientas externas.

## Calidad de TypeScript

- No usar `any`.
- No usar `@ts-ignore`.
- No ocultar errores de tipos.
- Preferir tipos explícitos y simples cuando ayuden a entender props, estados, permisos, registros y respuestas de API.
- Resolver errores de tipos en la causa.
- Modelar estados limitados con uniones literales.
- Separar lógica testeable de la interfaz cuando sea razonable.

## Dependencias

- No instalar dependencias sin autorización explícita.
- Justificar cualquier dependencia nueva con el criterio de la evaluación que habilita.
- No agregar librerías grandes de navegación, UI, formularios, validación, backend o estado global si la funcionalidad puede resolverse de forma simple.
- Para cámara y GPS, preferir módulos Expo compatibles con SDK 57.
- Para almacenamiento local, preferir una opción simple, mantenible y compatible con Expo.
- Para APIs externas, usar `fetch` nativo salvo necesidad concreta.

## Alcance funcional actual

La aplicación mantiene un flujo simple de gestión de servicios o tareas de taller, con autenticación local, persistencia, cámara, GPS e integración con API externa.

El alcance funcional permitido incluye:

- Cámara para capturar o asociar una imagen a un registro.
- GPS para guardar ubicación del registro.
- Almacenamiento local para conservar registros en el dispositivo.
- Autenticación básica local o demostrativa.
- Consumo o sincronización simple con una API externa.
- Pruebas automatizadas y manuales para funcionalidades críticas.

Evitar:

- Backend propio sin autorización.
- Base de datos remota propia sin autorización.
- Autenticación real con servidor sin autorización.
- Mapas avanzados si no aportan directamente a la rúbrica.
- Arquitecturas complejas, capas innecesarias o abstracciones difíciles de explicar.

## Cámara y permisos

- Solicitar permiso de cámara solo cuando el usuario vaya a usar la cámara.
- Explicar en la interfaz por qué se necesita el permiso.
- Manejar permiso concedido, denegado y pendiente.
- No asumir que el dispositivo tiene cámara disponible.
- Permitir continuar usando la app cuando la cámara no esté disponible, si el flujo lo permite.

## GPS y permisos

- Solicitar permiso de ubicación solo en contexto.
- Guardar únicamente los datos necesarios para la evaluación, como latitud y longitud.
- Manejar permiso concedido, denegado, pendiente y errores de obtención.
- Mostrar feedback claro si no se puede obtener ubicación.
- No recolectar ubicación en segundo plano.

## Almacenamiento local

- Persistir solo datos necesarios para el flujo actual de evaluación.
- Mantener estructura de datos simple y versionable.
- Manejar errores de lectura y escritura.
- Cargar datos al iniciar la aplicación.
- Evitar guardar secretos, contraseñas reales o tokens sensibles.

## Autenticación básica

- Mantener un flujo local o demostrativo salvo autorización explícita para backend.
- Usar estados claros para sesión iniciada y sesión cerrada.
- No guardar contraseñas reales en texto plano como solución final.
- No simular seguridad real donde solo existe control local de interfaz.
- Explicar el alcance educativo de la autenticación si se documenta.

## APIs externas

- Usar una API externa simple y estable para demostrar comunicación.
- Manejar estados de carga, éxito, error y datos vacíos.
- Validar la forma mínima de los datos recibidos antes de renderizarlos.
- No incluir claves privadas ni secretos en el repositorio.
- Diseñar el flujo para que la app conserve utilidad básica si la API falla.

## Pruebas

- Agregar pruebas solo para contratos observables o lógica crítica.
- Priorizar pruebas de validación, permisos, transformación de datos, persistencia y manejo de respuestas de API.
- Para periféricos, aislar lógica testeable y usar mocks cuando corresponda.
- Mantener pruebas deterministas y fáciles de ejecutar.
- Complementar con pruebas manuales para cámara, GPS y flujo completo en dispositivo o navegador.

- Las pruebas unitarias usan Jest con `jest-expo` y Testing Library cuando corresponda.
- Ejecutar `npm test -- --runInBand` para la suite unitaria completa.
- Ejecutar `npm run test:coverage` y revisar Statements, Branches, Functions y Lines.
- Las pruebas deben verificar comportamiento observable, errores, valores inválidos y casos límite; no crear tests artificiales solo para elevar coverage.

## Pruebas E2E con Appium

- Mantener la prueba E2E compatible con Expo Go, Appium, UiAutomator2 y WebdriverIO.
- Usar el emulador documentado `emulator-5554` (Pixel 7, Android 14, API 34) cuando esté disponible.
- Ejecutar `npm run test:e2e:appium` con Appium escuchando en `127.0.0.1:4723`.
- Preferir selectores estables basados en texto o accesibilidad y cerrar siempre la sesión WebDriver.
- No confundir una prueba E2E de navegación con autenticación remota o persistencia remota.

## Control de cambios

- No realizar commits sin autorización explícita.
- No modificar archivos fuera del alcance solicitado.
- Informar al finalizar qué archivos se crearon o modificaron y para qué sirve cada cambio.
- Mantener la rama de trabajo limpia y revisar `git status` cuando el usuario lo solicite.

## Verificación

- Para la prueba E2E, confirmar que Metro/Expo Go, Appium y el emulador estén disponibles antes de diagnosticar un fallo de selectors.
- No cambiar versiones de Expo SDK, React Native o React sin una razón explícita, compatibilidad documentada y autorización.
- Ejecutar `npx tsc --noEmit` después de cambios importantes en TypeScript.
- Ejecutar las pruebas disponibles después de agregar o modificar lógica cubierta por pruebas.
- Cuando se cambie la interfaz, indicar cómo probar manualmente el flujo afectado.
- Para cámara y GPS, verificar permisos concedidos y denegados.
- Para almacenamiento local, verificar persistencia tras reiniciar la app.
- Para APIs, verificar caso exitoso y caso de error.
- Antes de entregar, explicar el comportamiento esperado y los pasos mínimos para verificarlo.
