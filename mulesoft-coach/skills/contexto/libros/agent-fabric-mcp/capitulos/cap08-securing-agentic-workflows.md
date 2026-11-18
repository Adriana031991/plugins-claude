---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 8
titulo: "Securing Agentic Integration Workflows"
paginas_pdf: "80-91"
temas: [agent-fabric]
transcrito: 2026-11-15
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 80, debajo del recuadro con el que termina el capítulo 7, y termina en el recuadro destacado de la p. 91 (unido al último párrafo).
- El código se copia tal cual. En Python y Sentinel la sangría de la imagen no es exacta; se ordenó según la estructura. Las líneas partidas por el ancho de columna se unieron. El libro rotula dos bloques como "Sentinel" (lenguaje de políticas de HashiCorp).
-->

# Chapter 8: Securing Agentic Integration Workflows

<!-- p. 80 -->
Security in agentic integration is not a side concern that can be added after the workflow already works. It is part of the workflow's design from the beginning. The reason is simple. Agents do not only read data and generate text. They retrieve context, invoke tools, delegate work, carry user intent across boundaries, and sometimes initiate actions with business impact. That means the security model has to account for more than whether an endpoint is technically protected. It has to answer who is acting, under what authority, through which pathway, with access to which capabilities, and under what rules the system will allow or deny the next step.

This gets harder as soon as several protocol layers and runtime components are involved. A user may initiate a request through one interface, a broker may interpret the request, an MCP server may provide tools and resources, a specialist agent may receive delegated work through A2A, and a final action may be executed against a downstream business system. If security is handled casually at any point in that path, the system can appear functional while quietly losing control of identity, authority, and accountability. The same request that looks convenient from the outside may in reality be crossing trust boundaries with far too much implicit permission.

The strongest way to think about security in this kind of architecture is to treat every important boundary as a decision point. When an agent uses an MCP capability, a decision is being made about whether that capability should be visible and callable in the current context. When a broker delegates to a specialist, a decision is being made about whether the remote agent is trusted to handle that kind of work. When a downstream action is triggered on behalf of a user, a decision is being made about whether the carried identity and permissions are sufficient for that action. Security lives in those decisions. A
<!-- p. 81 -->
protected transport or a valid token alone is not enough if the broader authority model is not sound.

This chapter explains that authority model in practical terms. The first section covers authentication and authorization across agent and MCP boundaries, because multi-step workflows do not become safe just because the first hop was authenticated correctly. The second section examines trusted agent identity, token exchange, and on-behalf-of flows, which are essential once work moves through more than one actor or protocol boundary. The third section turns to policy-based tool protection, because tool exposure is one of the most powerful and risky parts of agentic integration. The fourth section addresses token misuse, overreach, and unintended capability exposure, which are among the most common and damaging failures in immature agent systems.

The most important point running through the whole discussion is that security has to match the structure of the architecture. If the workflow contains brokers, specialists, MCP servers, resources, and downstream systems, the security model has to acknowledge those pieces as distinct participants with distinct responsibilities. A single oversized trust model will not hold. The system needs clear authentication, precise authorization, constrained capability exposure, disciplined token handling, and enough observability to show what authority was exercised at each stage. When that is done properly, the architecture remains powerful without becoming reckless. That is the standard that matters.

## 8.1: Authentication and Authorization Across Agent and MCP Boundaries

Authentication and authorization are closely related, but in agentic integration they should never be treated as the same thing. Authentication establishes who or what is making a request. Authorization determines what that authenticated party is allowed to do in the present context. When workflows move across agents, brokers, MCP servers, and downstream systems, both questions must be answered repeatedly and consistently. A system that authenticates well at the edge but authorizes loosely inside the network will still create serious risk. The reverse is also true. Fine-grained authorization rules are not useful if the system cannot reliably establish who is acting at each boundary.

Across agent and MCP boundaries, the first security task is to identify the principal behind the request. That principal may be a user, a service identity, an agent runtime, or a broker acting under delegated authority. The boundary matters because the identity that is appropriate at one layer may not be sufficient at another. A user-facing assistant may authenticate the human requester correctly, but the MCP server still needs to know whether the request is arriving through a trusted client, under what scopes, and whether it is authorized to expose the requested tool or resource. An authenticated session at the front door does not automatically authorize every internal operation. The authorization model has to travel with enough meaning to remain enforceable.

One of the most common mistakes in early agentic systems is to collapse these distinctions into a single blanket trust model. The system authenticates the agent platform once and then assumes everything behind it is safe to expose. This is convenient during prototypes, but it is a weak production model. It removes meaningful boundaries between general agent access and specific capability access. An MCP server that exposes powerful tools should not rely only on the fact that the caller is some trusted platform component. It should know what specific principal or delegated authority is being asserted and whether the requested operation fits the current scope and policy.

This is where boundary-aware authorization becomes essential. Every major interaction in the workflow should be treated as a fresh policy decision, even if it occurs inside a larger trusted session. When a broker calls an MCP server to retrieve customer information, the MCP boundary should be able to confirm that the broker is authenticated and that its presented authority allows access to that resource for the current task. When the same broker later tries to invoke a write-capable tool, the authorization decision should be evaluated again rather than
<!-- p. 82 -->
assumed to be identical. The platform may let the broker read a profile but not submit a refund. These are different permissions and should remain so.

Authentication across these boundaries should therefore be explicit and verifiable. The calling party should present credentials that the receiving component can validate, and the receiving component should associate those credentials with a known identity model. In most serious deployments, this means token-based authentication tied to an identity provider or equivalent trust infrastructure. What matters operationally is that the receiver is not inferring identity from weak signals such as network location alone or from the fact that the call originated somewhere inside the internal environment. Internal network location is not a substitute for authentic identity in an agent network.

The example below shows a small Python handler that validates a bearer token before serving an MCP request. The purpose is not to implement a full identity system, but to show how an MCP boundary should treat authentication as an explicit step rather than as an ambient assumption.

Python

```python
from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

def validate_token(token: str) -> dict:
    if token == "trusted-platform-token":
        return {"subject": "support-broker", "scopes": ["profile.read", "orders.read"]}
    raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/mcp")
def handle_mcp_request(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1]
    principal = validate_token(token)

    return {"authenticatedAs": principal["subject"]}
```

This is the simplest correct pattern. The request is not allowed through until the token is checked and associated with a principal. Even this small example is already better than relying on implicit platform trust.

A more robust version does more than confirm authenticity. It distinguishes the principal's scopes and applies an authorization decision to a specific MCP method being requested. That is much closer to the real problem in agentic integration.

Python

```python
from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()

def validate_token(token: str) -> dict:
    if token == "trusted-platform-token":
        return {
            "subject": "support-broker",
            "scopes": ["profile.read", "orders.read"],
            "client_type": "broker"
        }
    if token == "ops-admin-token":
        return {
            "subject": "ops-admin",
            "scopes": ["profile.read", "orders.read", "refund.write"],
            "client_type": "admin"
        }
    raise HTTPException(status_code=401, detail="Invalid token")

def authorize(principal: dict, method: str) -> None:
    method_scope_map = {
        "resources/read_customer_profile": "profile.read",
        "tools/get_order_details": "orders.read",
        "tools/submit_refund": "refund.write"
    }

    required_scope = method_scope_map.get(method)
    if required_scope is None:
        raise HTTPException(status_code=403, detail="Unknown or disallowed method")

    if required_scope not in principal["scopes"]:
        raise HTTPException(status_code=403, detail="Insufficient scope")

@app.post("/mcp")
async def handle_mcp_request(request: Request, authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1]
    principal = validate_token(token)

    body = await request.json()
    method = body.get("method", "")

    authorize(principal, method)

    return {
        "authenticatedAs": principal["subject"],
        "authorizedFor": method
    }
```
<!-- p. 83: el bloque anterior empieza en la p. 82 y termina en esta página desde "raise HTTPException(status_code=401, detail=\"Missing bearer token\")" (dentro de handle_mcp_request) -->

The difference is important. The second version does not stop at establishing identity. It uses that identity to decide whether the specific requested operation is allowed. This is the level of discipline required across agent and MCP boundaries if tool and resource exposure is going to remain safe.

The same principle applies when a broker calls another agent through A2A. The remote agent should authenticate the caller as a known participant, not just accept that the call came from somewhere inside the network. Once authenticated, the remote agent should authorize the requested task kind according to the caller's allowed role and delegated authority. A support coordinator may be allowed to request billing review tasks but not to trigger compliance override tasks. Those decisions belong at the receiving boundary, not only at the origin point of the workflow.

This leads to a useful rule of thumb. Authentication should be transitive only in identity lineage, not in permission. In other words, the system should be able to trace the call back to an originating principal or delegated chain, but each boundary should still make its own authorization decision rather than assuming all upstream permissions automatically apply downstream. This keeps the network from turning into a giant trust bubble where any authenticated participant can effectively do anything once inside.

MCP boundaries deserve special care because they often expose both read and write capabilities. Resources, prompts, and low-risk tools may look similar from a protocol perspective, but they do not carry the same authorization meaning. A profile read should not be treated the same way as a payment change or a case submission. If the MCP server does not distinguish these operations in its authorization model, the system will eventually overexpose something important. Good authentication identifies the caller. Good authorization differentiates what the caller can actually use.

There is also a context dimension. Authorization decisions should not rely only on static identity and scope. In many cases, they should also reflect the current task, the current channel, the sensitivity of the target resource, or whether the request is operating on behalf of a specific user. This is where boundary-aware policy becomes more sophisticated. A broker may have general permission to retrieve profile data, but only when it is handling a valid support workflow. It may be allowed to view partial profile information for one class of request and fuller information for another. These are subtle but important distinctions, and they only work if the architecture treats authorization as an active decision at each boundary.

The main practical benefit of this approach is that it keeps the authority model legible. When a question arises about why a certain tool was available or why a particular task was accepted by a specialist, the platform can answer by pointing to the authenticated principal and the authorization decision made at that boundary. This is much stronger than saying the platform as a whole was trusted. It makes the workflow explainable in security terms, which is essential once the system begins to handle sensitive data or high-impact actions.

Authentication and authorization across agent and MCP boundaries are therefore not just implementation details. They are what keeps the workflow from collapsing into implicit trust. Each major participant in the network should know who is calling, under what authority the call is being made, and whether the requested operation fits the current policy. When that is done properly, security becomes an active structural property of the workflow rather than a thin shell around its outermost edge.

<!-- p. 84 -->
## 8.2: Trusted Agent Identity, Token Exchange, and On-Behalf-Of Flows

As soon as an agentic workflow involves more than one runtime actor, identity becomes more complicated. A user may start the process, but the actual work may pass through a broker, an MCP server, one or more specialist agents, and finally a downstream business service. The key security question is no longer only who authenticated at the beginning. It becomes whose authority is being exercised at each step and how that authority is represented, constrained, and verified as the work moves through the system. This is the problem trusted agent identity is meant to solve.

Trusted agent identity means that the system can carry an identity chain through the workflow without losing clarity about the difference between the original requester and the software actors handling the task. That distinction matters because the broker, the specialist, and the MCP server are not the same principal as the user, even when they are acting for the user's benefit. If the system blurs those roles, it becomes hard to know who authorized what and difficult to prevent software components from acting with more authority than they should have. A clean design preserves both identities. It knows the human or originating subject and the service or agent identity currently handling the operation.

Token exchange is one of the main mechanisms for making that possible. Instead of passing the original user token unchanged through every internal boundary, the platform can exchange it for a more appropriate token for the next hop. That downstream token can retain important identity claims about the original subject while also being constrained for the specific receiving service or agent. This reduces risk because each hop receives a token intended for it rather than a powerful token that was originally minted for something else. It also makes the delegation path more explicit because the exchanged token can reflect that a trusted intermediary is now acting on behalf of the original subject.

This is especially important in on-behalf-of flows. In these flows, the system is not claiming that the broker or specialist is the original user. It is claiming that the broker or specialist is acting with delegated authority on behalf of that user within a defined scope. That is a much stronger and more defensible pattern than simply forwarding the user's original credential everywhere. The receiving system can inspect both the delegated context and the service identity that presented it. This supports cleaner auditability and more precise authorization.

The following Python example shows the simplest correct shape of a token exchange helper. It accepts an incoming token and returns a downstream token scoped for a specific target service.

Python

```python
def exchange_token(incoming_token: str, target_audience: str) -> dict:
    if incoming_token != "user-session-token":
        raise ValueError("Invalid incoming token")

    return {
        "access_token": f"obo-token-for-{target_audience}",
        "audience": target_audience,
        "subject": "user-123"
    }
```

This small example captures the basic idea. The downstream token is not the same thing as the incoming token. It is a derived credential for a specific audience. Even at this level, the design is already better than passing the original token unchanged to every service.

A more robust version preserves more context and makes the delegation relationship visible rather than implicit.

Python

```python
def exchange_token(incoming_token: str, target_audience: str, actor: str) -> dict:
    if incoming_token != "user-session-token":
        raise ValueError("Invalid incoming token")

    return {
        "access_token": f"obo-token-for-{target_audience}",
        "audience": target_audience,
        "subject": "user-123",
        "actor": actor,
        "scopes": ["profile.read", "orders.read"],
        "delegation_type": "on-behalf-of"
    }
```
<!-- p. 85: el bloque anterior empieza en la p. 84 y termina en esta página desde "\"actor\": actor," -->

The value of the stronger version is that it preserves more of the security meaning. The target audience is explicit, the original subject remains visible, the current acting software identity is recorded, and the downstream scopes are constrained. That is much closer to the kind of identity handling needed in real agentic workflows.

A broker using such a token exchange flow can then call an MCP server or another agent without overexposing the user's original credential. The receiving component sees a token intended for it, not a generic token intended for some other part of the platform. This reduces the risk of confused authority and also makes the system's trust model more transparent. Each receiving boundary can validate that the token was meant for it and inspect the delegated context properly.

The next example shows a small Python orchestration function that accepts an inbound user token, exchanges it for a service-specific token, and then uses that token to call an MCP endpoint.

Python

```python
import requests

def call_customer_profile_service(user_token: str, customer_id: str) -> dict:
    obo_token = exchange_token(
        incoming_token=user_token,
        target_audience="customer-profile-mcp",
        actor="support-broker"
    )

    headers = {
        "Authorization": f"Bearer {obo_token['access_token']}"
    }

    response = requests.post(
        "https://mcp.internal/customer-profile",
        headers=headers,
        json={
            "method": "resources/read_customer_profile",
            "params": {
                "customerId": customer_id
            }
        },
        timeout=5
    )
    response.raise_for_status()
    return response.json()
```

This is the simplest correct pattern for using the exchanged token downstream. The broker does not pass the original user token directly. It exchanges it first and then presents the narrower token to the receiving service. This is a much safer design in environments where several services and agents participate in the workflow.

A more robust version shows how the broker can exchange different tokens for different audiences in the same workflow while preserving the delegated identity chain cleanly.

Python

```python
import requests

def call_customer_profile_service(user_token: str, customer_id: str) -> dict:
    obo_token = exchange_token(
        incoming_token=user_token,
        target_audience="customer-profile-mcp",
        actor="support-broker"
    )

    headers = {
        "Authorization": f"Bearer {obo_token['access_token']}"
    }

    response = requests.post(
        "https://mcp.internal/customer-profile",
        headers=headers,
        json={
            "method": "resources/read_customer_profile",
            "params": {
                "customerId": customer_id
            }
        },
        timeout=5
    )
    response.raise_for_status()
    return response.json()

def delegate_billing_review(user_token: str, dispute_id: str) -> dict:
    obo_token = exchange_token(
        incoming_token=user_token,
        target_audience="billing-review-agent",
        actor="support-broker"
    )

    headers = {
        "Authorization": f"Bearer {obo_token['access_token']}"
    }

    response = requests.post(
        "https://agents.internal/billing-review",
        headers=headers,
        json={
            "method": "tasks/create",
            "params": {
                "task": {
                    "kind": "dispute-review",
                    "input": {
                        "disputeId": dispute_id
                    }
                }
            }
        },
        timeout=5
    )
    response.raise_for_status()
    return response.json()
```
<!-- p. 86: el bloque anterior empieza en la p. 85 y termina en esta página desde "def delegate_billing_review(" -->

The stronger version shows a realistic identity pattern. The same incoming user session leads to different downstream tokens for different targets. Each target receives a token appropriate for its own audience and scope. This is how the platform keeps authority constrained even as the workflow crosses several components.

On-behalf-of flows also improve auditability. When a downstream system records an action, it should be able to distinguish between the original subject and the acting software component. For example, a case update may show that the support broker acted on behalf of a named user within a particular workflow. That is much more useful than an audit trail that records only the broker or only the user. The combined identity tells the true story of the action. It makes the workflow understandable after the fact, which is essential for support, compliance, and incident response.

The identity model should also account for situations where the software actor's own authority matters independently of the user. Some actions may require both delegated user context and agent-level trust. A specialist may only accept tasks from certain brokers even if the broker is acting on behalf of a valid user. This is a healthy design. It means that both parts of the chain matter. The user identity explains why the task exists. The agent identity explains which software actor is trusted to present it. Losing either piece weakens the security model.

Another benefit of token exchange is that it makes revocation and scope reduction more manageable. If a broker is issued a downstream token for one specific MCP service, that token can be limited in scope, lifetime, and audience. If something goes wrong, the blast radius is smaller than it would be if the broker were carrying and forwarding the original upstream token everywhere. This is one of the strongest practical reasons to avoid token passthrough as a default pattern. Tokens should be treated as purpose-bound credentials, not as reusable travel documents for the entire workflow.

The same discipline applies in A2A flows. A specialist agent should not simply trust that because the broker is known, every task it sends is valid under any authority. The specialist should inspect the presented token, confirm that it was issued for that audience, understand which subject it represents, and apply task-level authorization rules accordingly. This preserves meaningful control at the delegation boundary. It also prevents one trusted intermediary from becoming an uncontrolled channel into every downstream specialist.

Trusted agent identity therefore depends on three habits working together. The system should preserve the distinction between original subject and current actor. It should exchange tokens for each meaningful downstream audience rather than passing one broad token everywhere. It should use on-behalf-of semantics where delegation is intended rather than pretending that the software actor is the user or that the user token belongs equally at every hop. When these habits are present, the workflow's authority model becomes much cleaner. It becomes possible to explain who asked, who acted, and why each receiving service accepted the request.

<!-- p. 87 -->
This is one of the strongest signs that an agentic integration platform is being secured seriously rather than cosmetically. The system does not merely authenticate once and hope the rest of the network stays honest. It carries identity deliberately, constrains authority at each hop, and preserves enough information that delegation remains visible and auditable. That is how trusted agent identity should work in practice.

## 8.3: Protecting Tool Access with Policy-Based Controls

Tools are one of the most powerful parts of an MCP-enabled architecture, and that is exactly why they need strong protection. A tool is not just a piece of metadata describing a possible action. It is an exposed operational capability. Some tools are harmless enough, such as read-only lookups or low-risk utility functions. Others can initiate service requests, update records, or trigger workflows with real business impact. If the platform exposes tools too broadly or governs them too weakly, the network can become capable in all the wrong ways. Policy-based control is what keeps tool exposure aligned with trust, context, and purpose.

The first thing policy needs to decide is visibility. Not every client or agent should even see every tool. If a support-facing broker has no business submitting financial adjustments, it is better that the corresponding tools are not visible to it at all. Hiding tools is not merely about convenience. It is a security control. An unavailable tool cannot be selected accidentally, described loosely in prompts, or invoked through misuse. Policy-based access should therefore shape the visible surface of MCP capabilities, not only block requests at execution time after the tool has already influenced the calling logic.

The second decision is usage. Some tools may be visible but callable only under certain conditions. A read-only troubleshooting tool may be available to a support coordinator throughout a session, but a write-capable tool for compensation approval may be available only when additional attributes are present, such as a specific role, a workflow state, or a trusted network path. This is where policy becomes contextual rather than static. It does not only ask who the caller is. It asks whether the current request context justifies access to the tool right now.

Policy-based controls are especially important in agent systems because tool choice is part of runtime behavior. An agent or broker may dynamically decide which capability to invoke. If the exposed tool set is broader than it should be, the system's decision surface becomes riskier. The goal of policy is not only to stop malicious use. It is also to reduce the risk of misselection, overbroad action, or accidental escalation caused by an overly permissive tool surface. Strong policy simplifies the decision space. It makes the safe path easier for the workflow to follow.

One useful pattern is to separate policy into global exposure rules and finer-grained contextual rules. Global exposure rules determine which tools exist for a given class of caller at all. Contextual rules determine whether a visible tool may be used in the current request. This separation is healthy because it keeps the broad shape of the capability surface manageable while still allowing more precise controls on top. Without the first layer, tool catalogs become noisy and risky. Without the second, important action boundaries remain too coarse.

The example below shows a simple policy file that allows two tools and denies one based on a caller role. The syntax uses a policy language format suited to access-control logic.

Sentinel

```sentinel
import "strings"

caller_role = input.caller.role
tool_name = input.request.tool

allowed = false

if caller_role is "support-broker" and (tool_name is "read_customer_profile" or tool_name is "get_order_details") {
  allowed = true
}

main = rule {
  allowed
}
```
<!-- p. 88: el bloque anterior empieza en la p. 87 y cierra en esta página con la última llave -->

This is the simplest correct policy. It decides whether the caller may use a tool based on role and tool name. Even this small rule is useful because it reduces exposure to the tools the caller actually needs.

A more robust version adds contextual conditions so that write-capable access is allowed only when the request carries the right workflow attributes.

Sentinel

```sentinel
import "strings"

caller_role = input.caller.role
tool_name = input.request.tool
workflow_state = input.request.workflow_state
case_priority = input.request.case_priority

allowed = false

if caller_role is "support-broker" and (tool_name is "read_customer_profile" or tool_name is "get_order_details") {
  allowed = true
}

if caller_role is "support-broker" and tool_name is "submit_refund_request" and workflow_state is "review-approved" and case_priority is "standard" {
  allowed = true
}

main = rule {
  allowed
}
```

The stronger version illustrates the real value of policy-based control. The caller does not gain blanket access to refund submission just because it is a trusted broker. The workflow state and case characteristics must also align. This is a much safer pattern for agentic systems where tool usage is influenced by runtime reasoning.

Tool protection also benefits from tool mapping and description control. A platform may want to rename a tool as it is exposed to a certain client or reduce the description detail shown to less privileged callers. That can be useful when the internal backend capability naming is not ideal or when some descriptive information should not be broadly exposed. The important point is that policy can shape not only whether a tool is callable, but also how the tool appears at the edge of the MCP boundary. This helps the platform present a safer and more stable capability surface.

The next example shows a small Python function that filters a tool list according to a policy decision before returning it to the caller. This is the runtime counterpart to the policy logic.

Python

```python
def filter_tools_for_caller(caller_role: str, tools: list[dict]) -> list[dict]:
    allowed_tool_names = set()

    if caller_role == "support-broker":
        allowed_tool_names.update({
            "read_customer_profile",
            "get_order_details"
        })

    return [tool for tool in tools if tool["name"] in allowed_tool_names]
```

This is the simplest correct exposure filter. The caller receives only the tools that the current role is allowed to see. That alone reduces risk significantly because disallowed tools are absent from the decision surface entirely.

A more robust version adds contextual allowance for action tools without exposing them indiscriminately.

Python

```python
def filter_tools_for_caller(caller_role: str, workflow_state: str, tools: list[dict]) -> list[dict]:
    allowed_tool_names = {
        "support-broker": {
            "read_customer_profile",
            "get_order_details"
        }
    }

    if caller_role == "support-broker" and workflow_state == "review-approved":
        allowed_tool_names["support-broker"].add("submit_refund_request")

    return [
        tool for tool in tools
        if tool["name"] in allowed_tool_names.get(caller_role, set())
    ]
```
<!-- p. 89: el bloque anterior empieza en la p. 88 y termina en esta página desde "if tool[\"name\"] in allowed_tool_names.get(caller_role, set())" -->

The stronger version is useful because it reflects what good policy really looks like in practice. A write-capable tool becomes visible only when the workflow context supports it. This prevents both accidental invocation and unnecessary capability exposure.

Policy should also distinguish between read and write semantics, even when the tools may look equally simple from the outside. A read tool that exposes profile data may require identity checks and sensitivity-aware filtering. A write tool that updates a service case may require stronger authorization and audit treatment. The platform should not treat them as interchangeable just because both are tools in MCP. Policy needs to know what kind of effect the tool has and apply the right class of control. This is why tool metadata quality matters so much. The better the platform understands the tool's semantics, the better it can protect it.

Another useful practice is to make denial behavior explicit and understandable. If a tool is blocked by policy, the platform should return a clear authorization failure rather than behaving as though the tool never existed when it was already visible in the current session. Clarity matters here because the client may need to route differently, request approval, or escalate. Policy should guide that behavior by making tool availability and denial states legible enough for the orchestration layer to respond sensibly.

There is also a broader design point. Good policy-based controls should reduce the amount of tool safety logic that has to live inside prompts or ad hoc application code. If the platform can hide, allow, or deny tools based on identity and context, the workflow becomes much cleaner. The agent no longer needs to carry large instructions telling it not to use certain tools unless special conditions are met. Those conditions are enforced by the capability surface itself. This is one of the strongest reasons to invest in policy-based tool control. It moves safety from advisory text into actual system behavior.

The effect on testing is also substantial. With policy-based controls, teams can test the visible MCP surface and the allowed actions for different caller roles and workflow states. That is much more reliable than testing only the downstream outcome and hoping hidden restrictions behaved as intended. It also makes changes safer because policy logic can be reviewed and versioned as part of the platform. When a new tool is introduced or an old one changes risk profile, the exposure policy can evolve in a controlled way.

Tool protection, then, is not just about preventing obvious abuse. It is about shaping the capability surface so that the workflow has the right tools, at the right time, under the right authority, and no more. That is how powerful agentic systems stay governable. Policy-based control makes tool access explicit, contextual, and reviewable. Without it, tool exposure becomes one of the fastest ways for an otherwise well-designed network to become too permissive to trust.

## 8.4: Preventing Token Misuse, Overreach, and Unintended Capability Exposure

Many agentic security failures do not begin with an attacker defeating a carefully designed system. They begin with the system granting too much authority too broadly and then trusting that the workflow will stay well behaved. Tokens get passed farther than they should, capabilities stay visible longer than necessary, and internal components begin acting with more authority than their role actually requires. This kind of overreach is one of the most common weaknesses in immature agent platforms because it often feels efficient during early implementation. It is also one of the hardest problems to correct later if the platform has already grown around those assumptions.

Token misuse usually starts with convenience. A user authenticates once, a platform obtains a valid token, and then that token is forwarded deeper into the workflow than it was ever meant to go. The next service accepts it because it came from a trusted upstream caller. Another component caches it for
<!-- p. 90 -->
reuse. A specialist agent uses it to reach an MCP server because that was the easiest way to keep the task moving. None of this may look obviously malicious. The problem is that the token has become a roaming credential rather than a purpose-bound one. The moment that happens, the authority model begins to blur.

This is why token passthrough is such a weak default pattern. A token minted for one audience or one part of the platform should not become a generic credential for every downstream participant in the workflow. Even if the token is technically valid, it may carry scopes that are broader than the receiving component should have, or it may conceal the distinction between original subject and current actor. The system becomes harder to reason about because any component that gets the token may be able to act beyond its intended responsibility. This is how local convenience turns into systemic overreach.

Another form of misuse comes from long-lived tokens and weak lifecycle control. If tokens survive longer than the workflow actually needs, the risk surface grows. A short-lived delegated token that expires when the task is done is much safer than a broad token that remains valid well beyond the immediate use case. Short lifetimes reduce the opportunity for reuse, leakage, and accidental persistence in logs or temporary storage. This is particularly important in agentic workflows because tasks and delegated steps may span several components. The more places a token travels, the more important it becomes that its useful lifetime stay tightly bounded.

Overreach also appears when the system treats service identity as if it were equivalent to domain authority. A broker may be a trusted platform component, but that does not mean it should automatically gain access to every MCP tool or every specialist task type. Trusted platform identity should not be confused with unrestricted operational privilege. The stronger pattern is to give each software actor only the scopes and audiences it actually needs for its role. If a support broker needs read access to profile and order context, that is what it should have. If a billing specialist needs access to dispute-review inputs and internal policy resources, that is what it should have. Broad platform trust should not become a substitute for role-appropriate restriction.

Unintended capability exposure is closely tied to these token issues. Sometimes the platform technically protects a tool or resource, but exposes it in the visible surface to clients or agents that should never see it. This is risky even if invocation is later denied, because visibility influences behavior. It encourages the calling side to plan around capabilities that are not really appropriate, increases the chance of accidental misuse, and can reveal more about internal operations than necessary. The cleanest design is to avoid exposing capabilities unless the current caller and context make them genuinely relevant and permissible.

This is especially important in agentic systems because visibility is part of runtime reasoning. An agent that sees a tool may infer that the platform expects or allows its use. A broker that sees a specialist may consider routing to it even when the workflow should never do so from that path. That is why unintended exposure should be treated as a security issue, not just a catalog hygiene issue. Safe capability design requires controlling what the system can perceive as much as what it can finally invoke.

Another common source of overreach is weak separation between read and write authority. A token that allows both context retrieval and action submission may look convenient because it reduces the number of credentials the platform has to manage. It also creates a much larger blast radius. A broker that only needs to gather information should not quietly carry the ability to submit refunds or approvals. A specialist that only needs to read policy should not also be able to trigger customer notifications unless that is part of its defined role. The more the platform can separate read and write scopes, the safer the workflow becomes.

The same logic applies to specialist agents. A specialist should not inherit broad downstream rights just because the broker that called it is trusted. Delegation should carry only what the specialist needs for its own piece of the workflow. Otherwise the specialist becomes a privileged island with unclear boundaries. This is particularly dangerous when specialists are reusable
<!-- p. 91 -->
across domains. A billing review agent used in one workflow should not silently retain the ability to perform downstream actions that belong only in another. Reusable components need narrower, clearer authority, not broader inherited privilege.

Good logging and observability also play a part in preventing misuse, but they should be used carefully. Security teams and platform operators need enough information to see which identity was presented, which downstream audience a token was intended for, which capability was requested, and whether it was allowed or denied. At the same time, raw tokens themselves should not appear in logs, traces, or debug output. This is an easy mistake during development, especially when teams are trying to troubleshoot authentication issues quickly. A platform that logs credentials casually often creates a second security problem while trying to understand the first one. Safer observability captures token metadata and decision context without exposing the credential itself.

Prevention also depends on disciplined storage and handling. Tokens should not be persisted in general-purpose session stores unless the design truly requires it and the storage is appropriately protected. Temporary in-memory use is usually safer than broad reuse across unrelated requests. MCP clients, brokers, and specialist agents should all avoid treating tokens as reusable convenience objects. A token should be obtained for a purpose, used for that purpose, and allowed to expire or be discarded when that purpose is complete. The architecture should encourage this pattern instead of fighting it.

Another valuable habit is audience checking at every receiving boundary. A downstream service or agent should validate that a token was actually intended for it rather than simply accepting any token issued by a trusted authority. This prevents one service's token from being reused against another. It also reinforces the design principle that tokens are destination-specific credentials. Without audience checks, even a short-lived token exchange model can be weakened because any downstream component may accept tokens that were never meant for it.

Capability exposure should be reviewed with the same seriousness as token scopes. A weak but common design path is that the platform tightens token issuance while leaving tool catalogs and specialist visibility far too broad. The result is a system that looks improved but still carries unnecessary risk because the workflow continues to reason over capabilities it does not need. The safer path is to reduce both authority and visibility together. Narrower tokens and narrower capability surfaces reinforce one another. Each removes room for the other to be misused.

The broader discipline here is least privilege applied to workflows rather than just to users. In agentic integration, workflows themselves are active structures. They carry identity, choose capabilities, and route work across components. Least privilege must therefore apply to each actor and each hop in the workflow, not only to the original human user. A broker should have only the permissions and visibility needed for brokering. A specialist should have only the permissions and visibility needed for specialization. An MCP client should see only the tools and resources relevant to its task and authority. When this principle is followed consistently, overreach becomes much harder to create by accident.

This is one of the clearest markers of a mature security model. The workflow is powerful, but its power is partitioned. Tokens are purpose-bound, short-lived, and audience-specific. Delegation carries authority deliberately rather than carelessly. Capability exposure is filtered so that the system sees only what it should use. Downstream services validate the credentials they receive rather than trusting the path blindly. These habits reduce the chance that a valid credential or a visible capability becomes a gateway to behavior the architecture never actually intended.

Preventing token misuse, overreach, and unintended capability exposure is therefore not a matter of one defensive feature. It is the combined result of good identity handling, proper token exchange, strict audience validation, narrow scopes, careful tool visibility, role-aware delegation, and clean observability. When those pieces are present, the platform becomes much more difficult to misuse accidentally and much easier to explain under scrutiny. That is exactly the kind of security posture an agentic integration workflow needs if it is going to support real business operations safely.
<!-- p. 91: el final de este párrafo ("difficult to misuse accidentally ... operations safely.") aparece en el libro como recuadro destacado con letra más grande; es parte del último párrafo. Es el final del capítulo. -->
