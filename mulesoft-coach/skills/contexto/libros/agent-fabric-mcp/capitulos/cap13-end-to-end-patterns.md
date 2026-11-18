---
libro: "MuleSoft Agent Fabric and MCP for Agentic Integration Workflows"
capitulo: 13
titulo: "End-to-End Implementation Patterns"
paginas_pdf: "137-150"
temas: [agent-fabric]
transcrito: 2026-11-16
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. En YAML y Python la sangría de la imagen no es exacta; se ordenó según la estructura, sin agregar ni quitar líneas. Las líneas partidas por el ancho de columna (condiciones if, mensajes de texto) se unieron.
- Cuando un bloque de código cruza de panel o de página, la marca de página va después del bloque.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 137, debajo del cierre del capítulo 12, y termina en el panel superior de la p. 150. El capítulo 14 empieza debajo, en la misma página.
-->

# Chapter 13: End-to-End Implementation Patterns

<!-- p. 137 -->
Architecture becomes convincing when it can be shown in working patterns that feel close to the kinds of processes teams actually have to support. It is one thing to explain brokers, MCP servers, A2A delegation, policy enforcement, and runtime governance in isolation. It is another to show how these pieces fit together in workflows that solve recognizable operational problems. End-to-end patterns matter because they force design ideas into concrete sequence. They reveal where direct capability access is enough, where specialist delegation becomes necessary, where policy gates belong, and where weak contracts would make the system brittle.

This is also where the value of a platform approach becomes much easier to judge honestly. A loosely assembled agent demo can often look capable for one or two interactions. A reusable enterprise pattern has to do more. It has to preserve identity, expose the right capabilities, restrict the wrong ones, gather context before action, survive partial failure, and leave a visible trail of what happened. In practice, the best implementation patterns are not the ones with the most moving parts. They are the ones where each part has a clear job, the transitions are easy to reason about, and the system can be operated without relying on guesswork.

The patterns in this chapter are deliberately chosen to cover three different operational shapes. The support workflow shows a broker-led pattern where direct MCP tool access does much of the work and specialist routing is still important, but not necessarily dominant in every step. The financial operations workflow shows a case where delegation and approval controls are central because business consequence is higher and simple direct action would be too risky. The employee service workflow shows how context retrieval and policy enforcement can work together in a process that feels conversational at the edge but is actually driven by strong control over what information is read
<!-- p. 138 -->
and what actions are allowed. The final section then abstracts from these examples and identifies reusable design patterns that can be applied across many domains without forcing every workflow to be rebuilt from first principles.

What makes these patterns useful is not that they are tied to one specific industry script. It is that each pattern expresses a repeatable architectural logic. A broker routes according to domain fit and policy, not convenience. MCP servers expose context and action in a way that supports grounded decisions. A2A specialists take over when the workflow needs owned domain reasoning rather than just a raw capability call. Gateways and policy layers constrain what each actor can see and do. Observability connects the whole path into something that can be inspected when behavior changes. When these qualities are present, the workflow becomes more than a proof of concept. It becomes a pattern that can be adapted and extended with confidence.

## 13.1: A Support Workflow with Broker Routing and Tool Invocation

Support operations are one of the clearest places to apply agentic integration because the work combines repeated patterns with variable context. Requests arrive in natural language, the needed information often spans several systems, and the correct action depends on a mix of customer state, order history, policy, and workflow stage. A support workflow is therefore a good example of how broker routing and direct tool invocation can work together without making the architecture more complicated than it needs to be. The broker provides the coordination point, while MCP tools and resources provide the operational reach.

A useful support pattern usually begins with one assumption. The support broker should own coordination, but it should not own every piece of support logic itself. Its job is to interpret the request, retrieve the first layer of context, choose whether the case is straightforward enough for direct handling, and route to a specialist when the situation clearly falls into a more specialized domain. This keeps the workflow efficient. Many support cases are resolved through direct context retrieval and one or two controlled actions. Others need escalation to specialists such as billing review, fulfillment exceptions, or service entitlement interpretation. The broker's value lies in distinguishing those cases consistently.

The first stage of the pattern is intake and contextual grounding. A user reports an issue, for example that an order shows delivered but was never received, or that a charge appears twice, or that a recent support promise has not been fulfilled. The broker should not rush to action based on the user statement alone. It should first retrieve the support-relevant context needed to understand the situation. This is where MCP is a natural fit. The broker can retrieve customer profile information, recent case history, order status, shipment events, or service status through MCP tools and resources that are already governed and normalized for support use. This stage is important because good support action begins with grounded state, not with speculative agent reasoning.

The next stage is classification and route choice. Once the broker has gathered the first layer of context, it can determine whether the workflow can remain direct or whether it should route to a specialist. A common mistake in support designs is to either over-route, sending too many cases to specialists that the broker could have resolved, or under-route, forcing the broker to reason deeply about domains it should not own. The healthier pattern is to let the broker handle the common, policy-clear cases directly and escalate only when the issue crosses a domain threshold. Billing disputes, exception handling in logistics, complex entitlement issues, and risk-sensitive account adjustments are all good candidates for specialist routing.

If the broker decides the case remains direct, the next stage is controlled tool invocation. It may retrieve one additional piece of context, verify eligibility or state, and then invoke a write-capable support action such as creating a case update, issuing a standard service request, or recording a status explanation. The important point is that these actions happen through MCP tools whose exposure is already shaped by policy. The broker does not
<!-- p. 139 -->
carry raw backend credentials or hidden internal logic. It uses a managed capability surface. This makes the support pattern easier to govern and easier to observe because the action boundary is explicit.

If the broker decides the case needs a specialist, the pattern changes slightly but remains coherent. The broker packages the relevant context and delegates the domain-specific work through A2A to the correct specialist. The specialist then owns its part of the workflow and returns a structured result or artifact. The broker uses that result to continue the support process, often through direct MCP actions such as posting an update, creating a follow-up request, or telling the customer what will happen next. This keeps the broker in its coordinating role. It does not disappear after routing. It remains the workflow owner even when one stage of the process is delegated.

The following YAML definition shows a support workflow for a delivery dispute, where the broker gathers context, decides that logistics review is needed, and then uses the specialist's result to update the support case.

YAML

```yaml
workflow:
  name: support-delivery-dispute
  steps:
    - name: read-customer-profile
      interaction: mcp
      target: customer-ops-mcp
      operation: read_customer_profile
      output: customerProfile
    - name: get-order-details
      interaction: mcp
      target: customer-ops-mcp
      operation: get_order_details
      output: orderDetails
    - name: get-shipment-events
      interaction: mcp
      target: logistics-ops-mcp
      operation: get_shipment_events
      output: shipmentEvents
    - name: request-logistics-review
      interaction: a2a
      target: logistics-exception-agent
      task: delivery-dispute-review
      input:
        customerProfile: customerProfile
        orderDetails: orderDetails
        shipmentEvents: shipmentEvents
      output: reviewArtifact
    - name: create-support-update
      interaction: mcp
      target: customer-ops-mcp
      operation: create_case_update
      input:
        review: reviewArtifact
```
<!-- p. 139: el bloque anterior empieza en el panel superior derecho y termina en el panel inferior izquierdo desde "task: delivery-dispute-review" -->

This is the simplest correct pattern for a support workflow that combines broker routing with direct tool use. The direct MCP steps gather the context that the broker needs. The A2A step delegates the domain-specific review. The final MCP step applies the review result back into the operational support system. The structure is easy to follow, which is exactly what makes it reusable.

A more robust version of the same pattern adds branching for cases that do not require specialist review. This better reflects real support operations, where many requests should stay inside the broker's direct handling path.

YAML

```yaml
workflow:
  name: support-delivery-dispute
  steps:
    - name: read-customer-profile
      interaction: mcp
      target: customer-ops-mcp
      operation: read_customer_profile
      output: customerProfile
    - name: get-order-details
      interaction: mcp
      target: customer-ops-mcp
      operation: get_order_details
      output: orderDetails
    - name: get-shipment-events
      interaction: mcp
      target: logistics-ops-mcp
      operation: get_shipment_events
      output: shipmentEvents
    - name: evaluate-routing
      interaction: broker-decision
      input:
        customerProfile: customerProfile
        orderDetails: orderDetails
        shipmentEvents: shipmentEvents
      output: routeDecision
    - name: request-logistics-review
      interaction: a2a
      target: logistics-exception-agent
      when:
        routeDecision: logistics-review
      task: delivery-dispute-review
      input:
        customerProfile: customerProfile
        orderDetails: orderDetails
        shipmentEvents: shipmentEvents
      output: reviewArtifact
    - name: create-direct-support-update
      interaction: mcp
      target: customer-ops-mcp
      when:
        routeDecision: direct-support
      operation: create_case_update
      input:
        order: orderDetails
        shipment: shipmentEvents
    - name: create-reviewed-support-update
      interaction: mcp
      target: customer-ops-mcp
      when:
        routeDecision: logistics-review
      operation: create_case_update
      input:
        review: reviewArtifact
```
<!-- p. 140: el bloque anterior empieza en la p. 139 y termina en esta página desde "interaction: broker-decision" -->

This stronger version is a much better match for a production support pattern. The broker has an explicit routing decision stage. Straightforward cases can be handled directly. Specialist review remains available when the route demands it. This prevents both overuse of specialists and overreach by the broker.

The runtime implementation should reflect the same logic. The following Python example shows a simplified broker implementation that retrieves context, decides the route, and either handles the case directly or delegates to the logistics specialist.

Python

```python
def handle_delivery_dispute(customer_id: str, order_id: str) -> dict:
    customer_profile = mcp_read_customer_profile(customer_id)
    order_details = mcp_get_order_details(order_id)
    shipment_events = mcp_get_shipment_events(order_id)

    if shipment_events.get("status") == "delayed" and order_details.get("priority") != "high-risk":
        update = mcp_create_case_update(
            case_reference=order_details["caseReference"],
            payload={
                "message": "Shipment is delayed and currently under carrier handling."
            }
        )
        return {
            "route": "direct-support",
            "caseUpdate": update
        }

    review_task = a2a_create_task(
        agent="logistics-exception-agent",
        task_kind="delivery-dispute-review",
        payload={
            "customerProfile": customer_profile,
            "orderDetails": order_details,
            "shipmentEvents": shipment_events
        }
    )

    review_result = a2a_wait_for_task(
        agent="logistics-exception-agent",
        task_id=review_task["id"]
    )

    review_artifact = review_result["artifacts"][0]["parts"][0]["data"]

    update = mcp_create_case_update(
        case_reference=order_details["caseReference"],
        payload=review_artifact
    )

    return {
        "route": "logistics-review",
        "review": review_artifact,
        "caseUpdate": update
    }
```
<!-- p. 141: el bloque anterior empieza en la p. 140 y termina en esta página desde "\"review\": review_artifact," -->

This is the simplest correct implementation pattern. The broker uses direct MCP calls to gather context, checks whether the issue is straightforward, and then either handles it directly or delegates to a specialist. The result is still unified because the broker remains the coordinating owner of the workflow.

A more robust version adds workflow state, clearer case messaging, and safer task completion checks. This gives a better picture of how the pattern should behave under real support conditions.

Python

```python
def handle_delivery_dispute(customer_id: str, order_id: str) -> dict:
    customer_profile = mcp_read_customer_profile(customer_id)
    order_details = mcp_get_order_details(order_id)
    shipment_events = mcp_get_shipment_events(order_id)

    case_reference = order_details["caseReference"]
    risk_flag = customer_profile.get("riskFlag", False)
    shipment_status = shipment_events.get("status", "unknown")

    if shipment_status in {"delayed", "in_transit"} and not risk_flag:
        update = mcp_create_case_update(
            case_reference=case_reference,
            payload={
                "workflowState": "direct-support",
                "message": "The shipment is still active in transit or delayed. No exception review is required at this stage."
            }
        )
        return {
            "workflowState": "direct-support",
            "caseUpdate": update
        }

    review_task = a2a_create_task(
        agent="logistics-exception-agent",
        task_kind="delivery-dispute-review",
        payload={
            "customerProfile": customer_profile,
            "orderDetails": order_details,
            "shipmentEvents": shipment_events
        }
    )

    review_result = a2a_wait_for_task(
        agent="logistics-exception-agent",
        task_id=review_task["id"]
    )

    if review_result["state"] != "completed":
        raise RuntimeError("Logistics review did not complete successfully")

    review_artifact = review_result["artifacts"][0]["parts"][0]["data"]

    update = mcp_create_case_update(
        case_reference=case_reference,
        payload={
            "workflowState": "logistics-review",
            "reviewDecision": review_artifact.get("decision"),
            "reviewReason": review_artifact.get("reason"),
            "nextAction": review_artifact.get("recommendedAction")
        }
    )

    return {
        "workflowState": "logistics-review",
        "taskId": review_task["id"],
        "review": review_artifact,
        "caseUpdate": update
    }
```
<!-- p. 141: el bloque anterior empieza en el panel superior derecho y termina en el panel inferior derecho desde "\"workflowState\": \"logistics-review\"," -->

The stronger version is operationally better because it keeps workflow state visible, checks specialist completion explicitly, and writes a more structured support update. This makes the support workflow easier to observe and easier to explain later if a user or operator questions the outcome.

What makes this pattern reusable is not the exact delivery-dispute scenario. It is the overall structure. The broker starts with direct context gathering. It makes a route decision based on normalized information and policy-friendly signals. It stays direct for the simple cases. It delegates for the specialist cases. It then returns to direct tool use for the closing operational step. That sequence works well in many support domains because it balances control, efficiency, and specialization without
<!-- p. 142 -->
collapsing into either a giant general-purpose broker or an over-delegated maze of remote specialists.

## 13.2: A Financial Operations Workflow with Delegation and Approval Controls

Financial operations is where agentic integration has to become more disciplined. Support workflows often tolerate some conversational flexibility because the main action is explanation, case handling, or service coordination. Financial workflows involve approvals, monetary impact, compliance conditions, and audit expectations. That does not mean agents and brokers have no role there. It means the design has to reflect the seriousness of delegated authority and approval boundaries. A financial operations pattern should never assume that because an agent can reach the necessary data and tools, it should also be allowed to act directly on every outcome.

The most useful financial pattern is one where the broker coordinates and specialists evaluate, but final action depends on explicit approval state. This allows the workflow to benefit from agentic flexibility in gathering context, normalizing the request, and obtaining a specialist recommendation, while still preserving hard control points around money-moving or materially consequential decisions. In practical terms, the broker should gather the needed facts, the specialist should perform the domain review, and the system should move into approval-controlled action only when the policy requirements are satisfied. This keeps the workflow productive without pretending that all financial operations should be autonomous.

A common example is a disputed-charge review or compensation request. A request arrives through support or financial operations asking for a refund, credit, or reversal. The broker begins by gathering the transaction summary, customer history, prior disputes, and any relevant payment state through MCP resources and tools. That part is direct because the broker needs enough grounded information to know whether the request is valid and which specialist domain should own the next step. But once the issue becomes a formal financial review, the broker should not synthesize the monetary decision itself. That is the point where a billing or finance review specialist should take over through A2A and return a structured recommendation.

The specialist's recommendation is not the same as execution. That distinction is essential. A strong financial operations pattern separates review from action. The specialist can return a decision artifact that says approve, deny, escalate, or require manual review, along with the reason and any confidence or rule-based markers. The broker can then use that artifact to decide whether the workflow qualifies for automated follow-up or whether it must wait for a human or policy approval stage. This creates a layered trust model. The specialist is trusted to review. The broker is trusted to coordinate. The final financial action is trusted only when approval conditions are satisfied.

The following YAML example shows a simple version of such a workflow, in which the broker gathers financial context, delegates review, and then submits the action only when the specialist result supports it.

YAML

```yaml
workflow:
  name: billing-dispute-resolution
  steps:
    - name: read-transaction-summary
      interaction: mcp
      target: finance-ops-mcp
      operation: read_transaction_summary
      output: transactionSummary
    - name: read-customer-dispute-history
      interaction: mcp
      target: finance-ops-mcp
      operation: read_dispute_history
      output: disputeHistory
    - name: request-billing-review
      interaction: a2a
      target: billing-review-agent
      task: dispute-review
      input:
        transactionSummary: transactionSummary
        disputeHistory: disputeHistory
      output: reviewArtifact
    - name: submit-financial-action
      interaction: mcp
      target: finance-ops-mcp
      operation: submit_refund_request
      input:
        review: reviewArtifact
```
<!-- p. 143: el bloque anterior empieza en la p. 142 y termina en esta página desde "target: finance-ops-mcp" (dentro de submit-financial-action) -->

This is the simplest correct financial operations pattern, but it is still incomplete for a serious production design because it does not yet distinguish recommendation from approval. That distinction is where the workflow becomes operationally responsible.

A more robust version introduces explicit approval control so that the specialist recommendation becomes a gating input rather than an automatic trigger.

YAML

```yaml
workflow:
  name: billing-dispute-resolution
  steps:
    - name: read-transaction-summary
      interaction: mcp
      target: finance-ops-mcp
      operation: read_transaction_summary
      output: transactionSummary
    - name: read-customer-dispute-history
      interaction: mcp
      target: finance-ops-mcp
      operation: read_dispute_history
      output: disputeHistory
    - name: request-billing-review
      interaction: a2a
      target: billing-review-agent
      task: dispute-review
      input:
        transactionSummary: transactionSummary
        disputeHistory: disputeHistory
      output: reviewArtifact
    - name: evaluate-approval-control
      interaction: broker-decision
      input:
        review: reviewArtifact
      output: approvalState
    - name: submit-financial-action
      interaction: mcp
      target: finance-ops-mcp
      when:
        approvalState: approved
      operation: submit_refund_request
      input:
        review: reviewArtifact
    - name: create-manual-review-case
      interaction: mcp
      target: finance-ops-mcp
      when:
        approvalState: manual-review
      operation: create_manual_review_case
      input:
        review: reviewArtifact
```
<!-- p. 143: el bloque anterior empieza en el panel superior izquierdo y termina en el panel inferior izquierdo desde "approvalState: approved" -->

This stronger pattern is much closer to what a real financial workflow should look like. The specialist can return a recommendation, but the broker or policy layer still evaluates whether the recommendation qualifies for automated execution. If it does not, the workflow moves into a manual review path instead of forcing automation where it does not belong.

The runtime code should reflect the same discipline. The following Python example shows a broker that retrieves financial context, delegates review, and only submits a refund request when the returned artifact meets the approval conditions.

Python

```python
def resolve_billing_dispute(dispute_id: str) -> dict:
    transaction_summary = mcp_read_transaction_summary(dispute_id)
    dispute_history = mcp_read_dispute_history(dispute_id)

    review_task = a2a_create_task(
        agent="billing-review-agent",
        task_kind="dispute-review",
        payload={
            "transactionSummary": transaction_summary,
            "disputeHistory": dispute_history
        }
    )

    review_result = a2a_wait_for_task(
        agent="billing-review-agent",
        task_id=review_task["id"]
    )

    review_artifact = review_result["artifacts"][0]["parts"][0]["data"]

    if review_artifact.get("decision") != "approve-refund":
        manual_case = mcp_create_manual_review_case(
            dispute_id=dispute_id,
            review=review_artifact
        )
        return {
            "approvalState": "manual-review",
            "review": review_artifact,
            "manualCase": manual_case
        }

    refund_request = mcp_submit_refund_request(
        dispute_id=dispute_id,
        review=review_artifact
    )

    return {
        "approvalState": "approved",
        "review": review_artifact,
        "refundRequest": refund_request
    }
```
<!-- p. 144: el bloque anterior empieza en la p. 143 y termina en esta página desde "review_artifact = review_result[...]" -->

This is the simplest correct implementation of delegated financial review with a policy gate. The system does not act directly on the existence of a specialist artifact. It acts on the meaning of that artifact within an approval rule.

A more robust version uses threshold and reason checks rather than a single decision string, which is often closer to real financial operations.

Python

```python
def resolve_billing_dispute(dispute_id: str) -> dict:
    transaction_summary = mcp_read_transaction_summary(dispute_id)
    dispute_history = mcp_read_dispute_history(dispute_id)

    review_task = a2a_create_task(
        agent="billing-review-agent",
        task_kind="dispute-review",
        payload={
            "transactionSummary": transaction_summary,
            "disputeHistory": dispute_history
        }
    )

    review_result = a2a_wait_for_task(
        agent="billing-review-agent",
        task_id=review_task["id"]
    )

    if review_result["state"] != "completed":
        raise RuntimeError("Billing review did not complete successfully")

    review_artifact = review_result["artifacts"][0]["parts"][0]["data"]

    decision = review_artifact.get("decision")
    amount = review_artifact.get("approvedAmount", 0)
    confidence = review_artifact.get("confidence", "low")

    if decision == "approve-refund" and amount <= 100 and confidence == "high":
        refund_request = mcp_submit_refund_request(
            dispute_id=dispute_id,
            review=review_artifact
        )
        return {
            "approvalState": "approved",
            "review": review_artifact,
            "refundRequest": refund_request
        }

    manual_case = mcp_create_manual_review_case(
        dispute_id=dispute_id,
        review=review_artifact
    )

    return {
        "approvalState": "manual-review",
        "review": review_artifact,
        "manualCase": manual_case
    }
```
<!-- p. 144: el bloque anterior empieza en el panel superior derecho y termina en el panel inferior derecho desde "manual_case = mcp_create_manual_review_case(" -->

The stronger version is important because it shows how approval controls usually work in production. The specialist's recommendation is one input, but the workflow also considers amount and confidence before allowing automated execution. This is a healthier design than treating all approvals as binary and identical.

What makes this pattern reusable is that it separates evaluation, approval, and action very cleanly. The broker coordinates the workflow and gathers the inputs. The specialist owns the
<!-- p. 145 -->
financial review. Policy or workflow logic decides whether the review result qualifies for automated execution. The final MCP action performs the approved operation or creates a manual review case. This sequence works well in many finance-adjacent domains such as credit adjustments, reversal requests, exception reimbursements, and limit-bound approvals. The exact decision thresholds will change. The structural pattern remains strong because it respects consequence and preserves explicit control.

## 13.3: An Employee Service Workflow with Context Retrieval and Policy Enforcement

Employee service workflows often look simple from the outside because the requests are phrased in ordinary language and the desired answer may sound straightforward. In practice, they often depend on fragmented context, eligibility rules, policy distinctions, and access boundaries that vary according to role, geography, benefit type, or employment state. That makes them a very good example of how context retrieval and policy enforcement should work together. The workflow must gather the right context before it answers or acts, and it must ensure that only the right tools and resources are visible or executable in the current situation.

A useful employee service pattern begins with the assumption that the broker should answer as much as possible from governed context before considering any action. Many employee questions are really context and policy questions. Someone wants to know whether they are eligible for a leave type, whether a reimbursement is still possible, whether a benefits change can be made now, or what documentation is required for a request. If the broker jumps too quickly to tool invocation or workflow submission without grounding in policy and employee context, it risks making the system feel helpful while actually increasing operational errors. The right first step is to retrieve the relevant facts.

This is where MCP resources are particularly effective. The broker can retrieve an employee profile summary, policy excerpts or structured policy resources, request history, and workflow-state context through a controlled MCP surface. The broker then has enough information to decide whether the answer can remain informational, whether a request can be started, or whether the employee must be routed into a more formal workflow. Because employee service often touches sensitive data, policy enforcement should shape what context is available and what tools are visible from the start. The broker should not see every action the platform could theoretically perform. It should see only the set appropriate for the user, the role, and the workflow state.

A common example is a leave-request inquiry. An employee asks whether they can take a certain kind of leave starting next month and what steps would be required. The broker can retrieve the employee's service status, current leave balance or eligibility flags, and the relevant leave policy resource. It can then answer the informational part directly and, if the policy and eligibility conditions allow it, offer the action path to initiate a leave request. If the employee is not eligible or if the case requires manager or HR review first, the broker should not expose the request-submission tool prematurely. This is exactly the kind of situation where context retrieval and policy enforcement belong together.

The following YAML pattern shows a simple employee service workflow that gathers context first, evaluates policy, and only then allows the request path to continue.

YAML

```yaml
workflow:
  name: leave-eligibility-and-request
  steps:
    - name: read-employee-profile
      interaction: mcp
      target: employee-service-mcp
      operation: read_employee_profile
      output: employeeProfile
    - name: read-leave-policy
      interaction: mcp
      target: employee-service-mcp
      operation: read_leave_policy
      output: leavePolicy
    - name: evaluate-eligibility
      interaction: broker-decision
      input:
        employeeProfile: employeeProfile
        leavePolicy: leavePolicy
      output: eligibilityState
    - name: submit-leave-request
      interaction: mcp
      target: employee-service-mcp
      when:
        eligibilityState: eligible
      operation: submit_leave_request
```
<!-- p. 146: el bloque anterior empieza en la p. 145 y termina en esta página desde "input:" (dentro de evaluate-eligibility) -->

This is the simplest correct version. The structure is deliberately clear. The workflow does not start with action. It starts with profile and policy context. Only after eligibility is evaluated does the write-capable tool become part of the path.

A more robust version adds a policy-aware informational response for the ineligible or review-required paths, which is more realistic for employee service.

YAML

```yaml
workflow:
  name: leave-eligibility-and-request
  steps:
    - name: read-employee-profile
      interaction: mcp
      target: employee-service-mcp
      operation: read_employee_profile
      output: employeeProfile
    - name: read-leave-policy
      interaction: mcp
      target: employee-service-mcp
      operation: read_leave_policy
      output: leavePolicy
    - name: evaluate-eligibility
      interaction: broker-decision
      input:
        employeeProfile: employeeProfile
        leavePolicy: leavePolicy
      output: eligibilityState
    - name: generate-policy-response
      interaction: broker-response
      when:
        eligibilityState: ineligible
      input:
        employeeProfile: employeeProfile
        leavePolicy: leavePolicy
    - name: create-review-request
      interaction: mcp
      target: employee-service-mcp
      when:
        eligibilityState: review-required
      operation: create_hr_review_request
    - name: submit-leave-request
      interaction: mcp
      target: employee-service-mcp
      when:
        eligibilityState: eligible
      operation: submit_leave_request
```
<!-- p. 146: el bloque anterior empieza en el panel superior izquierdo y termina en el panel inferior izquierdo desde "leavePolicy: leavePolicy" -->

This stronger version reflects the fact that many employee workflows need three outcomes, not two. Some requests are eligible and can proceed. Some are ineligible and should stop with a clear explanation. Others fall into a review-required state. That kind of branching is exactly why policy enforcement belongs so close to the context retrieval stage.

The following Python example shows a broker implementing the simplest version of this employee service pattern.

Python

```python
def handle_leave_request(employee_id: str, leave_type: str) -> dict:
    employee_profile = mcp_read_employee_profile(employee_id)
    leave_policy = mcp_read_leave_policy(leave_type)

    if not employee_profile.get("employmentActive", False):
        return {
            "eligibilityState": "ineligible",
            "message": "The employee is not currently in an active employment state."
        }

    if leave_type not in leave_policy.get("eligibleLeaveTypes", []):
        return {
            "eligibilityState": "ineligible",
            "message": "The requested leave type is not available under current policy."
        }

    leave_request = mcp_submit_leave_request(
        employee_id=employee_id,
        leave_type=leave_type
    )

    return {
        "eligibilityState": "eligible",
        "leaveRequest": leave_request
    }
```
<!-- p. 147: el bloque anterior empieza en la p. 146 y termina en esta página desde "return {" (el último) -->

This is the simplest correct implementation. The broker retrieves profile and policy context, checks eligibility, and only then uses the write-capable request tool. Even at this level, the workflow is already much safer than an agent that would have exposed submission capability before checking context.

A more robust version handles the review-required state and produces a clearer policy-grounded informational response.

Python

```python
def handle_leave_request(employee_id: str, leave_type: str) -> dict:
    employee_profile = mcp_read_employee_profile(employee_id)
    leave_policy = mcp_read_leave_policy(leave_type)

    if not employee_profile.get("employmentActive", False):
        return {
            "eligibilityState": "ineligible",
            "message": "The employee is not currently in an active employment state."
        }

    if leave_type not in leave_policy.get("eligibleLeaveTypes", []):
        return {
            "eligibilityState": "ineligible",
            "message": "The requested leave type is not available under current policy."
        }

    if leave_policy.get("requiresHrReview", False) or employee_profile.get("managerApprovalPending", False):
        review_request = mcp_create_hr_review_request(
            employee_id=employee_id,
            leave_type=leave_type
        )
        return {
            "eligibilityState": "review-required",
            "reviewRequest": review_request,
            "message": "The request requires review before submission can proceed."
        }

    leave_request = mcp_submit_leave_request(
        employee_id=employee_id,
        leave_type=leave_type
    )

    return {
        "eligibilityState": "eligible",
        "leaveRequest": leave_request,
        "message": "The leave request has been submitted successfully."
    }
```
<!-- p. 147: el bloque anterior empieza en el panel superior izquierdo y termina en el panel inferior izquierdo desde "employee_id=employee_id," -->

The stronger version is a better reflection of how policy enforcement usually works. The workflow still begins with direct context retrieval, but the action path stays closed until the relevant policy and state conditions allow it. The broker does not need to guess. It uses governed context and policy-friendly branching.

What makes this pattern particularly important is that it shows how employee service can remain conversational without becoming loosely authorized. The user may experience the workflow as a helpful question-and-answer exchange with optional request handling. Underneath, the broker is reading controlled context, applying policy checks, and only exposing action where the state justifies it. This is exactly the kind of pattern that scales well because it reduces the need for broad generic action tools while improving the quality of the answers the system gives.

## 13.4: Reusable Design Patterns for Enterprise Agentic Integration

Once several end-to-end workflows have been implemented, certain design patterns begin to appear repeatedly. These patterns matter because they allow teams to build new workflows by adapting proven structures rather than inventing orchestration and governance logic from scratch every time. Reuse in agentic integration is not only about reusing assets such as agents, brokers, and MCP servers. It is also about reusing workflow shapes that already balance direct access, delegation, policy control, and observability in a dependable way.

One of the most common and useful patterns is broker-first grounding. In this pattern, the broker always retrieves a base
<!-- p. 148 -->
layer of context before choosing whether to remain direct or route to a specialist. This pattern works well because it reduces premature delegation and improves route quality. A broker that acts without context tends to over-route or make weak assumptions. A broker that grounds itself first can make cleaner decisions, explain them better, and often resolve simpler cases without involving specialists unnecessarily. This pattern is especially strong in support, employee service, and case-oriented workflows.

Another pattern is specialist review before action. This pattern appears whenever the workflow includes high-consequence decision points, such as finance, approvals, compliance, risk, or nontrivial exception handling. The core logic is simple. The broker may gather context and package the request, but the domain specialist owns the recommendation. The resulting artifact is then evaluated under policy before any high-impact action occurs. This pattern is strong because it respects specialization and preserves explicit control points. It prevents the system from pretending that all automation is equal. Some automation should inform action. Some should execute action only when policy allows.

A third pattern is context-before-capability. This pattern is especially important in workflows where many actions are possible but only a few are appropriate in the current state. Instead of exposing the full action surface at the beginning, the workflow retrieves state and policy context first, then allows the capability surface to narrow or expand based on what is learned. Employee service and regulated support cases benefit heavily from this pattern. It reduces accidental misuse and makes the visible system behavior much more truthful because the workflow exposes capabilities according to reality rather than according to static maximum privilege.

Another useful pattern is direct-close after delegated-review. In this pattern, a specialist agent performs a review or recommendation through A2A, but the broker returns to direct MCP tool invocation for the closing operational step. This works well because it keeps the specialist focused on domain reasoning and keeps the final system action within
<!-- p. 149 -->
the broker's or platform's own governed capability layer. The specialist does not need to become a full workflow owner for every downstream operational action. The broker remains the orchestrator, which helps maintain visibility and reduces unnecessary spread of permissions across the network.

A further pattern is approval-gated branching. Here the workflow intentionally distinguishes among eligible for automatic execution, eligible only for review, and not eligible at all. This pattern is common in financial operations, HR actions, procurement, and many exception workflows. What makes it reusable is that the structure is stable even when the domain rules differ. Gather the right context, obtain the relevant review or evaluation, apply policy thresholds, and then branch to automated action, manual review, or explanatory response. This pattern is much safer than workflows that treat approval as an afterthought or as a note attached to an otherwise direct action path.

There is also a strong pattern around normalized artifacts. In this design, all specialist outputs that matter to downstream workflows are translated into stable internal artifact models before they are consumed elsewhere. This is particularly useful in multi-team or cross-platform systems because it reduces hidden coupling and makes later workflow steps less dependent on the originating specialist's internal design choices. The artifact becomes part of the platform's contract vocabulary, not just a one-off response. This pattern is one of the best defenses against protocol drift and contract mismatch because it keeps the orchestration layer from becoming hostage to several slightly different remote output shapes.

Another reusable pattern is route-visible orchestration. In this pattern, the broker's route decision is treated as a first-class event with workflow meaning, rather than as an invisible implementation detail. This makes observability much stronger and helps governance teams understand how the network is actually being used. It also improves debugging because route drift is easier to detect when route decisions are explicit and logged. In practice, this pattern is often what separates a manageable network from one that becomes mysterious under load. Teams know not only what happened, but which path the broker intentionally chose and why.

A related pattern is policy-shaped capability exposure. Instead of exposing all possible tools or specialists and relying on internal logic not to misuse them, the platform shapes the visible surface according to role, workflow state, and sensitivity. This pattern is broadly reusable because almost every serious workflow benefits from narrower, more truthful capability exposure. It reduces the chance of accidental misuse, simplifies orchestration reasoning, and aligns runtime behavior with security and governance decisions. It is particularly important in any workflow where the available actions change as the workflow moves from informational inquiry to decision to execution.

Cross-platform workflows benefit from another reusable pattern, which can be described as normalize at the boundary, not in the middle. External agent cards, task results, or MCP surfaces are adapted into internal forms as close to the boundary as possible. The rest of the workflow then works from those internal forms instead of carrying compatibility logic everywhere. This pattern is one of the most important in environments where standards and connectors evolve at different speeds. It turns interoperability drift into a boundary concern rather than a workflow-wide tax.

These patterns also reveal something important about enterprise agentic integration. The strongest workflows are not usually the ones with the most agents. They are the ones with the clearest division of responsibility. Brokers coordinate. MCP servers expose normalized capabilities and context. Specialists own domain review or task handling. Policies shape what is visible and allowed. Gateways preserve runtime control. Observability connects the whole thing into an explainable network. Reusable implementation patterns emerge when these roles are respected consistently. They weaken when roles begin to blur and components start doing work they were never meant to own.

Another practical lesson from these patterns is that reuse depends on restraint. It is easy to overfit one workflow by
<!-- p. 150 -->
giving a broker too much domain logic, letting a specialist own too many downstream actions, or exposing an MCP surface too broadly for the sake of convenience. That often makes the first implementation feel fast. It also makes the second one harder because the platform has learned the wrong lesson from the first. Reusable patterns come from designs that leave room for the next workflow. They are specific enough to work and general enough not to trap the platform in one case's shortcuts.

This is why end-to-end patterns matter so much in a book like this. They demonstrate that good architecture is not just a collection of correct definitions. It is a set of repeatable operating structures that can be applied across support, finance, employee service, logistics, compliance, and other domains with only the domain specifics changing. The underlying shapes remain recognizable. Gather context first. Route deliberately. Delegate where specialization is real. Keep actions inside governed capability surfaces. Apply policy before exposure becomes execution. Normalize outputs. Watch the route. These are not slogans. They are the working habits of a reliable agentic integration platform.

When these patterns become familiar, new workflows become much easier to design well. Instead of asking from scratch how a new agentic process should work, teams can ask which established pattern it most resembles and what domain-specific changes are needed. That saves time, reduces risk, and improves consistency across the platform. It also leads to a stronger exchange of reusable assets, because agents, brokers, MCP servers, and workflow fragments are all built with the same architectural instincts. That is what real reuse looks like in enterprise agentic integration. Not only shared components, but shared ways of composing them into workflows that stay understandable, governable, and effective.
