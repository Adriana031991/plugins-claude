---
serie: agent-fabric (video suelto)
titulo: "Natural Language Processing to Database Automation using Agent Fabric"
url: https://www.youtube.com/watch?v=DlC19DcSV_8
idioma: inglés
tipo: apoyo
temario: aparte (Agent Fabric y MCP; no va en taxonomy.json)
videos: 1
fuente: "documentos-base-mulesoft/transcripcion-video-procesam-lenguaje-natural-automat-db-agent-fabric-tactiq-free-transcript-DlC19DcSV_8.txt"
duracion_aprox: "1:04"
temas: [agent-fabric, mcp-bridge, ai-gateway, llm-proxy, a2a, agent-network, omni-gateway]
resumido: 2026-11-18
estado: confirmado
---

<!-- Notas:
- Video aportado por la persona (no está en LINKS DE YOUTUBE.txt). Pertenece al temario aparte de Agent Fabric (decisión del 2026-11-14): sus temas no son ids de taxonomy.json.
- Es una nota de estudio y contexto, no una transcripción. La transcripción completa (tactiq, automática, con errores como "MAF", "aentic", "Wibes" o "ates") sigue en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. Orden de prioridad acordado para Agent Fabric: 1) docs.mulesoft.com, 2) spec del protocolo (MCP o A2A), 3) el libro, 4) este video.
-->

# Agent Fabric: del lenguaje natural a la base de datos (video suelto)

*Live stream* de la comunidad MuleSoft. Presenta Ishvir Singh Dava, arquitecto de soluciones, siete certificaciones de MuleSoft, líder del meetup de Calgary y mentor. Arma un chatbot que responde preguntas en lenguaje natural sobre una base SQL Server con propiedades en venta. Usa tres piezas de Agent Fabric: **MCP Bridge** (convertir una System API en servidor MCP sin tocar código), **AI Gateway / LLM proxy** (un solo endpoint gobernado para varios LLM, con enrutamiento por modelo o semántico) y una **agent network** con un *broker* que elige entre un agente propio (A2A) y un MCP de correo.

## 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:02] | Presentación y agenda | Empresa agéntica, el problema del chatbot, MCP Bridge, AI Gateway (LLM proxy), Agent Fabric, demo. |
| [00:02–00:05] | Del punto a punto a API-led | Muchas aplicaciones por línea de negocio; el punto a punto termina en "spaghetti". API-led + C4E dieron reuso gobernado y costos predecibles. |
| [00:05–00:10] | La era de los agentes | ChatGPT (fin de 2022) → chatbots en 2023 sin acceso a datos internos → MCP (Anthropic) para dar contexto de sistemas → A2A (Google) para que los agentes hablen entre sí. Los agentes deben ser específicos, así que se multiplican: el mismo problema que antes con las APIs. |
| [00:10–00:11] | Los cuatro pilares de Agent Fabric | **Descubrir** (registry y scanners), **gobernar** (AI Gateway, identidad del agente), **orquestar** (broker), **observar** (Agent Visualizer). |
| [00:11–00:14] | El problema del chatbot | Un bot con guion deriva al humano; uno con contexto responde con datos. Requisitos: hablar con sistemas existentes, entender la intención, **no reinventar** (reusar las System APIs), trazabilidad, control y gobierno (no exponer datos sensibles). |
| [00:14–00:16] | MCP Bridge: por qué | Rehacer como MCP las System APIs ya construidas cuesta lo mismo que hacerlas. MCP Bridge (GA en febrero de 2026, según él) las expone como MCP **sin cambiar el código**, con las políticas de MCP y combinando endpoints de varias APIs. |
| [00:16–00:23] | MCP Bridge: demo | System API en CloudHub 2.0 con endpoints de tablas, esquema, valores de muestra y consulta. API Manager → *Agents and tools* → MCP Bridge: Omni Gateway (antes Flex) de *ingress*, base path, URL de la API, endpoints a exponer, mapeo a *tools* (nombre, descripción, *input schema* generado desde la RAML; query/URI params, headers y body → parámetros del tool). Se publica en Exchange y se despliega en el gateway. |
| [00:23–00:27] | AI Gateway / LLM proxy: por qué | Punto único por donde pasa todo el tráfico a LLMs: **enrutamiento** (semántico o por modelo), **acceso unificado** (un endpoint, las claves de cada proveedor quedan en la plataforma), **control de costos** (tokens en un solo panel) y políticas (las de siempre más las de LLM, MCP y A2A). |
| [00:28–00:37] | LLM proxy: demo | API Manager → LLM proxies: formato de entrada (OpenAI o Gemini), base path, Omni Gateway, rutas A/B con proveedor, clave y modelo, y **ruta de respaldo**. *Model-based*: el cliente indica el modelo. *Semantic*: requiere un **semantic service** (embeddings) y frases de ejemplo por ruta; elige el modelo por similitud, con umbral y respaldo. |
| [00:37–00:41] | Diseño del agente NL→SQL | 1) recibe la pregunta, 2) lista tablas vía MCP, 3) trae esquemas, 4–5) muestra valores de columnas y genera el SQL con el LLM, 6) ejecuta vía MCP y resume. Si el SQL falla, se reintenta enviando el error al LLM (hasta 3 veces). |
| [00:41–00:47] | Arquitectura y MCP de correo | Broker → agente NL→SQL → MCP Bridge → System API → base de datos. Un segundo MCP (hecho en Mule desde cero) envía un correo si el usuario muestra interés. |
| [00:47–00:50] | El agente en Mule | **A2A task listener**; `contextId` para guardar y recuperar la conversación en **Object Store**; For Each con **Cache scope** para esquemas; llamadas al LLM proxy (GPT 5.2 para planificar y generar SQL, Gemini Flash para resumir); respuesta en formato A2A; **agent card** desde la configuración del listener. Preguntas de seguimiento usan el contexto anterior. |
| [00:50–00:56] | Agent network | Proyecto de agent network en Code Builder: `agent-network.yaml` (broker con su agent card, instrucciones de enrutamiento, LLM, límites de bucles, errores y *timeout*, agentes y MCP enlazados) y `exchange.json` (URLs y claves). Publicar en Exchange → instancias en API Manager → desplegar el broker en CloudHub 2.0 (unos 5 minutos). |
| [00:56–01:02] | Demo final | El panel del LLM proxy muestra tokens por proveedor. Una UI simple pregunta al broker: cuántas propiedades hay en Dallas, detalles de una; "me interesa" → el broker enruta al MCP de correo y llega el mail. |
| [01:02–01:04] | Cierre | Créditos y preguntas en el post de LinkedIn. |

## 2. Conceptos clave

- **Cuatro pilares de Agent Fabric** [00:10]: descubrir (**Agent Registry** y *scanners*), gobernar (**AI Gateway**, identidad de agentes), orquestar (**Agent Broker**), observar (**Agent Visualizer**).
- **Explosión de agentes** [00:09]: un agente funciona mejor con contexto acotado, así que cada caso nuevo suele ser un agente nuevo. Es el mismo problema de gobierno y reuso que resolvió API-led, con otra pila (MCP y A2A en lugar de REST y OAS).
- **MCP Bridge** [00:14–00:23]: crea un servidor MCP a partir de una o varias APIs REST existentes (System APIs) **sin cambiar su código**. Cada endpoint elegido pasa a ser un *tool*; el *input schema* sale de la especificación (RAML/OAS) y se puede editar el mapeo de parámetros HTTP a parámetros del tool. Se despliega en un **Omni Gateway** y se publica en Exchange; admite las políticas de MCP.
- **Omni Gateway** [00:19]: el gateway que antes se llamaba Flex Gateway. En la demo hay uno de *ingress* (endpoints públicos) y otro de *egress*.
- **AI Gateway / LLM proxy** [00:23–00:37]: un endpoint propio, gobernado, delante de uno o varios proveedores de LLM (OpenAI, Gemini, Anthropic, Bedrock, NVIDIA Nemotron en la lista que muestra).
  - **Model-based routing**: el cliente indica el modelo en la petición.
  - **Semantic routing**: un **semantic service** (servicio de embeddings) compara la petición con frases de ejemplo de cada ruta y elige la más parecida; si la similitud no llega al umbral, va a la ruta de respaldo.
  - **Fallback route**: ruta alternativa si la principal falla (por ejemplo, se agotó la cuota).
  - Beneficios: las claves de cada proveedor quedan en la plataforma, un solo panel de tokens y errores, y políticas centrales.
- **Patrón NL→SQL** [00:37–00:41]: no pedir SQL "a ciegas". Dar al LLM la lista de tablas, el **esquema** y **valores de muestra** de las columnas; ejecutar; si falla, reenviar el SQL y el error para que lo corrija, con un máximo de intentos; resumir el resultado en lenguaje natural con un modelo más barato.
- **Agente A2A en Mule** [00:43–00:48]: un **A2A task listener** recibe mensajes en formato A2A; el **`contextId`** identifica la conversación y permite guardar el historial (aquí en Object Store) para preguntas de seguimiento; la respuesta vuelve en formato A2A. La **agent card** describe el agente (nombre, descripción, *skills*) y se configura en el listener.
- **Agent network** [00:50–00:56]: proyecto con `agent-network.yaml` (el broker con su agent card, **instrucciones** de cuándo usar cada agente o MCP, el LLM que usa, máximo de bucles, de errores consecutivos y *timeout*, y los agentes, MCP y LLM enlazados) y `exchange.json` (valores concretos: URLs, claves). Se **publica** (assets en Exchange e instancias en API Manager) y luego se **despliega** (el broker corre en CloudHub 2.0).
- **El broker también llama a un LLM** [00:52]: para decidir a quién enrutar. Por eso conviene instruirlo para que no reescriba lo que dijo el usuario.

## 3. Para evaluar

Este video es del **temario aparte de Agent Fabric** (la mecánica de esa serie de evaluaciones está por definir). Qué debería poder explicar quien domina este material:
- Los cuatro pilares de Agent Fabric y qué componente cubre cada uno.
- Qué problema resuelve MCP Bridge frente a escribir un servidor MCP desde cero, y de dónde sale el *input schema* de cada tool.
- Diferencia entre enrutamiento por modelo y semántico en un LLM proxy; qué necesita el semántico (semantic service); para qué es la ruta de respaldo.
- Por qué pasar todo el tráfico a LLMs por un único proxy (claves, costos, políticas).
- Qué información necesita un LLM para generar SQL correcto y cómo se maneja un SQL que falla.
- Para qué sirven el `contextId` y la agent card en A2A.
- Qué contienen `agent-network.yaml` y `exchange.json`, y la diferencia entre publicar y desplegar una agent network.

Confusiones típicas que señala el video:
- Reescribir como MCP algo que ya existe como System API [00:12, 00:14].
- Pensar que un chatbot "con IA" ya sabe de los datos de la empresa; sin integración no tiene acceso [00:06–00:07].
- Olvidar la barra final en la URL del agente en `exchange.json`: según él, sin ella no funciona [00:53].
- Dejar que el broker reformule la pregunta del usuario antes de pasarla al agente [00:52].

## 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Empieza por tus System APIs** [00:14–00:16]: si ya existen y están bien especificadas, conviértelas con MCP Bridge en lugar de escribir un MCP. Elige solo los endpoints útiles para un agente (no el `ping`).
2. **Revisa nombres y descripciones de los tools** [00:21]: el LLM decide qué tool usar leyendo esa descripción.
3. **Todo el tráfico a LLMs por un LLM proxy** [00:27–00:31]: un endpoint, claves guardadas en la plataforma, ruta de respaldo configurada.
4. **Elige el modelo por tarea** [00:25, 00:47]: uno fuerte para planificar y generar SQL; uno barato y rápido para resumir. Con enrutamiento semántico no hace falta que el cliente sepa qué modelo usar.
5. **NL→SQL robusto** [00:39–00:40, 00:44–00:47]: esquema + valores de muestra en el prompt, **Cache scope** para no pedir el esquema en cada pregunta, reintento con el error (máximo 3), respuesta resumida.
6. **Conversación con memoria** [00:44]: guarda el historial por `contextId` (Object Store) para que "¿y cuáles son más baratas?" tenga sentido.
7. **Instrucciones claras al broker** [00:51–00:52]: cuándo ir al agente y cuándo al MCP de correo; que no cambie el mensaje del usuario; límites de bucles y *timeout*.
8. **Mide** [00:56]: revisa en el panel del LLM proxy tokens, errores y latencia por proveedor.
9. **Gobierno y datos sensibles** [00:12–00:13]: aplica políticas al MCP y al proxy para no devolver ni pedir datos como un número de identificación personal.

## 5. Para estudiar

- Dibuja el flujo completo de la demo (UI → broker → agente → LLM proxy / MCP Bridge → System API → base) y marca dónde se aplica gobierno.
- Si tienes acceso a Agent Fabric: convierte una System API de prueba con MCP Bridge y llama a sus tools con Postman (o MCP Inspector).
- Escribe las instrucciones de un broker con dos destinos (un agente y un MCP) y piensa qué frases del usuario podrían confundirlo.
- Para profundizar con el material ya ingerido:
  - `libros/agent-fabric-mcp/capitulos/cap02-core-concepts-agent-fabric.md` (pilares y componentes).
  - `libros/agent-fabric-mcp/capitulos/cap03-mcp-fundamentals.md` y `cap04-building-with-mcp.md` (MCP).
  - `libros/agent-fabric-mcp/capitulos/cap05-a2a-multi-agent.md` (A2A, agent card, contexto).
  - `libros/agent-fabric-mcp/capitulos/cap06-designing-agent-networks.md` y `cap07-unified-orchestration.md` (agent network y broker).
  - `libros/agent-fabric-mcp/capitulos/cap09-runtime-governance-flex-gateway.md` (gateway y políticas).
  - Doc oficial de Agent Fabric, agent network y políticas (ver `enlaces-oficiales.md`).

## 6. Nota de verificación

- **"MCP Bridge en GA desde febrero de 2026"** y los pasos exactos en API Manager: datos del presentador, **no verificados** en docs.mulesoft.com.
- **LLM proxy, semantic service, rutas y fallback**: lo que muestra coincide con la idea general de AI Gateway; los nombres de pantallas, proveedores y modelos disponibles son los de su cuenta en ese momento. **No verificado.**
- **Historia** [00:09–00:12]: ChatGPT se lanzó el 30 de noviembre de 2022 (no "en el confinamiento"); MCP lo presentó Anthropic a fines de 2024; **A2A lo anunció Google en abril de 2025**, no en 2024 como dice el video.
- **Cifras** ("897 aplicaciones por empresa", "85% con datos en silos", "33% del software empresarial con IA agéntica en 2028"): las cita sin fuente; parecen venir de informes de MuleSoft y de Gartner. No verificadas.
- **Flex Gateway → Omni Gateway**: coincide con lo anotado en el libro de Agent Fabric.
- **A2A**: `contextId`, agent card y mensajes A2A coinciden con la spec A2A 1.0.0 ya ingerida (la agent card se publica en `/.well-known/agent-card.json`).
- **`agent-network.yaml` + `exchange.json`**: coincide con la referencia oficial ya enlazada en `enlaces-oficiales.md`; el detalle de cada clave no se mostró en el video.
- **"La barra final en la URL del agente es obligatoria"**: observación del presentador, no verificada.
- Herramientas que menciona para crear la agent network ("MuleSoft Vibes", Code Builder): no verificadas.
