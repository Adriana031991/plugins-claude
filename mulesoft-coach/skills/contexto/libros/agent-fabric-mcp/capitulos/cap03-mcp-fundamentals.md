---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 3
titulo: "Model Context Protocol Fundamentals"
paginas_pdf: "21-32"
temas: [agent-fabric]
transcrito: 2026-11-14
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna. No corrijo ni completo nada.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 21 y termina al final de la p. 32. El capítulo 4 empieza en la p. 33.
- En los JSON y el Python, la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas. Las descripciones partidas por el ancho de columna se unieron en una sola línea.
-->

# Chapter 3: Model Context Protocol Fundamentals

<!-- p. 21 -->
Model Context Protocol provides a structured way for AI clients and servers to work together when context, tools, and reusable interaction patterns need to move across a boundary in a predictable form. This matters because an agentic system is only as useful as the quality of the capabilities it can reach and the discipline with which those capabilities are exposed. If every tool, every knowledge source, and every prompt surface is wired differently, the client side becomes cluttered with custom adapters and hidden assumptions. That leads to fragile integration, uneven security, and a poor foundation for scale. MCP addresses that by defining a common interaction model between a client and a server. The server exposes capabilities. The client negotiates what is supported, uses those capabilities through a standard protocol, and maintains a session that can carry context through the exchange.

The importance of MCP is often reduced to tool calling, but that is too narrow. Tool invocation is one important part of the protocol, but it is not the whole story. MCP also provides a consistent model for exposing resources that can be read as context, prompts that can be reused as structured guidance, and lifecycle behaviors that allow the two sides to agree on capabilities and operational expectations at connection time. A serious implementation needs to understand all of these dimensions because the protocol is not just a transport for commands. It is a contract for how an AI-enabled client can safely and predictably interact with external capabilities.

The reason this matters in enterprise integration is straightforward. Agents need access to systems and information, but that access cannot be improvised. The interaction surface has to be stable enough to govern, broad enough to support useful tasks, and precise enough to reduce ambiguity. MCP gives system designers a way to present capabilities in a form that agents can consume without forcing every client to know the private details of the backend.
<!-- p. 22 -->
It also gives platform teams a cleaner separation between backend implementation and agent-facing design. A tool exposed through MCP can wrap an API, a workflow, or some internal logic. A resource can represent structured business data, generated context, or indexed content. A prompt can carry reusable task framing that is stronger than scattering one-off instructions through application code.

This chapter explains MCP from the ground up in a way that connects protocol ideas to operational use. The first section covers architecture, lifecycle, and capability negotiation so the client-server model is clear from the start. The second section explains tools, resources, and prompts as distinct capability types, because much confusion comes from treating them as interchangeable. The third section looks at transports, sessions, and remote MCP communication, which is where protocol design meets runtime reality. The fourth section turns from protocol mechanics to interface design and explains how to create stable MCP surfaces for enterprise systems. By the end of this discussion, MCP should feel less like a trend term and more like a practical, structured integration protocol for agentic systems.

## 3.1: MCP Architecture, Lifecycle, and Capability Negotiation

At its core, MCP uses a client-server model. That simple statement matters because it helps keep responsibilities clear. The MCP server is the component that exposes capabilities. The MCP client is the component that connects to the server, negotiates what is available, and invokes those capabilities as needed. In many real systems, the client will sit inside an agent runtime, an assistant platform, or a broader orchestration layer. The server will typically sit in front of backend systems, application logic, knowledge retrieval, or composed operations that are being made available in a standard form.

This separation is useful because it keeps the protocol surface stable even when the implementation behind it changes. A client does not need to know whether a tool wraps one REST endpoint, a workflow engine, a database query, or a combination of several services. The client only needs to know that the server exposes a capability with a clear contract. That creates a cleaner relationship between the agent-facing layer and the implementation layer. It also allows different teams to work with different responsibilities. One team can own the MCP interface. Another can own the systems that fulfill it. The protocol boundary reduces coupling between the two.

MCP is structured around request and response exchanges, along with notifications and session-level behaviors. It gives both sides a way to communicate not only the use of capabilities but also the terms of the interaction itself. This is where lifecycle comes in. A connection should not begin with blind invocation. The two sides need a shared understanding of protocol version, supported features, and expected interaction patterns. Without that, the client risks calling methods the server does not support, misinterpreting capability data, or assuming behaviors that are absent. Lifecycle negotiation helps avoid those mistakes.

The lifecycle begins with initialization. The client opens communication with the server and provides the relevant information needed to establish the session. This may include the protocol version the client wants to use and the categories of capabilities or features it understands. The server replies with its own supported version information and with declarations of the features it offers. The important idea here is not only compatibility but explicitness. A robust MCP connection should not depend on guesswork. The client should know what the server can do, and the server should know what sort of client it is dealing with.

A practical way to view initialization is that it serves the same purpose as a handshake in other distributed systems. It confirms that both sides are speaking the same language, or at least a compatible enough dialect of it, before real work begins. This is especially important in environments where clients and servers may evolve independently. A server may add new capability categories or optional behaviors. A client may support only a subset of them. Negotiation allows those differences to be
<!-- p. 23 -->
surfaced cleanly at the start of the session rather than causing runtime confusion later.

The architecture also assumes that not every server will expose the same classes of capability. Some MCP servers exist mainly to expose tools. Others may expose resources and prompts alongside tools. Others may be narrowly focused on context retrieval. Capability negotiation lets the server advertise the categories it supports, and lets the client adapt accordingly. This is important because it avoids the false assumption that MCP is one rigid feature set. The protocol establishes a common shape, but actual implementations can vary in what they provide.

The concept of capabilities deserves careful attention here. In MCP, a capability is not just an arbitrary piece of functionality. It is a declared, protocol-level feature that the client can inspect and use. The most visible examples are tools, resources, and prompts, but negotiation can also include support for lifecycle behaviors, transport expectations, and other protocol-specific functions. The point is that the client does not have to infer what is present through trial and error. It can query or inspect the available surface in a standardized way.

This architecture supports a healthier pattern for agentic systems. Instead of an agent receiving a large prompt that says what tools might exist somewhere, the agent's runtime can use the MCP session to discover what the server explicitly exposes. That makes the environment more truthful and more governable. If a capability is unavailable, the client knows it. If the server exposes a new resource or prompt, the client can see it as part of the declared surface. This is far better than relying on hidden assumptions or out-of-band instructions.

The lifecycle also includes the operating phase after initialization. Once the session is established, the client can ask for capability listings, invoke tools, request resources, retrieve prompts, or perform other protocol actions supported by the server. These operations are not random. They happen within the negotiated scope of the session. This provides predictability. It also gives system designers a better place to enforce policy and to reason about behavior. A session is a bounded context. It is not just a pile of disconnected requests.

Some MCP interactions are naturally stateful in a practical sense even if the protocol methods themselves remain individually structured. The client may retrieve a resource, use that information to choose a tool, and then request a prompt template to shape a follow-up task. Even when each protocol exchange is clear on its own, the session creates continuity across them. That continuity is why lifecycle discipline matters. It gives the client and server a controlled relationship for the duration of the interaction, rather than treating every call as if it were unrelated to the last.

Capability negotiation also influences client behavior in subtle but important ways. A client that knows a server supports resources can use those resources to ground requests before choosing tools. A client that knows the server supports prompts can obtain reusable task structures instead of improvising them in application code. A client that sees only tools can behave accordingly. In this sense, negotiation shapes strategy. It helps the client make better use of what the server actually offers, which improves both accuracy and efficiency.

To make the protocol mechanics concrete, it helps to see what an initialization exchange might look like. The first example below shows the simplest correct form of a client announcing itself and the protocol version it expects, followed by the server confirming its own version and the capability categories it exposes.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "clientInfo": {
      "name": "support-assistant",
      "version": "1.0.0"
    },
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    }
  }
}
```
<!-- p. 24: el bloque anterior empieza en la p. 23 y termina en esta página con las llaves de cierre -->

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "serverInfo": {
      "name": "customer-ops-mcp",
      "version": "1.2.0"
    },
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    }
  }
}
```

This exchange shows the essential ideas. The client identifies the protocol version and declares the capability categories it can work with. The server responds with the protocol version it will use for the session, identifies itself, and states what it supports. Even in this small example, two benefits are visible. The relationship is explicit, and the client has enough information to decide how to proceed.

A more robust version adds stronger structure around the same basic exchange by making room for implementation details and a richer declared contract. The protocol mechanics remain familiar, but the additional metadata makes the session easier to inspect and easier to manage in larger environments.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "init-001",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "clientInfo": {
      "name": "support-assistant",
      "version": "1.3.4"
    },
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    },
    "implementation": {
      "runtime": "agent-broker",
      "environment": "production"
    }
  }
}
```

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "init-001",
  "result": {
    "protocolVersion": "2025-06-18",
    "serverInfo": {
      "name": "customer-ops-mcp",
      "version": "1.2.0"
    },
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    },
    "sessionInfo": {
      "sessionId": "sess-8fd7c1",
      "expiresInSeconds": 1800
    }
  }
}
```

The difference is not that the second exchange changes the fundamental shape of MCP. It shows how the same lifecycle can support more disciplined operational behavior when the environment is larger and needs clearer session handling. That is often the practical path in enterprise settings. The protocol starts from a clean, structured core, then carries more operational detail as the implementation matures.

Capability negotiation should also be understood as a design signal, not just a technical handshake. If a server declares too
<!-- p. 25 -->
many broad capabilities without careful structure, the client side becomes harder to reason about. If it declares capabilities too narrowly or inconsistently, the session becomes awkward to use. Good negotiation depends on good capability design. That theme becomes even more important in the next section, where tools, resources, and prompts are treated as separate MCP surfaces with distinct purposes.

## 3.2: Tools, Resources, and Prompts in MCP

One of the most useful things MCP does is separate capability types that often get mixed together in poor agent designs. Tools, resources, and prompts each serve a different purpose. When they are designed and used correctly, they create a cleaner interaction model for the client and a more stable interface for the platform. When they are blurred together, the result is confusion, overexposure, and brittle client behavior.

A tool is an action surface. It exists so the client can ask the server to do something. In practical terms, a tool usually maps to an operation that has defined inputs and produces a structured output. A tool may retrieve data, update a record, trigger a workflow, submit a request, calculate something, or compose backend operations behind the scenes. What matters is that the client treats it as an executable capability. The tool has a name, a description, and an input contract that tells the client what arguments are required or allowed. This lets the client reason about action rather than guess at backend behavior.

Tools are powerful, which is exactly why they need discipline. A poorly designed tool surface causes many failures in agentic systems. If a tool is too broad, the client may struggle to predict its side effects. If two tools overlap too much, the client may choose inconsistently. If the input contract is vague, invocation becomes error-prone. Good tool design aims for clear intent and controlled scope. A tool should represent a meaningful capability with understandable behavior, not a dump of backend implementation details.

Resources are different. A resource is a contextual surface. It exists so the client can retrieve information in a structured way. This information may be a document, a piece of business data, a generated view of state, or some other context that helps ground the client's reasoning or informs a later action. Resources are important because not every useful interaction is an action. Agents and assistants often need to read before they act. By separating resources from tools, MCP supports that distinction directly.

This separation has architectural value. If a client only needs to retrieve a policy definition, account summary, or knowledge article, that should not require invoking a mutating operation. Likewise, if a client needs to call a workflow, it should not be forced to retrieve information through a pseudo-resource that is really an action. Clear resource design improves safety because it helps keep read access and action access distinct. It also improves clarity because the client can reason differently about a read surface than about an executable one.

Prompts are different again. A prompt in MCP is not a random string of instructions. It is a reusable prompt template or structured prompt asset that the client can request from the server. This is useful because many tasks need consistent framing. A prompt may define how to summarize a support case, how to review an approval request, how to structure a customer response, or how to guide a follow-up interaction with a user. By exposing prompts through MCP, the server can provide reusable task-specific guidance instead of forcing all prompt structure to live inside the client application.

This creates an important design advantage. The people who best understand a task domain are not always the same people who build the client application. A prompt surface allows domain-specific task framing to be maintained closer to the capability provider or domain owner. That can improve consistency across clients and reduce duplication. It also means prompt logic can become a governed asset rather than a hidden text block buried in one application.

Tools, resources, and prompts should therefore not be seen as minor variations of the same thing. A tool performs. A resource informs. A prompt frames. The more clearly those roles are kept apart, the easier it becomes to build clients that behave
<!-- p. 26 -->
predictably. A client can retrieve a resource to gather context, request a prompt to structure the next step, and invoke a tool to perform an action. Each move has a different intent, and the protocol reflects that.

It helps to see what a tool declaration might look like. The first example below shows a tool listing where the server exposes a capability for retrieving order status. The structure is clear enough that a client can understand what the tool is for and what input it expects.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "get_order_status",
        "description": "Retrieve the current status for a customer order by order ID.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "orderId": {
              "type": "string",
              "description": "The order identifier."
            }
          },
          "required": ["orderId"]
        }
      }
    ]
  }
}
```

This shows the essential pattern. The client asks what tools exist, and the server replies with a structured list. The tool name is specific. The description explains intent. The input schema defines what the client must send. This is far better than exposing an operation with only an internal method name or relying on undocumented assumptions.

A more robust version extends the same concept by refining how the tool communicates purpose and input expectations. The structure below still exposes one tool, but the contract gives the client better guidance about how to use it correctly.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "get_order_status",
        "description": "Retrieve the current order status and recent shipping events for a single order.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "orderId": {
              "type": "string",
              "description": "The unique order identifier."
            },
            "includeEvents": {
              "type": "boolean",
              "description": "Whether to include the latest shipping events."
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

The practical difference is that the richer version reduces ambiguity. It tells the client more clearly what the tool returns and restricts unexpected input shape. That kind of improvement becomes valuable when many tools exist and the client must choose among them with less risk of misuse.

<!-- p. 27 -->
A resource listing follows a similar protocol pattern but communicates a different kind of surface. In the next example, the server exposes a resource for retrieving a customer profile summary. The client is not asking the server to perform an action. It is asking what contextual information can be read.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/list"
}
```

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resources": [
      {
        "uri": "customer://profile/{customerId}",
        "name": "Customer Profile",
        "description": "Read a customer profile summary by customer ID.",
        "mimeType": "application/json"
      }
    ]
  }
}
```

Here the important detail is that the server is defining a readable context surface with a stable identifier pattern. The client can use this to request a specific customer profile when needed. The resource is not disguised as a tool, and that helps keep the interaction honest.

A more robust version can add stronger hints about structure and purpose while preserving the same core idea.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resources": [
      {
        "uri": "customer://profile/{customerId}",
        "name": "Customer Profile",
        "description": "Read a customer profile summary including contact details, service tier, and account status.",
        "mimeType": "application/json",
        "annotations": {
          "readOnly": true,
          "sensitivity": "internal"
        }
      }
    ]
  }
}
```

The extra metadata does not change the role of the resource. It makes that role easier to govern and easier for the client to interpret responsibly.

Prompt exposure is often less familiar to people coming from standard API design, but it is very useful in practice. A prompt can be listed and later retrieved in a structured way. In the next example, the server exposes a prompt intended to guide case summarization.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "prompts/list"
}
```

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "prompts": [
      {
        "name": "summarize_support_case",
        "description": "Generate a concise summary of a support case for escalation."
      }
    ]
  }
}
```

<!-- p. 28 -->
A client that sees this prompt can retrieve it when needed instead of hard-coding every case summary instruction locally. That becomes more useful when task framing needs to be consistent across several clients or channels.

A more robust prompt model can support parameterized use so the client can request a prompt tailored to the immediate task context.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "prompts/get",
  "params": {
    "name": "summarize_support_case",
    "arguments": {
      "audience": "tier-2-support",
      "tone": "concise"
    }
  }
}
```

JSON

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "description": "Prompt for summarizing a support case for escalation.",
    "messages": [
      {
        "role": "system",
        "content": {
          "type": "text",
          "text": "Summarize the support case for tier-2 support. Focus on the issue, actions already taken, customer impact, and the current blocker. Keep the tone concise and operational."
        }
      }
    ]
  }
}
```

The value of this structure is that prompt logic becomes reusable and controlled. Instead of having five different clients each invent a slightly different escalation summary instruction, the domain owner can expose one governed prompt surface that each client can request.

Good MCP design depends heavily on respecting these distinctions. If a prompt is used to carry hidden business logic that should really be embodied in a tool or policy, the interface becomes fragile. If a resource is overloaded with behavior that should be a tool, the client is misled about what the interaction does. If a tool is used for pure read access where a resource would be clearer, the system loses semantic precision. The protocol gives enough shape to keep these surfaces distinct. The architecture gains stability when that shape is taken seriously.

## 3.3: Transports, Sessions, and Remote MCP Server Communication

A protocol is only as useful as the runtime conditions under which it can be used. That is where transports, sessions, and remote communication come in. MCP defines how clients and servers talk to each other conceptually, but the transport determines how those messages move in practice. This matters because different deployment environments have different needs. A local development tool communicating with an MCP server launched on the same machine has a different runtime profile from an enterprise agent platform calling a remote MCP server across a managed network. The protocol needs to support both predictable local interaction and governed remote communication.

The first thing to understand is that the transport is not the protocol itself. MCP defines message structure, lifecycle expectations, and capability interaction patterns. The transport is the delivery mechanism that carries those messages between client and server. Keeping this distinction clear helps when troubleshooting and when designing architecture. If a capability call fails, the problem may lie in session state, server behavior, or transport conditions. These are related concerns, but they are not the same concern.

For local or tightly coupled environments, process-based communication can be a practical option. A client can start
<!-- p. 29 -->
or connect to a server through a local process boundary and exchange protocol messages over standard input and output. This can be useful in desktop tooling, development workflows, or cases where the server is intended to be launched alongside the client. The advantage is simplicity. The client and server can communicate without introducing network infrastructure. The drawback is that this model is less suitable when capabilities need to be governed centrally, shared across multiple clients, or exposed as managed enterprise services.

Remote MCP communication changes the picture. Here the client connects to a server over a network transport, which introduces familiar distributed-system concerns such as authentication, session establishment, latency, timeouts, authorization, observability, and policy enforcement. This is where MCP becomes especially important for enterprise integration. A remote server can expose reusable capabilities to many clients while sitting behind managed controls. It can be protected by identity systems and gateways. It can be monitored as a networked service rather than treated as a local extension.

Session handling becomes more important in remote scenarios because the connection needs continuity. The client and server are no longer simply exchanging isolated payloads in a single process context. They may need to maintain negotiated understanding, handle credentials, manage idle periods, and recover from interruptions. A good session model helps maintain predictability across the life of the interaction. It also creates a cleaner place to apply operational rules such as expiration, renewal, and audit association.

The concept of a session should be treated carefully. It does not mean the server must carry arbitrary conversational state indefinitely. It means there is a bounded relationship between the client and server within which capabilities have been negotiated and interaction can proceed according to the agreed protocol. In some implementations, this may be lightweight. In others, especially remote managed ones, the session may be tied more explicitly to a token, a negotiated identifier, or an operational window. The important thing is that the session creates continuity and accountability.

Transport choice also affects how well the system can support streaming or incremental behavior. Some MCP interactions are simple request-response exchanges. Others benefit from the ability to send updates, partial results, or notifications in a way that does not require the client to poll inefficiently. A suitable transport can make this much cleaner. This becomes more important as capabilities move beyond simple lookups into richer interactions, larger outputs, or more interactive server behavior.

Authentication and authorization are tightly connected to remote communication. A local process-based setup often inherits trust from the local environment, though it still requires care. A remote server, by contrast, needs a deliberate trust model. The client must present credentials, the server must validate that the client is allowed to connect and use the requested capabilities, and the broader platform must ensure that the tokens and scopes involved are appropriate. This is one reason MCP should not be treated as a simple convenience protocol. When used remotely, it becomes part of the enterprise security architecture.

The session boundary is also where policy and identity context can be applied sensibly. A client may open a session under a service identity, or on behalf of a user, or under a delegated policy context. The server can then enforce capability visibility and invocation rules according to that session context. This is a much stronger model than exposing one global set of tools to any connected party. In real systems, different clients should often see different surfaces or be allowed different operations. Session-aware remote communication makes that possible.

To make the runtime model concrete, it helps to see what remote communication might look like in code. The first example below shows a small Python client that sends an initialization request over HTTP to a remote MCP server. The code is intentionally focused on the protocol exchange rather than on a full production environment.

Python

```python
import requests

server_url = "https://mcp.example.internal"
headers = {
    "Authorization": "Bearer example-token",
    "Content-Type": "application/json"
}

initialize_request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2025-06-18",
        "clientInfo": {
            "name": "order-assistant",
            "version": "1.0.0"
        },
        "capabilities": {
            "tools": {},
            "resources": {},
            "prompts": {}
        }
    }
}

response = requests.post(server_url, headers=headers, json=initialize_request, timeout=10)
response.raise_for_status()

payload = response.json()
print(payload)
```
<!-- p. 30: el bloque anterior empieza al final de la p. 29 y ocupa el panel superior de esta página -->

This example shows the essential remote pattern. The client sends a structured protocol message to the server, includes an authorization token, and expects a structured response. Even in this small form, the interaction is cleaner than wiring a one-off HTTP contract that the client must interpret without a shared capability model.

A more robust version handles session continuity and then uses the negotiated session in a second request to list tools. The logic is still compact, but it reflects a more realistic pattern for ongoing interaction.

Python

```python
import requests

server_url = "https://mcp.example.internal"
base_headers = {
    "Authorization": "Bearer example-token",
    "Content-Type": "application/json"
}

initialize_request = {
    "jsonrpc": "2.0",
    "id": "init-1",
    "method": "initialize",
    "params": {
        "protocolVersion": "2025-06-18",
        "clientInfo": {
            "name": "order-assistant",
            "version": "1.0.0"
        },
        "capabilities": {
            "tools": {},
            "resources": {},
            "prompts": {}
        }
    }
}

init_response = requests.post(server_url, headers=base_headers, json=initialize_request, timeout=10)
init_response.raise_for_status()
init_payload = init_response.json()

session_id = init_payload["result"]["sessionInfo"]["sessionId"]

session_headers = {
    **base_headers,
    "X-Session-Id": session_id
}

tools_request = {
    "jsonrpc": "2.0",
    "id": "tools-1",
    "method": "tools/list"
}

tools_response = requests.post(server_url, headers=session_headers, json=tools_request, timeout=10)
tools_response.raise_for_status()
print(tools_response.json())
```
<!-- p. 31: el bloque anterior empieza en la p. 30 y termina en esta página con "print(tools_response.json())" -->

The key difference is continuity. The client initializes once, receives a session identifier, and then uses it in subsequent requests. That session marker could be handled in different ways depending on the environment, but the principle is the same. Remote communication works better when there is a clear session boundary rather than a loose sequence of disconnected calls.

Remote MCP servers should also be designed with failure in mind. Network calls will fail sometimes. Tokens will expire. Timeouts will happen. Some servers will be temporarily unavailable. A client should not assume that remote communication is as immediate or stable as local process interaction. It needs sensible error handling, retry policy where appropriate, and a clear distinction between recoverable conditions and actual protocol misuse. This is another reason the session model matters. It provides a more structured basis for reconnecting or reestablishing the interaction when disruption occurs.

Session expiration deserves special attention in enterprise environments. A session that lives indefinitely is usually a poor design choice. Remote sessions should have bounded lifetimes tied to operational or security policy. When a session expires, the client should know how to reinitialize cleanly. This reduces the risk of stale context and improves audit clarity. It also creates a cleaner mental model for how remote MCP use fits into broader identity and token management practices.

The transport layer also affects observability. If MCP traffic flows through managed network boundaries, the system can capture logs, metrics, and policy outcomes in a central place. This is much harder with purely local or ad hoc transport patterns. For enterprises, the ability to observe remote MCP usage often makes the difference between a promising capability and an acceptable operational service. It allows teams to know which clients are invoking which tools, where latency is rising, which capabilities are underused, and where failures are concentrated.

The practical takeaway is that remote MCP communication should be treated as a serious integration surface. It is not merely a convenience bridge from a model to a tool. It is a session-based, policy-relevant, observable interaction between a client and an external capability provider. The cleaner the transport and session design, the easier it becomes to secure, monitor, and scale that interaction.

## 3.4: Designing Stable MCP Interfaces for Enterprise Systems

Protocol support alone does not produce a good interface. A server may conform to MCP and still expose a poor set of tools, weak resource boundaries, or prompts that create confusion rather than consistency. Designing stable MCP interfaces requires thinking beyond the protocol mechanics and asking what kind of agent-facing contract will remain clear, governable, and reusable over time. This is especially important in enterprise settings, where capabilities are consumed by multiple clients, owned by multiple teams, and connected to systems that cannot be allowed to behave unpredictably.

A stable MCP interface begins with semantic clarity. The names and descriptions of tools, resources, and prompts should reflect what they do in business or operational terms, not just in implementation terms. If the surface mirrors internal method names or database abstractions too closely, the client gains access to a contract that may technically work but remains awkward to reason about. Agent-facing interfaces should make intent obvious. A capability called `retrieve_customer_invoice_summary` is more stable and useful than one called `fetchBillingDataV2` because the former communicates purpose rather than backend history.

Scope discipline is equally important. Stable interfaces avoid the extremes of being too broad or too fragmented. A tool that tries to handle too many operations behind one name becomes difficult for the client to use safely. A set of tiny tools that differ only slightly creates decision noise and increases the risk of incorrect selection. The goal is to expose capabilities at a level where they correspond to meaningful tasks or information
<!-- p. 32 -->
surfaces. In enterprise systems, that usually means aligning tools with business actions and resources with coherent views of state or context.

Another essential principle is explicit input and output design. Clients behave more reliably when the interface provides clear schemas and predictable output shapes. Enterprise systems often contain messy data and complicated backend behavior. The MCP layer should absorb as much of that complexity as possible rather than leaking it directly into the client contract. If the backend uses inconsistent field names or internal status codes, the MCP surface should normalize them. If a workflow can fail in several ways, the interface should make those outcomes structured enough for the client to handle sensibly. Stability comes in part from reducing surprise.

Read and write concerns should also remain distinct whenever possible. A resource surface that supports contextual retrieval should not be overloaded with hidden side effects. A tool that performs an action should communicate that action clearly and not pretend to be a simple lookup. This distinction helps both governance and client reasoning. It makes it easier to apply read access and action access policies differently. It also reduces the chance that an agent will choose an operation without understanding its consequences.

Versioning needs careful treatment as well. A stable interface does not mean one that never changes. It means one that changes deliberately. When capabilities evolve, the goal should be to preserve compatibility where possible and make disruptive changes explicit where necessary. Renaming tools casually, changing parameter meaning silently, or altering output shapes without a clear migration path will quickly erode trust in the interface. Enterprise platforms depend on clients that may not update at the same pace as the servers they consume. MCP interface design should therefore favor additive change over breaking change whenever practical.

Good prompt design is part of interface stability too. Prompts exposed through MCP should be treated as reusable task assets, not as places to hide volatile operational rules. If a prompt needs to be maintained over time, it should have a stable purpose and a clear intended use. Domain-specific wording can evolve, but the role of the prompt should remain understandable. A case-escalation summary prompt should continue to represent that task over time rather than drifting into a general-purpose instruction block with multiple unrelated uses. Stability depends on preserving the meaning of the asset, not merely its existence.

Ownership clarity is another factor that strongly affects stability. Every major MCP surface should have a clear owner who understands both the backend system and the client-facing contract. Without ownership, interfaces drift. Descriptions become outdated, prompts lose relevance, and tool sets accumulate duplication. In enterprise environments, the most stable interfaces are usually the ones whose owners treat them as products rather than as incidental wrappers. That means they care about naming, consistency, documentation quality, change control, and operational feedback.

Operational feedback itself should influence interface design. Stable surfaces are rarely perfect on the first attempt. They improve when teams can observe how clients actually use them. If a tool is frequently invoked with incorrect parameters, that may indicate the contract is too ambiguous. If two tools are routinely confused, their naming or scope may need refinement. If a resource is used as a proxy for an action decision in ways the designers did not expect, the interface may need another surface to support that use case more cleanly. Stability is not only a design-time property. It is also an operational outcome shaped by real usage.

Security and governance considerations should be reflected in the interface from the beginning rather than layered on as an afterthought. A stable MCP surface should expose only capabilities that are appropriate for the intended class of client. It should make sensitivity understandable enough that policy systems can act on it. It should avoid broad, unrestricted operations that are easy to publish but hard to control. Stability and safety are connected. An interface that is difficult to govern will eventually be restricted, bypassed, or replaced, which makes it unstable in practice even if the protocol methods remain unchanged.

The strongest enterprise MCP interfaces are usually those that act as a deliberate translation layer between messy backend complexity and agent-facing clarity. They do not expose every backend feature. They expose the right features in the right form. They use tool surfaces for actions with meaningful scope, resource surfaces for read context with clear identity and sensitivity boundaries, and prompt surfaces for reusable task framing that belongs near the domain. They evolve carefully, normalize backend inconsistency, and preserve semantic meaning across versions. That is what makes them dependable. Not merely that they speak the protocol, but that they speak it with design discipline.

When that discipline is present, MCP becomes more than a technical standard. It becomes a practical method for presenting enterprise capabilities to agents and AI-enabled clients in a way that reduces custom integration effort without sacrificing control. The interface stops being a temporary adapter and becomes a stable product surface that can be reused across workflows, clients, and teams. That is the level of maturity needed for agentic integration to work reliably in real systems.
