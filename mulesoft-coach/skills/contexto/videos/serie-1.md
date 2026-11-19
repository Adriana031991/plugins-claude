---
serie: 1
titulo: "MCD Level 1 Exam Prep (Digital Dee, 2025)"
idioma: inglés
tipo: apoyo
videos: 6
fuente: "documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/"
temas: [application-networks, herramientas-desarrollo, designing-apis, api-implementation, structuring-apps, deploying-managing, mule-events, build-dependencias, reuso-exchange, debugging, processing-records, dataweave, error-handling, routing]
resumido: 2026-11-18
estado: confirmado
confirmados: [1, 2, 3, 4, 5, 6]
---

<!-- Notas:
- Un solo archivo para toda la serie (decisión del 2026-11-18). Cada sesión tiene las mismas 6 secciones: resumen por bloques, conceptos clave, para evaluar, para desarrollar, para estudiar y nota de verificación.
- Es una nota de estudio y contexto, no una transcripción. Las transcripciones completas (tactiq, automáticas, con errores de reconocimiento) siguen en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto de cada video.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. "Para evaluar" no son preguntas para copiar: indica qué conviene evaluar; las preguntas se basan en la doc oficial (regla de la skill evaluacion).
- Sesiones 1 a 3 confirmadas por la persona el 2026-11-17; 4 a 6 el 2026-11-18.
-->

# Serie 1: MCD Level 1 Exam Prep (Digital Dee, 2025)

Seis sesiones en vivo de preparación para el examen MuleSoft Certified Developer – Level 1 (Mule 4, Anypoint Studio). Instructora: "Digital Dee" (Diane Kesler), instructora certificada de MuleSoft. Varias sesiones tienen alumnos que preguntan y, en la sesión 4, presentan ellos.

| Sesión | Tema | Pesos del examen que cubre |
|---|---|---|
| 1 | Kickoff: formato del examen, API-led, C4E | application-networks |
| 2 | Ciclo de vida de la API, RAML, APIkit, entornos | designing-apis, api-implementation, structuring-apps, deploying-managing |
| 3 | Despliegue, Mule domain, proxy vs. basic endpoint, políticas, Mule event | deploying-managing, structuring-apps, mule-events, debugging |
| 4 | DataWeave y Batch (presentan alumnos) | dataweave, processing-records |
| 5 | Manejo de errores | error-handling |
| 6 | Governance, routers, Validation, versionado semántico, día del examen | routing, reuso-exchange, designing-apis |

Puntos pendientes de verificar que se repiten entre sesiones: datos de logística del examen (sesiones 1 y 6) y si API Governance bloquea la publicación (sesión 6). **Resuelto el 2026-11-18** en la doc oficial: las variables creadas o cambiadas dentro de **For Each** siguen disponibles después del scope; en **Parallel For Each** no (ver la verificación de la sesión 3).

---

## Serie 1 · Sesión 1: Kickoff (Digital Dee, 2025)

- **Video:** [MCD Level 1 Exam Prep – Session 1 Kickoff | MuleSoft Certification with Digital Dee (2025)](https://www.youtube.com/watch?v=rdOUPEd9U6M)
- **Duración:** 1:22 · **Temas:** application-networks, herramientas-desarrollo, designing-apis
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-1-tactiq-free-transcript-rdOUPEd9U6M.txt`

Instructora: "Digital Dee" (Diane Kesler), instructora certificada de MuleSoft. Sesión en vivo, la primera de seis.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:09] | Cómo estudiar | Practicar con las manos; usar el reporte del examen para atacar los objetivos débiles con una presentación y un flujo de prueba. |
| [00:07–00:18] | Qué entra | Studio (no Code Builder), RAML (OAS solo como mención), 100% Mule 4, leer XML, conceptos de DataWeave. |
| [00:11–00:17] | Formato | 60 preguntas, 120 min, 42 para aprobar; varias respuestas = todo o nada; muchas de escenario. |
| [00:18–00:32] | Logística | Guía en Trailhead, USD 200 / reintento USD 100, mantenimiento anual en Trailhead, examen supervisado online, examen de práctica en PDF. |
| [00:32–00:50] | Evolución de la integración | Punto a punto → hub/colas → ESB → API-led. Ejemplo AS400 + Athena Health con APIs existentes. |
| [00:50–00:59] | Tres capas | System, Process y Experience; no son capas de red; políticas distintas por capa. |
| [01:00–01:20] | C4E y Catalyst | C4E habilita y difunde API-led; Catalyst/Knowledge Hub con *playbooks*; C4E ≠ CoE. |

### 2. Conceptos clave

- **Integración punto a punto** (`application-networks`) [00:35]: cada par de sistemas se conecta con código propio. Problema: "spaghetti integration"; cambiar un sistema obliga a reescribir todas sus conexiones.
- **Hub / cola de mensajes** [00:39]: un intermediario (VM, JMS, Anypoint MQ) desacopla al emisor del receptor y da algo de visibilidad.
- **ESB (Enterprise Service Bus)** [00:40]: las integraciones viven en un runtime central (Mule puede funcionar así). Mejora la gestión, pero las piezas siguen poco desacopladas y poco reutilizables.
- **API-led connectivity** [00:42]: estilo de arquitectura en el que las capacidades se exponen como APIs reutilizables, organizadas en tres capas. Antes de construir se buscan APIs y conectores que ya existan.
- **System API** [00:51]: habla con **un** sistema de registro (BD, Salesforce, AS400), maneja su autenticación y su formato, y entrega los datos en una forma útil. "El mayordomo del sistema".
- **Process API** [00:53]: orquesta varias System APIs para un proceso de negocio (por ejemplo, juntar vuelos de varias aerolíneas, o facturación del paciente). "El comprador".
- **Experience API** [00:56]: adapta los datos al consumidor (móvil, web, Salesforce, el paciente).
- **Las capas no son capas de red** [00:51]: son una forma de organizar. Cada capa tiene necesidades de **políticas** distintas (por ejemplo, limitar el tráfico hacia un sistema viejo).
- **API como producto** [01:02]: una API no es un proyecto; se diseña para que otros la reutilicen.
- **C4E (Center for Enablement)** [01:01]: equipo transversal que difunde y habilita la forma API-led, promueve la reutilización y la mide con KPIs.
- **CoE (Center of Excellence)** [01:18]: grupo de especialistas técnicos (bases de datos, red) que resuelven problemas, por ejemplo en los despliegues. **No es lo mismo que el C4E.**
- **Catalyst / Knowledge Hub** [01:06]: biblioteca de *playbooks* de MuleSoft con tres pilares: business outcomes, technology (platform, projects) y organization (C4E, soporte, formación). Las cuentas de prueba no tienen acceso.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`application-networks`, peso 7%):
- Dado un escenario, **elegir la capa** correcta para una API (system, process o experience) y justificarlo.
- Explicar **por qué API-led** es mejor que punto a punto o que un ESB en términos de desacoplamiento, reutilización y cambio de sistemas.
- Distinguir **C4E** de **CoE**, y decir cuál es el objetivo del C4E (habilitar, no controlar).
- Reconocer que las capas **no** son capas de red.

Confusiones típicas que señala el video:
- Pensar que "API-led" es una tecnología o un producto; es un estilo de arquitectura.
- Responder con la práctica de otra empresa en lugar de "como lo haría MuleSoft" (por ejemplo, defender un punto a punto rápido) [00:15].
- Creer que un C4E ya existe porque la empresa tiene un CoE [01:18].

Estrategia de examen [00:11–00:17]: marcar y seguir en las preguntas largas; leer bien cuántas respuestas se piden.

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Antes de construir, busca** [00:44–00:49]: en Exchange (conectores y APIs de MuleSoft y de tu organización), en el portal del proveedor del sistema y en repositorios públicos de APIs. En el ejemplo, el conector de AS400 ya existía y Athena Health publicaba sus APIs.
2. **Una System API por sistema**: encapsula credenciales, protocolo y formato de ese sistema; nadie más debería conocerlos.
3. **Orquesta en Process APIs**: la lógica que combina sistemas va aquí, no en las System APIs ni en el cliente.
4. **Adapta en Experience APIs**: un consumidor nuevo (por ejemplo, una app móvil) suele significar una Experience API nueva, no cambiar las de abajo.
5. **Aplica políticas por capa**: rate limiting para proteger un sistema lento, autenticación distinta según el consumidor.
6. Si la organización no tiene C4E, **al menos un equipo chico** que cuide los estándares y la reutilización; si no, "la importancia de API-led se diluye" [01:02].

### 5. Para estudiar

- Actividad que propone la instructora [00:03–00:08]: elige un objetivo que no domines, **prepara una presentación y un flujo de prueba** que lo expliquen. Explicarlo muestra lo que de verdad no se sabe.
- Lecturas que recomienda [00:34]: la tesis de Roy Fielding (REST, 2000) y Enterprise Integration Patterns (este último está en "Descartados por ahora" en enlaces-oficiales.md, por decisión tuya).
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.3 (API-led y cuándo aplicarlo) y §1.2 (control plane / runtime plane).
  - `libros/anypoint-platform/capitulos/cap16-enterprise-architecture-migration.md` §16.1 (diseño de capas reutilizables).
  - `libros/whitepaper-seguridad/documento.md` (application network, defensa en profundidad).
  - Catalyst / Knowledge Hub: C4E Charter (si tu cuenta tiene acceso).

### 6. Nota de verificación

- Los **porcentajes** que menciona coinciden con `taxonomy.json` (application-networks 7, structuring-apps 10, mule-events 10).
- **No verificado** contra la guía oficial (la página de help.salesforce no cargó el 2026-11-17): 60 preguntas, 120 minutos, 42 para aprobar, USD 200 / USD 100, el mantenimiento anual y el cambio a Pearson VUE. Son datos de un video de 2025; revísalos en la guía antes de inscribirte.
- "No hay preguntas de Code Builder" y "el currículo pasará a OAS" son **opiniones o pronósticos** de la instructora.
- La comparación "ESB vs. API-led" es la visión de MuleSoft; el ESB no es incorrecto en sí, solo menos reutilizable.

---

## Serie 1 · Sesión 2: Ciclo de vida de la API, RAML y estructura del proyecto (Digital Dee, 2025)

- **Video:** [MCD Level 1 Exam Prep – Session 2 | MuleSoft Certification with Digital Dee (2025)](https://www.youtube.com/watch?v=RsOUjUoyfcQ)
- **Duración:** 1:21 · **Temas:** designing-apis, api-implementation, structuring-apps, deploying-managing, mule-events, build-dependencias, reuso-exchange
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-2-tactiq-free-transcript-RsOUjUoyfcQ.txt`

Sesión en vivo con una alumna que hace preguntas. Recorre el ciclo de vida completo de una API (diseñar → implementar → desplegar → administrar → monitorear), después baja al detalle de RAML y termina con la estructura de un proyecto preparado para varios entornos.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:07] | Diseño | Si no hay una API reutilizable, se escribe la especificación (RAML u OAS) en Design Center con datos de ejemplo; el *mocking service* los usa en el API console. Se pide opinión temprano: "design first". |
| [00:03–00:11] | Exchange | Publicar crea un **API portal**; primero es privado de la organización y después se puede compartir en el portal público. Portal ≠ console. API Notebook existe, pero no se sabe si entra. |
| [00:07–00:18] | Implementación | En Studio, APIkit genera desde la especificación el flujo principal, el de consola, **un flujo privado por cada par método-recurso** y manejo de errores por defecto. Se prueba local con ARC o Postman. |
| [00:18–00:21] | Destinos de despliegue | CloudHub 1.0 (contenedor en EC2), CloudHub 2.0 (pod en Kubernetes), servidores del cliente y Runtime Fabric. |
| [00:21–00:27] | Archivo desplegable | Exportar con "Include project modules and dependencies" = **deployable archive** (69 MB en el ejemplo). Sin eso es un paquete liviano (43 KB) que solo sirve para pasarlo a otro Studio. |
| [00:27–00:33] | API Manager | La URL de la app en CloudHub queda abierta. Se administra con **Mule Gateway**: basic endpoint o proxy. Administrar sin políticas sigue siendo inseguro. Familias de políticas y monitoreo (Monitoring, Analytics, Visualizer). |
| [00:33–00:42] | RAML: métodos, fragmentos | RAML = RESTful API Modeling Language. Métodos HTTP (repasar PUT vs PATCH). Fragmentos de tipo de dato y de ejemplo; un fragmento publicado en Exchange es de solo lectura. |
| [00:42–00:59] | Parámetros, request, response | Query params vs URI params; `Tipo[]` = arreglo; POST/PUT/PATCH definen el *body*; guardar parámetros en variables antes de cruzar un *transport boundary*. Relación con el Mule event. |
| [01:00–01:08] | Entornos | Tipos de entorno: design (en desuso, según ella), **sandbox** (dev, test, QA…) y **production**; el SLA de soporte es más rápido en producción. Cada entorno tiene credenciales distintas. |
| [01:08–01:21] | Estructura del proyecto | Un archivo de propiedades por entorno + propiedad `env`; `global.xml` con todos los elementos globales (salvo la config del router); interfaz e implementación en XML separados. |

### 2. Conceptos clave

- **Ciclo de vida de la API** (`designing-apis`, `deploying-managing`) [00:00, 00:33]: diseñar la especificación → publicarla y recibir opiniones → implementarla como app Mule → desplegarla → administrarla y asegurarla → monitorearla. Se trabaja por iteraciones.
- **Design first** [00:06]: diseñar el contrato con datos de ejemplo antes de construir, para que los interesados pidan cambios cuando todavía son baratos (por ejemplo, `date` → `datetime`).
- **Mocking service** [00:02]: responde con los ejemplos de la especificación; así el API console funciona sin implementación.
- **API console vs. API portal** [00:04, 00:10]: el *console* es el área donde se prueban recursos y métodos (en Design Center y también dentro de Exchange). El *portal* es la página completa de la API en Exchange. Truco de la alumna: "no hay portal hasta que publicas en Exchange".
- **Exchange privado vs. portal público** [00:04–00:05]: al publicar, la API la ve solo la organización; se puede compartir en el portal público y elegir qué se muestra. Design Center también permite activar una URL pública del *mock* para interesados externos [00:37].
- **APIkit Router** (`api-implementation`) [00:07–00:13]: a partir de la especificación genera el flujo principal (con el listener y el router), el flujo de consola, **un flujo privado por cada par método-recurso** (por ejemplo `get:\patients`, `post:\patients`, `get:\patients\{id}`…) y el manejo de errores estándar. Son privados porque no tienen *source*. Una pregunta típica: "¿cuántos flujos genera esta especificación?".
- **Prefijo `/api/*`** [00:13, 00:17]: el listener que genera APIkit escucha con comodín, así que las rutas llevan el prefijo (`/api/patients`).
- **Despliegue en CloudHub** (`deploying-managing`) [00:20]: en CloudHub 1.0 la app corre aislada en un contenedor sobre EC2 de AWS; en CloudHub 2.0 corre en un *pod* de Kubernetes. Runtime Fabric y los servidores propios son las opciones administradas por el cliente.
- **Deployable archive** (`build-dependencias`) [00:21–00:27]: el JAR que se sube a Runtime Manager o usa un pipeline debe incluir módulos y dependencias. El paquete liviano no se puede desplegar; al importarlo, Studio vuelve a resolver las dependencias.
- **Mule Gateway: basic endpoint vs. proxy** [00:28–00:30]: dos formas de aplicar las políticas. El examen pide saber que existen; los cursos usan el proxy, aunque en la práctica ella suele usar el basic endpoint. Flex Gateway queda fuera del MCD1.
- **Familias de políticas** [00:30–00:32]: seguridad, calidad de servicio (rate limiting, **Rate Limiting – SLA based**, que combina límite con client ID enforcement y niveles SLA), cumplimiento (CORS…), transformación (inyectar o quitar encabezados) y troubleshooting (logging). Para MCD1 basta con saber qué hace cada una a alto nivel.
- **Fragmentos RAML** (`designing-apis`, `reuso-exchange`) [00:37–00:42]: archivos reutilizables (data type, named example, trait, resource type, library, overlay…). Uno publicado en Exchange es de solo lectura y lo cambia su dueño: así se estandarizan los tipos de datos en la organización. Se pueden agregar campos al usarlo en tu especificación.
- **Ejemplos en línea vs. en archivo** [00:40]: en línea para valores cortos; en archivo (o en Exchange) para reutilizarlos sin repetirlos.
- **Query parameter vs. URI parameter** [00:42–00:50]: el query param va después de `?` y filtra (`?lastName=D`), se lee con `attributes.queryParams`; el URI param es parte de la ruta (`/patients/{id}`), identifica un recurso, se lee con `attributes.uriParams`.
- **`Patient[]`** [00:46]: los corchetes indican que la respuesta es un arreglo (uno o más elementos).
- **Body en POST/PUT/PATCH** [00:50–00:51]: la especificación define el cuerpo de la petición; el GET no lo tiene. Lo que llega queda en el *payload*.
- **Mule event y transport boundary** (`mule-events`) [00:48–00:58]: en un GET el *payload* llega vacío y la información está en *attributes*. Al cruzar un *transport boundary* los *attributes* se reemplazan, por eso conviene guardar los parámetros en variables al inicio. (Ver la nota de verificación: un *flow reference* no los borra.)
- **Tipos de entorno** (`deploying-managing`) [01:02–01:05]: design, sandbox y production. Los nombres (dev, test, QA, stage) los elige cada organización; el **tipo** es lo que importa. Cada línea de negocio tiene sus entornos.
- **Configuración por entorno** (`structuring-apps`) [01:06–01:18]: un archivo `config-<env>` por entorno en `src/main/resources`, la propiedad global `env` (con valor por defecto `dev`) y `${env}` en el nombre del archivo; al promover se sobrescribe `env` en Runtime Manager (pestaña Properties). Distingue mayúsculas.
- **`global.xml`** [01:11–01:14]: todos los elementos globales (conectores, error handler global) en un solo archivo. Excepción: la configuración del APIkit Router queda junto a su interfaz.
- **Interfaz vs. implementación** [01:10, 01:19]: los flujos generados por APIkit solo hacen *flow reference*; la lógica vive en otro XML. Así, si se vuelve a generar la interfaz, la lógica no se pierde.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`designing-apis` (8%)**: distinguir API console, API portal y mocking service; saber dónde vive cada uno (Design Center, Exchange). Leer RAML y decir si un parámetro es query o URI, si la respuesta es un arreglo y si el método lleva body. Reconocer tipos de fragmento y por qué se publican en Exchange.
- **`api-implementation` (7%)**: dada una especificación, **contar los flujos** que genera APIkit (uno por cada par método-recurso, más el principal y el de consola) y armar la URL correcta con el prefijo `/api/`.
- **`mule-events` (10%)**: decir qué hay en payload, attributes y variables en distintos puntos de un flujo; qué pasa con los attributes tras una operación de conector.
- **`structuring-apps` (10%)**: explicar cómo `env` y `${env}` eligen el archivo de propiedades; dónde van los elementos globales.
- **`deploying-managing` (7%)**: elegir qué archivo se sube a Runtime Manager; qué pasa si se administra una API sin políticas; tipos de entorno; basic endpoint vs. proxy a alto nivel; qué política combina rate limiting y client ID.
- **`build-dependencias`**: deployable archive vs. paquete liviano.

Confusiones típicas que señala el video:
- Llamar "console" al portal o al revés [00:04, 00:09].
- Creer que una API administrada en API Manager ya está protegida; sin políticas sigue abierta [00:30].
- Exportar sin "Include project modules and dependencies" y luego no poder desplegar [00:23–00:26].
- Pensar que lo que está en la especificación ya funciona; la lógica (consultas, transformaciones) se construye en la app [00:55–00:56].
- Confundir PUT con PATCH [00:36].
- Escribir la lógica dentro de los flujos generados por APIkit [01:19].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Diseña y publica primero** [00:02–00:07]: especificación en Design Center con ejemplos, pruébala en el API console con el mock, compártela (URL pública del mock o Exchange) y corrige antes de implementar.
2. **Reutiliza tipos de datos** [00:37–00:42]: si el tipo ya existe en Exchange, impórtalo como fragmento en lugar de reescribirlo; si es tuyo y lo usarán otros, publícalo.
3. **Genera la interfaz con APIkit** [00:07–00:13] y **separa la implementación**: en cada flujo generado solo un *flow reference* a un flujo en `implementation.xml` (u otro archivo por recurso) [01:19].
4. **Guarda los parámetros en variables al principio** [00:48–00:49]: `vars.patientId = attributes.uriParams.id`, `vars.lastName = attributes.queryParams.lastName`, antes de llamar a una base de datos u otro sistema.
5. **POST con confirmación** [00:52–00:55]: Transform Message para llevar el body al formato de la tabla (DataSense muestra las columnas si la conexión se probó bien) → Insert → Select del registro recién creado → respuesta con ese registro en vez de un mensaje fijo.
6. **Prueba en local** [00:16–00:18] con Advanced REST Client, Postman o curl contra `http://localhost:8081/api/<recurso>` (el puerto depende del listener que generaste; ver la verificación).
7. **Estructura para varios entornos** [01:08–01:18]:
   - `src/main/resources/config-dev.yaml`, `config-test.yaml`, `config-prod.yaml` (o `.properties`), con host, usuario y contraseña distintos por entorno.
   - En `global.xml`: `<global-property name="env" value="dev"/>` y `<configuration-properties file="config-${env}.yaml"/>`, además de todas las configuraciones de conectores y el manejo de errores global.
   - Al promover, en Runtime Manager → Properties: `env=test` o `env=prod`. En un pipeline se pasa la misma propiedad.
   - No dejes contraseñas en texto plano: usa propiedades seguras (`propiedades-seguras`); ella lo ubica en MCD2, pero conviene hacerlo desde el principio.
8. **Despliega con un deployable archive** [00:21–00:26]: exporta incluyendo módulos y dependencias, o deja que Maven lo construya en el pipeline.
9. **Asegura con API Manager** [00:27–00:32]: administra la API (basic endpoint o proxy) y aplica al menos client ID enforcement o rate limiting; configura alertas en Monitoring.

### 5. Para estudiar

- Ejercicio sugerido: toma una especificación con 3 recursos y 5 métodos, cuenta cuántos flujos debería generar APIkit, genera el proyecto en Studio y compara.
- Exporta un proyecto dos veces (con y sin dependencias), compara tamaños y prueba subir el liviano a Runtime Manager para ver el error.
- Arma un proyecto con `config-dev` y `config-test`, cambia `env` y comprueba en el log qué valores carga.
- Recurso que comparte: un artículo sobre métodos HTTP en MuleSoft (no se dio la URL en la transcripción).
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap06-api-design-contract-first.md` (RAML, fragmentos, APIkit).
  - `libros/anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` (Mule event, attributes, variables).
  - `libros/anypoint-platform/capitulos/cap02-setting-up-development-environment.md` (estructura del proyecto, propiedades).
  - `libros/anypoint-platform/capitulos/cap11-api-management-policies-governance.md` (API Manager, políticas).
  - `libros/anypoint-platform/capitulos/cap13-deploying-to-cloudhub.md` (CloudHub 1.0 y 2.0, entornos).
  - `libros/anypoint-platform/capitulos/cap10-security-identity-secrets.md` (propiedades seguras).
  - Doc oficial: APIkit, configuring properties y tipos de entorno (ver `enlaces-oficiales.md`).

### 6. Nota de verificación

- **Corrección importante**: un *flow reference* **no** borra los attributes; el evento pasa igual al flujo llamado. Lo que los reemplaza es una operación de conector que cruza un *transport boundary* (HTTP Request, consulta de base de datos, VM, etc.), y llamar a otra app pierde también las variables. El consejo de guardar parámetros en variables sigue siendo bueno. Verificar en la doc de Mule event antes de usarlo en una pregunta.
- El puerto: la transcripción dice "8881", probablemente un error de reconocimiento; el listener que genera APIkit usa **8081** por defecto. No se mostró en pantalla en texto.
- "El entorno de tipo design ya no se usa" es una **opinión** de la instructora; no verificado.
- API Notebook: ella misma duda de que siga o de que entre al examen. **No verificado**.
- "Flex Gateway no entra en MCD1" y "en la práctica se usa más el basic endpoint" son **opiniones**. Flex Gateway hoy se llama Omni Gateway (ver libro Agent Fabric).
- El libro de Anypoint Platform trata APIkit (cap. 6), pero **no** cubre la opción de exportación con dependencias, la política Rate Limiting – SLA based ni el patrón `config-${env}`. Coinciden con lo que conozco de la doc oficial, pero falta revisarlos en docs.mulesoft.com antes de basar una pregunta en ellos.
- Los porcentajes de la sección 3 vienen de `taxonomy.json`.

---

## Serie 1 · Sesión 3: Despliegue, gestión de APIs y Mule event (Digital Dee, 2025)

- **Video:** [MCD Level 1 Exam Prep – Session 3 | MuleSoft Certification with Digital Dee (2025)](https://www.youtube.com/watch?v=GH2wWxMPJWE)
- **Duración:** 1:21 · **Temas:** deploying-managing, structuring-apps, mule-events, debugging, processing-records
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-3-tactiq-free-transcript-GH2wWxMPJWE.txt`

Sesión en vivo con una alumna. Cubre el objetivo "deploying and managing APIs and integrations" (opciones de runtime, Mule domain, proxy vs. basic endpoint, políticas) y empieza "Mule events" (attributes, variables, payload, logger y niveles de log).

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:05] | Control plane y runtimes | Una sola cuenta de Anypoint administra despliegues en CloudHub 1.0, CloudHub 2.0, Runtime Fabric y servidores propios (hybrid). Experiencia real migrando de CH1 a CH2: hay que volver a desplegar. VM queues no persistentes en CH2. |
| [00:05–00:09] | Servidores propios | Instalar el Mule runtime en un servidor (VM, contenedor, nube o PC), correr el **Mule agent** con el comando de Runtime Manager → Servers; el servidor se registra y se monitorea desde el control plane. Trial de 30 días. |
| [00:09–00:20] | Mule domain | Solo en servidores propios: un *domain project* con elementos globales (HTTP listener, BD, VM…) que comparten varias apps del mismo servidor. Se elige el dominio en las propiedades del proyecto. |
| [00:20–00:23] | Versión del runtime | En servidores propios desarrolla con la versión del runtime instalado; en CloudHub MuleSoft actualiza y cada réplica o worker trae su propio runtime. |
| [00:23–00:28] | Private Cloud Edition | Todo dentro de la red del cliente, sin internet público; el control plane se instala como contenedores con algunas APIs de Anypoint (Access Management, API Manager, Runtime Manager). Más para arquitectos. |
| [00:28–00:29] | Runtime Manager | Propiedades al desplegar, logs, diagnóstico; conocerlo a alto nivel. |
| [00:29–00:40] | Proxy application | API Manager → Mule Gateway → proxy: app aparte que se despliega delante de la implementación (Mule o no); requiere una URL existente. El **API instance ID** liga políticas y app. |
| [00:40–00:45] | Basic endpoint (embebido) | Se crea la API administrada **antes** de desplegar; la URL es opcional. En la app: elemento global **API Autodiscovery** con el ID (por propiedad) y el flujo principal; al desplegar se pasa el valor y la API queda activa. |
| [00:45–00:50] | Cuándo usar cada uno | Embebido: menos apps y menos vCores. Proxy: delante de apps no Mule, o para aislar políticas pesadas (por ejemplo una caché grande). 100 apps con proxy = 200 apps. |
| [00:50–00:58] | Políticas | Seguridad (IP allow/block list, JWT, JSON/XML threat protection, basic auth simple y LDAP, tokenización solo RTF), calidad de servicio (rate limiting, SLA based, spike control, caching), cumplimiento (CORS), transformación (headers), troubleshooting (logging). Orden, políticas automatizadas, políticas personalizadas, *snippets* en RAML. |
| [00:58–01:13] | Mule event | Attributes del HTTP listener; se pierden al cruzar un *transport boundary*; guardarlos en variables. Payload vacío en GET, cambia en cada paso; lo último es lo que recibe el cliente. Logger, niveles de log y categorías. |
| [01:13–01:15] | Variables y scopes | Afirmación sobre visibilidad de variables creadas dentro de For Each, Parallel For Each y Batch (ver verificación). |
| [01:15–01:21] | Reto | Preparar una mini presentación con demo del objetivo más débil (error handling, DataWeave o batch). |

### 2. Conceptos clave

- **Control plane vs. runtime plane** (`deploying-managing`) [00:02]: el control plane es Anypoint Platform (donde se diseña, administra y monitorea); el runtime plane es donde corren las apps. Una cuenta puede tener varios tipos de runtime a la vez.
- **Opciones de despliegue** [00:01–00:05]: CloudHub 1.0 (workers en EC2), CloudHub 2.0 (réplicas en Kubernetes, *shared space* o *private space*), Runtime Fabric (Kubernetes del cliente) y servidores propios (hybrid). Las cuentas nuevas ya no ofrecen CloudHub 1.0 por defecto, según ella.
- **Migrar de CH1 a CH2** [00:03]: no exige reescribir la app, pero sí volver a desplegarla y revisar diferencias de comportamiento, como las **VM queues persistentes**.
- **Mule agent** [00:07]: se instala en un servidor propio con un comando que entrega Runtime Manager → Servers → Add server; así el servidor queda registrado y se le pueden poner alertas y ver su CPU.
- **Mule domain** (`structuring-apps`) [00:09–00:20]: proyecto aparte (*Mule Domain Project*) que contiene elementos globales compartidos y se despliega en el servidor; las apps que lo eligen (en *Mule project properties*) usan esos elementos y no los repiten en su `global.xml` (salvo la config del APIkit Router). Solo sirve en **servidores propios**; no se despliega a CloudHub. Una app que no lo elige usa el dominio `default`.
- **Versión del runtime** [00:20–00:23]: en servidores propios todas las apps corren en la versión instalada, así que hay que desarrollar con esa; en CloudHub cada réplica o worker lleva su propio runtime.
- **Private Cloud Edition (PCE)** [00:23–00:27]: Anypoint completo dentro de la red del cliente, sin tráfico por internet público. Anypoint Platform por debajo es un conjunto de APIs (Access Management, API Manager, Runtime Manager…) que en PCE se instalan como contenedores.
- **Mule Gateway** [00:29–00:30]: el motor de políticas que viene dentro del Mule runtime. Flex Gateway existe, pero el MCD1 se centra en Mule Gateway.
- **Proxy application** [00:31–00:40]: aplicación aparte, generada por API Manager, que recibe las peticiones, aplica las políticas y reenvía a la implementación. Necesita una **URL de implementación** ya existente; puede proteger apps no Mule. Aparece en Runtime Manager como una app más (logs, *thread dump*).
- **Basic endpoint / embebido** [00:40–00:45]: las políticas se aplican dentro de la propia app Mule. La API administrada se crea primero (la URL es opcional) y la app se enlaza con **API Autodiscovery**.
- **API instance ID** [00:38–00:45]: identificador que genera API Manager; el runtime lo usa para saber a qué app aplicar las políticas. Con basic endpoint va en el elemento Autodiscovery (mejor como propiedad, `api.id`) y se pasa al desplegar; cuando el enlace funciona, la API aparece como activa.
- **Proxy vs. embebido** [00:45–00:50]: embebido no agrega apps ni vCores; el proxy suma una app por API (el ejemplo: 100 apps → 200), pero sirve para apps no Mule o para que una política costosa (caché grande) no consuma recursos de la app. Con licencias por consumo la cuenta cambia.
- **Políticas listas para usar** [00:50–00:56]: IP allowlist / blocklist, JWT validation, JSON y XML threat protection, basic authentication (simple y LDAP), tokenization/detokenization (solo Runtime Fabric), rate limiting, **rate limiting – SLA based** (límite + client ID), spike control (encola el exceso y rechaza si la cola se llena), HTTP caching, CORS, inyección y eliminación de headers, message logging.
- **Gestión de políticas** [00:56–00:57]: se pueden aplicar varias y **cambiar su orden**; las **automated policies** se aplican solas a grupos de APIs; algunas traen un **snippet** para agregar a la especificación (por ejemplo client ID, OAuth).
- **Custom policy** [00:56]: dos archivos (YAML con los parámetros y XML con la lógica) que se publican en Exchange como asset de tipo *policy*. No entra en el MCD1.
- **Mule event** (`mule-events`) [00:58–01:13]: el evento completo = **Mule message** (attributes + payload) + **variables**. El HTTP listener llena los attributes (path, método, queryParams, uriParams…).
- **Transport boundary** [01:02, 01:10]: al pasar por un conector que sale a otro sistema (base de datos, VM, HTTP Request) los attributes se **reemplazan** por los de esa operación. Por eso los datos de la petición se guardan en variables, que duran todo el flujo.
- **Payload** [01:03, 01:11]: en un GET llega vacío; cada Set Payload o Transform Message lo reemplaza; lo que haya al final es la respuesta del listener. Transform Message también puede crear variables.
- **Logger** (`debugging`) [01:04–01:09]: muestra valores en tiempo de ejecución, también en dev, test y prod (sin datos sensibles, con un identificador como el correlation ID). Nivel por defecto INFO; un logger en DEBUG solo aparece si se sube el nivel de ese paquete en Runtime Manager (Settings → Logging). La **categoría** (por ejemplo el nombre del flujo) ayuda a filtrar.
- **Debugger de Studio** [01:04]: permite avanzar procesador por procesador y ver payload, attributes y variables.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`deploying-managing` (7%)**: nombrar las opciones de despliegue y qué es control plane vs. runtime plane; para qué sirve el Mule agent; elegir proxy o basic endpoint en un escenario (app no Mule → proxy; URL aún desconocida → basic endpoint); explicar qué hace API Autodiscovery y qué dato necesita (API instance ID y el flujo); reconocer qué hace cada familia de políticas y cuál combina límite con client ID; saber que el orden de las políticas importa.
- **`structuring-apps` (10%)**: qué es un Mule domain, qué contiene, dónde se puede usar (solo servidores propios) y cómo se asocia una app.
- **`mule-events` (10%)**: qué partes tiene el evento; qué pasa con los attributes tras una operación de conector; cuál es el payload final dado un flujo con varios Set Payload / Transform Message.
- **`debugging` (5%)**: para qué sirve el logger, niveles de log, cómo ver un log DEBUG en Runtime Manager.
- **`processing-records` (10%)**: visibilidad de variables dentro y fuera de For Each (sí se ven después), Parallel For Each (no se ven) y Batch (no vuelven a On Complete ni al flujo); ver verificación.

Confusiones típicas que señala el video:
- Creer que un Mule domain sirve en CloudHub [00:16, 00:19].
- Pensar que el proxy y el basic endpoint aplican políticas distintas; las políticas son las mismas [00:54].
- Olvidar que el proxy necesita una URL de implementación y el basic endpoint no [00:35, 00:41].
- Dar por segura una API solo porque está "managed", sin políticas [00:29].
- Confundir CORS con el Mule domain ("domain" en otro sentido) [00:55].
- Esperar que un mensaje en una VM queue "persistente" sobreviva en CloudHub 2.0 [00:03].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Antes de empezar, pregunta dónde se despliega** [00:20–00:23]: si es un servidor propio, crea el proyecto con la misma versión de runtime; si es CloudHub, puedes usar la última.
2. **Basic endpoint con Autodiscovery** [00:40–00:45]:
   - En API Manager: Add API → Mule Gateway → *Connect to existing application (basic endpoint)* → elegir la API de Exchange → guardar y copiar el **API instance ID**.
   - En `global.xml`: elemento global **API Autodiscovery** con `apiId="${api.id}"` y `flowRef` apuntando al flujo principal (`<nombre>-main` si usas APIkit).
   - En el archivo de propiedades, `api.id` (puede ser un valor de relleno) y en Runtime Manager (o en el pipeline) el valor real. Para que el runtime se conecte con API Manager también hacen falta las credenciales de la organización o del entorno (*client ID* y *client secret*), que ella muestra en las propiedades de la app.
   - Desplegar y comprobar que la API queda activa; luego aplicar políticas.
3. **Proxy** [00:31–00:37]: Add API → *Deploy a proxy application* → destino (CloudHub 2.0, servidor, RTF) → versión de runtime → nombre (sin camelCase) → API → URL de implementación. Úsalo cuando la implementación no es Mule o quieres aislar políticas.
4. **Elige y ordena políticas** [00:50–00:57]: por ejemplo client ID enforcement o SLA based + spike control; si la política trae *snippet*, agrégalo a la especificación y vuelve a publicar.
5. **Mule domain (solo servidores propios)** [00:12–00:19]: New → *Mule Domain Project* → agrega los módulos (Manage modules) → define las configuraciones compartidas → despliega el dominio → en cada app: *Mule project properties* → Domain. Las apps del dominio no repiten esas configuraciones.
6. **Guarda los attributes en variables al principio del flujo** [00:59–01:03] y usa Transform Message para armar el payload.
7. **Loggers con intención** [01:05–01:09]: INFO para hitos (con correlation ID y nombre del flujo como categoría), DEBUG para detalle; cuando haga falta, sube el nivel del paquete en Runtime Manager sin volver a desplegar.

### 5. Para estudiar

- Reto de la instructora [01:15–01:19]: elige tu objetivo más débil (error handling, DataWeave o batch / For Each), prepara una mini presentación con un flujo de demostración y explícalo.
- Ejercicio: arma un flujo con un Set Variable antes de un For Each, otro dentro, y loggers después; repite con Parallel For Each. Anota qué variables existen al final y compáralo con la doc oficial.
- Ejercicio: en un flujo con HTTP Listener → Logger de `attributes` → Database Select → Logger de `attributes`, compara los dos logs.
- Si tienes cuenta de prueba: crea una API con basic endpoint y Autodiscovery, despliégala y aplica rate limiting.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.2 (control plane / runtime plane).
  - `libros/anypoint-platform/capitulos/cap13-deploying-to-cloudhub.md` (CloudHub 1.0 y 2.0).
  - `libros/anypoint-platform/capitulos/cap14-runtime-fabric-hybrid.md` (Runtime Fabric y servidores propios).
  - `libros/anypoint-platform/capitulos/cap11-api-management-policies-governance.md` (API Manager, políticas).
  - `libros/anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` (Mule event).
  - `libros/anypoint-platform/capitulos/cap15-monitoring-logging-operations.md` (logs y monitoreo).
  - Sesión 2 de este archivo (estructura del proyecto, transport boundary).

### 6. Nota de verificación

- **Corrección confirmada en la doc oficial (2026-11-18) — variables y scopes [01:13]**: ella dice que una variable creada dentro de For Each, Parallel For Each o Batch no existe fuera. Eso es **falso para For Each**: la doc dice que las variables nuevas o modificadas al procesar un elemento *"continue to be available outside the For Each scope"*, y que *"For Each does not modify the current payload"* (al salir queda el payload que entró) ([For Each](https://docs.mulesoft.com/mule-runtime/latest/for-each-scope-concept)). Es **cierto para Parallel For Each**: *"None of the modifications done inside the Parallel For Each scope are registered, including the creation of new variables"*; su salida es una colección con el mensaje de cada iteración ([Parallel For Each](https://docs.mulesoft.com/mule-runtime/latest/parallel-foreach-scope)). Para **Batch**, la sesión 4 lo muestra en el depurador (los cambios no llegan a On Complete).
- **Flow reference**: en esta sesión precisa mejor lo de la sesión 2: los attributes cambian cuando un **conector** cruza un *transport boundary*, no al "dejar el flujo" [01:10]. Un *flow reference* conserva attributes y variables.
- **VM queues en CloudHub 2.0 no persistentes**: coincide con lo que conozco, pero no lo revisé en la doc oficial.
- **Proxy con 0.1 vCore por defecto**, "las cuentas nuevas ya no ofrecen CloudHub 1.0" y "en la práctica se usa más el embebido": **opiniones o datos no verificados**.
- **Basic auth con LDAP "para servidor del cliente"** [00:52]: la explicación es confusa; la política LDAP valida contra un servidor LDAP que el gateway debe alcanzar. Revisar en la doc de políticas.
- **Tokenización solo en Runtime Fabric** [00:52]: coincide con lo que conozco; no verificado.
- **Credenciales de plataforma**: lo que ella llama "client ID y client secret" en las propiedades de la app son las credenciales que usa Autodiscovery para hablar con API Manager; los nombres exactos de las propiedades (`anypoint.platform.client_id` / `client_secret`) y en qué despliegues se inyectan solas no se mostraron. Revisar en la doc de API Autodiscovery.
- Flex Gateway hoy se llama **Omni Gateway** (ver libro Agent Fabric).
- La agenda del curso (fechas de mayo, reto del martes) es logística del grupo en vivo, sin valor para estudio.
- Los porcentajes de la sección 3 vienen de `taxonomy.json`.

---

## Serie 1 · Sesión 4: DataWeave y Batch, presentado por alumnos (Digital Dee, 2025)

- **Video:** [MCD Level 1 Exam Prep – Session 4 | MuleSoft Certification with Digital Dee (2025)](https://www.youtube.com/watch?v=nFNkLiilYK4)
- **Duración:** 1:20 · **Temas:** dataweave, processing-records
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-4-tactiq-free-transcript-nFNkLiilYK4.txt`

Sesión distinta: dos alumnos presentan el objetivo que más les cuesta, como pidió la instructora en la sesión 3. R.J. explica lo básico de DataWeave con ejemplos en Studio y en DataWeave Playground. Manny (4 años como desarrollador) explica Batch Job y resuelve en Studio, con el depurador, preguntas de tipo examen sobre batch.

### 1. Resumen por bloques

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

### 2. Conceptos clave

#### DataWeave (`dataweave`)

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

#### Batch (`processing-records`)

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

### 3. Para evaluar

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

### 4. Para desarrollar

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

### 5. Para estudiar

- Reproduce en Studio las cuatro preguntas tipo (con el depurador y loggers) y anota el valor de payload y variables en cada paso.
- Escribe en DataWeave Playground un ejemplo de cada función principal y cambia el orden `groupBy` / `orderBy` para ver qué tipo sale en cada caso.
- Tarea de R.J.: "no memorizar todo, sino entender tipos y volver a la referencia".
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` (estructura, `default`, `reduce` con `acc`, `var`, módulos).
  - `libros/anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` §7.3 (batch jobs, scheduling, procesos largos).
  - Sesión 3 de este archivo (variables y scopes, sección de verificación).
  - Doc oficial: referencia de funciones de DataWeave (dw::Core) y Batch Job (ver `enlaces-oficiales.md`).

### 6. Nota de verificación

- **`orderBy` después de `groupBy`** [00:32–00:33]: R.J. dice que da error porque `orderBy` necesita un arreglo. Por lo que conozco de DataWeave 2, `orderBy` también acepta **objetos** (los ordena por clave o valor), así que no debería fallar; lo que cambia es el resultado (un objeto con los grupos ordenados, no cada grupo ordenado por dentro). La idea de fondo (saber qué forma sale de cada paso) es correcta. **Verificar en dw::Core antes de usarlo en una pregunta.**
- **`acc` no es una función** [00:19]: es el parámetro acumulador de la lambda de `reduce`. Coincide con cap04 del libro.
- **"Lambda" en el encabezado** [00:28–00:31]: la explicación mezcla conceptos. `var` declara variables; las lambdas son las funciones anónimas `(u) -> ...` del cuerpo. La instructora confirma la idea general, no el detalle.
- **`default` es un operador**, no una función; funciona igual.
- **"DataWeave es el único lenguaje que hace esto"** y su historia (equipo en 2015-2016): opiniones o datos aproximados. DataWeave 1.0 llegó en Mule 3.7; en Mule 4 es el lenguaje de expresiones por defecto (2.0).
- **Batch**: los valores por defecto (block size 100, max failed records 0, ORDERED_SEQUENTIAL, NO_FAILURES) y que On Complete recibe un informe coinciden con lo que conozco de la doc; no los revisé hoy en docs.mulesoft.com.
- **Variables en batch**: lo que se ve en el depurador (counter 1 en On Complete, la otra variable null) coincide con el comportamiento de Mule 4. Lo de For Each quedó resuelto en la doc oficial: ahí las variables sí se ven después del scope (ver la verificación de la sesión 3).
- **Orden de los logs en la pregunta 3**: el último log es 13 porque los 3 registros caben en un solo bloque y se procesan en orden; con varios bloques en paralelo el orden de los logs no está garantizado.
- **Payload después del Batch Job en el flujo principal**: no se trató; el job es asíncrono y el flujo sigue sin esperar. Revisar en la doc qué devuelve.
- **Salesforce con `application/java` y `as Date`**: consejo práctico de un alumno, no verificado.
- Las preguntas que muestra Manny vienen de un examen de práctica; no se copian aquí.
- Los porcentajes de la sección 3 vienen de `taxonomy.json`.

---

## Serie 1 · Sesión 5: Manejo de errores, parte 1 (Digital Dee, 2025)

- **Video:** [MCD Level 1 Exam Prep – Session 5 | MuleSoft Certification with Digital Dee (2025)](https://www.youtube.com/watch?v=we_-S4cHVA0)
- **Duración:** 1:24 · **Temas:** error-handling, api-implementation, structuring-apps, routing
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-5-tactiq-free-transcript-we_-S4cHVA0.txt`

La instructora comparte tres proyectos de ejemplo (endpoints `example1`, `example2`…) que usan **Raise Error** para provocar errores y muestra, caso por caso, qué responde el HTTP Listener. Termina con un diagrama de decisión que presenta un alumno y tres preguntas tipo examen. La parte 2 (estrategia de errores) queda para la sesión siguiente.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:08] | Agenda | Qué entra: manejo por defecto, On Error Propagate vs. Continue, global vs. flujo vs. procesador (Try), objeto de error. Raise Error para provocar errores (también se usa en producción para cortar un proceso). |
| [00:08–00:13] | Tipos de error | Errores de sistema (fuera del flujo, no se pueden manejar; ayudan la reconexión y la recuperación de CloudHub 2.0) vs. errores de mensajería (sí se manejan). Jerarquía de tipos con **ANY** arriba. Objeto `error` con `description` y `errorType`. |
| [00:13–00:19] | Valores por defecto del Listener | Respuesta OK: body = `payload`, status 200. Respuesta de error: body = `error.description` en texto plano, status **500**. APIkit cambia el Listener para usar `vars.httpStatus`. |
| [00:19–00:25] | Lo que genera APIkit | Flujo principal, de consola y uno privado por par método-recurso; manejadores **On Error Propagate** apilados por tipo APIKIT (BAD_REQUEST, NOT_FOUND, METHOD_NOT_ALLOWED…) que ponen un mensaje y `httpStatus` (por ejemplo 405). |
| [00:25–00:27] | Propagate vs. Continue | Propagate: el error sigue y el cliente recibe error (500 si no se cambia). Continue: el error se da por resuelto y el cliente recibe 200 con el payload. En ambos casos **no** corre lo que venía después del procesador que falló. |
| [00:27–00:35] | Ejemplos 1–3 | Sin manejo → Mule Default Error Handler (500 + descripción). Propagate con Set Payload → igual 500 + descripción, porque el Listener por defecto no devuelve el payload en error. Continue → 200 + payload. |
| [00:35–00:50] | Ejemplos 4–8 | Listener personalizado (error body = payload) → 500 con el último payload. Tipo que coincide → corre el manejador. Tipo que **no** coincide → actúa el Mule Default Error Handler y no corre nada del manejador. Orden: tipos específicos arriba, ANY abajo. |
| [00:50–00:57] | Padre e hijo | Hijo con Propagate → el error vuelve al padre y corre su manejador (gana el último Set Payload, el del padre). Hijo con Continue → el padre sigue como si nada. Ejemplo de uso: devolver datos parciales si una aerolínea está caída. |
| [00:57–00:58] | Cambiar el status | Con `httpStatus = 400` el cliente recibe 400; el *reason phrase* sale del código si no se define. |
| [00:58–01:01] | Subflow, flujo privado, Try | El flujo privado puede tener manejador; el **subflow no**, el error lo maneja quien lo llama. **Try** envuelve uno o varios procesadores; con Continue el flujo sigue. |
| [01:01–01:04] | Global error handler | Se define en `global.xml` y se elige en *Configuration* como manejador por defecto; se usa en la mayoría de los casos, salvo cuando se quiere tratar algo cerca del error. |
| [01:04–01:06] | Error mapping | En un procesador (por ejemplo una validación), mapear el tipo genérico a un tipo propio con significado. |
| [01:06–01:12] | Diagrama de decisión | ¿Subflow? → pasa a quien lo llama. ¿Hay manejador en el flujo? ¿El tipo coincide? → lo maneja; si no → Default. Sin manejador en el flujo → global; si no coincide o no existe → Default. |
| [01:12–01:22] | Preguntas tipo | Listener por defecto sin manejo → 500 + descripción. Continue → 200 + payload. Propagate con `httpStatus` 200 y Listener personalizado → 200 con el payload. |
| [01:22–01:24] | Lo que sigue | Routers (Choice, Scatter-Gather, Round Robin, First Successful) como parte de la estrategia de errores. |

### 2. Conceptos clave

- **Errores de sistema vs. de mensajería** (`error-handling`) [00:09–00:11]: los de sistema ocurren fuera de un flujo (runtime caído, app reiniciándose) y no se manejan con scopes; los de mensajería ocurren al procesar un evento (DataWeave, conectividad, seguridad, reintentos agotados) y sí se manejan.
- **Jerarquía de tipos** [00:11]: los tipos tienen forma `NAMESPACE:IDENTIFIER` (HTTP:NOT_FOUND, APIKIT:BAD_REQUEST, MULE:EXPRESSION…) y cuelgan de **ANY**. Un manejador para un tipo padre atrapa también a sus hijos.
- **Objeto `error`** [00:11–00:13]: se crea al ocurrir el error y viaja en el Mule event. Lo más usado: `error.description` y `error.errorType`.
- **Raise Error** [00:03–00:04]: provoca un error con el tipo y la descripción que configures. Sirve para probar y para cortar un proceso cuando una regla de negocio falla.
- **Respuestas del HTTP Listener** [00:13–00:19]: por defecto, éxito = `payload` con 200; error = `error.description` como texto con **500**. Si nadie cambia el status, cualquier error, incluso uno del cliente, llega como 500.
- **`vars.httpStatus`** [00:17–00:24]: convención que usa APIkit: el Listener lee el status de esa variable y los manejadores la llenan (400, 404, 405, 415, 406, 501). Se puede poner con Set Variable o, en el mismo Transform Message, agregando una salida de tipo variable.
- **On Error Propagate** [00:25–00:26]: ejecuta sus procesadores y **vuelve a lanzar** el error; el flujo termina con error. Si el flujo es el de un Listener, este devuelve la respuesta de error.
- **On Error Continue** [00:26–00:27]: ejecuta sus procesadores y **termina el flujo con éxito**; el que llamó sigue normalmente y el Listener devuelve la respuesta de éxito (200 + payload).
- **En ambos casos** [00:26]: lo que estaba después del procesador que falló dentro de ese flujo o Try **no se ejecuta**.
- **Mule Default Error Handler** [00:27–00:35, 00:43–00:48]: actúa cuando no hay manejador o cuando ninguno coincide con el tipo. Se comporta como un Propagate que registra el error.
- **Orden de los manejadores** [00:41–00:42]: se evalúan de arriba abajo y corre el primero que coincide; los específicos arriba y ANY al final.
- **Padre e hijo con Flow Reference** [00:46–00:54]: si el hijo propaga, el padre recibe el error y lo maneja con lo suyo; si el hijo continúa, para el padre no hubo error.
- **Dónde poner manejo** [00:35–00:36, 00:58–01:04]: en el flujo, en un **Try** (uno o varios procesadores) o en un **global error handler** (en `global.xml`, elegido en *Configuration*). Un **subflow** no tiene manejador; un **flujo privado** sí.
- **Error mapping** [01:04–01:06]: en un procesador, convierte un tipo genérico (por ejemplo VALIDATION:INVALID_BOOLEAN) en un tipo propio (APP:PAGO_INVALIDO) para manejarlo y registrarlo con sentido.
- **First Successful** [01:22–01:23]: router que prueba rutas en orden y pasa a la siguiente si una falla; útil para redundancia.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`error-handling`, peso 8%):
- Dado un flujo en **XML** y la configuración del Listener (por defecto o personalizada), decir el **status** y el **body** que recibe el cliente.
- Distinguir Propagate y Continue en un flujo y en una relación padre-hijo.
- Saber qué pasa cuando el tipo **no coincide** con ningún manejador.
- Decir dónde se maneja un error que ocurre en un subflow, en un flujo privado y en un Try.
- Explicar qué crea APIkit para errores y cómo se elige el status con `httpStatus`.
- Reconocer cuándo usar error mapping y un global error handler.

Patrones de pregunta que muestra el video (para diseñar preguntas propias basadas en la doc oficial, no para copiar) [01:12–01:22]:
- Listener por defecto + sin manejador → status y body.
- On Error Continue → status y body.
- On Error Propagate que fija `httpStatus` en 200 con un Listener personalizado → el cliente recibe 200.

Confusiones típicas que señala el video:
- Esperar el mensaje del Set Payload del manejador con el Listener por defecto [00:32].
- Creer que con Continue se ejecuta el resto del flujo después del error [00:26].
- Pensar que cualquier manejador atrapa todo; si el tipo no coincide, actúa el Default [00:44].
- Poner ANY arriba de los tipos específicos [00:42].
- Buscar el manejador de un subflow en el propio subflow [00:58].

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Personaliza el Listener** (o deja que APIkit lo haga) [00:17–00:19]: respuesta de error con body `payload` y status `vars.httpStatus default 500`.
2. **Global error handler en `global.xml`** [01:01–01:04] y elígelo en *Global Elements → Configuration*. Ahí van los casos comunes; en los flujos solo lo que necesita trato especial.
3. **Ordena los manejadores** de lo específico a lo general, con un ANY al final para no caer en el Default [00:42, 00:48].
4. **En cada manejador**: un Transform Message que arme el cuerpo del error (mensaje, `error.errorType`, correlation ID) y fije `httpStatus` como variable; un Logger con `error.description`.
5. **Usa Continue para respuestas parciales o de respaldo** [00:51–00:53]: si una fuente falla, devuelve datos de otra (archivo del día anterior, caché, Object Store) y avisa en la respuesta.
6. **Usa Try** alrededor de los procesadores que pueden fallar sin que deba fallar todo el flujo [00:59–01:01].
7. **Mapea errores** con nombres de tu dominio para que el log y la respuesta digan qué pasó [01:04–01:06].
8. **Prueba cada caso** con Postman o ARC y en modo debug; los proyectos de la instructora usan un endpoint por ejemplo.

### 5. Para estudiar

- Arma tu propia versión de los 12 ejemplos: un flujo por caso, con Raise Error, y anota antes de ejecutar qué esperas (status y body). Luego compara.
- Dibuja el diagrama de decisión de memoria (subflow → flujo → tipo → global → default).
- Lee el XML de cada ejemplo, no solo la vista gráfica: el examen muestra XML.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap08-error-handling-retry-reliability.md` (manejo de errores, reintentos).
  - `libros/anypoint-platform/capitulos/cap06-api-design-contract-first.md` (APIkit).
  - Sesiones 2 (estructura y `global.xml`) y 3 (logger y niveles) de este archivo.
  - Doc oficial de error handling de Mule 4 (ver `enlaces-oficiales.md`).

### 6. Nota de verificación

- Lo central (valores por defecto del Listener, Propagate vs. Continue, Default Error Handler cuando no hay coincidencia, padre-hijo, subflow sin manejador, Try, global error handler, error mapping) coincide con lo que conozco de la doc de Mule 4. No lo revisé hoy en docs.mulesoft.com.
- **Raise Error con tipo ANY**: en el video funciona, pero la doc de Raise Error pide un tipo propio (`NAMESPACE:IDENTIFIER`) y puede no permitir los del espacio MULE. **No verificado**; en tus pruebas usa un tipo propio, por ejemplo `APP:MI_ERROR`.
- El puerto aparece como "881" en la transcripción; probablemente es 8081.
- La "recuperación inteligente" de CloudHub 2.0 [00:09–00:10] se menciona sin detalle; no verificado.
- Round Robin "casi no se usa" es opinión.
- El diagrama de decisión no tiene autor conocido; aquí solo se describe la lógica.
- El peso de `error-handling` viene de `taxonomy.json`.

---

## Serie 1 · Sesión 6: API Governance, routers, validación, versionado semántico y el día del examen (Digital Dee, 2025)

- **Video:** [MCD Level 1 Exam Prep – Session 6 | MuleSoft Certification with Digital Dee (2025)](https://www.youtube.com/watch?v=NDNiXTCWckc)
- **Duración:** 1:23 · **Temas:** designing-apis, reuso-exchange, routing, error-handling, deploying-managing
- **Transcripción:** `documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/videos-6-tactiq-free-transcript-NDNiXTCWckc.txt`

Última sesión planificada. Empieza con API Governance, recorre los cuatro routers con un proyecto de excursiones (archivos CSV), muestra el módulo Validation, explica el versionado semántico y termina con consejos para inscribirse y rendir el examen. Quedan pendientes, en otros videos de la instructora: MUnit, For Each y Parallel For Each, transport boundary.

### 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:02] | Contexto | Según ella, el examen actual se basa en el release de primavera 2024; por eso agrega API Governance. |
| [00:02–00:09] | Perfil de gobierno | API Governance → New profile: elegir *rulesets* (Anypoint best practices, OWASP API Security Top 10, required examples, HTTPS, autenticación…), a qué APIs aplica (por tipo, etiqueta o lista) y a quién avisar. Panel con APIs *conformant* / *not conformant*. |
| [00:09–00:16] | Rulesets en Exchange y Design Center | Exchange muestra la insignia de conformidad. En Design Center se agregan rulesets al proyecto y aparecen avisos de "governance" además de los de sintaxis. Se pueden crear rulesets propios (por ejemplo HIPAA). |
| [00:16–00:19] | Routers: qué entra | Choice y Scatter-Gather son los importantes para el examen; también First Successful y Round Robin. Cada petición tiene su propio payload y sus variables. |
| [00:19–00:23] | Los cuatro routers | Choice: corre la primera ruta cuya condición se cumple o *default*. Scatter-Gather: todas en paralelo, junta resultados. First Successful: la primera ruta que no falla. Round Robin: una ruta por ejecución, en turno. |
| [00:23–00:27] | Pregunta trampa | Una ruta del Choice hace Flow Reference al mismo flujo: es la **misma** petición, así que payload y variables siguen con los valores que ya tenían. |
| [00:27–00:34] | Demo Choice | Query param `category` pasado por `upper()`; ADV/CEX/GTX van a flujos privados que leen un CSV; sin valor o sin coincidencia → *default* → Scatter-Gather con todo. |
| [00:34–00:40] | Demo Scatter-Gather, Round Robin, First Successful | Tres payloads separados en los logs y uno combinado al final. Round Robin avanza con cada petición y vuelve a la ruta 0 si la app se reinicia. First Successful salta la ruta que falla sin registrar error. |
| [00:40–00:47] | Módulo Validation | Se agrega desde *Add modules*. Is true/false, is empty/not empty, is email, URL, regex; scopes **All** y **Any**. Caso típico: un Select que no encuentra el ID no da error, devuelve vacío; se valida y se maneja el error. |
| [00:47–01:02] | Versionado semántico | MAJOR.MINOR.PATCH. Exchange empieza en 1.0.0 y la versión mayor genera otro "v". Reglas para subir cada número y reiniciar los de la derecha. Exchange solo sube el patch por su cuenta. |
| [01:02–01:12] | Inscribirse | Elegir fecha ya; examen supervisado online (lugar silencioso, escritorio vacío, sin pausas, identificación, revisión de la habitación y del equipo). Inscripción en Webassessor ("Salesforce Certified MuleSoft Developer"). |
| [01:12–01:22] | Estrategia en el examen | ~2 minutos por pregunta; marcar y seguir; hay preguntas no puntuables; respetar "elige dos"; leer primero la pregunta que está sobre las opciones; quitar las marcas antes de enviar; usar el informe si no se aprueba. |

### 2. Conceptos clave

- **API Governance** (`designing-apis`, `reuso-exchange`) [00:02–00:16]: revisa automáticamente que las especificaciones cumplan estándares. Piezas:
  - **Ruleset**: conjunto de reglas publicado en Exchange (tipo de asset *ruleset*). MuleSoft trae varios (best practices de Anypoint, de OAS, de AsyncAPI, OWASP API Security Top 10, ejemplos obligatorios, HTTPS…). Se pueden crear propios.
  - **Governance profile**: qué rulesets se aplican a qué APIs (por tipo, etiqueta o selección) y a quién se avisa.
  - **Conformidad**: el panel y Exchange muestran si cada API es *conformant* o *not conformant*, con el detalle de cada regla que falla y cómo corregirla.
  - En **Design Center** se pueden agregar rulesets al proyecto y ver los avisos de "governance" junto a los de sintaxis.
- **OWASP API Security Top 10** [00:04–00:06]: lista de vulnerabilidades más comunes en APIs (por ejemplo, autorización rota a nivel de objeto). El ruleset que mostró usa la edición 2019; existe una de 2023.
- **Choice router** (`routing`) [00:19–00:24]: evalúa las condiciones (*when*) en orden y ejecuta **solo la primera** que se cumple; si ninguna, la ruta **default**. Buena práctica: en cada ruta, un Flow Reference a un flujo con la lógica.
- **Scatter-Gather** [00:20–00:21, 00:32–00:34]: ejecuta todas las rutas **en paralelo** con una copia del evento; al terminar entrega un objeto con el resultado de cada ruta (claves "0", "1", "2"…). Normalmente se transforma con DataWeave para unirlo en un solo payload.
- **First Successful** [00:21–00:22, 00:37–00:40]: prueba las rutas en orden y se queda con la primera que **no falla**; si fallan todas, lanza error. Útil para redundancia (base principal → base secundaria → archivo estático).
- **Round Robin** [00:22–00:23, 00:34–00:37]: cada ejecución usa la ruta siguiente (0, 1, 2, 0…), como un balanceador interno.
- **Flow Reference dentro de un router** [00:23–00:27]: no crea una petición nueva; el flujo llamado recibe el mismo evento (payload, variables, attributes).
- **Módulo Validation** (`error-handling`) [00:40–00:47]: operaciones que lanzan un error (tipo VALIDATION:…) si la condición no se cumple: Is true / Is false, Is empty / Is not empty, Is null / Is not null, Is email, Is URL, Matches regex, entre otras. **Validate all** exige que pasen todas; **Validate any**, al menos una.
- **Por qué validar** [00:45–00:46]: un Select sin resultados no es un error para Mule; devuelve un arreglo vacío. Si no se valida, el error aparece más adelante y con un mensaje confuso.
- **Versionado semántico** (`reuso-exchange`) [00:47–01:02]: `MAJOR.MINOR.PATCH`.
  - **MAJOR**: cambio **no compatible** hacia atrás (por ejemplo, un campo pasa a ser obligatorio, o `datetime` pasa a requerir zona horaria). En Exchange genera otra versión de API (v2) y se puede mantener privada mientras se prepara.
  - **MINOR**: algo nuevo **compatible** (un endpoint nuevo, un campo obligatorio que pasa a opcional).
  - **PATCH**: corrección o documentación, sin cambiar el contrato.
  - Al subir un número, **los de la derecha vuelven a 0**: 1.1.9 + patch = 1.1.10; + minor = 1.2.0; 2.9.13 + major = 3.0.0. Cada número puede crecer sin límite (1.99.0 → 1.100.0).
  - Exchange no sabe qué cambiaste: al publicar propone subir el patch; el desarrollador elige el número correcto.

### 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`routing` (8%)**: dado un Choice con condiciones y un valor de entrada, decir qué ruta corre (solo una); qué devuelve un Scatter-Gather; qué hace First Successful si falla la primera ruta o todas; cómo avanza Round Robin. Qué valores tienen payload y variables cuando una ruta hace Flow Reference al mismo flujo.
- **`reuso-exchange` / `designing-apis`**: dado un cambio en la especificación, decir si es major, minor o patch y escribir la nueva versión, reiniciando lo que corresponda. Explicar qué es un ruleset y un perfil de gobierno.
- **`error-handling` (8%)**: elegir la operación de Validation para un caso (resultado vacío, email, regex) y decir qué pasa cuando falla.

Confusiones típicas que señala el video:
- Subir el minor sin reiniciar el patch (1.1.9 → 1.2.9 en lugar de 1.2.0) [00:55–00:58]: "mucha gente se equivoca en el examen".
- Clasificar como minor un cambio que rompe a los clientes (campo que pasa a obligatorio) [00:58–01:00].
- Creer que en un Choice corren todas las rutas que cumplen la condición.
- Pensar que un Flow Reference al mismo flujo empieza "limpio" [00:24–00:26].
- Esperar que un Select vacío lance error [00:45].

Estrategia de examen [01:12–01:22]: leer primero la pregunta, luego el enunciado; no quedarse en una pregunta larga; marcar todas las opciones que pide "elige dos/tres" (es todo o nada); quitar las marcas de revisión antes de enviar.

### 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Gobierno desde el diseño** [00:10–00:16]: agrega los rulesets de tu organización al proyecto en Design Center y corrige los avisos antes de publicar. Si tu industria tiene reglas propias, crea un ruleset personalizado.
2. **Choice con lógica afuera** [00:19, 00:27–00:32]: normaliza la entrada antes de comparar (`upper(attributes.queryParams.category)`), guarda el valor en una variable, cada ruta con un Flow Reference a un flujo privado, y una ruta *default* que tenga sentido (devolver todo o un error claro).
3. **Scatter-Gather para consultar varias fuentes a la vez** [00:32–00:34]: después, un Transform Message que una los resultados, por ejemplo `flatten(valuesOf(payload) map $.payload)`.
4. **First Successful para respaldo** [00:38–00:40]: ruta 0 la fuente principal, ruta 1 la secundaria o una copia estática; indica en la respuesta de dónde vienen los datos.
5. **Valida lo que podría venir vacío** [00:45–00:47]: después de un Select por ID, `Is not empty` sobre el payload, y en el manejador de errores responde 404 con un mensaje claro.
6. **Versiona a conciencia** [01:01–01:02]: al publicar en Exchange, elige tú el número según el tipo de cambio; un cambio major va como nueva versión (privada hasta que esté lista).
7. **Prepara el examen con tiempo** [01:02–01:12]: prueba tu equipo con el chequeo del proveedor, inscríbete y pon fecha.

### 5. Para estudiar

- Arma un flujo con los cuatro routers (pueden leer tres CSV pequeños, como en la demo) y anota qué devuelve cada uno.
- Reproduce la pregunta trampa: un Choice cuya ruta hace Flow Reference al propio flujo, con un Set Variable antes; mira en el depurador qué valor tiene la variable en la segunda pasada.
- Ejercicio de versionado: escribe 10 cambios posibles en una especificación (agregar endpoint, quitar campo, corregir descripción, cambiar tipo…) y clasifícalos.
- Si tienes cuenta: crea un perfil de gobierno con "required examples" y aplícalo a una API tuya.
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` (routers, Scatter-Gather).
  - `libros/anypoint-platform/capitulos/cap11-api-management-policies-governance.md` (gobierno).
  - `libros/anypoint-platform/capitulos/cap06-api-design-contract-first.md` (diseño y versiones).
  - `libros/anypoint-platform/capitulos/cap08-error-handling-retry-reliability.md` (validación y errores).
  - Página de versionado semántico (semver.org) y guía oficial del examen (ver `enlaces-oficiales.md`).

### 6. Nota de verificación

- **"No deja publicar en Exchange si no es conforme"** [00:11, 00:15]: es dudoso. En el mismo video se ve una API publicada como *not conformant*, y por lo que conozco los avisos de gobierno en Design Center no bloquean la publicación. **Verificar en la doc de API Governance.**
- **"El examen se basa en el release de primavera 2024"** y que cubre API Governance: dato de la instructora, **no verificado** contra la guía oficial.
- **Scatter-Gather "aplana" los payloads**: lo que entrega es un objeto con un resultado por ruta; unirlo en uno solo lo haces tú con DataWeave. Que devolverlo sin transformar al Listener "da error" depende del formato; no verificado.
- Choice (solo la primera ruta), First Successful (error si fallan todas), Round Robin (vuelve a 0 al reiniciar), Validation (All / Any) y las reglas de semver coinciden con lo que conozco; no los revisé hoy en docs.mulesoft.com.
- **Logística del examen** (Webassessor, dos reintentos con 24 horas de diferencia, revisión de la habitación): datos de 2025 que pueden haber cambiado (en la sesión 1 se anunciaba el paso a Pearson VUE). Revisar en la guía oficial antes de inscribirse.
- Los pesos de la sección 3 vienen de `taxonomy.json`.
