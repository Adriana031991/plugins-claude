---
video: "MCD Level 1 Exam Prep – Session 4 | MuleSoft Certification with Digital Dee (2025)"
url: https://www.youtube.com/watch?v=nFNkLiilYK4
serie: 1
numero: 4
idioma: inglés
tipo: apoyo
fuente: "documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-4-tactiq-free-transcript-nFNkLiilYK4.txt"
duracion_aprox: "1:20"
temas: [dataweave, processing-records]
resumido: 2026-11-17
estado: borrador
---

<!-- Notas:
- Es una nota de estudio y contexto, no una transcripción. La transcripción completa (tactiq, automática, con errores como "data week", "round robbing", "uncomplete" o "itate") sigue en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. "Para evaluar" no son preguntas para copiar (regla de la skill evaluacion). Las preguntas de práctica que muestra Manny son de un examen de práctica de terceros: aquí solo se describe el patrón.
- Esta sesión la presentan dos alumnos (R.J. y Manny), no la instructora. Hay varias imprecisiones técnicas, sobre todo en la parte de DataWeave: ver la sección 6.
-->

# Serie 1 · Sesión 4: DataWeave y Batch, presentado por alumnos (Digital Dee, 2025)

Sesión distinta: dos alumnos presentan el objetivo que más les cuesta, como pidió la instructora en la sesión 3. R.J. explica lo básico de DataWeave con ejemplos en Studio y en DataWeave Playground. Manny (4 años como desarrollador) explica Batch Job y resuelve en Studio, con el depurador, preguntas de tipo examen sobre batch.

## 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:05] | DataWeave: por qué | Lenguaje de transformación entre formatos (JSON, XML, CSV, Java…); reemplazó a MEL. No hace falta memorizar todas las funciones. Cada expresión devuelve un valor nuevo, no modifica el original. |
| [00:05–00:09] | Anatomía del script | Encabezado (`%dw 2.0`, `output`), separador `---` y cuerpo con la expresión. Primero entender el tipo de dato: string, number, boolean, array, object, date/time, null. |
| [00:09–00:13] | Funciones principales | `map`, `mapObject`, `filter`, `reduce`, `groupBy`, `orderBy`, `++`, `default`. |
| [00:13–00:26] | Ejemplos | Concatenar nombre completo; `map` sobre un arreglo; `filter` por activos; `reduce` para sumar; `groupBy` por departamento (resultado: objeto con arreglos); `orderBy` por puntaje (resultado: arreglo); `default "Not provided"`. |
| [00:26–00:31] | Combinar y lambdas | `map` sobre usuarios y, dentro, `filter` sobre roles para "unir" dos listas; variables en el encabezado y funciones sin nombre `(u) -> ...`. |
| [00:31–00:34] | Orden de las funciones | La forma de los datos cambia en cada paso; hay que saber qué estructura sale de cada función antes de encadenar la siguiente (ver verificación sobre `orderBy` tras `groupBy`). |
| [00:34–00:44] | Formato y práctica | Formatear fechas y textos para personas o sistemas. Un alumno comenta que para Salesforce le funcionó `application/java` con `as Date`. Practicar en DataWeave Playground y volver siempre a la referencia. |
| [00:44–00:50] | Batch Job: configuración | Fases: proceso por registros en *batch steps* y *On Complete*. Max failed records (0 por defecto, -1 sin límite), scheduling strategy (ordered sequential / round robin), block size 100, max concurrency, target. |
| [00:48–00:50] | Batch step y aggregator | Accept expression y accept policy (NO_FAILURES, ONLY_FAILURES, ALL); Batch Aggregator por tamaño fijo o streaming, para operaciones masivas. On Complete = informe. |
| [00:50–00:57] | Pregunta tipo 1 | Payload [1..6], accept expression `payload mod 2 == 0`, multiplica por 10, aggregator de 2 → se registran [20, 40] y luego [60]. |
| [00:57–01:04] | Pregunta tipo 2 | Variable `counter = 1` antes del batch; dentro del step `counter + 10` y se guarda en otra variable; en On Complete `counter` sigue en 1 y la otra es null. |
| [01:04–01:09] | Pregunta tipo 3 | Variable creada en el step 1 y modificada en el step 2, logger dentro del step: el último log es el del último registro (13). |
| [01:09–01:16] | Pregunta tipo 4 y 5 | En On Complete el payload **no** son los registros transformados, es el **informe** (total, exitosos, fallidos). |
| [01:16–01:20] | Cierre | Practicar en Studio con el depurador; leer con cuidado el XML del examen (condición, tamaño, política). |

## 2. Conceptos clave

### DataWeave (`dataweave`)

- **Qué es** [00:02–00:05]: el lenguaje de expresiones y transformación de Mule 4 (reemplazó a MEL). Funcional: cada expresión **devuelve un valor nuevo**; no modifica el dato de entrada.
- **Estructura del script** [00:05–00:07]: encabezado con `%dw 2.0`, `output <tipo MIME>` (application/json, application/xml, application/csv, application/java, text/plain, application/dw para probar) y declaraciones (`var`, `fun`, `import`); separador `---`; cuerpo con **una** expresión que produce la salida.
- **Tipos** [00:08–00:09]: String, Number, Boolean, Array `[ ]`, Object `{ }`, Date/Time, Null. Saber qué tipo tienes es lo primero: la mayoría de los errores salen de aplicar una función al tipo equivocado.
- **`map`** [00:15–00:17]: recorre un **arreglo** y devuelve otro arreglo del mismo largo, transformando cada elemento (`$` = elemento, `$$` = índice, o con nombre: `(item, index) -> ...`).
- **`mapObject`** [00:10]: recorre un **objeto** clave por clave y devuelve otro objeto. Usar `map` sobre un objeto da error de tipo.
- **`filter`** [00:17–00:18]: devuelve solo los elementos que cumplen la condición ("un colador").
- **`reduce`** [00:18–00:20]: reduce un arreglo a **un** valor (suma, total, concatenación). `acc` es el **acumulador**, un parámetro de la lambda: `reduce ((item, acc = 0) -> acc + item)`.
- **`groupBy`** [00:20–00:23]: agrupa según un criterio; devuelve un **objeto** cuyas claves son los grupos y cuyos valores son arreglos ("cajas").
- **`orderBy`** [00:23–00:24]: ordena según un criterio (ascendente; para descendente se usa `-` en números o `[-1 to 0]` después); sobre un arreglo devuelve un **arreglo**.
- **`++`** [00:12, 00:14]: concatena strings, arreglos u objetos (por ejemplo `payload.firstName ++ " " ++ payload.lastName`).
- **`default`** [00:25–00:26]: valor de respaldo cuando algo es null o no existe: `payload.email default "Not provided"`.
- **Lambda** [00:29–00:31]: función anónima escrita en el lugar, por ejemplo `(u) -> u.name`. En el ejemplo, `var` en el encabezado guarda datos, y dentro del cuerpo `(u)` y `(r)` son los parámetros de cada lambda.
- **Combinar `map` + `filter`** [00:26–00:28]: para cruzar dos listas, recorrer la principal con `map` y, por cada elemento, `filter` en la otra por su ID.
- **La forma cambia en cada paso** [00:31–00:33]: antes de encadenar, preguntarse "¿qué sale de aquí: arreglo u objeto?".
- **Formato** [00:33–00:38]: fechas y números se formatean con `as String {format: "..."}` y se convierten con `as Date`, `as DateTime`, etc.

### Batch (`processing-records`)

- **Batch Job** [00:45–00:46]: procesa grandes volúmenes registro por registro, de forma **asíncrona** respecto del flujo que lo llama. Fases: *Load and Dispatch* (implícita, divide el payload en registros), *Process* (los batch steps) y *On Complete*.
- **Configuración del Batch Job** [00:46–00:48]:
  - **Max failed records**: 0 por defecto (se detiene al primer fallo); -1 = sin límite.
  - **Scheduling strategy**: ORDERED_SEQUENTIAL (por defecto; las instancias del job se ejecutan de a una, en orden) o ROUND_ROBIN (reparte entre instancias).
  - **Block size**: 100 por defecto; cuántos registros recibe cada hilo.
  - **Max concurrency**: cuántos bloques en paralelo.
  - **Job instance ID**: identificador de cada ejecución.
  - **Target**: guardar el resultado en una variable en lugar del payload.
- **Batch Step** [00:48–00:49]: procesa **un registro a la vez**. Filtros:
  - **Accept expression**: condición sobre el registro (`payload mod 2 == 0`).
  - **Accept policy**: NO_FAILURES (por defecto; solo registros sin fallos previos), ONLY_FAILURES (solo los que fallaron antes), ALL.
- **Batch Aggregator** [00:49–00:50]: dentro de un step, junta registros para trabajar en grupo (por ejemplo inserción masiva): **size** fijo (lo que sobra al final sale como un grupo más pequeño) o **streaming** (todos).
- **On Complete** [00:50]: corre al terminar; su payload es un **informe** del job (total de registros, exitosos, fallidos), **no** los registros procesados. Suele usarse para registrar o enviar un aviso.
- **Variables y batch** [00:57–01:09]: cada registro recibe **su propia copia** de las variables que existían antes del job; lo que se cambia o crea dentro de un step vale para **ese registro** (y pasa a sus steps siguientes), pero **no** vuelve a On Complete ni al flujo principal.

## 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`dataweave` (10%)**: leer un script y predecir la salida; elegir entre `map`, `mapObject`, `filter`, `reduce`, `groupBy`, `orderBy`; saber qué tipo devuelve cada una; usar `default`, `++` y `as` con formato; reconocer `$`, `$$` y lambdas con nombre.
- **`processing-records` (10%)**: dado el XML de un batch job (accept expression, accept policy, aggregator size), decir qué registros entran a cada step y qué imprime cada logger; decir el valor de una variable dentro del step y en On Complete; saber qué hay en el payload de On Complete; conocer los valores por defecto (block size 100, max failed records 0, ORDERED_SEQUENTIAL, NO_FAILURES).

Patrones de pregunta que muestra el video (para diseñar preguntas propias basadas en la doc oficial, no para copiar):
- **Filtrar + agregar**: arreglo de números, accept expression, transformación y aggregator de tamaño N; ¿qué grupos se registran? [00:50–00:57].
- **Variable antes del batch y en On Complete**: ¿qué valor tiene? [00:57–01:04].
- **Variable creada en un step y usada en el siguiente**: ¿qué registra el último logger? [01:04–01:09].
- **Logger en On Complete**: ¿payload o informe? [01:09–01:16].

Confusiones típicas que señala el video:
- Usar `map` sobre un objeto (o `mapObject` sobre un arreglo) [00:10–00:11].
- Confundir `groupBy` (objeto con grupos) con `orderBy` (arreglo ordenado) [00:23–00:24].
- Esperar el payload transformado en On Complete [01:16–01:17].
- Esperar que un cambio de variable dentro del batch se vea después [01:03].
- Responder sin leer bien la condición, el tamaño del aggregator o la política del step [00:56, 01:16].

## 4. Para desarrollar

Cómo se aplica en un proyecto real:

**DataWeave**
1. **Mira primero los metadatos** en Transform Message (entrada y salida) para saber si trabajas con arreglo, objeto o valor simple.
2. **Escribe por pasos** con `var` en el encabezado, en lugar de una sola expresión larga:
   ```dataweave
   %dw 2.0
   output application/json
   var activos = payload filter ((p) -> p.active)
   ---
   {
     total: activos reduce ((p, acc = 0) -> acc + p.score),
     porDepto: activos groupBy ((p) -> p.department)
   }
   ```
3. **Cruzar dos listas** [00:26–00:28]:
   ```dataweave
   payload.users map ((u) -> u ++ {
     role: (payload.roles filter ((r) -> r.userId == u.id))[0].name default "sin rol"
   })
   ```
4. **Campos opcionales con `default`** para que un dato faltante no rompa la respuesta [00:25].
5. **Fechas**: decide si la salida es para personas o para un sistema y usa el formato que pide el destino (`as String {format: "yyyy-MM-dd"}`). Para conectores Java como Salesforce, el alumno recomienda salida `application/java` con tipos `Date` en lugar de strings [00:38–00:39] (consejo práctico, no verificado).
6. **Prueba rápido** en DataWeave Playground o con la vista previa de Transform Message.

**Batch**
1. Úsalo para volúmenes grandes que no necesitan respuesta inmediata (importaciones, sincronizaciones); suele dispararse con un Scheduler.
2. Divide en steps por responsabilidad (validar, transformar, cargar) y usa accept expression / accept policy para que cada step trate solo lo que le toca (por ejemplo, un step final con ONLY_FAILURES para registrar errores).
3. Usa **Batch Aggregator** para operaciones masivas (bulk insert) en vez de una llamada por registro.
4. Define **max failed records** a conciencia: 0 detiene todo al primer error; -1 sigue siempre.
5. En **On Complete** registra o envía el informe (total, exitosos, fallidos); no esperes los datos ahí.
6. Si necesitas un resultado acumulado de todos los registros, no lo guardes en una variable del flujo: escríbelo en un destino (base de datos, Object Store) desde los steps.

## 5. Para estudiar

- Reproduce en Studio las cuatro preguntas tipo (con el depurador y loggers) y anota el valor de payload y variables en cada paso.
- Escribe en DataWeave Playground un ejemplo de cada función principal y cambia el orden `groupBy` / `orderBy` para ver qué tipo sale en cada caso.
- Tarea de R.J.: "no memorizar todo, sino entender tipos y volver a la referencia".
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` (estructura, `default`, `reduce` con `acc`, `var`, módulos).
  - `libros/anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` §7.3 (batch jobs, scheduling, procesos largos).
  - Nota anterior: `videos/serie-1/s1-03-despliegue-y-gestion.md` (variables y scopes, sección de verificación).
  - Doc oficial: referencia de funciones de DataWeave (dw::Core) y Batch Job (ver `enlaces-oficiales.md`).

## 6. Nota de verificación

- **`orderBy` después de `groupBy`** [00:32–00:33]: R.J. dice que da error porque `orderBy` necesita un arreglo. Por lo que conozco de DataWeave 2, `orderBy` también acepta **objetos** (los ordena por clave o valor), así que no debería fallar; lo que cambia es el resultado (un objeto con los grupos ordenados, no cada grupo ordenado por dentro). La idea de fondo (saber qué forma sale de cada paso) es correcta. **Verificar en dw::Core antes de usarlo en una pregunta.**
- **`acc` no es una función** [00:19]: es el parámetro acumulador de la lambda de `reduce`. Coincide con cap04 del libro.
- **"Lambda" en el encabezado** [00:28–00:31]: la explicación mezcla conceptos. `var` declara variables; las lambdas son las funciones anónimas `(u) -> ...` del cuerpo. La instructora confirma la idea general, no el detalle.
- **`default` es un operador**, no una función; funciona igual.
- **"DataWeave es el único lenguaje que hace esto"** y su historia (equipo en 2015-2016): opiniones o datos aproximados. DataWeave 1.0 llegó en Mule 3.7; en Mule 4 es el lenguaje de expresiones por defecto (2.0).
- **Batch**: los valores por defecto (block size 100, max failed records 0, ORDERED_SEQUENTIAL, NO_FAILURES) y que On Complete recibe un informe coinciden con lo que conozco de la doc; no los revisé hoy en docs.mulesoft.com.
- **Variables en batch**: lo que se ve en el depurador (counter 1 en On Complete, la otra variable null) coincide con el comportamiento de Mule 4. Esto **no** confirma lo dicho en la sesión 3 sobre For Each, que sigue pendiente de verificar.
- **Orden de los logs en la pregunta 3**: el último log es 13 porque los 3 registros caben en un solo bloque y se procesan en orden; con varios bloques en paralelo el orden de los logs no está garantizado.
- **Payload después del Batch Job en el flujo principal**: no se trató; el job es asíncrono y el flujo sigue sin esperar. Revisar en la doc qué devuelve.
- **Salesforce con `application/java` y `as Date`**: consejo práctico de un alumno, no verificado.
- Las preguntas que muestra Manny vienen de un examen de práctica; no se copian aquí.
- Los porcentajes de la sección 3 vienen de `taxonomy.json`.
