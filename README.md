# 🚗 GarageLink

> **Evaluación Unidad 1 – Ingeniería de Arnés Agéntico**  

---

# Descripción

GarageLink es un prototipo de aplicación móvil desarrollado con **React Native**, **Expo SDK 57** y **TypeScript**.

Su propósito es representar una futura plataforma para la gestión de talleres mecánicos, permitiendo administrar clientes, vehículos y servicios desde dispositivos móviles.

La versión desarrollada para esta evaluación implementa un flujo simple compuesto por:

- Pantalla de bienvenida.
- Pantalla de inicio de sesión.
- Validación local del formulario.
- Mensajes de retroalimentación para el usuario.

No existe autenticación contra un servidor, ya que el objetivo principal de la evaluación es demostrar el proceso de desarrollo utilizando un **arnés agéntico**.

---

# Contenido

1. Objetivo de la aplicación
2. Estructura del proyecto
3. Justificación de decisiones
4. Proveedor y modelos de IA
5. Constitución del arnés agéntico
6. Instrucciones de ejecución
7. Historial de desarrollo
8. Evidencias del arnés
9. Autor

---

# 1. Objetivo de la aplicación

GarageLink corresponde al prototipo de una aplicación móvil orientada a la administración de talleres automotrices.

En una versión futura podría permitir:

- Registro de clientes.
- Registro de vehículos.
- Historial de mantenciones.
- Agenda de trabajos.
- Gestión de órdenes de trabajo.
- Seguimiento de reparaciones.
- Comunicación entre cliente y taller.

Para esta evaluación únicamente se desarrolló un flujo funcional compuesto por una pantalla de bienvenida y un formulario de inicio de sesión con validaciones locales.

---

# 2. Estructura del proyecto

```text
GarageLink
│
├── assets/
│
├── prompts/
│   └── 01-planificacion-inicial.md
│
├── src/
│   ├── components/
│   │   ├── FormInput.tsx
│   │   └── PrimaryButton.tsx
│   │
│   ├── screens/
│   │   ├── WelcomeScreen.tsx
│   │   └── LoginScreen.tsx
│   │
│   └── theme/
│       └── colors.ts
│
├── AGENTS.md
├── CLAUDE.md
├── RULES.md
├── App.tsx
├── package.json
└── README.md
```

### Organización

| Carpeta / Archivo | Descripción |
|-------------------|-------------|
| `src/components` | Componentes reutilizables. |
| `src/screens` | Pantallas de la aplicación. |
| `src/theme` | Configuración de colores y estilos. |
| `prompts` | Prompts utilizados durante la planificación. |
| `AGENTS.md` | Contexto principal del agente. |
| `CLAUDE.md` | Archivo de contexto utilizado por el arnés. |
| `RULES.md` | Reglas y restricciones del desarrollo. |

---

# 3. Justificación de decisiones

## Expo Blank + TypeScript

Se seleccionó el template **Blank** de Expo con TypeScript debido a que proporciona una base limpia y sencilla para el desarrollo, evitando dependencias innecesarias.

---

## Navegación

No se utilizó React Navigation.

Debido a que el proyecto solamente requiere dos pantallas, la navegación fue implementada mediante estado local (`useState`), reduciendo la complejidad del proyecto.

---

## Componentes reutilizables

Se implementaron componentes reutilizables para:

- botones
- campos de entrada

con el objetivo de evitar duplicación de código y facilitar futuras modificaciones.

---

## Librerías

No se incorporaron librerías adicionales para navegación o validación.

Únicamente se instalaron las dependencias necesarias para ejecutar la aplicación en navegador durante el desarrollo:

- react-dom
- react-native-web
- @expo/metro-runtime

---

# 4. Proveedor y modelos de IA utilizados

Durante el desarrollo se utilizaron distintas herramientas de inteligencia artificial con funciones complementarias.

## ChatGPT

**Proveedor**

OpenAI

**Modelo**

GPT-5.5

**Utilización**

- planificación del proyecto
- diseño de arquitectura
- diseño del arnés agéntico
- generación y revisión de documentación
- resolución de problemas
- apoyo técnico durante el desarrollo
- organización del flujo de trabajo

---

## OMP (Oh My Pi Coding Harness)

**Herramienta**

OMP ejecutándose dentro de Warp.

**Proveedor configurado**

OpenAI Codex

**Modelo**

openai-codex/gpt-5.5

**Utilización**

- lectura del contexto del proyecto
- implementación de componentes
- implementación de pantallas
- verificación del proyecto mediante TypeScript
- ejecución de comandos Git
- creación de commits autorizados

---

# 5. Constitución del arnés agéntico

El proyecto fue desarrollado utilizando un arnés agéntico construido específicamente para esta evaluación.

El objetivo del arnés fue establecer contexto, reglas y un flujo de trabajo antes de comenzar la implementación.

## Archivos del arnés

| Archivo | Función |
|----------|---------|
| `AGENTS.md` | Define el contexto principal del proyecto y las instrucciones generales para el agente. |
| `CLAUDE.md` | Archivo de contexto utilizado por el arnés para cargar las instrucciones del proyecto. |
| `RULES.md` | Contiene reglas y restricciones que el agente debía respetar durante el desarrollo. |
| `prompts/01-planificacion-inicial.md` | Prompt utilizado para solicitar la planificación inicial del proyecto antes de escribir código. |

---

## Reglas principales definidas

Entre las principales reglas del arnés se encuentran:

- Utilizar TypeScript.
- No utilizar `any`.
- No utilizar `@ts-ignore`.
- No instalar dependencias sin autorización.
- No realizar commits sin autorización.
- Verificar TypeScript después de cambios importantes.
- Mantener soluciones simples y fáciles de mantener.

---

## Flujo de trabajo

El desarrollo siguió el siguiente proceso:

1. Configuración del arnés.
2. Definición de reglas.
3. Planificación del proyecto.
4. Revisión manual del plan.
5. Implementación por etapas.
6. Validación manual del resultado.
7. Verificación mediante TypeScript.
8. Registro del progreso mediante commits independientes.

De esta forma, la inteligencia artificial actuó como un asistente de desarrollo guiado por reglas previamente definidas y supervisado durante todo el proceso.

---

# 6. Instrucciones de ejecución

## Instalar dependencias

```bash
npm install
```

---

## Ejecutar la aplicación

```bash
npm start
```

---

## Ejecutar en navegador

```bash
npm run web
```

Posteriormente puede abrirse desde el navegador utilizando la URL mostrada por Expo.

---

# 7. Historial de desarrollo

El desarrollo quedó registrado mediante múltiples commits independientes, evidenciando el progreso del proyecto.

```text
Initial commit

docs: agregar reglas del arnés agéntico

feat: implementar flujo de bienvenida y login

chore: agregar soporte de ejecución web
```

Cada commit representa una etapa específica del desarrollo, evitando concentrar todos los cambios en un único commit.

---

# 8. Evidencias del arnés

La siguiente tabla resume cómo el proyecto cumple los requisitos solicitados para el uso de un arnés agéntico.

| Requisito solicitado | Evidencia |
|----------------------|----------|
| Herramienta de IA utilizada | OMP (Warp) + ChatGPT |
| Archivos de contexto | `AGENTS.md` y `CLAUDE.md` |
| Reglas del agente | `RULES.md` |
| Prompt de planificación | `prompts/01-planificacion-inicial.md` |
| Historial de desarrollo | Commits independientes en Git |
| Código fuente | Carpeta `src/` |
