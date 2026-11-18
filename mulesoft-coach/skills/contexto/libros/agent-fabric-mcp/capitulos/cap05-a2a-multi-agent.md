---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 5
titulo: "A2A Communication for Multi-Agent Workflows"
paginas_pdf: "46-57"
temas: [agent-fabric]
transcrito: 2026-11-15
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna. En JSON y Python la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas.
- Cuando un bloque de código cruza de panel o de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza al principio de la p. 46 y termina al final de la p. 57. El capítulo 6 empieza en la p. 58.
-->

# Chapter 5: A2A Communication for Multi-Agent Workflows

<!-- p. 46 -->
As soon as an agentic system moves beyond one agent with a menu of tools, the architecture changes in a meaningful way. The problem is no longer only how an agent accesses functions and context. It becomes how multiple agents cooperate without turning the system into a loose network of opaque calls and overlapping responsibilities. This is where agent-to-agent communication becomes necessary. A2A exists to support that need. It provides a structured way for one agent to discover another, understand what it is meant to do, send work to it, track the work as it progresses, and receive the result in a form that can be processed or handed forward.

This distinction matters because a multi-agent workflow is not just a larger single-agent workflow. A specialist billing agent, a compliance review agent, a logistics coordination agent, and a support triage agent may all be well designed in isolation, but without a disciplined interaction model, their collaboration becomes fragile. One agent may need to hand work to another that owns domain-specific reasoning. Another may need to wait for a longer-running task to complete. Another may need a structured result, not just a line of text, so that it can continue its own workflow. A2A addresses these realities by treating remote agents as structured participants in a workflow rather than as informal endpoints hidden behind prompts or ad hoc wrappers.

The value of A2A becomes clearer when it is placed next to MCP. MCP is well suited to exposing tools, resources, and prompts so an agent can access capabilities and context in a standardized way. A2A solves a different problem. It provides a model for one agent to interact with another agent as a task-bearing collaborator. That difference should be kept clear from the start because many poor designs blur the two. If every specialist component is reduced to a tool, the system loses the expressive benefits of delegation. If every remote function is treated as an agent, the system becomes needlessly complex. A2A is valuable precisely because it defines a collaboration layer for cases where remote reasoning, task ownership, or domain specialization belong on the other side of the call.

This chapter explains how to think about A2A in practical terms for multi-agent workflows. The first section clarifies what A2A solves that MCP does not, because getting that distinction right is essential for good architecture. The second section explains agent cards, capability discovery, and interaction contracts so that remote agents can be treated as discoverable, governed assets rather than mystery endpoints. The third section turns to messages, tasks, and artifacts, which are the basic working units of A2A exchanges and the key to understanding why agent-to-agent interaction differs from ordinary function invocation. The fourth section addresses routing among specialist agents without losing control, because the hardest part of multi-agent architecture is not finding reasons to delegate. It is preserving authority, clarity, and observability when delegation becomes common.

A2A should be understood as a protocol for collaboration boundaries. It gives one agent a way to ask another agent to perform work according to a declared contract. That contract includes what the remote agent claims to do, how work can be submitted, how long-running operations are represented, and how outputs are returned. This makes multi-agent workflows far more manageable than approaches that rely on hidden conventions or tightly coupled internal integration logic. When used well, A2A makes specialist delegation more explicit, more governable, and more reusable. That is exactly what multi-agent systems need once they start handling real operational tasks instead of controlled demonstrations.

## 5.1: What A2A Solves That MCP Does Not

The clearest way to understand A2A is to begin with the problem MCP does not solve. MCP is designed around the relationship between a client and a capability provider. It gives the client a standard way to access tools, resources, and prompts. That is an excellent fit when the question is how an agent or AI-enabled client can use external functions and
<!-- p. 47 -->
context. It is not, by itself, a full model for collaboration between autonomous or semi-autonomous agents that each own their own reasoning, task handling, and operational behavior. This is the gap A2A is meant to fill.

A tool exposed through MCP is fundamentally a capability surface. The calling side asks for an action or reads a contextual resource. Even when that capability is sophisticated, the semantic model remains one of access to a provided function, context surface, or prompt asset. The server may do a lot behind the scenes, but to the caller it is still a capability provider. A2A introduces a different relationship. The remote side is not merely exposing a function. It is presenting itself as another agent with its own declared capabilities, its own task-handling logic, and its own responsibility for carrying work forward within its domain.

This difference matters when the remote component is doing more than executing a narrow action. A compliance agent may interpret a policy question, gather supporting evidence, and produce a structured recommendation. A logistics exception agent may coordinate shipment state, policy rules, and service-level commitments before producing a decision. A financial operations agent may evaluate a request against multiple sources and produce artifacts that another part of the system must consume. These are not merely tools in the ordinary sense. They are specialist actors with domain logic and workflow ownership. Treating them as flat tool endpoints often erases useful distinctions and makes the system harder to reason about.

A2A solves the problem of remote specialization with a richer interaction model. One agent can discover another agent, understand what kinds of work it accepts, submit a message or task, and receive a response or progress updates that reflect the remote agent's own handling of the job. This is much closer to collaboration than invocation. It preserves the idea that the remote component is not just a backend function but a task-capable participant in the workflow.

Another thing A2A solves is the representation of longer-running work. Many enterprise tasks are not completed in one quick request-response cycle. A specialist agent may need time to process, may need to coordinate with internal systems, or may need to produce intermediate updates before a final result is ready. MCP can certainly be used in remote settings and can support structured interactions, but it is not primarily framed around inter-agent task lifecycle semantics. A2A explicitly models task-oriented work in a way that is better suited to this type of delegation. That becomes very important once workflows include review cycles, waiting states, or staged outputs.

A2A also solves the discovery problem at the agent level. In a multi-agent environment, one agent needs more than an endpoint address for another. It needs a reliable way to learn what the remote agent is for, what types of work it supports, what kinds of interaction patterns it uses, and how trust and access should be understood. The agent card concept provides this missing layer. It gives remote agents a structured self-description that can be discovered, interpreted, and governed. MCP discovery focuses on the capabilities a server exposes. A2A discovery focuses on the remote agent as a collaborating entity with task-level contracts.

This matters for ownership and architectural clarity. When a remote specialist is represented through A2A, it remains visibly distinct as a domain-owned agent. That helps preserve responsibilities. The billing agent owns billing reasoning. The claims review agent owns claims evaluation. The fulfillment agent owns order exception handling. If those components are flattened into generic tools too aggressively, the network loses that clarity. Everything starts looking like a bag of remote functions rather than a set of collaborating specialists. A2A helps keep the topology honest.

There is also an important trust and governance angle. When one agent calls a tool, the governance question is usually whether the calling side is allowed to use that capability and under what conditions. When one agent delegates to another agent, the governance question expands. Now the system must consider whether the remote agent is a trusted collaborator, what domain it owns, how the delegation path should be
<!-- p. 48 -->
authorized, what task data should be shared, and what outputs are acceptable to bring back into the wider workflow. A2A makes those boundaries more explicit. It gives the architecture a language for agent-level trust and task delegation that is harder to express cleanly through tool exposure alone.

A2A also helps solve the problem of preserving specialist autonomy without sacrificing interoperability. In many organizations, domain teams want to build agents that encapsulate their own reasoning and their own internal use of tools and context. That is a reasonable design goal. But without a common way for other agents to interact with those specialists, each specialist becomes a custom integration problem. A2A provides a common interaction pattern that allows those specialists to remain independent while still being usable by the wider network. That combination is powerful. It supports modularity without forcing a single monolithic agent to absorb every concern.

Another area where A2A adds value is output structure. A specialist agent's result is not always just an answer string. It may be a recommendation, a decision record, a generated file, a review packet, or some other artifact that needs to be consumed downstream. A2A's task and artifact model reflects this more directly than a simplistic request-response view. It acknowledges that agent work may produce deliverables with their own identity and lifecycle significance. This is far more realistic for enterprise use cases than assuming everything reduces to a short text result.

It is also useful to notice what A2A does not replace. It does not make MCP unnecessary. In fact, the two work well together. A specialist agent reachable through A2A may internally use MCP to access its own tools, resources, and prompts. From the caller's point of view, however, that detail remains on the other side of the delegation boundary. The caller is not consuming those capabilities directly. It is delegating work to an agent that owns them. This layered approach is often the cleanest pattern. MCP structures agent-to-capability access. A2A structures agent-to-agent collaboration. Confusing those layers usually weakens the architecture.

A practical example makes the contrast clearer. A support coordinator agent receives a request about a disputed charge. It can use MCP tools directly to retrieve account details and payment status. That makes sense because those are capabilities it needs to access itself. But if it needs a formal charge-review decision that applies domain rules, examines prior dispute patterns, and produces a review artifact suitable for compliance, a billing review agent may be the better target. In that case the support coordinator is not merely calling a function. It is delegating work to a specialist agent that owns a domain-level decision process. That is where A2A adds value.

There is also a scaling reason to prefer A2A for genuine agent collaboration. As systems grow, flattening all specialist behavior into one agent's tool menu becomes unwieldy. The calling side must know too much, manage too many direct dependencies, and shoulder too much orchestration detail. Delegation through A2A allows the system to scale specialization without forcing every caller to manage every internal detail of every domain. The network becomes more modular because each agent can expose its interaction contract while hiding internal implementation choices.

This does not mean A2A should be used for every remote interaction. That would be just as unhelpful as forcing everything into MCP tools. Some capabilities are best exposed as tools because they are deterministic, narrow, and clearly action-oriented. Some contexts are best exposed as resources because they are read surfaces. A2A belongs where the remote party is meaningfully an agent, not merely a capability provider. The decision should come from architecture, not fashion. If the remote component owns domain reasoning, task progression, and specialist outputs, A2A is usually a better fit. If it mainly exposes functions or context, MCP is usually the clearer choice.

The practical benefit of understanding this distinction is that it prevents weak designs early. It keeps teams from building pseudo-agents that are really just function wrappers, and it keeps them from stripping away useful specialization by flattening every remote collaborator into a tool. Once this separation is clear, multi-agent workflows become easier
<!-- p. 49 -->
to shape. Direct capability access can remain direct. True delegation can remain delegation. The system stays more understandable, and governance becomes easier because the architectural roles are explicit rather than blurred.

## 5.2: Agent Cards, Capability Discovery, and Interaction Contracts

If A2A is going to support multi-agent collaboration in a disciplined way, one agent needs a clear and structured way to understand another before it delegates work. That is the purpose of the agent card. The agent card acts as the discoverable description of a remote agent. It tells potential callers what the agent is, what kinds of work it claims to handle, how it can be contacted, and what sort of interaction model it supports. This is not just a convenience. It is a foundational contract for interoperability. Without something like an agent card, remote agents remain opaque services that other agents can only use through hidden knowledge or one-off conventions.

The importance of the agent card becomes obvious as soon as there are multiple specialists in the system. A routing or coordinating agent needs to distinguish among them. It needs to know whether one agent handles billing review while another handles shipping exceptions, whether one accepts task-oriented interactions while another is suited for short direct messages, and whether there are specific authentication or access requirements to consider. The agent card provides the basis for that understanding. It turns the remote agent into a describable asset instead of a mystery endpoint.

This is more than directory metadata. A good agent card influences how routing, governance, and runtime decisions are made. If the card is well designed, it gives enough information for a coordinating layer to decide whether the remote agent is relevant and how it should be used. If the card is vague, overloaded, or outdated, the system's discovery quality drops and routing becomes guesswork. This is why agent-card quality matters so much. It is not merely a registration step. It is part of the operating contract between agents.

An interaction contract sits behind the agent card. The card advertises the remote agent's role and supported patterns, but what really matters is that the caller can rely on a stable understanding of what delegation means for that agent. If the card says the agent evaluates refund disputes, the caller should not discover later that the agent also initiates customer notifications as a hidden side effect. If the card indicates that task-based work is supported, the caller should be able to submit work and track it according to a predictable model. The value of discovery depends on the honesty and stability of the interaction contract behind it.

This should sound familiar because it reflects the same general discipline that good API programs and good MCP server designs require. Discoverability is only useful when the thing being discovered behaves consistently with its published description. In the context of A2A, this matters even more because the discovered component is not just a function endpoint. It is an agent with behavior. That means loose or misleading descriptions have a bigger impact. They affect routing quality, trust, and task expectations all at once.

A simple agent card needs enough information to identify the agent, describe its purpose, and expose the endpoint through which it can be contacted. That basic model already creates value because it gives discovery a formal shape. The following example shows a compact agent card for a billing review specialist.

JSON

```json
{
  "name": "billing-review-agent",
  "description": "Evaluates disputed charges and produces review decisions for billing operations.",
  "url": "https://agents.internal/billing-review",
  "version": "1.0.0"
}
```

This is the simplest correct version. It identifies the agent clearly enough for a coordinating system to know that the agent exists and roughly what it is for. Even this level of structure is better than depending on informal endpoint knowledge.

<!-- p. 50 -->
A more robust version makes the interaction contract more explicit by adding capability and communication details that a routing layer or policy system can reason about.

JSON

```json
{
  "name": "billing-review-agent",
  "description": "Evaluates disputed charges, checks billing evidence, and produces structured review outcomes for downstream processing.",
  "url": "https://agents.internal/billing-review",
  "version": "1.1.0",
  "capabilities": {
    "messages": true,
    "tasks": true,
    "artifacts": true
  },
  "authentication": {
    "type": "oauth2"
  },
  "skills": [
    {
      "id": "dispute-review",
      "name": "Dispute Review",
      "description": "Assess a billing dispute and return a structured outcome."
    }
  ]
}
```

The difference is substantial even though the structure remains readable. The richer card tells the caller that this agent supports both direct messages and task-based interaction, that it may produce artifacts, that authenticated access is expected, and that dispute review is an explicit skill. This improves discoverability because the caller can reason about fit, not just about presence.

The card also helps create cleaner domain boundaries. By declaring its skills and interaction style, the billing review agent stays visible as a specialist rather than being flattened into generic routing logic. That is valuable because it allows the architecture to preserve meaningful specialization while still supporting interoperability. When a coordinating agent chooses this specialist, it is doing so on the basis of a published contract rather than on hidden implementation knowledge.

A good agent card should also support lifecycle clarity. As agents evolve, the card becomes a place where version and capability changes can be declared. This does not eliminate compatibility concerns, but it gives the system a cleaner place to surface them. If an agent adds task support, changes its authentication requirements, or narrows the domain it handles, those changes should be reflected in the card so discovery remains truthful. This is one reason agent cards should be treated as managed assets rather than throwaway metadata files.

Discovery based on agent cards also changes how routing logic is designed. Instead of a coordinator hard-coding every specialist path, the system can use agent-card data to build a governed directory of available collaborators. This does not mean routing becomes arbitrary. On the contrary, it becomes more structured because the routing layer is drawing from a known set of agent contracts. The platform can validate those contracts, apply trust rules, and make routing choices from a cleaner source of truth.

The next example shows how a Python-based coordinating component might retrieve and inspect an agent card before deciding whether to delegate work.

Python

```python
import requests

def fetch_agent_card(agent_url: str) -> dict:
    response = requests.get(f"{agent_url}/.well-known/agent-card.json", timeout=5)
    response.raise_for_status()
    return response.json()

card = fetch_agent_card("https://agents.internal/billing-review")

if card["name"] == "billing-review-agent":
    print("Billing review specialist is available")
```

This is the simplest correct pattern. The coordinating component retrieves the agent card and inspects the returned
<!-- p. 51 -->
structure. That alone creates a clean break from hard-coded hidden assumptions about the remote agent.

A more robust version uses the card's declared skill and task support to make a more informed decision about whether the agent is suitable for the work being delegated.

Python

```python
import requests

def fetch_agent_card(agent_url: str) -> dict:
    response = requests.get(f"{agent_url}/.well-known/agent-card.json", timeout=5)
    response.raise_for_status()
    return response.json()

def supports_skill(card: dict, skill_id: str) -> bool:
    skills = card.get("skills", [])
    return any(skill.get("id") == skill_id for skill in skills)

card = fetch_agent_card("https://agents.internal/billing-review")

if card.get("capabilities", {}).get("tasks") and supports_skill(card, "dispute-review"):
    print("Billing review specialist can accept delegated dispute work")
```

The second version shows the real power of discovery. The caller is not just checking that the endpoint exists. It is using the card to determine whether the agent supports the right kind of interaction and the right domain skill. That is far more reliable than routing purely by name or URL pattern.

Interaction contracts become even more useful when governance is added. A discovered agent is not automatically a trusted one. The platform may require that agent cards be validated, registered, or mapped through a governed registry before the agent can participate in production workflows. That distinction is important because discovery without trust control creates risk. The card should make discovery possible, but the platform should still decide under what conditions the discovered agent becomes an approved collaborator.

This separation between discovery and trust is one of the healthiest design patterns in multi-agent environments. It keeps the ecosystem open enough to identify useful specialists while still preserving enterprise discipline. An imported or newly published agent can be visible, inspected, evaluated, and only then admitted into controlled runtime use. The agent card is what makes that inspection practical because it provides a standard shape for the remote agent's self-description.

Another benefit of explicit interaction contracts is that they reduce prompt-based coupling. Without agent cards and structured discovery, teams often end up teaching one agent about another through long prompt instructions and internal lore. That is fragile and hard to maintain. By contrast, a discoverable agent card gives the calling system a structured, machine-readable source of truth about the remote collaborator. Prompt logic can then focus on task reasoning instead of carrying infrastructure knowledge that belongs in the platform layer.

A mature multi-agent system depends heavily on this kind of explicitness. One agent should not have to know the private details of another to use it properly. It should be able to discover the remote agent, inspect the card, verify that the skills and interaction model fit the task, and proceed through a stable delegation contract. This is how multi-agent architectures avoid collapsing into a web of bespoke agreements. Agent cards make specialists visible. Capability discovery makes routing possible. Interaction contracts make delegation dependable. Together, they provide the foundation that agent-to-agent communication needs in order to scale cleanly.

## 5.3: Messages, Tasks, and Artifacts in Agent-to-Agent Exchanges

Once a remote agent has been discovered and its contract is understood, the actual exchange begins. This is where A2A's working model becomes especially useful. Agent-to-agent interaction is not limited to a single request-response shape. Sometimes the caller needs a quick answer. Sometimes it needs to delegate a longer-running piece of work. Sometimes the remote agent must produce a structured deliverable that will be consumed downstream. A2A reflects these realities through messages, tasks, and artifacts. These are not decorative concepts. They are the core units that make agent collaboration
<!-- p. 52 -->
behave like collaboration rather than like disguised function calls.

A message is the lighter-weight form of interaction. One agent sends a message to another when the exchange is immediate enough that the response can be returned directly without modeling a larger task lifecycle. This is useful for short interactions, focused questions, or requests that the remote agent can answer or resolve quickly. The semantics are closer to a conversational exchange, but the message is still structured enough to support machine coordination rather than just natural language improvisation.

The important point is that a message is not just a casual chat object. It is part of a protocol interaction between agents. The message represents a request that the receiving agent interprets within its own domain. Because it is structured, it can carry content and context in a way that is easier to govern and route than raw free text alone. That makes messages suitable for lightweight delegation or consultation where the cost of setting up a full task object would be unnecessary.

A task is different. A task represents a unit of work that may continue over time. It has identity, state, and lifecycle meaning. The remote agent accepts the work, processes it within its own logic, and may move it through several phases before a final result is ready. This is especially important in enterprise workflows where delegated work may need to wait on internal checks, coordinate several sub-steps, or produce an output that becomes relevant only after completion. The task model allows the calling side to treat this delegated work as something more than a one-shot request. It can be tracked, queried, or updated according to the contract the remote agent supports.

The task model is one of the biggest reasons A2A is valuable in multi-agent systems. Without it, longer-running delegated work tends to be handled through awkward polling, hidden retries, or ad hoc state management spread across several components. A task gives the work a durable identity and gives both sides a stable way to refer to it. This improves observability, operational clarity, and recovery behavior. If the delegated work takes time, the system does not have to pretend that it was an immediate answer all along.

Artifacts are equally important. A task result is not always just text. In real workflows, the remote agent may produce something that has to be passed onward, stored, inspected, or acted on. That output may be a structured decision summary, a review packet, a draft response, an approval recommendation, or some other work product. A2A treats that output as an artifact rather than forcing every result into a generic string or forcing the caller to reverse-engineer meaning from loosely formatted content. This is a much better fit for business workflows, where downstream systems and agents often need structured deliverables rather than conversational prose alone.

The relationship among these three concepts is straightforward once the workflow is viewed clearly. Messages are for direct exchanges. Tasks are for delegated work with lifecycle. Artifacts are the resulting deliverables or outputs associated with that work. The protocol becomes more expressive because it acknowledges that not all agent interactions are the same shape. That expressiveness helps the architecture stay honest. Quick consultation stays quick. Long-running work stays explicit. Deliverables stay structured.

A simple message exchange can be shown as a JSON-based request in which a coordinating agent asks a specialist whether a case fits a certain operational pattern. The key point is that the receiving agent can respond directly without modeling a full task lifecycle.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "msg-101",
  "method": "message/send",
  "params": {
    "message": {
      "role": "requester",
      "parts": [
        {
          "type": "text",
          "text": "Does this chargeback case require manual compliance review?"
        }
      ]
    }
  }
}
```
<!-- p. 53: el bloque anterior empieza en la p. 52 y termina en esta página desde "\"text\": \"Does this chargeback...\"" -->

This shows the simplest correct form of a message-based request. The caller is consulting the specialist directly. The semantics are immediate enough that the receiving agent can evaluate the request and respond without turning it into a separately tracked work unit.

A more robust version carries domain context in a structured way so the remote agent can make a better decision without relying on hidden assumptions.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "msg-101",
  "method": "message/send",
  "params": {
    "message": {
      "role": "requester",
      "parts": [
        {
          "type": "text",
          "text": "Review whether this chargeback case requires manual compliance review."
        },
        {
          "type": "data",
          "data": {
            "caseId": "CB-44027",
            "amount": 850.00,
            "riskFlag": true,
            "accountRegion": "enterprise"
          }
        }
      ]
    }
  }
}
```

The difference is not that the message becomes a task. It remains a message, but it now carries better structured context. This helps the remote agent respond more accurately and makes the exchange easier to trace and govern.

A task exchange looks different because the caller is delegating work that may take time to complete. The next example shows a coordinator asking a specialist review agent to analyze a dispute and produce an outcome.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "task-201",
  "method": "tasks/create",
  "params": {
    "task": {
      "kind": "dispute-review",
      "input": {
        "disputeId": "D-88420",
        "customerId": "C-10931",
        "reason": "duplicate-charge"
      }
    }
  }
}
```

This is the simplest correct task model. The work is identified as a specific kind of domain task with structured input. The receiving agent can now accept and manage that work according to its own lifecycle logic rather than pretending it is a quick reply.

A more robust version adds metadata that improves traceability and downstream coordination while keeping the task boundary intact.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "task-201",
  "method": "tasks/create",
  "params": {
    "task": {
      "kind": "dispute-review",
      "input": {
        "disputeId": "D-88420",
        "customerId": "C-10931",
        "reason": "duplicate-charge",
        "amount": 850.00
      },
      "metadata": {
        "requestingAgent": "support-coordinator",
        "priority": "high",
        "caseReference": "CASE-77210"
      }
    }
  }
}
```
<!-- p. 54: el bloque anterior empieza en la p. 53 y termina en esta página desde "\"input\": {" -->

The richer version is better suited to real enterprise workflows because the task now carries information that improves routing, prioritization, and audit clarity. The remote agent still owns the work, but the calling side has given it cleaner operational context.

The task response should reflect that the work has entered a lifecycle rather than finished immediately. A returning task identifier and state help the caller track what happens next.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "task-201",
  "result": {
    "task": {
      "id": "review-9901",
      "state": "in_progress"
    }
  }
}
```

That response is a major difference from a message exchange. The caller now knows there is a durable unit of work with an identity. This allows the workflow to treat the delegated review as a tracked process rather than as a vanished remote action.

A more robust response can expose status with greater precision and support downstream handling more cleanly.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "task-201",
  "result": {
    "task": {
      "id": "review-9901",
      "state": "in_progress",
      "statusMessage": "Billing evidence is being evaluated",
      "createdAt": "2026-03-30T11:04:00Z"
    }
  }
}
```

This gives the caller a better operational picture. Even if the task is not done, the system can tell that work has been accepted and is progressing meaningfully.

Artifacts become visible once the task produces an output. The next example shows a completed task returning an artifact that contains a structured review result.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "task-status-201",
  "result": {
    "task": {
      "id": "review-9901",
      "state": "completed",
      "artifacts": [
        {
          "name": "review-decision",
          "parts": [
            {
              "type": "data",
              "data": {
                "decision": "approve-refund",
                "confidence": "high",
                "reason": "Duplicate settlement confirmed"
              }
            }
          ]
        }
      ]
    }
  }
}
```
<!-- p. 55: el bloque anterior empieza en la p. 54 y cierra en esta página con la última llave -->

This is a very important pattern. The output is not buried in a line of narrative text. It is presented as an artifact with structured content. That makes the result easier for the calling side to inspect, log, pass onward, or use in a subsequent workflow step.

A more robust artifact can carry several parts, including human-readable explanation and machine-readable structured data, which is often the best combination for multi-agent workflows.

JSON

```json
{
  "jsonrpc": "2.0",
  "id": "task-status-201",
  "result": {
    "task": {
      "id": "review-9901",
      "state": "completed",
      "artifacts": [
        {
          "name": "review-decision",
          "parts": [
            {
              "type": "data",
              "data": {
                "decision": "approve-refund",
                "confidence": "high",
                "reasonCode": "duplicate-settlement",
                "caseReference": "CASE-77210"
              }
            },
            {
              "type": "text",
              "text": "The charge was posted twice within the settlement window. Refund approval is recommended."
            }
          ]
        }
      ]
    }
  }
}
```

This richer artifact is often the more useful enterprise pattern because it supports both machine flow and human review. A downstream agent can consume the structured decision, while an operator or audit process can read the explanatory text.

The message-task-artifact model also improves observability. A system can tell whether an interaction was a quick consultation, a delegated work item, or a completed deliverable. This is much harder when every exchange is flattened into generic request-response traffic. The clearer the interaction unit, the clearer the monitoring and troubleshooting story becomes. That matters a great deal once the system handles nontrivial traffic and failure scenarios.

It also improves responsibility boundaries. If one agent sends a message, it is still largely responsible for its own workflow and is just asking for help or information. If it creates a task with a remote agent, it is delegating a unit of work that the specialist now owns within its domain. If the remote agent returns an artifact, it is delivering a concrete outcome that can be treated as part of the larger business process. These distinctions matter because they support clean accountability. Without them, agents tend to blur into each other and the workflow becomes harder to explain.

The practical strength of A2A appears here very clearly. It does not just let agents communicate. It lets them communicate in a way that matches the shape of real work. Immediate questions can stay immediate. Long-running reviews can remain trackable tasks. Useful outputs can arrive as artifacts that other agents and systems can process. This is what allows multi-agent collaboration to move beyond loose conversational handoffs and become a structured part of enterprise operations.

## 5.4: Routing Work Between Specialist Agents Without Losing Control

Multi-agent systems become valuable when work can be routed to the right specialist at the right time. They become dangerous when that routing turns into uncontrolled delegation. The challenge is not finding reasons to involve another agent. In any nontrivial environment, there are plenty of good reasons to
<!-- p. 56 -->
do that. The real challenge is preserving control when specialist routing becomes common. That means preserving clarity about why the work was routed, which agent was chosen, under what identity and policy context the routing occurred, what the specialist was allowed to do, and how the outcome fits back into the larger workflow.

The first requirement is domain clarity. Specialist agents should exist for recognizable reasons. One agent handles claims review. Another handles fulfillment exceptions. Another handles policy interpretation for procurement. When those boundaries are clear, routing can be grounded in domain ownership rather than vague similarity between prompts or endpoint names. This matters because poor routing usually starts with poor domain modeling. If several agents appear to do roughly the same thing, the routing layer has no reliable basis for choosing among them. The result is inconsistency and duplication.

A good routing model therefore depends on good discovery and good contracts. The coordinating layer must be able to inspect the available specialists and understand their skills, interaction styles, and trust status. This is why agent cards matter so much. They make specialist routing a governed selection problem rather than a prompt guess. If the billing review agent declares that it handles dispute review tasks and returns structured decision artifacts, the router has a meaningful basis for selection. Without that explicitness, routing often degrades into heuristics that are hard to justify or maintain.

Control also depends on preserving the difference between consultation and delegation. Not every specialist interaction should transfer ownership of a unit of work. Sometimes the caller only needs a quick answer or recommendation and remains responsible for the overall task. In other cases the caller genuinely needs another agent to own a domain-level review or analysis. Routing logic should distinguish between these situations because the control implications differ. Consultation may involve a message exchange. Delegation may involve creating a task and tracking its lifecycle. If the routing layer treats every remote call the same way, it becomes harder to govern the workflow properly.

Another critical issue is identity propagation. When one agent routes work to another, the system needs to know under what authority that work is being carried. The receiving specialist may need to know whether the request is on behalf of a specific user, whether the request comes from a trusted coordinator acting within its own scope, or whether there are downstream restrictions tied to the original intent. Routing without identity clarity can create serious governance problems. The specialist may act with too much authority, too little authority, or under the wrong assumptions about what it is allowed to do. This is one of the main reasons agent routing should be treated as an enterprise architecture problem rather than just a prompting technique.

Policy boundaries matter just as much. A routing layer should not assume that because a specialist exists, every caller may delegate work to it freely. Some agents may be intended only for certain domains, sensitivity classes, or workflows. Others may accept consultation messages but not action-oriented tasks from all callers. Routing therefore needs to be policy-aware. The selection of the specialist should happen within the rules established by the platform, not outside them. This is where the surrounding governance layer becomes essential. Discovery identifies candidates, but policy determines which candidates are actually eligible.

Another form of control comes from limiting fan-out. One of the easiest ways for a multi-agent system to become chaotic is for agents to route work to many other agents too casually. That can increase latency, reduce explainability, and create overlapping or contradictory outputs. A better approach is to define routing discipline. The coordinating layer should know when one specialist is sufficient, when a sequence of specialists is justified, and when the cost of more delegation outweighs the benefit. Routing should be a deliberate design choice, not an expression of uncertainty every time the workflow becomes slightly complex.

Observability is essential here. Once work is routed among specialists, the platform must still be able to show the path. It should be possible to identify which agent first received the
<!-- p. 57 -->
request, which specialist it chose, whether the exchange was a message or a task, what artifacts came back, and where the workflow proceeded next. Without this visibility, delegation quickly becomes opaque. Teams know that the outcome came from somewhere in the network, but they cannot see the reasoning path with enough clarity to debug, govern, or improve it. Controlled routing therefore depends on runtime visibility just as much as it depends on good selection logic.

There is also a subtle design point about keeping the router from becoming too intelligent in the wrong way. A routing agent or broker needs enough knowledge to choose well, but it should not absorb every piece of domain logic that the specialists are meant to own. If the router starts evaluating claims, interpreting policies, and synthesizing outcomes before delegating, the benefits of specialist architecture begin to collapse. The router should know how to identify the right specialist, not how to do the specialist's job. This is one of the healthiest constraints in multi-agent design because it preserves modularity and keeps domain expertise where it belongs.

The reverse problem also exists. If the router is too weak and delegates based only on superficial keyword matches or shallow descriptions, it will make poor selections. The answer is not to make it omniscient. The answer is to improve the quality of specialist contracts and routing signals. Better agent cards, better skill descriptions, better policy metadata, and better observations of routing outcomes can raise routing quality without turning the coordinating layer into a hidden domain monolith. That balance is important. Control does not come from centralizing everything. It comes from centralizing the right decisions at the right level.

A useful pattern in practice is to route based on domain fit first, then interaction type, then policy eligibility. The system asks which specialist owns this kind of work, whether this should be a message or a task, and whether the route is allowed in the current context. Thinking this way keeps routing grounded in architecture rather than convenience. It also helps avoid the common mistake of choosing a specialist purely because it happens to be reachable or because its description sounds broadly related.

Specialist routing also benefits from explicit completion semantics. When work is sent to another agent, the caller should know what counts as completion. Is the specialist expected to return a recommendation, a final decision, a generated artifact, or an actionable next-step package. If that expectation is vague, the receiving agent may deliver something that is technically useful but operationally awkward. Clear task and artifact contracts help solve this, but the routing layer should also participate by knowing what kind of result is needed before it chooses the specialist. This improves workflow coherence and reduces needless follow-up exchanges.

Another important form of control is limiting recursive delegation. In a complex network, one specialist may itself delegate to another. That can be perfectly reasonable, but it should not become unbounded. If agents route work to other agents with no visibility or guardrails, the network can become hard to predict and harder to govern. The platform should therefore have rules or at least strong observability around delegation depth, approved downstream collaborators, and when escalation back to a coordinating layer is preferable to continued peer delegation. Multi-agent flexibility is useful, but uncontrolled recursion is not.

Human review boundaries also belong in this discussion. Some specialist routing decisions should end with a human checkpoint rather than another automated step. For example, a compliance agent may produce an artifact that must be reviewed by a person before any customer-facing action is taken. Routing control should preserve these boundaries rather than allowing every specialist output to flow automatically to the next agent. This is especially important in high-stakes or policy-sensitive domains. Delegation should not erase the human control points that the broader system requires.

The practical objective is to make routing explainable. A well-controlled multi-agent system should be able to answer why a particular specialist was chosen, what task it was given, under what permissions the work proceeded, what it returned, and how that result influenced the rest of the workflow. If those answers are available, routing is probably under control. If those answers require reconstructing hidden prompt decisions or inferring behavior from partial logs, the system is already drifting toward opacity.

A2A helps with this because it gives routing a clearer structure. Specialists can be discovered through cards, addressed through defined interaction contracts, engaged through messages or tasks, and evaluated through artifacts and state. That structure does not eliminate the need for governance, but it makes governance possible at the right level. The routing layer can use published contracts instead of private assumptions. The platform can observe actual agent-to-agent exchanges instead of treating them as invisible internal magic. The resulting architecture is more modular, but also more accountable.

This is the real promise of A2A in multi-agent workflows. It allows specialist delegation without forcing the system to surrender control. Work can move to the right domain expert. Tasks can remain trackable. Outputs can stay structured. Routing decisions can remain visible and governable. That is what makes multi-agent architecture practical in enterprise settings. Not merely that several agents exist, but that they can collaborate through explicit contracts while the platform still knows who did what, why it happened, and how the result moved through the broader workflow.
