---
serie: 2
titulo: "MuleSoft: Curso Básico (Matías Ledesma)"
idioma: español (videos 1, 2 y 8 con transcripción traducida al inglés)
tipo: apoyo
videos: 8
fuente: "documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/"
temas: [application-networks, herramientas-desarrollo, structuring-apps, build-dependencias, mule-events, debugging, dataweave, routing, processing-records, designing-apis, api-implementation, connectors, propiedades-seguras, deploying-managing]
resumido: 2026-11-18
estado: confirmado
confirmados: [1, 2, 3, 4, 5, 6, 7, 8]
---

<!-- Notas:
- Un solo archivo para toda la serie (decisión del 2026-11-18). Cada video tiene las mismas 6 secciones: resumen por bloques, conceptos clave, para evaluar, para desarrollar, para estudiar y nota de verificación.
- Es una nota de estudio y contexto, no una transcripción. Las transcripciones completas (tactiq, automáticas; las de los videos 1, 2 y 8 vienen traducidas al inglés) siguen en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto de cada video.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. "Para evaluar" no son preguntas para copiar: indica qué conviene evaluar; las preguntas se basan en la doc oficial (regla de la skill evaluacion).
- El número de video en la serie no coincide con el del título ("Curso Básico #N") porque el video de DataWeave (3) no lleva número de curso.
-->

# Serie 2: MuleSoft Curso Básico (Matías Ledesma)

Curso en español para principiantes, de Matías Ledesma (Buenos Aires; certificado MuleSoft Level 2, mentor de la comunidad). Usa Anypoint Studio 7.26 y Mule 4.11/4.12, y practica con la API pública DummyJSON. Según el autor, el curso básico más el intermedio cubren el examen Level 1.

| Video | Título del curso | Tema | Pesos del examen que cubre |
|---|---|---|---|
| 1 | #1 | Introducción a MuleSoft, Anypoint Platform, API-led | application-networks |
| 2 | #2 | Instalación de Studio, Java, Maven; estructura del proyecto; flujo vs. subflow; Mule message; Code Builder | structuring-apps, mule-events |
| 3 | (DataWeave desde cero) | DataWeave: tipos, operadores, selectores, variables, `if`/`match`, funciones, `map`/`filter`/`update` | dataweave |
| 4 | #3 | Set Payload, Set Variable, Remove Variable, Transform Message | mule-events, dataweave |
| 5 | #4 | Choice, Round Robin, For Each, Parallel For Each | routing, processing-records |
| 6 | #5 | APIs REST, Postman, HTTP Request y configuración global | designing-apis, connectors, mule-events |
| 7 | #6 | Properties por entorno (YAML / `.properties`, `${}`, `p()`, `-Denv`) | structuring-apps |
| 8 | #7 | HTTP Listener, RAML, APIkit e implementación | designing-apis, api-implementation, connectors |

Puntos que se cruzan con la serie 1: estructura del proyecto y `global.xml` (serie 1, sesión 2 / videos 7 y 8), flujos que genera APIkit (serie 1, sesiones 2 y 5 / video 8), routers (serie 1, sesión 6 / video 5), variables en For Each (resuelto en la doc oficial: sí siguen disponibles después del scope; en Parallel For Each no; ver video 5).

---

## Serie 2 · Video 1: Introducción a MuleSoft (Curso Básico #1)

- **Video:** [Introducción a Mulesoft - Mulesoft: Curso Básico #1](https://www.youtube.com/watch?v=IrQckN51j8Q)
- **Duración:** 0:16 · **Temas:** application-networks, herramientas-desarrollo
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-1-tactiq-free-transcript-IrQckN51j8Q.txt`

Presentación del curso y del ecosistema MuleSoft. La transcripción disponible está traducida al inglés; el video original es en español.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:01] | Presentación | Matías Ledesma, Buenos Aires, certificado MuleSoft Level 2, mentor de la comunidad (Top Mentors 2026). Comunidad de Slack con canal de mentorías. |
| [00:01–00:06] | Plan de cursos | Básico + intermedio = temas del examen Level 1. Avanzado = Level 2 (conectores, políticas, API Manager, pruebas unitarias, CI/CD). Cursos complementarios: Java para conectores, Rust para políticas de Omni Gateway, agentes (MCP, A2A, gobierno de agentes). |
| [00:06–00:08] | Qué es MuleSoft | Empresa de integración (2006), comprada por Salesforce (2018). Anypoint Platform es un iPaaS: Design Center, Exchange, API Manager, Runtime Manager, monitoreo, automatizaciones, IDP, agentes. |
| [00:08–00:10] | Mule 4 y casos de uso | Mule 4 sobre Java, desarrollo *low-code* en Studio o Code Builder; el código es sobre todo DataWeave. Casos: integrar SaaS (Salesforce, Workday, SAP), orquestar agentes, automatización, gestión de APIs. |
| [00:10–00:12] | API-led connectivity | Tres capas: Experience (expuesta a consumidores), Process (lógica de negocio, orquestación) y System (conecta con sistemas externos). Comparación con controllers / services / repositories. |
| [00:12–00:15] | No siempre tres capas | Es común empezar con monolitos; luego separar System APIs por sistema; la capa Process aparece cuando hay que orquestar varios sistemas alrededor de un objeto de negocio. |

### 2. Conceptos clave

- **Anypoint Platform** (`application-networks`) [00:06–00:08]: iPaaS (*Integration Platform as a Service*) de MuleSoft con las herramientas de todo el ciclo de vida de la API:
  - **Design Center**: diseñar APIs y fragmentos reutilizables (tipos de datos, esquemas de seguridad).
  - **Exchange**: repositorio privado de assets de la organización y de MuleSoft (APIs, conectores, MCP, agentes, plantillas, bibliotecas de DataWeave).
  - **API Manager**: gobierno y políticas de APIs.
  - **Runtime Manager**: despliegue en la nube (CloudHub) u on-premise.
  - Monitoreo, automatizaciones, IDP (lectura inteligente de documentos) y agentes.
- **Mule 4** (`herramientas-desarrollo`) [00:07–00:08]: runtime basado en Java; las apps se arman con componentes (*low-code*) en **Anypoint Studio** o **Anypoint Code Builder**, y la lógica de datos se escribe en **DataWeave** (lenguaje funcional).
- **API-led connectivity** [00:10–00:12]: arquitectura de APIs en tres capas:
  - **Experience**: lo que ven los consumidores (una API para móvil, otra para web).
  - **Process**: lógica de negocio y orquestación, organizada por objeto de negocio (estado de pedido, clientes, historial).
  - **System**: una API por sistema externo (Salesforce, base de datos, SAP, APIs de terceros).
- **Monolito** [00:12–00:13]: una sola app que hace todo (recibe, procesa, accede a la base). Válido cuando la demanda es baja.
- **Crecimiento por capas** [00:13–00:15]: primero se separan las System APIs (reutilizables por cualquier API nueva); después, cuando la orquestación pesa, aparecen las Process APIs.
- **Portales** [00:09–00:10]: el portal público de APIs y **Experience Hub** (más privado). Este último no entra en el curso.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`application-networks`, peso 7%):
- Nombrar los productos principales de Anypoint Platform y para qué sirve cada uno.
- Decir a qué capa pertenece una API según lo que hace (exponer a un canal, orquestar, conectar con un sistema).
- Explicar por qué una System API se reutiliza y cuándo tiene sentido agregar una Process API.

Confusiones típicas que señala el video:
- Creer que API-led es obligatorio siempre; depende de las necesidades de la organización [00:12].
- Mezclar "Experience" con "lo que está en la nube": todo lo que está debajo de Experience es interno [00:11].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Empieza simple** [00:12–00:13]: si hay un solo consumidor y un solo sistema, una app puede bastar.
2. **Separa por sistema cuando aparezca el segundo consumidor** [00:13–00:14]: una System API por sistema externo, con sus credenciales y su formato.
3. **Agrega Process cuando haya orquestación real** [00:14–00:15]: varias fuentes combinadas alrededor de un objeto de negocio.
4. **Antes de construir, busca en Exchange** lo que la organización ya tiene [00:07].

### 5. Para estudiar

- Dibuja la arquitectura de un caso que conozcas en las tres capas, y luego una versión más simple (monolito o dos capas) y explica cuándo usarías cada una.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` (productos de la plataforma, API-led).
  - `libros/whitepaper-seguridad/documento.md` (application network).
  - Serie 1, sesión 1 (`videos/serie-1.md`): las mismas tres capas, C4E y Catalyst.

### 6. Nota de verificación

- La transcripción está **traducida al inglés** desde el original en español; los términos pueden variar.
- Fechas de MuleSoft (fundada en 2006, comprada por Salesforce en 2018) coinciden con lo que conozco; no verificadas hoy.
- "Básico + intermedio cubren todo el examen Level 1" es una afirmación del autor sobre su propio curso.
- Políticas de Omni Gateway en Rust: coincide con el libro de Agent Fabric (Omni Gateway, antes Flex Gateway); el detalle de Rust no se verificó.
- El peso de `application-networks` viene de `taxonomy.json`.

---

## Serie 2 · Video 2: Anypoint Studio y Code Builder, instalación y primer proyecto (Curso Básico #2)

- **Video:** [Anypoint Studio y Code Builder: Instalación y Primer Proyecto - Mulesoft: Curso Básico #2](https://www.youtube.com/watch?v=C2hJCgGUPQk)
- **Duración:** 1:17 · **Temas:** herramientas-desarrollo, structuring-apps, build-dependencias, mule-events, debugging
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-2-tactiq-free-transcript-C2hJCgGUPQk.txt`

Instala Anypoint Studio, Java 17 y Maven; recorre la interfaz y la estructura de un proyecto; repasa XML; arma un primer flujo con Scheduler y Logger; explica flujo vs. subflow, Flow Reference y el Mule message con el depurador; al final instala Anypoint Code Builder. La transcripción está traducida al inglés; el video es en español.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:03] | Studio vs. Code Builder | Studio es un IDE completo y maduro; Code Builder es una extensión de VS Code (también en otros editores basados en él). Mismos flujos, componentes y lenguaje. El curso usa Studio. |
| [00:04–00:12] | Instalar Studio | Formulario en la web de MuleSoft → enlace por correo (vale 24 h) → zip de ~2 GB sin instalador; descomprimir en `C:\`. Versiones del curso: Studio 7.26, runtime 4.11/4.12. Workspace: uno por usuario; dos Studio no pueden compartirlo. |
| [00:09–00:20] | Java y Maven | Studio trae Java embebido, pero conviene instalar JDK 17 (Temurin) y Maven. Configurar `JAVA_HOME` y `Path` (`...\bin`). Comprobar con `java -version` y `mvn --version`. |
| [00:21–00:24] | Interfaz | Perspectivas: Mule Design, Debug, API Design. Package Explorer, propiedades del componente, consola, problemas, paleta. Crear proyecto con File → New → Mule Project. |
| [00:21–00:34] | Estructura del proyecto | `src/main/mule` (XML de flujos), `src/main/java`, `src/main/resources`, `src/test/munit`, `src/test/resources`, `target`, `mule-artifact.json` (versión mínima de Mule y de Java), `pom.xml` (groupId, artifactId, version, packaging `mule-application`, versión del runtime, versión del Mule Maven Plugin, dependencias). |
| [00:22–00:24] | Vistas del archivo | *Message Flow* (visual), *Configuration XML* (texto) y *Global Elements*. En el examen aparece el XML: hay trampas que solo se ven ahí. |
| [00:31–00:36] | XML en 5 minutos | Declaración, etiquetas que abren y cierran, elementos vacíos, atributos, anidación. Aplicado al POM y a los archivos de Mule. |
| [00:36–00:50] | Primer flujo | Flow = *source* + *process* (+ manejo de errores). Scheduler con frecuencia enorme para dispararlo a mano en Debug. Logger "hello world". Al guardar, Studio vuelve a desplegar la app. Los flujos se leen de izquierda a derecha (en Code Builder, de arriba abajo). |
| [00:49–00:59] | Flow vs. subflow | El subflow no admite *source* ni manejo de errores. Flow Reference para llamarlo. Según él, llamar a un subflow rinde mejor que llamar a un flujo, porque el subflow "se inserta" en el que llama; no hacer referencias recursivas. |
| [00:59–01:06] | Mule message | Mule event = Mule message (attributes + payload) + variables. Set Payload reemplaza el payload. Logger con `#[payload]` (modo expresión). Breakpoint, Mule Debugger (payload, attributes, correlation ID, variables), F6 para avanzar. |
| [01:06–01:16] | Code Builder | VS Code + Java + Node.js + "Anypoint Extension Pack". Mismo proyecto; flujos verticales y uno por pestaña; Run and Debug. Solo Windows y macOS, según él. |

### 2. Conceptos clave

- **Anypoint Studio vs. Anypoint Code Builder** (`herramientas-desarrollo`) [00:01–00:03, 01:14–01:16]: Studio es un IDE basado en Eclipse con todo incluido; Code Builder es un conjunto de extensiones de VS Code. El proyecto, los componentes y DataWeave son iguales; cambian la interfaz y la orientación del diagrama.
- **Workspace** [00:07–00:08]: carpeta donde Studio guarda los proyectos; cada usuario (o cada Studio abierto) necesita el suyo.
- **JDK y Maven** (`build-dependencias`) [00:09–00:20]: el runtime corre en una JVM; Mule 4.9 en adelante usa Java 17. Maven gestiona dependencias y plugins y construye el artefacto. `JAVA_HOME` apunta al JDK; `Path` incluye `...\jdk\bin` y `...\maven\bin`.
- **Perspectivas de Studio** [00:17–00:18]: Mule Design (por defecto), Debug y API Design. Si "todo se movió", probablemente cambiaste de perspectiva.
- **Estructura de un proyecto Mule** (`structuring-apps`) [00:21–00:34]:
  - `src/main/mule`: archivos XML con flujos.
  - `src/main/resources`: propiedades, archivos JSON o CSV que usa la app.
  - `src/main/java`: código Java opcional.
  - `src/test/munit` y `src/test/resources`: pruebas MUnit y sus datos.
  - `target`: lo que genera la compilación.
  - `mule-artifact.json`: declara, entre otras cosas, la **versión mínima de Mule** (`minMuleVersion`) y la de Java; si el runtime elegido es menor, el proyecto no corre.
  - `pom.xml`: `groupId` (en la práctica, el ID de la organización de Anypoint), `artifactId`, `version`, **`packaging` = `mule-application`**, versión del runtime, versión del **Mule Maven Plugin** (no confundir con la versión de Maven) y dependencias (conectores y módulos). Quitar un módulo en Studio quita la dependencia del POM.
- **Vistas del archivo Mule** [00:22–00:24]: *Message Flow*, *Configuration XML* y *Global Elements* (configuraciones de la app).
- **XML básico** [00:31–00:36]: declaración `<?xml ...?>`, etiqueta de apertura y cierre, elemento vacío `<x/>`, atributos `name="..."`, anidación. Los archivos de Mule y el POM son XML.
- **Flow** [00:37–00:43]: tiene **source** (lo que lo dispara: HTTP Listener, Scheduler, archivo nuevo, registros nuevos en una base), **process** (los procesadores) y manejo de errores.
- **Scheduler** [00:39–00:41]: dispara el flujo cada cierto tiempo (*fixed frequency*) o según un **cron**. Truco para practicar: frecuencia y retraso inicial enormes, y dispararlo a mano en modo Debug.
- **Logger** [00:41–00:45]: escribe en la consola; muestra nivel (INFO, WARN, ERROR), flujo, evento y mensaje.
- **Subflow** [00:49–00:52]: solo procesadores; **no** tiene source ni manejador de errores propio.
- **Flow Reference** [00:53–00:58]: llama a otro flujo o subflow; el que llama espera a que termine y continúa. El flujo con source es el "padre" y ahí termina la ejecución.
- **Mule event y Mule message** (`mule-events`) [00:59–01:03]: el event contiene el **message** (attributes y payload) y las **variables**. `payload` es el cuerpo principal; `attributes`, los metadatos (por ejemplo los de una petición HTTP). Con Scheduler el evento empieza vacío.
- **Set Payload** [01:00]: reemplaza el payload. **Modo expresión** (`#[...]`): el valor se evalúa como DataWeave, por ejemplo `#[payload]`.
- **Mule Debugger** (`debugging`) [01:04–01:06]: con un *breakpoint* el flujo se detiene antes del procesador; se ven payload, attributes, variables y **correlation ID** (identificador de la ejecución). F6 avanza un paso.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`herramientas-desarrollo`**: diferencias entre Studio y Code Builder; para qué sirven las perspectivas.
- **`structuring-apps` (10%)**: decir dónde va cada tipo de archivo en un proyecto; qué controla `mule-artifact.json` y qué contiene el POM.
- **`build-dependencias`**: diferenciar versión de Maven y del Mule Maven Plugin; qué pasa al quitar un módulo; qué es `packaging`.
- **`mule-events` (10%)**: partes del Mule event; qué hace Set Payload; valor del payload después de cada procesador.
- Flujo vs. subflow: cuál admite source y manejo de errores; qué hace Flow Reference y dónde termina la ejecución.
- Leer un flujo sencillo en XML.

Confusiones típicas que señala el video:
- Confundir la versión de Maven (3.9.x) con la del Mule Maven Plugin (4.x) [00:30].
- Usar flujos sin source para lógica compartida cuando bastaría un subflow [00:50–00:52].
- Creer que el cambio en un componente se aplica al instante; Studio vuelve a desplegar al guardar [00:46].
- Fiarse solo de la vista gráfica; el examen muestra XML [00:23].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Prepara el entorno** [00:09–00:20]: JDK 17 y Maven instalados y en el `Path`; comprueba versiones antes de crear proyectos.
2. **Un workspace por persona** [00:07–00:08], también en máquinas compartidas.
3. **Revisa `mule-artifact.json` y el POM** al cambiar de runtime [00:27–00:34]: la versión mínima no puede ser mayor que la del runtime donde desplegarás.
4. **Pon tu `groupId`** (el de tu organización en Anypoint, si vas a publicar en Exchange) [00:28–00:29].
5. **Quita los módulos que no uses** [00:30–00:31]: menos dependencias, artefacto más chico.
6. **Practica con Scheduler en Debug** [00:40–00:44]: frecuencia y retraso enormes, y lo disparas cuando quieras.
7. **Nombra los procesadores** (*Display Name*) y, en un Flow Reference, pon el nombre del flujo al que llama [00:53–00:55]; "Go to Referenced Flow" ayuda a navegar.
8. **Lógica compartida en subflows** cuando no necesita su propio manejo de errores; usa un flujo privado cuando sí lo necesita (ver serie 1, sesión 5) [00:50–00:58].
9. **Depura con breakpoints** y mira el correlation ID para seguir una ejecución en los logs [01:04–01:06].

### 5. Para estudiar

- Reproduce el proyecto `mulesoft-curso-basico-1`: Scheduler → Set Payload → Logger `#[payload]` → Flow Reference a un subflow con otro Logger. Recorre con F6 y anota el payload en cada paso.
- Abre la vista *Configuration XML* de ese flujo y relaciona cada etiqueta con un componente.
- Cambia `minMuleVersion` a una versión mayor que la del runtime y mira el error.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap02-setting-up-development-environment.md` (entorno, estructura del proyecto).
  - `libros/anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` (Mule event, flujos y subflows).
  - `libros/anypoint-platform/capitulos/cap12-testing-quality-delivery-pipelines.md` (Maven y construcción).
  - Serie 1, sesión 2 (`videos/serie-1.md`): estructura para varios entornos.

### 6. Nota de verificación

- La transcripción está **traducida al inglés** desde el original en español.
- **Versiones** (Studio 7.26, runtime 4.11 o 4.12, Mule Maven Plugin 4.10, Maven 3.9.16): las del momento del video; menciona 4.11 y luego crea el proyecto con 4.12. No verificadas.
- **"Llamar a un subflow rinde mejor que llamar a un flujo" y "los flujos sin source degradan el rendimiento"**: él dice que está en la doc. Lo que conozco de la doc: un subflow se ejecuta como parte del flujo que lo llama, hereda su manejo de errores y no tiene source; un flujo privado tiene su propio manejador. La diferencia de rendimiento es pequeña en la mayoría de los casos. **Verificar en la doc de flujos y subflows** antes de afirmarlo en una pregunta. APIkit es la excepción que él mismo menciona (genera flujos privados por diseño).
- **Recursión con Flow Reference**: él desaconseja que un flujo se llame a sí mismo. En la serie 1, sesión 6, aparece justo como pregunta trampa de examen (las variables se conservan porque es el mismo evento).
- **Requisitos de Code Builder** (32 GB de RAM, 50 GB de disco según MuleSoft; él dice que con 16 GB anda) y "solo Windows y macOS": no verificados.
- "Code Builder tiene errores, no lo usaría en un proyecto grande" es una **opinión**.

---

## Serie 2 · Video 3: DataWeave desde cero, conceptos básicos

- **Video:** [Introducción a Dataweave: Conceptos básicos - Dataweave desde cero](https://www.youtube.com/watch?v=HvkeEG8PDTY)
- **Duración:** 3:01 · **Temas:** dataweave
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-3-tactiq-free-transcript-HvkeEG8PDTY.txt`

El video más largo de la serie (unas 3 horas). Recorre DataWeave sin Mule: estructura del script, tipos simples y compuestos, operadores, conversión de tipos, comparaciones, **todos los selectores** (JSON y XML, incluidos atributos y namespaces), variables con tipo, `if/else`, `match`, funciones, `do`, lambdas, `map`, `filter` y `update`. Practica en DataWeave Playground (web) y en VS Code con una extensión. La transcripción es en español, automática, con muchos errores ("Datawip", "Jason", "CSB", "paylot").

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:04] | Qué es DataWeave | Lenguaje funcional puro de MuleSoft. Tres fases: **leer** (formato de entrada → modelo interno), **script**, **escribir** (formato de salida). Formatos (MIME types): JSON, XML, CSV, Java, DataWeave, Excel, multipart, YAML, flat file… |
| [00:04–00:07] | Dónde practicar | DataWeave Playground en el navegador; en VS Code, una extensión de DataWeave (necesita Java). Tres paneles: entrada, script, salida. |
| [00:08–00:12] | Anatomía del script | Encabezado (`%dw 2.0`, `output`, `input` opcional, `var`, `fun`, `import`, `ns`, `type`) — separador `---` — cuerpo con la expresión. Cambiar `output` cambia el formato del mismo dato. |
| [00:12–00:22] | Tipos simples | Number (enteros y decimales juntos), String (comillas simples o dobles), Boolean, Regex, Null, fechas `\|2026-06-01\|`, fecha y hora `\|2026-06-01T04:06:05\|`, períodos `\|P4Y12M20D\|`. |
| [00:22–00:31] | Operaciones y conversión | `+ - * /`, paréntesis; restar fechas da un período; sumar/restar períodos; `now()` y cambiar zona con `>> \|-03:00\|`. Conversión automática ("2" + 4 = 6), `++` para concatenar, `as Number` / `as String` para forzar el tipo. |
| [00:31–00:42] | Tipos compuestos | Objeto `{clave: valor}`, arreglo `[...]` con cualquier tipo dentro, funciones. Agregar a un arreglo con `+`, quitar con `-` (quita todas las apariciones), unir con `++`; quitar claves con `-` y varias con `--`; unir objetos con `++`; `>>` / `<<` para agregar al principio o al final. |
| [00:42–00:56] | Comparaciones y lógica | `> < >= <=` convierten tipos; `==` compara valor **y** tipo; `~=` compara solo el valor. `is` verifica el tipo. `true` no es `1`. `and`, `or`, `not` / `!`. Comentarios `//` y `/* */`. |
| [00:56–01:30] | Selectores en JSON | `.clave`, `["clave"]`, `."con espacio"`, índice `[0]` y `[-1]`, rango `[0 to 1]`, filtro `[?(...)]`, descendiente `..clave` (siempre devuelve arreglo), clave-valor `.&clave`, clave presente `.clave?`, clave obligatoria `.clave!`. Interpolación `"$(payload.firstName)"`. |
| [01:26–01:52] | Selectores en XML | Las etiquetas pasan a claves. Salida XML: **una sola raíz**. Atributos `.@id`, múltiple `.*book`, combinaciones `..*book[1].*field[0]`, namespaces: declarar `ns isbn http://...` y usar `isbn#field`; se compara por la **URI**, no por el prefijo. |
| [01:53–01:56] | Metadatos | Agregar con `<~ {isbn: ...}`; leer con `.^isbn`; solo se ven con salida `application/dw`. |
| [01:56–02:07] | Variables | `var book: Object = ...` en el encabezado para no repetir selecciones; el tipo evita errores (`Any` vs. `Number`). Variables dentro de selectores. Crear XML con namespace en la raíz y atributos con `@(isbn: ..., autor: ...)`. |
| [02:10–02:24] | Control de flujo | Filtro con variable (`payload[?($.age >= ageFilter)]`); `if (...) ... else ...`, `else if`, anidados; `valor match { case "green" -> ... else -> ... }`. |
| [02:24–02:44] | Funciones | `fun sumar(n1: Number, n2: Number): Number = n1 + n2`; `do { var ... --- ... }` con su propio *scope*; notación prefija `sumar(2, 2)` e infija `2 sumar 2` (solo con dos parámetros); funciones como valores, lambdas, funciones que reciben funciones. `avg`, `sizeOf`. |
| [02:44–02:58] | map, filter, update | `map` recorre un arreglo con `(item, index)` o `$` / `$$`; `filter`; `update { case .age -> $ + 11 }` y `case .role! -> "admin"` para agregar un campo. |
| [02:58–03:01] | Lo que falta | Fechas, listas y objetos a fondo, módulos, tipos, streaming, pruebas de DataWeave: en videos futuros. |

### 2. Conceptos clave

- **Lectura → script → escritura** (`dataweave`) [00:01–00:02]: el *reader* convierte la entrada (según su MIME type) a un modelo interno; el script trabaja sobre ese modelo; el *writer* lo convierte al formato de salida. Por eso el mismo script puede devolver JSON, XML o CSV cambiando solo `output`.
- **Encabezado y cuerpo** [00:08–00:12]: arriba de `---` van las directivas (`%dw 2.0`, `output application/json`, `input payload application/xml` si hace falta) y las declaraciones (`var`, `fun`, `ns`, `type`, `import`); abajo, **una** expresión. Sin `output`, el formato depende del contexto (en Mule suele ser `application/java`).
- **Tipos simples** [00:12–00:22]: `Number` (sin distinción entero/decimal), `String`, `Boolean`, `Regex` (`/.../`), `Null`, `Date` / `DateTime` / `Time` entre barras `|...|`, `Period` (`|P1D|`, `|PT3H|`).
- **Fechas** [00:20–00:24]: restar dos fechas da un período; sumar o restar un período mueve la fecha; `now()` usa la zona horaria de donde corre el runtime; `>>` cambia la zona: `now() >> |-03:00|` o `>> "America/Argentina/Buenos_Aires"`.
- **Conversión automática y explícita** [00:24–00:30]: DataWeave intenta convertir tipos según la operación (`"2" + 4` → 6). Para evitar sorpresas, convierte a propósito con `as Number`, `as String`, `as Date`.
- **`++`** [00:26–00:27, 00:37–00:43]: concatena strings, arreglos y objetos. Es una función que se usa en notación infija.
- **Arreglos** [00:33–00:37]: `[1, 2] + 3` agrega; `[1, 2, 2] - 2` quita **todas** las apariciones; `[1, 2] ++ [3, 4]` une; `[1, 2] << 3` agrega al final y `0 >> [1, 2]` al principio.
- **Objetos** [00:31–00:41]: `obj - "clave"` quita una clave; `obj -- ["a", "b"]` quita varias; `obj1 ++ obj2` los une. Las claves deberían ser únicas (en XML convertido a JSON pueden repetirse).
- **`==` vs. `~=`** [00:44–00:52]: `5 == "5"` es `false` (distinto tipo); `5 ~= "5"` es `true` (mismo valor). Vale para fechas, arreglos y objetos. `true == 1` es `false`.
- **`is`** [00:48]: `payload.id is Number` devuelve true o false.
- **Selectores** [00:58–01:56]:
  - `payload.clave`, `payload["clave"]`, `payload."clave con espacio"`.
  - Índice `[0]`, `[-1]` (último); fuera de rango → `null`.
  - Rango `[0 to 1]`.
  - Filtro `[?($.age > 30)]`.
  - Descendiente `payload..lat`: busca en todos los niveles y **siempre devuelve un arreglo**.
  - Clave-valor `payload.&hair`: devuelve la clave junto con su valor.
  - Múltiple `payload.catalog.*book`: todas las repeticiones de una clave (típico en XML).
  - Atributo `payload.catalog.book.@id`.
  - Namespace `isbn#field`, con `ns isbn http://...` en el encabezado; se compara por la URI.
  - Clave presente `payload.id?` (true aunque el valor sea `null`); clave obligatoria `payload.id!` (error si la clave no existe).
  - Metadatos `.^clave`.
- **XML de salida** [01:30–01:33]: necesita **un único elemento raíz**; si no, falla.
- **Atributos y namespaces al escribir XML** [02:06–02:10]: `id @(isbn: "123"): valor`; la declaración del namespace va en la raíz.
- **Variables con tipo** [01:57–02:04]: `var book: Object = payload..*book[0]`. Si declaras `Number` y la selección es `Any` o `String`, falla: convierte con `as Number`.
- **`if / else` y `match`** [02:13–02:24]: `if (cond) a else b`, con `else if` y anidados; `match { case "green" -> ... case "red" -> ... else -> ... }` compara contra valores literales (y también admite patrones más ricos).
- **Funciones** [02:24–02:44]: `fun nombre(p: Tipo): TipoRetorno = expresión`; `do { var x = 1 --- ... }` crea un bloque con variables locales (*scope*): lo de adentro no se ve desde afuera, pero el bloque sí ve las variables globales. Notación infija `a fn b` solo con dos parámetros. Las funciones son valores: se guardan en variables, en objetos y se pasan como parámetro. **Lambda** = función sin nombre: `(n1, n2) -> n1 + n2`.
- **`map`** [02:45–02:52]: `payload map (item, index) -> {...}` o con `$` (elemento) y `$$` (índice). Devuelve un arreglo del mismo largo.
- **`filter`** [02:52–02:54]: `payload filter ($.age > 35)`.
- **`sizeOf`, `avg`** [02:34–02:35, 02:46]: cantidad de elementos y promedio.
- **`update`** [02:55–02:58]: `payload update { case .age -> $ + 11  case .role! -> "admin" }` cambia campos sin rehacer el objeto; con `!` agrega el campo si no existe.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`dataweave`, peso 10%):
- Predecir la salida de un script con selectores (simple, índice negativo, rango, descendiente, múltiple, atributo, namespace, `?`, `!`).
- Saber qué tipo devuelve cada selector (por ejemplo, `..` siempre arreglo; `.*` arreglo; fuera de rango `null`).
- Distinguir `==` de `~=`, `+` de `++`, `-` de `--`, y predecir el resultado de la conversión automática.
- Escribir un `map` con `$` y `$$`, un `filter`, un `if/else` y un `match`.
- Declarar variables y funciones en el encabezado; reconocer notación prefija e infija.
- Saber que una salida XML necesita una sola raíz y cómo se escriben atributos y namespaces.
- Usar `update` para cambiar un campo y para agregar uno con `!`.

Confusiones típicas que señala el video:
- `5 == "5"` es falso; `>=` en cambio convierte y da verdadero [00:45–00:51].
- `[1, 2] + [3, 4]` mete un arreglo dentro de otro; para unir se usa `++` [00:37].
- Esperar un valor simple del selector descendiente; devuelve arreglo [01:20].
- `payload.id?` no dice si el valor es nulo, solo si la clave existe [01:25].
- Pedir XML con varias claves sueltas en la raíz [01:30–01:33].
- Buscar el namespace por el prefijo en vez de por la URI [01:50].
- `now()` con la hora del servidor, no la local [00:22–00:23].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Arma la salida con un objeto nuevo** y solo los campos que necesitas [01:02–01:04]:
   ```dataweave
   %dw 2.0
   output application/json
   ---
   payload map {
     id: $.id,
     fullName: "$($.firstName) $($.lastName)",
     age: $.age,
     city: $.address.city
   }
   ```
2. **Guarda en variables las rutas repetidas** [01:56–02:00]: `var book = payload..*book[0]` y luego `book.title`, `book.author`.
3. **Declara tipos** cuando sabes qué esperas (`var edad: Number = ...`) para que el error salga donde está el problema [02:01–02:03].
4. **Convierte a propósito** con `as` antes de comparar o sumar valores que vienen como texto (por ejemplo desde CSV o XML) [00:28–00:30].
5. **Valida campos obligatorios** con `!` cuando su ausencia debe cortar la transformación, o pregunta con `?` para decidir [01:24–01:26].
6. **XML con namespaces** [01:46–01:51]: copia la URI del `xmlns:` de la raíz, declárala con `ns` y selecciona con `prefijo#etiqueta`; el prefijo puede ser cualquiera.
7. **Actualiza en lugar de rehacer** con `update` cuando solo cambian uno o dos campos [02:55–02:58].
8. **Prueba en Playground** con datos de ejemplo (por ejemplo DummyJSON) antes de llevar el script a Transform Message [01:01].

### 5. Para estudiar

- Repite los ejemplos del video en DataWeave Playground: tipos, operadores, cada selector y cada función.
- Toma un JSON de usuarios y escribe: lista de mayores de 30, edad promedio, cantidad, y la ciudad de la empresa con el selector descendiente.
- Toma un XML con atributos y un namespace, y conviértelo a JSON con los campos que quieras.
- Escribe la misma lógica con `if/else` anidado y con `match`.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` (estructura, `default`, `reduce`, variables, módulos).
  - Serie 1, sesión 4 (`videos/serie-1.md`): funciones básicas presentadas por alumnos (con correcciones).
  - Doc oficial: selectores, operadores y dw::Core (ver `enlaces-oficiales.md`).

### 6. Nota de verificación

- Lo explicado sobre selectores, operadores, `==` / `~=`, `++`, `--`, `<<` / `>>`, `update` con `!`, `do`, notación infija y lambdas coincide con lo que conozco de DataWeave 2. No lo revisé hoy en docs.mulesoft.com.
- **Comillas simples para "un carácter"** [00:13]: en DataWeave no hay tipo carácter; comillas simples y dobles crean igual un `String`.
- **"Por defecto la salida es Java"** [00:03]: en Mule, si el script no declara `output`, el formato depende del componente y del contexto. En Playground el ejemplo inicial usa JSON. Verificar antes de preguntar.
- **"Las fases son dos" / "tres"**: la transcripción dice "10" por error de reconocimiento; son tres (lectura, script, escritura).
- **Extensiones de VS Code** ("DataWeave Studio" recomendada, "DataWeave Playground" como alternativa): nombres tomados de una transcripción con errores; no verificados.
- La transcripción tiene muchos errores de reconocimiento; ante una duda sobre un símbolo, ve al minuto del video.

---

## Serie 2 · Video 4: Transformadores, Set Payload, Set Variable, Remove Variable y Transform Message (Curso Básico #3)

- **Video:** [Transformadores - Mulesoft: Curso Básico #3](https://www.youtube.com/watch?v=5vN8zAvBYoA)
- **Duración:** 0:57 · **Temas:** mule-events, dataweave, debugging
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-4-tactiq-free-transcript-5vN8zAvBYoA.txt`

Repasa el Mule event y usa los componentes que lo modifican: Set Payload, Set Variable, Remove Variable y Transform Message. Muestra el modo expresión, el MIME type por defecto (Java), cómo leer variables con `vars` y una trampa importante del Transform Message con varias salidas. Transcripción en español.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:03] | Repaso del Mule event | El *source* crea el evento, que pasa por cada procesador. Contiene el Mule message (payload + attributes) y las variables. |
| [00:03–00:05] | Transformers en la paleta | Core → Transformers: Remove Variable, Set Payload, Set Variable. Transform Message está en otra categoría pero hace lo mismo y más. El Scheduler crea un evento con payload y attributes nulos. |
| [00:05–00:07] | Modo expresión vs. literal | Con el botón *fx* activo, el campo es una expresión DataWeave (`payload`, `2 + 2`, `message`, `attributes`). Sin él, es texto fijo. |
| [00:07–00:12] | MIME type | Set Payload, Set Variable y Transform Message generan `application/java` si no se indica otro. Se cambia en la pestaña *MIME Type* o con `output application/json` en el script (él prefiere lo segundo: se ve a simple vista). |
| [00:12–00:15] | Set Payload pisa | Cada Set Payload reemplaza el anterior; se puede reutilizar el valor actual: `payload ++ " mundo"`. |
| [00:15–00:19] | Objeto sin `output` | Un objeto pegado en Set Payload sin `output` queda como `LinkedHashMap` de Java (`id=1`); con `output application/json` es JSON. |
| [00:20–00:35] | Set Variable | Guarda datos que deben sobrevivir aunque el payload cambie. Se lee con `vars.nombre`; si no existe, es `null`. Una variable con el mismo nombre se pisa. La variable toma el formato del dato de origen. Cuándo elegir Java, JSON o XML; no usar `application/dw` salvo para depurar. |
| [00:35–00:45] | Remove Variable | Elimina una variable; útil si guarda algo pesado y el flujo sigue. `default` para que un `null` no rompa una concatenación. En la práctica se usa poco. |
| [00:45–00:51] | Transform Message | Mismo script que Set Payload, pero con varias salidas en un solo componente: payload, attributes y variables. Legibilidad: preferir todo visible en el componente. |
| [00:51–00:55] | La trampa | Dentro de un mismo Transform Message, una variable que lee `payload` ve el payload **de antes** del componente, no el que define ese mismo Transform Message. |

### 2. Conceptos clave

- **Mule event** (`mule-events`) [00:01–00:02]: lo crea el *source* y lo recorre cada procesador. Tiene el **message** (payload = cuerpo; attributes = metadatos, por ejemplo de HTTP) y las **variables** (contenedores con nombre).
- **Evento del Scheduler** [00:04–00:05, 00:11]: existe, pero su payload y sus attributes llegan en `null`.
- **Modo expresión / literal** [00:05–00:07]: con *fx* activo se evalúa DataWeave (`#[payload]`); sin él se toma el texto tal cual. Palabras reservadas: `payload`, `attributes`, `message` (payload + attributes), `vars`.
- **MIME type por defecto** [00:07–00:12, 00:16–00:18]: Set Payload, Set Variable y Transform Message producen `application/java` si no se declara otra cosa. Un objeto sin `output` queda como mapa de Java.
- **Set Payload** [00:12–00:15]: **reemplaza** el payload. Puede usar el valor anterior en la expresión.
- **Set Variable** [00:20–00:30]: crea o **pisa** una variable del evento. Se lee con `vars.nombre` (no confundir con una `var` de un script DataWeave). Si no existe, `vars.nombre` es `null`. El dato conserva el formato de donde salió.
- **Payload vs. variables** [00:32–00:34]: el payload es el contenedor principal, se va reemplazando; las variables guardan valores puntuales para usar más adelante. Las variables viven hasta que termina el evento.
- **Remove Variable** [00:35–00:44]: borra una variable para liberar memoria cuando guarda algo grande y el flujo continúa (procesos con mucho tráfico o batch).
- **`default`** [00:36–00:38]: `(vars.userId default "")` evita que un `null` rompa una concatenación. Usarlo es una **decisión**: a veces conviene que el flujo falle.
- **Transform Message** [00:45–00:51]: un script DataWeave con una o varias salidas (*targets*): payload, attributes y variables. El lápiz cambia el tipo o el nombre de la salida; el tacho la quita.
- **Trampa del Transform Message** [00:51–00:55]: todas las salidas de un mismo Transform Message se calculan sobre el evento **de entrada**. Si la salida payload crea un usuario y otra salida variable lee `payload.id`, la variable recibe el `payload.id` anterior (en el ejemplo, `null`).
- **`application/dw`** [00:32–00:33]: útil para ver tipos y metadatos al depurar; según él, no usarlo como salida real por rendimiento.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`mule-events`, peso 10%; `dataweave`, 10%):
- Dado un flujo con varios Set Payload, Set Variable y Transform Message, decir el valor del payload y de cada variable al final.
- Saber qué formato tiene el resultado de Set Payload o Transform Message sin `output`.
- Distinguir `vars.x` (variable del evento) de `var x` (variable de un script).
- Explicar qué pasa al leer una variable que no existe o que se borró.
- **Detectar la trampa**: una variable definida en el mismo Transform Message que redefine el payload no ve el payload nuevo.
- Explicar la diferencia entre modo expresión y literal.

Confusiones típicas que señala el video:
- Pegar un JSON en Set Payload y esperar `application/json` sin declararlo [00:16–00:18].
- Pensar que dos Set Variable con el mismo nombre crean dos variables [00:29–00:30].
- Asumir que, en un Transform Message con varias salidas, las variables leen el payload que se acaba de definir [00:51–00:55].
- Concatenar con `++` una variable `null` [00:36].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Declara el `output` en el script** en lugar de esconderlo en la pestaña MIME Type [00:18–00:19].
2. **Transforma lo mínimo** [00:26–00:29]: deja el formato por defecto (Java) mientras no haga falta otro; conviértelo cuando el destino lo pida (una API que acepta JSON o XML, un log legible).
3. **Guarda en variables lo que necesitarás después** (IDs, parámetros) antes de pisar el payload [00:20–00:22].
4. **Si una variable depende del payload nuevo**, créala en un componente **posterior** (otro Transform Message o un Set Variable) [00:54–00:55].
5. **Borra variables grandes** cuando ya no se usen y el flujo siga [00:39–00:44].
6. **Usa `default` a conciencia** para valores opcionales; deja que falle si el valor es imprescindible [00:36–00:37].
7. **Legibilidad primero** [00:44–00:47]: Display Names claros, todo visible en el componente, evitar archivos de script externos salvo para módulos reutilizables.

### 5. Para estudiar

- Reproduce el ejemplo de la trampa: un Transform Message con salida payload `{id: 1}` y salida variable `userId = payload.id`; míralo en el depurador. Luego mueve la variable a un componente siguiente y compara.
- Prueba Set Payload con y sin `output application/json` y mira el MIME type en el Mule Debugger.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` (Mule event, variables).
  - `libros/anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` (Transform Message, `default`).
  - Serie 1, sesiones 2 y 3 (`videos/serie-1.md`): attributes, transport boundary y variables.

### 6. Nota de verificación

- La trampa del Transform Message con varias salidas (todas se evalúan sobre el evento de entrada) coincide con lo que conozco del componente; conviene confirmarla en la doc de Transform Message, porque es buena pregunta de examen.
- `application/java` por defecto en Set Payload, Set Variable y Transform Message: coincide con lo que conozco; el formato real depende de lo que produce la expresión.
- "No usar `application/dw` por rendimiento": la doc lo recomienda para depurar; la afirmación sobre rendimiento es del autor, no verificada.
- "Remove Variable casi no se usa" es una **opinión** basada en su experiencia.
- El número del video en la serie (4) no coincide con el del título ("Curso Básico #3") porque el video de DataWeave está en medio.

---

## Serie 2 · Video 5: Choice, Round Robin, For Each y Parallel For Each (Curso Básico #4)

- **Video:** [Un vistazo a operaciones Flow Control y Scope | Mulesoft: Curso Básico #4](https://www.youtube.com/watch?v=rkbJqizAg5s)
- **Duración:** 0:28 · **Temas:** routing, processing-records
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-5-tactiq-free-transcript-rkbJqizAg5s.txt`

Video corto con datos inventados (Scheduler + Set Payload). Muestra dos routers (Choice y Round Robin) y dos scopes (For Each y Parallel For Each). First Successful y Scatter-Gather quedan para cuando se vean APIs y errores. Transcripción en español.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:02] | Contexto | Componentes que no necesitan sistemas externos; el manejo de errores en cada uno se verá después. El próximo video: APIs. |
| [00:02–00:07] | Choice | Como `if / else` de DataWeave: rutas *when* con una expresión y una ruta *default*. Ejemplo `payload == "verde"`. El *default* puede quedar vacío; un *when* vacío da error al guardar. |
| [00:07–00:10] | Varias condiciones | Se pueden agregar más rutas *when* y anidar un Choice dentro de otro. Evalúa de **arriba abajo** y toma **solo la primera** verdadera, aunque otras también lo sean. |
| [00:10–00:14] | Round Robin | Cada ejecución toma la ruta siguiente, de arriba abajo, y vuelve a empezar. El turno vive en la instancia: si la app se reinicia, empieza por la primera. Casi no se usa. |
| [00:14–00:17] | Preparar el ejemplo de scopes | Transform Message con `1 to 100` (lista del 1 al 100). Transform Message no tiene campo Display Name: se cambia con clic derecho → Rename. |
| [00:17–00:21] | For Each | Recorre la colección (por defecto `payload`, o una expresión como `vars.lista`) un elemento a la vez, **en orden**. Dentro, el payload es el elemento actual; crea las variables `rootMessage` (mensaje original) y `counter` (posición, empieza en 1). |
| [00:21–00:25] | Parallel For Each | Procesa los elementos **en paralelo**; los logs salen desordenados. **Max concurrency** limita cuántos se procesan a la vez (cuando uno termina, entra otro); también tiene *timeout*. |
| [00:25–00:28] | Cierre | For Each se usa mucho más que Parallel For Each. Siguiente: APIs y Postman. |

### 2. Conceptos clave

- **Choice** (`routing`) [00:02–00:10]: router condicional. Cada ruta *when* tiene una expresión booleana; se evalúan **en orden** y se ejecuta **solo la primera verdadera**. Si ninguna lo es, va por *default*. El *default* puede estar vacío; cada *when* necesita al menos un procesador.
- **Choice anidado** [00:09]: dentro de una ruta puede haber otro Choice para seguir evaluando.
- **Round Robin** [00:10–00:14]: reparte ejecuciones entre rutas por turno (1, 2, 3, 1…). El turno se guarda en memoria de la instancia y se reinicia al volver a desplegar.
- **For Each** (`processing-records`) [00:17–00:21]:
  - **Collection**: qué recorrer; por defecto `payload`, o una expresión (`#[vars.lista]`).
  - Dentro del scope, `payload` es el elemento actual.
  - Variables que crea: **`rootMessage`** (el mensaje que llegó al For Each) y **`counter`** (número de iteración, desde 1).
  - Procesa de a uno y en orden: el siguiente espera a que termine el anterior.
- **Índice vs. posición** [00:19]: el elemento con índice 99 está en la posición 100; `counter` cuenta posiciones (empieza en 1).
- **Parallel For Each** [00:21–00:25]: lanza el procesamiento de cada elemento de forma concurrente; el orden de ejecución no está garantizado. **Max concurrency** fija el tope de elementos simultáneos; **timeout** limita el tiempo.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`routing` (8%)**: dado un Choice con varias condiciones verdaderas, decir qué ruta corre (la primera); qué pasa si ninguna es verdadera y el *default* está vacío; cómo avanza Round Robin y qué pasa al reiniciar.
- **`processing-records` (10%)**: qué es el payload dentro de un For Each; qué contienen `counter` y `rootMessage`; diferencia de orden entre For Each y Parallel For Each; para qué sirve *max concurrency*.

Confusiones típicas que señala el video:
- Esperar que el Choice ejecute todas las rutas verdaderas [00:10].
- Creer que Round Robin recuerda el turno tras un reinicio [00:13–00:14].
- Esperar orden en los logs de un Parallel For Each [00:23].
- Confundir índice (desde 0) con `counter` (desde 1) [00:19–00:20].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Ordena las condiciones del Choice de la más específica a la más general** [00:09–00:10]; si `> 10` va antes que `== 20`, la segunda nunca se ejecuta.
2. **Deja una ruta *default* útil** (un log o un error claro) aunque no sea obligatoria [00:06–00:07].
3. **Recorre una colección guardada en una variable** cuando el payload debe quedar intacto: *Collection* = `#[vars.lista]` [00:18].
4. **Usa `counter`** para mensajes de progreso ("procesando 3 de 100") [00:20–00:21]; `sizeOf(vars.rootMessage.payload)` da el total.
5. **Parallel For Each solo cuando el orden no importa** y los elementos son independientes; fija *max concurrency* para no agotar recursos [00:23–00:25].
6. **Para volúmenes grandes**, considera Batch Job en lugar de For Each (ver serie 1, sesión 4).

### 5. Para estudiar

- Arma un Choice con tres condiciones que se solapen y comprueba con el depurador cuál se ejecuta.
- Recorre `1 to 10` con For Each y con Parallel For Each; compara orden y tiempo.
- Ejercicio: crea una variable **dentro** del For Each y léela **después** del scope (debería existir); repite con Parallel For Each (no debería existir) y compara con la doc oficial.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` (routers y composición).
  - Serie 1, sesiones 4 y 6 (`videos/serie-1.md`): batch, routers y la pregunta de variables en scopes.

### 6. Nota de verificación

- Choice (solo la primera ruta verdadera, *default* opcional), Round Robin (se reinicia con la app), For Each (`counter`, `rootMessage`, orden) y Parallel For Each (*max concurrency*, *timeout*) coinciden con lo que conozco de la doc; no lo revisé hoy en docs.mulesoft.com.
- **Confirmado en la doc oficial (2026-11-18)**, aunque el video no lo muestra: *"For Each does not modify the current payload"* (al salir queda el payload que entró) y las variables nuevas o modificadas dentro *"continue to be available outside the For Each scope"* ([For Each](https://docs.mulesoft.com/mule-runtime/latest/for-each-scope-concept)). En Parallel For Each *"None of the modifications done inside the Parallel For Each scope are registered, including the creation of new variables"*, y la salida es una colección con el mensaje de cada iteración, guardada por defecto en el payload ([Parallel For Each](https://docs.mulesoft.com/mule-runtime/latest/parallel-foreach-scope)).
- "Round Robin casi no se usa" es **opinión**.
- El número del video en la serie (5) no coincide con el del título ("Curso Básico #4").

---

## Serie 2 · Video 6: Introducción a APIs y HTTP Request (Curso Básico #5)

- **Video:** [Introducción a APIs | Mulesoft: Curso Básico #5](https://www.youtube.com/watch?v=5Zy24dBNDyc)
- **Duración:** 1:15 · **Temas:** designing-apis, connectors, mule-events, structuring-apps
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-6-tactiq-free-transcript-5Zy24dBNDyc.txt`

Dos partes. La primera explica qué es una API, HTTP/HTTPS, partes de una URL, endpoints, parámetros de ruta y de consulta, métodos, cuerpo, cabeceras, autenticación y códigos de estado, practicando con Postman contra la API pública DummyJSON. La segunda repite las mismas llamadas desde Mule con **HTTP Request**, una configuración global en `global.xml`, *target variable*, URI params, query params y body. Transcripción en español.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:03–00:10] | Qué es una API | Interfaz que expone qué se puede hacer con un sistema. Analogía del restaurante: menú = documentación, mozo = API, cocina = sistema. Tipos: REST, SOAP, otros; el curso usa REST. |
| [00:10–00:20] | HTTP y HTTPS | Protocolo de petición y respuesta; HTTPS cifra con TLS. Postman para probar. |
| [00:16–00:24] | Partes de una URL | Protocolo, host (subdominio, dominio, extensión), puerto (80 para HTTP, 443 para HTTPS; en Mule suele usarse 8081), ruta. |
| [00:20–00:29] | Endpoints y URI params | DummyJSON: `/test`, `/products`, `/products/1`. El `1` es un **parámetro de ruta (URI param)**; en Postman `/products/:productId`. URI = qué es; URL = dónde está. |
| [00:29–00:35] | Query params | Después de `?`, pares `clave=valor` separados por `&`: `/products/search?q=phone`, `limit`, `skip`, `select` (paginación y selección de campos). Siempre leer la documentación de la API. |
| [00:35–00:44] | Métodos | GET obtener, POST crear, PUT crear o reemplazar, PATCH actualizar parte, DELETE borrar; HEAD y OPTIONS existen. DummyJSON simula los cambios. |
| [00:41–00:51] | Body, headers, auth, status | Body JSON en POST (`/products/add`); cabeceras (Content-Type…); autenticación (basic, API key, bearer, JWT, OAuth); códigos 200 OK, 201 Created, 404 Not Found. |
| [00:49–00:52] | HTTP Request en Mule | Scheduler → HTTP Request (método, path, body, headers, query/URI params) → Logger. *Response timeout* y *response validator*. |
| [00:52–00:59] | Configuración global | Nuevo archivo `global.xml` → Global Elements → HTTP Request configuration: nombre, base path `/`, protocolo HTTPS, host `dummyjson.com`, puerto 443; en el ejemplo TLS "insecure" porque no hay truststore. |
| [00:59–01:03] | Respuesta | El HTTP Request **reemplaza** el payload con la respuesta y los attributes con los de HTTP (statusCode, reasonPhrase, headers). Display Name con el método y el recurso. |
| [01:03–01:06] | Target variable | En *Advanced*, guardar la respuesta en una variable sin tocar el payload; con *Target value* `#[message]` se guardan también los attributes. |
| [01:06–01:13] | Parámetros y body | `/products/{productId}` + URI params `{"productId": vars.productId}`; query params `{"q": "phone"}`; POST a `/products/add` con body `payload` (JSON, armado antes con Transform Message). Responde 201. |

### 2. Conceptos clave

- **API** (`designing-apis`) [00:03–00:10]: interfaz que define qué operaciones ofrece un sistema y cómo pedirlas. La **documentación** dice los endpoints, métodos, parámetros y formatos.
- **REST** [00:09–00:10]: estilo de API sobre HTTP basado en recursos (endpoints) y métodos.
- **HTTP / HTTPS** [00:12–00:20]: protocolo de petición-respuesta; HTTPS agrega cifrado TLS. Sin HTTPS, cualquiera en la red puede leer el tráfico.
- **URL** [00:16–00:24]: `https://dummyjson.com:443/products/1?select=title`. Puertos por defecto: 80 (HTTP) y 443 (HTTPS).
- **Endpoint / recurso** [00:22–00:23]: la ruta después del host (`/products`).
- **URI parameter** [00:26–00:29]: parte variable de la ruta que identifica un recurso (`/products/{id}`).
- **Query parameter** [00:30–00:35]: pares después de `?` para filtrar, paginar o elegir campos; varios se separan con `&`. Una API puede ignorar los que no conoce.
- **Métodos** [00:35–00:44]: GET (leer), POST (crear), PUT (crear o reemplazar), PATCH (modificar parte), DELETE (borrar).
- **Status code** [00:45–00:51]: 2xx éxito (200 OK, 201 Created), 4xx error del cliente (404 Not Found), 5xx error del servidor.
- **HTTP Request** (`connectors`) [00:50–00:53]: operación del conector HTTP para llamar a una API. Configura método, path, body, headers, query params y URI params.
  - **Response timeout** [00:51]: cuánto espera la respuesta antes de fallar por *timeout*.
  - **Response validator** [00:52]: qué códigos se consideran éxito; un código fuera de la lista lanza error (por ejemplo, se puede aceptar 404 como válido).
- **HTTP Request configuration** (`structuring-apps`) [00:53–00:59]: elemento global con protocolo, host, puerto, base path y TLS. Se guarda en `global.xml` para tener todas las configuraciones en un lugar.
- **Lo que deja el HTTP Request** (`mule-events`) [01:00–01:03]: payload = cuerpo de la respuesta; attributes = `statusCode`, `reasonPhrase`, `headers`. Reemplaza los attributes anteriores (por ejemplo los del Listener): es un *transport boundary*.
- **Target variable / Target value** [01:03–01:06]: guarda el resultado en una variable y deja el payload y los attributes como estaban. Por defecto guarda solo el payload; con `#[message]` guarda payload y attributes.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`designing-apis` (8%)**: distinguir URI param y query param en una URL; elegir el método para una operación; interpretar 200, 201, 404, 500.
- **`connectors` (10%)**: configurar un HTTP Request (configuración global + operación); explicar qué pasa con payload y attributes después de la llamada; qué cambia con *target variable* y *target value*; para qué sirven *response timeout* y *response validator*.
- **`mule-events` (10%)**: valor de payload, attributes y variables antes y después de un HTTP Request con y sin *target variable*.

Confusiones típicas que señala el video:
- Suponer cómo funciona una API sin leer su documentación (por ejemplo, `/products/add` en vez de `POST /products`) [00:41–00:42].
- Olvidar que el HTTP Request pisa el payload y los attributes [01:01–01:03].
- Usar *target variable* y esperar encontrar después el status code en `attributes` [01:04].
- Dejar URI params configurados que ya no están en el path: la llamada falla [01:12–01:13].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Prueba la API en Postman primero** con la documentación a mano [00:10–00:48].
2. **Una configuración global por API** en `global.xml`, con un nombre que la identifique (`DummyJSON_HTTP_Request_configuration`) [00:53–00:59]. Más adelante, host y puerto en propiedades (video 7).
3. **Display Name con método y recurso** (`GET /products`) [00:59–01:00].
4. **Arma el body antes** con un Transform Message (`output application/json`) y en el Request usa `payload` [01:11–01:12].
5. **URI params y query params como objetos DataWeave** [01:08–01:10]:
   - Path: `/products/{productId}`; URI parameters: `#[{"productId": vars.productId}]`.
   - Query parameters: `#[{"q": vars.busqueda, "limit": 10}]`.
6. **Si necesitas conservar el payload**, usa *target variable*; si además necesitas el status o las cabeceras, *target value* `#[message]` [01:03–01:06].
7. **Ajusta el timeout** para APIs lentas y el *response validator* si un 404 es un resultado válido para tu lógica [00:51–00:52].
8. **No dejes TLS en "insecure" fuera de pruebas** (ver verificación).

### 5. Para estudiar

- Haz en Postman y luego en Mule: listar productos, obtener uno por ID (URI param), buscar (query param), crear (POST con body) y borrar (DELETE). Anota payload y attributes después de cada llamada.
- Repite una llamada con *target variable* y luego con *target value* `#[message]`, y compara lo que queda en el evento.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap05-connectors-and-modules.md` (conectores, HTTP).
  - `libros/anypoint-platform/capitulos/cap06-api-design-contract-first.md` (diseño de APIs).
  - `libros/anypoint-platform/capitulos/cap10-security-identity-secrets.md` (TLS, autenticación).
  - Serie 1, sesión 2 (`videos/serie-1.md`): query vs. URI params en RAML y métodos HTTP.

### 6. Nota de verificación

- **TLS "insecure"** [00:57–00:58]: él lo pone porque "no hay truststore". Para un sitio público con certificado válido normalmente basta el truststore por defecto de Java; *insecure* desactiva la validación del certificado y **no** debe usarse en producción. Verificar en la doc de TLS del conector HTTP.
- **Response timeout por defecto**: la transcripción dice "100 segundos" y luego "10 segundos"; por lo que conozco el valor por defecto es de 10 segundos. Verificar.
- **"Un segundo POST del mismo recurso debería fallar"** [00:38]: depende de cómo esté hecha la API; POST no exige rechazar duplicados.
- Partes de la URL, puertos, métodos, códigos y el comportamiento de *target variable* / *target value* coinciden con lo que conozco; no los revisé hoy en docs.mulesoft.com.
- El número del video en la serie (6) no coincide con el del título ("Curso Básico #5").

---

## Serie 2 · Video 7: Manejo de properties (Curso Básico #6)

- **Video:** [Manejo de properties | Mulesoft: Curso Básico #6](https://www.youtube.com/watch?v=jaXRKCi9Dsk)
- **Duración:** 0:27 · **Temas:** structuring-apps, propiedades-seguras, deploying-managing
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-7-tactiq-free-transcript-jaXRKCi9Dsk.txt`

Por qué no dejar en el código valores que cambian por entorno o que son sensibles, y cómo moverlos a archivos de propiedades (YAML o `.properties`), leerlos con `${...}` y con `p()` en DataWeave, registrarlos con *Configuration properties* y elegir el archivo con un argumento `-D`. Las *secure properties* quedan para otro video. Transcripción en español.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:02] | El problema | Host, puerto, base path y path de la configuración HTTP están escritos a mano en el XML. |
| [00:02–00:06] | Dos razones | 1) **Entornos**: el mismo proyecto debe correr en no productivo y productivo cambiando solo los valores (hosts, usuarios, contraseñas). 2) **Seguridad**: contraseñas visibles en el código son mala práctica; deben ir en un archivo aparte y cifradas. |
| [00:06–00:13] | Archivos de propiedades | En `src/main/resources`: `dev.yaml` (claves anidadas por indentación) o `dev.properties` (claves con puntos, `clave=valor`). Incluye también valores que no cambian (paths) para no buscarlos por todo el código. Él prefiere YAML: en `.properties` un espacio al final pasa desapercibido y **cuenta** como parte del valor. |
| [00:13–00:16] | Usarlas | En configuraciones y campos: `${dummyjson.host}`. En DataWeave: `p('dummyjson.path.postProducts')` o `Mule::p(...)` si no reconoce `p`; siempre devuelve String. |
| [00:16–00:19] | Error típico | "No puede encontrar la property": o el nombre está mal escrito, o el archivo no está registrado. Se registra con el elemento global **Configuration properties** apuntando al archivo. |
| [00:19–00:21] | Archivo de producción | `prod.yaml` con los mismos nombres y otros valores. Cambiar a mano el archivo en la configuración vuelve a dejar algo fijo en el código. |
| [00:21–00:25] | Elegir el archivo por entorno | El nombre del archivo en Configuration properties pasa a ser una property (`env`). Su valor no puede estar dentro del mismo archivo: se pasa como **argumento** (`-Denv=...`) en *Debug/Run Configurations → Arguments*; en la nube se pasa al desplegar. |
| [00:25–00:27] | Lo que sigue | Secure properties (módulo de Exchange, requiere cuenta de Anypoint) en otro video; luego HTTP Listener. |

### 2. Conceptos clave

- **Valores por entorno** (`structuring-apps`) [00:02–00:05]: todo lo que cambia entre desarrollo, QA y producción (hosts, puertos, usuarios, contraseñas) va fuera del código. El proyecto es el mismo en todos los entornos; cambian solo las propiedades.
- **Valores sensibles** (`propiedades-seguras`) [00:05–00:06]: contraseñas y claves no deben verse en el XML; van en propiedades **cifradas** (*secure properties*).
- **Archivos de propiedades** [00:06–00:13]: en `src/main/resources`.
  - YAML: `dummyjson:` y debajo, indentados, `host: "dummyjson.com"`, `port: "443"`, `path:` → `postProducts: "/products/add"`.
  - `.properties`: `dummyjson.host=dummyjson.com`, `dummyjson.port=443`.
  - Los dos producen las mismas claves (`dummyjson.host`).
- **Placeholder `${...}`** [00:13–00:14]: en atributos de configuraciones y componentes: `host="${dummyjson.host}"`.
- **`p()` en DataWeave** [00:14–00:16]: `p('dummyjson.host')` (o `Mule::p(...)`) lee una propiedad dentro de una expresión; devuelve String.
- **Configuration properties** [00:17–00:19]: elemento global que registra un archivo de propiedades. Sin él, el despliegue falla con "Couldn't find configuration property value for key ...".
- **Propiedad de sistema por argumento** [00:21–00:25]: el archivo se elige con una property (`env`) cuyo valor llega desde afuera: en Studio, `-Denv=...` en *Run/Debug Configurations → Arguments*; en CloudHub o Runtime Manager, como propiedad de la aplicación al desplegar.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`structuring-apps`, peso 10%):
- Explicar por qué los valores de conexión van en propiedades y no en el XML.
- Escribir la misma propiedad en YAML y en `.properties`.
- Usar una propiedad en una configuración (`${...}`) y en DataWeave (`p()`).
- Diagnosticar el error "no encuentra la property" (nombre mal escrito o archivo no registrado).
- Explicar cómo se elige el archivo de propiedades según el entorno y por qué esa propiedad no puede estar dentro del mismo archivo.

Confusiones típicas que señala el video:
- Crear el archivo y olvidar el elemento **Configuration properties** [00:17–00:19].
- Espacios invisibles al final de un valor en `.properties` [00:11–00:13].
- Cambiar a mano el nombre del archivo para cada entorno: sigue siendo un valor fijo en el código [00:21–00:22].
- Usar `${...}` dentro de DataWeave en vez de `p()` [00:15].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Un archivo por entorno** con las mismas claves: `dev.yaml`, `qa.yaml`, `prod.yaml` [00:06–00:07, 00:19–00:20].
2. **Agrupa por sistema** (`dummyjson.host`, `dummyjson.port`, `db.user`…) para que se lea fácil [00:07–00:09].
3. **Registra el archivo** con Configuration properties en `global.xml`, con el nombre armado desde una propiedad: por ejemplo `file="${env}.yaml"` [00:22–00:23].
4. **Da un valor por defecto a `env`** para trabajar en local sin argumentos: un *global property* `env = dev` (así lo hace la serie 1, sesión 2); el `-Denv` o la propiedad del despliegue lo sobrescribe.
5. **Pasa `-Denv=dev`** en *Run/Debug Configurations → Arguments* para probar otros entornos en Studio [00:23–00:24].
6. **En DataWeave** usa `p('clave')` y convierte si necesitas otro tipo (`p('app.limite') as Number`).
7. **Contraseñas con secure properties**, nunca en texto plano (ver la nota de propiedades seguras del libro).

### 5. Para estudiar

- Mueve host, puerto y paths del proyecto del video 6 a `dev.yaml` y `prod.yaml`; registra el archivo con `${env}`; prueba con y sin `-Denv`.
- Provoca a propósito el error de property no encontrada (nombre mal escrito y archivo sin registrar) y lee el mensaje.
- Para profundizar con el material ya ingerido:
  - Serie 1, sesión 2 (`videos/serie-1.md`): `config-${env}`, *global property* `env` y sobrescritura en Runtime Manager.
  - `libros/anypoint-platform/capitulos/cap10-security-identity-secrets.md` (secretos y propiedades seguras).
  - `libros/anypoint-platform/capitulos/cap02-setting-up-development-environment.md` (estructura del proyecto).

### 6. Nota de verificación

- `${...}`, `p()` / `Mule::p()`, Configuration properties y el error por property no encontrada coinciden con lo que conozco de Mule 4; no lo revisé hoy en docs.mulesoft.com.
- **Qué valor lleva `env`**: la transcripción no deja claro si `env` es el nombre completo del archivo (`prod.yaml`) o solo el entorno (`prod`, con `file="${env}.yaml"`). Ambas formas funcionan si son coherentes; la convención más común es la segunda.
- El video no define un valor por defecto para `env`; sin `-Denv` el despliegue fallaría. La serie 1, sesión 2, lo resuelve con un *global property*.
- "El espacio final cuenta como parte del valor en `.properties`": coincide con lo que conozco; no verificado.
- El número del video en la serie (7) no coincide con el del título ("Curso Básico #6").

---

## Serie 2 · Video 8: Nuestra primera API con RAML (Curso Básico #7)

- **Video:** [Nuestra primer API con RAML | Mulesoft: Curso Básico #7](https://www.youtube.com/watch?v=UXoUqsJHFeI)
- **Duración:** 1:40 · **Temas:** designing-apis, api-implementation, connectors, structuring-apps, dataweave
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-2/video-8-tactiq-free-transcript-UXoUqsJHFeI.txt`

Deja el Scheduler y usa el **HTTP Listener** para recibir peticiones. Muestra el problema de tener un Listener por ruta y método (o un Choice gigante), y lo resuelve con una especificación **RAML** escrita en Code Builder y **APIkit** en Studio: genera los flujos, valida las peticiones contra los tipos y enruta. Termina implementando cada flujo con llamadas a DummyJSON y transformaciones DataWeave. La transcripción disponible está traducida al inglés; el video original es en español. Video agregado por la persona el 2026-11-18 (el 8.º de la serie).

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:03] | HTTP Listener | Nuevo *source*: recibe peticiones HTTP y crea el evento. Necesita una configuración y un *path*. Él crea la configuración del Listener en el mismo archivo que lo usa (por fallos ocasionales de Studio), como única excepción a `global.xml`. |
| [00:03–00:07] | Host y puerto en propiedades | `${http.host}` y `${http.port}` (valores `0.0.0.0` y `8081`); según él, esos nombres exactos son los que usa la nube al desplegar. Path `/api/posts`. |
| [00:07–00:10] | Primera petición | Postman a `http://0.0.0.0:8081/api/posts`; sin el path correcto, 404 "no listener". El payload llega vacío en un GET; en *attributes*: path, método, headers, query params, URI params. |
| [00:10–00:13] | Pasamanos a DummyJSON | Listener `/api/products` → HTTP Request a DummyJSON → la respuesta vuelve al cliente. Errores corregidos en vivo (host mal escrito). |
| [00:13–00:15] | Allowed methods | Sin restricción, el Listener acepta cualquier método. En *Advanced → Allowed methods* se limita (por ejemplo GET); un POST recibe **405**. Un segundo Listener con el mismo path y POST para crear. |
| [00:18–00:25] | El problema | Un Listener por recurso y método, o un Choice gigante que enrute por método y ruta: ninguno escala. La solución es una **especificación de API** + **APIkit**. |
| [00:25–00:31] | Crear la especificación | En Studio, *API Specification Project* pide cuenta de Anypoint; alternativa: Code Builder → *Design an API*, sin iniciar sesión. RAML u OpenAPI. Según él, RAML está discontinuado (repositorio archivado en 2024), pero el examen todavía lo pide. |
| [00:32–00:44] | RAML: base y GET | `#%RAML 1.0`, `title`, `version: v1`, `baseUri: http://0.0.0.0:8081/{version}/api`. Recurso `/products:` con `get:`, `displayName`, `responses: 200: body: application/json: example: \|` con un JSON propio (campos en español). Ctrl+Espacio autocompleta. |
| [00:44–00:55] | POST con tipo | `post:` con `body: application/json: type: object, properties:` (`id: integer`, `titulo: string`…), facetas `minimum` y `required`; un `example` que no cumple el tipo da error en el editor. Respuesta `201`. |
| [00:51–00:58] | URI param | `/{id}:` anidado bajo `/products` con `uriParameters: id: type: integer`; `get` y `delete` por ID. |
| [00:58–01:02] | Consola en Code Builder | Comando de la paleta para ver la documentación y probar; en Anypoint Platform, el *mocking service* responde con los ejemplos. |
| [01:02–01:05] | Llevar la RAML a Studio | Se copia a `src/main/resources/api`. Lo ideal es consumirla como dependencia desde Exchange (se verá más adelante). Clic derecho → *Generate flows from local REST API*. |
| [01:05–01:10] | Lo que genera APIkit | Flujo principal (Listener `/api/*` + APIkit Router), flujo de consola y **un flujo por cada método de cada recurso** (`get:\products`, `post:\products`, `get:\products\{id}`, `delete:\products\{id}`). No convertirlos en subflows: el router los necesita como flujos. |
| [01:10–01:17] | Probar con la consola de APIkit | `http://localhost:8081/console`. El router mira método y ruta y envía al flujo; los flujos generados responden con los ejemplos. Con un `id` de tipo string en el POST, APIkit rechaza la petición: **400 Bad Request**. Fallo visual de la consola: recargar o usar Postman. |
| [01:18–01:31] | Implementar | GET: Request a DummyJSON y Transform Message con `map` para devolver el formato definido (`data`, `total`, `skip`, `limit`). DELETE y GET por ID: URI param desde `attributes.uriParams.id` a una variable y luego al Request. POST: transformar del español al inglés que espera DummyJSON, salida JSON. Loggers de inicio y fin en cada flujo. |
| [01:32–01:40] | Prueba y cierre | Todos los métodos funcionan. El ciclo: diseñar la especificación → generar con APIkit → implementar cada flujo. Tarea: agregar `/users`. Próximo video: errores. |

### 2. Conceptos clave

- **HTTP Listener** (`connectors`) [00:01–00:10]: *source* que espera peticiones HTTP en un host, un puerto y un *path*. Su configuración (global) define protocolo, host y puerto; el componente define el path y, en *Advanced*, los **allowed methods**.
- **`0.0.0.0` y `8081`** [00:06–00:07]: escuchar en todas las interfaces de la máquina, en el puerto habitual de Mule en local.
- **Attributes de una petición entrante** (`mule-events`) [00:09–00:10]: `attributes.requestPath`, `method`, `headers`, `queryParams`, `uriParams`. En un GET el payload llega vacío.
- **Allowed methods** [00:13–00:14]: si está vacío acepta todos; con una lista (por ejemplo `GET`), otro método recibe **405 Method Not Allowed**.
- **Especificación de API** (`designing-apis`) [00:23–00:31]: contrato que define recursos, métodos, parámetros, tipos y respuestas. Sirve como documentación para los consumidores, para validar las peticiones y para generar la implementación. Formatos: RAML y OpenAPI (OAS).
- **RAML básico** [00:32–00:58]:
  - Encabezado `#%RAML 1.0`, `title`, `version`, `baseUri` (puede usar `{version}`).
  - Recurso `/products:`; métodos `get:`, `post:`, `delete:`; recurso anidado con URI param `/{id}:` y `uriParameters`.
  - `displayName`, `description`, `responses` con código, `body`, MIME type y `example` (bloque literal con `|`).
  - `body` con `type: object` y `properties`; facetas `required`, `minimum`; el `example` se valida contra el tipo.
- **APIkit** (`api-implementation`) [01:02–01:17]:
  - *Scaffolding*: generar flujos desde la especificación (*Generate flows from local REST API*); se puede volver a ejecutar cuando cambia la especificación.
  - Flujo principal: Listener con path `/api/*` y **APIkit Router**, que elige el flujo según **método + recurso**.
  - Flujo de consola: `/console/*` para probar la API.
  - **Un flujo privado por cada método de cada recurso**, con nombre `metodo:\recurso:config` (sin *source*, y deben seguir siendo flujos).
  - Los flujos generados traen un Transform Message con el ejemplo de respuesta y, si hay URI param, una variable con su valor.
  - **Validación**: si el cuerpo, un parámetro o un header no cumple el contrato, APIkit lanza error y responde **400**.
- **Implementación** [01:18–01:31]: cada flujo hace su trabajo (aquí, llamar a DummyJSON) y transforma la respuesta al formato prometido en la especificación.
- **Dónde vive la RAML** [01:03]: en local va en `src/main/resources/api`; lo recomendado es publicarla en Exchange e importarla como dependencia.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`api-implementation` (7%)**: dada una RAML, **contar los flujos** que genera APIkit (uno por método de cada recurso, más el principal y el de consola); explicar qué hace el router; qué pasa si la petición no cumple el tipo (400) y si el método no está definido (405); por qué los flujos generados no son subflows.
- **`designing-apis` (8%)**: leer una RAML y decir recursos, métodos, URI params, cuerpo esperado, campos obligatorios y respuestas; reconocer un `example` que no cumple su tipo.
- **`connectors` (10%)**: configurar un Listener (configuración, path, allowed methods); explicar 404 por path inexistente y 405 por método no permitido.

Confusiones típicas que señala el video:
- Un Listener sin *allowed methods* acepta un POST en una ruta pensada para GET [00:12–00:13].
- Olvidar el prefijo `/api` (y la versión, si la `baseUri` la incluye) al llamar a la API [01:10–01:11].
- Convertir en subflow un flujo generado por APIkit porque "no tiene source" [01:08–01:09].
- Devolver lo que responde el sistema de fondo en lugar del formato que promete la especificación [01:22–01:23].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Diseña primero la especificación** con tipos, campos obligatorios y ejemplos [00:44–00:55]; el contrato valida por ti las peticiones.
2. **Host y puerto del Listener en propiedades** (`${http.host}`, `${http.port}`) [00:04].
3. **Genera los flujos con APIkit** y vuelve a generar cuando cambie la especificación [01:04–01:06]; no edites a mano lo que el scaffolding administra.
4. **En cada flujo generado**: logger de inicio, guarda los parámetros en variables (`vars.id = attributes.uriParams.id`), llama al sistema, transforma al formato del contrato, logger de fin [01:18–01:31].
5. **Transforma en los dos sentidos** [01:21–01:31]: respuesta del sistema → formato de tu API; cuerpo de tu API → formato que espera el sistema (`output application/json`).
6. **URI params al HTTP Request** como objeto: path `/products/{id}`, URI parameters `#[{"id": vars.id}]` [01:27–01:29].
7. **Publica la especificación en Exchange** y consúmela como dependencia, en lugar de copiarla al proyecto [01:03].
8. **Prueba con Postman** si la consola de APIkit falla [01:14–01:15].

Esqueleto RAML del video (resumido):
```yaml
#%RAML 1.0
title: demo app
version: v1
baseUri: http://0.0.0.0:8081/{version}/api
/products:
  get:
    displayName: Obtener productos
    responses:
      200:
        body:
          application/json:
            example: |
              { "data": [ { "id": 1, "titulo": "..." } ], "total": 194, "skip": 0, "limit": 1 }
  post:
    body:
      application/json:
        type: object
        properties:
          id: { type: integer, minimum: 1, required: true }
          titulo: { type: string, required: true }
          descripcion: { type: string, required: false }
    responses:
      201:
        body:
          application/json:
            example: { "message": "Resource created" }
  /{id}:
    uriParameters:
      id: { type: integer }
    get:
    delete:
```

### 5. Para estudiar

- Reproduce la API: RAML con `/products` (GET, POST) y `/products/{id}` (GET, DELETE), scaffolding, y comprueba que se generan 4 flujos + principal + consola.
- Envía un POST con `id` como texto y mira el error 400; luego quita un campo `required`.
- Tarea del autor [01:36–01:37]: agrega `/users` con sus métodos, vuelve a generar e implementa contra DummyJSON.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap06-api-design-contract-first.md` (RAML, APIkit, diseño por contrato).
  - Serie 1, sesiones 2 y 5 (`videos/serie-1.md`): flujos que genera APIkit, `vars.httpStatus` y manejadores de error de APIkit.
  - Serie 2, videos 6 y 7 de este archivo: HTTP Request y propiedades.
  - Tutoriales RAML 100 y 200 en raml.org.

### 6. Nota de verificación

- **"Hay que usar `http.port` porque en la nube cada réplica necesita otro puerto (8081, 8082)"** [00:04–00:05]: la recomendación de usar `${http.port}` es correcta (CloudHub inyecta esa propiedad), pero la explicación de las réplicas no lo es: cada réplica o worker corre aislado y puede usar el mismo puerto. Verificar en la doc de despliegue de CloudHub.
- **Configuración del Listener en el mismo archivo que el Listener** [00:02–00:03]: es una costumbre del autor por fallos ocasionales de Studio. La serie 1, sesión 2, recomienda `global.xml` para todo salvo la configuración del APIkit Router. Ninguna de las dos es una regla oficial.
- **"RAML está discontinuado, repositorio archivado en febrero de 2024"** [00:33–00:34]: **no verificado**. MuleSoft sigue soportando RAML 1.0 en Design Center y APIkit, y la guía del examen lo pide.
- **Flujos generados con nombre `metodo:\recurso`**, validación con 400, consola en `/console` y que no deben pasarse a subflow coinciden con lo que conozco de APIkit 4; no revisado hoy en docs.mulesoft.com.
- La transcripción está **traducida al inglés** desde el original; algunos fragmentos de código se perdieron en la traducción (por ejemplo los nombres de variables), así que el esqueleto RAML de la sección 4 es una reconstrucción a partir de lo que describe.
- El número del video en la serie (8) no coincide con el del título ("Curso Básico #7").
