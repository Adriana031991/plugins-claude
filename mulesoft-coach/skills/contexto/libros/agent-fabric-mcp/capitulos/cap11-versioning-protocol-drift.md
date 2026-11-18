---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 11
titulo: "Versioning, Compatibility, and Protocol Drift"
paginas_pdf: "115-126"
temas: [agent-fabric]
transcrito: 2026-11-16
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. En Python la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas. Las descripciones partidas por el ancho de columna se unieron.
- Cuando un bloque de código cruza de panel o de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza al principio de la p. 115 y termina en el panel superior de la p. 126. El capítulo 12 empieza debajo, en la misma página. La p. 116 tiene solo el panel superior; el resto de la página está vacío.
-->

# Chapter 11: Versioning, Compatibility, and Protocol Drift

<!-- p. 115 -->
One of the easiest ways to write weak technical guidance about agentic integration is to talk as though protocols and platforms arrive fully formed, stabilize quickly, and then remain unchanged long enough for every implementation to catch up at the same pace. That is not how this space behaves. Standards evolve, reference implementations change, product teams interpret features differently, and connector support often lags behind the latest specification. This does not make the ecosystem unusable, but it does mean versioning and compatibility have to be treated as first-class architecture concerns. If they are ignored, a system can look standards-based on paper while being fragile in production.

This is especially true in a stack that combines MuleSoft Agent Fabric, MCP, and A2A. Each layer has its own rhythm of change. MCP may add or refine capabilities, transports, or lifecycle expectations. A2A may evolve its task semantics, discovery details, or security expectations. MuleSoft connectors and runtime controls may support only a subset of the newest protocol features or may package those features in a product-specific way that does not line up perfectly with the latest standards documents. A team that assumes these layers will always move together will eventually get surprised. The better approach is to design with drift in mind from the beginning.

Versioning problems in this space are rarely dramatic at first. The system does not usually fail because one side announces an obviously incompatible protocol string and the other refuses to continue. More often, the trouble begins with partial mismatch. A client assumes a transport behavior or capability shape that the server does not fully support. A connector advertises protocol support, but only for an earlier version or a narrowed feature subset. An A2A specialist returns a structure that is technically valid for one interpretation of the contract, while the caller expects a slightly newer one. These cases are dangerous because they can produce systems that appear to work most of the time while quietly accumulating brittle edges.

This chapter addresses that problem directly. The first section explains why protocol support and protocol parity are not the same thing. This distinction matters because many teams hear that a platform supports MCP or A2A and assume that means complete alignment with the current state of the standard. In practice, support often means something more limited and more nuanced. The second section focuses on MCP and explains how to manage version changes without breaking clients, because MCP is a fast-moving capability surface and the clients consuming it may not all upgrade together. The third section turns to A2A and examines how to handle protocol evolution, connector gaps, and contract mismatch when specialist agents and platform components sit at different points in the protocol lifecycle. The fourth section expands the view and explains how to design upgrade paths in a moving standards landscape so the architecture can absorb change without turning every upgrade into a risky migration project.

The most useful mental model for the whole discussion is this. Protocol drift is not a temporary inconvenience. It is a normal condition of working with emerging but increasingly important standards. The goal is not to eliminate drift by hoping everyone upgrades in lockstep. The goal is to build systems that can recognize, absorb, and govern that drift intelligently. When that happens, the architecture remains stable even while the standards continue to mature. That is what distinguishes a serious integration design from one that only works while nothing changes.

## 11.1: Why Protocol Support and Protocol Parity Are Not the Same Thing

When a vendor, platform, or connector says it supports a protocol, that statement sounds reassuring. It suggests interoperability, portability, and reduced integration effort. In many cases, that reassurance is partly justified. Support is real and useful. The problem begins when support is mistaken for parity. Support means the platform can participate
<!-- p. 116 -->
meaningfully in the protocol. Parity means the platform aligns fully, or nearly fully, with the current protocol specification and expected feature behavior. Those are not the same claim, and the difference matters a great deal in agentic integration.

Support is usually bounded. A connector may implement a specific protocol version, a subset of operations, one or two transport modes, or a particular interpretation of optional features. That can still be enough for many workflows. In fact, most production systems rarely need every possible feature at once. The mistake is assuming that support implies complete current-spec equivalence across all relevant behaviors. In a fast-moving standards environment, that assumption is often false. Product teams need time to catch up, and enterprise platforms often move more deliberately than reference implementations because they also have to account for security, runtime behavior, documentation, and governance features.

Parity is a stronger and narrower idea. It means that what the platform exposes or consumes lines up closely with the full current expectations of the relevant standard, including operation names, lifecycle details, transport behavior, payload structure, error semantics, and other relevant protocol features. Parity is hard to maintain when standards are evolving and when products need to support existing customers who may already be using earlier interpretations or version baselines. This is one reason parity should never be assumed. It has to be verified in concrete operational terms.

This distinction matters because architecture decisions built on the wrong assumption become brittle very quickly. A team may select a connector because it supports A2A, then later discover that the version or subset implemented by the connector does not include a feature the intended workflow depends on. Another team may expose an MCP server and assume that a client platform will interpret its full surface exactly as documented in the latest version of the spec, only to find that the client only negotiates or consumes an earlier subset of behaviors. In both cases, the words "supports the protocol" were technically true, but the operational assumptions built on them were too broad.

<!-- p. 117 -->
One of the clearest examples of this distinction appears in lifecycle and feature negotiation. A platform might support MCP well enough to expose tools and resources and to handle a standard initialization flow. That is meaningful support. But the same platform may not support every newer protocol feature, every transport refinement, or every emerging interaction extension. If a team builds as though all of those features are present because the platform supports MCP, the resulting design will likely be too optimistic. The right approach is to ask which parts of MCP are actually supported in the target environment and which version assumptions the platform is making.

The same issue appears in A2A. A platform may support A2A discovery and task exchange according to one version or one phase of the specification. That can still enable valuable multi-agent workflows. But if the official project later expands or refines parts of the contract, a connector that has not yet caught up can still truthfully claim A2A support while no longer having parity with the newest state of the standard. This matters when teams build workflows around newer semantics or trust assumptions that the connector cannot yet represent fully. The gap is not merely academic. It can affect discovery behavior, task structure, security posture, and how easy it is to interoperate with other A2A participants.

The practical consequence is that protocol planning must be more precise than marketing language. Teams need to understand which version baseline a connector or platform implements, which operations and semantics are present, whether any features are optional or partial, and whether the platform adds any product-specific constraints that are not obvious from the protocol alone. This is not cynicism. It is ordinary engineering discipline in a standards-driven ecosystem. Mature teams already do this with APIs, database drivers, and identity systems. Agent protocols deserve the same seriousness.

Another reason support and parity differ is that platforms often optimize for enterprise stability rather than fastest possible spec adoption. This is not automatically a weakness. In fact, it can be a strength, because enterprise deployments value predictable behavior and governed rollout. But it does mean the architecture has to account for a product possibly supporting a meaningful subset of a protocol well rather than every latest-spec detail immediately. A team that understands this can still design excellent systems. A team that ignores it may overbuild against features the runtime cannot yet express.

It is also useful to recognize that support can be asymmetric. A platform may consume a protocol more completely than it emits it, or vice versa. For example, it might accept a broader range of incoming requests than it generates in its own outbound traffic. Or it may publish discovery metadata in one style but consume remote metadata more narrowly. These asymmetries are easy to miss if teams think only in yes-or-no protocol terms. Good architecture asks where the platform acts as client, where it acts as server, and whether support looks the same in both directions. Often it does not.

Contract shape is another place where support can differ from parity. A system may accept the right high-level operation names, but differ subtly in field expectations, response formatting, optional metadata, or error signaling. None of these differences may be severe enough to invalidate the support claim, but together they can still create friction or breakage at integration boundaries. This is especially true when one side relies on richer features or newer optional fields and the other side silently ignores or misinterprets them. Partial compatibility often feels worse than obvious incompatibility because it encourages false confidence.

A healthy architecture therefore treats protocol support as the start of analysis, not the end of it. Support tells you that the platform is in the right family. It does not yet tell you whether the specific workflow you want to build will work without adaptation. Parity is the deeper question, and in many cases the answer will be "partial" rather than "full." That is fine, provided the design reflects it. Many successful systems operate on partial parity by using stable common-denominator features, translation layers, policy controls, and careful contract management. Problems arise only when teams assume parity they do not actually have.

<!-- p. 118 -->
This distinction also affects risk management. If a workflow depends on a narrow stable subset of MCP features and uses carefully governed A2A task contracts, partial parity may be acceptable and even practical. If the workflow depends on edge features, rapid cross-vendor interoperability, or newer task and security semantics, then parity gaps become much more consequential. Architecture has to weigh these realities honestly. Not every use case needs latest-spec completeness. Some do. The design should know which category it falls into rather than assuming every protocol-labeled component will behave identically.

Operational monitoring can help here as well. One of the strongest signs that support and parity have been confused is that the system begins failing in small but repeated ways at boundaries that should have been easy. Negotiation succeeds, but certain calls behave strangely. Tasks complete, but artifacts arrive in a shape that downstream handlers dislike. Discovery works, but route choices based on discovered metadata are inconsistent. These are exactly the kinds of signals that indicate partial support interacting badly with parity assumptions. Good observability can surface that pattern early enough for teams to adjust.

In practical terms, the safest attitude is to treat protocol support as a capability claim and protocol parity as a compatibility question that must be examined directly. A platform that supports MCP or A2A may still be an excellent choice. The point is simply that support should not be overread. The architecture should identify the version baseline, the feature subset, the role-specific behaviors, and the likely drift points. Once those are clear, the system can be designed around what is truly available instead of what was implied by a broad support statement. That is how teams avoid false confidence and build workflows that remain stable even while the standards continue to move.

## 11.2: Managing MCP Version Changes Without Breaking Clients

MCP version changes do not have to be catastrophic to be disruptive. Most of the time, the damage comes from small shifts in expectations rather than complete incompatibility. A client may assume a capability is present because it was added or clarified in a newer version. A server may expose metadata or structure that older clients do not interpret correctly. Transport behavior may change enough to affect connection handling or runtime assumptions. These are the kinds of differences that often break clients quietly rather than dramatically. The answer is not to freeze everything indefinitely. The answer is to manage MCP evolution in a way that lets the server move forward without forcing every client to break at once.

The first rule is to treat version negotiation as a real operating mechanism rather than as a decorative handshake. If the client and server can identify their MCP version expectations early, the server gains a chance to shape its behavior for compatibility instead of hoping that the client will simply tolerate whatever it gets. This is one of the strongest reasons lifecycle discipline matters. A version string is not enough by itself, but it creates the starting point for compatibility logic and diagnostic clarity. Without explicit negotiation, every mismatch has to be discovered indirectly through broken behavior later in the workflow.

The next rule is to prefer additive change over breaking change wherever possible. If a server needs to introduce richer metadata, new optional capability details, or expanded response structure, it is usually safer to do so in a way that older clients can ignore rather than in a way that forces them to reinterpret an existing field or required contract. Additive change is not always sufficient, but it greatly reduces the risk of sudden breakage. The more a server can preserve old meanings while adding new information, the easier it becomes for mixed-version clients to coexist.

A compatibility layer is often the practical answer when additive change alone is not enough. The server can examine the negotiated version and emit slightly different response structures or capability listings for different clients. This should not become an excuse to maintain endless variants forever, but it is a sensible strategy during transition periods. A well-
<!-- p. 119 -->
designed compatibility layer can let the platform move toward a newer MCP representation while preserving support for older clients that still depend on earlier assumptions. The key is to keep the differences explicit and governed rather than hidden in ad hoc code paths.

The following Python example shows a small initialization handler that negotiates an MCP version and stores the agreed value for later use. The point is not full protocol completeness. The point is to illustrate how the server can make later compatibility decisions based on what the client actually negotiated.

Python

```python
SUPPORTED_VERSIONS = {"2025-03-26", "2025-06-18"}

def initialize_session(client_version: str) -> dict:
    if client_version not in SUPPORTED_VERSIONS:
        raise ValueError("Unsupported MCP version")

    return {
        "protocolVersion": client_version,
        "sessionId": "sess-001"
    }
```

This is the simplest correct version. The server does not guess. It makes the version explicit and rejects versions it cannot handle. Even this level of discipline is better than loosely assuming the client and server are aligned.

A more robust version allows negotiation to the closest supported version from a preferred client value, which is often more practical during real transitions.

Python

```python
SUPPORTED_VERSIONS = ["2025-03-26", "2025-06-18"]

def negotiate_version(client_version: str) -> str:
    if client_version in SUPPORTED_VERSIONS:
        return client_version

    if client_version > SUPPORTED_VERSIONS[-1]:
        return SUPPORTED_VERSIONS[-1]

    raise ValueError("Unsupported MCP version")

def initialize_session(client_version: str) -> dict:
    negotiated_version = negotiate_version(client_version)

    return {
        "protocolVersion": negotiated_version,
        "sessionId": "sess-001"
    }
```

The stronger version acknowledges a real operational truth. Clients and servers may not move in lockstep. If the client asks for something newer than the server can provide, the server can still negotiate down to the newest version it does support rather than failing needlessly, as long as the client is willing to accept that result. That creates a much smoother upgrade path.

Once negotiation is in place, the server can use version-aware response shaping. For example, a capability listing can remain minimal for older clients while including richer annotations for newer ones. The following Python example shows a server that returns a slightly different tool structure based on the negotiated MCP version.

Python

```python
def list_tools(protocol_version: str) -> dict:
    if protocol_version == "2025-03-26":
        return {
            "tools": [
                {
                    "name": "get_order_details",
                    "description": "Retrieve order details.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "orderId": {"type": "string"}
                        },
                        "required": ["orderId"]
                    }
                }
            ]
        }

    return {
        "tools": [
            {
                "name": "get_order_details",
                "description": "Retrieve current order details for support workflows.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "orderId": {"type": "string"},
                        "includeEvents": {"type": "boolean"}
                    },
                    "required": ["orderId"],
                    "additionalProperties": false
                },
                "annotations": {
                    "readOnly": true
                }
            }
        ]
    }
```
<!-- p. 120: el bloque anterior empieza en la p. 119 y termina en esta página desde "\"description\": \"Retrieve current order details for support workflows.\"," -->

This is a useful compatibility pattern. The core tool remains the same, but the richer server-side view is exposed only when the negotiated version indicates the client can reasonably consume it. Older clients are not forced to parse fields they may not understand.

A more robust version centralizes the compatibility logic so the server does not scatter version checks across many code paths. This helps keep drift management maintainable as the protocol continues to evolve.

Python

```python
def tool_shape_for_version(protocol_version: str) -> dict:
    base_tool = {
        "name": "get_order_details",
        "description": "Retrieve order details.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "orderId": {"type": "string"}
            },
            "required": ["orderId"]
        }
    }

    if protocol_version == "2025-03-26":
        return base_tool

    upgraded_tool = dict(base_tool)
    upgraded_tool["description"] = "Retrieve current order details for support workflows."
    upgraded_tool["inputSchema"] = {
        "type": "object",
        "properties": {
            "orderId": {"type": "string"},
            "includeEvents": {"type": "boolean"}
        },
        "required": ["orderId"],
        "additionalProperties": False
    }
    upgraded_tool["annotations"] = {
        "readOnly": True
    }
    return upgraded_tool

def list_tools(protocol_version: str) -> dict:
    return {
        "tools": [
            tool_shape_for_version(protocol_version)
        ]
    }
```

The advantage of the stronger version is that it treats version-aware shape control as a deliberate compatibility layer rather than a scattered set of exceptions. This makes future MCP changes easier to manage because the server has a clear place where protocol drift is translated into contract decisions.

Transport and session behavior should be handled with similar care. If a newer MCP version changes how a remote session is established or how streaming behavior is expected, the server should not simply flip that behavior globally if it still has older clients in use. A transition period may require dual support or route-based version segregation so that older clients continue using the older assumptions while newer ones adopt the new behavior. This is less elegant than a clean immediate switch, but it is much more realistic in production environments where clients do not all upgrade on the same day.

Testing becomes critical here. MCP version changes should be exercised against client matrices, not just against one reference path. It is not enough to test that the new server behavior works with the newest client implementation. The platform also needs to confirm that older still-supported clients can negotiate,
<!-- p. 121 -->
retrieve capabilities, and use the portions of the contract they rely on. This is especially important for brokers and reusable MCP consumers because their breakage affects many workflows at once. A compatibility layer is only as good as the tests that verify it under realistic mixed-version conditions.

Deprecation policy also matters. If the server will eventually stop supporting an older MCP version, the platform should say so clearly and structure the transition. That means identifying which clients still negotiate the older version, observing their traffic, and giving teams a real path to update. Deprecation without visibility often leads to surprise outages. Visibility without actual retirement leads to endless support burdens. The healthy approach is to manage the lifecycle deliberately: know what is still in use, know why it is still in use, and know when it will be retired.

There is also a product design benefit to this discipline. When MCP version changes are handled through negotiation, compatibility shaping, and deliberate deprecation, the server becomes easier to evolve because new features can be introduced without forcing immediate all-at-once change. That encourages better standards adoption. Teams do not need to choose between freezing indefinitely and breaking everyone. They can move forward while still governing the transition. This is one of the most important operational habits in a moving protocol ecosystem.

The broader lesson is that MCP versioning should be treated as contract management, not just protocol labeling. Clients depend on the visible capability surface, the structure of that surface, and the lifecycle behaviors around it. A server that changes those things needs a strategy for keeping old clients alive long enough to move them safely. Negotiation, additive change, version-aware shaping, strong testing, and disciplined deprecation together provide that strategy. When they are in place, MCP evolution becomes manageable instead of disruptive. That is exactly what a platform needs if it intends to support agentic workflows over time rather than only during a short and stable window.

## 11.3: Handling A2A Evolution, Connector Gaps, and Contract Mismatch

A2A introduces a different kind of compatibility pressure from MCP because it governs agent-to-agent delegation rather than only direct capability access. The moving parts are therefore not just tool surfaces and resource contracts. They include discovery structures, task semantics, artifact expectations, and trust-related interaction patterns between agents. When A2A evolves, these changes can affect not just one component's behavior, but the relationship between multiple participants in a workflow. That makes connector gaps and contract mismatch especially important to manage.

One of the first realities to accept is that A2A evolution will often appear in the contract before it appears in the product connector landscape. A formal spec can introduce clarified task semantics, different discovery fields, refined artifact handling, or stronger security expectations. A connector supporting A2A may take longer to absorb those changes. During that gap, both sides can still honestly say they are using A2A, but the practical interoperability picture becomes more complicated. This is exactly where teams get into trouble if they assume support automatically implies current-spec parity.

Connector gaps become visible in several ways. A platform may support one version of the agent card format while a newly built remote specialist exposes a richer or slightly changed form. A task lifecycle field may differ in name or meaning from what the caller expects. Artifact structures may remain compatible in spirit but not in exact shape. Authentication and task-notification patterns may evolve at different speeds across products. None of these differences has to destroy interoperability immediately. They do, however, require a conscious strategy rather than hopeful assumptions.

A good strategy begins with contract normalization at the boundary. If the platform or connector consumes one A2A shape but the remote ecosystem is moving toward another, a translation layer can absorb the difference. This is often a better option than pushing the mismatch directly into broker
<!-- p. 122 -->
logic or specialist implementations. The broker should not need to understand three variants of the same task contract if the gateway or adapter layer can normalize them into one internal model. The same applies to discovery. Agent cards coming from different compatibility horizons can often be rewritten or reduced into a stable internal form that the routing and governance layers already understand.

The first example below shows a simple Python function that normalizes a remote agent card into the internal shape expected by a broker. The remote card may contain fields that vary between connector versions, but the broker should receive one stable structure.

Python

```python
def normalize_agent_card(remote_card: dict) -> dict:
    return {
        "name": remote_card.get("name"),
        "description": remote_card.get("description"),
        "url": remote_card.get("url"),
        "skills": remote_card.get("skills", [])
    }
```

This is the simplest correct normalization layer. It creates a consistent internal view from a potentially richer or messier external card. Even this small adapter reduces the chance that broker logic becomes dependent on remote version quirks.

A more robust version handles alternate field names and default capability assumptions so that the internal routing model stays stable even when remote cards evolve unevenly.

Python

```python
def normalize_agent_card(remote_card: dict) -> dict:
    capabilities = remote_card.get("capabilities", {})
    skills = remote_card.get("skills", remote_card.get("abilities", []))

    return {
        "name": remote_card.get("name"),
        "description": remote_card.get("description", ""),
        "url": remote_card.get("url"),
        "skills": skills,
        "supportsTasks": capabilities.get("tasks", False),
        "supportsArtifacts": capabilities.get("artifacts", False)
    }
```

The stronger version is much more useful for a platform living through connector gaps. It accounts for variation while preserving one internal contract for the broker and governance layers.

Task semantics deserve the same treatment. If a newer A2A participant expresses task state or artifact details differently from what a connector currently expects, the system can often normalize those results before handing them to the rest of the workflow. That is usually preferable to letting contract mismatch propagate downstream. A caller should consume a known internal task model, even if the external side needed translation to fit it.

The next Python example shows a small task normalization function that converts a remote task result into a stable internal shape.

Python

```python
def normalize_task_result(remote_result: dict) -> dict:
    task = remote_result.get("task", {})

    return {
        "id": task.get("id"),
        "state": task.get("state"),
        "artifacts": task.get("artifacts", [])
    }
```

This is the simplest correct version. It assumes the remote side at least provides the expected top-level task object, and it reduces the result to the fields the internal workflow needs most.

A more robust version handles state aliases and alternate artifact field placement so that downstream orchestration is protected from version-specific details.

Python

```python
def normalize_task_result(remote_result: dict) -> dict:
    task = remote_result.get("task", remote_result.get("result", {}))

    raw_state = task.get("state", task.get("status", "unknown"))
    state_map = {
        "done": "completed",
        "complete": "completed",
        "in_progress": "in_progress",
        "running": "in_progress",
        "failed": "failed"
    }

    normalized_state = state_map.get(raw_state, raw_state)
    artifacts = task.get("artifacts", task.get("outputs", []))

    return {
        "id": task.get("id"),
        "state": normalized_state,
        "artifacts": artifacts
    }
```
<!-- p. 123: el bloque anterior empieza en la p. 122 y termina en esta página desde "\"failed\": \"failed\"" -->

The value of the stronger version is that it prevents small differences in external task vocabulary from forcing every internal consumer to carry compatibility logic. That is exactly the sort of burden an adapter layer should absorb.

Connector gaps often affect security expectations as well. A newer A2A participant might expect discovery metadata or request flows that reflect stronger trust or signature semantics than an older connector fully represents. In those cases, the safest approach is usually not to fake parity. It is to constrain the interoperability surface to what can be governed honestly. That may mean accepting only a reduced portion of the discovery metadata, limiting certain task types until the connector catches up, or applying stricter gateway mediation so that newer external assumptions are not allowed to create weaker internal behavior. In compatibility work, honesty is more valuable than pretending a feature is fully supported when it is only partially approximated.

Contract mismatch becomes especially dangerous when it is invisible. If a specialist appears to accept tasks successfully but the returned artifacts do not align with what the caller really needs, workflows may break only at the final action step. If the agent card is parsed partially and some relevant skill metadata is ignored, routing may seem fine until one request class begins reaching the wrong specialist repeatedly. The safer pattern is to validate external A2A contracts actively and fail clearly when they fall outside the supported compatibility envelope. Silent tolerance is often worse than rejection because it creates false confidence in the path.

The following JSON example shows a simple normalized internal task object that a broker or workflow engine might depend on regardless of the remote connector version.

JSON

```json
{
  "id": "review-1001",
  "state": "completed",
  "artifacts": [
    {
      "name": "review-decision",
      "parts": [
        {
          "type": "data",
          "data": {
            "decision": "approve-refund"
          }
        }
      ]
    }
  ]
}
```

This is the simplest correct internal representation. It is intentionally stable and limited. The system should prefer to translate remote variance into this sort of internal model rather than allowing every remote version quirk into workflow logic directly.

A more robust internal representation can include compatibility metadata so operators and developers can tell which external version or adapter path shaped the result. This is often very useful during transition periods.

JSON

```json
{
  "id": "review-1001",
  "state": "completed",
  "artifacts": [
    {
      "name": "review-decision",
      "parts": [
        {
          "type": "data",
          "data": {
            "decision": "approve-refund",
            "reasonCode": "duplicate-settlement"
          }
        }
      ]
    }
  ],
  "compatibility": {
    "normalizedFrom": "remote-a2a-vendor-shape",
    "adapterVersion": "1.1.0"
  }
}
```
<!-- p. 124: el bloque anterior empieza en la p. 123 y termina en esta página desde "\"decision\": \"approve-refund\"," -->

The compatibility block is not always necessary in final business logic, but it is extremely helpful operationally. It tells teams how the internal result was derived and makes troubleshooting much easier if a remote connector or external participant changes behavior unexpectedly.

Another healthy practice is to keep A2A contract tests between major participants. If a broker depends on a billing specialist through A2A, the relationship should be exercised through explicit compatibility tests, not only through end-to-end application tests. Those tests should validate discovery parsing, task creation, task state interpretation, and artifact consumption. This is especially important when connector versions differ or when one side upgrades before the other. Compatibility tests provide evidence that the contract still holds at the actual integration boundary.

Teams should also resist the urge to let fallback logic mask every mismatch. Some tolerance is useful, especially for non-breaking metadata differences or state aliases. But when a mismatch changes the meaning of the task, the allowed task kinds, or the structure of the artifact in a way that could affect business decisions, the system should prefer explicit failure and alerting over quiet adaptation. Otherwise the platform may appear stable while actually processing work under uncertain semantics. In business workflows, that is rarely an acceptable tradeoff.

The broader principle is that A2A evolution should be managed with adapters, validation, and explicit compatibility envelopes rather than with optimism. Connectors will lag sometimes. External specialists will not all evolve at the same speed. Product-supported A2A may sit at one version horizon while the official standard keeps moving. The architecture can still succeed under those conditions, but only if it treats contract mismatch as a normal engineering problem that deserves real design. Normalize discovery, normalize tasks, validate artifacts, test boundaries, and constrain unsupported features honestly. When that is done well, A2A drift becomes manageable instead of destabilizing.

## 11.4: Designing for Upgrade Paths in a Moving Standards Landscape

The final compatibility challenge is broader than MCP or A2A alone. It is how to design an agentic integration system so that standards, connectors, clients, and managed runtime controls can all evolve without forcing repeated full rewrites or risky big-bang migrations. This is what upgrade-path design is really about. It is not just about surviving the next version bump. It is about giving the architecture enough resilience that change becomes routine rather than existential.

The first principle is to keep contracts at the edge and stable models in the middle. External protocols and platform connectors will move. That is inevitable. If the entire internal workflow logic depends directly on the precise version-specific shape of those protocols, every change at the edge becomes an internal redesign problem. A stronger pattern is to translate external variation into stable internal models wherever possible. That includes stable task models, stable tool and resource abstractions, stable workflow states, and stable route-selection inputs. The external side can evolve, but the internal core remains calmer because the adaptation layer absorbs part of the drift.

This principle is closely related to the idea of anti-corruption layers in other forms of integration. The system should not let every external protocol nuance leak all the way through the network. It should instead absorb and normalize those nuances at the boundary so the internal orchestration, governance, and observability layers are not forced to chase every change in real
<!-- p. 125 -->
time. This does not eliminate the need to update the system, but it narrows the blast radius of those updates. That is exactly what a strong upgrade path is supposed to do.

The second principle is to keep workflow logic separate from connector logic. Teams get into trouble when brokers and orchestrators begin to carry direct assumptions about connector versions, optional protocol fields, or transport quirks. That makes upgrades much harder because changing the connector now means changing the workflow engine itself. A better approach is to keep the connector and adaptation concerns in a lower layer and let orchestration consume only the normalized contracts produced there. The workflow should ask for a billing review task, not care about which precise version of the A2A connector translated that request on the wire.

The third principle is to prefer compatibility windows over abrupt cutovers whenever there is significant reuse. A platform with one internal client can sometimes afford a synchronized change. A reusable agent network usually cannot. Different brokers, agents, and client applications may update on different schedules. A safe upgrade path therefore often requires supporting old and new versions simultaneously for a period, with explicit negotiation or route-based separation where necessary. This can feel less elegant than an all-at-once upgrade, but it is usually much safer in environments where several teams and production workflows depend on the same assets.

The fourth principle is to let observability guide upgrades. Upgrade planning should be based on real usage, not only on documentation or assumptions. If the platform can see which MCP versions are actually negotiated, which A2A specialists still use older task semantics, which clients call through legacy routes, and which artifacts still arrive in older shapes, the team can design an upgrade path grounded in evidence. Without that evidence, upgrades tend to rely on guesswork and create surprise breakage. A moving standards landscape rewards teams that can observe where the real dependency edges still lie.

Another essential habit is to treat metadata and publication as upgrade tools, not just discovery features. Version labels, ownership information, compatibility notes, and asset classifications are all useful during upgrades. They make it easier to know which assets are candidates for migration, which ones are still depended on by older workflows, and who needs to act when a deprecation or compatibility window is announced. If the exchange is weakly maintained, upgrades become much more social and much less technical. Teams spend time rediscovering who owns what instead of focusing on the actual compatibility work.

The architecture should also distinguish between standards upgrades and product upgrades. These are related, but they are not identical. A newer official MCP or A2A specification does not automatically mean the managed platform, gateway policies, or connectors in use are ready to adopt every part of it. Conversely, a product upgrade may change support boundaries or behavior even when the standards version the platform claims has not changed dramatically. A good upgrade path accounts for both. It asks what the standards are doing and what the current product layer actually supports. If those timelines do not match perfectly, the design should make room for the gap rather than treating it as an anomaly.

Another useful pattern is staged rollout by path or asset class. Not every workflow needs to move to a new protocol behavior at once. A platform can often upgrade one MCP server, one specialist agent class, or one broker route first, observe the effect, and then expand. This reduces risk because it turns the upgrade into a controlled experiment rather than a network-wide event. It also helps teams gather real compatibility evidence. A staged rollout can reveal which assumptions were hidden in the older path and which parts of the system are truly ready for the newer behavior.

This is also why strong contract tests and replayable workflow tests matter so much. A moving standards landscape rewards teams that can verify not only that the new version works in isolation, but that real existing workflows still behave acceptably under the new layer. Replay tests, simulated route selection, artifact-consumption tests, and version negotiation tests all contribute to this. They provide confidence that the
<!-- p. 126 -->
upgrade path is not just theoretically sound but operationally grounded. Without them, even well-meaning upgrade plans often rely too heavily on optimistic interpretation of compatibility.

One of the most important design choices is to avoid overcommitting to transient conveniences in the first place. If a feature is brand new, optional, or weakly supported across the platforms involved, the architecture should be cautious about making it central to every critical workflow immediately. This is not fear of innovation. It is sensible sequencing. Mature systems often adopt newer standards features first in bounded, lower-risk flows where the platform can gain experience without making the whole network dependent on a moving target. Once support matures and parity improves, those features can move into more central roles.

At the same time, avoiding overcommitment should not become an excuse for indefinite stagnation. The point of good upgrade-path design is not to remain forever on the oldest stable subset. It is to create a path where the system can evolve deliberately. Standards matter because they reduce bespoke glue and improve interoperability. If the architecture is built only around avoiding change, it will eventually fall behind and create a different kind of lock-in. The better balance is to adopt steadily, but with translation layers, observability, and compatibility windows strong enough to protect the workflows that already depend on the system.

Another useful habit is to document upgrade assumptions as part of architecture, not only as release notes. If a broker assumes that all A2A specialists in a certain domain return one normalized artifact shape, that should be stated clearly. If a group of MCP clients relies on a compatibility layer for a particular version window, that should be visible in platform documentation and runtime ownership notes. These records make future upgrades much easier because teams can see not just what the system is running, but what compatibility promises it is actively relying on. Invisible assumptions are where upgrades most often become painful.

The overall objective is not to predict every future standard change. That is impossible. The objective is to create an architecture that responds well when change arrives. Stable internal models, boundary normalization, separated connector logic, compatibility windows, evidence-based rollout, strong contract testing, and clear metadata together produce that resilience. They allow a platform to keep moving while avoiding the false choice between reckless adoption and permanent freeze.

In a moving standards landscape, this is what professionalism looks like. The system does not panic every time a protocol evolves, and it does not pretend that every product claim implies immediate full parity. It evaluates real support, isolates drift, uses compatibility layers where needed, and upgrades through controlled paths rather than through wishful thinking. That is how agentic integration remains sustainable. Standards will continue to move. The architecture's job is to move with them without letting the workflows underneath collapse.
