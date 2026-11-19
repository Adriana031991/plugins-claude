# Enlaces

Solo se agregan URLs que vienen de `LINKS DE YOUTUBE.txt`, que da la persona, o que se encontraron navegando `docs.mulesoft.com` desde https://docs.mulesoft.com/general/ (sus enlaces o su buscador). En este último caso, la página debe haberse abierto de verdad y se anota como "encontrada en la doc oficial". También vale la especificación de MCP (`https://modelcontextprotocol.io/specification/`), marcada como "oficial (spec MCP)", y la de A2A (`https://a2a-protocol.org/`), marcada como "oficial (spec A2A)". Nunca se inventan.
Tipos: **oficial** (docs.mulesoft.com, help.salesforce.com, Trailhead) y **apoyo** (tutores, blogs). Si un enlace de apoyo contradice uno oficial, gana el oficial.
Columna "Versión": solo se llena si la página lo dice.

## General (todos los destinos)
| URL | Tipo | Tema | Versión | Nota |
|---|---|---|---|---|
| https://docs.mulesoft.com/general/ | oficial | todos | (la vigente) | Página inicial de la documentación oficial. Fuente de verdad. |
| https://help.salesforce.com/s/articleView?id=005298959&type=1 | oficial | temario de certificación | Spring '24, según la guía (consultada 2026-11-13) | "Salesforce Certified MuleSoft Developer Exam Guide". De aquí salen los 12 temas oficiales de taxonomy.json. |
| https://docs.mulesoft.com/dataweave/latest/dataweave-create-module | oficial | dataweave | DataWeave 2.13 (latest, consultada 2026-11-13) | Crear e importar módulos DataWeave: ruta `src/main/resources/modules` y qué puede contener un módulo. La dio la persona. |
| https://docs.mulesoft.com/dataweave/latest/dataweave-cookbook-set-reader-writer-props | oficial | dataweave | DataWeave 2.13 (latest, consultada 2026-11-13) | Cómo poner propiedades de reader y writer en `output` y en `read`/`write`. La dio la persona. |
| https://docs.mulesoft.com/mule-runtime/latest/error-handling | oficial | error-handling | (latest, consultada 2026-11-13) | Manejo de errores en Mule 4. Los ejemplos ponen `<error-handler>` al final del flujo. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/try-scope-concept | oficial | error-handling | (latest, consultada 2026-11-13) | Try scope. El `<error-handler>` va al final del `<try>`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/http-connector/latest/http-request-ref | oficial | connectors | HTTP Connector 1.12 (consultada 2026-11-13) | Operación Request: path con `{param}` + `<http:uri-params>`, headers y query params dinámicos. Encontrada con el buscador de la doc oficial. |
| https://docs.mulesoft.com/apikit/latest/apikit-4-scaffolding-reference | oficial | api-implementation | (latest, consultada 2026-11-13) | Scaffolding REST de APIkit: flujos `api-main`, `api-console` y `get:\recurso:config`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/scatter-gather-concept | oficial | routing | (latest, consultada 2026-11-13) | Scatter-Gather: resultado `{0: …, 1: …}` y error `MULE:COMPOSITE_ROUTING`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/batch-processing-concept | oficial | processing-records | (latest, consultada 2026-11-13) | Batch: fases, variables heredadas por cada registro, on-complete. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/for-each-scope-concept | oficial | processing-records | (latest, consultada 2026-11-18) | For Each: no modifica el payload; las variables nuevas o modificadas dentro siguen disponibles después del scope; `counter` y `rootMessage`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/parallel-foreach-scope | oficial | processing-records | (latest, consultada 2026-11-18) | Parallel For Each: no registra cambios ni variables nuevas creadas dentro; devuelve una colección con el mensaje de cada iteración. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/on-error-scope-concept | oficial | error-handling | (latest, consultada 2026-11-13) | On Error Propagate (rollback) y On Error Continue (commit), y cómo se elige el handler por tipo. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/anypoint-mq-connector/latest/anypoint-mq-connector-reference | oficial | connectors | (latest, consultada 2026-11-13) | Referencia del conector Anypoint MQ: modos de ack (el subscriber usa AUTO por defecto), Ack Token obligatorio y parámetros de la conexión. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/secure-configuration-properties | oficial | propiedades-seguras | (latest, consultada 2026-11-13) | Secure properties: `<secure-properties:encrypt/>` obligatorio, prefijo `secure::`, formato `![...]`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/tls-configuration | oficial | propiedades-seguras | (latest, consultada 2026-11-13) | TLS con keystores y truststores; `tls:context` global o anidado. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/munit/latest/mock-event-processor | oficial | debugging | (latest, consultada 2026-11-14) | MUnit Mock When: `with-attribute` y `then-return` con hijo `munit-tools:payload`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/deploy-to-cloudhub-2 | oficial | deploying-managing, build-dependencias | (latest, consultada 2026-11-14) | Desplegar a CloudHub 2.0 con el Mule Maven Plugin: `mvn clean deploy -DmuleDeploy`, `<cloudhub2Deployment>`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/cloudhub-2/ch2-features | oficial | deploying-managing | (latest, consultada 2026-11-14) | Tabla que compara CloudHub 2.0, CloudHub 1.0 y Runtime Fabric (réplicas vs. workers, private space vs. Anypoint VPC, colas VM persistentes, clustering). Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/deploy-to-rtf | oficial | deploying-managing | (latest, consultada 2026-11-14) | Desplegar a Runtime Fabric con el Mule Maven Plugin: `<runtimeFabricDeployment>`, `deploymentSettings`. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/logger-component-reference | oficial | debugging | (latest, consultada 2026-11-14) | Componente Logger: `<logger level message category/>` sin prefijo. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/mule-runtime/latest/deploy-to-cloudhub | oficial | deploying-managing, build-dependencias | (latest, consultada 2026-11-14) | Despliegue a CloudHub 1.0 con Maven: `<cloudHubDeployment>` (muleVersion, region, workers, workerType). Encontrada en la doc oficial. |
| https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle | oficial (spec MCP) | agent-fabric | 2025-06-18 (consultada 2026-11-14) | Ciclo de vida de MCP: `initialize`, capacidades de cliente y de servidor, `notifications/initialized`. Especificación del protocolo, no es de MuleSoft. Agregada al verificar el libro de Agent Fabric. |
| https://modelcontextprotocol.io/specification/2025-06-18/basic/transports | oficial (spec MCP) | agent-fabric | 2025-06-18 (consultada 2026-11-14) | Transportes stdio y Streamable HTTP; header `Mcp-Session-Id`. Especificación del protocolo, no es de MuleSoft. |
| https://a2a-protocol.org/latest/specification/ | oficial (spec A2A) | agent-fabric | 1.0.0 (consultada 2026-11-15) | Especificación de A2A: agent card en `/.well-known/agent-card.json`, campos obligatorios, capabilities, securitySchemes. Proyecto de la Linux Foundation (aportado por Google). |
| https://docs.mulesoft.com/general/agent-fabric-overview | oficial | agent-fabric | (latest, consultada 2026-11-15) | Qué es Agent Fabric hoy: registry (con scanners), exponer APIs como MCP, A2A bridge, broker, seguridad/gobierno y control de costos. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/general/exp-services-create-a2a-bridge | oficial | agent-fabric | (latest, consultada 2026-11-15) | A2A bridge: hace A2A-compliant a agentes que no lo son (Agentforce, Copilot); genera una agent card **A2A v1**. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/agent-network/latest/af-get-started | oficial | agent-fabric | (latest, consultada 2026-11-15) | Pasos para crear, definir, publicar y desplegar una agent network (agent-network.yaml + exchange.json; CloudHub 2.0/RTF; Omni Gateways; Code Builder, Vibes, CLI). Encontrada en la doc oficial. |
| https://docs.mulesoft.com/agent-network/latest/af-agent-network-yaml-reference | oficial | agent-fabric | Agent Network 2.0 (consultada 2026-11-15) | Formato real de agent-network.yaml: agentNetwork, info, registry, context, brokers. Encontrada en la doc oficial. |
| https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization | oficial (spec MCP) | agent-fabric | 2025-06-18 (consultada 2026-11-15) | Autorización en MCP: OAuth 2.1, validación de audience, token passthrough prohibido, 401/403. |
| https://docs.mulesoft.com/gateway/latest/policies-included-directory | oficial | agent-fabric | Omni Gateway 1.14 (consultada 2026-11-15) | Directorio de políticas inbound de Omni Gateway (antes Flex Gateway): MCP Global Access, MCP Tool Mapping, MCP ABAC, A2A Agent Card, PII Detectors, etc. Encontrada en la doc oficial. |
| https://docs.mulesoft.com/agent-visualizer/ | oficial | agent-fabric | (latest, consultada 2026-11-16) | Agent Visualizer: mapa de agentes, MCP y LLMs, volumen en tiempo real, nodos sin cobertura de políticas de Omni Gateway. Encontrada en la doc oficial. |
| https://www.alexmartinez.ca/ | apoyo | varios | (sin indicar) | Sitio de una tutora. Complemento, no fuente oficial. Pendiente de revisar. |

## cloudhub1
_(sin enlaces todavía)_

## cloudhub2
_(sin enlaces todavía)_

## rtf (Runtime Fabric)
_(sin enlaces todavía)_

## onpremise
_(sin enlaces todavía)_

## Descartados por ahora
| URL | Motivo |
|---|---|
| https://www.enterpriseintegrationpatterns.com/patterns/messaging/ | La persona pidió no usarlo por ahora (patrones generales, no específicos de Mule). |
