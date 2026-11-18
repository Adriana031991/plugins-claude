---
name: barrido-de-decision
description: Usar cuando se cambia, renombra o descarta una decisión, un término, un campo o una regla que puede estar repetida en varios documentos (diseño, specs, contratos, glosario, diagramas). Busca todos los rastros, los clasifica y entrega la lista de lo que hay que corregir antes de seguir. Úsala también cuando la persona diga "barre", "busca en todos los archivos" o "no quiero cabos sueltos".
---

# Barrido de decisión

Una decisión casi nunca vive en un solo archivo. Al cambiarla, quedan restos en otros documentos que la contradicen. Esta skill evita seguir trabajando con esos restos.

## Cuándo aplicarla
- Se renombra un término o campo (`hora` → `fecha_hora`).
- Se cambia una regla (ya no hay saldo a favor).
- Se descarta una pieza (un componente que se quita del mapa).
- Se agrega algo que obliga a ajustar otros documentos.

Si la persona no lo pidió pero detectas que acaba de cambiar una decisión, **avísale** y ofrece el barrido. No lo hagas en silencio.

## Pasos

### 1. Formular el cambio en una línea
Escribe: **antes → después**, y el motivo. Si no está claro, pregunta. Ejemplo: "`hora` → `fecha_hora`, para no confundir con la hora del horario".

### 2. Sacar los términos de búsqueda
No busques solo el término literal. Lista tres grupos:
- **Literales**: el término viejo, sus plurales, con y sin tildes, mayúsculas, `snake_case`/`camelCase`.
- **Sinónimos**: cómo se le dice en prosa ("hora de entrega", "la dueña").
- **Consecuencias**: lo que la decisión arrastra. Ejemplo: al quitar el saldo a favor, también caían "otra tienda" y "carrito nuevo". Pregúntate: *¿qué otras frases solo tenían sentido por la decisión vieja?*

### 3. Descubrir dónde buscar
1. Lee el `CLAUDE.md` del proyecto: si lista los archivos o su "fuente de verdad", úsalo.
2. Si no, busca en todo el proyecto, excluyendo `.git`, `node_modules`, carpetas de salida y binarios.
3. Incluye todos los formatos: `.md`, `.html` (diagramas), `.raml`, `.json`, `.yaml`, código.

### 4. Buscar y clasificar
Usa Grep. Cada resultado va a una de tres cajas:

| Caja | Significado |
|---|---|
| **Corregir** | Contradice la decisión nueva |
| **Revisar** | Puede ser un caso distinto; hay que leer el contexto |
| **Dejar** | Mismo término con otro significado, o nota histórica (bitácora) |

Ojo con los falsos positivos: un mismo término puede tener dos sentidos en el proyecto (ejemplo: "dueña" como quien recibe avisos vs. "dueña de la base de datos"). En la caja **Revisar**, explica qué sentido parece tener.

La **bitácora o historial** normalmente no se reescribe: es un registro de lo que pasó. Márcalo "Dejar" salvo que la persona diga otra cosa.

### 5. Entregar el reporte
Una tabla por archivo, con enlace `ruta:línea`:

```
Cambio: hora → fecha_hora

CORREGIR (12)
- datos.md:45        "hora" en tipo Cambio
- endpoints.md:210   ...
REVISAR (2)
- mapa.md:88         "hora" del horario: ¿es el mismo campo?
DEJAR (3)
- CLAUDE.md:140      bitácora (histórico)
```

Termina con el conteo y pregunta cómo seguir.

### 6. Aplicar solo si la persona aprueba
- Por defecto **solo muestras**. No edites nada sin su visto bueno.
- Con aprobación, edita archivo por archivo y di qué cambiaste.
- Los casos **Revisar** se deciden uno por uno con la persona.

### 7. Verificar
Después de editar, repite la búsqueda. Deben quedar cero resultados en **Corregir**. Reporta lo que quede y por qué.

Si el proyecto tiene dibujos o archivos generados (HTML de diagramas, tablas resumen), avisa que hay que revisarlos o regenerarlos: son los que más se olvidan.

## Reglas
- No sigas con trabajo nuevo hasta cerrar el barrido, salvo que la persona lo pida.
- Si una decisión arrastra cambios en otros archivos, dilo **antes** de proponerla, no después.
- Sé específico: nunca digas "revisé todo" sin decir qué archivos y qué términos buscaste.
