# Contrato compartido: formato del registro

Los tres módulos (`contexto`, `evaluacion`, `registro`) **solo** comparten dos cosas:
1. `${CLAUDE_PLUGIN_ROOT}/taxonomy.json`: la lista de temas.
2. Este formato: cómo son los archivos de la carpeta de datos.

Ningún módulo lee archivos internos de otro módulo (lo que está dentro de `skills/<otro>/`).

## Carpeta de datos
Ruta: el valor `datos_dir` que se configura al instalar el plugin (`userConfig`). Vive **fuera** del plugin, para que el avance no se pierda al actualizarlo.

| Archivo | Quién escribe | Quién lee |
|---|---|---|
| `config.json` | evaluacion (solo `nivel_actual`); la persona | todos |
| `historial.jsonl` | registro (solo agrega líneas, nunca borra ni edita) | registro |
| `temas.json` | registro | evaluacion, registro |

## `config.json`
```json
{
  "entorno": {
    "anypoint_studio": "...", "mule_runtime": "...", "acb_extension_pack": "...",
    "versiones_verificadas": false
  },
  "deployment_targets": ["cloudhub1", "cloudhub2", "rtf", "onpremise"],
  "nivel_actual": "basico | intermedio | avanzado",
  "objetivos": ["certificacion", "proyecto"],
  "docs_last_reviewed": "AAAA-MM-DD"
}
```

## `historial.jsonl`
Una evaluación por línea, en JSON de una sola línea:
```json
{"fecha":"2026-11-13T15:04:00","nivel":"intermedio","objetivo":"certificacion","destino":"cloudhub2","temas":["<id>"],"total":10,"aciertos":7,"errores":3,"detalle":[{"tema":"<id>","tipo":"opcion-multiple","correcta":true}]}
```
- `objetivo`: `certificacion` o `proyecto`. Si la sesión mezcló los dos, se escriben dos líneas, una por objetivo.
- `destino`: uno de `deployment_targets`, o `"general"` si la pregunta no depende del destino.
- `temas` y `detalle[].tema` usan los `id` de `taxonomy.json`.

## `temas.json`
```json
{
  "actualizado": "AAAA-MM-DDTHH:MM:SS",
  "temas": {
    "<id>": {
      "estado": "pendiente | en_progreso | dominado",
      "aciertos": 0, "errores": 0, "ultima_vez": null,
      "por_destino": { "cloudhub2": { "aciertos": 0, "errores": 0 } }
    }
  }
}
```
Reglas de estado (las aplica `registro`):
- `pendiente`: nunca evaluado.
- `dominado`: al menos 5 respuestas en total, al menos 80 % de aciertos y la última evaluación del tema sin errores.
- `en_progreso`: cualquier otro caso.
