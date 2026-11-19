# Procedimiento de ingesta (comando ingerir)

> Estado: borrador de la Fase 1. Se completa y se prueba en la Fase 3.

## Fuentes (solo lectura, nunca modificarlas)
La carpeta de fuentes la indica la persona al ejecutar el comando (argumento). Contiene PDFs, transcripciones de videos (.txt) y `LINKS DE YOUTUBE.txt`.

## Herramienta para PDFs (sin Python)
Los PDFs grandes se cortan con `herramientas-ingesta/cortar-pdf.js` (Node + pdf-lib), que está FUERA del plugin:
- `node cortar-pdf.js info "<pdf>"` muestra el número de páginas.
- `node cortar-pdf.js cortar "<pdf>" <desde> <hasta> "<salida.pdf>"` crea un recorte, máximo 10 páginas por recorte.
Los recortes se leen visualmente con la herramienta Read.

## Reglas
- Primero una PRUEBA con un solo capítulo, que la persona compara con el PDF. Se continúa solo si la confirma.
- Un capítulo por lote, nunca todo a la vez. Guardar el progreso en `libros/progreso.json` para poder pausar y reanudar.
- El código transcrito va en bloques con su lenguaje (raml, yaml, xml, json, dataweave, md...), sin resumir ni "corregir".
- Marcar con `[DUDA]` cualquier parte ilegible o transcripción incierta.

## Salida por libro, en `skills/contexto/libros/<libro>/`
- `capitulos/`: texto completo por capítulo o sección, en Markdown.
- `figuras/`: descripción en texto de cada diagrama o flujo (pasos y conexiones).
- `resumen.md`: resumen corto por capítulo, con su etiqueta de tema (id de taxonomy).
- Y el índice global `skills/contexto/libros/index.md`: ruta del fragmento + tema + 1 línea.

## Enlaces y videos
- Comparar `LINKS DE YOUTUBE.txt` con `enlaces-oficiales.md` y `videos.md`. Los enlaces nuevos se agregan **solo** si vienen de ese archivo, si los da la persona o si se encontraron navegando la documentación oficial (ver abajo). Nunca se inventan URLs.
- **Búsqueda en la doc oficial** (regla acordada con la persona el 2026-11-13): para verificar algo del material, se busca dentro de `docs.mulesoft.com`, partiendo de https://docs.mulesoft.com/general/ y siguiendo sus enlaces o su buscador. Una página encontrada así se puede agregar como `oficial` si se abrió y cargó de verdad, si responde la duda y si su URL empieza por `https://docs.mulesoft.com/`. Se anota como "encontrada en la doc oficial", con la fecha de consulta y la versión que muestra la página. Las páginas de otros sitios siguen la regla estricta.
- **Especificación de MCP** (regla acordada con la persona el 2026-11-14): para el libro de Agent Fabric y MCP, también vale como fuente oficial la especificación del protocolo en `https://modelcontextprotocol.io/specification/`. Se anota como "oficial (spec MCP)", con la versión de la spec y la fecha de consulta, aclarando que no es de MuleSoft.
- **Especificación de A2A** (regla acordada con la persona el 2026-11-15): también vale como fuente oficial `https://a2a-protocol.org/` (sitio del proyecto A2A, gobernado por la Linux Foundation; el repositorio github.com/a2aproject/A2A lo señala como su documentación oficial). Se anota como "oficial (spec A2A)", con versión y fecha. **Orden de prioridad para el libro de Agent Fabric**: 1) docs.mulesoft.com (cómo lo implementa MuleSoft), 2) la spec del protocolo (MCP o A2A), 3) el libro.
- Cada enlace nuevo se clasifica como `oficial` (docs.mulesoft.com, help.salesforce.com, trailhead) o `apoyo` (tutores, blogs). Si no está claro, se pregunta.
- Un video sin transcripción queda como `sin transcripción`: no se puede ver.

## Formato de nota de video (acordado con la persona el 2026-11-17; cambiado el 2026-11-18)
Las transcripciones ya son texto, así que no se copian. Se hace **un solo archivo por serie** en `videos/serie-N.md`, con un encabezado de la serie (tabla de videos y puntos que se cruzan con otras series) y **una sección por video** con todas las secciones dentro. Los videos de una serie se pueden ingerir de corrido y confirmar al final, por serie (decisión del 2026-11-18). El objetivo es dar contexto para las evaluaciones y apoyo real para desarrollar y estudiar. Secciones de cada video:
1. **Resumen por bloques**: tabla con rango `[mm:ss]`, bloque e idea principal.
2. **Conceptos clave**: definiciones en palabras propias, con el `id` del tema y la marca de tiempo.
3. **Para evaluar**: qué debería poder hacer o explicar quien domina el tema, y las confusiones típicas que señala el video. No son preguntas para copiar: las preguntas se basan en la doc oficial.
4. **Para desarrollar**: cómo se aplica en un proyecto real (pasos, decisiones, configuración, código si el video lo muestra).
5. **Para estudiar**: actividades prácticas y dónde profundizar (rutas a capítulos ya ingeridos y a la doc oficial).
6. **Nota de verificación**: qué se confirmó en la doc oficial, qué es opinión del autor y qué no se pudo verificar.
