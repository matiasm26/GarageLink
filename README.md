# GarageLink U2

> Evaluación Unidad 2 - Desarrollo de Aplicaciones Móviles

GarageLink es un prototipo móvil para registrar servicios de taller mecánico. La versión U2 amplía el flujo original de bienvenida e inicio de sesión con registros de servicio, persistencia local, cámara, GPS, importación/sincronización con API externa y pruebas automatizadas.

El proyecto usa React Native, Expo SDK 57 y TypeScript. No usa backend propio ni autenticación real contra servidor; mantiene el alcance educativo definido para la evaluación.

---

## Contenido

1. Estado actual del proyecto
2. Arquitectura
3. Funcionalidades implementadas
4. Permisos y privacidad
5. Almacenamiento local
6. Cámara y persistencia de fotografías
7. GPS
8. API externa
9. Pruebas automatizadas
10. Ejecución
11. Relación con la rúbrica U2
11. Limitaciones conocidas
13. Historial de commits
14. Arnés agéntico

---

## 1. Estado actual del proyecto

GarageLink U2 implementa un flujo completo de uso local:

```text
Bienvenida
  -> Login local
  -> Lista de servicios
  -> Crear servicio
  -> Guardar registro local
  -> Ver registros guardados
  -> Importar registros desde API
  -> Sincronizar registros con API
```

La aplicación permite:

- iniciar sesión mediante validación local de correo y contraseña;
- proteger la lista de servicios detrás del estado de sesión;
- cerrar sesión;
- crear registros de servicio con título, descripción y estado;
- guardar servicios en memoria y en AsyncStorage;
- conservar registros después de recargar la aplicación;
- obtener ubicación GPS opcional;
- capturar fotografía opcional;
- persistir fotografías capturadas con `expo-file-system`;
- importar datos desde una API externa;
- sincronizar registros locales con una API externa;
- ejecutar pruebas automatizadas de servicios, cámara, GPS, storage y API.

---

## 2. Arquitectura

La arquitectura se mantiene simple y explicable. No se agregó React Navigation; la navegación se controla en `App.tsx` con estado local tipado.

```text
GarageLink
|
|-- App.tsx
|-- app.json
|-- package.json
|-- tsconfig.json
|-- AGENTS.md
|-- RULES.md
|-- CLAUDE.md
|-- README.md
|
|-- assets/
|-- prompts/
|
|-- __mocks__/
|   |-- expo-camera.tsx
|
|-- src/
    |-- components/
    |   |-- FormInput.tsx
    |   |-- PrimaryButton.tsx
    |
    |-- screens/
    |   |-- WelcomeScreen.tsx
    |   |-- LoginScreen.tsx
    |   |-- ServiceListScreen.tsx
    |   |-- ServiceFormScreen.tsx
    |   |-- __tests__/
    |       |-- ServiceFormScreen-camera-test.tsx
    |
    |-- services/
    |   |-- apiService.ts
    |   |-- imageService.ts
    |   |-- locationService.ts
    |   |-- storageService.ts
    |   |-- __tests__/
    |       |-- apiService-test.ts
    |       |-- imageService-test.ts
    |       |-- locationService-test.ts
    |       |-- storageService-test.ts
    |
    |-- theme/
    |   |-- colors.ts
    |
    |-- types/
        |-- serviceRecord.ts
```

### Responsabilidades principales

| Archivo | Responsabilidad |
|---|---|
| `App.tsx` | Estado principal de navegación, sesión, registros, carga inicial, guardado local e integración API. |
| `WelcomeScreen.tsx` | Pantalla inicial y entrada al flujo. |
| `LoginScreen.tsx` | Validación local de correo y contraseña. |
| `ServiceListScreen.tsx` | Lista de registros, cierre de sesión, importación y sincronización API. |
| `ServiceFormScreen.tsx` | Formulario de creación, cámara, GPS y envío de registro. |
| `storageService.ts` | Persistencia y validación de registros con AsyncStorage. |
| `locationService.ts` | Solicitud de permiso foreground y lectura de ubicación GPS. |
| `imageService.ts` | Copia de fotos nativas a almacenamiento persistente con `expo-file-system`. |
| `apiService.ts` | Importación y sincronización con API externa usando `fetch`. |
| `serviceRecord.ts` | Tipos compartidos para registros, ubicación y estados. |

---

## 3. Funcionalidades implementadas

### Bienvenida

Archivo:

```text
src/screens/WelcomeScreen.tsx
```

Incluye:

- marca GarageLink;
- descripción del prototipo;
- beneficios del sistema;
- botón para comenzar.

### Login local

Archivo:

```text
src/screens/LoginScreen.tsx
```

Incluye:

- campo correo;
- campo contraseña;
- validación de correo;
- validación de contraseña mínima de 6 caracteres;
- mensajes de error;
- mensaje de éxito;
- transición a la lista de servicios.

No existe autenticación real con servidor. El login es local y educativo.

### Sesión local y cierre de sesión

Archivo:

```text
App.tsx
```

Incluye:

- estado `isAuthenticated`;
- acceso a registros solo con sesión iniciada;
- cierre de sesión desde la lista;
- retorno a login tras cerrar sesión.

### Registros de servicio

Archivos:

```text
src/screens/ServiceListScreen.tsx
src/screens/ServiceFormScreen.tsx
src/types/serviceRecord.ts
```

Cada registro contiene:

```text
id
title
description
status
createdAt
imageUri opcional
location opcional
synced
```

Estados disponibles:

```text
pendiente
en_proceso
completado
```

La lista muestra:

- título;
- descripción;
- estado;
- fecha de creación;
- fotografía si existe;
- coordenadas si existen;
- estado de sincronización.

---

## 4. Permisos y privacidad

GarageLink solicita permisos solo cuando el usuario ejecuta una acción relacionada.

| Permiso | Dependencia | Cuándo se solicita | Comportamiento si se deniega |
|---|---|---|---|
| Cámara | `expo-camera` | Al pulsar `Tomar foto` y luego `Permitir cámara`. | Permite guardar el servicio sin foto. |
| Ubicación foreground | `expo-location` | Al pulsar `Obtener ubicación`. | Permite guardar el servicio sin GPS. |

Decisiones de privacidad:

- no se solicita ubicación al abrir la app;
- no se usa ubicación en segundo plano;
- no se accede a cámara sin acción del usuario;
- no se guardan contraseñas reales;
- no se usan tokens ni secretos;
- los registros quedan en almacenamiento local del dispositivo;
- la API usada es pública y demostrativa.

---

## 5. Almacenamiento local

Dependencia:

```text
@react-native-async-storage/async-storage 2.2.0
```

Archivo:

```text
src/services/storageService.ts
```

Clave usada:

```text
@garagelink/service-records
```

AsyncStorage guarda solo datos serializables del registro. Las imágenes no se guardan como base64 dentro de AsyncStorage; solo se guarda la ruta `imageUri` persistente.

Ejemplo conceptual:

```json
{
  "id": "service-1",
  "title": "Cambio de aceite",
  "description": "Servicio preventivo",
  "status": "pendiente",
  "createdAt": "2026-08-15T12:00:00.000Z",
  "imageUri": "file://.../garagelink-service-images/service-image-123.jpg",
  "location": {
    "latitude": -33.4489,
    "longitude": -70.6693
  },
  "synced": false
}
```

Validaciones de carga:

- si no hay datos, retorna lista vacía;
- si el JSON base no es una lista, lanza error controlado;
- si una lista contiene elementos inválidos, descarta solo esos elementos;
- acepta registros con `imageUri` persistente;
- acepta registros con `location` válida.

---

## 6. Cámara y persistencia de fotografías

Dependencias:

```text
expo-camera ~57.0.3
expo-file-system ~57.0.4
```

Archivos:

```text
src/screens/ServiceFormScreen.tsx
src/services/imageService.ts
__mocks__/expo-camera.tsx
```

Flujo implementado:

```text
Usuario pulsa Tomar foto
  -> se muestra el bloque de cámara
  -> usuario concede permiso
  -> CameraView.takePictureAsync({ quality: 0.7 })
  -> imageService.persistServiceImage(photo.uri)
  -> se copia la imagen al directorio persistente
  -> se guarda imageUri persistente en el registro
```

Directorio usado:

```text
Paths.document/garagelink-service-images/
```

Nombre generado:

```text
service-image-${Date.now()}.extension
```

Compatibilidad web:

- en web se devuelve la URI original;
- URIs no copiables como `data:image/...` se conservan sin intentar copiar;
- esto evita romper el flujo web de Expo.

Manejo de errores:

- si no hay URI de foto, el servicio puede guardarse sin imagen;
- si falla la cámara, el servicio puede guardarse sin imagen;
- si falla `expo-file-system`, el servicio puede guardarse sin imagen;
- el usuario recibe mensaje claro en la interfaz.

---

## 7. GPS

Dependencia:

```text
expo-location ~57.0.10
```

Archivo:

```text
src/services/locationService.ts
```

Flujo implementado:

```text
Usuario pulsa Obtener ubicación
  -> se solicita permiso foreground
  -> si se concede, se obtiene ubicación actual
  -> se guarda latitud y longitud en el registro
  -> si se deniega o falla, se permite guardar sin GPS
```

Datos guardados:

```ts
location?: {
  latitude: number;
  longitude: number;
}
```

La lista muestra las coordenadas asociadas al registro cuando existen.

---

## 8. API externa

Archivo:

```text
src/services/apiService.ts
```

API usada:

```text
https://jsonplaceholder.typicode.com/todos
```

Funciones implementadas:

- importar registros externos;
- validar estructura de respuesta;
- mapear tareas externas a registros de GarageLink;
- descartar elementos inválidos;
- sincronizar registros locales mediante `POST`;
- marcar registros como sincronizados tras respuesta válida;
- manejar errores HTTP;
- manejar errores de red;
- mantener registros locales si falla la API.

La API es pública y demostrativa. JSONPlaceholder no persiste realmente cambios remotos; se usa para evidenciar comunicación externa, validación y manejo de errores.

---

## 9. Pruebas automatizadas

Framework:

```text
jest
jest-expo
@testing-library/react-native
```

Comando:

```bash
npm test
```

Resultado verificado:

```text
Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
Snapshots:   0 total
```

### Suites

| Suite | Archivo | Casos cubiertos |
|---|---|---|
| Storage | `src/services/__tests__/storageService-test.ts` | sin datos, guardar, cargar, imageUri persistente, datos base inválidos, elementos inválidos. |
| GPS | `src/services/__tests__/locationService-test.ts` | permiso concedido, permiso denegado, error de ubicación. |
| API | `src/services/__tests__/apiService-test.ts` | importación exitosa, datos inválidos, HTTP error, error de red, sync exitosa, sync inválida. |
| Cámara UI | `src/screens/__tests__/ServiceFormScreen-camera-test.tsx` | sección foto, permiso denegado, captura exitosa, error cámara, error persistencia. |
| Imágenes | `src/services/__tests__/imageService-test.ts` | copia persistente nativa, compatibilidad web, error de copia, extensión por defecto. |

### Verificación TypeScript

Comando:

```bash
npx tsc --noEmit
```

Resultado verificado:

```text
sin errores
```

---

## 10. Ejecución

### Instalar dependencias

```bash
npm install
```

### Iniciar Expo

```bash
npm start
```

### Ejecutar en Android

```bash
npm run android
```

### Ejecutar en iOS

```bash
npm run ios
```

### Ejecutar en web

```bash
npm run web
```

### Ejecutar TypeScript

```bash
npx tsc --noEmit
```

### Ejecutar pruebas

```bash
npm test
```

---


## 11. Limitaciones conocidas

- No existe backend propio.
- No existe autenticación real contra servidor.
- La sesión es local y demostrativa.
- JSONPlaceholder no persiste realmente los datos sincronizados.
- No hay sincronización en tiempo real.
- No hay resolución de conflictos remotos.
- No hay eliminación ni edición de registros existentes.
- No hay limpieza automática de imágenes huérfanas si el usuario captura una foto y luego cancela el formulario.
- La validación de credenciales no representa seguridad productiva.
- La evidencia de permisos y periféricos debe complementarse con capturas o video en dispositivo físico para el informe final.

---

## 13. Historial de commits

```text
8f74776 Initial commit
d1eb7de docs: agregar reglas del arnés agéntico
6420209 feat: implementar flujo de bienvenida y login
6ae71df chore: agregar soporte de ejecución web
3efca96 docs: se agrega documentación del proyecto
d1deb78 docs: adaptar arnés agentico para evaluacion unidad 2
7faccc9 feat: implementar registros de servicio en memoria
3a5f1a2 feat: agregar autenticacion local y cierre de sesion
6d401b2 feat: agregar persistencia local con AsyncStorage
852b768 feat: integrar ubicacion GPS en servicios
07f76af feat: integrar camara en registros de servicio
42e3afe feat: integrar importacion y sincronizacion con API
c11e715 test: agregar pruebas automatizadas de la unidad 2
21c4dce feat: agregar persistencia de fotografias de servicio
```

El historial muestra evolución incremental: documentación inicial, flujo base, registros, sesión, almacenamiento, GPS, cámara, API, pruebas y persistencia robusta de fotografías.

---

## 14. Arnés agéntico

Archivos de contexto:

```text
AGENTS.md
RULES.md
CLAUDE.md
prompts/01-planificacion-inicial.md
```

Reglas principales aplicadas:

- mantener React Native, Expo SDK 57 y TypeScript;
- no usar `any`;
- no usar `@ts-ignore`;
- no ocultar errores de TypeScript;
- no instalar dependencias sin autorización;
- no agregar backend propio sin autorización;
- no realizar commits sin autorización;
- ejecutar verificaciones después de cambios relevantes;
- mantener código simple, explicable y acotado a la evaluación.

Herramientas usadas durante el desarrollo:

- OMP en Warp;
- ChatGPT / Codex;
- Expo SDK 57;
- Jest y React Native Testing Library para pruebas.
