---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 9
titulo: "Governing Runtime Behavior with Flex Gateway"
paginas_pdf: "92-103"
temas: [agent-fabric]
transcrito: 2026-11-15
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. En Sentinel, YAML, JSON y Python la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas. Las líneas partidas por el ancho de columna se unieron.
- Cuando un bloque de código cruza de panel o de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza al principio de la p. 92 y termina en el panel superior de la p. 103. El capítulo 10 empieza debajo, en la misma página.
-->

# Chapter 9: Governing Runtime Behavior with Flex Gateway

<!-- p. 92 -->
Agentic systems do not become governable simply because their assets are registered and their workflows are modeled. Governance has to remain present at runtime, where requests are actually entering the network, leaving the network, invoking tools, delegating tasks, retrieving resources, and carrying identity across boundaries. This is the point at which policy stops being abstract and becomes operational. A runtime control plane has to decide whether an incoming request is trusted, whether a given agent should see a given MCP tool, whether a delegated A2A call should be allowed to proceed, whether sensitive data should be rewritten or masked, and whether the whole interaction should be visible enough to support audit and troubleshooting later. Flex Gateway matters in this context because it provides a place to make those decisions consistently.

This chapter focuses on runtime governance rather than general platform design. The distinction matters. Platform design decides what kinds of assets exist, how they are published, and how they fit together conceptually. Runtime governance decides what is allowed to happen when those assets begin interacting under real load and real security conditions. That is where systems either preserve their architecture or drift into exception-driven behavior. An agent network may be beautifully modeled on paper and still become unsafe if runtime requests bypass intended controls or if policies are attached too late in the path to matter. Flex Gateway is useful precisely because it operates at the traffic boundary where those risks can be controlled directly.

In an agentic integration environment, the gateway's role is broader than simple API protection. It is not only validating tokens or rate-limiting traffic. It is shaping the capability surface that agents and clients can actually use. It is rewriting and protecting agent discovery information. It is filtering tool exposure. It is enforcing attribute-based decisions about who gets what access under which circumstances. It is also one of the main places where sensitive content can be observed, masked, or blocked before it spreads farther through the workflow. These are all runtime concerns, and they matter because agentic systems are dynamic. The calling side may not know the exact sequence in advance, so the platform needs a strong enforcement point at the moment of interaction.

The first section explains ingress and egress gateway placement for agent traffic. This is foundational because a gateway can only govern what it can actually see, and many weak deployments make the mistake of placing gateways at only one side of the workflow while leaving important internal or outbound paths uncontrolled. The second section turns to MCP-specific governance, including global access, tool mapping, and attribute-based access control. This is where the gateway starts shaping the effective MCP surface rather than just protecting the transport. The third section addresses A2A protection, agent card rewriting, and sensitive data controls, which are essential when remote agents are discovered and invoked across a network that still has to preserve trust boundaries. The fourth section explains policy order, because even good policies create gaps when they are applied in the wrong sequence. Policy order is one of those details that seems operationally minor until it causes real problems.

The thread running through the whole chapter is simple. Runtime governance should make the network more truthful, not more magical. A request should pass through known control points. The visible capability surface should match actual policy. Sensitive content should be handled deliberately. Delegation should stay routed through trusted pathways. If these things are true, the architecture remains understandable under load. If they are not, the network can drift into a state where security and behavior no longer match the design. Flex Gateway is valuable because it gives runtime policy a durable place to live. That is what makes governance active rather than aspirational.

<!-- p. 93 -->
## 9.1: Ingress and Egress Gateway Placement for Agent Traffic

Gateway placement determines what the platform can govern and what it can only hope behaves correctly. In traditional API programs, teams often think first about ingress placement because the main concern is protecting traffic coming into a service. In agentic systems, that is necessary but not sufficient. Requests do not simply arrive from outside, get processed once, and leave. They move through brokers, agents, MCP servers, specialist delegates, and downstream business systems. That means control at ingress alone cannot guarantee runtime discipline. The architecture also needs egress governance so that what leaves a component is as controlled as what entered it.

Ingress placement is the more familiar starting point. It is where the platform verifies that traffic is coming through a trusted boundary, validates identity, enforces coarse access policies, logs the request, and establishes the conditions under which the request may proceed. In an agent network, ingress placement is particularly important for brokers, MCP servers, and exposed A2A endpoints because these are the places where the outside world, or at least the wider network, first interacts with the managed component. If traffic enters those components without passing through a governed boundary, the system loses a major source of consistency right away. Different assets may authenticate differently, log differently, or enforce different assumptions about what constitutes a valid call.

That alone would justify ingress governance, but agentic systems create another requirement. The gateway at ingress is not only checking who is at the door. It is often deciding what the requester is allowed to perceive. For MCP traffic, this can include filtering the list of visible tools, resources, or prompts. For A2A traffic, it can include deciding whether the incoming caller is allowed to request certain task types or even whether it should discover the full shape of the remote agent. In other words, ingress placement is not just a defensive perimeter. It is a shaping layer for the interaction surface itself.

Egress placement becomes just as important when a component starts calling outward. A broker may call an MCP server. A specialist agent may delegate to another specialist. An MCP server may need to reach a backend business system or a downstream resource service. If those outbound interactions leave the component without passing through a known egress control point, the platform loses the chance to apply policy to the outbound path. That has several consequences. Identity propagation may become inconsistent, destination restrictions may not be enforced, outbound payload inspection may be skipped, and audit visibility may fragment. In practice, this means the network may look well governed at the edges while important internal or downstream calls remain much less controlled.

Egress placement matters especially for agent-to-agent and agent-to-capability traffic because those calls often carry rich context and delegated authority. A broker calling a specialist agent may be acting on behalf of a user. A specialist reaching an MCP server may be using a constrained token intended only for a particular audience. If those outbound calls are not mediated, the system can drift into patterns where tokens are passed carelessly, destinations are not strongly validated, and tool invocation or delegation occurs outside the intended trust fabric. This is one of the reasons runtime governance has to include both directions. Ingress validates and shapes what comes in. Egress ensures that what goes out follows the same discipline.

A useful architectural way to think about this is that ingress is where the system accepts work and egress is where the system exercises power. Both must be governed. A broker accepting an incoming request is at ingress. The same broker calling a specialist or an MCP server is at egress. The same MCP server accepting a tool invocation is at ingress. The same MCP server reaching a downstream operational system is at egress. These are different moments with different risks, and the gateway placement should reflect that rather than treating the component as though only one side mattered.

<!-- p. 94 -->
The right placement also depends on role. For a broker, ingress is often the workflow entry point where a request first becomes part of a managed orchestration. Egress is where the broker chooses destinations, invokes capabilities, or delegates work. For an MCP server, ingress is the entry of tool and resource requests from agents or brokers, while egress is often the access path to underlying enterprise systems. For an A2A specialist, ingress is the acceptance of a delegated message or task, while egress may include its internal calls to other governed services or its own downstream delegations. Seeing the topology this way helps avoid the common mistake of protecting only the parts that look externally visible.

There is also a practical observability reason for getting placement right. If the gateway sees both inbound and outbound traffic at major boundaries, the platform can build a much clearer runtime picture. It can correlate incoming requests with outgoing delegated calls, associate a visible tool surface with the actual downstream actions that resulted, and show whether sensitive data was allowed, transformed, or blocked at each stage. This is much harder if governance exists only at selected entry points while internal and outbound traffic bypasses the same control plane. A partial view of the network often leads to partial explanations when things go wrong.

Another issue is topology truthfulness. In some weak deployments, the architecture diagram shows brokers, specialists, and MCP servers all flowing through gateway control, but the actual runtime path includes shortcuts taken for convenience. Direct connections get added because they are faster to set up, or because a team wants to bypass a policy they see as slowing development. These shortcuts are often where security and observability begin to drift. Good gateway placement is not only about drawing the right lines in a diagram. It is about making sure the real traffic path follows those lines. If the platform says certain calls are governed, they should actually pass through the relevant ingress or egress gateway.

Placement also influences policy granularity. An ingress gateway can often apply caller-sensitive policy because it sees the authenticated requesting side clearly. An egress gateway can often apply destination-sensitive policy because it sees where the call is going and what authority it carries. When both are present, the platform can reason about the full path much better. It can say this caller is allowed to enter the broker, and this broker is allowed to reach this specialist, and this specialist is allowed to use this downstream MCP server under these token constraints. That full-path governance is much stronger than isolated per-endpoint checks because it preserves architectural intent across the workflow.

There is no single universal placement diagram that fits every deployment, but there is a consistent design principle. Any boundary where identity, authority, destination, or sensitive data meaningfully changes should be considered for gateway mediation. In agentic integration, that usually means the entry of requests into brokers and specialist agents, the exposure of MCP servers, and the outbound paths from those components to other governed assets or enterprise systems. The more consequential the boundary, the less reasonable it becomes to leave it uncontrolled.

This is why ingress and egress placement should be discussed together rather than as separate infrastructure topics. They are part of the same governance fabric. Ingress tells the platform who is trying to do something and what should be visible or allowed at the point of entry. Egress tells the platform where that authority is being taken next and whether the outbound exercise of power matches the network's intended rules. When both are handled well, Flex Gateway becomes not just a border device but a runtime policy layer that mirrors the architecture's actual trust boundaries.

## 9.2: MCP Global Access, Tool Mapping, and Attribute-Based Access Control

MCP becomes genuinely governable when the platform can do more than authenticate the caller and let the full server surface appear automatically. Real governance requires shaping that surface so the caller sees only what it should see, under the names and descriptions that are appropriate for its role, and with access decisions that can vary according to context. This
<!-- p. 95 -->
is where MCP-specific policy becomes valuable. Flex Gateway can enforce broad access boundaries, refine how tools are presented, and apply attribute-based logic that goes beyond static allow or deny lists. These controls are powerful because they act directly on the MCP interaction surface rather than only on the transport beneath it.

Global access policy is the broadest of the three. It decides which MCP capabilities are available at all for a given class of caller or route. This is often the first layer of meaningful runtime governance for MCP because it reduces the surface before more refined logic has to do any work. If a support broker should never see financial settlement tools, global access should hide those tools completely. If a low-trust client should only see read-only resources and not action-capable tools, global access should enforce that shape directly. This is useful not just because it blocks misuse, but because it reduces cognitive and operational noise in the runtime environment.

One of the most valuable effects of global access is that it makes the MCP surface truthful. The client sees what it is actually allowed to use instead of being shown a full catalog and then learning through repeated denial that much of it is unavailable. This improves security and improves system behavior. Agents and brokers reason from what they can see. If that visible surface is already policy-filtered, their decisions become safer and cleaner. A capability that is absent from view cannot accidentally influence a runtime plan.

The next layer is tool mapping. Tool mapping is about changing how tools are presented without necessarily changing what they ultimately do. This can include renaming tools, changing or simplifying descriptions, and presenting a safer or more domain-appropriate view of backend capabilities. The reason this matters is that internal names and descriptions are not always suitable for broad agent use. A tool might be safe and useful, but its native name may reflect backend history, internal system language, or overly technical semantics. Mapping lets the platform expose the tool in a way that better fits the caller's role and the policy-controlled interface the organization wants the MCP surface to present.

This is not merely cosmetic. Names and descriptions influence runtime reasoning in agentic systems. A poorly named tool is more likely to be misused, confused with another capability, or selected under the wrong circumstances. Mapping allows the platform to improve semantic clarity without requiring the backend implementation to change immediately. It can also help different callers receive different representations of similar capabilities. A support broker may see a tool described in operational support language, while an internal operations client might see a more technical view. The underlying capability may remain the same, but the policy-controlled presentation becomes safer and more useful.

Attribute-based access control goes one step further. It allows tool, resource, or prompt exposure to depend not only on who the caller is in a broad sense, but also on additional request attributes. These attributes can include role, client type, IP range, network path, workflow state, customer tier, sensitivity marker, environment, or other signals the platform chooses to trust. This is especially valuable in agentic integration because many decisions are context-dependent. A caller might be allowed to use a tool only when the request comes from a particular route, or only when a prior review has already happened, or only when the request is being processed in a low-risk environment.

Attribute-based control helps prevent one of the main weaknesses of coarse security models, which is overgeneralization. A broker may indeed be a trusted broker, but that does not mean it should see and use the same MCP capabilities in every situation. A support workflow with an approved review artifact may justify access to a case update or refund-submission tool. The same broker acting earlier in the workflow may need only read access. Static role-based policy alone cannot always express this difference cleanly. Attribute-based policy can.

The first example below shows a policy that uses global access logic to expose only a small set of MCP tools to a support broker. The format is suited to a policy engine that evaluates request context.

<!-- p. 96 -->
Sentinel

```sentinel
caller_role = input.caller.role
tool_name = input.mcp.tool_name

main = rule {
  caller_role is "support-broker" and (
    tool_name is "read_customer_profile" or
    tool_name is "get_order_details"
  )
}
```

This is the simplest correct version. It expresses a broad access boundary. If the caller is the support broker, only the listed tools are allowed through this rule. That alone sharply reduces the visible and callable surface.

A more robust version adds context-aware allowance for an additional action tool only when a workflow attribute signals that prior review conditions have been met.

Sentinel

```sentinel
caller_role = input.caller.role
tool_name = input.mcp.tool_name
workflow_state = input.request.workflow_state
review_status = input.request.review_status

main = rule {
  caller_role is "support-broker" and (
    tool_name is "read_customer_profile" or
    tool_name is "get_order_details" or
    (tool_name is "submit_refund_request" and workflow_state is "resolution" and review_status is "approved")
  )
}
```

The stronger version illustrates why attribute-based control is so useful. The refund submission tool is not broadly available just because the caller is a trusted broker. It becomes available only in the right workflow context. This protects the system against both misuse and overexposure.

Tool mapping can be represented through a separate policy or configuration layer. The next example shows a simple YAML structure that remaps an internal tool name to a cleaner agent-facing name and adjusts its description.

YAML

```yaml
toolMappings:
  - sourceName: internal_order_lookup_v2
    targetName: get_order_details
    description: Retrieve current order details for customer support workflows
```

This is the simplest correct tool mapping. It gives the platform a way to present a better name and description without requiring the internal implementation to be rewritten first. That can be valuable during transitions or when backend naming is simply not suitable for an agent-facing surface.

A more robust mapping example shows how several internal tools can be normalized into a governed external presentation layer.

YAML

```yaml
toolMappings:
  - sourceName: internal_order_lookup_v2
    targetName: get_order_details
    description: Retrieve current order details for customer support workflows
  - sourceName: customer_profile_fetch_internal
    targetName: read_customer_profile
    description: Retrieve customer profile context for approved support interactions
  - sourceName: submit_case_note_internal
    targetName: create_case_update
    description: Create a support case update after a validated workflow decision
```

The benefit here is not just readability. It is control over the effective MCP interface. The gateway can present a surface that is semantically coherent and policy-aware even if the underlying implementation landscape is uneven.

The same ideas can also be implemented in runtime code when the gateway or supporting components need to filter and transform the visible tool list before it reaches the caller. The following Python example illustrates how a filtered and mapped tool surface might be assembled for a support broker.

Python

```python
def visible_tools_for_support_broker(tools: list[dict]) -> list[dict]:
    allowed = {
        "internal_order_lookup_v2": {
            "name": "get_order_details",
            "description": "Retrieve current order details for customer support workflows"
        },
        "customer_profile_fetch_internal": {
            "name": "read_customer_profile",
            "description": "Retrieve customer profile context for approved support interactions"
        }
    }

    result = []
    for tool in tools:
        source_name = tool["name"]
        if source_name in allowed:
            mapped = allowed[source_name]
            result.append({
                "name": mapped["name"],
                "description": mapped["description"],
                "inputSchema": tool["inputSchema"]
            })
    return result
```
<!-- p. 97: el bloque anterior empieza en la p. 96 y termina en esta página desde "\"description\": \"Retrieve current order details...\"" -->

This is the simplest correct runtime transformation pattern. It filters to allowed tools and remaps those tools into a cleaner external shape. Even a small amount of controlled presentation like this can make the MCP surface more usable and less risky.

A more robust version incorporates workflow context so that action-capable tools appear only when the current request qualifies.

Python

```python
def visible_tools_for_support_broker(tools: list[dict], workflow_state: str, review_status: str) -> list[dict]:
    allowed = {
        "internal_order_lookup_v2": {
            "name": "get_order_details",
            "description": "Retrieve current order details for customer support workflows"
        },
        "customer_profile_fetch_internal": {
            "name": "read_customer_profile",
            "description": "Retrieve customer profile context for approved support interactions"
        }
    }

    if workflow_state == "resolution" and review_status == "approved":
        allowed["submit_refund_internal"] = {
            "name": "submit_refund_request",
            "description": "Submit a refund request after approved review"
        }

    result = []
    for tool in tools:
        source_name = tool["name"]
        if source_name in allowed:
            mapped = allowed[source_name]
            result.append({
                "name": mapped["name"],
                "description": mapped["description"],
                "inputSchema": tool["inputSchema"]
            })
    return result
```

The difference is meaningful. The visible MCP surface is no longer just role-based. It becomes sensitive to the current workflow state. This makes it much more aligned with how real operational permissions work.

These policy layers are most effective when they are ordered and combined carefully with authentication, token validation, and downstream enforcement. Global access reduces the broad surface. Tool mapping makes the remaining surface more coherent. Attribute-based access refines what is actually usable in the present context. Together they create an MCP runtime surface that is much closer to what the system truly intends to expose. That is the real objective. Not only to stop bad calls after they happen, but to prevent the system from presenting the wrong set of possibilities in the first place.

## 9.3: A2A Protection, Agent Card Rewriting, and Sensitive Data Controls

A2A traffic needs its own form of runtime governance because agent-to-agent interaction is not just another API call with a different label. It involves discovery, delegation, task handling, and often the exchange of rich contextual payloads. If these interactions are left ungoverned, the system can easily lose control over who can discover a specialist agent, which callers are allowed to delegate work, what data is allowed to pass
<!-- p. 98 -->
between participants, and how much of the remote agent's contract is exposed to untrusted parts of the network. Flex Gateway is useful here because it can mediate both discovery and delegation rather than only protecting the transport after the fact.

The first major issue is discovery. In A2A, discovery often begins with an agent card or equivalent descriptor that advertises the remote agent's purpose, skills, and interaction surface. This is very useful, but it is also a potential source of exposure. If the card points callers directly to backend endpoints or reveals more of the internal topology than is necessary, the gateway cannot fully govern what happens next. Agent card rewriting addresses this by allowing the public-facing discovery surface to point to the governed gateway path rather than to the raw backend location. This means the client or calling agent discovers the remote specialist through a route that stays within the platform's control fabric.

This is more important than it might appear at first. Without rewriting, discovery can accidentally create a bypass path. A caller fetches the agent card, sees the backend address, and now knows where to send future calls directly. Even if some paths still go through governance, the discovery flow has already leaked the ungoverned route. Rewriting prevents that by making the gateway the visible doorway. The remote agent remains discoverable, but only through the path the platform intends to control and observe.

A simple conceptual example of an original agent card might show the backend route as it was first authored.

JSON

```json
{
  "name": "billing-review-agent",
  "description": "Evaluates disputed charges and returns review outcomes.",
  "url": "http://billing-review.internal:8080",
  "version": "1.0.0"
}
```

This is the simplest correct authored version from the component owner's point of view. The problem is that it exposes the internal route directly. In a governed platform, that is usually not what should be handed to external callers or even to most internal participants.

A rewritten version exposes the managed gateway address instead, while preserving the agent's discoverable identity.

JSON

```json
{
  "name": "billing-review-agent",
  "description": "Evaluates disputed charges and returns review outcomes.",
  "url": "https://agent-gateway.internal/billing-review-agent",
  "version": "1.0.0"
}
```

The value of the rewrite is architectural control. Discovery now leads callers to the governed entry point rather than the raw backend service. This keeps subsequent A2A traffic visible to the policy layer and prevents topology leakage.

A more robust rewritten card can also include only the skills and capabilities appropriate for the caller's trust level or operational role, which is often a useful further control.

JSON

```json
{
  "name": "billing-review-agent",
  "description": "Evaluates disputed charges and returns structured review outcomes for approved support workflows.",
  "url": "https://agent-gateway.internal/billing-review-agent",
  "version": "1.1.0",
  "capabilities": {
    "messages": false,
    "tasks": true,
    "artifacts": true
  },
  "skills": [
    {
      "id": "dispute-review",
      "name": "Dispute Review",
      "description": "Assess a disputed charge and return a structured review artifact."
    }
  ]
}
```

This stronger version shows how rewriting can be more than URL substitution. It can become part of how the platform
<!-- p. 99 -->
presents a policy-filtered and governable interaction contract to callers.

The next issue is delegated-call protection. A2A traffic should be authenticated and authorized at the gateway boundary just as MCP traffic should be. The gateway should know which callers are allowed to reach which specialist agents and which task kinds are permitted through that route. This matters because A2A is often used for domain-specialist delegation, and not every caller should be able to submit every kind of work. A support broker may be allowed to initiate dispute-review tasks with a billing specialist. That does not mean it should be able to invoke administrative override tasks or compliance-only workflows. The gateway can enforce these restrictions before the remote agent ever sees the request.

Sensitive data control is also especially important in A2A because delegated tasks often carry rich payloads. The caller may include customer details, transaction history, risk signals, or internal case context as part of the task input. Some of this data may be necessary for the specialist to do its job. Some of it may not. The gateway can help here by inspecting, masking, or blocking data based on sensitivity policy. This is not only about privacy protection. It is also about discipline. Delegation should carry the data required for the task and no more. If the system routinely sends oversized contextual payloads between agents, the risk surface grows quickly.

The following Sentinel policy shows a simple protection rule that allows only an approved broker to submit a dispute-review task to a billing specialist.

Sentinel

```sentinel
caller = input.caller.name
task_kind = input.request.task.kind
target_agent = input.request.target_agent

main = rule {
  caller is "support-broker" and
  target_agent is "billing-review-agent" and
  task_kind is "dispute-review"
}
```

This is the simplest correct A2A protection rule. It states clearly who may reach which target for which task kind. Even that level of restriction is valuable because it limits delegation to a known and intended path.

A more robust version adds route context and denies requests that carry certain sensitive fields unless the workflow context explicitly allows them.

Sentinel

```sentinel
caller = input.caller.name
task_kind = input.request.task.kind
target_agent = input.request.target_agent
workflow_state = input.request.workflow_state
contains_full_payment_data = input.request.sensitivity.full_payment_data

main = rule {
  caller is "support-broker" and
  target_agent is "billing-review-agent" and
  task_kind is "dispute-review" and
  workflow_state is "billing-review" and
  not contains_full_payment_data
}
```

The stronger version illustrates a more realistic form of governance. The delegation is allowed only in the correct workflow state and only if the payload does not carry disallowed sensitive material. This is exactly the kind of runtime control that is difficult to enforce reliably inside agents alone.

A similar protection layer can be implemented in a gateway-side processing function that rewrites agent card URLs and removes disallowed skills before returning the card to the caller. The following Python example illustrates the basic pattern.

Python

```python
def rewrite_agent_card(card: dict) -> dict:
    rewritten = dict(card)
    rewritten["url"] = "https://agent-gateway.internal/billing-review-agent"
    return rewritten
```

This is the simplest correct rewriting pattern. The gateway keeps the discovery experience intact while ensuring that the returned route stays under governance.

A more robust version also filters skills and task capabilities according to the intended caller policy.

<!-- p. 100 -->
Python

```python
def rewrite_agent_card(card: dict, caller_role: str) -> dict:
    rewritten = dict(card)
    rewritten["url"] = "https://agent-gateway.internal/billing-review-agent"

    if caller_role == "support-broker":
        rewritten["capabilities"] = {
            "messages": False,
            "tasks": True,
            "artifacts": True
        }
        rewritten["skills"] = [
            skill for skill in card.get("skills", [])
            if skill.get("id") == "dispute-review"
        ]
    else:
        rewritten["capabilities"] = {
            "messages": False,
            "tasks": False,
            "artifacts": False
        }
        rewritten["skills"] = []

    return rewritten
```

The value of this version is that discovery itself becomes policy-aware. Different callers can receive different visible interaction surfaces without exposing the raw backend contract.

Sensitive data controls can be applied similarly at the payload level. For example, a gateway function could strip or mask full payment-card details before allowing a dispute-review task to proceed if those details are not required by the specialist. The exact redaction logic will vary, but the principle is consistent. Runtime governance should reduce needless data spread between agents and ensure that delegation payloads are aligned with task necessity rather than with convenience.

There is another subtle but important reason to govern A2A traffic this way. Specialist agents often become trusted parts of the network very quickly because they are useful and reused in many places. That trust can lead teams to assume that direct agent-to-agent interaction is safe by default. In reality, specialists should be treated with the same seriousness as powerful MCP servers. They are exposed operational components with capabilities, trust relationships, and data access needs. Gateway mediation helps keep that trust bounded and visible instead of letting it expand informally over time.

Taken together, A2A protection, agent card rewriting, and sensitive data controls make discovery and delegation much more disciplined. The calling side sees the governed path, not the raw topology. The receiving specialist sees only permitted task types from permitted callers. Sensitive fields are filtered or blocked before they travel farther than necessary. The network remains collaborative, but the collaboration stays inside a clear trust fabric. That is exactly what runtime governance is supposed to achieve.

## 9.4: Applying Policies in the Right Order to Avoid Security Gaps

A policy can be correct in isolation and still fail in practice if it is applied in the wrong order. This is one of the most common sources of runtime governance gaps, especially in systems that combine authentication, global access filtering, capability mapping, attribute-based controls, sensitive data inspection, and outbound restrictions. When these policies are misordered, the platform may validate the wrong thing first, expose too much before filtering, or apply an access decision after sensitive information has already passed through a layer that should never have seen it. Policy order matters because governance is not only about what rules exist. It is also about when each rule gets the opportunity to shape the request or response.

The first broad principle is that identity and trust establishment should happen before capability-specific decisions. The platform should know who is calling, through which route, and with what basic credential validity before it tries to decide which tools, tasks, or resources the caller should see or use. If capability filtering is attempted before the caller's identity is trustworthy, the platform is making subtle access decisions on unstable ground. Worse, it may expose part of a runtime surface to an unauthenticated or weakly authenticated party during the process. Authentication and trust validation therefore need to happen early in the chain.

<!-- p. 101 -->
The second broad principle is that coarse visibility control should happen before finer semantic refinement. If the caller should not see an entire class of MCP tools, that should be decided before tool mapping and description shaping are applied. If an A2A caller is not allowed to discover a specialist at all, that should be decided before the platform rewrites and enriches the visible agent card. This ordering is important because global exposure control reduces the attack and reasoning surface early. Mapping and refinement are useful, but they should operate on a surface that has already been narrowed by broad access policy. Otherwise the system wastes effort shaping capabilities that should never have been visible in the first place.

The third principle is that payload-sensitive controls should operate before downstream forwarding. If the request contains fields that may need masking, blocking, or validation for sensitivity, those checks should happen before the outbound request leaves the gateway-controlled boundary. This sounds obvious, but poorly ordered policy chains sometimes apply logging, enrichment, or outbound routing before data inspection. That can expose sensitive material to the wrong components or preserve it in traces that should never have contained it. Sensitive data handling belongs before onward travel, not after.

The fourth principle is that context-specific authorization should happen after enough of the request has been normalized to evaluate meaning correctly, but before the target component is given a chance to act. This is where attribute-based controls and task-specific policies often sit. The platform may need to know the mapped tool identity, the workflow state, the route, or the intended target agent before it can make the final authorization decision. The key is to make sure those context-building steps happen before the request crosses the enforcement boundary into actual execution. If the request reaches the target and only then fails a policy that should have been caught earlier, the platform is no longer fully controlling the path.

To make this more concrete, consider an MCP request entering a governed path. The right order would typically begin by validating the token and caller identity. Then the platform determines whether the caller should even access this MCP surface. Next it can apply global visibility control and tool mapping so the visible surface is shaped correctly. After that, it can evaluate attribute-based rules for the specific requested method in its current workflow context. Then it can inspect for sensitive data and ensure the outbound call is permitted. Finally, the request can be forwarded. If that order is inverted in key places, the system can leak capability details, process requests with the wrong assumptions, or miss the moment where a control was actually needed.

The following YAML example shows a simple policy chain definition for an MCP path. It demonstrates the broad logic of ordering without depending on one specific runtime syntax.

YAML

```yaml
policyChain:
  - name: authenticate-caller
  - name: validate-route-access
  - name: apply-mcp-global-access
  - name: apply-tool-mapping
  - name: evaluate-attribute-access
  - name: inspect-sensitive-data
  - name: forward-request
```

This is the simplest correct ordering pattern. Identity comes first. Broad route and capability filtering happens before semantic refinement. Sensitive data inspection happens before the request is forwarded. The structure is clean and defensible.

A more robust version distinguishes inbound and outbound checks more explicitly and includes a final outbound authorization stage to prevent incorrect forwarding even after earlier checks passed.

YAML

```yaml
policyChain:
  - name: authenticate-caller
  - name: validate-token-audience
  - name: validate-route-access
  - name: apply-mcp-global-access
<!-- p. 102 -->
  - name: apply-tool-mapping
  - name: evaluate-attribute-access
  - name: inspect-sensitive-data
  - name: authorize-egress-destination
  - name: forward-request
```
<!-- p. 102: el bloque anterior empieza en la p. 101 y termina en esta página desde "- name: apply-tool-mapping" -->

The stronger version is better because it acknowledges that the outbound destination itself is part of the governance decision. This is particularly useful in networks where one inbound route may connect to several possible downstream assets depending on the workflow.

A2A policy order benefits from the same discipline. Discovery requests should authenticate and validate the caller before the agent card is rewritten or filtered. Delegation requests should authenticate the caller, validate the token audience or trusted actor chain, confirm that the caller is allowed to interact with the target specialist, inspect the task type and payload for sensitivity, and only then allow the delegated task to proceed. If agent card rewriting happens before access checks, the platform may unnecessarily reveal a governed path to someone who should not see it. If sensitive payload inspection happens after task acceptance, the specialist may already have been exposed to data that the gateway should have removed or blocked.

The next example shows a Sentinel policy that assumes authentication has already happened and then applies route and task controls in order for an A2A request. The important point is that this rule belongs after identity validation and before forwarding.

Sentinel

```sentinel
caller = input.caller.name
target_agent = input.request.target_agent
task_kind = input.request.task.kind
workflow_state = input.request.workflow_state

main = rule {
  caller is "support-broker" and
  target_agent is "billing-review-agent" and
  workflow_state is "billing-review" and
  task_kind is "dispute-review"
}
```

This is a correct middle-stage authorization rule. It assumes the platform already knows who the caller is and can now decide whether this specific delegation is allowed. That is how policy layering should work. Each rule should operate at the stage where its prerequisites have already been established.

A more robust version adds sensitivity gating so that certain payload classes are denied before the delegated task can be forwarded.

Sentinel

```sentinel
caller = input.caller.name
target_agent = input.request.target_agent
task_kind = input.request.task.kind
workflow_state = input.request.workflow_state
contains_full_payment_data = input.request.sensitivity.full_payment_data

main = rule {
  caller is "support-broker" and
  target_agent is "billing-review-agent" and
  workflow_state is "billing-review" and
  task_kind is "dispute-review" and
  not contains_full_payment_data
}
```

The stronger version makes the order more meaningful. Identity and route validation come first, then the request's semantic and sensitivity context is used for the final allow or deny decision before forwarding.

A runtime implementation can reflect this ordering directly. The following Python example shows a small processing function for an MCP request that validates identity, filters the visible tool set, applies attribute-based checks, and only then forwards the request.

Python

```python
def process_mcp_request(principal: dict, request: dict, tools: list[dict]) -> dict:
    visible_tools = filter_tools_for_support_broker(
        tools=tools,
        workflow_state=request.get("workflow_state", ""),
        review_status=request.get("review_status", "")
    )

    requested_tool = request.get("tool")
    if requested_tool not in {tool["name"] for tool in visible_tools}:
        raise PermissionError("Requested tool is not allowed")

    if request.get("contains_sensitive_data"):
        raise PermissionError("Sensitive data must be removed before forwarding")

    return {"status": "forwarded", "tool": requested_tool}
```
<!-- p. 103: el bloque anterior empieza en la p. 102 y termina en esta página desde "raise PermissionError(\"Requested tool is not allowed\")" -->

This is the simplest correct runtime pattern for ordered enforcement. The function assumes the caller is already authenticated. It then derives the allowed visible surface, checks the specific request against that surface, and blocks sensitive payloads before forwarding.

A more robust version separates the stages more clearly and makes route and destination authorization explicit before the request is released downstream.

Python

```python
def process_mcp_request(principal: dict, request: dict, tools: list[dict], destination: str) -> dict:
    if principal.get("audience") != "mcp-gateway":
        raise PermissionError("Invalid token audience")

    if principal.get("role") != "support-broker":
        raise PermissionError("Caller is not allowed on this route")

    visible_tools = filter_tools_for_support_broker(
        tools=tools,
        workflow_state=request.get("workflow_state", ""),
        review_status=request.get("review_status", "")
    )

    requested_tool = request.get("tool")
    if requested_tool not in {tool["name"] for tool in visible_tools}:
        raise PermissionError("Requested tool is not allowed")

    if request.get("contains_sensitive_data"):
        raise PermissionError("Sensitive data must be removed before forwarding")

    if destination != "customer-ops-mcp":
        raise PermissionError("Destination is not authorized for this route")

    return {
        "status": "forwarded",
        "tool": requested_tool,
        "destination": destination
    }
```

The stronger version shows a more complete policy chain. Audience and route checks happen before visibility decisions. Visibility decisions happen before sensitive data and destination checks. Only then is the request considered safe to forward. This is the kind of ordering that prevents subtle governance gaps from opening between individually correct rules.

The practical risk of poor ordering is usually not obvious at first. The workflow may still appear to function. The gap shows up only under certain conditions, such as when a disallowed capability becomes visible long enough to influence a plan, when a mapped tool name is authorized differently from its source name because the check happened at the wrong stage, or when sensitive content is logged or routed before a masking rule has had a chance to act. These are the kinds of failures that make teams say the policy existed but somehow did not prevent the outcome. In most cases, the real problem is that the policy existed at the wrong time in the chain.

Strong runtime governance therefore requires teams to think about policy as a sequence, not merely a collection. Authentication establishes trust. Broad access filtering shapes the surface. Mapping makes the surface semantically coherent. Attribute-based logic applies context. Sensitive data controls protect payloads. Egress authorization confirms the destination. Forwarding happens only after those stages are complete. When this order is respected, Flex Gateway becomes a reliable control plane for runtime behavior rather than a loose bag of rules whose combined effect is uncertain. That is the difference between having policies and having governance.
