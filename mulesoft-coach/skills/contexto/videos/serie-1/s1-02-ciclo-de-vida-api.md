---
video: "MCD Level 1 Exam Prep – Session 2 | MuleSoft Certification with Digital Dee (2025)"
url: https://www.youtube.com/watch?v=RsOUjUoyfcQ
serie: 1
numero: 2
idioma: inglés
tipo: apoyo
fuente: "documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-2-tactiq-free-transcript-RsOUjUoyfcQ.txt"
duracion_aprox: "1:21"
temas: [designing-apis, api-implementation, structuring-apps, deploying-managing, mule-events, build-dependencias, reuso-exchange]
resumido: 2026-11-17
estado: confirmado
---

<!-- Notas:
- Es una nota de estudio y contexto, no una transcripción. La transcripción completa (tactiq, automática, con errores como "Anyoint", "raml" o "rescaffle") sigue en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. "Para evaluar" no son preguntas para copiar (regla de la skill evaluacion).
-->

# Serie 1 · Sesión 2: Ciclo de vida de la API, RAML y estructura del proyecto (Digital Dee, 2025)

Sesión en vivo con una alumna que hace preguntas. Recorre el ciclo de vida completo de una API (diseñar → implementar → desplegar → administrar → monitorear), después baja al detalle de RAML y termina con la estructura de un proyecto preparado para varios entornos.

## 1. Resumen por bloques

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

## 2. Conceptos clave

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

## 3. Para evaluar

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

## 4. Para desarrollar

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

## 5. Para estudiar

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

## 6. Nota de verificación

- **Corrección importante**: un *flow reference* **no** borra los attributes; el evento pasa igual al flujo llamado. Lo que los reemplaza es una operación de conector que cruza un *transport boundary* (HTTP Request, consulta de base de datos, VM, etc.), y llamar a otra app pierde también las variables. El consejo de guardar parámetros en variables sigue siendo bueno. Verificar en la doc de Mule event antes de usarlo en una pregunta.
- El puerto: la transcripción dice "8881", probablemente un error de reconocimiento; el listener que genera APIkit usa **8081** por defecto. No se mostró en pantalla en texto.
- "El entorno de tipo design ya no se usa" es una **opinión** de la instructora; no verificado.
- API Notebook: ella misma duda de que siga o de que entre al examen. **No verificado**.
- "Flex Gateway no entra en MCD1" y "en la práctica se usa más el basic endpoint" son **opiniones**. Flex Gateway hoy se llama Omni Gateway (ver libro Agent Fabric).
- El libro de Anypoint Platform trata APIkit (cap. 6), pero **no** cubre la opción de exportación con dependencias, la política Rate Limiting – SLA based ni el patrón `config-${env}`. Coinciden con lo que conozco de la doc oficial, pero falta revisarlos en docs.mulesoft.com antes de basar una pregunta en ellos.
- Los porcentajes de la sección 3 vienen de `taxonomy.json`.
