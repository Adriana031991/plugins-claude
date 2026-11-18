# Contrato: formato de la carpeta `.scrum/`

Cada proyecto guarda su seguimiento en `.scrum/`, en la raíz del proyecto. Todo es Markdown para que la persona lo lea y lo edite a mano sin herramientas. El script del inicio de sesión (`scripts/estado-sesion.js`) lee estos archivos: **respeta los nombres de los campos al pie de la letra** (`- Estado:`, `- Sprint:`, etc.).

Regla de oro: **cada dato vive en un solo archivo.** El estado de una historia solo está en `backlog.md`; el sprint guarda lo que se comprometió (una foto), no el estado actual.

```
.scrum/
  proyecto.md            visión, hitos, definición de hecho, acuerdos
  backlog.md             todas las historias; única fuente de su estado
  sprints/sprint-01.md   un archivo por sprint (dos dígitos)
  historial.md           una fila por sprint cerrado; solo se agregan filas
```

Recomienda a la persona versionar `.scrum/` con git: es la memoria del proyecto.

## `proyecto.md`
```markdown
# <Nombre del proyecto>
- Clave: PRY
- Inicio: AAAA-MM-DD
- Duración del sprint: 10
- Capacidad por sprint: <bloques de 30 min | por definir>
- Fecha objetivo: AAAA-MM-DD | sin fecha

## Visión
<2 o 3 frases: para quién, qué problema resuelve, cómo se sabe que funcionó>

## Hitos
- [ ] <hito> — AAAA-MM-DD

## Definición de hecho
- [ ] <criterio que toda historia debe cumplir para contar como hecha>

## Acuerdos de trabajo
- Límite de trabajo en curso: 2
- Día de daily: todos los días hábiles
```
- `Clave`: 2 a 5 letras mayúsculas; es el prefijo de los ID (`PRY-001`).
- `Duración del sprint`: en **días hábiles** (lunes a viernes).

## `backlog.md`
Las historias van **ordenadas por prioridad**: la primera es la más importante. Las que pasan a `hecha` o `descartada` se mueven a la sección `## Terminadas` al cerrar el sprint.

```markdown
# Backlog

### PRY-007 · <título corto>
- Tipo: historia | tarea | error | investigación
- Estado: nueva | lista | en-curso | bloqueada | hecha | descartada
- Puntos: 1 | 2 | 3 | 5 | 8 | 13 | ?
- Sprint: 2 | —
- Épica: <nombre> | —
- Creada: AAAA-MM-DD
- Cerrada: AAAA-MM-DD | —
- Historia: Como <rol> quiero <qué> para <para qué>.
- Criterios de aceptación:
  - [ ] <comprobable, sí o no>
- Notas: <contexto, decisiones, motivo del bloqueo>
- Pruebas: (opcional; lo llena `/construir`)
  - [x] <nombre-prueba> — verde
  - [ ] <nombre-prueba>
  - [ ] manual: <qué se verifica a mano>

## Terminadas
<mismo formato>
```
- `lista` = cumple la **definición de listo**: tiene historia, criterios de aceptación y puntos (no `?`).
- `bloqueada` exige un impedimento abierto en el sprint activo y el motivo en `Notas`.
- Los ID nunca se reutilizan. El siguiente ID es el mayor existente + 1.

## `sprints/sprint-NN.md`
```markdown
# Sprint 2
- Estado: planeado | activo | cerrado
- Inicio: AAAA-MM-DD
- Fin: AAAA-MM-DD
- Objetivo: <una frase con un resultado, no una lista de tareas>
- Compromiso inicial: 13 puntos — PRY-004 (5), PRY-005 (3), PRY-007 (5)

## Cambios de alcance
- AAAA-MM-DD: + PRY-010 (3) — <motivo>
- AAAA-MM-DD: − PRY-005 (3) — <motivo>

## Dailies
### AAAA-MM-DD
- Hice: <...>
- Haré: <...>
- Bloqueos: ninguno | <...>

## Impedimentos
| # | Desde | Qué bloquea | Historia | Acción siguiente | Estado |
|---|---|---|---|---|---|
| 1 | AAAA-MM-DD | <...> | PRY-004 | <quién hace qué> | abierto |

## Cierre
### Revisión
- Completado: <X> de <Y> puntos
- Objetivo cumplido: sí | parcial | no
- Evidencia: <demo, enlace, commit, captura>
- Vuelve al backlog: <ID y motivo>

### Retrospectiva
- Qué funcionó: <...>
- Qué no funcionó: <...>
- Acciones:
  - [ ] <máximo 2, concretas y con dueño>
```
- Solo un sprint puede estar `activo` a la vez.
- `Compromiso inicial` no se edita después de la planificación; los cambios van en `Cambios de alcance`.
- Estados de impedimento: `abierto` | `resuelto AAAA-MM-DD`.

## `historial.md`
```markdown
# Historial de sprints
| Sprint | Inicio | Fin | Comprometido | Completado | Objetivo | Nota |
|---|---|---|---|---|---|---|
| 1 | 2026-11-02 | 2026-11-13 | 13 | 10 | parcial | <una línea> |
```
Velocidad = promedio de `Completado` de los últimos 3 sprints.

## Bloques de trabajo: `${user_config.portafolio_dir}/bloques.md`
El tiempo de la persona es uno solo para todos los proyectos, por eso vive en el portafolio. La unidad es el **bloque de 30 minutos** de concentración (celular lejos). Los descansos entre bloques no se miden: pueden durar lo que haga falta.

Lo escribe el cronómetro `scripts/bloque.ps1` (una fila por bloque, solo agrega) o Claude cuando la persona lo cuenta en la daily:
```markdown
# Bloques de trabajo
| Fecha | Inicio | Fin | Minutos | Proyecto | En qué | Resultado |
|---|---|---|---|---|---|---|
| 2026-11-14 | 09:10 | 09:40 | 30 | Demo tienda | PRY-004 | completo |
| 2026-11-14 | 14:05 | 14:17 | 12 | Demo tienda | PRY-004 | cortado |
```
- `Resultado`: `completo` (llegó a 30) o `cortado` (interrupción).
- `Proyecto` usa el nombre de la columna `Proyecto` de `proyectos.md`.

## Portafolio: `${user_config.portafolio_dir}/proyectos.md`
Vive fuera de los proyectos. Una fila por proyecto con seguimiento:
```markdown
# Mis proyectos
| Proyecto | Clave | Ruta | Registrado | Estado |
|---|---|---|---|---|
| <nombre> | PRY | C:/ruta/al/proyecto | AAAA-MM-DD | activo | pausado | terminado |
```
