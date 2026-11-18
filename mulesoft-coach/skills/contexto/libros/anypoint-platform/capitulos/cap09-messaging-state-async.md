---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 9
titulo: "Messaging, State, and Asynchronous Integration"
paginas_pdf: "99-112"
temas: [connectors, error-handling, structuring-apps]
transcrito: 2026-11-13
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna: las parejas de schemaLocation ("http://" + "www..."), el xmlns:anypoint-mq partido ("http://www.mulesoft.org/schema/mule/" + "anypoint-mq"), los atributos partidos (destination=..., value=..., key=...) y los message=... de logger partidos. No corrijo ni completo nada.
- Cuando un bloque de código cruza de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 99 y termina en el panel superior de la p. 112; ahí empieza el capítulo 10.
-->

# Chapter 9: Messaging, State, and Asynchronous Integration

<!-- p. 99 -->
Synchronous request-response flows are only one part of enterprise integration. Many important workloads do not fit comfortably into a direct call-and-response pattern, and some should not be designed that way at all. Systems often need to publish events, react to them later, hand work to downstream processors without blocking the original caller, or continue processing after the initiating transaction has ended. In these situations, messaging becomes the backbone of the interaction model. Instead of tightly coupling one system's timing to another system's response, a message creates a handoff point. That handoff changes the design in useful ways. It can improve resilience, reduce latency at the API edge, isolate spikes in demand, and make different parts of an architecture evolve more independently.

This shift also changes what reliability means. In synchronous APIs, the immediate response often tells you whether the work succeeded or failed. In asynchronous integrations, that truth is often deferred. A message may be accepted into a queue and processed later. A subscriber may receive a message but fail before completion. A downstream consumer may see the same message more than once. Ordering may matter in some workflows but not in others. State may need to be held briefly to correlate messages, detect duplicates, or track in-flight work. These are not edge details. They are the normal conditions of message-driven systems.

Mule applications support this style of work well because the same event-driven runtime model used for APIs and connector-based flows can also support asynchronous patterns. A flow can publish a message instead of returning a final business result immediately. Another flow can subscribe to a queue and process work independently. Internal or external state can be used to make the processing safer. This gives you an architecture
<!-- p. 100 -->
that can separate acceptance from completion and still remain understandable if it is designed carefully.

The challenge is that message-driven systems require different instincts from direct API design. A message should usually be treated as durable intent rather than as a temporary payload. Consumer logic should assume redelivery is possible. Acknowledgement behavior should reflect when work is truly safe to mark as complete. Lightweight state should be used with discipline rather than as an excuse for hidden coupling. Failures should route to controlled recovery paths rather than vanish into generic logs. These ideas make asynchronous integration powerful, but they also demand careful design.

This section explains the main messaging patterns used with queues, subscribers, and event-driven flows, then focuses on how Anypoint MQ behaves in real applications, including acknowledgement and delivery choices. It then looks at Object Store as a practical tool for idempotency, correlation, and lightweight runtime state. Finally, it turns to the reliability realities of duplicate delivery, ordering, and failure recovery. The goal is to make asynchronous design feel concrete and usable, not abstract. Once those patterns are clear, messaging stops being something added to an API and becomes a deliberate architectural choice.

## 9.1: Messaging Patterns with Queues, Subscribers, and Event-driven Flows

A queue introduces a useful boundary between the producer of work and the consumer of work. The producer does not need to wait for the consumer to finish. The consumer does not need to be active at the exact moment the producer creates the message, as long as the messaging system can retain it until processing happens. That separation is why queues are valuable in integration design. They turn direct dependence into managed handoff. This is often the difference between a fragile synchronous chain and a system that can absorb spikes, recover from temporary downstream outages, and let parts of the architecture evolve at different speeds.

A producer flow publishes a message when it has reached the point where the next work unit should be handed off rather than completed inline. This might happen after an API has validated a request and decided it should be processed later. It might happen when a file ingestion flow has split a larger input into per-record work items. It might happen when one business event should trigger several downstream reactions that do not need to finish before the original caller receives an acknowledgement. In each case, the message is not merely data. It is a formal handoff of responsibility.

A subscriber flow consumes that message and performs the next step independently. In a well-designed system, the subscriber should be able to understand the message without relying on too much hidden context from the producer. That means the message payload and metadata should contain enough information to let the subscriber act correctly. This often includes business identifiers, correlation values, event type information, and the minimum data needed for the next stage of work. A subscriber should not need to guess what the producer meant or call back into the producer's private state to continue.

The following example shows a straightforward pattern in which an HTTP flow accepts an order submission and publishes a message for later processing. A second flow subscribes to the queue and handles the work.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <anypoint-mq:config name="mqConfig"
                        url="https://mq.example"
                        clientId="client-id"
                        clientSecret="client-secret"/>

    <flow name="submitOrderFlow">
        <http:listener config-ref="listenerConfig" path="/orders"/>
        <set-variable variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  order: payload
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
        <anypoint-mq:publish config-ref="mqConfig" destination="orders.queue"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  status: "accepted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <flow name="processOrderFlow">
        <anypoint-mq:subscriber config-ref="mqConfig" destination="orders.queue"/>
        <logger level="INFO" message='#[ "Processing order message " ++ payload.requestId ]'/>
    </flow>
</mule>
```
<!-- p. 101: el bloque anterior empieza en la p. 100 y sigue en esta página desde "http://www.mulesoft.org/schema/mule/ee/core http://..." -->
<!-- [DUDA] p. 101: debajo del logger de processOrderFlow, al final del panel superior, se ve una marca pequeña y cortada que no se lee. No la transcribí. -->

This is the simplest correct version because it demonstrates the essential pattern clearly. The producer accepts the request, packages a work message, publishes it, and returns an acceptance response. The consumer handles the asynchronous work independently.

A more robust version becomes useful when the producer should define a cleaner event contract, preserve message intent more explicitly, and separate consumer orchestration from transport and queue concerns.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <anypoint-mq:config name="mqConfig"
                        url="https://mq.example"
                        clientId="client-id"
                        clientSecret="client-secret"/>

    <flow name="submitOrderFlow">
        <http:listener config-ref="listenerConfig" path="/orders"/>
        <set-variable variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <flow-ref name="buildOrderSubmittedEvent"/>
        <anypoint-mq:publish config-ref="mqConfig" destination="orders.queue"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  status: "accepted",
  eventType: "OrderSubmitted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <sub-flow name="buildOrderSubmittedEvent">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  eventType: "OrderSubmitted",
  requestId: vars.requestId,
  occurredAt: now() as String,
  order: {
    customerId: payload.customerId,
    items: payload.items default []
  }
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <flow name="processOrderFlow">
        <anypoint-mq:subscriber config-ref="mqConfig" destination="orders.queue"/>
        <flow-ref name="orchestrateOrderProcessing"/>
    </flow>

    <sub-flow name="orchestrateOrderProcessing">
        <logger level="INFO" message='#[ "Processing event " ++ payload.eventType ++ " with requestId " ++ payload.requestId ]'/>
    </sub-flow>
</mule>
```
<!-- p. 102: el bloque anterior empieza en la p. 101 y sigue en esta página desde "<anypoint-mq:publish config-ref="mqConfig" destination="orders.queue"/>" -->

This version is stronger because the event contract is more explicit. The producer publishes a clear event structure instead of an ad hoc payload. The consumer delegates processing into a business-oriented subflow instead of embedding all logic directly in the subscriber flow. This is closer to how event-driven systems should be shaped.

Event-driven flows become more useful when you stop thinking of the queue as just a transport tool and start thinking of it as part of the business interaction model. A message says that something has happened or that something needs to happen. That distinction matters. An event that says an order was submitted is different from a command that says generate an invoice. Both may move through a queue, but they express different intent. A strong message contract makes that intent visible. This is useful not only for clarity but also for future growth. Event-driven systems often gain more consumers over time, and the original message design will either support that evolution or make it harder.

A queue also changes timing. In a synchronous API, timing is immediate and shared between caller and callee. In a message-driven interaction, timing is decoupled. This creates opportunities and responsibilities. The opportunity is resilience and scalability. The responsibility is that the producer should not promise completion when it has only achieved acceptance. That distinction should appear in the API response, in operational monitoring, and in the broader business expectations around the flow. A message-driven system works best when everyone involved understands that acceptance into a queue is not identical to business completion.

Subscribers are the active part of this model. They consume, interpret, and advance the work represented by messages. Good subscriber design assumes that the queue is a real boundary. That means it should validate message content, preserve or derive correlation context, handle failures intentionally, and avoid relying on private assumptions from the producer. A subscriber that only works because the producer happened to format the message one very specific way without documenting or stabilizing that contract is brittle.

<!-- p. 103 -->
Queues are also useful when work should be smoothed over time. A producer may receive bursts of activity that would overload downstream systems if processed inline. Publishing to a queue allows the system to accept work at one rate and consume it at another. This is one of the reasons asynchronous integration often improves reliability. Instead of letting every upstream surge become a direct pressure spike on downstream services, the architecture absorbs the work and lets consumers process it with more control.

At the same time, this only works well if the message contract, subscriber logic, and operational handling are designed clearly. A queue is not a hiding place for complexity. It is a structure for managing it. Good event-driven flows make the handoff visible, the message useful, and the next processing stage understandable. When those conditions are present, messaging becomes one of the most effective ways to build integration systems that are more resilient and easier to scale.

## 9.2: Working with Anypoint MQ, Acknowledgement Modes, and Delivery Behavior

Anypoint MQ provides managed messaging capabilities that fit naturally into Mule applications. It allows flows to publish messages to queues and subscribe to those queues later, which makes it a practical choice for asynchronous handoff, event-driven processing, decoupled orchestration, and workload smoothing. Like any message broker, though, it should not be approached as if publishing and consuming messages were enough by themselves. Delivery behavior, acknowledgement timing, and consumer design all matter. The mechanics of how a message is acknowledged and what happens if processing fails are central to reliability.

A queue-based interaction creates two important moments. The first is when the message is published and accepted by the messaging system. The second is when a subscriber has processed that message successfully enough that it can be acknowledged and removed from further delivery. The gap between those two moments is where much of the complexity lives. If the subscriber fails before acknowledgement, the message may appear again. If acknowledgement happens too early, the message may be lost even though business processing did not finish. This is why acknowledgement mode is not an operational afterthought. It is part of the processing contract.

When a subscriber consumes from Anypoint MQ, the acknowledgement strategy helps define who controls the completion of the message and when that completion is declared. An auto-style acknowledgement approach may be convenient, but it reduces the application's control over exactly when a message should be considered safely processed. A manual acknowledgement approach gives the application more responsibility and more precision, which is often better for serious business flows because the subscriber can decide to acknowledge only after the critical work has actually succeeded.

The following example shows a straightforward publish and subscribe pattern with Anypoint MQ. It keeps the queue interaction simple and easy to read.

XML

```xml
<mule xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <anypoint-mq:config name="mqConfig"
                        url="https://mq.example"
                        clientId="client-id"
                        clientSecret="client-secret"/>

    <flow name="publishEventFlow">
        <set-payload value='#[{ eventType: "CustomerUpdated", customerId: "C1001" }]'/>
        <anypoint-mq:publish config-ref="mqConfig" destination="customer.events.queue"/>
    </flow>

    <flow name="consumeEventFlow">
        <anypoint-mq:subscriber config-ref="mqConfig" destination="customer.events.queue"/>
        <logger level="INFO" message='#[ "Received message for customer " ++ payload.customerId ]'/>
    </flow>
</mule>
```
<!-- p. 104: el bloque anterior empieza en la p. 103 y sigue en esta página desde "<anypoint-mq:publish config-ref="mqConfig" destination="customer.events.queue"/>" -->

This is the simplest correct version because it shows the essential interaction. A producer publishes an event. A consumer receives it. For introductory scenarios, this is enough to make the queue behavior visible.

A more robust version becomes much more useful when the subscriber uses manual acknowledgement and only acknowledges the message after the critical business work has completed successfully.

XML

```xml
<mule xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <anypoint-mq:config name="mqConfig"
                        url="https://mq.example"
                        clientId="client-id"
                        clientSecret="client-secret"/>

    <flow name="publishEventFlow">
        <set-payload value='#[{ eventType: "CustomerUpdated", customerId: "C1001", requestId: uuid() }]'/>
        <anypoint-mq:publish config-ref="mqConfig" destination="customer.events.queue"/>
    </flow>

    <flow name="consumeEventFlow">
        <anypoint-mq:subscriber config-ref="mqConfig"
                                destination="customer.events.queue"
                                acknowledgementMode="MANUAL"/>
        <logger level="INFO" message='#[ "Processing message " ++ payload.requestId ]'/>
        <flow-ref name="processCustomerUpdate"/>
        <anypoint-mq:ack config-ref="mqConfig"/>
    </flow>

    <sub-flow name="processCustomerUpdate">
        <logger level="INFO" message='#[ "Applying update for customer " ++ payload.customerId ]'/>
    </sub-flow>
</mule>
```

The difference is operationally significant. The consumer does not acknowledge immediately after receipt. It acknowledges only after the business step has completed. This gives the application better control over whether a failure should result in redelivery.

This is where delivery behavior becomes meaningful. A message queue generally aims for reliable delivery, but reliable delivery does not mean exactly-once execution of arbitrary consumer logic. It means the messaging system will keep trying to make the message available according to its delivery model and acknowledgement rules. The application must still be prepared for redelivery, duplicate handling, and the consequences of acknowledging too early or too late.

Acknowledgement timing should therefore match the point of durable business completion, or at least the point at which the application can safely tolerate duplicate reprocessing. If the subscriber writes to a database and then acknowledges, that might be acceptable if the write is idempotent or transactionally safe in the intended way. If the subscriber calls an external system that may not tolerate duplicates, the design needs stronger idempotency or a different recovery strategy before acknowledgement behavior can be trusted.

<!-- p. 105 -->
The same idea applies to negative acknowledgement or failure to acknowledge. If processing fails and the subscriber does not acknowledge the message, redelivery may occur later. That is often the right behavior, but only if the flow can survive retry safely. If the first attempt partially succeeded before failing, the second attempt must not create corruption or duplicate side effects. This is why acknowledgement behavior and idempotency design are tightly connected. One without the other is not enough.

Another important aspect of delivery behavior is throughput and consumer balance. A queue can absorb producer traffic, but the subscriber still determines how quickly messages are drained and how much work is in flight at once. If the consumer flow performs expensive operations or calls slow downstream systems, message processing speed may drop. This is not a failure of the queue. It is a design signal that the consumer logic, scaling pattern, or downstream rate expectations need attention. Messaging smooths pressure, but it does not eliminate the need to think about consumer capacity.

Message visibility also matters. A strong subscriber flow logs enough useful context to make operational diagnosis possible without flooding logs with full payloads unnecessarily. Correlation identifiers, business identifiers, queue names, and meaningful status transitions are often more useful than dumping the entire message repeatedly. When a message fails and is redelivered, operators need to tell whether it is the same business work returning or a distinct new event. Stable identifiers make that possible.

Another useful practice is to design queue payloads as explicit event contracts rather than raw intermediate objects. This matters even more in Anypoint MQ because a queue often becomes a shared integration boundary over time. A message that begins as a single-flow internal handoff may later be consumed by another process or reviewed through operational tooling. Clear event structure, including event type and identifiers, makes that evolution much easier to handle.

Manual acknowledgement is often the right choice for important business processing because it places the decision about message completion inside the flow where business truth exists. That said, manual control also creates responsibility. If the flow never acknowledges because the logic path forgot to include it, redelivery will continue in ways that may look confusing until the design error is found. This is why acknowledgement logic should be visible, deliberate, and tested under failure conditions as well as happy-path conditions.

A useful way to judge the quality of an Anypoint MQ consumer is to ask three questions. When is the message truly safe to acknowledge. What happens if the same message appears again. What information remains available if the message fails repeatedly and must be recovered later. If the answers to those questions are clear, the flow is probably designed well. If they are vague, the queue interaction may work under ideal conditions but still be operationally fragile.

Messaging systems reward this kind of realism. They do not require perfection, but they do require that the application respect the difference between accepted work and completed work. Anypoint MQ gives the platform tools to manage that handoff. The application design still has to decide what completion means, when acknowledgement is justified, and how to behave when delivery is not neat and one-time. That is the essence of reliable queue consumption.

## 9.3: Using Object Store for Idempotency, Correlation, and Lightweight State

Object Store is one of the most useful internal state tools in Mule because it provides a place to keep small, meaningful pieces of runtime information without forcing the application into full database-style persistence. This makes it well suited for integration control patterns rather than for general business storage. When used carefully, it supports idempotency, message correlation, checkpoint tracking, and other forms of lightweight state that help asynchronous and distributed flows behave more safely.

The most important idea here is scope of purpose. Object Store is not the place to keep arbitrary long-lived domain data as though it were a relational or document store. Its real value
<!-- p. 106 -->
lies in coordination. If the application needs to know whether a given business key has already been processed, whether a message correlation identifier has already been seen, whether a short-lived workflow token exists, or whether a temporary checkpoint has been reached, Object Store can be an excellent fit. These are stateful concerns, but they are coordination concerns rather than system-of-record concerns.

Idempotency is one of the clearest examples. In a message-driven architecture, duplicate delivery is always possible enough to matter. In an API architecture, retries and client repeats create similar risks. If the same logical request arrives twice, the application may need to detect that fact and avoid redoing state-changing work. Object Store can help by storing a processing key and checking whether that key has already been seen. This does not solve every possible duplicate problem, but it gives the flow a practical way to defend itself against many of them.

The following example shows a simple idempotency check for a queue-driven order-processing flow. The flow uses a business key to decide whether the work should proceed.

XML

```xml
<mule xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <os:object-store name="processingStore"/>

    <flow name="processOrderMessageFlow">
        <set-variable variableName="processingKey" value="#[payload.orderId]"/>
        <os:contains objectStore="processingStore" key="#[vars.processingKey]" target="alreadyProcessed"/>
        <choice>
            <when expression="#[vars.alreadyProcessed]">
                <logger level="INFO" message='#[ "Duplicate order message skipped for " ++ vars.processingKey ]'/>
            </when>
            <otherwise>
                <os:store objectStore="processingStore" key="#[vars.processingKey]" value="#['processed']"/>
                <logger level="INFO" message='#[ "Order message processed for " ++ vars.processingKey ]'/>
            </otherwise>
        </choice>
    </flow>
</mule>
```

This is the simplest correct version because it shows the core pattern clearly. A processing key is derived from business data, checked in Object Store, and then used to decide whether the work should continue.

A more robust version becomes useful when the stored record should provide enough metadata to support debugging, replay decisions, or downstream coordination.

XML

```xml
<mule xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <os:object-store name="processingStore"/>

    <flow name="processOrderMessageFlow">
        <set-variable variableName="processingKey" value="#[payload.orderId]"/>
        <set-variable variableName="requestId" value="#[(payload.requestId default uuid())]"/>
        <os:contains objectStore="processingStore" key="#[vars.processingKey]" target="alreadyProcessed"/>

        <choice>
            <when expression="#[vars.alreadyProcessed]">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  orderId: vars.processingKey,
  status: "already-processed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </when>
            <otherwise>
                <os:store objectStore="processingStore"
                          key="#[vars.processingKey]"
                          value='#[{
                              requestId: vars.requestId,
                              state: "processed",
                              processedAt: now() as String
                          }]'/>
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  orderId: vars.processingKey,
  status: "processed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </otherwise>
        </choice>
    </flow>
</mule>
```
<!-- p. 107: el bloque anterior empieza en la p. 106 y sigue en esta página desde "<set-variable variableName="requestId" ..." -->

This version is more informative because the state record is now useful beyond simple yes-or-no duplication control. It captures enough context to help diagnose what happened and when.

Correlation is another strong Object Store use case. In asynchronous systems, work often proceeds in stages, and related messages or operations need to be linked through a shared identifier. One system may publish an event that triggers a later callback or continuation. Another flow may receive a message containing a short correlation token and need to retrieve previously stored context before proceeding. Object Store is useful here because it can hold the correlation record long enough for the next step to find it.

The following example shows a flow that stores a temporary correlation record after publishing work and later uses that record when a related event arrives.

XML

```xml
<mule xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <os:object-store name="correlationStore"/>

    <flow name="submitFulfillmentFlow">
        <set-variable variableName="correlationId" value="#[uuid()]"/>
        <os:store objectStore="correlationStore"
                  key="#[vars.correlationId]"
                  value='#[{
                      orderId: payload.orderId,
                      customerId: payload.customerId
                  }]'/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  correlationId: vars.correlationId,
  status: "submitted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <flow name="handleFulfillmentResultFlow">
        <set-variable variableName="correlationId" value="#[payload.correlationId]"/>
        <os:retrieve objectStore="correlationStore" key="#[vars.correlationId]" target="correlatedRequest"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  orderId: vars.correlatedRequest.orderId,
  customerId: vars.correlatedRequest.customerId,
  fulfillmentStatus: payload.status
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```
<!-- p. 108: el bloque anterior empieza en la p. 107 y sigue en esta página desde "---" (dentro de submitFulfillmentFlow) -->

This is a practical pattern because it treats the correlation record as temporary, useful state rather than as a hidden dependency. The follow-up flow can continue with the context it needs without forcing all of that context into every message.

A more robust version often introduces cleanup or lifecycle awareness so the store does not become a graveyard of stale records.

XML

```xml
<mule xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <os:object-store name="correlationStore"/>

    <flow name="submitFulfillmentFlow">
        <set-variable variableName="correlationId" value="#[uuid()]"/>
        <os:store objectStore="correlationStore"
                  key="#[vars.correlationId]"
                  value='#[{
                      orderId: payload.orderId,
                      customerId: payload.customerId,
                      createdAt: now() as String
                  }]'/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  correlationId: vars.correlationId,
  status: "submitted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <flow name="handleFulfillmentResultFlow">
        <set-variable variableName="correlationId" value="#[payload.correlationId]"/>
        <os:retrieve objectStore="correlationStore" key="#[vars.correlationId]" target="correlatedRequest"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  orderId: vars.correlatedRequest.orderId,
  customerId: vars.correlatedRequest.customerId,
  fulfillmentStatus: payload.status
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
        <os:remove objectStore="correlationStore" key="#[vars.correlationId]"/>
    </flow>
</mule>
```
<!-- p. 109: el bloque anterior empieza en la p. 108 y termina en esta página con "<os:remove ... />", "</flow>" y "</mule>" -->

The stronger design removes the correlation entry after it has served its purpose. That is a good example of Object Store being used as temporary state rather than permanent accumulation.

Lightweight state can also help with processing checkpoints, throttling decisions, and coarse workflow markers. For example, a scheduled job might store the timestamp of its last successful run so that the next run can fetch only changed records. A consumer might store a marker indicating that a certain aggregate has already advanced to a specific stage. These uses are valid when the state is coordination-focused and limited in scope. They become problematic when Object Store is treated as an informal general-purpose database without the discipline and controls that real durable business storage requires.

Another practical concern is visibility. State stored in Object Store should be conceptually discoverable to the team maintaining the integration. That does not mean every key must be manually inspected often. It means the application design should make it clear why the state exists, what its key means, what its value represents, and what its lifecycle should be. Hidden state is dangerous because it creates invisible coupling between flows. Useful state is explicit enough in the design that its purpose can be understood and defended.

This is why good naming and key strategy matter. A processing key should map clearly to a business or technical concept that justifies idempotency. A correlation key should reflect the handoff that ties two stages together. The more arbitrary the keys become, the harder the state becomes to reason about. Strong Object Store usage is usually boring in the best sense. The keys are clear. The values are purposeful. The lifecycle is understood. The flows using the state are not trying to be clever.

Object Store becomes one of the most powerful reliability tools in Mule when used this way. It allows asynchronous and retry-prone systems to retain enough memory of prior work to stay safe without demanding a full database every time a lightweight coordination problem appears. That is exactly the niche where it performs best.

## 9.4: Designing for Duplicate Delivery, Ordering, and Failure Recovery

Message-driven integration becomes truly reliable only when it accepts three uncomfortable but very normal realities. Messages may arrive more than once. They may not always be processed in the exact order you would prefer. Some of them will fail in ways that require controlled recovery instead of instant success. These realities are not signs that the platform is broken. They are part of what makes distributed messaging systems practical. Reliability comes from designing with them in mind rather than pretending they will not happen.

Duplicate delivery is the first of these realities. It can happen because a subscriber processed part of the work and failed before acknowledgement, because a retry reintroduced the same business operation, or because a producer itself emitted a repeated message. In all of these cases, the consumer must be able to tolerate repetition without corrupting state or creating duplicate side effects. This is why duplicate-safe design is not optional in asynchronous systems. The question is never whether duplicates are theoretically possible. The question is whether the flow can survive them when they appear.

Ordering is more subtle. Some workloads do not care about message order. If customer preference updates are independent and idempotent, processing them in slightly different order may not matter. Other workloads care deeply. If a cancellation must not be processed before an order creation event, the sequence matters. The correct design depends on the business semantics, not on a vague preference for neatness. Good messaging architecture identifies where ordering truly matters and avoids assuming strict order where it cannot be justified or enforced safely.

Failure recovery is the final part of the picture. A failed message should not disappear, but it also should not create endless unstable retries. Recovery must preserve enough context to explain the failure and enough control to replay or redirect the
<!-- p. 110 -->
message later without causing more damage. This often means dead-letter handling, correlation preservation, and replay-aware consumer logic working together rather than being added separately.

The following example shows a consumer design that checks for prior processing before applying a state-changing step. It is a simple but effective defense against duplicate delivery.

XML

```xml
<mule xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <anypoint-mq:config name="mqConfig"
                        url="https://mq.example"
                        clientId="client-id"
                        clientSecret="client-secret"/>

    <os:object-store name="processingStore"/>

    <flow name="processShipmentEventFlow">
        <anypoint-mq:subscriber config-ref="mqConfig"
                                destination="shipment.events.queue"
                                acknowledgementMode="MANUAL"/>
        <set-variable variableName="processingKey" value="#[payload.shipmentId]"/>
        <os:contains objectStore="processingStore" key="#[vars.processingKey]" target="alreadyProcessed"/>

        <choice>
            <when expression="#[vars.alreadyProcessed]">
                <logger level="INFO" message='#[ "Skipping duplicate shipment event " ++ vars.processingKey ]'/>
            </when>
            <otherwise>
                <os:store objectStore="processingStore" key="#[vars.processingKey]" value="#['processed']"/>
                <logger level="INFO" message='#[ "Processed shipment event " ++ vars.processingKey ]'/>
            </otherwise>
        </choice>

        <anypoint-mq:ack config-ref="mqConfig"/>
    </flow>
</mule>
```

This is the simplest correct version because it acknowledges a very important truth. The consumer assumes duplicates can happen and handles them deliberately before acknowledging the message.

A more robust version becomes useful when the message should carry a stable sequencing hint, when processing state should be richer, and when failures should route to a dead-letter destination instead of remaining implicit.

XML

```xml
<mule xmlns:anypoint-mq="http://www.mulesoft.org/schema/mule/anypoint-mq"
      xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/anypoint-mq http://www.mulesoft.org/schema/mule/anypoint-mq/current/mule-anypoint-mq.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <anypoint-mq:config name="mqConfig"
                        url="https://mq.example"
                        clientId="client-id"
                        clientSecret="client-secret"/>

    <os:object-store name="processingStore"/>

    <flow name="processShipmentEventFlow">
        <anypoint-mq:subscriber config-ref="mqConfig"
                                destination="shipment.events.queue"
                                acknowledgementMode="MANUAL"/>

        <error-handler>
            <on-error-continue logException="true">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  shipmentId: payload.shipmentId default null,
  sequence: payload.sequence default null,
  errorType: error.errorType.identifier,
  errorDescription: error.description,
  failedPayload: payload
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
                <anypoint-mq:publish config-ref="mqConfig" destination="shipment.dead.letter.queue"/>
            </on-error-continue>
        </error-handler>

        <set-variable variableName="processingKey" value="#[payload.shipmentId]"/>
        <os:contains objectStore="processingStore" key="#[vars.processingKey]" target="alreadyProcessed"/>

        <choice>
            <when expression="#[vars.alreadyProcessed]">
                <logger level="INFO" message='#[ "Skipping duplicate shipment event " ++ vars.processingKey ]'/>
            </when>
            <otherwise>
                <os:store objectStore="processingStore"
                          key="#[vars.processingKey]"
                          value='#[{
                              state: "processed",
                              sequence: payload.sequence,
                              processedAt: now() as String
                          }]'/>
                <logger level="INFO" message='#[ "Processed shipment event " ++ vars.processingKey ]'/>
            </otherwise>
        </choice>

        <anypoint-mq:ack config-ref="mqConfig"/>
    </flow>
</mule>
```
<!-- p. 111: el bloque anterior empieza en la p. 110 y sigue en esta página desde "clientSecret="client-secret"/>" -->

This version is more operationally complete. It stores richer processing state, includes a sequencing hint, and preserves failed messages in a dedicated dead-letter queue with enough context for later recovery.

Ordering should be approached with practical caution. If the business requires strict ordering, the design should state that clearly and support it deliberately rather than assuming the broker or subscriber arrangement will always preserve sequence under every condition. Some messaging patterns, queue types, and consumer arrangements support stronger ordering guarantees than others, but even then the application should still decide what the sequence means and how to react if a later event arrives before an earlier one has been fully applied.

A useful strategy is to make ordering visible in the message contract when the business process truly depends on it. A sequence number, event version, or lifecycle stage marker can help the consumer detect whether an event is stale, ahead of expectation, or inconsistent with the current known state. The application can then choose a safe response. It may defer, reject, dead-letter, or apply the message depending on what ordering semantics are justified. What matters is that ordering becomes a conscious design element rather than an implicit hope.

This is also where lightweight state can help. If a consumer stores the latest processed sequence for a business entity, it can compare incoming events and avoid applying older ones out of order. That does not eliminate all ordering problems, but it can significantly reduce the risk of state regression. The key is to define clearly what "later" and "earlier" mean in business terms. Ordering logic should reflect business reality, not only technical arrival time.

<!-- p. 112 -->
Failure recovery in this context has two jobs. First, it must preserve failed messages with enough context to support diagnosis and replay. Second, it must ensure that replaying them will not create new inconsistencies. This is why replay-safe design matters so much. A dead-letter queue without idempotent consumer logic is not enough, because the replay may simply reintroduce the same duplicate or partial side effect problem that caused the failure to matter in the first place.

A strong replay strategy often begins with the same identifiers used for idempotency and correlation. If the failed message carries a stable processing key, then replay can be recognized as the same business action rather than a new one. If ordering matters, replay should also include enough sequencing context to re-evaluate whether the message is still valid. If the application stores prior processing state, replay can check that state before doing anything irreversible.

There is also a broader mindset shift here. In asynchronous systems, "done" often means more than "the code path finished once." It means the message was processed in a way that can tolerate retries, duplicates, and delayed recovery. This is a higher standard, but it is the right one. A consumer that only succeeds on the first clean attempt is not robust enough for real distributed messaging conditions.

The design goal is therefore not perfect single-pass execution. The design goal is controlled eventual correctness. Messages may arrive twice. Ordering may need explicit handling. Some work will fail and need recovery later. A reliable integration accepts those facts and still preserves business correctness through idempotent processing, explicit state, stable identifiers, and recovery paths that are deliberate rather than improvised.

When these ideas are applied consistently, asynchronous integration becomes much safer and much more predictable. The queue is no longer just a place where work waits. It becomes part of a disciplined system in which producers hand off intent clearly, consumers process with duplication and ordering in mind, and failures become recoverable states rather than silent losses or endless loops. That is the point at which messaging stops being merely asynchronous and becomes reliable.
