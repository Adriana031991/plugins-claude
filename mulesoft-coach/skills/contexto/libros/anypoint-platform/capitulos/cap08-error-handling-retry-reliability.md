---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 8
titulo: "Error Handling, Retry Strategy, and Reliability Patterns"
paginas_pdf: "85-99"
temas: [error-handling, connectors, routing]
transcrito: 2026-11-13
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna: las parejas de schemaLocation ("http://" + "www..."), los atributos partidos (type="..." + logException="...", value="..." de set-variable, key="..." de os:contains/os:store) y el db:input-parameters partido. No corrijo ni completo nada.
- Cuando un bloque de código cruza de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 85 y termina en el panel superior de la p. 99; ahí empieza el capítulo 9.
-->

# Chapter 8: Error Handling, Retry Strategy, and Reliability Patterns

<!-- p. 85 -->
Reliable integration is not built by assuming that connectors, networks, databases, queues, and external services will behave perfectly. It is built by accepting that failures are normal and then designing applications that respond to those failures in controlled, predictable ways. In Mule applications, this means error handling is not a final polishing step. It is part of the architecture from the beginning. A flow that looks clean under ideal conditions may still be unsafe if it cannot communicate failure clearly, retry responsibly, preserve data integrity, or support recovery without making the situation worse.

This matters because enterprise integration sits between systems that fail in different ways and for different reasons. A downstream API may return a temporary timeout. A database may reject a constraint-violating write. A message may be delivered more than once. A file may be malformed. A transformation may fail because the incoming payload no longer matches the expected contract. Each of these failures calls for a different response. Some should stop processing immediately and surface an error. Some should be retried because the condition is likely temporary. Some should be redirected to a recovery path. Some should be recorded and skipped so the broader workload can continue safely. Reliability comes from making those distinctions explicitly rather than treating every exception as a generic failure.

Mule supports this work through structured error types, scoped error handlers, retry patterns, transaction support, and runtime coordination tools that help build safer recovery paths. These capabilities are useful, but they only become powerful when they are used with realistic judgment. A retry can help recover from transient failure, but it can also duplicate side effects if the operation is not safe to repeat. A transaction can protect consistency, but it can also slow the system or create avoidable
<!-- p. 86 -->
coupling if used too broadly. A dead-letter path can preserve failed messages for later review, but only if the application routes failures there intentionally and with enough context to support diagnosis and replay.

Another reason this topic deserves close attention is that application reliability is often lost at the boundaries. A flow may handle business errors well in theory yet still fail operationally because it retries the wrong thing, masks the wrong exception, or cannot be replayed safely after partial completion. Reliable integration design therefore asks a deeper question than whether the application can catch an error. It asks whether the application can fail in a way that is understandable, repeatable, and recoverable.

This section explains how Mule error types, propagation rules, and handling scopes define the shape of failure inside a flow. It then examines retry design through Until Successful, redelivery awareness, and idempotency. After that, it looks at transactions, including local resource handling and XA boundaries, with a practical focus on where transactions help and where they introduce unnecessary weight. Finally, it turns to recovery patterns such as dead-letter handling and replay-safe design so that failed work can be observed, isolated, and reprocessed without creating additional damage. The goal is to make failure handling feel like an intentional part of application design rather than a set of scattered defensive reactions.

## 8.1: Mule Error Types, Error Propagation, and Error Handling Scopes

Mule treats errors as structured runtime events rather than as vague exceptional conditions. This is a very important design choice because it gives flows a consistent way to identify, route, and react to failure. Instead of writing application logic as though everything succeeds until an unstructured crash appears, Mule applications can define how different kinds of errors should behave. That structure is the foundation for reliable error handling because it allows the application to distinguish between a validation problem, a connectivity failure, a timeout, a missing resource, or a custom business condition raised deliberately inside the flow.

An error in Mule includes information such as a type, description, cause, and context about where the failure occurred. The type is especially useful because it turns failure into something that can be matched and handled intentionally. Connector operations can raise specific error categories. Flows can also raise custom errors to represent business conditions that are meaningful within the application. This means that the application can react differently to a timeout than to invalid input, and differently again to a business rule violation such as an unsupported order type or a missing required identifier.

The first point to understand is that not all failures should be treated as technical failures. Some errors represent conditions that are part of the business contract. If an API receives an invalid customer identifier or a required field is missing, that is not an infrastructure incident. It is a business-level invalid request. That difference matters because the response strategy should reflect it. Business errors often require controlled, consumer-friendly responses. Technical failures may require propagation, retry, logging, or recovery paths. A strong Mule application makes that distinction visible.

Mule error handlers are the main mechanism for reacting to these structured errors. An error handler can be placed at the flow level or inside a try scope, depending on how wide the handling responsibility should be. Inside an error handler, the application can define branches such as `on-error-propagate` and `on-error-continue`. These names are not mere syntax. They define the meaning of the error response in the context of the current processing path.

Propagation means the error remains significant to the surrounding context. The current scope handles the error in some way, perhaps by logging it or transforming the payload, but the failure still interrupts normal success processing. For an HTTP API, this often means the application will send an error response rather than continue as though the request succeeded. Continue means the error is handled and normal flow execution can proceed from that point with an alternate state or payload.
<!-- p. 87 -->
This is useful when a particular failure should not destroy the wider operation. The difference between the two is one of the most important reliability decisions in a Mule flow.

The following example shows a straightforward flow-level error handler that responds to a custom business error with a clear JSON response while allowing other failures to propagate in a more general way.

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

    <flow name="customerLookupFlow">
        <http:listener config-ref="listenerConfig" path="/customers/{id}"/>
        <error-handler>
            <on-error-propagate type="APP:INVALID_CUSTOMER_ID" logException="false">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  code: "INVALID_CUSTOMER_ID",
  message: error.description
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate logException="true">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  code: "UNEXPECTED_ERROR",
  message: "Request processing failed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </on-error-propagate>
        </error-handler>

        <choice>
            <when expression="#[attributes.uriParams.id == '']">
                <raise-error type="APP:INVALID_CUSTOMER_ID" description="Customer identifier is required"/>
            </when>
        </choice>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: attributes.uriParams.id,
  status: "ok"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

This is the simplest correct version because it shows two important ideas clearly. A custom business error is raised intentionally, and the error handler distinguishes it from any other unexpected failure. The flow does not let all errors collapse into one generic response.

A more robust version becomes useful when different scopes of responsibility should handle different failures and when not every error should be treated at the outermost flow level. A try scope with a local error handler can isolate one risky operation and prevent it from contaminating the broader flow unnecessarily.

<!-- p. 88 -->
XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <db:config name="dbConfig">
        <db:my-sql-connection host="localhost" port="3306" user="appuser" password="appsecret" database="orders"/>
    </db:config>

    <flow name="orderStatusFlow">
        <http:listener config-ref="listenerConfig" path="/orders/{id}"/>
        <error-handler>
            <on-error-propagate type="APP:INVALID_ORDER_ID" logException="false">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  code: "INVALID_ORDER_ID",
  message: error.description
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate logException="true">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  code: "ORDER_LOOKUP_FAILED",
  message: "Unable to retrieve order status"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </on-error-propagate>
        </error-handler>

        <choice>
            <when expression="#[isEmpty(attributes.uriParams.id)]">
                <raise-error type="APP:INVALID_ORDER_ID" description="Order identifier is required"/>
            </when>
        </choice>

        <try>
            <db:select config-ref="dbConfig">
                <db:sql><![CDATA[
                    SELECT id, status
                    FROM orders
                    WHERE id = :id
                ]]></db:sql>
                <db:input-parameters><![CDATA[#[{ id: attributes.uriParams.id }]]]></db:input-parameters>
            </db:select>
            <error-handler>
                <on-error-continue type="DB:CONNECTIVITY" logException="true">
                    <set-payload value='#[{ id: attributes.uriParams.id, status: "unavailable" }]'/>
                </on-error-continue>
            </error-handler>
        </try>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
var row = payload[0] default payload
---
{
  id: row.id,
  status: row.status
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```
<!-- p. 89: el bloque anterior empieza en la p. 88 y termina en esta página con "}]]></ee:set-payload>" -->

The improvement here is that the database connectivity problem is scoped locally. If the database call fails with a connectivity error, the try scope provides a fallback status and allows the wider flow to continue. Other errors still propagate to the flow-level handler. This is an example of scoped reliability. The application decides that a connectivity issue in this specific location can be converted into a controlled degraded response rather than collapsing the whole interaction.

Scoped error handling is powerful because it prevents one error strategy from being forced onto every part of the application. A flow-level handler is useful for defining the contract of the flow as a whole. A try-scope handler is useful when one step or section needs local recovery or alternate logic. Good design usually uses both at the right levels. The outer handler defines the broader outcome. The inner handler manages local risk.

One common mistake is to catch errors too broadly and continue without restoring the application to a meaningful state. This creates the illusion of resilience while actually hiding failure. If a connector call fails and the application uses `on-error-continue` without producing a sensible substitute or recording the problem properly, later processors may run against incomplete or misleading data. Reliability is not the same as suppressing errors. Reliability means deciding when a failure can safely be absorbed and when it must remain visible.

Another mistake is to overuse generic error handling and lose the distinction between known business conditions and unknown system failures. If every error becomes one generic failure response, consumers lose useful information, logs become less actionable, and operational recovery becomes harder because the application no longer tells you which kind of problem occurred. Structured error types are there to prevent exactly this kind of flattening.

Custom errors are especially useful for making business conditions explicit. A duplicate submission, an unsupported channel, a missing approval code, or a failed business validation can all be represented as application-defined error types. This allows the flow to raise them intentionally and handle them separately from connector or platform failures. That makes the application clearer because failure states become part of the business design rather than leftovers from exceptions.

Good Mule error handling therefore rests on three connected habits. Use meaningful error types so the application can distinguish failures clearly. Place handlers at scopes that match the responsibility of the logic they protect. Choose propagation or continuation based on the real meaning of the failure, not just on the desire to keep the flow moving. These habits make failure behavior explicit, which is the first step toward real reliability.

## 8.2: Retry Design with Until Successful, Redelivery, and Idempotency

Retries are useful because some failures are temporary. A downstream service may time out briefly. A network path may recover in a moment. A dependent system may be under short-lived stress. In these situations, retrying the operation can turn a transient problem into a successful result without manual intervention. This is one of the reasons retry patterns are common in integration design. At the same time, retries are one of the easiest ways to damage data quality and business correctness when they are used carelessly. A retry does not only repeat a call. It repeats an action, and repeated actions can create repeated side effects.

This is why retry design should always begin with a simple question. Is the action safe to repeat. If the answer is unclear, then the retry strategy is incomplete. A second attempt to fetch customer data is usually safe. A second attempt to create a payment or dispatch a shipment may not be safe unless the target system or the application has an idempotency mechanism. Reliable integration work treats retries as part of business correctness, not only as part of technical recovery.

<!-- p. 90 -->
Until Successful is one of the most visible retry mechanisms in Mule. It wraps one or more processors and retries the enclosed sequence until the enclosed work succeeds or the maximum retry count is exhausted. This sounds convenient, and it can be, but its scope matters enormously. It retries the whole enclosed block, not only the one operation that failed. If that block contains multiple steps, any side effect performed before the failure can happen again on the next attempt. This is why Until Successful should be kept tightly scoped around replay-safe logic whenever possible.

The following example shows a straightforward use of Until Successful around one outbound HTTP request.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd">

    <http:request-config name="inventoryApiConfig">
        <http:request-connection host="inventory-api.internal" port="8080" protocol="HTTP"/>
    </http:request-config>

    <flow name="inventoryCheckFlow">
        <until-successful maxRetries="3" millisBetweenRetries="2000">
            <http:request config-ref="inventoryApiConfig" method="GET" path="/inventory/SKU-1001"/>
        </until-successful>
    </flow>
</mule>
```

This is the simplest correct version because the retry scope is narrow. One external read-style operation is retried. The chance of creating duplicated business side effects is low because the action is retrieval rather than state change.

A more robust version becomes useful when the flow must preserve a stable identifier, shape an outbound request deliberately, and keep the retried section restricted to the action that is actually safe to repeat.

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

    <http:request-config name="inventoryApiConfig">
        <http:request-connection host="inventory-api.internal" port="8080" protocol="HTTP"/>
    </http:request-config>

    <flow name="inventoryCheckFlow">
        <set-variable variableName="sku" value="#['SKU-1001']"/>
        <set-variable variableName="requestId" value="#[uuid()]"/>

        <until-successful maxRetries="3" millisBetweenRetries="2000">
            <http:request config-ref="inventoryApiConfig" method="GET" path="/inventory/#[vars.sku]">
                <http:headers><![CDATA[#[{
                    "x-correlation-id": vars.requestId,
                    "accept": "application/json"
                }]]]></http:headers>
            </http:request>
        </until-successful>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  inventory: payload
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```
<!-- p. 91: el bloque anterior empieza en la p. 90 y termina en esta página con "</flow>" y "</mule>" -->

The key difference is that the retried section still contains only the outbound call, while identifiers and response shaping remain outside it. This is safer and clearer because it prevents unrelated work from being replayed.

Redelivery concerns arise most clearly in message-driven systems, where a message may be attempted more than once because the original processing failed or the acknowledgment did not complete as expected. In these cases, the application must assume duplicates are possible. This is not a rare edge case. It is normal behavior in many reliable messaging environments. If a flow cannot tolerate duplicate processing, it is not yet robust enough for real message-driven work.

Idempotency is the answer to this problem. An idempotent operation can be repeated without changing the outcome beyond the first successful application. This does not mean every repeated action is harmless by default. It means the application or the receiving system has a mechanism that recognizes the repeated attempt and prevents duplicate side effects. Idempotency may rely on a unique business key, an idempotency key from the caller, or a stored processing record that tells the application whether the work has already been completed.

The following example shows a simple idempotency check using Object Store before performing a business action that should not run twice for the same key.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <os:object-store name="requestStore"/>

    <flow name="submitPaymentFlow">
        <http:listener config-ref="listenerConfig" path="/payments"/>
        <set-variable variableName="idempotencyKey" value="#[(attributes.headers.'x-idempotency-key' default uuid())]"/>
        <os:contains objectStore="requestStore" key="#[vars.idempotencyKey]" target="alreadyProcessed"/>
        <choice>
            <when expression="#[vars.alreadyProcessed]">
                <set-payload value='#[{ status: "duplicate" }]'/>
            </when>
            <otherwise>
                <os:store objectStore="requestStore" key="#[vars.idempotencyKey]" value="#['processed']"/>
                <set-payload value='#[{ status: "accepted" }]'/>
            </otherwise>
        </choice>
    </flow>
</mule>
```

This works as a clear first step because the flow checks for prior processing before performing the action. If the same key appears again, the application does not blindly repeat the work.

A more robust version is useful when the stored record should contain more context and when the application should produce a consistent response tied to that idempotency key.

XML

```xml
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:os="http://www.mulesoft.org/schema/mule/os"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
        http://www.mulesoft.org/schema/mule/os http://www.mulesoft.org/schema/mule/os/current/mule-os.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <http:listener-config name="listenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <os:object-store name="requestStore"/>

    <flow name="submitPaymentFlow">
        <http:listener config-ref="listenerConfig" path="/payments"/>
        <set-variable variableName="idempotencyKey" value="#[(attributes.headers.'x-idempotency-key' default uuid())]"/>
        <os:contains objectStore="requestStore" key="#[vars.idempotencyKey]" target="alreadyProcessed"/>

        <choice>
            <when expression="#[vars.alreadyProcessed]">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  idempotencyKey: vars.idempotencyKey,
  status: "duplicate"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </when>
            <otherwise>
                <os:store objectStore="requestStore"
                          key="#[vars.idempotencyKey]"
                          value='#[{ state: "processed", createdAt: now() as String }]'/>

                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  idempotencyKey: vars.idempotencyKey,
  status: "accepted"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </otherwise>
        </choice>
    </flow>
</mule>
```
<!-- p. 92: el bloque anterior empieza en la p. 91 y sigue en esta página desde "http://www.mulesoft.org/schema/mule/http http://..." -->

The stronger design makes repeated handling easier to reason about because the key and state are explicit. This is closer to what reliable business-facing idempotency should look like.

The most important practical lesson in retry design is that retries and idempotency belong together. If an action is safe to repeat, then retry can be a strong recovery tool. If an action is not safe to repeat, then the application needs a design change before retries can be trusted. That change might be an idempotency key, a persisted processing record, or a different orchestration model that separates safe and unsafe steps more clearly.

This is also why retry scope should remain as small as possible. A large retry block is harder to reason about because it often contains mixed work, some safe to repeat and some not. A smaller retry block makes the replay surface easier to understand. The more precisely the retried action is defined, the safer the retry strategy becomes.

Good retry design therefore depends on three connected ideas. Keep the retry scope narrow. Assume redelivery is possible in message-driven designs. Make state-changing operations idempotent before trusting retries around them. These principles turn retries from a risky convenience into a controlled reliability tool.

## 8.3: Transactions, Local Resources, XA Boundaries, and Practical Tradeoffs

Transactions are one of the classic tools for protecting consistency in integration work. They are used when a sequence of operations should succeed or fail as one controlled unit, especially when data integrity matters and partial completion would be problematic. In Mule, transaction support can help
<!-- p. 93 -->
coordinate certain kinds of resource interactions, but it should be approached with care. Transactions are valuable, yet they are often overused or misunderstood. A transaction is not a general reliability shortcut. It is a specific mechanism with real constraints, performance costs, and design implications.

A useful starting point is to distinguish between local transactions and XA transactions. A local transaction involves one transactional resource and one resource-specific transactional context. This is often the right choice when the work is contained within a single database connection or another single transactional boundary. It is lighter and usually more efficient than a distributed transaction because the runtime does not have to coordinate multiple different resource managers.

XA transactions are different. They are designed to coordinate more than one transactional resource, such as a database and a JMS system, through a distributed two-phase commit process. This can provide stronger cross-resource consistency in some cases, but it also introduces more complexity and overhead. XA is not automatically better because it covers more territory. In many integration designs, it is too heavy for the actual problem and can make the solution slower and harder to operate.

The first question to ask before using transactions is not whether they are available. It is whether the business scenario truly requires transactional consistency across the steps being combined. Sometimes the answer is yes. A message should not be acknowledged unless the database write succeeds. A database update and an internal queue handoff must move together or not at all. But in many real systems, end-to-end certainty across multiple boundaries is better served through idempotency, compensating logic, and replay-safe design than through broad distributed transactions. This is especially true when external APIs or SaaS systems are involved, because those interactions often fall outside classic transactional resource behavior anyway.

The following example shows a straightforward local transaction pattern around database work. The goal is to keep a sequence of database operations within one controlled resource boundary.

XML

```xml
<mule xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd">

    <db:config name="dbConfig">
        <db:my-sql-connection host="localhost" port="3306" user="appuser" password="appsecret" database="orders"/>
    </db:config>

    <flow name="orderUpdateFlow">
        <try transactionalAction="ALWAYS_BEGIN">
            <db:update config-ref="dbConfig">
                <db:sql><![CDATA[
                    UPDATE orders
                    SET status = 'APPROVED'
                    WHERE id = :id
                ]]></db:sql>
                <db:input-parameters><![CDATA[#[{ id: payload.orderId }]]]></db:input-parameters>
            </db:update>

            <db:insert config-ref="dbConfig">
                <db:sql><![CDATA[
                    INSERT INTO order_audit (order_id, message)
                    VALUES (:id, :message)
                ]]></db:sql>
                <db:input-parameters><![CDATA[#[{
                    id: payload.orderId,
                    message: "Order approved"
                }]]]></db:input-parameters>
            </db:insert>
        </try>
    </flow>
</mule>
```

This is the simplest correct version because the transactional scope is confined to database work that belongs to one local
<!-- p. 94 -->
resource family. If the second operation fails, the first can be rolled back within the same transaction context. This is a very reasonable use of a local transaction.

A more robust version becomes useful when validation and business shaping should happen outside the transaction so that the transaction boundary stays narrow and focused on the actual resource changes.

XML

```xml
<mule xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <db:config name="dbConfig">
        <db:my-sql-connection host="localhost" port="3306" user="appuser" password="appsecret" database="orders"/>
    </db:config>

    <flow name="orderUpdateFlow">
        <choice>
            <when expression="#[isEmpty(payload.orderId)]">
                <raise-error type="APP:INVALID_INPUT" description="Order identifier is required"/>
            </when>
        </choice>

        <set-variable variableName="auditMessage" value="#['Order approved']"/>

        <try transactionalAction="ALWAYS_BEGIN">
            <db:update config-ref="dbConfig">
                <db:sql><![CDATA[
                    UPDATE orders
                    SET status = 'APPROVED'
                    WHERE id = :id
                ]]></db:sql>
                <db:input-parameters><![CDATA[#[{ id: payload.orderId }]]]></db:input-parameters>
            </db:update>

            <db:insert config-ref="dbConfig">
                <db:sql><![CDATA[
                    INSERT INTO order_audit (order_id, message)
                    VALUES (:id, :message)
                ]]></db:sql>
                <db:input-parameters><![CDATA[#[{
                    id: payload.orderId,
                    message: vars.auditMessage
                }]]]></db:input-parameters>
            </db:insert>
        </try>

        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  orderId: payload.orderId,
  status: "APPROVED"
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
```

The improvement is subtle but important. Validation and response shaping do not live inside the transaction. The transaction is reserved for the resource changes that truly need shared atomicity. That is usually the healthier design.

XA transactions come into the picture when more than one transactional resource needs coordinated commit behavior. In theory, this sounds attractive because it promises stronger consistency across boundaries. In practice, it should trigger careful evaluation. Distributed transactions cost more, increase coordination complexity, and can be fragile under scale or mixed environments. They are useful in certain controlled scenarios, but they are not a default answer for every multi-step integration.

The following example shows the shape of a distributed transaction that might coordinate two compatible transactional
<!-- p. 95 -->
resources. The exact connectors and resource managers matter, but the structure illustrates the wider boundary.

XML

```xml
<mule xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns:jms="http://www.mulesoft.org/schema/mule/jms"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd
        http://www.mulesoft.org/schema/mule/jms http://www.mulesoft.org/schema/mule/jms/current/mule-jms.xsd">

    <db:config name="dbConfig">
        <db:my-sql-connection host="localhost" port="3306" user="appuser" password="appsecret" database="orders"/>
    </db:config>

    <jms:config name="jmsConfig">
        <jms:active-mq-connection brokerUrl="tcp://localhost:61616"/>
    </jms:config>

    <flow name="approveOrderFlow">
        <try transactionalAction="ALWAYS_BEGIN" transactionType="XA">
            <db:update config-ref="dbConfig">
                <db:sql><![CDATA[
                    UPDATE orders
                    SET status = 'APPROVED'
                    WHERE id = :id
                ]]></db:sql>
                <db:input-parameters><![CDATA[#[{ id: payload.orderId }]]]></db:input-parameters>
            </db:update>

            <jms:publish config-ref="jmsConfig" destination="approved.orders"/>
        </try>
    </flow>
</mule>
```

This is the simplest correct version of the idea, but it should never be adopted casually. It only makes sense when both resources support the required transaction semantics and when the business truly depends on coordinated success or rollback across both operations.

A more robust design often questions whether XA is needed at all. In many cases, a database update plus a message publication can be handled more safely through local persistence, idempotent downstream handling, and replay or recovery strategies instead of a distributed transaction. That design may appear more complex at first because it accepts eventual recovery rather than demanding perfect cross-resource atomicity. But in large-scale integration systems, that tradeoff is often healthier operationally.

This is the core practical tradeoff. Transactions provide strong consistency inside well-defined transactional boundaries. They do not solve every reliability problem, and they should not be stretched across boundaries that do not support them naturally. External HTTP APIs, SaaS calls, and many cloud interactions are not transaction participants in the classic sense. Trying to treat them as though they were often creates a false sense of safety. In those cases, compensating logic, retry discipline, dead-letter handling, and replay-safe processing are usually more realistic tools.

Local transactions are therefore best when one resource boundary matters deeply and rollback is meaningful there. XA is best reserved for cases where coordinated multi-resource consistency is both supported and necessary. Outside those scenarios, reliability should usually come from clearer boundaries, idempotency, and recovery design rather than from broader transactional ambition.

There is also a performance consideration. Transactions hold resources and impose coordination overhead. A transaction that spans too much work can reduce throughput and make failure handling slower. That is why transaction boundaries should be kept as narrow as possible. The design should include only the operations that truly require shared success or rollback. Validation, transformation, logging, and non-essential side work usually do not belong inside that boundary.

The most reliable approach is often modest and precise. Use local transactions where a single resource boundary truly needs
<!-- p. 96 -->
atomic behavior. Use XA only where the business case justifies the added complexity. Avoid pretending external side effects are transaction-safe when they are not. This mindset keeps transaction support useful instead of turning it into a source of hidden fragility.

## 8.4: Building Recovery Paths, Dead-letter Handling, and Replay-safe Flows

Even with careful error handling, good retries, and disciplined transaction use, some work will still fail. External systems may remain unavailable longer than the retry window. Messages may arrive with malformed content. Partial downstream conditions may make immediate recovery impossible. The application therefore needs a recovery strategy for work that cannot complete successfully in its current attempt. This is where recovery paths, dead-letter handling, and replay-safe design become essential.

A recovery path is the route the application uses when it cannot complete the main processing path but also should not simply discard the failure. Instead of losing the failed work or leaving it buried in logs without enough context, the application redirects it into a controlled path for later review, replay, or compensating action. In message-driven systems, this often takes the form of a dead-letter queue or an equivalent failure destination. In API-driven or file-driven flows, it may take the form of a persisted recovery record, an error file, or a routed internal message that captures the failed event details safely.

The point of a dead-letter path is not to hide failure. It is to preserve failure in a recoverable form. That requires more than routing the message somewhere else. The routed content should contain enough context to explain what failed, what the original business key was, what error occurred, and what data or identifiers are needed for later replay. If the failure path stores only a stripped or ambiguous fragment, recovery becomes much harder because the operations team or replay process no longer knows what should be retried.

The following example shows a straightforward flow that routes a failed processing attempt into a VM-based dead-letter queue using an error handler.

XML

```xml
<mule xmlns:vm="http://www.mulesoft.org/schema/mule/vm"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/vm http://www.mulesoft.org/schema/mule/vm/current/mule-vm.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <vm:config name="vmConfig"/>

    <flow name="processInvoiceFlow">
        <error-handler>
            <on-error-continue logException="true">
                <vm:publish config-ref="vmConfig" queueName="invoice.dead.letter.queue"/>
            </on-error-continue>
        </error-handler>

        <raise-error type="APP:PROCESSING_FAILED" description="Invoice processing failed"/>
    </flow>

    <flow name="deadLetterConsumerFlow">
        <vm:listener config-ref="vmConfig" queueName="invoice.dead.letter.queue"/>
        <logger level="ERROR" message='#[ "Dead-letter message received" ]'/>
    </flow>
</mule>
```

This is the simplest correct version because it demonstrates the core shape of a dead-letter path. A failure in the main flow is redirected to a separate queue for later handling. The application does not pretend the work succeeded, and it does not lose the failed event completely.

<!-- p. 97 -->
A more robust version is much more useful in real operations because it preserves meaningful replay context instead of publishing the raw failed event without structure.

XML

```xml
<mule xmlns:vm="http://www.mulesoft.org/schema/mule/vm"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/vm http://www.mulesoft.org/schema/mule/vm/current/mule-vm.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <vm:config name="vmConfig"/>

    <flow name="processInvoiceFlow">
        <set-variable variableName="invoiceId" value="#[payload.invoiceId default null]"/>
        <set-variable variableName="requestId" value="#[uuid()]"/>
        <error-handler>
            <on-error-continue logException="true">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  requestId: vars.requestId,
  invoiceId: vars.invoiceId,
  errorType: error.errorType.identifier,
  errorDescription: error.description,
  failedPayload: payload
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
                <vm:publish config-ref="vmConfig" queueName="invoice.dead.letter.queue"/>
            </on-error-continue>
        </error-handler>

        <raise-error type="APP:PROCESSING_FAILED" description="Invoice processing failed"/>
    </flow>

    <flow name="deadLetterConsumerFlow">
        <vm:listener config-ref="vmConfig" queueName="invoice.dead.letter.queue"/>
        <logger level="ERROR" message='#[ "Dead-letter message for invoice " ++ (payload.invoiceId as String) ]'/>
    </flow>
</mule>
```

This design is stronger because the dead-letter message now carries enough information to support later diagnosis and replay. The recovery path is no longer just a storage place for failure. It is a structured operational artifact.

Replay-safe design is the natural partner to dead-letter handling. A failed event is only truly recoverable if replaying it will not create damage or confusion. That means the flow should be designed so that reprocessing either repeats safely or can recognize that part of the work has already been completed. This is closely tied to idempotency, but it extends beyond simple duplicate suppression. Replay-safe design asks what will happen if this exact event is processed again after partial success. Which steps are safe. Which steps need protection. Which identifiers must stay stable so the repeated attempt can be recognized.

One of the most useful habits here is to generate or capture stable business keys early and preserve them through the failure path. A replay process that receives only anonymous payload data is much harder to control than one that receives a stable request identifier, business identifier, or idempotency key. Stable keys make it possible to decide whether the replay is new, repeated, or already complete in some external system.

The following example shows a replay-aware pattern using Object Store to protect a side-effecting flow from duplicate processing during recovery or redelivery.

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

    <flow name="processShipmentFlow">
        <set-variable variableName="processingKey" value="#[payload.shipmentId]"/>
        <os:contains objectStore="processingStore" key="#[vars.processingKey]" target="alreadyDone"/>

        <choice>
            <when expression="#[vars.alreadyDone]">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  shipmentId: payload.shipmentId,
  status: "already-processed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </when>
            <otherwise>
                <os:store objectStore="processingStore" key="#[vars.processingKey]" value="#['processed']"/>
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  shipmentId: payload.shipmentId,
  status: "processed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </otherwise>
        </choice>
    </flow>
</mule>
```
<!-- p. 98: el bloque anterior empieza en la p. 97 y sigue en esta página desde "http://www.mulesoft.org/schema/mule/core http://..." -->

This is a clean first step because it explicitly acknowledges replay and duplicate handling. The flow knows how to treat an already-seen shipment identifier and therefore will not repeat the side effect blindly.

A more robust version becomes useful when the processing record should contain richer state that helps replay and diagnostics work together.

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

    <flow name="processShipmentFlow">
        <set-variable variableName="processingKey" value="#[payload.shipmentId]"/>
        <os:contains objectStore="processingStore" key="#[vars.processingKey]" target="alreadyDone"/>

        <choice>
            <when expression="#[vars.alreadyDone]">
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  shipmentId: payload.shipmentId,
  status: "already-processed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </when>
            <otherwise>
                <os:store objectStore="processingStore"
                          key="#[vars.processingKey]"
                          value='#[{
                              state: "processed",
                              processedAt: now() as String
                          }]'/>
                <ee:transform>
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  shipmentId: payload.shipmentId,
  status: "processed"
}]]></ee:set-payload>
                    </ee:message>
                </ee:transform>
            </otherwise>
        </choice>
    </flow>
</mule>
```
<!-- p. 99: el bloque anterior empieza en la p. 98 y sigue en esta página desde "value='#[{" -->

This makes the stored state more operationally useful. A replay process can now see not only that the work was done but also when it was marked as complete. This can matter when diagnosing failures and choosing what to replay.

Recovery paths are also healthier when they separate the cause of failure from the next action. A dead-letter queue should preserve the failed work. A replay flow should decide whether and how to retry it. These do not have to be the same flow. In fact, they are often better kept separate because diagnosis and replay may happen on different timelines and under different controls. The application that failed the message may only know that it cannot continue safely. The replay process may later decide whether the underlying condition has changed.

Another useful habit is to keep recovery payloads small enough to manage but rich enough to act on. This balance matters. A recovery record that dumps everything indiscriminately can become noisy or unsafe, especially if sensitive data is included unnecessarily. A recovery record that omits key identifiers or the original business payload can become useless for replay. The right design captures what is needed for diagnosis and safe reprocessing without turning the dead-letter path into a raw data landfill.

Long-term reliability also depends on not treating recovery as a rare exception. If failures are operationally important, the application should log them consistently, give them stable identifiers, and route them predictably. Dead-letter handling should be part of the design, not an afterthought added only after production incidents. The same is true of replay. If messages or requests may need to be replayed, the original flow should be built with that possibility in mind from the start. This usually leads to better variable handling, clearer keys, more deliberate side-effect boundaries, and stronger idempotency.

The broader lesson is that recovery should preserve control. A failed event should not disappear, but it also should not be retried blindly forever. A dead-letter path gives the application a controlled place for unresolved failure. Replay-safe design gives the application a controlled way to re-attempt work when conditions improve. Together, they turn failure from a destructive endpoint into a managed operational state. That is one of the clearest signs that an integration is designed for real reliability rather than only for initial success.
