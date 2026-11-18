# Plantilla del plan de un flujo

Llénala completa. Cada fila cita su fuente (`archivo:sección` o `archivo:línea`). Lo que no esté escrito en los documentos va como ❓ y pasa a la sección 8.

Marcas técnicas: ✅ comprobado (documentación oficial con enlace, o esqueleto generado con ruta) · 📘 material de `mulesoft-coach` (con ruta) · ⚠️ de memoria, por verificar.

```markdown
# Plan del flujo: <MÉTODO /ruta> de <api>   (o: oyente de <canal> en <api> · tarea <nombre> · orden <nombre> · errores de <api>)

## 0. Esqueleto
- App: <ruta del proyecto de Mule de esa API>
- Flujo generado: <nombre real del flujo> (<archivo.xml:línea>)
- Manejador de errores generado: <nombre> (<archivo.xml:línea>)
- (Oyente / reloj / orden: «APIkit no genera este flujo; va en la app <…>»)

## 1. Qué es
- Qué pasa: <una o dos frases, en palabras del negocio>
- Quién lo dispara: <app, otra API, la cola X, el reloj>
- Qué pasa si falla: <resumen; el detalle va en el punto 4>
- Fuentes: <archivo:sección, …>

## 2. Entrada y salida
| | Qué | Fuente |
|---|---|---|
| Entra | <cuerpo, parámetros, encabezados> | |
| Sale | <cuerpo y códigos HTTP / mensaje publicado> | |

## 3. Piezas en orden
| # | Patrón (QUÉ) | En la arquitectura (CÓMO) | Componente de Mule (CON QUÉ) | Fuente | Marca técnica |
|---|---|---|---|---|---|
| 1 | | | | | ✅ / 📘 / ⚠️ |

## 4. Si algo falla
| Falla | Qué hace el flujo | Qué recibe quien llamó | Nivel (específico / sube al global) | Fuente |
|---|---|---|---|---|

## 5. Lista de revisión
| # | Punto | Estado | Detalle y fuente |
|---|---|---|---|
| R1 | Capas | ✅ / no aplica / ❓ | |
| … | … | | |
| R12 | Operación | | |

## 6. Explicación por pieza
### Pieza 1: <nombre>
- En qué momento del ejercicio se hace:
- Por qué existe (qué problema evita):
- Con qué herramienta se construye:
- Qué resultado se ve al probarla:

## 7. Cómo probarlo
- Camino feliz: <qué llamar o qué mensaje poner, con un ejemplo sacado de los contratos>
- Una prueba por cada falla de la tabla 4

## 8. Pendientes (❓)
| # | Pregunta | Sugerencia | Razón |
|---|---|---|---|

## 9. Propuestas aparte (no están en el diseño)
(Solo si crees que falta algo. Cada una con su razón. No entran al plan sin aprobación.)
```

## Notas de llenado
- **Tabla 3:** en el orden real en que se ejecutan. Si el diseño tiene un dibujo o árbol de llamadas, sigue ese orden y cítalo.
- **Tabla 4:** cada falla dice si la atrapa el flujo (específico) o sube al manejador global, según la regla de `manejo-errores.md`.
- **Diferencias de forma** entre lo que entra, lo que se guarda y lo que se publica (campos con distinto nombre o anidación) son una pieza de **traducción** (R11) con su propia fila en la tabla 3.
- **Plan del manejador global:** en vez de las tablas 2 y 3 usa la tabla «error de Mule → respuesta» de `manejo-errores.md`.
- Si la sección 8 queda vacía, escribe «Sin pendientes».
