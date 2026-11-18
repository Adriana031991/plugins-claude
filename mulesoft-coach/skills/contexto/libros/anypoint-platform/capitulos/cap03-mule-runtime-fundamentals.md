---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 3
titulo: "Mule Runtime Fundamentals"
paginas_pdf: "21-32"
temas: [mule-events, structuring-apps, error-handling, routing, debugging]
transcrito: 2026-11-13
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna (por ejemplo, una URL partida entre "http://" y "www..."). No corrijo ni completo nada.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo termina en el panel superior de la p. 32; ahí empieza el capítulo 4.
-->

# Chapter 3: Mule Runtime Fundamentals

<!-- p. 21 -->
The Mule runtime is the execution engine behind Mule applications, and a clear understanding of how it works changes the way integrations are designed. It becomes easier to reason about application behavior, easier to troubleshoot unexpected output, and easier to build flows that remain readable as they grow. Without that foundation, Mule development can feel like assembling processors until something works. With that foundation, each flow has a clear processing model, each variable has a meaningful role, and each application structure reflects a deliberate design choice.

At its core, the Mule runtime processes events. Those events move through flows, carry data, gather metadata, and trigger processors that transform, route, enrich, or deliver information to another system. This sounds simple at first, but the details matter. A flow does not only move a payload from point A to point B. It also carries context, including attributes, variables, error state, and configuration behavior that shape what the application does at every step. Much of the strength of Mule comes from the fact that this model is consistent across connectors and modules. An HTTP listener, a database connector, a file reader, and a transformation processor all participate in the same event-driven runtime model, even though they serve very different technical purposes.

This consistency is one of the reasons Mule works well in enterprise integration. When you understand how an event changes as it moves through a flow, you can apply the same mental model across APIs, messaging workloads, scheduled jobs, and system-to-system automation. Instead of learning a separate execution style for each integration point, you learn how the runtime treats messages, how flows are structured, how variables carry state, how error handlers respond, and how synchronous and asynchronous processing affect the outcome.

The terms used in Mule development can seem straightforward until they are used carelessly. Message, payload, attributes, variables, flow, subflow, listener, error handler, and global element are all common concepts, but each has a specific place in the runtime model. Confusing them leads to unstable design. For example, using variables as a substitute for careful transformation logic can make flows harder to reason about. Treating a subflow as if it behaves exactly like a separate flow can create wrong assumptions about error behavior and event scope. Building integrations without understanding whether the execution model is request-response, one-way, or asynchronous can lead to mismatched expectations at the API boundary.

This section establishes the runtime concepts that make the rest of Mule development much more predictable. It explains what Mule events are and how messages, attributes, and variables differ. It clarifies how flows, subflows, error handlers, and global elements work together. It shows how processing models affect application behavior and it brings those ideas together in a first end-to-end application. The goal is not only to define terms. The goal is to make the runtime feel understandable as a system, so that application design stops being a sequence of guesses and becomes a deliberate process.

## 3.1: Mule Events, Messages, Attributes, and Variables

The Mule runtime processes a unit of work called a Mule event. That event is the central object moving through a flow, and it is useful to think of it as the full processing context rather than only the business data being carried. Many developers first notice only the payload because it is the most visible part of a message. Yet the runtime uses more than payload alone to drive behavior. Metadata about the source, transport details, internal variables, and error-related state all contribute to what the application does next. Once you see the event as the full runtime context, many parts of Mule development become easier to understand.

A Mule event contains a Mule message and associated variables. The Mule message itself includes the payload and attributes.
<!-- p. 22 -->
The payload is the main content being processed, such as a JSON request body, a row set returned from a database, a file content stream, or an XML response from another service. The attributes describe contextual metadata associated with the current message. For an HTTP listener, attributes can include the request path, method, query parameters, headers, URI parameters, and other transport-level information. For a file operation, attributes may describe the file path or name. For a database operation, the returned payload may contain data rows while the surrounding processing context may include other operational details. The exact structure of attributes depends on the connector or source that produced the message.

This distinction is more important than it looks. The payload is not the only useful source of information in a flow. Many routing decisions, validation checks, and downstream calls depend on attributes rather than on the payload itself. For example, a flow may decide which internal logic path to use based on an HTTP method or path parameter. It may pass along a correlation identifier from an inbound header. It may construct a response header based on metadata rather than the business content in the payload. Treating all incoming context as if it were business data leads to awkward transformations and messy logic. Mule's separation between payload and attributes helps keep transport metadata and business data distinct.

Variables are different again. They are not part of the Mule message in the same sense as payload and attributes. Variables are values stored within the Mule event to support processing within the application. They are often used to hold intermediate results, state needed later in the flow, flags that control behavior, values extracted from the payload for reuse, or information that should survive message transformations. Because payloads can change many times across a flow, variables are often the most reliable place to keep data that should remain available even when the current message is transformed into something else.

This makes variables very useful, but they should be used with discipline. A variable should carry meaningful state that supports the processing model of the flow. It should not become a dumping ground for every passing value. When variables are created without purpose or named vaguely, the flow becomes harder to understand because the real state of the event is spread across too many places. Good variable use improves clarity by preserving what must be retained while letting the payload represent the current message content at the current stage of processing.

The following example shows a straightforward HTTP flow where request attributes and the payload are used together, while a variable captures a value that should remain available after transformation.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="customerFlow">
        <http:listener    config-ref="httpListenerConfig"    path="/customers/{id}"/>
        <set-variable                                         variableName="customerId" value="#[attributes.uriParams.id]"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestedId: vars.customerId,
  method: attributes.method,
  originalPayload: payload
}]]></ee:set-payload>
<!-- p. 23 -->
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

This example is useful because it shows a clean separation of concerns. The customer identifier comes from request attributes, not from the payload. The variable keeps that identifier available in a stable place. The payload is then rebuilt into a structured response that includes both current business content and request metadata. Nothing is mixed carelessly, so the flow remains easy to read.

A more robust version often improves clarity further by separating transport-derived values, correlation information, and business payload handling more deliberately.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="customerFlow">
        <http:listener    config-ref="httpListenerConfig"    path="/customers/{id}"/>
        <set-variable                                         variableName="customerId" value="#[attributes.uriParams.id]"/>
        <set-variable                                         variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  customerId: vars.customerId,
  request: {
    method: attributes.method,
    path: attributes.requestPath
  },
  body: payload
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

The difference is practical. The flow now makes correlation state explicit and separates request metadata from body content more clearly. That pattern is easier to extend once the application grows, because request-level information and business-level content are no longer blended together.

Understanding how the payload changes is especially important. The payload at one step may have no resemblance to the payload at the next. An inbound HTTP request body may be a JSON object, then become a transformed query input, then become a database result set, then become a final response document. This is normal in Mule. The runtime allows processors to replace the payload entirely. That flexibility is useful, but it means you should never assume the payload still contains what it had at the start of the flow unless you intentionally preserved it. If early data is needed later, store it deliberately, usually in variables.

Attributes may also change. An event that begins with HTTP request attributes may later carry different attributes after a connector operation creates a new message. This is a subtle but important point. Attributes belong to the current Mule message, not permanently to the entire business process. If a connector produces a new message, its attributes may reflect that connector's output context rather than the original inbound request. If you need inbound request metadata later, capture what matters before it is lost or replaced.

This is one reason disciplined variable usage is so valuable. Variables survive transformations and message replacement
<!-- p. 24 -->
within the scope of the event. They provide continuity across processing steps. That continuity can hold identifiers, flags, or original request values even when the message itself changes several times. Used well, variables make long flows more stable and readable.

There is also a design point worth emphasizing. Payload, attributes, and variables are not interchangeable storage locations. The payload should represent the current content being processed. Attributes should represent connector- or source-specific metadata tied to the current message. Variables should represent state that the application intentionally carries forward. When these roles stay clear, flows remain understandable. When they blur, debugging becomes harder because it is no longer obvious where important state is supposed to live.

A good way to judge flow quality is to ask whether another developer can tell, at each stage, what the current payload represents, which attributes are relevant, and which variables matter. If the answer is yes, the event model is being used well. If the answer is no, the application is likely relying on implicit assumptions that will eventually cause trouble. Mule gives you a strong event model. The real skill is using it with enough discipline that processing stays clear from the first processor to the last.

## 3.2: Flows, Subflows, Error Handlers, and Global Elements

Once the Mule event model is clear, the next step is understanding how applications are structured. Mule applications are built from flows and supporting elements that define where events enter, how they are processed, how logic is reused, and how failures are handled. This structure is one of the things that makes Mule applications readable when done well and frustrating when done poorly. The difference usually comes down to whether flows have clear responsibilities, whether shared logic is organized properly, and whether error handling is part of the design rather than an afterthought.

A flow is the main execution path in a Mule application. It is a sequence of processors that handles an event from a source through one or more processing steps. A flow often begins with an event source such as an HTTP listener, a scheduler, or a message subscriber. That source creates or receives a Mule event and passes it into the flow. The processors inside the flow then act on that event by transforming payloads, setting variables, calling connectors, logging state, routing logic, or constructing responses. A flow is therefore more than a visual line of processors. It is a complete executable unit that defines how a particular kind of work is performed.

A flow should have a clear responsibility. In practice, this means the flow should represent one coherent path of work rather than becoming the place where every related action is added indefinitely. A good flow name reflects its purpose. Its structure makes it obvious where input is received, where business logic occurs, and where output is produced. When a flow tries to do too much, it becomes difficult to debug and even harder to reuse or test. Splitting large logic into smaller internal units improves maintainability, but that split should be purposeful rather than arbitrary.

Subflows are one of the main ways Mule supports this internal organization. A subflow is a reusable internal sequence of processors that can be invoked from other flows. It does not have its own event source. Instead, it is called by a flow using a flow reference. This makes subflows useful for shared internal logic such as validation steps, common transformations, response shaping, or repeated enrichment behavior. Because a subflow runs within the context of the calling event, it can access the same payload, attributes, and variables. This makes it lightweight and convenient for internal reuse.

The important thing is to understand what subflows are not. They are not separate entry points and they are not independent services. They are internal structural units within the same application. That makes them very useful, but it also means their behavior is tied closely to the event context of the caller. If the calling flow expects certain variables or payload structures, the subflow will operate within that expectation.
<!-- p. 25 -->
A subflow should therefore have a clear input assumption and a focused purpose. It should not become a hidden mini-application that depends on too much implicit state.

Global elements support reuse at the configuration level rather than the processing level. These are shared definitions such as listener configurations, connector connections, reusable object settings, and other components that multiple flows can reference. Global elements reduce repetition and improve consistency because common connection details, transport settings, or shared resources are defined once and reused where needed. This matters in production applications because repeated configuration fragments tend to drift over time. A global HTTP listener configuration, for example, keeps port and host settings centralized. A shared database configuration keeps connection details consistent. These are not merely convenience features. They are part of building maintainable applications.

The following example shows a clean combination of a flow, a subflow, and global configuration. The flow accepts a request, hands work to a subflow, and returns a response based on the resulting payload.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="statusFlow">
        <http:listener config-ref="httpListenerConfig" path="/status"/>
        <flow-ref name="buildStatusResponse"/>
    </flow>

    <sub-flow name="buildStatusResponse">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  status: "up"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```

This is effective because the entry point and the internal reusable logic are clearly separated. The flow receives the event. The subflow builds the response. The listener configuration is centralized as a global element. Nothing is repeated unnecessarily, and the purpose of each part is obvious.

A more robust version becomes useful when shared logic includes validation, variable setting, and structured error handling.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="statusFlow">
        <http:listener        config-ref="httpListenerConfig"        path="/status/{service}"/>
        <error-handler>
            <on-error-propagate                                   enableNotifications="true" logException="true">
<!-- p. 26 -->
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  error: "Request processing failed",
  detail: error.description default "Unknown error"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
                <set-variable variableName="httpStatus" value="500"/>
            </on-error-propagate>
        </error-handler>
        <set-variable                                     variableName="serviceName" value="#[attributes.uriParams.service]"/>
        <flow-ref name="validateServiceName"/>
        <flow-ref name="buildStatusResponse"/>
    </flow>

    <sub-flow name="validateServiceName">
        <choice>
            <when expression="#[isEmpty(vars.serviceName)]">
                <raise-error    type="APP:INVALID_INPUT"    description="Service name is required"/>
            </when>
        </choice>
    </sub-flow>

    <sub-flow name="buildStatusResponse">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  service: vars.serviceName,
  status: "up"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```

The added structure makes a real difference. Validation is isolated in a reusable internal unit. The response construction is still separate. Error handling is explicit and local to the flow. This pattern becomes much easier to maintain as the application grows because responsibilities are separated without losing runtime clarity.

Error handlers are especially important in Mule application structure. They define how failures are processed when something goes wrong inside a flow or a try scope. An error handler is not just a rescue block. It is part of how the application communicates failure, controls propagation, and decides whether processing should stop or continue. Good error handling improves reliability because it makes failure modes intentional.

Two common styles are propagate and continue. Propagation means the error remains significant to the calling context and processing does not quietly proceed as if nothing happened. Continue means the error is handled and processing can resume with an alternate outcome. Choosing between them is not cosmetic. It changes the contract of the flow. If an API request fails and the application should return an error response, propagation may be the right choice. If one non-critical enrichment step fails but the main business process can still return a meaningful result, continuation may be appropriate. The right decision depends on business semantics, not only technical convenience.

It is also helpful to understand that error handlers can exist at more than one level. A flow can have its own error handler. A try scope can also contain one. This allows more local control over failures in selected sections of processing. A database lookup inside a larger flow may have its own recovery logic, while the flow as a whole still has a broader error contract. This layered approach is useful when different processing stages have different recovery expectations.

Global elements and shared configuration support this broader structure by reducing duplication and keeping operational settings centralized. Shared listener configuration, outbound HTTP connection settings, database connection definitions, and common property-loading elements all belong here. This is not only about keeping files shorter. It is about keeping behavior
<!-- p. 27 -->
consistent. If connection settings are changed, the update should happen once in a well-known place, not in multiple copied fragments scattered across flows.

A strong Mule application structure therefore balances execution clarity and reuse. Flows provide clear entry-driven processing units. Subflows provide internal reusable logic. Error handlers make failure behavior explicit. Global elements centralize shared configuration. When those parts are used well, the application becomes easier to read because each structural layer has a distinct job. When they are used poorly, the application becomes confusing because logic, configuration, and recovery behavior are mixed together. The goal is not to use every structural feature available. The goal is to give the application enough shape that both runtime behavior and maintenance responsibility stay clear.

## 3.3: Processing Models, Request-Response, One-way, and Async Execution

The way an application processes an event is just as important as the flow logic itself. A Mule flow may receive a request and return a response immediately. It may accept work and complete without returning business data. It may hand processing to an asynchronous path while allowing the original request thread to continue. These choices affect latency, client expectations, resource usage, reliability, and even how error handling should be designed. Processing model is therefore not a secondary implementation detail. It is part of the contract of the application.

Request-response is one of the most familiar models. In this pattern, the flow receives an inbound request, performs its work, and returns a response to the caller as part of the same interaction. This is common for HTTP APIs, synchronous service calls, and operations where the caller needs a definitive answer before continuing. The advantage is clarity. The caller sends a request and gets a result directly. The cost is that the caller waits while the application completes all required steps. That means latency from downstream services, complex transformations, or slow connectors becomes part of the client experience.

A request-response model is often the right choice when the response itself is the point of the interaction. If an API needs to validate a request, read current data, perform calculations, and return the result immediately, synchronous flow design is appropriate. In these cases, the application should be designed to keep response time predictable, reduce unnecessary side work within the request path, and handle errors in a way that communicates useful failure information back to the caller.

One-way processing is different. In a one-way interaction, the caller or source sends an event, but no business response is expected as part of the same operation. This can occur in inbound messaging, event subscription, fire-and-forget use cases, or scheduler-driven processing. The value of this model is that the source does not depend on an immediate business reply. That can simplify certain interactions and reduce coupling, but it also shifts responsibility. Since there is no immediate response contract, observability and failure handling become even more important. A failed one-way process cannot rely on a client waiting for an error payload. Instead, recovery, logging, retry, and dead-letter strategies take on a bigger role.

Asynchronous execution introduces another layer of runtime behavior. In Mule, asynchronous processing allows part of a flow's work to be handled independently of the main sequential path. This can be useful when a task should happen without blocking the main request-response cycle, such as audit logging, event publication, or non-critical side effects. Asynchronous behavior can improve perceived responsiveness, but it must be used carefully. Once work is split into an async path, timing, error visibility, and transaction expectations all change. What looked like one logical operation may now contain two different execution timelines.

The following example shows a straightforward request-response flow. The client sends a request and receives a response generated during the same processing path.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
<!-- p. 28 -->
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="quoteFlow">
        <http:listener config-ref="httpListenerConfig" path="/quote"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  total: 125.50,
  currency: "USD"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

This flow is fully synchronous and easy to reason about. A request arrives, the payload is constructed, and the response is sent. That is appropriate because the caller expects the result immediately.

A more robust variation becomes useful when part of the work should happen after the response path is effectively complete from the caller's point of view.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="quoteFlow">
        <http:listener config-ref="httpListenerConfig" path="/quote"/>
        <set-variable                                     variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <async>
            <logger level="INFO" message="#[ "Audit event for request " ++ vars.requestId ]"/>
        </async>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  total: 125.50,
  currency: "USD"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

The async block changes the execution story. The audit log operation is no longer part of the main sequential request processing in the same way. That can be useful because it keeps non-critical work from adding friction to the response path. At the same time, it introduces a separate timing concern. If that audit work fails, the client may already have received a successful response. That is sometimes acceptable and sometimes not. The processing model must therefore match the real business requirement.

Request-response design should also account for downstream dependency behavior. If a synchronous API path calls several external services, the total response time includes all of them.
<!-- p. 29 -->
That is not necessarily wrong, but it means the application should be designed with timeouts, clear error handling, and realistic client expectations. A synchronous path should do work that truly belongs to the response. It should avoid absorbing every optional enrichment or side effect merely because it is technically possible.

One-way processing requires a different mindset. Because there is no immediate business response, the success of the interaction is measured operationally rather than conversationally. Did the event get accepted. Was it processed eventually. If processing failed, was it retried, logged, or rerouted appropriately. These are the questions that matter. In a request-response model, the caller sees the result directly. In a one-way model, the platform and application must provide the operational truth.

Async execution should not be treated as a general performance trick. It is useful when the nature of the work supports separation. It is not a substitute for good flow design, and it does not automatically make an application more scalable. In fact, careless async usage can make troubleshooting harder because work becomes less linear and failure visibility becomes less immediate. The strongest use cases are usually tasks that are clearly secondary to the main interaction, such as notification dispatch, logging, or non-critical event publication.

Another important consideration is transaction and error scope. Synchronous request-response processing keeps the event path conceptually linear. If something fails and the flow propagates the error, the caller can usually be informed directly. Async processing breaks that neat line because the background work may fail independently. That changes what success means. A response can be successful while some secondary processing has failed later. This is not inherently bad, but it should be intentional. If the secondary work is actually essential to the business transaction, it may not belong in an async block.

The best way to choose a processing model is to ask what the caller or source truly expects and what work belongs inside that expectation boundary. If the caller needs the result as part of the interaction, request-response is appropriate. If the source only needs confirmation that work has been accepted or triggered, a one-way or event-driven design may be better. If some supporting action should happen independently of the main outcome, async execution may be useful. Each choice should reflect business semantics first, not only technical preference.

Understanding these models improves both application design and troubleshooting. When something behaves unexpectedly, one of the first questions should be whether the chosen processing model matched the intent of the flow. Many issues that look like connector problems or timeout problems are actually contract problems. A synchronous flow is doing too much. An async path contains business-critical work. A one-way process lacks sufficient operational visibility. Once the processing model is chosen correctly, the rest of the design becomes much easier to align.

## 3.4: Building a First End-to-End Mule Application

Bringing the runtime concepts together in one application is the point where Mule development starts to feel concrete. Events, payloads, attributes, variables, flows, subflows, global elements, and processing models are all useful as isolated concepts, but their value becomes fully visible when they work together in one coherent execution path. An end-to-end application does not need to be large to teach the right lessons. In fact, a smaller application often shows the runtime model more clearly because each part is visible without distraction.

A strong first application should do more than return a static payload. It should accept an inbound request, capture request context, apply validation or shaping logic, perform a transformation, and return a response that reflects the full path of processing. That creates just enough complexity to show how the Mule event changes through the flow while keeping the structure understandable. The aim is not to produce a production-grade application in one step. The aim is to build a complete and readable flow that demonstrates how the runtime model operates in practice.

<!-- p. 30 -->
The first version below exposes an HTTP endpoint that receives an order-related request, captures values from the request, and returns a structured response. It is intentionally compact, but it already includes several important runtime ideas. It uses a listener as the flow source, accesses request attributes, sets a variable, transforms the payload, and returns a response in the same request-response interaction.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="orderStatusFlow">
        <http:listener        config-ref="httpListenerConfig"        path="/orders/{orderId}"/>
        <set-variable                                     variableName="orderId" value="#[attributes.uriParams.orderId]"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  orderId: vars.orderId,
  status: "RECEIVED",
  requestMethod: attributes.method
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

This application already teaches several useful habits. The order identifier comes from the request path and is stored in a variable. The response is generated using DataWeave, which means the output structure is explicit and easy to read. Request metadata is kept distinct from business output, but it can still be included where relevant. The flow has one clear responsibility and one clear endpoint. This is the kind of application that helps build trust in the runtime model because each processing step is visible.

A more robust version becomes much more realistic by adding property-driven configuration, internal validation, a reusable subflow, clearer variables, and explicit error handling. It also separates response creation from validation logic and shows how a flow can remain readable even as it becomes more complete.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns:configuration-properties="http://www.mulesoft.org/schema/mule/configuration-properties"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core                    http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http                    http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core                 http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd
        http://www.mulesoft.org/schema/mule/configuration-properties http://www.mulesoft.org/schema/mule/configuration-properties/current/mule-configuration-properties.xsd">

    <configuration-properties file="properties/local.yaml"/>

    <http:listener-config name="httpListenerConfig">
        <http:listener-connection host="${http.host}" port="${http.port}"/>
    </http:listener-config>

    <flow name="orderStatusFlow">
        <http:listener        config-ref="httpListenerConfig"        path="/orders/{orderId}"/>
        <error-handler>
<!-- p. 31 -->
            <on-error-propagate logException="true">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  error: "Order request failed",
  detail: error.description default "Unknown error"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </on-error-propagate>
        </error-handler>
        <set-variable                                     variableName="orderId" value="#[attributes.uriParams.orderId]"/>
        <set-variable                                     variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <flow-ref name="validateOrderRequest"/>
        <flow-ref name="buildOrderStatusResponse"/>
    </flow>

    <sub-flow name="validateOrderRequest">
        <choice>
            <when expression="#[isEmpty(vars.orderId)]">
                <raise-error    type="APP:INVALID_INPUT"    description="Order identifier is required"/>
            </when>
        </choice>
    </sub-flow>

    <sub-flow name="buildOrderStatusResponse">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  orderId: vars.orderId,
  status: "RECEIVED",
  source: {
    method: attributes.method,
    path: attributes.requestPath
  }
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```

YAML

```yaml
http:
  host: "0.0.0.0"
  port: "8081"
```

This version is more realistic without becoming cluttered. Configuration is externalized. The listener uses properties rather than hard-coded host and port values. The application captures both an order identifier and a correlation-style request identifier. Validation is separated into a subflow. Response building is separated into another subflow. Error handling is explicit. These additions show how a Mule application can grow in structure without losing readability.

The difference between the two versions is useful to notice. The first proves the core runtime model. The second shows what happens when that model is shaped into a more maintainable application. The event still moves through a flow. The payload is still transformed into a response. But now the application has clearer boundaries and more deliberate state handling. That is what real Mule development should look like as applications evolve.

An end-to-end application is also a good place to practice runtime reasoning. When the request arrives, the listener creates a Mule event. The request path parameter becomes part of the inbound attributes. The flow stores that value in a variable because it should remain available regardless of how the payload changes. The request identifier is also captured into a variable so it can be used later without depending on the original message context. Validation runs as a separate reusable unit. The response is built in a later step using the current event state. If an error occurs, the error handler intercepts it and reshapes the payload into a client-friendly error response. Each of these steps reflects one of the runtime ideas introduced earlier.

<!-- p. 32 -->
This is exactly why first applications should be read not only as code but as event stories. What enters the flow. What state is captured. What changes. What is preserved. Where can failure happen. What leaves the flow. If you can answer those questions clearly, you understand the application at runtime, not just syntactically.

It is also worth paying attention to naming. Names such as orderStatusFlow, validateOrderRequest, and buildOrderStatusResponse make the application easier to follow because they reflect responsibility. Flow and subflow names are not decoration. They are part of how runtime intent is communicated. A clear name makes debugging, logging, and handoff easier. This matters even more in larger applications, where dozens of flows may coexist.

The same principle applies to variables. Names such as orderId and requestId are better than generic names because they communicate business meaning. Variables should not merely exist. They should tell you why they exist. When variables are named lazily, flows become slower to understand. When they are named clearly, event state becomes much easier to read.

A first application should also encourage healthy caution about assumptions. The payload at the beginning of the flow may not be the payload later. The request attributes are available early, but they should be captured if they matter later. The event can fail at several points, so the flow needs an opinion about how errors are expressed. Configuration should not be buried in the flow when it clearly belongs in properties. These are not advanced concerns. They are part of writing an application that remains understandable beyond its first run.

There is a practical confidence that comes from building an end-to-end Mule application this way. The runtime stops feeling abstract. You can see the event enter, watch it acquire state, observe the transformation that shapes the response, and understand where structure and error behavior belong. That confidence becomes very important in more complex applications. Once the fundamentals are stable, adding connectors, external calls, validations, and richer transformations becomes much less intimidating because the event-driven runtime model is already clear.

Mule applications grow in sophistication, but they do not stop being event-driven flows executed by the same runtime. The more strongly that foundation is understood now, the easier it becomes to build larger integrations later without losing clarity. That is the real value of getting the fundamentals right. It keeps the runtime understandable even when the application becomes much more capable.
