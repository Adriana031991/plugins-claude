---
description: Evalúa conocimientos MuleSoft con preguntas y mini-ejercicios (estilo certificación o de proyecto real), por nivel. Úsala cuando la persona pida que la evalúes, le hagas preguntas o un simulacro, o diga "pasa a avanzado" (u otro nivel).
argument-hint: "[certificacion|proyecto] [tema] [destino]"
---

# Módulo 2: evaluación

## Al empezar
1. Recuérdale en una línea a la persona que revise la documentación oficial de MuleSoft, porque cambia.
2. Lee `${user_config.datos_dir}/config.json` (`nivel_actual`, `deployment_targets`, `objetivos`).
3. Lee `${CLAUDE_PLUGIN_ROOT}/taxonomy.json` (temas con `aplica_a` y `objetivo`).
4. Lee `${user_config.datos_dir}/temas.json` para priorizar lo `en_progreso` con más errores y lo `pendiente`. Lo `dominado` se repasa poco.
5. Lee `${CLAUDE_PLUGIN_ROOT}/skills/evaluacion/formato-preguntas.md` y sigue ese formato.

## Reglas
- Separa siempre `certificacion` y `proyecto`, según la etiqueta `objetivo` del tema. Una sesión es de un objetivo; si la persona no lo dice, pregúntale.
- Las preguntas se basan en la documentación oficial vigente, no en el material de práctica de terceros. No copies preguntas de ese material.
- Si dudas de la respuesta correcta de una pregunta que generaste, no la hagas.
- No preguntes por fechas de soporte, retiro o ciclo de vida, y no las afirmes.
- Cada pregunta lleva su tema (`id`), su objetivo y su destino (o `general`).
- Una pregunta a la vez. Espera la respuesta, corrige y explica brevemente por qué.

## Cambio de nivel
Si la persona dice "pasa a avanzado" (o básico, o intermedio), cambia **solo** el campo `nivel_actual` de `${user_config.datos_dir}/config.json`, confírmalo y sigue en ese nivel. No toques nada más.

## Al terminar
1. Resumen: qué sabe, qué le falta y cómo reforzarlo. Para reforzar, nombra los temas (`id`) y sugiere consultarlos con la skill `contexto`. No leas los archivos internos de ese módulo.
2. Pasa los resultados a la skill `registro` con el formato de `${CLAUDE_PLUGIN_ROOT}/formato-registro.md`.

<!-- Estado: esqueleto de la Fase 1. formato-preguntas.md se crea en la Fase 2. -->
