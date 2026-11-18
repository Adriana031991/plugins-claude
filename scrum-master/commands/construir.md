---
description: Construye una historia en ciclos rojo-verde con MUnit: Claude escribe la prueba, tú el flujo en Studio
argument-hint: "<ID de la historia, ej. PRY-004>  |  sigue"
---

Aplica la skill `scrum-master`, sección "Construir una historia (rojo-verde con MUnit)". Historia: $ARGUMENTS

- Si el argumento está vacío, muestra las historias `lista` o `en-curso` del sprint activo y pregunta cuál.
- Si es `sigue`, retoma la historia `en-curso` con pruebas pendientes en `- Pruebas:`.
- Un ciclo por vez. Al terminar el ciclo, detente y espera.
