---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 4
titulo: "Building with MCP in Real Integration Scenarios"
paginas_pdf: "33-45"
temas: [agent-fabric]
transcrito: 2026-11-15
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna (descripciones JSON, URLs f-string partidas). En JSON y Python la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas.
- Los nombres en letra pequeña dentro del texto (create_service_case, invoke_case_handler_v3, summarize_refund_case_for_review, general_assistant_instructions_v7_final_final) se marcan con comillas invertidas.
- Cuando un bloque de código cruza de panel o de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza al principio de la p. 33 y termina al final de la p. 45. El capítulo 5 empieza en la p. 46.
-->

# Chapter 4: Building with MCP in Real Integration Scenarios

<!-- p. 33 -->
Understanding MCP conceptually is useful, but the real value appears when it is used to expose meaningful business capabilities in a way that agents can consume safely and predictably. This is the point where protocol design becomes integration design. It is no longer enough to say that MCP supports tools, resources, and prompts. The important question is how those surfaces should be shaped so they work well in actual enterprise environments where systems are inconsistent, permissions are uneven, data quality is mixed, and operational expectations are strict. Real integration scenarios expose whether an MCP design is stable or superficial. A clean demo can hide weak interface choices for a while. Production traffic does not.

Building with MCP in practice requires a shift in thinking. Many teams start from the backend and ask how to expose what already exists. That instinct is understandable, but it often leads to agent-facing surfaces that reflect internal implementation details rather than useful task boundaries. A better starting point is to ask what an agent actually needs to do, what context it needs to read, and what guidance it needs to apply the capability consistently. Once those needs are clear, MCP provides the structure for expressing them through tools, resources, and prompts. The protocol does not decide the right boundaries for you. It gives you a disciplined way to implement them.

This is especially important in enterprise integration because internal functions were not originally designed for agent consumption. They were designed for application developers, tightly controlled workflows, or human operators. Their naming may be inconsistent, their payloads may be overly technical, and their behavior may depend on assumptions that never had to be stated explicitly because the original callers already knew them. Exposing those functions directly through MCP is usually a mistake. A good MCP interface acts as a translation layer. It takes enterprise functionality and presents it as a set of capabilities that are understandable to the agent runtime, governable by the platform, and usable without hidden knowledge.

This chapter focuses on that practical work. The first section explains how to expose enterprise functions as MCP tools without leaking backend complexity or creating dangerous capability surfaces. The second section turns to resources and shows how to structure read-heavy context surfaces for cases where agents need to retrieve information before they act. The third section addresses prompt templates, which can be very useful when used with discipline and very damaging when treated as a dumping ground for every instruction or policy fragment in the system. The fourth section explains how to handle validation, errors, and tool semantics correctly, because those details determine whether an MCP interface will behave predictably when real requests begin to flow through it.

The broader goal across all four sections is the same. MCP should make enterprise capability exposure cleaner, not looser. It should reduce the amount of custom glue between agents and backend systems while increasing clarity about what is available, how it should be used, and what happens when something goes wrong. That requires design choices that favor semantic precision, consistent contracts, and operational honesty over raw convenience. Once that principle is applied, MCP becomes far more than a protocol checkbox. It becomes a practical method for presenting enterprise actions and context in a form that agents can use well.

## 4.1: Exposing Enterprise Functions as MCP Tools

An enterprise function becomes a good MCP tool only when it is exposed at the right level of meaning. That is the first and most important principle. A function that makes sense inside a backend service or internal integration flow may not make sense as an agent-facing tool. The difference comes from context. Internal functions are often shaped by application architecture, code organization, or historical implementation decisions. MCP
<!-- p. 34 -->
tools should instead be shaped by the task and the action the agent is expected to perform. If the tool boundary reflects the wrong thing, the agent will struggle to choose and use the capability correctly.

This usually means that raw backend operations need to be translated before they are exposed. An internal API might contain a method that updates several fields in a customer record, but an agent does not necessarily need that raw generality. It may need a narrower capability such as updating a contact preference, filing a service request, checking eligibility, or retrieving account status. Narrowing the action surface in this way is not a limitation. It is a form of safety and precision. It reduces ambiguity, constrains side effects, and makes the tool easier for the agent runtime to reason about.

The strongest MCP tools are named for what they accomplish, not for how the backend happens to implement them. A name such as `create_service_case` communicates purpose clearly. A name such as `invoke_case_handler_v3` does not. The same applies to descriptions. The description should help the calling side understand when the tool should be used, what input matters, and what output to expect. This is not just about documentation quality. For agentic systems, naming and description are part of the runtime contract because they influence whether the client selects the right capability in the first place.

Input design is equally important. A tool should accept the smallest set of parameters required to perform the task well, and those parameters should be described in business-meaningful terms. Many weak interfaces expose whatever the backend requires, even when those fields are implementation artifacts. That is a poor fit for MCP. The tool should absorb unnecessary complexity where possible and present an input shape that is clear and stable. If the backend requires a derived value, a code mapping, or a sequence of internal lookups, that logic often belongs behind the tool boundary rather than inside the caller.

Output design matters just as much. An agent needs structured outputs that are consistent enough to support follow-up reasoning and follow-up actions. If the result is just a block of inconsistent text or a raw backend payload with noisy internal fields, the tool may technically work but remain difficult to use well. A better pattern is to normalize the output into a predictable result shape that tells the client what happened, what important values were produced, and whether further action is needed. The more stable and intelligible the output, the easier it becomes for the client to handle success, ambiguity, or escalation.

A practical example helps. Suppose there is an internal order system with a set of REST endpoints for order lookup, shipment tracking, cancellation windows, and return eligibility. Exposing each of those raw endpoints directly as agent tools may look efficient at first, but it often produces a fragmented interface with overlapping purposes and inconsistent payloads. A more useful approach is to define a small set of MCP tools aligned with business tasks, such as checking order status, confirming whether cancellation is still allowed, and creating a return request. The tool layer becomes a curated action surface rather than a raw mirror of backend operations.

The first example below shows a tool registration for a cancellation eligibility check. It is intentionally narrow. The tool is not trying to cancel the order directly. It answers a specific operational question the agent may need before taking further action.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "tools": [
      {
        "name": "check_order_cancellation_eligibility",
        "description": "Determine whether an order can still be canceled before fulfillment is locked.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "orderId": {
              "type": "string",
              "description": "The unique order identifier."
            }
          },
          "required": ["orderId"],
          "additionalProperties": false
        }
      }
    ]
  }
}
```
<!-- p. 35: el bloque anterior empieza en la p. 34 y termina en esta página desde "}," (cierre de "properties") -->

This tool is strong because it has one purpose. The client can understand when to use it, and the input contract is very small. It does not force the calling side to know the internals of order state transitions or fulfillment system timing. That logic lives behind the tool.

A more robust version expands the same tool slightly so it can return richer operational value without changing its essential boundary. The tool still represents one clear action, but its description and schema provide better runtime guidance.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "tools": [
      {
        "name": "check_order_cancellation_eligibility",
        "description": "Determine whether an order can still be canceled, and provide the reason if cancellation is blocked.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "orderId": {
              "type": "string",
              "description": "The unique order identifier."
            },
            "channel": {
              "type": "string",
              "description": "The originating service channel when available, such as web, mobile, or support."
            }
          },
          "required": ["orderId"],
          "additionalProperties": false
        }
      }
    ]
  }
}
```

The difference is not that the second version is a different kind of tool. It is that the interface has grown in a way that still preserves semantic clarity. The optional channel parameter can help the backend apply channel-specific policy or logging without forcing every caller to supply more than is necessary.

Tool implementation deserves the same care as the declaration. The next example shows a small Python server-side handler that translates a backend API result into a stable MCP tool response. The point is not to mirror the internal payload but to normalize it into something the caller can use cleanly.

Python

```python
import requests

def check_order_cancellation_eligibility(order_id: str) -> dict:
    backend_response = requests.get(
        f"https://orders.internal/api/orders/{order_id}/cancellation-eligibility",
        timeout=5
    )
    backend_response.raise_for_status()
    data = backend_response.json()

    return {
        "orderId": order_id,
        "eligible": data.get("eligible", False),
        "reason": data.get("reason", "No reason provided")
    }
```

This is the simplest correct version. The handler calls the backend, checks the response, and returns a normalized structure with only the fields the MCP tool intends to expose. It does not leak internal headers, noisy backend status markers, or transport-specific details.

A more robust version deals with input normalization, backend uncertainty, and clearer semantics in the return value. The logic remains direct, but it is more realistic for enterprise use.

Python

```python
import requests

def check_order_cancellation_eligibility(order_id: str, channel: str | None = None) -> dict:
    normalized_order_id = order_id.strip().upper()

    params = {}
    if channel:
        params["channel"] = channel.strip().lower()

    backend_response = requests.get(
        f"https://orders.internal/api/orders/{normalized_order_id}/cancellation-eligibility",
        params=params,
        timeout=5
    )
    backend_response.raise_for_status()
    data = backend_response.json()

    return {
        "orderId": normalized_order_id,
        "eligible": bool(data.get("eligible", False)),
        "reason": data.get("reason") or "Cancellation status is unavailable",
        "fulfillmentState": data.get("fulfillmentState", "unknown")
    }
```
<!-- p. 36: el bloque anterior empieza en la p. 35 y ocupa el panel superior izquierdo de esta página -->

The value of the second version lies in how it stabilizes the interface. It normalizes the order identifier, handles optional channel information cleanly, and gives the caller a consistent structure even when the backend is imperfect. That kind of stabilization is one of the core jobs of the MCP layer.

Another important point is that not every enterprise function should be a direct-action tool. Some functions are too broad, too sensitive, or too dependent on business context to be safely exposed as single-step agent operations. In those cases, the better pattern is to split the interaction into decision-support tools and action tools. A tool can retrieve eligibility or policy context first, and a separate tool can submit the action only after the agent has enough grounded information. This separation reduces risk and improves audit clarity because the workflow becomes easier to explain.

Tool exposure should also reflect authorization boundaries. A back-office action that changes customer billing arrangements is not the same class of capability as a status lookup. Even if both are technically easy to expose, they should not be treated similarly. A good MCP tool design works with the platform's access-control model rather than bypassing it. The tool surface should be narrow enough that policy systems can reason about it. If a single tool can do half a dozen unrelated high-impact things, policy enforcement becomes awkward and unreliable.

One of the biggest mistakes in real MCP implementations is overexposure. Teams expose too many functions too early because they want the agent to be capable. The result is usually the opposite. The agent sees a cluttered menu of overlapping tools, tool selection quality drops, and governance becomes harder. A smaller set of well-designed tools often produces better outcomes than a large set of thin wrappers over backend APIs. Capability abundance is not the same thing as capability quality.

The practical standard should be this. A tool is worth exposing when it represents a meaningful action boundary, has a stable input contract, returns a usable structured result, and can be governed without ambiguity. When those conditions are not met, the function should usually stay behind the MCP boundary until it can be shaped into a proper tool. This is how enterprise functions become agent-usable capabilities rather than just remote procedure calls with a new label.

## 4.2: Structuring Resources for Read-Heavy Agent Use Cases

Many agentic workflows are read-heavy before they are action-heavy. An agent often needs to gather context, inspect state, review policy, or retrieve supporting information before it can decide what action is appropriate. That is why resources are such an important part of MCP. They provide a structured way to expose contextual information without forcing the calling side to treat everything as a tool invocation. In practice, this creates cleaner interfaces, clearer access boundaries, and better grounded reasoning.

A resource is not just any data payload. It is a deliberate context surface. That means it should be designed around the information the caller needs to read, not around the raw
<!-- p. 37 -->
structure of the backend system. This is very similar to what makes a good reporting view or query interface in other architectures. The resource should reflect a coherent slice of information that can be consumed directly. It should not require the client to know how to assemble it from several backend fragments unless the very purpose of the resource is to expose those fragments distinctly.

Read-heavy use cases are common in support operations, employee service, finance review, logistics tracking, procurement validation, and policy-driven decision support. In all of these, the agent often needs grounded context before it acts. It may need a customer profile summary, a recent order timeline, a payment status snapshot, a travel policy excerpt, or a purchase approval chain. If that information is only accessible through action-oriented tools, the interface becomes semantically awkward. It also becomes harder to apply separate governance for read access and write access. Resources solve that by giving context retrieval its own surface.

The first design decision is granularity. A good resource is neither so broad that it becomes a dumping ground for every related field, nor so narrow that the client has to issue a dozen separate reads just to understand one situation. The right balance depends on the use case. A support triage agent may benefit from a resource that provides a compact case summary including customer identity, issue category, recent interactions, and current status. That is more useful than exposing each of those as separate fragments. On the other hand, a large policy document may be better exposed as segmented resources so the client can retrieve only the relevant section.

The second design decision is stability of identity. A resource should have a clear addressable identity or retrieval pattern. This may be expressed through a URI-style template, a named asset with arguments, or another stable identifier recognized by the MCP interface. The goal is that the calling side can ask for the resource in a predictable way without relying on hidden lookup logic. This matters because resources are often reused across workflows. A stable identifier pattern supports reuse, audit, and caching strategies where appropriate.

The third design decision is format. Resource content should be structured enough to be useful but not overcomplicated. In enterprise environments, there is a temptation to expose the raw payload exactly as it comes from the backend. That is rarely the best choice. Raw payloads often contain fields that are irrelevant, inconsistent, or hard for a client to interpret cleanly. A better pattern is to present a curated view that retains the essential information and enough structure to support reliable follow-up reasoning. This is not about oversimplifying. It is about making the read surface intelligible and stable.

A practical example helps. Suppose a customer support agent frequently needs to review the current service profile for a customer before deciding whether to escalate, approve compensation, or initiate a service request. The backend data may live across billing, CRM, and support systems. The agent does not need the raw schema of each system. It needs a coherent resource that presents the customer's support-relevant profile. That is the kind of read-heavy use case resources are meant to serve.

The first example below shows a resource declaration for a customer support profile. It exposes the resource as a readable entity keyed by customer identifier.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 20,
  "result": {
    "resources": [
      {
        "uri": "support://customer-profile/{customerId}",
        "name": "Customer Support Profile",
        "description": "Read a support-oriented profile summary for a customer.",
        "mimeType": "application/json"
      }
    ]
  }
}
```

This is the simplest correct shape. The resource has a stable identifier pattern, a readable name, a purpose-oriented
<!-- p. 38 -->
description, and a declared content type. The description reflects the use case rather than the backend structure.

A more robust version adds operationally useful metadata that can support policy and clearer client interpretation.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 20,
  "result": {
    "resources": [
      {
        "uri": "support://customer-profile/{customerId}",
        "name": "Customer Support Profile",
        "description": "Read a support-oriented profile summary including service tier, open cases, and customer contact preferences.",
        "mimeType": "application/json",
        "annotations": {
          "readOnly": true,
          "containsPII": true,
          "domain": "support"
        }
      }
    ]
  }
}
```

The extra metadata does not change the resource's role, but it helps in environments where governance and selective exposure matter. The client now has a more honest view of the surface, and the platform has stronger signals for policy.

The next step is resource retrieval. A client will eventually request the resource for a specific identifier, and the server should respond with a normalized representation of the information. The following Python example shows a resource handler that composes several backend fields into a stable summary object.

Python

```python
import requests

def read_customer_support_profile(customer_id: str) -> dict:
    response = requests.get(
        f"https://support.internal/api/customers/{customer_id}/profile",
        timeout=5
    )
    response.raise_for_status()
    data = response.json()

    return {
        "customerId": customer_id,
        "serviceTier": data.get("serviceTier"),
        "openCaseCount": data.get("openCaseCount", 0),
        "preferredContactChannel": data.get("preferredContactChannel")
    }
```

This is effective because it shields the client from the backend payload shape. The client gets a small and meaningful view. That often produces better agent behavior than dumping every available field into the result.

A more robust version improves normalization and makes the resource better suited for reuse across several workflows.

Python

```python
import requests

def read_customer_support_profile(customer_id: str) -> dict:
    normalized_customer_id = customer_id.strip().upper()

    response = requests.get(
        f"https://support.internal/api/customers/{normalized_customer_id}/profile",
        timeout=5
    )
    response.raise_for_status()
    data = response.json()

    return {
        "customerId": normalized_customer_id,
        "serviceTier": data.get("serviceTier", "unknown"),
        "openCaseCount": int(data.get("openCaseCount", 0)),
        "preferredContactChannel": data.get("preferredContactChannel", "unspecified"),
        "accountStatus": data.get("accountStatus", "unknown"),
        "latestCaseSummary": data.get("latestCaseSummary")
    }
```

The improvement here is not complexity for its own sake. It is that the server takes responsibility for giving the client consistent values even when the backend is inconsistent or
<!-- p. 39 -->
incomplete. That is one of the most useful qualities of a well-designed resource surface.

Resources are also valuable for policy and knowledge retrieval, but they should be structured with care. A common mistake is to expose one giant policy document as a single resource and then expect the client to extract the relevant part every time. That can work occasionally, but it often leads to poor grounding because the useful information is buried in too much irrelevant text. A better pattern is to expose policy resources as logical sections or indexed views aligned with actual decision points. If the agent needs to know return policy for damaged goods, the resource layer should help it get that part directly rather than forcing a full-document scan for every request.

Another common mistake is to create resources that are secretly action-dependent. A resource should be readable and predictable. If reading it triggers hidden side effects or expensive backend workflows, the client cannot reason about it properly as a context surface. Resource access should be semantically honest. This is important both for system design and for governance. A read surface should behave like a read surface.

There is also a design decision around freshness. Some resources reflect near real-time operational state. Others represent knowledge that changes slowly. The MCP layer should not hide this distinction. If the resource is a live service profile, the client should be able to trust that it reflects recent state within the operational expectations of the system. If the resource is a policy excerpt, the client should trust that it is the current governed version. Stable resource design includes not only schema stability but also conceptual stability around what the data represents.

When read-heavy use cases are supported well, the quality of agent behavior improves because the client has better grounding before it acts. It can inspect a clear support profile, retrieve a narrow policy section, or read a normalized operational summary without depending on a chain of unrelated tool calls. That leads to cleaner workflows, lower tool-call noise, and more explainable behavior. Resources do not replace tools. They make tools easier to use correctly by providing the contextual surfaces that actions depend on.

## 4.3: Using Prompt Templates Without Turning MCP into a Prompt Dump

Prompt templates are useful in MCP because they let the server expose reusable task framing in a structured way. That can improve consistency, reduce duplication, and keep domain-specific prompting closer to the people who understand the task best. It is a strong feature when used with discipline. It becomes a problem when every instruction, exception, policy note, and workflow rule is pushed into prompt assets without clear boundaries. At that point, the prompt surface turns into a storage area for everything the architecture failed to model elsewhere. That is what turns a useful feature into a prompt dump.

The first rule for using prompt templates well is that prompts should frame tasks, not replace structural design. A prompt can guide how to summarize a support case, how to draft an escalation note, how to produce a compliance review summary, or how to explain a decision to a user in an approved tone. Those are good uses because the prompt is shaping language and task handling around an existing capability or information flow. A prompt should not be the place where tool authorization rules, hidden system dependencies, or unstable business logic are stored when those concerns should really live in policy, tool contracts, or orchestration rules.

A prompt template is strongest when it has a clear purpose and narrow intended use. If a prompt is named `summarize_refund_case_for_review`, the client should understand what situation it is for and why it exists. If a prompt is named `general_assistant_instructions_v7_final_final`, the interface is already sliding into disorder. Stable prompt design depends on semantic clarity just as much as stable tool design does. A prompt asset should represent a recognizable task pattern, not a container for miscellaneous text that happened to accumulate over time.

Parameterization is another useful technique when applied carefully. A prompt template can accept structured arguments
<!-- p. 40 -->
such as audience, tone, channel, or policy context. This allows the same prompt asset to be reused in closely related situations without duplicating prompt text for every variant. The key is to keep the parameters meaningful and limited. If a prompt requires a long list of loosely defined arguments just to function, it probably represents too much responsibility and should be redesigned.

Prompt templates also work best when they complement tools and resources rather than compete with them. A common pattern is that the client retrieves a resource for context, uses a prompt to frame the response or analysis task, and then calls a tool if action is required. That is a clean sequence because each MCP surface is doing its own job. Resources provide grounded information. Prompts provide reusable task framing. Tools provide execution. The prompt layer becomes problematic when it tries to compensate for weak resources, weak tools, or missing orchestration. It should enhance clarity, not patch structural gaps.

A practical example makes this easier to see. Consider a support environment where a case may need to be escalated to a specialist team. The actual escalation submission may be handled by a tool. The case details and account state may come from resources. The prompt can provide a reusable structure for composing the escalation note so that it includes the relevant operational details and stays concise. That is a strong use because the prompt supports a repeatable task with linguistic and procedural consistency.

The first example below shows a simple prompt listing for that use case. The prompt asset is named clearly and described in a way that communicates its purpose.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 30,
  "result": {
    "prompts": [
      {
        "name": "summarize_case_for_escalation",
        "description": "Prepare a concise escalation summary for a support case."
      }
    ]
  }
}
```

This is the simplest correct registration. The asset says what it is for and nothing more. That clarity alone is valuable because it tells the client when the prompt should be requested.

A more robust version adds a description that makes the intended content boundaries clearer, which helps guide consistent use.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 30,
  "result": {
    "prompts": [
      {
        "name": "summarize_case_for_escalation",
        "description": "Prepare a concise support escalation summary focused on issue, impact, actions already taken, and the current blocker."
      }
    ]
  }
}
```

The difference is small but meaningful. The richer description gives the client better signal about what the prompt will produce and when it is appropriate.

Retrieving the prompt with arguments is where the template becomes genuinely reusable. The next example shows the client requesting the prompt for a specific audience and tone. The request is still structured and bounded.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 31,
  "method": "prompts/get",
  "params": {
    "name": "summarize_case_for_escalation",
    "arguments": {
      "audience": "network-operations",
      "tone": "concise"
    }
  }
}
```
<!-- p. 41: el bloque anterior empieza al final de la p. 40 y termina en esta página desde "\"arguments\": {" -->

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 31,
  "result": {
    "description": "Prompt template for support escalation summaries.",
    "messages": [
      {
        "role": "system",
        "content": {
          "type": "text",
          "text": "Write a concise escalation summary for network-operations. Include the issue, customer impact, actions already taken, current blocker, and any known time sensitivity."
        }
      }
    ]
  }
}
```

This is a strong example because the prompt remains a task-framing asset. It does not try to decide policy or perform action. It gives the client a reusable structure for language generation in a specific operational context.

A more robust pattern is to generate prompt content partly from governed domain context on the server side rather than forcing the client to build everything itself. The following Python example shows a handler that assembles the prompt text from controlled arguments.

Python

```python
def get_escalation_prompt(audience: str, tone: str) -> dict:
    return {
        "description": "Prompt template for support escalation summaries.",
        "messages": [
            {
                "role": "system",
                "content": {
                    "type": "text",
                    "text": (
                        f"Write a {tone} escalation summary for {audience}. "
                        "Include the issue, customer impact, actions already taken, "
                        "and the current blocker."
                    )
                }
            }
        ]
    }
```

This is a useful starting point because it centralizes the prompt template and keeps the argument handling clean. The server owns the task framing and the client simply requests it.

A more robust version constrains the argument values and keeps the output more consistent across clients and environments.

Python

```python
def get_escalation_prompt(audience: str, tone: str) -> dict:
    allowed_audiences = {
        "network-operations": "network-operations",
        "billing-operations": "billing-operations",
        "platform-support": "platform-support"
    }
    allowed_tones = {
        "concise": "concise",
        "formal": "formal"
    }

    normalized_audience = allowed_audiences.get(audience.strip().lower(), "platform-support")
    normalized_tone = allowed_tones.get(tone.strip().lower(), "concise")

    text = (
        f"Write a {normalized_tone} escalation summary for {normalized_audience}. "
        "State the issue clearly, describe customer impact, summarize actions already taken, "
        "identify the current blocker, and avoid speculation."
    )

    return {
        "description": "Prompt template for support escalation summaries.",
        "messages": [
            {
                "role": "system",
                "content": {
                    "type": "text",
                    "text": text
                }
            }
        ]
    }
```
<!-- p. 42: el bloque anterior empieza en la p. 41 y termina en esta página desde "\"type\": \"text\"," -->

The value of the second version is that it prevents uncontrolled prompt drift. The server decides which audience and tone values are valid and normalizes them. This keeps the prompt asset stable and avoids the prompt surface becoming a free-form text construction engine.

The deeper issue with prompt misuse is that teams often reach for prompts to solve problems that should be modeled elsewhere. A policy rule about who can approve a refund belongs in authorization or tool exposure policy, not in a prompt line saying the assistant should not approve large refunds. A hidden dependency saying one tool must only be used after another should be reflected in workflow design or tool boundaries, not buried in an instruction block. Prompts are valuable for language and task framing. They become fragile when turned into the main location for system control.

Another sign of prompt drift is duplication. If several prompt assets differ only slightly because no one defined a clear parameterization strategy, the interface becomes harder to maintain. The opposite problem also occurs when one prompt asset becomes so broad and conditional that it is trying to do the work of several separate prompts. The stable middle ground is a small set of clearly named prompts aligned to repeated task patterns. Each should have a clear purpose, limited argument structure, and a stable relationship to the workflows it supports.

Prompt templates should also be reviewed for shelf life. Language can evolve. Business terminology can change. Certain communication styles may need adjustment. That is normal. The goal is not to freeze every prompt forever. The goal is to keep prompt assets purposeful and manageable. Stable prompt design means that a template can evolve while preserving its intended task and interface meaning. If prompt assets are created casually and left unmanaged, they age poorly and become a source of inconsistency.

Used well, prompt templates help keep MCP interfaces balanced. They prevent clients from scattering domain-specific instructions in application code, they promote consistency across channels, and they support reusable task framing close to the domain that owns the workflow. Used poorly, they become the place where missing architecture goes to hide. The difference comes down to discipline. Prompts should frame tasks clearly, accept only meaningful parameters, and stay in their lane alongside resources and tools rather than trying to replace them.

## 4.4: Handling Validation, Errors, and Tool Semantics Correctly

Good MCP interfaces do not fail gracefully by accident. They do so because validation, error handling, and tool semantics were designed deliberately from the start. This part of the interface is often neglected during early experimentation because the primary goal is just to get a capability working. That is understandable, but it does not hold up in real integration scenarios. Once tools begin to carry meaningful business operations, the way they reject bad input, surface failure, and communicate outcomes becomes just as important as the success path.

Validation is the first line of stability. A tool should validate its input according to its declared contract before it attempts backend work. This is not only about preventing malformed requests from reaching the implementation. It is also about preserving semantic clarity. If the tool says it expects an order identifier and a reason code from a known set, then that is what it should enforce. Letting invalid or vague inputs through often leads to unpredictable downstream behavior, and that unpredictability is much more damaging in agentic systems than in ordinary forms because the calling side may interpret ambiguous results as usable information.

Validation should happen as close to the MCP boundary as possible. The server should not rely entirely on downstream systems to reject invalid inputs because those systems may return inconsistent errors or accept malformed values in ways
<!-- p. 43 -->
that cause subtle faults later. The MCP layer should act as the disciplined contract boundary. This makes the interface more predictable for every client and reduces the amount of backend-specific error logic that leaks outward.

The next important issue is semantic validation, which goes beyond basic schema checking. A parameter may be present and technically of the correct type while still being invalid for the task. An order identifier may exist syntactically but refer to an order outside the caller's domain. A requested quantity may be numeric but exceed allowed policy. A case priority may be a string but not one of the supported values for the target workflow. Good interfaces treat these as first-class validation concerns, not as minor implementation details.

Errors should be expressed honestly. One of the most common problems in poor tool design is the tendency to collapse every failure into a vague generic message. That makes troubleshooting difficult and often leads the calling side to react badly. A validation error should be clearly distinguishable from a temporary backend outage. A not-found condition should be distinguishable from an authorization failure. A business-rule rejection should be distinguishable from malformed input. The more clearly these categories are exposed, the better the client can respond. This is especially important when the client is an agent runtime that may choose whether to retry, ask for clarification, or stop the workflow.

Tool semantics must also be precise. A tool should behave in a way that matches its declared meaning. If a tool is described as checking eligibility, it should not silently submit a request as a side effect. If a tool is described as creating a case, it should not sometimes update an existing case based on hidden logic. Semantic honesty matters because the client uses the tool's name and description as part of its reasoning. If the actual behavior diverges from the declared behavior, the system becomes unreliable even when every call technically succeeds.

The safest pattern is often to separate assessment tools from action tools. One tool checks whether a refund is allowed. Another submits the refund request. One tool retrieves account status. Another changes an account setting. This makes workflows more explicit and gives the client cleaner control over what happens next. It also improves observability and policy enforcement because each action has a distinct meaning. Overloaded tools with mixed semantics tend to create both operational and governance problems.

A practical example helps show how validation and error structure can be implemented cleanly. Suppose there is a tool for creating a return request. The tool should validate that the order identifier is present, that the reason code is supported, and that the order is actually eligible for return before attempting submission. It should not defer all of that to the downstream system and then pass the raw error back to the caller.

The first code example below shows a Python function that handles validation at the MCP boundary before performing the backend call.

Python

```python
import requests

ALLOWED_REASON_CODES = {"damaged", "wrong-item", "not-needed"}

def create_return_request(order_id: str, reason_code: str) -> dict:
    if not order_id or not order_id.strip():
        raise ValueError("orderId is required")

    if reason_code not in ALLOWED_REASON_CODES:
        raise ValueError("reasonCode is not supported")

    response = requests.post(
        "https://returns.internal/api/returns",
        json={
            "orderId": order_id.strip().upper(),
            "reasonCode": reason_code
        },
        timeout=5
    )
    response.raise_for_status()

    data = response.json()
    return {
        "returnRequestId": data["returnRequestId"],
        "status": data["status"]
    }
```

<!-- p. 44 -->
This is the simplest correct version. It enforces obvious input rules and returns a clean structured result. The weaknesses are also clear. The error handling is still generic, and the function does not distinguish between different classes of failure beyond basic validation and whatever the transport layer raises.

A more robust version adds semantic checks and clearer error translation. This makes the tool much easier for a client to use predictably.

Python

```python
import requests

ALLOWED_REASON_CODES = {"damaged", "wrong-item", "not-needed"}

class ToolValidationError(Exception):
    pass

class ToolExecutionError(Exception):
    pass

class ToolAuthorizationError(Exception):
    pass

def create_return_request(order_id: str, reason_code: str) -> dict:
    normalized_order_id = order_id.strip().upper()
    normalized_reason = reason_code.strip().lower()

    if not normalized_order_id:
        raise ToolValidationError("orderId is required")

    if normalized_reason not in ALLOWED_REASON_CODES:
        raise ToolValidationError("reasonCode is not supported")

    eligibility_response = requests.get(
        f"https://returns.internal/api/orders/{normalized_order_id}/eligibility",
        timeout=5
    )
    eligibility_response.raise_for_status()
    eligibility = eligibility_response.json()

    if not eligibility.get("eligible", False):
        raise ToolValidationError(
            eligibility.get("reason", "Order is not eligible for return")
        )

    response = requests.post(
        "https://returns.internal/api/returns",
        json={
            "orderId": normalized_order_id,
            "reasonCode": normalized_reason
        },
        timeout=5
    )

    if response.status_code == 403:
        raise ToolAuthorizationError("Return request is not authorized")

    if response.status_code >= 500:
        raise ToolExecutionError("Return service is temporarily unavailable")

    response.raise_for_status()
    data = response.json()

    return {
        "returnRequestId": data["returnRequestId"],
        "status": data["status"],
        "eligible": True
    }
```

The stronger version does several important things. It normalizes inputs, distinguishes validation from authorization and execution failures, and checks business eligibility explicitly before submission. That gives the client far more usable information than a single opaque failure path.

At the protocol level, error responses should reflect these distinctions cleanly. The client should be able to tell whether it needs to correct input, stop because access is denied, or retry later because the service is unavailable. The next example shows a simple validation error response in JSON-RPC style.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 41,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "field": "reasonCode",
      "detail": "reasonCode is not supported"
    }
  }
}
```
<!-- p. 45: el bloque anterior empieza en la p. 44 y termina en esta página con las llaves de cierre -->

This is clear and actionable. The client knows the issue is with input parameters rather than service failure. It can ask for clarification or choose a different path.

A more robust error shape can retain protocol clarity while making operational response easier on the calling side.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 41,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "category": "validation",
      "field": "reasonCode",
      "detail": "reasonCode is not supported",
      "allowedValues": ["damaged", "wrong-item", "not-needed"]
    }
  }
}
```

The second version gives the client even better grounding. It can explain the problem, steer the workflow, or request the missing correction with less guesswork.

Backend failures should be handled differently. If the returns system is unavailable, the tool should not pretend the request was invalid. It should surface an execution failure clearly enough that the caller can decide whether to retry or defer action. That distinction becomes even more important in brokered or multi-agent environments where one component's failure may influence routing or escalation decisions elsewhere.

Semantic correctness also means being careful with success responses. A tool should not report success when the action is merely accepted for later processing unless the output makes that distinction clear. Many enterprise systems are asynchronous under the surface. A submission may be received and queued rather than completed. The MCP tool should communicate that honestly. If the result is a created request with pending status, the output should say so. That helps the client decide what to say next and whether further checking is needed.

There is also a subtle but important issue around retry behavior. Some tools are safe to retry after a transient failure. Others are not. If a submission tool might create duplicate actions when retried blindly, the interface design should account for that. This may involve idempotency patterns behind the scenes, clear result identifiers, or stronger separation between validation and submission phases. The MCP layer does not remove these concerns. It makes them more visible because the calling side may not be a deterministic workflow engine. It may be an agent runtime that needs reliable clues about what happened.

Another common source of trouble is using descriptive text in place of structured semantics. A tool returns a free-form message such as "Looks okay" or "Probably blocked due to policy" instead of clear fields like `eligible`, `status`, or `reason`. That may appear human-friendly, but it makes downstream behavior harder to control. Good MCP interfaces can still include descriptive text where useful, but they should anchor the result in stable structured fields first. Agents and orchestration layers behave more reliably when the interface tells them what the outcome means in a structured way.

The broader principle is that a tool contract is not complete when the success path works. It is complete when valid input is enforced, invalid input is rejected clearly, execution failures are surfaced honestly, authorization is distinguishable, side effects match the declared semantics, and outputs tell the truth about the operation's state. That is what makes an MCP tool usable in production rather than merely demonstrable in isolation.

When validation, errors, and semantics are handled well, the entire MCP layer becomes easier to trust. Clients choose tools more accurately, recover from failures more sensibly, and interact with enterprise systems in a way that is both more stable and more explainable. This is one of the most practical advantages of designing MCP interfaces seriously. It turns a flexible protocol into a disciplined operational contract that can carry real business work without collapsing under ambiguity.
