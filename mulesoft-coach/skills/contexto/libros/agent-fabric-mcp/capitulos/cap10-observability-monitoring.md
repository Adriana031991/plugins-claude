---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 10
titulo: "Observability, Monitoring, and Operational Insight"
paginas_pdf: "103-114"
temas: [agent-fabric]
transcrito: 2026-11-16
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. En Python la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas. Las firmas de función partidas por el ancho de columna se unieron.
- Cuando un bloque de código cruza de panel o de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 103 y termina al final de la p. 114. El capítulo 11 empieza en la p. 115.
-->

# Chapter 10: Observability, Monitoring, and Operational Insight

<!-- p. 103 -->
Agentic systems do not become operationally trustworthy just because they produce good answers in controlled testing. They become trustworthy when their behavior can be seen, measured, explained, and corrected under real conditions. This is what observability and monitoring are for. In ordinary application systems, that usually means knowing whether a service is up, how fast it is responding, and where failures are clustering. In agentic integration, the scope is wider. The platform has to understand not only whether a component is healthy, but how brokers are routing, which agents are being used, which MCP servers are being invoked, how often requests fail at particular boundaries, whether delegated tasks complete on time, and whether the visible shape of the network matches the architecture that teams believe they are running.

That difference matters because agentic systems can fail in ways that are easy to miss if observability is treated like standard API monitoring with a few extra labels. A workflow may technically complete while producing poor outcomes because the broker is routing too often to the wrong specialist. A request may appear slow because one MCP server is adding latency that the coordinating layer hides by retrying. A delegated task may return an artifact that looks structurally valid but consistently causes downstream failures in the final action step. These are not failures that simple uptime checks can explain. They require a view of relationships, runtime flow, and component interaction that is much closer to the actual topology of the network.

This is one reason operational insight is so important in MuleSoft Agent Fabric. The platform is not only trying to connect components. It is trying to make the resulting network visible enough that teams can operate it intelligently. That includes knowing which brokers are central, which agents are most active, which MCP servers are generating the most load,
<!-- p. 104 -->
where error rates are rising, and where the network has begun to drift from its intended design. Without this level of visibility, agentic systems become difficult to govern over time. Teams can tell that requests are passing through the system, but not whether the system is behaving in the way the architecture assumes.

There is also a business reason to care about this. Multi-agent and tool-rich workflows often look persuasive during demonstrations because they succeed on happy paths. Production conditions are different. Requests arrive at scale, with incomplete context, with unexpected combinations of attributes, with downstream services under uneven load, and with token or routing conditions that do not always line up neatly. Observability is what turns those conditions from mystery into evidence. A platform with good operational insight allows teams to distinguish between design problems, policy problems, performance problems, and data-shape problems instead of treating every failure as just another oddity of AI behavior.

This chapter focuses on that operational layer. The first section explains what to monitor in a topology that includes agents, brokers, and MCP servers, because each component class has different operational signals that matter. The second section explains how Agent Visualizer supports runtime understanding by showing relationships and traffic patterns in a way that plain logs cannot. The third section turns to metrics, logs, and failure signals, with concrete examples of the kind of telemetry that supports diagnosis rather than noise. The fourth section addresses troubleshooting, which is where observability has to prove its value. A monitoring system is only useful to the extent that it helps teams understand broken workflows, slow calls, and misrouted requests without relying on guesswork.

The practical theme running through the entire discussion is that agentic systems need observability that matches their actual operating shape. If the architecture includes brokers, specialists, and capability providers, the telemetry must reveal how those roles interact. If the workflow can branch, delegate, and combine several protocols, the monitoring layer must show where those branches and protocol transitions occur. When that happens, the network becomes much easier to run. When it does not, teams are left with vague symptoms and partial clues, which is exactly the kind of environment in which technical debt accumulates fastest.

## 10.1: What to Monitor in an Agent, Broker, and MCP Topology

The most common mistake in monitoring agentic systems is to measure what is easiest rather than what is useful. It is easy to count requests, collect generic status codes, and track average response times. Those numbers matter, but they are not enough. In a topology with brokers, specialist agents, and MCP servers, the platform needs to know more than whether components are alive. It needs to know how work is moving through the network and whether the interaction patterns match the intended design. This changes what should be monitored and how the results should be interpreted.

At the agent level, the platform needs to observe both basic health and behavioral role. Basic health includes request volume, error rates, response times, memory and CPU behavior, and availability of any hosted endpoint or execution environment. That is the minimum. Behavioral role is what makes agent monitoring more specific. A specialist agent should be measured not only by how many requests it receives, but by what kinds of tasks it accepts, how often those tasks complete successfully, how long they take, whether their artifacts are consumed successfully downstream, and whether the pattern of usage aligns with the domain that specialist is meant to own. If a billing specialist suddenly starts receiving a high number of tasks unrelated to billing, the issue may not be local component health. It may be a routing problem upstream.

For brokers, the monitoring emphasis shifts. A broker is valuable because it coordinates. That means the platform should know how many requests the broker receives, but also how many downstream routes it creates, which destinations it chooses, how long routing decisions take, how often it retries or falls back, and what proportion of workflows end
<!-- p. 105 -->
in success, recoverable failure, or unresolved escalation. Broker observability should answer whether the broker is doing its job well, not just whether it is up. A broker can be healthy as a process and still be unhealthy as an orchestrator if it routes poorly or generates excessive retry storms against downstream services.

Monitoring broker choice patterns is particularly important. If one specialist agent receives a disproportionate share of tasks that should have been distributed across several domains, that could indicate weak routing rules, misleading metadata, or a drift in caller behavior. If brokers frequently reroute after first choice, that may indicate poor upfront decision quality. If workflows increasingly terminate at manual review even though the architecture expected automation for most cases, the problem may lie in upstream context quality, specialist contract design, or policy conditions. Monitoring at the broker layer therefore reveals not just infrastructure problems, but architecture quality problems.

MCP servers introduce yet another set of monitoring needs. Here the platform should track which tools, resources, and prompts are being requested, by which classes of callers, with what latency, and with what failure patterns. This matters because MCP servers are often the capability and context layer of the network. If one server is overloaded or returning inconsistent errors, many workflows may degrade in different ways that appear unrelated unless the MCP usage patterns are visible. A server that mostly provides read resources will usually show a different operational profile from one that hosts write-capable tools. Monitoring should reflect that difference rather than treating all MCP requests as a uniform traffic class.

Tool-level monitoring is especially useful. It is not enough to say that the MCP server handled ten thousand requests today. The platform should know which tools were used most, which tools had the highest error rates, which tools showed rising latency, and whether some tools are rarely used despite being widely exposed. This can reveal both operational and design issues. A heavily used tool with a growing failure rate is an immediate reliability concern. A rarely used but sensitive tool that stays widely visible may be a policy concern. A tool that receives many invalid requests may indicate poor naming, unclear description, or a mismatch between what the orchestrating layer thinks it does and what it actually does.

Resources and prompts deserve similar attention, though their monitoring signals differ. Resource monitoring should focus on retrieval volume, latency, cacheability where relevant, and the downstream effect of missing or stale context. If workflows fail more often when a particular resource is unavailable, that indicates how central that resource is to task grounding. Prompt monitoring is less about raw failure and more about usage pattern, change impact, and correlation with workflow quality. If a newly revised prompt leads to a rise in clarification loops or poor downstream actions, the prompt surface is now part of the operational story and should be monitored as such.

Cross-component correlation is where topology monitoring becomes most valuable. A request may start at a broker, invoke two MCP servers, delegate one task to a specialist agent, and then use another MCP tool for the final action. Each component can report local metrics, but the real insight comes from connecting those events into one workflow path. The platform should be able to ask how long this class of workflow usually takes, where most of the latency accumulates, which step most often fails, and which destination patterns correlate with success or failure. Without this kind of cross-component view, teams often chase local symptoms instead of identifying where the broader flow is actually weak.

Another critical monitoring category is identity and policy behavior. In secured agentic systems, many failures are neither purely technical nor purely functional. They are authorization failures, token audience mismatches, denied tool exposure, or route-level policy rejections. If those signals are not visible, teams may misread them as generic service failures or agent confusion. Monitoring should therefore include counts and patterns of denied requests, filtered capabilities, rewritten discovery paths, and blocked sensitive-data transfers. These are not only security metrics. They are operational indicators that
<!-- p. 106 -->
show whether the governance model is working as intended or creating unexpected friction.

Data-quality and contract-shape issues also deserve attention. Not every operational problem comes from downtime or misconfiguration. Some come from artifacts, resources, or tool outputs that are structurally valid but semantically weak. A downstream step may fail because an upstream artifact omitted a field the contract did not mark as strictly required but the consumer effectively depends on. A resource may return a shape that changed quietly after an internal backend update. Monitoring should therefore look for repeated parsing failures, unexpected null patterns, contract mismatch errors, and downstream rejection signals. These are often the first visible signs of hidden coupling or weak interface design.

It is also important to monitor negative space, not just active traffic. Unused agents, almost-never-called tools, and dormant specialist routes are meaningful. Sometimes they are harmless. Often they indicate duplication, obsolete assets, or publication that never translated into actual value. In a platform that aims for reuse, such patterns matter because they reveal whether the asset model is healthy or whether teams are publishing components that no one actually trusts or needs. Observability should help answer not only what is busy, but what is present without value.

Capacity monitoring remains relevant as well, but it should be interpreted through the topology rather than in isolation. A specialist agent under high CPU load may be the real bottleneck, or the true issue may be a broker sending too much avoidable work there because a read-heavy decision path was never optimized. An MCP server with high request volume may be functioning correctly, or it may indicate that workflows are retrieving the same resource too often because orchestration is missing a better caching or grouping strategy. In agentic systems, capacity metrics often reveal design inefficiency as much as infrastructure strain.

The overall goal is to monitor each component according to its role, then connect those role-specific signals into a topology-wide operational picture. Agents should be monitored as domain workers. Brokers should be monitored as coordinators. MCP servers should be monitored as capability providers. Policy controls should be monitored as shaping and enforcement points. When these perspectives are combined, the platform can tell a coherent story about runtime behavior. It can distinguish which failures come from bad routing, which from slow capability providers, which from policy denial, which from stale context, and which from overloaded infrastructure. That is the level of monitoring an agentic network needs if it is going to remain manageable once it grows past the earliest stages.

## 10.2: Using Agent Visualizer to Understand Runtime Relationships

Logs and metrics are necessary, but they often leave one important question unanswered. What does the network actually look like while it is running. In agentic systems, that question matters because the topology is not just static design. It is active behavior. Brokers may route more traffic to one specialist than expected. MCP servers may become central hubs for several workflows. A seemingly minor agent may quietly become a frequent dependency. A2A paths may grow in ways that are not obvious from raw logs alone. Agent Visualizer is useful because it turns those relationships into something operational teams can see and reason about directly.

A runtime relationship view provides a different kind of insight from a dashboard of averages. Instead of only showing counts and durations, it shows which assets are interacting, how often they interact, and how the shape of the network changes under load. This is important because many operational issues in agentic systems are structural. A single agent may not be failing by itself, but the pattern of traffic around it may indicate misrouting, over-centralization, or hidden dependency growth. Visual topology makes those patterns easier to spot.

The first value of Agent Visualizer is confirming whether the runtime shape matches the intended architecture. The network may have been modeled with one broker as the main entry point, two specialist agents for distinct domains, and a set of MCP servers used only by certain specialists. Over time, real
<!-- p. 107 -->
traffic may drift from that design. The broker may begin routing too many workflows through one specialist because metadata and route logic evolved unevenly. A specialist may start calling an MCP server that was supposed to remain internal to another domain. A new dependency may appear because a team added a capability quickly and never updated the design model. A runtime visualizer helps expose those drifts before they turn into harder operational or governance problems.

The second value is identifying centrality. Not every component in a network is equally important at runtime. Some become hubs, either by design or by accident. A broker is expected to be central in a certain sense, but an MCP server that suddenly becomes a hot path for many workflows deserves attention. A specialist agent that was meant for a narrow function but now sits in many common paths may also deserve scrutiny. Visual centrality matters because it often predicts operational risk. Highly connected nodes deserve stronger monitoring, stricter change control, and clearer capacity planning than quiet peripheral assets.

Agent Visualizer also helps clarify the relationship between direct capability access and delegation. A dashboard can tell you that broker request counts are rising, but it may not reveal whether that rise is being handled mostly through MCP calls, mostly through A2A tasks, or through a changing mix of both. A visual topology view can make this much more obvious. If a broker's outbound relationships shift from mostly direct MCP use to increasing specialist delegation, that may indicate new routing behavior, expanded policy checks, or changing workflow complexity. Those changes may be good or bad, but they are operationally important and should be visible.

Another practical benefit is faster investigation of strange traffic patterns. Suppose teams notice that a previously stable workflow is becoming slow. Traditional metrics might show that total latency is up and that one MCP server's response times are also slightly worse. A visualizer might reveal that the broker has also started routing to an additional specialist on the same path, doubling the effective work per request. That is a different diagnosis from simply saying the MCP server is slow. The actual issue is a path change, not only a component slowdown. Visualization often helps teams see this sooner because it presents the workflow as a relationship pattern rather than only as a pile of component-level numbers.

Agent Visualizer is also useful for understanding partial failures. A workflow may not fail entirely. It may degrade by taking alternate routes, invoking fallback specialists, or generating more retries. In logs, this can look like noise unless the investigator already suspects which components are relevant. A topology view makes it easier to see that traffic is shifting away from one agent toward another or that a broker is increasing its fan-out under certain conditions. This kind of structural symptom often precedes obvious outages. Seeing it early is operationally valuable because it gives teams a chance to intervene before the system crosses into visible instability.

The visualizer also supports governance review. Security and platform teams often need to understand not only what was called, but which relationships exist in practice. A network may have been approved on the assumption that certain components do not communicate directly, or that a specialist reaches only one MCP server. If the visual runtime graph shows new connections or unexpected path density, that can trigger useful governance questions. Was the new path intentional, is it policy-compliant, does it preserve the intended trust boundaries, and should the declarative model be updated to reflect this actual relationship. Without a visual relationship view, such questions are much harder to ask in a timely way.

Another strong use case is operational onboarding. Agentic systems tend to be harder for new engineers and operators to understand than more traditional service meshes because there is more semantic diversity in the components. One runtime node may be a broker, another an MCP server, another a specialist A2A target, and the traffic among them may depend on workflow state and task type. A visual topology helps shorten the learning curve. It shows which assets matter most, which paths are common, and which relationships are exceptional. This does not replace detailed documentation, but
<!-- p. 108 -->
it gives operators a grounded starting point that reflects current reality rather than only intended design.

There is also a subtle but important effect on decision quality. Teams are less likely to oversimplify the system when they can see its real shape. Without visualization, it is easy to talk as though one broker simply calls one agent and one MCP server. With visualization, teams may notice that the broker actually fans out to three specialists under different conditions, that one MCP server has become a near-universal dependency, or that a supposedly rare escalation route is much more common than expected. That changes how people think about reliability, policy placement, and performance tuning. The architecture becomes something observed rather than merely assumed.

Of course, a visualizer is only useful if the information it displays is trustworthy and interpretable. If the network graph is cluttered with stale assets, missing important nodes, or failing to distinguish major interaction types, it can become confusing rather than helpful. The platform therefore needs to treat the visualizer as part of operational hygiene. Published assets should be current, runtime telemetry should reflect actual governed paths, and the visual distinctions between agents, brokers, MCP servers, and other major component types should remain clear enough that viewers can interpret the graph intelligently. A visual map that tells the wrong story is worse than no map at all.

It is also important not to treat visualization as a substitute for deeper telemetry. Agent Visualizer tells you how the network is shaped and how traffic relationships look. It does not replace logs for detailed failure diagnosis or metrics for quantifying trends. The right way to use it is as a structural view that complements those other signals. A well-run operational team will often start with a visual question such as which path is this workflow taking now, then move into metrics to see where latency is growing, then into logs to inspect the specific failed requests. Each layer of visibility answers a different class of question.

Used this way, Agent Visualizer becomes much more than a helpful display. It becomes part of the system's operational vocabulary. Teams can refer to a topology change, an emerging hot path, a fallback route becoming common, or a specialist unexpectedly becoming central. These are meaningful observations because the visualizer gives them a shared basis in runtime evidence. That improves communication among architects, operators, and security teams because all of them can look at the same living map of the network and ask grounded questions about what it means.

In practice, this kind of runtime relationship view often becomes the bridge between design and operations. The declarative network shows what the platform intended to build. The visualizer shows how it is actually behaving. The distance between those two views is where some of the most important operational insight lives. If the two line up closely, the platform is stable and disciplined. If they drift, the visualizer will often be one of the first places where that drift becomes obvious. That is why it matters so much in agentic integration. It helps teams see the network as a living system, not just as a set of components with separate dashboards.

## 10.3: Capturing Metrics, Logs, and Failure Signals That Matter

Observability becomes useful only when the telemetry collected is both meaningful and interpretable. Many systems collect too much data and still fail to answer the questions operators actually need answered. Agentic integration is particularly vulnerable to this because the temptation is to log everything, count everything, and hope that enough detail will eventually reveal the problem. In practice, this creates noise faster than insight. Metrics, logs, and failure signals need to be chosen and structured in a way that reflects how the network really behaves. That means they should reveal request flow, component role, policy outcomes, delegation behavior, and the contract-level failures that actually matter.

Metrics are best used for trend and shape. They answer questions such as how many requests a broker handled, how often an MCP tool was invoked, how long a specialist took to finish a task, or how frequently a policy denied access on a
<!-- p. 109 -->
route. These are excellent questions for metrics because they are quantitative and aggregatable. Metrics are weak when used to carry high-detail narrative context. A metric can show that latency rose for one workflow class, but it should not be the only place where teams try to reconstruct why. Good metrics identify where to look next.

Logs are best used for event detail and workflow evidence. They answer questions such as which broker route was chosen for a particular request, what tool name was requested, what task identifier was assigned, which artifact type came back, which policy blocked the flow, or which field failed validation. Logs are where the platform tells the specific story of what happened. That does not mean logs should become a raw dump of every available payload. Good logs are structured and deliberate. They preserve enough context to support diagnosis without exposing sensitive content or burying teams in noise.

Failure signals sit across both categories. Some are metrics, such as rising authorization denials or spikes in task timeout rates. Some are log events, such as repeated artifact parsing failures or repeated missing-field conditions in MCP responses. The important thing is that failures should be classified in a way that makes them meaningful. A simple total error count is not enough. A workflow can fail because a broker misrouted, because an MCP server returned invalid shape, because a policy denied access, because a downstream service timed out, or because a delegated task completed with an artifact that the caller could not use. These are different failure classes and should be visible as such.

A strong telemetry model therefore begins with workflow identity. Every meaningful request should carry a correlation identifier that persists across broker routing, MCP calls, A2A task creation, task completion, and final action submission. Without this, the platform can collect a huge amount of data and still struggle to connect one event to another. Correlation is especially important in mixed-protocol workflows because direct MCP calls and A2A tasks may appear unrelated in local component logs even though they belong to the same business request. A shared workflow identifier helps tie those pieces together.

The following Python example shows a simple structured logging function that captures a broker event with correlation information and a role-aware event type.

Python

```python
import json
from datetime import datetime, timezone

def log_broker_event(correlation_id: str, route: str, status: str) -> None:
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "componentType": "broker",
        "correlationId": correlation_id,
        "route": route,
        "status": status
    }
    print(json.dumps(event))
```

This is the simplest correct version. It produces structured logs rather than free text, and it includes the minimum fields needed to understand the event in context. The log can be parsed by downstream tooling and correlated across components.

A more robust version adds more operational signals without turning the log into a raw payload dump. This keeps the event useful for diagnosis while staying disciplined about what it records.

Python

```python
import json
from datetime import datetime, timezone

def log_broker_event(
    correlation_id: str,
    route: str,
    status: str,
    duration_ms: int,
    downstream_target: str | None = None,
    policy_outcome: str | None = None
) -> None:
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "componentType": "broker",
        "correlationId": correlation_id,
        "route": route,
        "status": status,
        "durationMs": duration_ms,
        "downstreamTarget": downstream_target,
        "policyOutcome": policy_outcome
    }
    print(json.dumps(event))
```
<!-- p. 110: el bloque anterior empieza en la p. 109 y termina en esta página desde "\"correlationId\": correlation_id," -->

The difference is important. The log now tells not only what happened, but how long the step took, which downstream target was involved, and whether policy had a visible role in the outcome. This makes later diagnosis far more effective without exposing sensitive request content.

Metrics should be gathered in parallel with these logs. The following Python example shows a simple in-memory metric counter and latency tracker for MCP tool usage. The point is not the storage choice. It is the metric shape.

Python

```python
from collections import defaultdict

tool_request_count = defaultdict(int)
tool_error_count = defaultdict(int)
tool_latency_ms = defaultdict(list)

def record_tool_request(tool_name: str, latency_ms: int, success: bool) -> None:
    tool_request_count[tool_name] += 1
    tool_latency_ms[tool_name].append(latency_ms)
    if not success:
        tool_error_count[tool_name] += 1
```

This is the simplest correct metric model. It tracks volume, failure count, and latency per tool. These are often the first three signals teams need when one MCP server becomes suspicious.

A more robust version separates failure classes so the metrics say more than just success or failure. This matters a lot in agentic systems where access denial, timeout, validation error, and downstream service error mean different things operationally.

Python

```python
from collections import defaultdict

tool_request_count = defaultdict(int)
tool_latency_ms = defaultdict(list)
tool_failure_by_class = defaultdict(lambda: defaultdict(int))

def record_tool_request(tool_name: str, latency_ms: int, outcome: str) -> None:
    tool_request_count[tool_name] += 1
    tool_latency_ms[tool_name].append(latency_ms)

    if outcome != "success":
        tool_failure_by_class[tool_name][outcome] += 1
```

The stronger version is much more useful because the metrics can now distinguish, for example, between authorization denials and backend failures. Those are not the same problem, and they should not appear as the same trend.

Logs for A2A flows should also reflect the difference between message interactions and task lifecycles. A task should generate log events for creation, state change, completion, and artifact readiness, all tied to the same correlation identifier where possible. This allows operators to tell whether the specialist is failing to accept tasks, failing to complete them, or producing outputs that are causing trouble later. The following example shows a structured log event for task completion.

Python

```python
import json
from datetime import datetime, timezone

def log_task_completion(correlation_id: str, task_id: str, agent_name: str, artifact_count: int) -> None:
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "componentType": "agent",
        "eventType": "taskCompleted",
        "correlationId": correlation_id,
        "taskId": task_id,
        "agentName": agent_name,
        "artifactCount": artifact_count
    }
    print(json.dumps(event))
```

<!-- p. 111 -->
This is enough to show that delegated work finished and produced a known number of outputs. That alone is already helpful for tracing workflows across asynchronous boundaries.

A more robust version adds duration and state quality so the platform can later distinguish slow-but-successful tasks from cleanly completed ones.

Python

```python
import json
from datetime import datetime, timezone

def log_task_completion(
    correlation_id: str,
    task_id: str,
    agent_name: str,
    artifact_count: int,
    duration_ms: int,
    outcome: str
) -> None:
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "componentType": "agent",
        "eventType": "taskCompleted",
        "correlationId": correlation_id,
        "taskId": task_id,
        "agentName": agent_name,
        "artifactCount": artifact_count,
        "durationMs": duration_ms,
        "outcome": outcome
    }
    print(json.dumps(event))
```

The richer version supports much stronger diagnosis and trending because it ties task behavior to both time and result quality.

Failure signals are most valuable when they are normalized enough to compare across components. A broker timeout, an MCP validation failure, and a specialist artifact rejection are different, but they should still fit into a shared operational vocabulary. Teams benefit when the platform can say that this workflow class fails mainly because of policy denial, or mainly because of specialist timeout, or mainly because of output contract mismatch. That level of classification turns observability into an actual engineering input. Without it, teams tend to blame the nearest visible symptom.

Another important discipline is keeping sensitive data out of logs while preserving enough structure to diagnose issues. This is harder in agentic systems because requests often carry rich context. The platform should log identities, tool names, task kinds, policy outcomes, and high-level state transitions. It should not casually log full prompt text, complete resource payloads, raw tokens, or full artifacts containing personal or financial data. Good observability is not achieved by dumping everything. It is achieved by capturing the right evidence in the right shape. Redaction, hashing, and field-level omission are often better than unrestricted event logging.

Metrics and logs should also be tied to component role. A broker log should say that it is a broker event, not just another service log. A tool metric should say that it came from an MCP tool surface, not just a generic request counter. A specialist event should indicate task creation or completion, not just another POST request. This role-aware telemetry matters because it helps teams interpret the signals correctly. A high error count means something different at a broker than it does at a specialist or a tool server. The more clearly the role is encoded, the easier it becomes to reason across the whole topology.

One of the most useful operational habits is to promote certain failure classes to first-class alert conditions rather than burying them in aggregated error dashboards. For example, sudden increases in policy denial for a previously stable route, repeated artifact parsing failures from one specialist, or repeated misalignment between visible tool lists and actual invocation attempts may all deserve targeted alerts. These are signals that the system's contracts or governance assumptions may have shifted. Generic error thresholds often miss such problems or detect them too late.

The main objective is not to collect everything. It is to capture enough workflow-aware telemetry that the platform can answer the questions that matter. Which path did the request take, how long did each stage take, where did it fail or degrade, was the issue routing, policy, latency, contract shape,
<!-- p. 112 -->
or downstream dependency, and how often is this happening across the network. When metrics, logs, and failure signals are shaped around those questions, the platform gains operational insight instead of just operational volume.

## 10.4: Troubleshooting Broken Workflows, Slow Calls, and Misrouted Requests

Troubleshooting is where observability either proves its value or reveals its weakness. A monitoring system may look impressive when it is showing live traffic, but the real test comes when something breaks and the team needs to understand why without spending hours guessing. In an agentic network, that challenge is more complex than in many traditional systems because the failure may lie in routing logic, policy denial, token propagation, MCP tool behavior, A2A task handling, artifact shape, or a combination of several of these. The point of observability is not only to show that something is wrong. It is to help narrow the possibilities quickly and with evidence.

A broken workflow should be approached first as a path problem. The question is not only whether a component failed. The question is what path the request took through the network and where that path deviated from expectation. Did the broker choose the wrong specialist. Did the workflow skip a direct MCP read that should have happened first. Did the delegated task complete but return an artifact the caller could not use. Did a policy control deny a step that the orchestration assumed would succeed. Troubleshooting improves dramatically when the team can reconstruct the actual path from correlated logs and topology-aware metrics instead of inferring it from partial local symptoms.

The starting point is usually the correlation identifier. With that single thread, the team should be able to retrieve the broker's routing event, the MCP calls made on behalf of the workflow, the A2A task creation and completion events if delegation occurred, and the final outcome or failure. If this identifier is missing or inconsistently propagated, troubleshooting becomes significantly harder. Teams end up searching by timestamp and guessing which downstream events belong together. That is why correlation is not just an observability convenience. It is a troubleshooting necessity.

The next Python example shows a small helper that filters a list of structured log events by correlation identifier so the workflow path can be reconstructed.

Python

```python
def events_for_workflow(log_events: list[dict], correlation_id: str) -> list[dict]:
    return [
        event for event in log_events
        if event.get("correlationId") == correlation_id
    ]
```

This is the simplest correct starting point. It isolates the events for one workflow instance so the team can examine them as a coherent path rather than as unrelated entries in a large log stream.

A more robust version sorts the events by time and groups them by component type so the investigator can see the structure of the flow more clearly.

Python

```python
from datetime import datetime

def ordered_events_for_workflow(log_events: list[dict], correlation_id: str) -> list[dict]:
    filtered = [
        event for event in log_events
        if event.get("correlationId") == correlation_id
    ]

    return sorted(
        filtered,
        key=lambda event: datetime.fromisoformat(
            event["timestamp"].replace("Z", "+00:00")
        )
    )
```

The stronger version makes the events much easier to read in troubleshooting situations because the timeline becomes visible immediately. That is often enough to show where the flow stalled or changed direction unexpectedly.

When the issue is a broken workflow, the first distinction to make is whether the failure is hard or soft. A hard failure is a
<!-- p. 113 -->
direct stop, such as an authorization denial, a tool invocation error, or a task timeout that prevents progress. A soft failure is more subtle. The workflow may complete, but through fallback logic, excessive retries, or an alternate route that produces the wrong business result. Soft failures are often more dangerous operationally because they can persist longer without clear alarms. Observability should help separate these two categories quickly by showing both completion state and path quality.

Slow calls require a different approach. In an agentic system, slowness is often cumulative rather than isolated. A workflow may feel slow because one MCP call is taking too long, because a delegated task is sitting in progress longer than usual, or because the broker is now making more downstream calls per request than before. The key is to compare step durations within the same workflow path and then against normal baselines for that workflow type. If the support broker usually completes customer profile retrieval in fifty milliseconds and now it takes eight hundred, the problem likely sits at the MCP layer or its downstream dependencies. If direct calls remain fast but delegated task completion is slow, the issue likely sits with the specialist or its own dependencies.

The following Python example shows a simple function that extracts duration-bearing events from a workflow and computes a total path time. This helps distinguish whether slowness is concentrated in one step or spread across many.

Python

```python
def total_workflow_duration_ms(events: list[dict]) -> int:
    return sum(
        event.get("durationMs", 0)
        for event in events
    )
```

This is the simplest correct aggregation. It gives a quick sense of how much measured time was spent across the visible steps in the workflow.

A more robust version breaks those durations down by component role so the team can see where most of the time accumulated.

Python

```python
from collections import defaultdict

def duration_by_component_type(events: list[dict]) -> dict:
    totals = defaultdict(int)

    for event in events:
        component_type = event.get("componentType", "unknown")
        totals[component_type] += event.get("durationMs", 0)

    return dict(totals)
```

This stronger version is much more useful in practice because it can show, for example, that most of the workflow delay sits in MCP access rather than in broker routing, or in agent task completion rather than in direct capability use. That immediately narrows the search.

Misrouted requests are another common and subtle problem. A workflow may fail not because the target component is unhealthy, but because the broker chose the wrong destination or because policy and metadata changes have shifted routing behavior unexpectedly. In such cases, basic error monitoring may not help much because the destination itself may behave correctly according to its own contract. The problem is that it should not have been chosen for that request at all. Troubleshooting misroutes therefore depends heavily on route decision logs, agent-card metadata, and comparative patterns across similar requests.

One of the most useful questions in this kind of investigation is whether the chosen route matches the request class that the architecture expects. If support requests involving order exceptions are suddenly flowing to a billing review specialist more often than before, that is unlikely to be a billing-agent health issue. It is more likely a broker logic issue, a metadata drift issue, or a policy change that altered which specialists were visible and eligible. The observability layer should therefore allow route-choice analysis across sets of related workflows, not only per-request inspection.

The following Python example shows a small function that counts route choices across a group of workflow events. It helps expose whether one route is becoming unexpectedly dominant.

Python

```python
from collections import defaultdict

def route_distribution(log_events: list[dict]) -> dict:
    counts = defaultdict(int)

    for event in log_events:
        if event.get("componentType") == "broker" and "route" in event:
            counts[event["route"]] += 1

    return dict(counts)
```
<!-- p. 114: el bloque anterior empieza al final de la p. 113 y ocupa el inicio de esta página -->

This is the simplest correct route-distribution metric. It can reveal patterns that individual request troubleshooting might miss.

A more robust version groups route choices by workflow type so the team can see whether the drift is isolated to one class of request or affecting several.

Python

```python
from collections import defaultdict

def route_distribution_by_workflow(log_events: list[dict]) -> dict:
    counts = defaultdict(lambda: defaultdict(int))

    for event in log_events:
        if event.get("componentType") == "broker" and "route" in event:
            workflow_name = event.get("workflowName", "unknown")
            route = event["route"]
            counts[workflow_name][route] += 1

    return {
        workflow: dict(route_counts)
        for workflow, route_counts in counts.items()
    }
```

This stronger version is much more useful for troubleshooting because route problems often affect one business process more than another. Seeing that difference can direct teams toward the relevant broker logic or metadata rather than sending them into a broad and unnecessary investigation.

Another recurring troubleshooting task is separating policy problems from system problems. A denied tool invocation, a filtered agent card, or a blocked sensitive-data transfer may look like breakage to a user or even to part of the workflow. In reality, the platform may be working exactly as designed. The problem may be that the orchestration assumed a path that current policy no longer allows. This is why policy outcomes should be logged and metrically visible. If a workflow begins failing because a tool is no longer visible under the current attribute conditions, the team should be able to see that directly rather than inferring it from downstream absence.

Artifact and contract mismatch problems deserve their own troubleshooting pattern. These often show up as downstream failures that make little sense until the team inspects the returned structure. A specialist may complete successfully, but its artifact may omit a field that the caller now relies on. An MCP resource may change shape in a way that causes parsing failure later in the flow. Good troubleshooting starts by looking for repeated contract-level issues in logs, such as missing fields, unknown enum values, or artifact-type mismatches. If those signals are available, the investigation can move quickly from symptom to interface problem instead of wandering across unrelated infrastructure signals.

Latency troubleshooting often benefits from comparing current workflow traces to healthy traces of the same class. A support resolution flow may still succeed, but if it now includes two additional MCP resource reads or a new specialist fallback, the path has changed even if no component has obviously failed. Comparing the two timelines can reveal that the current workflow is performing more work, not simply slower work. This kind of difference is much easier to spot when the platform captures structured per-step events than when it relies on raw request logs alone.

Troubleshooting should also include the possibility that the system is working as built but no longer as intended. This is one of the hardest situations because the logs may show success and the metrics may show acceptable error rates, yet the business outcome is wrong or degraded. In those cases, the relationship view, route distribution, artifact content patterns, and policy outcomes become especially important. They help answer whether the architecture has drifted from the declarative design, whether one specialist is receiving traffic it should not, or whether a newly exposed tool has subtly changed the broker's behavior. This is where operational insight becomes architecture feedback rather than just incident response.

The strongest troubleshooting environments make it possible to move smoothly through three layers of evidence. First, the team identifies the affected workflow path using correlation and topology awareness. Second, it compares timing, route choice, and policy outcomes to known healthy baselines. Third, it inspects the detailed events and structured outputs at the relevant failing step. Each layer narrows the search. Together, they turn debugging from a broad hunt into a guided investigation. That is the real promise of observability in agentic integration. Not just more data, but a practical path from symptom to explanation.
