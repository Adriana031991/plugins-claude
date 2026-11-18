# Formato de preguntas

> Estado: confirmado por la persona el 2026-11-13: preguntas en inglés, niveles como se proponen abajo, y empezar en intermedio.

## Fuentes de este formato
- **Formato oficial:** guía oficial del examen, "Salesforce Certified MuleSoft Developer Exam Guide" (help.salesforce.com, artículo 005298959), consultada el 2026-11-13. Dice: **60 preguntas de opción múltiple**, más hasta 5 sin puntaje, en **120 minutos**, con **70 %** para aprobar. Indica que las preguntas se alinean al release "Spring '24". La guía puede cambiar: revísala antes de presentar el examen.
- **Estilo observado:** PDF de práctica de terceros "MCD-Level 1" (CertQueen, V11.02), de 179 páginas y unas 226 preguntas. Revisé una muestra de 46 páginas (1–6, 40–49, 85–94, 130–139 y 171–180), con unas 50 preguntas. Ese PDF solo sirve para el **estilo**. No se copian sus preguntas ni se confía en sus respuestas: tiene errores, enunciados que no coinciden con su imagen y documentación antigua (Studio 7.5, Mule 4.1–4.3).

## Lo observado

| Aspecto | Observación |
|---|---|
| Número de opciones | Siempre 4: A, B, C, D. |
| Respuestas correctas | En la muestra, siempre **una sola**. No vi ninguna pregunta de selección múltiple. |
| Idioma | Inglés. |
| Longitud del enunciado | De 1 a 4 frases. Cuando hay imagen, empieza con "Refer to the exhibit(s)". |
| Pregunta final típica | "What is the payload / response / logged message…?", "What is the correct DataWeave expression…?", "What is the next step to fix this error?" |
| Opciones con imagen o código | Cuando las opciones son bloques de código o imágenes, el texto solo dice "Option A … Option D". |

### Tipos de pregunta (por frecuencia en la muestra)
1. **Predecir el resultado de un flujo (~40 %).** Muestra el diagrama de Studio y casi siempre su XML. Se pregunta qué payload, respuesta HTTP, mensaje del Logger o valores (payload, vars, attributes) hay en un punto dado. Temas frecuentes: Scatter-Gather, Choice, For Each, Flow Reference vs. HTTP Request, on-error-propagate vs. on-error-continue y Try.
2. **DataWeave de entrada a salida (~15 %).** Muestra la entrada (XML, JSON o arreglo) y la salida esperada (CSV, XML o JSON), y se elige el script correcto. Los distractores difieren en un detalle: `@atributo` vs. `atributo`, `.*item` vs. `.item`, envolver el map en `{( … )}`, la palabra clave `fun`, `as String {format: …}` o `lookup(…)`.
3. **Concepto directo (~20 %).** Pregunta corta con 4 opciones cortas. Ejemplos de temas: WSDL vs. RAML, qué hace la columna watermark, API-led, red de aplicaciones, autodiscovery.
4. **Elegir configuración (~10 %).** Opciones de exportación de Studio, archivo de propiedades YAML y `${…}`, `configuration-properties`, error handler global, watermark.
5. **Diagnosticar un error (~10 %).** Muestra un mensaje de error o un código HTTP (415, `WSC:BAD_REQUEST`) y se pregunta cómo arreglarlo.
6. **Depurador (~5 %).** Un breakpoint en el flujo, y se pregunta qué payload muestra.

### Formatos de código que aparecen
XML de Mule (flows, `error-handler`, `validation:*`, `db:*`, `file:*`, `http:*`), DataWeave 2.0, RAML 1.0, YAML de propiedades, JSON, CSV y mensajes de error de Mule.

### Distractores típicos (útiles para escribir opciones incorrectas creíbles)
- Sintaxis de Mule 3: `flowVars`, `message.inboundProperties`, filtros.
- Lugar equivocado del dato: `attributes` vs. `vars` vs. `payload`.
- Casi la misma sintaxis: `${…}` vs. `#[…]`, `.` vs. `:`, mayúsculas en `String`.
- Comportamiento confundido: propagate vs. continue; secuencial vs. paralelo; en Choice, se ejecuta la primera ruta verdadera, no todas.

## Reglas para generar preguntas

### Certificación (`objetivo: certificacion`)
- Siempre 4 opciones con **una sola** correcta, tal como en el examen.
- Enunciado y opciones en inglés, como en el examen. La explicación de la corrección va en español, salvo que la persona pida inglés.
- Mezcla de tipos parecida a la de arriba, ponderada por el peso oficial de cada sección (`peso` en taxonomy.json).
- Las imágenes ("exhibit") se reemplazan por texto: un bloque `xml` con el flujo y, si ayuda, una descripción del diagrama paso a paso.
- Cada pregunta se valida contra la documentación oficial vigente. Si no puedo confirmar la respuesta, la pregunta no se hace.
- Meta de tiempo como referencia: unos 2 minutos por pregunta (120 min / 60).

### Proyecto (`objetivo: proyecto`)
- Más abiertas: mini-ejercicios ("escribe el DataWeave que…", "corrige este flujo", "¿qué cambia si se despliega en RTF o en CloudHub 2.0?").
- Pueden tener varias respuestas válidas. Se corrigen con criterios explícitos.
- Se indica el destino de despliegue cuando aplica.

### Niveles (confirmados)
| Nivel | Qué se pregunta |
|---|---|
| basico | Concepto directo y sintaxis aislada. |
| intermedio | Nivel del examen: predecir resultados con flujo y XML, DataWeave de entrada a salida, diagnóstico de errores. |
| avanzado | Varios conceptos combinados: errores anidados más Try más error mapping, DataWeave con módulos y funciones, mini-ejercicios de escritura de código. |

### Plantilla de una pregunta
````markdown
**[tema: <id>] [objetivo: certificacion] [destino: general] [nivel: intermedio]**

Refer to the exhibit. <contexto en 1–3 frases>

```xml
<flow name="..."> ... </flow>
```

<pregunta>?

A. ...
B. ...
C. ...
D. ...
````
La respuesta y la explicación se muestran **después** de que la persona responda, con la referencia a la documentación oficial (o "verificar en docs.mulesoft.com: <tema>" si no hay una URL confirmada).
