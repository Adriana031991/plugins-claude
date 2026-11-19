# Índice global del material ingerido

Se lee primero. Orden de consulta: este índice, luego el `resumen.md` del libro, luego el fragmento exacto. Los PDFs no se vuelven a abrir.

Libros:
- `anypoint-platform`: MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs (171 págs.)
- `agent-fabric-mcp`: MuleSoft Agent Fabric and MCP for Agentic Integration Workflows (160 págs.). Transcrito completo (14 capítulos); temario y evaluaciones aparte, por definir.
- `whitepaper-seguridad`: Security by Design: Building Defense in Depth with an Application Network (whitepaper de MuleSoft, 7 págs., fuentes de 2016)

| Fragmento | Temas | De qué trata |
|---|---|---|
| `anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.1 | application-networks | Qué cubre Anypoint Platform a lo largo del ciclo de vida |
| `anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.2 | application-networks, deploying-managing | Control plane vs. runtime plane |
| `anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.3 | application-networks | API-led connectivity (system, process, experience) y cuándo aplicarla |
| `anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.4 | deploying-managing | Modelo gestionado vs. autogestionado e híbrido |
| `anypoint-platform/capitulos/cap02-setting-up-development-environment.md` §2.1 | herramientas-desarrollo | Cuándo usar Code Builder, Studio o Design Center |
| `anypoint-platform/capitulos/cap02-setting-up-development-environment.md` §2.2 | structuring-apps, propiedades-seguras, build-dependencias | Estructura del proyecto, `configuration-properties`, `secure-properties` y `pom.xml` con MUnit |
| `anypoint-platform/capitulos/cap02-setting-up-development-environment.md` §2.3 | debugging, propiedades-seguras | Ejecución local con `-M-D`, perfiles YAML, depuración y logs |
| `anypoint-platform/capitulos/cap02-setting-up-development-environment.md` §2.4 | reuso-exchange | Cómo preparar activos reutilizables para Exchange |
| `anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` §3.1 | mule-events | Evento, mensaje, payload, attributes y variables, con ejemplos XML |
| `anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` §3.2 | structuring-apps, error-handling, routing | Flow vs. sub-flow, flow-ref, error handlers, global elements, raise-error en choice |
| `anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` §3.3 | structuring-apps, error-handling | Request-response, one-way y async (bloque `<async>`) |
| `anypoint-platform/capitulos/cap03-mule-runtime-fundamentals.md` §3.4 | mule-events, structuring-apps, debugging | Primera app completa (orderStatusFlow), básica y robusta |
| `anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` §4.1 | dataweave | Sintaxis, tipos, casting, selectores, `default` y condicionales |
| `anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` §4.2 | dataweave | Transformar JSON, XML (`.@attr`, `.*item`), CSV y Java |
| `anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` §4.3 | dataweave, reuso-exchange | Funciones `fun`, módulos con `import`, variables locales y diseño mantenible |
| `anypoint-platform/capitulos/cap04-dataweave-transformation-mapping.md` §4.4 | dataweave, processing-records | Propiedades de reader y writer, `skipNullOn`, streaming y rendimiento |
| `anypoint-platform/capitulos/cap05-connectors-and-modules.md` §5.1 | connectors, structuring-apps, error-handling | Conector vs. módulo, configuración global vs. operación, `db:select` básico y robusto |
| `anypoint-platform/capitulos/cap05-connectors-and-modules.md` §5.2 | connectors, propiedades-seguras | Conectores HTTP (`http:request`, headers), Database, File (`file:write` con nombre dinámico) y SaaS |
| `anypoint-platform/capitulos/cap05-connectors-and-modules.md` §5.3 | connectors, routing | VM (`vm:publish`/`vm:listener`) y Object Store para idempotencia (`os:contains`, `os:store`) |
| `anypoint-platform/capitulos/cap05-connectors-and-modules.md` §5.4 | connectors, propiedades-seguras, structuring-apps | Diseño reutilizable y seguro: configuraciones compartidas, sub-flows, credenciales y nombres |
| `anypoint-platform/capitulos/cap06-api-design-contract-first.md` §6.1 | designing-apis | Contract-first en Design Center; Customer API en RAML 1.0 y OpenAPI 3.0.3, básica y robusta |
| `anypoint-platform/capitulos/cap06-api-design-contract-first.md` §6.2 | designing-apis | Recursos, métodos, traits (`is:`) y data types; Order API con request/response separados y ErrorResponse |
| `anypoint-platform/capitulos/cap06-api-design-contract-first.md` §6.3 | reuso-exchange, designing-apis | Publicar specs y fragmentos en Exchange: descubrimiento, versionado y nombres |
| `anypoint-platform/capitulos/cap06-api-design-contract-first.md` §6.4 | api-implementation | APIkit: `apikit:config`, `apikit:router`, flujos por método y validación contra el contrato |
| `anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` §7.1 | routing, structuring-apps | Choice router (`when`/`otherwise`, `raise-error`), variables normalizadas y sub-flows de orquestación |
| `anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` §7.2 | routing | Scatter-Gather en paralelo, agregación de resultados y fallos parciales |
| `anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` §7.3 | processing-records, structuring-apps | Scheduler (`fixed-frequency`) y Batch job (`process-records`, `step`, `on-complete`) |
| `anypoint-platform/capitulos/cap07-application-logic-routing-flow-composition.md` §7.4 | structuring-apps | Separar transporte, lógica y transformación con sub-flows con nombre |
| `anypoint-platform/capitulos/cap08-error-handling-retry-reliability.md` §8.1 | error-handling | Tipos de error, `raise-error`, `on-error-propagate` vs. `on-error-continue`, handler de flujo vs. `<try>` |
| `anypoint-platform/capitulos/cap08-error-handling-retry-reliability.md` §8.2 | error-handling, connectors | `until-successful`, redelivery e idempotencia con Object Store |
| `anypoint-platform/capitulos/cap08-error-handling-retry-reliability.md` §8.3 | error-handling, connectors | Transacciones locales y XA en `<try transactionalAction="ALWAYS_BEGIN">` |
| `anypoint-platform/capitulos/cap08-error-handling-retry-reliability.md` §8.4 | error-handling, routing | Dead-letter con VM, contexto para reproceso y flujos replay-safe |
| `anypoint-platform/capitulos/cap09-messaging-state-async.md` §9.1 | connectors, structuring-apps | Productor y consumidor con Anypoint MQ (`publish`/`subscriber`), contrato de evento, evento vs. comando |
| `anypoint-platform/capitulos/cap09-messaging-state-async.md` §9.2 | connectors, error-handling | Ack automático vs. `acknowledgementMode="MANUAL"` + `anypoint-mq:ack`, redelivery |
| `anypoint-platform/capitulos/cap09-messaging-state-async.md` §9.3 | connectors | Object Store para idempotencia, correlación (`os:retrieve`, `os:remove`) y checkpoints |
| `anypoint-platform/capitulos/cap09-messaging-state-async.md` §9.4 | error-handling, connectors | Duplicados, orden con número de secuencia, dead-letter y reproceso |
| `anypoint-platform/capitulos/cap10-security-identity-secrets.md` §10.1 | deploying-managing | Roles, teams, business groups y environments; mínimo privilegio |
| `anypoint-platform/capitulos/cap10-security-identity-secrets.md` §10.2 | deploying-managing, api-implementation | SSO, proveedores de identidad externos; autenticación vs. autorización; tres capas de identidad |
| `anypoint-platform/capitulos/cap10-security-identity-secrets.md` §10.3 | propiedades-seguras | `secure-properties:config`, YAML con `![...]`, keystore vs. truststore, `tls:context` y HTTPS |
| `anypoint-platform/capitulos/cap10-security-identity-secrets.md` §10.4 | propiedades-seguras, deploying-managing | Secrets Manager, policies en el borde de la API y operación segura |
| `anypoint-platform/capitulos/cap11-api-management-policies-governance.md` §11.1 | deploying-managing | API Manager: API gestionada vs. implementación, gobierno ligado al despliegue, entornos y analítica |
| `anypoint-platform/capitulos/cap11-api-management-policies-governance.md` §11.2 | deploying-managing | Policies para control de clientes, tráfico (rate limiting) y protección en el borde |
| `anypoint-platform/capitulos/cap11-api-management-policies-governance.md` §11.3 | designing-apis | Gobierno del diseño: rulesets, conformance, revisiones y excepciones |
| `anypoint-platform/capitulos/cap11-api-management-policies-governance.md` §11.4 | reuso-exchange | Exchange y assets orientados a la experiencia para programas de APIs reutilizables |
| `anypoint-platform/capitulos/cap12-testing-quality-delivery-pipelines.md` §12.1 | debugging | MUnit: `munit:test` con behavior, execution y validation, `assert-that`, cobertura |
| `anypoint-platform/capitulos/cap12-testing-quality-delivery-pipelines.md` §12.2 | debugging | `mock-when` (con `with-attribute`), `spy` + `verify-call`, datos de prueba y asserts |
| `anypoint-platform/capitulos/cap12-testing-quality-delivery-pipelines.md` §12.3 | build-dependencias | `pom.xml` con mule-maven-plugin y munit-maven-plugin, `mvn clean test package` |
| `anypoint-platform/capitulos/cap12-testing-quality-delivery-pipelines.md` §12.4 | deploying-managing, propiedades-seguras | Promoción del mismo artefacto entre entornos, flujo CI/CD, rollback |
| `anypoint-platform/capitulos/cap13-deploying-to-cloudhub.md` §13.1 | deploying-managing | Runtime gestionado, regiones, réplicas y alta disponibilidad, tolerancia a reinicios |
| `anypoint-platform/capitulos/cap13-deploying-to-cloudhub.md` §13.2 | deploying-managing, propiedades-seguras | Mismo artefacto con propiedades y secretos por entorno en CloudHub |
| `anypoint-platform/capitulos/cap13-deploying-to-cloudhub.md` §13.3 | deploying-managing | Private spaces, ingress, endpoints y aislamiento de red |
| `anypoint-platform/capitulos/cap13-deploying-to-cloudhub.md` §13.4 | deploying-managing | Escalado, eventos de mantenimiento y límites operativos |
| `anypoint-platform/capitulos/cap14-runtime-fabric-hybrid.md` §14.1 | deploying-managing | Arquitectura de Runtime Fabric y su relación con Kubernetes; control plane vs. ejecución |
| `anypoint-platform/capitulos/cap14-runtime-fabric-hybrid.md` §14.2 | deploying-managing | Instalar, configurar y operar entornos RTF como producto interno |
| `anypoint-platform/capitulos/cap14-runtime-fabric-hybrid.md` §14.3 | deploying-managing, build-dependencias | Topologías híbridas; `pom.xml` con `runtimeFabricDeployment` |
| `anypoint-platform/capitulos/cap14-runtime-fabric-hybrid.md` §14.4 | deploying-managing | Comparación entre RTF, CloudHub y hosting self-managed |
| `anypoint-platform/capitulos/cap15-monitoring-logging-operations.md` §15.1 | debugging, deploying-managing | Monitoreo de apps, APIs y recursos; alertas útiles |
| `anypoint-platform/capitulos/cap15-monitoring-logging-operations.md` §15.2 | debugging | Logs con correlation ID, niveles, envío de logs a sistemas externos, troubleshooting |
| `anypoint-platform/capitulos/cap15-monitoring-logging-operations.md` §15.3 | deploying-managing | API Visualizer: mapa de dependencias e impacto |
| `anypoint-platform/capitulos/cap15-monitoring-logging-operations.md` §15.4 | debugging, processing-records | Tuning de rendimiento, streaming y planificación de capacidad |
| `anypoint-platform/capitulos/cap16-enterprise-architecture-migration.md` §16.1 | application-networks, reuso-exchange | Diseño de capas System, Process y Experience reutilizables |
| `anypoint-platform/capitulos/cap16-enterprise-architecture-migration.md` §16.2 | deploying-managing | Migración de despliegues y assets legacy |
| `anypoint-platform/capitulos/cap16-enterprise-architecture-migration.md` §16.3 | deploying-managing, error-handling | Fallas comunes en producción y cómo evitarlas |
| `anypoint-platform/capitulos/cap16-enterprise-architecture-migration.md` §16.4 | application-networks, build-dependencias | Arquitectura de referencia híbrida; `pom.xml` con profiles CloudHub y RTF |
| `agent-fabric-mcp/capitulos/cap01-agentic-integration-protocols.md` §1.1 | agent-fabric | Por qué los flujos agénticos necesitan una capa de integración |
| `agent-fabric-mcp/capitulos/cap01-agentic-integration-protocols.md` §1.2 | agent-fabric | Diferencia entre API, tool, agente y red de agentes |
| `agent-fabric-mcp/capitulos/cap01-agentic-integration-protocols.md` §1.3 | agent-fabric | Dónde van MCP, A2A y MuleSoft Agent Fabric en el stack |
| `agent-fabric-mcp/capitulos/cap01-agentic-integration-protocols.md` §1.4 | agent-fabric | Fallas comunes en flujos de agentes entre plataformas |
| `agent-fabric-mcp/capitulos/cap02-core-concepts-agent-fabric.md` §2.1 | agent-fabric | Registry, broker y red de agentes |
| `agent-fabric-mcp/capitulos/cap02-core-concepts-agent-fabric.md` §2.2 | agent-fabric | Modelo discover / orchestrate / govern / observe |
| `agent-fabric-mcp/capitulos/cap02-core-concepts-agent-fabric.md` §2.3 | agent-fabric | Agent Fabric vs. agent builder vs. API gateway |
| `agent-fabric-mcp/capitulos/cap02-core-concepts-agent-fabric.md` §2.4 | agent-fabric | Puntos de control en una arquitectura agéntica |
| `agent-fabric-mcp/capitulos/cap03-mcp-fundamentals.md` §3.1 | agent-fabric | Arquitectura cliente-servidor de MCP, ciclo de vida, `initialize` y negociación |
| `agent-fabric-mcp/capitulos/cap03-mcp-fundamentals.md` §3.2 | agent-fabric | Tools, resources y prompts (`tools/list`, `resources/list`, `prompts/get`) |
| `agent-fabric-mcp/capitulos/cap03-mcp-fundamentals.md` §3.3 | agent-fabric | Transportes (stdio, remoto), sesiones y cliente Python |
| `agent-fabric-mcp/capitulos/cap03-mcp-fundamentals.md` §3.4 | agent-fabric | Diseño de interfaces MCP estables (capa de traducción, versionado, dueño) |
| `agent-fabric-mcp/capitulos/cap04-building-with-mcp.md` §4.1 | agent-fabric | Exponer funciones de empresa como tools MCP (cancellation eligibility, handler Python) |
| `agent-fabric-mcp/capitulos/cap04-building-with-mcp.md` §4.2 | agent-fabric | Resources para casos de mucha lectura (customer support profile) |
| `agent-fabric-mcp/capitulos/cap04-building-with-mcp.md` §4.3 | agent-fabric | Prompt templates sin convertir MCP en un basurero de prompts |
| `agent-fabric-mcp/capitulos/cap04-building-with-mcp.md` §4.4 | agent-fabric | Validación, errores distinguibles y semántica de tools (create_return_request) |
| `agent-fabric-mcp/capitulos/cap05-a2a-multi-agent.md` §5.1 | agent-fabric | Qué resuelve A2A que MCP no |
| `agent-fabric-mcp/capitulos/cap05-a2a-multi-agent.md` §5.2 | agent-fabric | Agent cards, descubrimiento y contratos de interacción |
| `agent-fabric-mcp/capitulos/cap05-a2a-multi-agent.md` §5.3 | agent-fabric | Mensajes, tareas y artifacts (JSON del libro difiere de la spec A2A 1.0) |
| `agent-fabric-mcp/capitulos/cap05-a2a-multi-agent.md` §5.4 | agent-fabric | Enrutar trabajo entre especialistas sin perder control |
| `agent-fabric-mcp/capitulos/cap06-designing-agent-networks.md` §6.1 | agent-fabric | Modelar redes de agentes con configuración declarativa (YAML) |
| `agent-fabric-mcp/capitulos/cap06-designing-agent-networks.md` §6.2 | agent-fabric | Publicar agentes, brokers y servidores MCP como assets (exchange.json, empaquetado) |
| `agent-fabric-mcp/capitulos/cap06-designing-agent-networks.md` §6.3 | agent-fabric | Metadatos de Exchange para descubrir y reutilizar |
| `agent-fabric-mcp/capitulos/cap06-designing-agent-networks.md` §6.4 | agent-fabric | Desplegar redes de agentes en entornos gestionados |
| `agent-fabric-mcp/capitulos/cap07-unified-orchestration.md` §7.1 | agent-fabric | Cuándo usar broker y cuándo llamadas directas |
| `agent-fabric-mcp/capitulos/cap07-unified-orchestration.md` §7.2 | agent-fabric | Combinar MCP y A2A en un mismo flujo (dispute-resolution) |
| `agent-fabric-mcp/capitulos/cap07-unified-orchestration.md` §7.3 | agent-fabric | Procesos de varios pasos entre plataformas (fulfillment-exception) |
| `agent-fabric-mcp/capitulos/cap07-unified-orchestration.md` §7.4 | agent-fabric | Evitar el acoplamiento oculto en la orquestación |
| `agent-fabric-mcp/capitulos/cap08-securing-agentic-workflows.md` §8.1 | agent-fabric | Autenticación y autorización entre agentes y servidores MCP (FastAPI, scopes) |
| `agent-fabric-mcp/capitulos/cap08-securing-agentic-workflows.md` §8.2 | agent-fabric | Identidad de agente confiable, token exchange y on-behalf-of |
| `agent-fabric-mcp/capitulos/cap08-securing-agentic-workflows.md` §8.3 | agent-fabric | Proteger el acceso a tools con políticas (visibilidad y uso) |
| `agent-fabric-mcp/capitulos/cap08-securing-agentic-workflows.md` §8.4 | agent-fabric | Evitar mal uso de tokens, exceso de privilegios y exposición no deseada |
| `agent-fabric-mcp/capitulos/cap09-runtime-governance-flex-gateway.md` §9.1 | agent-fabric | Ubicación del gateway en ingress y egress para tráfico de agentes |
| `agent-fabric-mcp/capitulos/cap09-runtime-governance-flex-gateway.md` §9.2 | agent-fabric | MCP Global Access, Tool Mapping y Attribute-Based Access Control |
| `agent-fabric-mcp/capitulos/cap09-runtime-governance-flex-gateway.md` §9.3 | agent-fabric | Protección A2A, reescritura de agent cards y datos sensibles |
| `agent-fabric-mcp/capitulos/cap09-runtime-governance-flex-gateway.md` §9.4 | agent-fabric | Orden de las políticas (policyChain, process_mcp_request) |
| `agent-fabric-mcp/capitulos/cap10-observability-monitoring.md` §10.1 | agent-fabric | Qué monitorear en agentes, brokers y servidores MCP |
| `agent-fabric-mcp/capitulos/cap10-observability-monitoring.md` §10.2 | agent-fabric | Agent Visualizer para entender las relaciones en ejecución |
| `agent-fabric-mcp/capitulos/cap10-observability-monitoring.md` §10.3 | agent-fabric | Métricas, logs y señales de falla que importan (correlation ID, fallas por clase) |
| `agent-fabric-mcp/capitulos/cap10-observability-monitoring.md` §10.4 | agent-fabric | Troubleshooting de flujos rotos, llamadas lentas y misroutes |
| `agent-fabric-mcp/capitulos/cap11-versioning-protocol-drift.md` §11.1 | agent-fabric | Soporte de protocolo ≠ paridad con la spec |
| `agent-fabric-mcp/capitulos/cap11-versioning-protocol-drift.md` §11.2 | agent-fabric | Gestionar versiones de MCP sin romper clientes (negociación, capa de compatibilidad) |
| `agent-fabric-mcp/capitulos/cap11-versioning-protocol-drift.md` §11.3 | agent-fabric | Evolución de A2A, connector gaps y desajuste de contratos (normalización) |
| `agent-fabric-mcp/capitulos/cap11-versioning-protocol-drift.md` §11.4 | agent-fabric | Rutas de actualización en un ecosistema de estándares cambiante |
| `agent-fabric-mcp/capitulos/cap12-external-discovery-cross-platform.md` §12.1 | agent-fabric | Importar y registrar agentes y endpoints MCP externos |
| `agent-fabric-mcp/capitulos/cap12-external-discovery-cross-platform.md` §12.2 | agent-fabric | Scanners y descubrimiento por metadatos (descubierto ≠ validado) |
| `agent-fabric-mcp/capitulos/cap13-end-to-end-patterns.md` §13.1 | agent-fabric | Flujo de soporte con broker y tools (support-delivery-dispute) |
| `agent-fabric-mcp/capitulos/cap13-end-to-end-patterns.md` §13.2 | agent-fabric | Operaciones financieras con delegación y controles de aprobación |
| `agent-fabric-mcp/capitulos/cap13-end-to-end-patterns.md` §13.3 | agent-fabric | Servicio a empleados con contexto y políticas (leave request) |
| `agent-fabric-mcp/capitulos/cap13-end-to-end-patterns.md` §13.4 | agent-fabric | Patrones de diseño reutilizables para integración agéntica |
| `agent-fabric-mcp/capitulos/cap14-operating-agentic-systems.md` §14.1 | agent-fabric | Decisiones de arquitectura que envejecen bien |
| `agent-fabric-mcp/capitulos/cap14-operating-agentic-systems.md` §14.2 | agent-fabric | Estándares de documentación, pruebas y revisión de flujos agénticos |
| `agent-fabric-mcp/capitulos/cap14-operating-agentic-systems.md` §14.3 | agent-fabric | Checklists de gobierno para estar listo para producción |
| `agent-fabric-mcp/capitulos/cap14-operating-agentic-systems.md` §14.4 | agent-fabric | Blueprint práctico en 10 partes para redes de agentes unificadas |
| `whitepaper-seguridad/documento.md` (Introducción a Why connectivity) | application-networks | Brecha CIO/CISO; punto a punto vs. conectividad como disciplina de negocio |
| `whitepaper-seguridad/documento.md` (Shadow IT, CISO) | application-networks | Shadow IT, superficie expuesta, perímetro único vs. seguridad compartimentada |
| `whitepaper-seguridad/documento.md` (API-led connectivity a People) | application-networks, reuso-exchange | Application network como defensa en profundidad: puertas (permissioning, authentication, provisioning, monitoring, alerting), reutilización y efecto de red |
| `whitepaper-seguridad/documento.md` (Anypoint Platform, pasos, conclusión) | application-networks, deploying-managing | Cómo lo habilita Anypoint Platform (API Manager, Exchange) y pasos para empezar |

## Videos (material de apoyo)

Un archivo de notas por serie, con una sección por video y marcas de tiempo. Rutas relativas a `skills/contexto/`.

| Nota | Temas | De qué trata |
|---|---|---|
| `videos/serie-1.md` (sesión 1) | application-networks, herramientas-desarrollo | Formato y estrategia del examen MCD1; punto a punto → ESB → API-led; tres capas; C4E y Catalyst |
| `videos/serie-1.md` (sesión 2) | designing-apis, api-implementation, structuring-apps, deploying-managing, mule-events | Ciclo de vida de la API; console vs. portal; flujos que genera APIkit; deployable archive; query vs. URI params; config por entorno con `env` y `global.xml` |
| `videos/serie-1.md` (sesión 3) | deploying-managing, structuring-apps, mule-events, debugging | Opciones de runtime y Mule agent; Mule domain; proxy vs. basic endpoint con Autodiscovery; familias de políticas; Mule event, transport boundary y logger |
| `videos/serie-1.md` (sesión 4) | dataweave, processing-records | Presentado por alumnos: funciones básicas de DataWeave; Batch Job, steps, aggregator, On Complete y variables en batch |
| `videos/serie-1.md` (sesión 5) | error-handling, api-implementation | Valores por defecto del Listener; Propagate vs. Continue; Default Error Handler; padre-hijo; Try; global error handler; error mapping |
| `videos/serie-1.md` (sesión 6) | routing, reuso-exchange, designing-apis | API Governance; Choice, Scatter-Gather, First Successful, Round Robin; Validation; versionado semántico; día del examen |
| `videos/serie-2.md` (video 1) | application-networks | Anypoint Platform; Mule 4; API-led y cuándo no usar tres capas |
| `videos/serie-2.md` (video 2) | herramientas-desarrollo, structuring-apps, build-dependencias, mule-events | Instalar Studio, JDK 17 y Maven; estructura del proyecto, POM y mule-artifact; flujo vs. subflow; Mule message y depurador; Code Builder |
| `videos/serie-2.md` (video 3) | dataweave | DataWeave desde cero: tipos, operadores, `==` vs `~=`, todos los selectores (JSON y XML), variables, `if`/`match`, funciones, `map`/`filter`/`update` |
| `videos/serie-2.md` (video 4) | mule-events, dataweave | Set Payload, Set Variable, Remove Variable, Transform Message; MIME type por defecto; trampa de varias salidas |
| `videos/serie-2.md` (video 5) | routing, processing-records | Choice, Round Robin, For Each (`counter`, `rootMessage`), Parallel For Each |
| `videos/serie-2.md` (video 6) | designing-apis, connectors | APIs REST, URL, URI y query params, métodos, códigos; HTTP Request, configuración global, target variable |
| `videos/serie-2.md` (video 7) | structuring-apps, propiedades-seguras | Properties en YAML y `.properties`; `${}` y `p()`; Configuration properties; `-Denv` |
| `videos/serie-2.md` (video 8) | designing-apis, api-implementation, connectors | HTTP Listener y allowed methods; RAML con tipos; APIkit, scaffolding, validación 400 e implementación |
| `videos/agent-fabric.md` | agent-fabric (temario aparte) | Chatbot NL→SQL: MCP Bridge sobre una System API, LLM proxy con enrutamiento por modelo y semántico, agente A2A en Mule y agent network con broker |
