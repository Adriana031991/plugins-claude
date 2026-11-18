---
description: Valida contratos RAML 1.0 con AMF (el analizador de MuleSoft) y reporta los errores
argument-hint: [archivo o carpeta con RAML]  (por defecto, busca una carpeta raml/ en el proyecto)
allowed-tools: Bash(node:*), Bash(npm:*), Glob
---

Valida los contratos RAML con el script del plugin.

1. **Ruta a validar:** `$ARGUMENTS`. Si está vacía, busca una carpeta `raml/` (por ejemplo `contratos/raml`) con Glob; si hay varias o ninguna, pregunta cuál.
2. **Primera vez:** si no existe `${CLAUDE_PLUGIN_ROOT}/scripts/node_modules`, instala la dependencia (una sola vez, dentro de la carpeta del plugin, nunca en el proyecto del usuario):
   `npm install --prefix "${CLAUDE_PLUGIN_ROOT}/scripts"`
3. **Ejecuta:**
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/validar.js" <ruta>`
4. **Reporta** en español: cuántos archivos se revisaron, cuáles tienen errores y, por cada error, el archivo, la línea y el mensaje. Si todo está bien, dilo en una línea.
5. **No corrijas los archivos** salvo que el usuario lo pida. Si pide corregir, explica primero la causa de cada error.

Notas:
- Valida también fragments y librerías (`.raml` que no son una API completa).
- Con la ruta de un solo archivo, valida solo ese archivo y lo que importa.
- Si el script falla con código 2, es un problema de uso (ruta inexistente, dependencia sin instalar), no del RAML.
