---
video: "MCD Level 1 Exam Prep – Session 3 | MuleSoft Certification with Digital Dee (2025)"
url: https://www.youtube.com/watch?v=GH2wWxMPJWE
serie: 1
numero: 3
idioma: inglés
tipo: apoyo
fuente: "documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-3-tactiq-free-transcript-GH2wWxMPJWE.txt"
duracion_aprox: "1:21"
temas: [deploying-managing, structuring-apps, mule-events, debugging, processing-records]
resumido: 2026-11-17
estado: confirmado
---

<!-- Notas:
- Es una nota de estudio y contexto, no una transcripción. La transcripción completa (tactiq, automática, con errores como "autodiscocovery", "Neiloft" o "VMQ") sigue en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. "Para evaluar" no son preguntas para copiar (regla de la skill evaluacion).
-->

# Serie 1 · Sesión 3: Despliegue, gestión de APIs y Mule event (Digital Dee, 2025)

Sesión en vivo con una alumna. Cubre el objetivo "deploying and managing APIs and integrations" (opciones de runtime, Mule domain, proxy vs. basic endpoint, políticas) y empieza "Mule events" (attributes, variables, payload, logger y niveles de log).

## 1. Resumen por bloques

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

## 2. Conceptos clave

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

## 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material:
- **`deploying-managing` (7%)**: nombrar las opciones de despliegue y qué es control plane vs. runtime plane; para qué sirve el Mule agent; elegir proxy o basic endpoint en un escenario (app no Mule → proxy; URL aún desconocida → basic endpoint); explicar qué hace API Autodiscovery y qué dato necesita (API instance ID y el flujo); reconocer qué hace cada familia de políticas y cuál combina límite con client ID; saber que el orden de las políticas importa.
- **`structuring-apps` (10%)**: qué es un Mule domain, qué contiene, dónde se puede usar (solo servidores propios) y cómo se asocia una app.
- **`mule-events` (10%)**: qué partes tiene el evento; qué pasa con los attributes tras una operación de conector; cuál es el payload final dado un flujo con varios Set Payload / Transform Message.
- **`debugging` (5%)**: para qué sirve el logger, niveles de log, cómo ver un log DEBUG en Runtime Manager.
- **`processing-records` (10%)**: visibilidad de variables dentro y fuera de For Each, Parallel For Each y Batch (estudiar con la doc oficial, ver verificación).

Confusiones típicas que señala el video:
- Creer que un Mule domain sirve en CloudHub [00:16, 00:19].
- Pensar que el proxy y el basic endpoint aplican políticas distintas; las políticas son las mismas [00:54].
- Olvidar que el proxy necesita una URL de implementación y el basic endpoint no [00:35, 00:41].
- Dar por segura una API solo porque está "managed", sin políticas [00:29].
- Confundir CORS con el Mule domain ("domain" en otro sentido) [00:55].
- Esperar que un mensaje en una VM queue "persistente" sobreviva en CloudHub 2.0 [00:03].

## 4. Para desarrollar

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

## 5. Para estudiar

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
  - Nota anterior: `videos/serie-1/s1-02-ciclo-de-vida-api.md` (estructura del proyecto, transport boundary).

## 6. Nota de verificación

- **Para revisar antes de evaluar — variables y scopes [01:13]**: ella dice que una variable creada dentro de For Each, Parallel For Each o Batch no existe fuera. Según lo que conozco de la doc de Mule 4, eso vale para **Parallel For Each** y **Batch**, pero en **For Each** las variables creadas o modificadas dentro **sí** se ven después del scope (lo que se restaura es el payload). Es justo el tipo de detalle que pregunta el examen: confirmarlo en la doc oficial de For Each antes de usarlo.
- **Flow reference**: en esta sesión precisa mejor lo de la sesión 2: los attributes cambian cuando un **conector** cruza un *transport boundary*, no al "dejar el flujo" [01:10]. Un *flow reference* conserva attributes y variables.
- **VM queues en CloudHub 2.0 no persistentes**: coincide con lo que conozco, pero no lo revisé en la doc oficial.
- **Proxy con 0.1 vCore por defecto**, "las cuentas nuevas ya no ofrecen CloudHub 1.0" y "en la práctica se usa más el embebido": **opiniones o datos no verificados**.
- **Basic auth con LDAP "para servidor del cliente"** [00:52]: la explicación es confusa; la política LDAP valida contra un servidor LDAP que el gateway debe alcanzar. Revisar en la doc de políticas.
- **Tokenización solo en Runtime Fabric** [00:52]: coincide con lo que conozco; no verificado.
- **Credenciales de plataforma**: lo que ella llama "client ID y client secret" en las propiedades de la app son las credenciales que usa Autodiscovery para hablar con API Manager; los nombres exactos de las propiedades (`anypoint.platform.client_id` / `client_secret`) y en qué despliegues se inyectan solas no se mostraron. Revisar en la doc de API Autodiscovery.
- Flex Gateway hoy se llama **Omni Gateway** (ver libro Agent Fabric).
- La agenda del curso (fechas de mayo, reto del martes) es logística del grupo en vivo, sin valor para estudio.
- Los porcentajes de la sección 3 vienen de `taxonomy.json`.
