---
description: Ingiere libros PDF, transcripciones y enlaces de MuleSoft al contexto del plugin, por lotes de capítulo, con pausa y reanudación.
argument-hint: "[carpeta-fuentes] [libro] [capitulo|prueba|reanudar]"
---

Usa la skill `contexto` del plugin mulesoft-coach. Sigue el procedimiento de `${CLAUDE_PLUGIN_ROOT}/skills/contexto/ingesta.md`.

Argumentos: $ARGUMENTS

Si no hay argumentos, muestra el estado de `${CLAUDE_PLUGIN_ROOT}/skills/contexto/libros/progreso.json` (si existe) y pregunta qué libro y qué capítulo procesar. Procesa un solo capítulo por ejecución y pide confirmación antes del siguiente.
