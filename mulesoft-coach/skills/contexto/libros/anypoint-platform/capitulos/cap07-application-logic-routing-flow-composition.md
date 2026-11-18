---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 7
titulo: "Application Logic, Routing, and Flow Composition"
paginas_pdf: "71-85"
temas: [routing, structuring-apps, processing-records, error-handling]
transcrito: 2026-11-13
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna: las parejas de schemaLocation ("http://" + "www..."), los atributos partidos (por ejemplo path="/customers/{id}/" + "overview") y los set-variable partidos. No corrijo ni completo nada.
- Cuando un bloque de código cruza de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 71 y termina en el panel superior de la p. 85; ahí empieza el capítulo 8.
-->

# Chapter 7: Application Logic, Routing, and Flow Composition

<!-- p. 71 -->
A Mule application becomes genuinely useful when its internal logic is arranged in a way that reflects the real structure of the work being performed. A listener can receive a request, a connector can call a system, and a DataWeave script can transform payloads, but those pieces alone do not create a well-designed application. The application needs logic that decides what should happen next, routing that directs events to the right path, orchestration that coordinates several dependent steps, and composition patterns that keep the whole flow understandable as the solution grows. This is where Mule applications start to show either discipline or drift.

Application logic in integration work is often more demanding than it first appears. The system may need to decide between different downstream services based on request content. It may need to gather results from more than one source and combine them into one response. It may need to run jobs that process large data sets over time rather than complete immediately. It may need to separate transport-specific concerns from business decisions so that the same logic can be reused across APIs, scheduled jobs, and event-driven triggers. These are not unusual edge cases. They are part of the normal shape of enterprise integration.

Good flow composition matters because complexity tends to grow from small decisions. A flow that begins with one route and one connector call can gradually become a chain of conditionals, transformations, retries, validations, notifications, and side effects. If those decisions are added without structure, the flow becomes difficult to read and even more difficult to change safely. Routing logic gets embedded in transformations, transport details bleed into business rules, and the application starts to feel like a long script rather than a stable service. A better design keeps those concerns visible and separated enough that each part still makes sense under change.

<!-- p. 72 -->
Mule gives several strong tools for this work. Choice routers support conditional branching. Flow references support orchestration across internal units. Scatter-Gather allows multiple calls to proceed in parallel and return as one combined result. Batch jobs support long-running and high-volume processing. Schedulers provide time-based activation. Each of these can improve the design when used intentionally. Each can also create confusion if used without a clear model of what the application is trying to achieve. This is why composition patterns matter as much as individual processors. A pattern helps explain why the pieces are arranged in a certain way.

A useful way to think about flow composition is to ask where decisions belong, where concurrency is helpful, where long-running work should be isolated, and where boundaries should separate transport handling from reusable logic. These questions help prevent accidental architecture. Instead of writing one large flow and hoping it remains manageable, you begin by deciding how the application should be shaped. The transport entry point handles the inbound protocol. Routing determines which business path is relevant. Orchestration coordinates the required internal or external actions. Transformation shapes the inputs and outputs at the right boundaries. Batch or scheduled logic handles work that does not belong in a synchronous request path. That kind of structure is what makes Mule applications sustainable.

This section explains how content-based routing and choice logic guide business flow, how Scatter-Gather and related patterns support parallel work and result aggregation, how batch jobs and scheduling support long-running processing, and how to keep transport, logic, and transformation responsibilities distinct. The goal is not just to show syntax. It is to make application composition feel deliberate, so that even larger integrations remain understandable and easier to support.

## 7.1: Content-based Routing, Choice Logic, and Flow Orchestration

Many integrations must make decisions before they can proceed. The next action may depend on an order type, an account status, a region code, a file name pattern, a request method, or a value computed earlier in the flow. This kind of decision-making is often called content-based routing because the content or context of the current event determines where the event should go next. In Mule, this is usually expressed through a Choice router or through other explicit branching logic that makes the routing decision part of the flow design.

Content-based routing is valuable because not all requests should take the same path. Even when two interactions share an entry point, they may require different connectors, different validations, or different service layers. A routing pattern lets the application acknowledge that variation clearly. Instead of hiding differences in complicated expressions or overloading one subflow with many unrelated responsibilities, the application can branch into focused internal paths that reflect the real business decisions being made.

The most common routing tool for this is the Choice router. A Choice router evaluates expressions in sequence and sends the event down the first matching path. If no explicit condition matches, an otherwise branch can act as a default. This is straightforward in structure, but the quality of the routing depends on the quality of the conditions. Conditions should be meaningful, readable, and as close as possible to the decision that actually matters. If the logic is fragile, too deeply nested, or based on values that are not clearly established in the flow, the route becomes hard to trust.

The following example shows a straightforward routing pattern based on an order channel value in the inbound payload. The flow uses a Choice router to direct the event to one of two internal subflows.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="routeOrderFlow">
        <http:listener config-ref="listenerConfig" path="/orders"/>
        <choice>
            <when expression="#[payload.channel == 'online']">
                <flow-ref name="processOnlineOrder"/>
            </when>
            <when expression="#[payload.channel == 'store']">
                <flow-ref name="processStoreOrder"/>
            </when>
            <otherwise>
                <raise-error type="APP:UNSUPPORTED_CHANNEL" description="Unsupported order channel"/>
            </otherwise>
        </choice>
    </flow>

    <sub-flow name="processOnlineOrder">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  route: "online",
  status: "accepted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="processStoreOrder">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  route: "store",
  status: "accepted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```
<!-- p. 73: el bloque anterior empieza en la p. 72 y sigue en esta página desde "http://www.mulesoft.org/schema/mule/http http://..." -->

This is the simplest correct version because it makes the routing decision visible and keeps the route-specific work separated. Each subflow has a clear purpose, and the default failure path is explicit rather than silent.

A more robust version becomes useful when routing logic should be based on normalized state instead of raw payload values and when the main flow should preserve clearer boundaries between request handling, decision logic, and downstream orchestration.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="routeOrderFlow">
        <http:listener config-ref="listenerConfig" path="/orders"/>
        <set-variable variableName="orderChannel" value="#[lower(trim(payload.channel default ''))]"/>
        <set-variable variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <flow-ref name="validateOrderRequest"/>
        <choice>
            <when expression="#[vars.orderChannel == 'online']">
                <flow-ref name="orchestrateOnlineOrder"/>
            </when>
            <when expression="#[vars.orderChannel == 'store']">
                <flow-ref name="orchestrateStoreOrder"/>
            </when>
            <otherwise>
                <raise-error type="APP:UNSUPPORTED_CHANNEL" description="Unsupported order channel"/>
            </otherwise>
        </choice>
    </flow>

    <sub-flow name="validateOrderRequest">
        <choice>
            <when expression="#[isEmpty(vars.orderChannel)]">
                <raise-error type="APP:INVALID_INPUT" description="Order channel is required"/>
            </when>
        </choice>
    </sub-flow>

    <sub-flow name="orchestrateOnlineOrder">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  route: "online",
  status: "accepted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="orchestrateStoreOrder">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  route: "store",
  status: "accepted"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```
<!-- p. 74: el bloque anterior empieza en la p. 73 y sigue en esta página desde "</when>" (después de orchestrateOnlineOrder) -->

The difference is practical and important. Routing is now based on a normalized variable rather than on raw input. Validation is isolated. The route-specific subflows are named around orchestration rather than merely processing, which makes them easier to extend into more realistic business paths.

Choice logic works best when it reflects a meaningful branch in the business or integration model. If the application chooses between fulfillment strategies, notification paths, regional services, or validation policies, those are real branches that should be visible. If the Choice router is only compensating for inconsistent upstream transformation or unclear data handling, then the design problem often lies earlier in the flow. In other words, routing should be used to express genuine decision points, not to patch over avoidable structural confusion.

Flow orchestration is closely related. Once a branch has been chosen, the application often needs to coordinate several internal steps in a clear order. It may validate the request, enrich the data, call one or more downstream systems, record an audit event, and build the response. Orchestration is the practice of arranging these steps so that each one has a clear responsibility and the main path still reads as a coherent story. In Mule, this is often achieved by combining flow references, subflows, variables, and clear transformations rather than trying to express the entire business process in one long line of processors.

A strong orchestration design usually follows the shape of the business decision. For example, once a request is routed to an online order path, that path may need customer lookup, inventory reservation, and payment handling. Those steps belong together because they express the internal logic of that route. It is usually clearer to keep them in a focused orchestration flow than to repeat them across unrelated entry flows. That separation also improves testability because the
<!-- p. 75 -->
route logic can be invoked and reasoned about independently of the transport entry point.

Routing decisions should also be based on stable, clearly owned values. If a Choice expression depends on a field that is transformed several times in the same flow, it becomes much harder to reason about whether the route condition is evaluating the intended value. One of the best habits is to capture key routing state into variables before the route occurs. That way, later changes to the payload do not accidentally alter the decision boundary. This small habit prevents a surprising number of subtle defects.

Another important consideration is what happens when routing rules expand. A flow that starts with two branches may later grow to five or more. If that growth is likely, clarity becomes even more important. Conditions should remain readable. Shared preparation work should happen before the Choice rather than being repeated in every branch. Route-specific work should be delegated to focused units instead of making each branch a long inlined sequence. These choices are what keep routing logic maintainable.

There is also a limit to how much branching should live in one flow. If the routing structure becomes very large, that is often a sign that the application is trying to represent too many responsibilities in one place. At that point, it may be better to introduce a more explicit orchestration layer or separate bounded business paths into their own internal modules. The presence of routing logic is not a problem. The problem begins when the routing structure becomes the application instead of being the way the application chooses the next focused task.

Good content-based routing therefore has three clear qualities. The decision criteria are readable and meaningful. The event state used for routing is stable and deliberate. The route destinations represent focused orchestration paths rather than generic processor dumps. When those qualities are in place, Choice logic stops feeling like control-flow clutter and starts feeling like a clear statement of business intent.

## 7.2: Scatter-Gather, Parallel Processing, and Aggregation Patterns

Some integration problems are not about choosing one path. They are about coordinating several paths and then combining the results into one useful outcome. A customer profile response may need data from a core customer system, a preferences service, and an order history service. A product detail response may need base catalog data, pricing information, and stock availability. A reporting flow may need several independent queries whose results must be collected before the final output can be prepared. In these situations, running everything in strict sequence may be slower than necessary and less expressive than the real problem structure. This is where Scatter-Gather and related aggregation patterns become valuable.

Scatter-Gather allows a Mule flow to send the same current event into multiple routes in parallel and then wait for the routes to complete before returning a combined result. The processor makes sense when the routes are independent enough to run concurrently and when the final output needs information from more than one of them. It is especially useful in API composition patterns where the goal is to assemble one response from several services or internal logic paths.

The appeal of parallel processing is obvious. If three independent downstream calls each take a few hundred milliseconds, waiting for them one after another adds unnecessary latency. Running them concurrently can reduce response time significantly. But the design value is broader than speed. Scatter-Gather also makes the application structure clearer when the problem is naturally parallel. Instead of forcing the reader to infer that three service calls are independent, the flow can say it directly through its composition pattern.

The following example shows a straightforward Scatter-Gather flow that retrieves customer profile data and order history in parallel and then combines the results into one response.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="customerOverviewFlow">
        <http:listener config-ref="listenerConfig" path="/customers/{id}/overview"/>
        <set-variable variableName="customerId" value="#[attributes.uriParams.id]"/>
        <scatter-gather>
            <route>
                <flow-ref name="fetchCustomerProfile"/>
            </route>
            <route>
                <flow-ref name="fetchOrderHistory"/>
            </route>
        </scatter-gather>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  profile: payload[0].payload,
  orders: payload[1].payload
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <sub-flow name="fetchCustomerProfile">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: vars.customerId,
  name: "Jordan Blake"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="fetchOrderHistory">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
[
  {
    orderId: "O1001",
    total: 120.50
  }
] ]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```
<!-- p. 76: el bloque anterior empieza en la p. 75 y sigue en esta página desde "xmlns="http://www.mulesoft.org/schema/mule/core"" -->

This is the simplest correct version because it shows the core pattern clearly. The event is scattered into two independent routes. Each route produces its own payload. The combined result is then aggregated into a final response.

A more robust version becomes useful when route labels should be clearer, shared identifiers need to survive aggregation, and the final assembly should not depend on route position alone.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="customerOverviewFlow">
        <http:listener config-ref="listenerConfig" path="/customers/{id}/overview"/>
        <set-variable variableName="customerId" value="#[attributes.uriParams.id]"/>
        <set-variable variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <scatter-gather>
            <route>
                <flow-ref name="fetchCustomerProfile"/>
            </route>
            <route>
                <flow-ref name="fetchOrderHistory"/>
            </route>
            <route>
                <flow-ref name="fetchCustomerPreferences"/>
            </route>
        </scatter-gather>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
var profile = payload[0].payload
var orders = payload[1].payload
var preferences = payload[2].payload
---
{
  requestId: vars.requestId,
  customerId: vars.customerId,
  profile: profile,
  orders: orders,
  preferences: preferences
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <sub-flow name="fetchCustomerProfile">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: vars.customerId,
  name: "Jordan Blake"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="fetchOrderHistory">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
[
  {
    orderId: "O1001",
    total: 120.50
  }
]]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="fetchCustomerPreferences">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  language: "en",
  marketingOptIn: true
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```
<!-- p. 77: el bloque anterior empieza en la p. 76 y sigue en esta página desde "<http:listener-config name="listenerConfig">" -->

The improvement here is mostly architectural. The event carries stable identifiers into the parallel work. The final transformation reassembles the route results into a clear local contract. The application tells a more complete story without becoming much harder to follow.

<!-- p. 78 -->
Scatter-Gather should be used only when the routes are truly independent enough to justify concurrent execution. If one route depends on the output of another, they do not belong in the same Scatter-Gather block. In that case, the design should reflect the dependency explicitly through sequential orchestration. Parallelism is powerful, but it should never hide real execution dependencies. When a flow uses Scatter-Gather carelessly, the resulting code becomes misleading because it suggests that routes are independent when they are not.

Aggregation is the other half of the pattern. Parallel routes are only useful if their outputs are brought back together meaningfully. This often requires a transformation that names the route results clearly and shapes them into a consumer-friendly structure. The aggregation step should not merely expose the raw route outputs unless that is truly the desired contract. Instead, it should assemble a local view that makes the parallel work invisible to the caller. The caller should receive one coherent response, not an accidental reflection of how the internal route array happens to be organized.

This is especially important because route outputs may vary in type and size. One route may return one object, another an array, another a summary structure. The aggregation step is where these differences become manageable. It can wrap, normalize, rename, or derive combined values in a way that reflects the final API or process contract.

Parallel processing also brings error-handling considerations. If one route fails while others succeed, the overall result depends on the design. In some cases, a failure in one route should fail the entire composed response because the missing information makes the response incomplete or misleading. In other cases, partial success may be acceptable if the application can signal what is missing in a controlled way. The important point is that this choice should be intentional. Scatter-Gather is not just about concurrency. It is also about deciding what a composed result means when the routes do not all behave equally well.

This is why route-level design matters. Each route should ideally produce a clear and bounded outcome. If route behavior is unpredictable or too broad, the final aggregation becomes harder to trust. Focused routes make composed responses easier to reason about because each contribution has a clear purpose. A customer profile route should produce profile data. An order history route should produce order data. A preferences route should produce preference data. The aggregation step then becomes an assembly task rather than a rescue operation.

Parallel processing patterns also help at a more general design level. They encourage the application to acknowledge which pieces of work are independent. That often leads to cleaner internal services or subflows because route-specific responsibilities become visible. Even when the performance gain is modest, the structural clarity can still be valuable. The code shows that the application is composing several pieces of information rather than stepping through one monolithic pipeline.

At the same time, overusing parallel patterns can make flows noisy. Not every pair of connector calls belongs in Scatter-Gather. If the route count is very small and the calls are trivial, sequential logic may be perfectly fine. If the route outputs require complex reconciliation, sometimes a different orchestration model is clearer. The best use of Scatter-Gather is where the problem itself is naturally parallel and the final contract benefits from an explicit aggregation step.

Good aggregation design therefore depends on three things. The parallel branches must be meaningfully independent. Their outputs must be shaped clearly. The final combined result must express the business contract rather than the internal mechanics of route execution. When those conditions are met, Scatter-Gather becomes one of the most useful composition tools in Mule because it expresses both structure and intent.

## 7.3: Batch Jobs, Scheduling, and Long-running Processing

Not every integration belongs inside a short request-response cycle. Some work processes many records, runs on a schedule, or takes long enough that treating it like an API call would produce weak design. File imports, nightly reconciliations, data synchronization, incremental exports, archive generation, and
<!-- p. 79 -->
large-volume update jobs all fall into this category. These workloads require a different composition model because the application needs to activate them differently, manage throughput differently, and often track results differently. Mule supports this through schedulers, batch jobs, and flow patterns designed for work that unfolds over time rather than completing immediately in one synchronous conversation.

A scheduler is the entry point for time-based activation. It allows a flow to begin on a defined interval or timing pattern without waiting for an external request. This is useful when the application needs to poll, process periodic workloads, or trigger background tasks according to operational schedules. Scheduling is often the first step in long-running processing because it defines when the workload should begin. The scheduler itself is usually simple. The design challenge lies in what happens after activation. A scheduled job still needs clear logic, good boundary management, and careful treatment of data volume and runtime cost.

The following example shows a straightforward scheduled flow that runs at an interval and produces a simple payload.

XML

```xml
<mule xmlns:scheduler="http://www.mulesoft.org/schema/mule/scheduler"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/scheduler http://www.mulesoft.org/schema/mule/scheduler/current/mule-scheduler.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <flow name="scheduledHealthCheckFlow">
        <scheduler:scheduler>
            <scheduler:fixed-frequency frequency="60000"/>
        </scheduler:scheduler>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  job: "health-check",
  status: "started"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

This is the simplest correct version because it shows the scheduler's role clearly. The flow is initiated by time, not by a transport request. That difference is important because it changes how the rest of the flow should be designed.

A more robust version becomes more realistic when the scheduled job needs explicit variables, downstream orchestration, and a clearer separation between activation and business work.

XML

```xml
<mule xmlns:scheduler="http://www.mulesoft.org/schema/mule/scheduler"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/scheduler http://www.mulesoft.org/schema/mule/scheduler/current/mule-scheduler.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <flow name="scheduledInventorySyncFlow">
        <scheduler:scheduler>
            <scheduler:fixed-frequency frequency="300000"/>
        </scheduler:scheduler>
        <set-variable variableName="jobId" value="#[uuid()]"/>
        <set-variable variableName="startedAt" value="#[now() as String]"/>
        <flow-ref name="runInventorySync"/>
    </flow>

    <sub-flow name="runInventorySync">
        <logger level="INFO" message='#[ "Starting inventory sync job " ++ vars.jobId ++ " at " ++ vars.startedAt ]'/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  jobId: vars.jobId,
  state: "running"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```
<!-- p. 80: el bloque anterior empieza en la p. 79 y sigue en esta página desde "<ee:message>" (dentro de runInventorySync) -->

This version is better structured because the scheduler activates one focused orchestration path rather than carrying all of the business work directly. That becomes much more important as scheduled logic grows.

Batch jobs address a different but related need. They are designed for processing large sets of records through staged work rather than attempting to handle everything in one payload transformation or connector interaction. A batch job usually breaks work into records, processes them in steps, and allows more controlled handling of large data volumes. This is valuable for imports, exports, cleanups, synchronizations, or any other workload where the number of records is significant enough that one conventional flow would become inefficient or unwieldy.

The value of a batch job is not only throughput. It is also structural. Large-volume processing usually has a different lifecycle from request-driven integration. It may need to read a source collection, transform records, write results, record failures, and summarize outcomes. That work benefits from a batch-oriented model because the job can be expressed in stages instead of as one long in-memory sequence. The result is often easier to reason about operationally.

The following example shows a simplified batch pattern where a flow loads records and passes them into a batch job.

XML

```xml
<mule xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns:batch="http://www.mulesoft.org/schema/mule/batch"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd
        http://www.mulesoft.org/schema/mule/batch http://www.mulesoft.org/schema/mule/batch/current/mule-batch.xsd">

    <flow name="startCustomerImportFlow">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
[
  { id: "C1001", name: "Jordan Blake" },
  { id: "C1002", name: "Maya Chen" }
] ]]></ee:set-payload>
            </ee:message>
        </ee:transform>
        <batch:job jobName="customerImportJob">
            <batch:process-records>
                <batch:step name="normalizeCustomerRecord">
                    <ee:transform>
                        <ee:message>
                            <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: payload.id,
  name: upper(payload.name)
}]]></ee:set-payload>
                        </ee:message>
                    </ee:transform>
                </batch:step>
            </batch:process-records>
        </batch:job>
    </flow>
</mule>
```

This is enough to show the main idea. Records are treated individually within the batch step, and the work is framed as batch processing rather than as one large transformation block.

<!-- p. 81 -->
A more robust version becomes useful when the batch job should have separate load, process, and completion concerns, and when the record-level transformation should be only one part of the overall job structure.

XML

```xml
<mule xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns:batch="http://www.mulesoft.org/schema/mule/batch"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd
        http://www.mulesoft.org/schema/mule/batch http://www.mulesoft.org/schema/mule/batch/current/mule-batch.xsd">

    <flow name="startCustomerImportFlow">
        <set-variable variableName="jobId" value="#[uuid()]"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
[
  { id: "C1001", name: "Jordan Blake", email: "jordan.blake@example.com" },
  { id: "C1002", name: "Maya Chen", email: "maya.chen@example.com" }
]]]></ee:set-payload>
            </ee:message>
        </ee:transform>
        <batch:job jobName="customerImportJob">
            <batch:process-records>
                <batch:step name="normalizeCustomerRecord">
                    <ee:transform>
                        <ee:message>
                            <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: payload.id,
  name: upper(payload.name),
  email: lower(payload.email)
}]]></ee:set-payload>
                        </ee:message>
                    </ee:transform>
                </batch:step>
                <batch:step name="logProcessedRecord">
                    <logger level="INFO" message='#[ "Processed customer record " ++ payload.id ++ " for job " ++ vars.jobId ]'/>
                </batch:step>
            </batch:process-records>
            <batch:on-complete>
                <logger level="INFO" message='#[ "Customer import completed for job " ++ vars.jobId ]'/>
            </batch:on-complete>
        </batch:job>
    </flow>
</mule>
```

The stronger design makes it easier to see what the batch job is doing. One step normalizes records. Another records operational progress. The completion phase signals the overall result. This is much closer to how long-running processing is managed in practice.

Batch processing should be chosen when the workload naturally consists of many records that benefit from staged processing. It should not be introduced simply because a flow has become large. Some integrations are better handled through ordinary flows with streaming and careful connector usage. Batch becomes valuable when the processing lifecycle itself is record-oriented and when operational control over that lifecycle matters.

Long-running processing also changes how success is reported. In a request-response API, success is usually communicated immediately in the response. In batch or scheduled work, success may be partial, delayed, or summarized later. This means logging, job identifiers, completion handling, and sometimes state recording become more important. The application should tell the truth about what has happened so far. A scheduled sync may have started but not finished. A batch import may have processed most records but failed some. These are legitimate states, and long-running designs should express them clearly rather than forcing them into simplistic success-failure language.

Another useful design habit is to keep the trigger mechanism separate from the core logic where possible. A scheduler should
<!-- p. 82 -->
trigger a clear internal orchestration flow. A batch job should focus on record processing and not absorb unrelated transport logic. This makes it easier to test and reuse the core logic and prevents timing concerns from becoming tangled with business concerns. A scheduled flow that also acts as the only place where transformation, external calls, and completion reporting are all mixed together is harder to maintain than one where activation and business work are distinct.

Scheduling and batch also raise operational concerns about concurrency, resource use, and overlap. If a job runs on a schedule, the design should account for what happens if one run overlaps the next. If a batch process calls downstream systems, the design should account for rate limits and throughput expectations. These are architectural questions, not just processor settings. A good long-running design reflects realistic operating conditions instead of assuming every run will complete in ideal circumstances.

The main value of these patterns is that they allow the application shape to match the workload shape. Short request-driven logic stays short. High-volume record processing gets a batch-oriented structure. Time-based work gets a scheduler-driven entry point. Long-running orchestration gets an operationally honest lifecycle. This kind of fit between workload and composition pattern is one of the strongest signs that an integration application is being designed deliberately.

## 7.4: Designing Clean Boundaries Between Transport, Logic, and Transformation

One of the most common reasons Mule applications become hard to maintain is that transport handling, business logic, and data transformation get mixed together in the same flow until the responsibilities are no longer clear. A listener receives a request, then immediately applies several transformations, makes routing decisions based on half-normalized input, performs downstream calls with transport-specific assumptions, and finally shapes a response all inside one uninterrupted sequence. The application may still work, but it becomes much harder to reuse, debug, or change safely because each line depends on several kinds of knowledge at once.

Clean boundaries solve this problem by assigning clearer roles to different parts of the flow. Transport handling is about receiving or sending data over a protocol or system boundary. Business logic is about deciding what the application should do with the request or event. Transformation is about shaping data at the points where structure or contract changes. These concerns are related, but they are not the same. When they remain distinct enough to see, the application becomes easier to reason about and easier to evolve.

Transport boundaries should be close to the entry and exit points of the application. An HTTP listener should receive the request, capture the transport-specific details that matter, and hand the event into the application logic in a clean way. An outbound HTTP request or file write should occur in the part of the flow responsible for that boundary, not be hidden inside a large transformation or buried in the middle of unrelated orchestration. When transport concerns stay visible, it becomes easier to understand where the application is crossing into or out of the runtime.

Business logic should sit in the part of the flow where decisions and orchestration happen. This is where validation beyond simple contract checks may occur, where routing paths are chosen, where downstream operations are coordinated, and where the overall application behavior is defined. Business logic should not need to care about every transport detail. It should work with a stable local model as much as possible. That is why transforming inbound transport data into a local application shape early can be so useful. It reduces the chance that business logic becomes tightly bound to the quirks of an external interface.

Transformation belongs at the boundaries where data shape changes matter. This often means normalizing inbound requests into local structures, preparing outbound request payloads for connectors, and shaping final responses into consumer-facing contracts. Good transformation design makes these transitions explicit. It tells the reader when the application is adapting one
<!-- p. 83 -->
contract to another. Poor transformation design hides these transitions inside overloaded processors or spreads them across several unrelated steps, which makes the data story harder to follow.

The following example shows a flow where transport handling, basic normalization, logic delegation, and response shaping are kept reasonably distinct.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="createOrderFlow">
        <http:listener config-ref="listenerConfig" path="/orders"/>
        <set-variable variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  customerId: payload.customerId,
  items: payload.items default []
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
        <flow-ref name="processOrderCreation"/>
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  result: payload
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>

    <sub-flow name="processOrderCreation">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  orderId: "O1001",
  status: "created"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>
</mule>
```

This is the simplest correct version because the entry flow captures the transport boundary, performs a first normalization into a local shape, delegates the business step, and then shapes the final response. Each major concern is visible.

A more robust version becomes useful when the boundaries are expressed more deliberately through named subflows and clearer local models.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <flow name="createOrderFlow">
        <http:listener config-ref="listenerConfig" path="/orders"/>
        <set-variable variableName="requestId" value="#[(attributes.headers.'x-correlation-id' default uuid())]"/>
        <flow-ref name="mapInboundOrderRequest"/>
        <flow-ref name="orchestrateOrderCreation"/>
        <flow-ref name="mapOrderCreationResponse"/>
    </flow>

    <sub-flow name="mapInboundOrderRequest">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  customerId: payload.customerId,
  items: (payload.items default []) map (item) -> {
    sku: item.sku,
    quantity: item.quantity
  }
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="orchestrateOrderCreation">
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  orderId: "O1001",
  status: "created",
  acceptedItems: sizeOf(payload.items)
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </sub-flow>

    <sub-flow name="mapOrderCreationResponse">
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
    </sub-flow>
</mule>
```
<!-- p. 84: el bloque anterior empieza en la p. 83 y sigue en esta página desde "<http:listener-connection host=..." -->

This version is more maintainable because the names communicate purpose. One subflow maps inbound transport content into a local model. One subflow performs the core business orchestration. One subflow shapes the consumer-facing response. The entry flow reads almost like a description of the application's responsibilities.

Clean boundaries also improve reuse. If the main business orchestration is separated from the transport-specific entry logic, that orchestration can be reused in other contexts more easily. A scheduled import, a VM-triggered process, or another API could potentially invoke the same core logic with an appropriate local input model. If the business logic is tightly bound to HTTP-specific attributes and request shapes, reuse becomes much harder. Separation therefore benefits not only readability but also architectural flexibility.

Debugging becomes easier for the same reason. When something goes wrong, it is much more useful to know whether the issue occurred while reading transport input, while deciding what the application should do, or while shaping the response. If those layers are blended together, failures become harder to classify. A null pointer-like condition in a transformation may actually be rooted in transport assumptions. A routing error may actually be caused by poor normalization. Clear boundaries help keep these distinctions visible.

There is also a strong benefit for testing. A transport-focused test can verify that the listener and request shape are handled correctly. A logic-focused test can verify orchestration behavior using a normalized internal model. A response-mapping test can
<!-- p. 85 -->
verify that the final contract is shaped correctly from a known internal outcome. When everything is mixed into one large flow, test cases become broader and more repetitive because they must account for many concerns at once.

Another important point is that clean boundaries do not mean excessive layering. The goal is not to split every processor into its own subflow. The goal is to separate responsibilities where the distinction provides real clarity. If an application is very small, a compact flow may still be perfectly readable. Boundaries become more important as the logic grows, as reuse becomes likely, or as several external systems and transformations start interacting. Good judgment is what decides when the added structure improves clarity rather than merely increasing artifact count.

Transformation boundaries deserve particular attention because they are often where contracts change. An inbound request belongs to the consumer-facing transport contract. The internal business logic may want a cleaner local shape. An outbound connector may require a provider-specific structure. The final response may need another shape again. If those boundaries are not made explicit, the application begins to pass partially adapted payloads from one layer to another, and the meaning of the current payload becomes harder to track. A clear transformation boundary tells you that the application is changing from one contract language to another.

Transport boundaries also include metadata. Headers, URI parameters, status codes, and protocol-level behaviors should be handled where they naturally belong. Business logic should not need to know about raw request paths unless that detail is actually part of the business problem. Likewise, response shaping should not be forced to reconstruct transport details that were never captured deliberately. Clear capture and release of transport metadata help keep the internal logic cleaner.

Ultimately, designing clean boundaries is about making the application tell the truth about what it is doing. The listener receives transport input. The first mapping creates the local input model. The orchestration decides and coordinates. Connector-specific mappings adapt to external systems. The final mapping creates the output contract. When that truth is visible, the flow is easier to read, easier to change, easier to test, and easier to trust. That is what good composition should achieve.
