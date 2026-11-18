---
description: Registra el resultado de cada evaluación MuleSoft y muestra el avance por tema y por destino de despliegue. Úsala después de una evaluación, o cuando la persona pida ver su avance o progreso.
---

# Módulo 3: registro de avance

El formato de los archivos está en `${CLAUDE_PLUGIN_ROOT}/formato-registro.md`. Síguelo exactamente.
Datos: `${user_config.datos_dir}/` (fuera del plugin).

## Registrar una evaluación
1. Agrega una línea a `${user_config.datos_dir}/historial.jsonl`: una por objetivo evaluado. Nunca borres ni edites líneas anteriores.
2. Actualiza `${user_config.datos_dir}/temas.json`: suma aciertos y errores por tema y por destino, pon `ultima_vez` y recalcula `estado` con las reglas del formato.
3. Valida que los dos archivos sigan siendo JSON válido. Si algo falla, no sobrescribas: avisa a la persona.

## Mostrar el avance (comando avance)
1. Lee `temas.json` y `${CLAUDE_PLUGIN_ROOT}/taxonomy.json` (para los nombres).
2. Muestra una tabla por tema: estado, aciertos/errores y % de acierto, separada por objetivo (certificación / proyecto).
3. Muestra una tabla por destino de despliegue (cloudhub1, cloudhub2, rtf, onpremise).
4. Cierra con los 3 temas más débiles.

No lees archivos de otros módulos, solo los archivos de datos y la taxonomía.
