---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 12
titulo: "Testing, Quality Control, and Delivery Pipelines"
paginas_pdf: "(imagen)+130-140"
temas: [debugging, build-dependencias, deploying-managing]
transcrito: 2026-11-13
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna. No corrijo ni completo nada.
- El capítulo termina en el recuadro destacado de la p. 140; el capítulo 13 empieza en la p. 141.
- El título y los primeros párrafos del capítulo NO están en el PDF de las fuentes. La persona los aportó como imagen el 2026-11-13; se transcriben abajo, marcados como "imagen". La p. 130 del PDF sigue a continuación ("At the same time, testing quality...").
-->

# Chapter 12: Testing, Quality Control, and Delivery Pipelines

<!-- imagen aportada por la persona (no está en el PDF) -->
A Mule application is only as trustworthy as the evidence behind it. Flows can look clean, transformations can appear correct, and connector configurations can seem well organized, but none of that is enough on its own. Integration work lives at the boundary between systems, and boundaries are where assumptions fail first. A payload changes shape. A connector returns a slightly different structure. A property is missing in one environment. A deployment plugin chooses a runtime combination that was not intended. A test passed locally because it used the wrong dependency or because the critical branch was never exercised. Quality in MuleSoft delivery depends on confronting those realities directly.

Testing therefore has to be treated as a core engineering discipline rather than a confidence ritual. It is not a last-stage activity performed to satisfy process. It is the way you make the behavior of the application visible early enough to correct it without expensive surprises later. In MuleSoft projects, this means testing flow behavior, transformation outcomes, error paths, connector interactions, and packaging assumptions with the same seriousness you give business logic itself. It also means designing tests that tell the truth about the application instead of merely proving that the happy path still works on a familiar machine.

MUnit is central to this because it gives Mule applications a native testing approach that works with the platform's event model. This matters. A flow is not just a function with one input and one output. It may carry variables, attributes, scoped handlers, connector boundaries, and different runtime branches. MUnit gives a way to exercise those concerns within the structure that Mule actually uses. That is much better than trying to retrofit generic testing ideas without respecting the runtime model.

<!-- p. 130 -->
At the same time, testing quality is not created only by using the right framework. It depends on what is being tested, what is mocked, what is asserted, and whether the test data reflects meaningful conditions instead of overly neat examples. A test suite with weak assertions and unrealistic fixtures can create false confidence very efficiently. This is why mocking, spying, test data design, and assertion strategy matter so much. They shape whether the suite detects real defects or merely confirms that the application still starts.

The same quality mindset extends into packaging and delivery. A Mule application is not complete when its tests pass. It must still be packaged consistently, deployed through a controlled build process, promoted across environments without accidental drift, and aligned with runtime and plugin versions that behave as intended. Delivery pipelines are where many hidden assumptions become expensive. A team may think it is deploying one runtime version while the plugin behavior selects another. A deployment may pass because a property happened to exist in one environment and not another. A packaging process may include the wrong dependency set or miss the right test phase entirely. These are not rare edge cases. They are common failure patterns in growing integration estates.

This section explains how to test Mule applications with MUnit, how to use mocking and spying without weakening the suite, how to design test data and assertions that reflect real behavior, how to package and deploy applications with Maven and deployment plugins, and how to promote those applications safely through environments using disciplined CI-CD practices. The goal is to make quality control feel built into the delivery model, not attached to it after the fact. When the testing and deployment story is strong, the application becomes easier to trust because there is a repeatable path from local flow design to production-ready runtime behavior.

## 12.1: Unit Testing Mule Applications with MUnit

MUnit is the testing framework built for Mule applications, and its real value lies in how closely it fits the runtime model. A Mule flow is not only business logic in the abstract. It is a sequence of processors that act on a Mule event, interact with variables and attributes, call connectors, and respond through scoped error behavior. A testing tool that understands those elements can validate the application much more faithfully than a generic test pattern that treats the flow like a black box. MUnit gives that platform-native view, which is why it is the right starting point for serious Mule testing.

A good way to think about MUnit is that it allows you to exercise a Mule flow as a runtime artifact rather than only as a file. You can set an input event, call a flow, observe its output, inspect variables, verify processor behavior, and test error or conditional paths in a way that matches how the application actually runs. This makes it possible to test not only final payloads but also the flow decisions that produce them. That is a major advantage because many integration defects are not visible in one final response alone. They live in the way a flow routes, the way it builds state, or the way it reacts when a dependency misbehaves.

Unit testing in MuleSoft should begin with one important discipline. A test should target a meaningful behavior boundary. That may be one flow, one subflow, or one clearly scoped business path. The goal is not to test the entire estate at once and call that coverage. The goal is to isolate behavior units that matter and validate them intentionally. A test for a customer lookup flow should make it clear what the flow does with valid input, how it handles a missing identifier, and what output it produces when the expected dependency behaves in a defined way. A test for a transformation-heavy flow should make it clear that the output contract is stable under realistic inputs.

The following example shows a simple MUnit test that invokes a flow and asserts on the resulting payload. It is intentionally small so the basic structure is visible.

XML

```xml
<mule xmlns:munit="http://www.mulesoft.org/schema/mule/munit"
      xmlns:munit-tools="http://www.mulesoft.org/schema/mule/munit-tools"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/munit http://www.mulesoft.org/schema/mule/munit/current/mule-munit.xsd
        http://www.mulesoft.org/schema/mule/munit-tools http://www.mulesoft.org/schema/mule/munit-tools/current/mule-munit-tools.xsd">

    <munit:test name="getStatusFlowTest">
        <munit:execution>
            <flow-ref name="getStatusFlow"/>
        </munit:execution>
        <munit:validation>
            <munit-tools:assert-that expression="#[payload.status]"
                                     is="#[MunitTools::equalTo('up')]"/>
        </munit:validation>
    </munit:test>
</mule>
```
<!-- p. 131: el bloque anterior empieza en la p. 130 y sigue en esta página desde "xmlns="http://www.mulesoft.org/schema/mule/core"" -->

This is the simplest correct version because it shows the test structure clearly. The test executes a flow and then validates an expected output value. That is the basic pattern all stronger tests build on.

A more robust version becomes useful when the test should set input data, verify a richer output contract, and make the setup more explicit.

XML

```xml
<mule xmlns:munit="http://www.mulesoft.org/schema/mule/munit"
      xmlns:munit-tools="http://www.mulesoft.org/schema/mule/munit-tools"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/munit http://www.mulesoft.org/schema/mule/munit/current/mule-munit.xsd
        http://www.mulesoft.org/schema/mule/munit-tools http://www.mulesoft.org/schema/mule/munit-tools/current/mule-munit-tools.xsd
        http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <munit:test name="orderSummaryFlowTest">
        <munit:behavior>
            <set-payload value='#[{
                orderId: "O1001",
                amount: 120.50
            }]'/>
        </munit:behavior>
        <munit:execution>
            <flow-ref name="buildOrderSummaryFlow"/>
        </munit:execution>
        <munit:validation>
            <munit-tools:assert-that expression="#[payload.orderId]"
                                     is="#[MunitTools::equalTo('O1001')]"/>
            <munit-tools:assert-that expression="#[payload.amount]"
                                     is="#[MunitTools::equalTo(120.50)]"/>
        </munit:validation>
    </munit:test>
</mule>
```

The difference matters because the test now controls its input and validates more than one field. This makes the behavior under test much clearer and reduces the chance that an accidental default or unrelated runtime value will influence the result.

A strong MUnit practice tests more than obvious success cases. It should cover branching logic, error responses, transformation behavior, and flow-level assumptions that are important to the contract. If a flow is meant to reject an invalid request, that deserves a test. If an error handler converts a connector exception into a stable API error payload, that deserves a test. If a route should choose one downstream path for one input and a different path for another, those decisions deserve tests. The purpose is not exhaustive perfection. The purpose is to ensure that the behavior most likely to break under change becomes visible through automated checks.

One of the best habits in MUnit is to test named business behavior rather than implementation trivia. A test named around order rejection, customer enrichment, or invoice mapping is more helpful than one named around whatever
<!-- p. 132 -->
processor happened to exist when the test was written. This matters because test names are part of the project's long-term communication. A good test suite reads like a behavioral map of the application. A weak one reads like a collection of tool-driven fragments.

Another important point is that flow testing and contract testing should reinforce each other. If the application is implementing an API contract, the MUnit suite should help prove that the flow behavior matches that contract. This does not mean every test has to duplicate the specification. It means important request and response rules should be reflected in the assertions. If an API promises a stable error code for invalid input, the test should check that. If a successful response should contain a normalized value rather than a raw downstream field name, the test should check that too.

MUnit is also valuable because it can participate in the broader build lifecycle. A test that runs only inside one developer's IDE is useful for local feedback, but its real strength comes when it also runs in a repeatable build pipeline. That turns the suite into a shared quality gate rather than a personal tool. The same flow behavior is then validated in a controlled build context before packaging and deployment. This connection between MUnit and the delivery pipeline is one of the reasons strong Mule teams treat tests as part of build engineering, not only as developer convenience.

Coverage can be useful, but it should be interpreted carefully. A high coverage number may still hide poor assertions or weak scenario selection. A strong suite cares more about meaningful behavior coverage than about chasing percentages without judgment. If a flow contains a critical conditional branch and that branch has never been tested, the suite is weak even if other parts are heavily exercised. If an error handler is central to the API contract and no test verifies it, the suite is incomplete regardless of total line count touched. Coverage is helpful when it supports thoughtful testing, not when it replaces it.

A healthy MUnit discipline therefore combines platform-native flow testing with behavioral clarity. The tests should say what the application is expected to do, control the relevant inputs, and assert the parts of the outcome that matter to the contract and the runtime path. That is what turns MUnit from a framework feature into a real quality control tool.

## 12.2: Mocking, Spying, Test Data Design, and Assertion Strategy

A good test does not only run code. It creates a controlled situation in which the behavior under examination becomes visible. In Mule applications, that often means isolating the flow from external systems, observing how certain processors were used, supplying input data that exercises real decision paths, and asserting the parts of the outcome that actually matter. This is where mocking, spying, test data design, and assertion strategy become essential. Without them, a test may still execute, but it will often tell you much less than you think.

Mocking is useful because many flows depend on connectors and systems that should not be called directly during a unit test. A test should not depend on a live SaaS platform, a real database, or a remote API simply to verify that one flow chooses the correct branch or builds the correct response structure. Mocking allows you to replace that external interaction with a controlled return value or failure. This keeps the test focused on the flow logic you actually want to validate. It also makes the test more stable because it is no longer dependent on external network conditions or system availability.

The following example shows a simple mock for an HTTP request inside an MUnit test. The flow under test can now execute without calling the real external service.

XML

```xml
<mule xmlns:munit="http://www.mulesoft.org/schema/mule/munit"
      xmlns:munit-tools="http://www.mulesoft.org/schema/mule/munit-tools"
      xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/munit http://www.mulesoft.org/schema/mule/munit/current/mule-munit.xsd
        http://www.mulesoft.org/schema/mule/munit-tools http://www.mulesoft.org/schema/mule/munit-tools/current/mule-munit-tools.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd">

    <munit:test name="customerLookupWithMockedHttpTest">
        <munit:behavior>
            <munit-tools:mock-when processor="http:request">
                <munit-tools:then-return payload='#[{
                    id: "C1001",
                    name: "Jordan Blake"
                }]'/>
            </munit-tools:mock-when>
        </munit:behavior>
        <munit:execution>
            <flow-ref name="customerLookupFlow"/>
        </munit:execution>
        <munit:validation>
            <munit-tools:assert-that expression="#[payload.name]"
                                     is="#[MunitTools::equalTo('Jordan Blake')]"/>
        </munit:validation>
    </munit:test>
</mule>
```
<!-- p. 133: el bloque anterior empieza en la p. 132 y sigue en esta página desde "http://www.mulesoft.org/schema/mule/munit http://..." -->

This is the simplest correct version because it isolates the external HTTP dependency and lets the test focus on the flow outcome.

A more robust version becomes useful when the mock should apply only to a specific connector call and when the returned payload should better match the shape the real flow expects.

XML

```xml
<mule xmlns:munit="http://www.mulesoft.org/schema/mule/munit"
      xmlns:munit-tools="http://www.mulesoft.org/schema/mule/munit-tools"
      xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/munit http://www.mulesoft.org/schema/mule/munit/current/mule-munit.xsd
        http://www.mulesoft.org/schema/mule/munit-tools http://www.mulesoft.org/schema/mule/munit-tools/current/mule-munit-tools.xsd
        http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd">

    <munit:test name="customerLookupWithTargetedMockTest">
        <munit:behavior>
            <munit-tools:mock-when processor="http:request">
                <munit-tools:with-attributes>
                    <munit-tools:with-attribute attributeName="config-ref" whereValue="#['customerApiConfig']"/>
                </munit-tools:with-attributes>
                <munit-tools:then-return payload='#[{
                    customer: {
                        id: "C1001",
                        name: "Jordan Blake"
                    }
                }]'/>
            </munit-tools:mock-when>
        </munit:behavior>
        <munit:execution>
            <flow-ref name="customerLookupFlow"/>
        </munit:execution>
        <munit:validation>
            <munit-tools:assert-that expression="#[payload.customer.id]"
                                     is="#[MunitTools::equalTo('C1001')]"/>
            <munit-tools:assert-that expression="#[payload.customer.name]"
                                     is="#[MunitTools::equalTo('Jordan Blake')]"/>
        </munit:validation>
    </munit:test>
</mule>
```

This version is better because it reduces the chance that an unrelated HTTP request would also be mocked accidentally. The test is now more precise about which dependency behavior it is replacing.

Spying solves a different problem. Sometimes you do not want to replace a processor. You want to observe that it was used or verify something about its input or effect. This is especially valuable when the correctness of the flow depends not only on the final payload but also on whether an internal step happened as intended. A route may need to call a subflow under one condition and not another. A transform may need to generate a specific intermediate value before the final response. Spying
<!-- p. 134 -->
allows the test to inspect that behavior without turning the entire flow into a mock-driven shell.

The following example shows a spy verifying that a specific logger processor is called during execution.

XML

```xml
<mule xmlns:munit="http://www.mulesoft.org/schema/mule/munit"
      xmlns:munit-tools="http://www.mulesoft.org/schema/mule/munit-tools"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/munit http://www.mulesoft.org/schema/mule/munit/current/mule-munit.xsd
        http://www.mulesoft.org/schema/mule/munit-tools http://www.mulesoft.org/schema/mule/munit-tools/current/mule-munit-tools.xsd">

    <munit:test name="orderFlowLoggerSpyTest">
        <munit:behavior>
            <munit-tools:spy processor="logger"/>
        </munit:behavior>
        <munit:execution>
            <flow-ref name="processOrderFlow"/>
        </munit:execution>
        <munit:validation>
            <munit-tools:verify-call processor="logger" times="1"/>
        </munit:validation>
    </munit:test>
</mule>
```

This is the simplest correct version because it shows the basic value of spying, confirming that a significant internal action occurred.

A more robust version becomes useful when the test should verify not just that the processor was called, but that the surrounding logic produced a meaningful result consistent with that call.

XML

```xml
<mule xmlns:munit="http://www.mulesoft.org/schema/mule/munit"
      xmlns:munit-tools="http://www.mulesoft.org/schema/mule/munit-tools"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/munit http://www.mulesoft.org/schema/mule/munit/current/mule-munit.xsd
        http://www.mulesoft.org/schema/mule/munit-tools http://www.mulesoft.org/schema/mule/munit-tools/current/mule-munit-tools.xsd">

    <munit:test name="orderFlowSpyAndResultTest">
        <munit:behavior>
            <munit-tools:spy processor="logger"/>
            <set-payload value='#[{ orderId: "O1001", channel: "online" }]'/>
        </munit:behavior>
        <munit:execution>
            <flow-ref name="processOrderFlow"/>
        </munit:execution>
        <munit:validation>
            <munit-tools:verify-call processor="logger" times="1"/>
            <munit-tools:assert-that expression="#[payload.status]"
                                     is="#[MunitTools::equalTo('accepted')]"/>
        </munit:validation>
    </munit:test>
</mule>
```

This version is stronger because it combines internal observation with contract-level verification. That is usually more valuable than spying alone.

Test data design is just as important as mocking and spying. If the test fixtures are too clean, too small, or too unlike the real payloads the system sees, the suite may pass while important defects remain hidden. Good test data should reflect realistic shape, optionality, and variation. It should include values that exercise routing logic, missing-field conditions, error branches, and transformation edge cases. The goal is not to create massive unreadable fixtures for every case. The goal is to make the test data meaningful enough that the flow is proven under conditions that matter.

<!-- p. 135 -->
One practical sign of weak test data is when every input object contains every field in the ideal shape and every numeric value is already in the right type. Real integrations are rarely that polite. A test suite should include cases where optional fields are absent, arrays are empty, values need normalization, or downstream structures come back in forms the application is expected to handle. Otherwise the suite is proving a version of the application that only exists in examples.

Assertion strategy matters for the same reason. A weak test often asserts one field from a large result and ignores everything else that might have broken. A stronger test asserts the parts of the contract that actually matter. This might include status codes, identifiers, derived fields, error codes, or counts. The right set of assertions depends on the behavior being tested, but the key is that the assertions should be meaningful. If the behavior under test is response shaping, then the assertions should focus on the response contract. If the behavior under test is branch selection, then the assertions should prove which branch was taken and what effect that had.

There is also a balance to strike. Over-asserting on every incidental field can make the suite brittle when harmless changes occur. Under-asserting makes the suite blind. The healthiest strategy is to assert strongly on the fields and behaviors that define the contract or the risk being tested. For example, if an error handler should produce a stable error code and message structure, assert those. If a transformation should normalize and sort values in a certain way because a consumer depends on that, assert that. Do not rely only on the fact that the flow returned some payload at all.

Another powerful practice is testing negative behavior explicitly. If a flow should reject invalid input, create a test that proves it. If a dependency failure should trigger a fallback path, create a test that mocks the failure and asserts the fallback response. If a route should not call a certain downstream connector under one condition, use verification to prove that it does not. Negative tests are often the ones that catch the design flaws hidden by happy-path success.

When mocking, one caution matters a great deal. Over-mocking can turn a meaningful test into a staged performance where the flow never interacts with enough real structure to prove anything. If every processor is mocked, the test may pass regardless of whether the business flow is assembled correctly. Mock only what should be isolated. Leave the logic under test real. This distinction is what keeps the suite honest.

Spies should be used with similar restraint. They are most useful when observing a meaningful internal behavior, not when turning the test into a detailed surveillance script for every processor. A test that verifies ten internal calls and barely checks the business outcome is often too implementation-bound. Spying is best when it reinforces understanding of an important path, not when it replaces real contract assertions.

The strongest test suites therefore combine realistic data, selective mocking, targeted spying, and assertions that speak to real behavior. They do not merely show that the flow can run. They show that it behaves correctly under the kinds of conditions that matter in integration work. That is what makes the suite useful as quality control rather than just as automated activity.

## 12.3: Packaging and Deploying with Maven and Deployment Plugins

A Mule application does not move reliably from source code to runtime by accident. It has to be packaged in a repeatable way, its dependencies have to resolve correctly, its tests have to participate in the build process, and the deployment tooling has to reflect the runtime and target environment accurately. Maven is central to this because it provides the project structure, dependency management, packaging lifecycle, and plugin integration that allow a Mule application to be built and deployed consistently. The Mule Maven plugin and related build plugins turn that general build model into one that understands Mule application packaging and deployment targets.

Packaging matters because what is deployed is not the raw project folder or the files as they happen to exist in an IDE. What gets deployed is the result of a build process. That
<!-- p. 136 -->
process decides which dependencies are included, how tests are executed, what artifact is produced, and what deployment configuration is applied. If the build model is weak or stale, the artifact may not reflect the application the team thinks it is shipping. This is why Maven configuration deserves architectural attention rather than being treated as boilerplate created once and ignored forever.

The project object model file is where much of this behavior is defined. It declares the application packaging type, the Mule runtime alignment, plugin versions, dependencies, test libraries, and build phases. A small change here can affect far more than one line suggests. A plugin version can alter deployment behavior. A misplaced dependency scope can bloat or break the packaged artifact. An outdated test plugin can reduce the quality gate without anyone noticing until something fails later in a shared environment.

The following example shows a straightforward Mule Maven setup with basic runtime packaging and MUnit integration.

XML

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.acme.integration</groupId>
    <artifactId>orders-api</artifactId>
    <version>1.0.0</version>
    <packaging>mule-application</packaging>

    <properties>
        <mule.maven.plugin.version>4.1.1</mule.maven.plugin.version>
        <munit.version>3.3.2</munit.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.mule.tools.maven</groupId>
                <artifactId>mule-maven-plugin</artifactId>
                <version>${mule.maven.plugin.version}</version>
                <extensions>true</extensions>
            </plugin>
            <plugin>
                <groupId>com.mulesoft.munit.tools</groupId>
                <artifactId>munit-maven-plugin</artifactId>
                <version>${munit.version}</version>
            </plugin>
        </plugins>
    </build>
</project>
```

This is the simplest correct version because it establishes the core packaging type and plugin relationship needed for a Mule application build. It is enough to show that packaging and test execution belong to the Maven lifecycle.

A more robust version becomes useful when the project should express deployment parameters, test execution phases, and explicit dependencies more clearly.

XML

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.acme.integration</groupId>
    <artifactId>orders-api</artifactId>
    <version>1.0.0</version>
    <packaging>mule-application</packaging>

    <properties>
        <mule.maven.plugin.version>4.1.1</mule.maven.plugin.version>
        <munit.version>3.3.2</munit.version>
        <app.runtime>4.9.0</app.runtime>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.mule.connectors</groupId>
            <artifactId>mule-http-connector</artifactId>
            <version>1.9.0</version>
            <classifier>mule-plugin</classifier>
        </dependency>
        <dependency>
            <groupId>com.mulesoft.munit</groupId>
            <artifactId>munit-runner</artifactId>
            <version>${munit.version}</version>
            <classifier>mule-plugin</classifier>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.mulesoft.munit</groupId>
            <artifactId>munit-tools</artifactId>
            <version>${munit.version}</version>
            <classifier>mule-plugin</classifier>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.mule.tools.maven</groupId>
                <artifactId>mule-maven-plugin</artifactId>
                <version>${mule.maven.plugin.version}</version>
                <extensions>true</extensions>
                <configuration>
                    <classifier>mule-application</classifier>
                </configuration>
            </plugin>
            <plugin>
                <groupId>com.mulesoft.munit.tools</groupId>
                <artifactId>munit-maven-plugin</artifactId>
                <version>${munit.version}</version>
                <executions>
                    <execution>
                        <id>test</id>
                        <phase>test</phase>
                        <goals>
                            <goal>test</goal>
                            <goal>coverage-report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```
<!-- p. 137: el bloque anterior empieza en la p. 136 y sigue en esta página desde "<artifactId>munit-runner</artifactId>" -->

This version is stronger because it makes the build more explicit. Test dependencies are scoped clearly. The MUnit plugin is tied to the test phase with coverage reporting. The application packaging behavior is easier to understand and review.

Packaging is one half of the story. Deployment is the other. A build artifact that cannot be deployed consistently is not enough. Maven plugins support deployment by allowing the artifact and its configuration to move into the target runtime environment through a repeatable command-driven process. This is important because manual deployment quickly becomes error-prone in multi-environment delivery. A repeatable deployment command keeps the process visible and automatable.

The following Shell example shows a straightforward Maven build and test execution from the command line.

Shell

```shell
mvn clean test package
```

This is the simplest correct version because it represents the essential local build pipeline. The project is cleaned, tests run, and the artifact is packaged.

A more robust version becomes useful when environment parameters and deployment actions should be tied to the build explicitly.

Shell

```shell
mvn clean test package \
  -Denv=dev \
  -Dsecure.key=dev-secure-key
```

The difference matters because the build now reflects environment-driven property resolution assumptions as part of the invocation. This makes the build behavior easier to reproduce and align with deployment expectations.

Actual deployment goals vary by target, but the architectural principle remains the same. The deployment command should be scriptable, repeatable, and parameterized by environment-specific values rather than by hidden local assumptions. That means credentials, environment names, target identifiers, and runtime settings should be injected through controlled mechanisms rather than embedded in ad hoc local commands that only one engineer understands.

<!-- p. 138 -->
Another reason to pay close attention to deployment plugins is version behavior. A build pipeline may appear stable while still using plugin versions that no longer reflect current runtime support assumptions or that behave differently from what the team expects. This is one of the areas where delivery pipelines quietly become risky. A team may think it is targeting a certain runtime line, Java version, or release channel, while the plugin behavior in use is older or incomplete. Version-safe deployment practice therefore begins with explicit plugin governance. The build file should not accumulate stale plugin declarations by inertia.

A good packaging and deployment model also keeps the build reproducible. Anyone in the team, and ideally any automation runner, should be able to run the same defined build and produce the same artifact from the same source state. This is one reason hidden local dependencies and IDE-only build behavior are dangerous. If the application only packages correctly from one workstation with one undocumented local setting, the delivery process is not trustworthy.

Test execution should remain part of this build path unless there is a deliberate and justified reason to separate it. Packaging without testing should be an exception, not the default. The point of the delivery pipeline is to turn the tested source into a deployable artifact. If tests are routinely bypassed, the build loses much of its value as a quality gate. The same is true of dependency resolution. The build should not silently pull in unstable versions or accept ambiguous runtime assumptions. The more explicit the build becomes, the safer promotion and deployment become later.

The strongest Mule delivery teams therefore treat the Maven build not as a clerical requirement but as a core expression of the application's packaging and deployment truth. It defines how the application is assembled, how tests participate, which plugins control deployment, and how runtime-aligned behavior is enforced. That is what makes it worth maintaining carefully.

## 12.4: Environment Promotion, CI-CD Flow, and Version-safe Deployment Practices

A deployment pipeline becomes trustworthy when it can move the same application through environments in a controlled way without changing its identity at each step. That is the essence of environment promotion. The application built in one stage should not become a different application because of hidden environment edits, manual patching, or inconsistent packaging behavior later in the pipeline. Instead, the same versioned artifact should move forward, with environment-specific configuration applied through controlled inputs rather than code changes. This is what allows teams to say with confidence that what passed earlier quality checks is what is now being evaluated or deployed in the next environment.

Promotion matters because integration defects often appear only after the application leaves local development. A flow may work with local values but fail when a production-like timeout differs. A deployment may pass into one environment but fail in another because a property was expected differently. A connector may behave differently because the runtime or target configuration was not aligned. CI-CD is meant to reduce these surprises, but it can only do that if the promoted artifact, the environment configuration model, and the plugin behavior remain disciplined enough that the pipeline reflects reality.

A useful CI-CD flow for MuleSoft work generally starts with source control change detection, then runs build and unit tests, packages the application artifact, and deploys it to a lower environment under controlled parameters. Additional validation may happen there, after which the same artifact is promoted to the next environment with new environment-specific configuration but without rebuilding it into a different semantic version of the same code. The point is not ceremony. The point is control. Every environment should reveal something meaningful about the same application version rather than introducing quiet divergence.

<!-- p. 139 -->
The following Shell example shows a straightforward pipeline-style command pattern for building and packaging an application with explicit environment parameters.

Shell

```shell
mvn clean test package \
  -Denv=test \
  -Dsecure.key=test-secure-key
```

This is the simplest correct version because it shows the basic idea of environment-aware build execution in a repeatable form. It is scriptable and therefore suitable for pipeline use.

A more robust version often separates packaging from deployment and makes the deployment target and credentials explicit through controlled variables rather than local defaults.

Shell

```shell
mvn clean test package \
  -Denv=test \
  -Dsecure.key=test-secure-key && \
mvn deploy \
  -Dtarget.environment=test \
  -Ddeploy.clientId=test-client-id \
  -Ddeploy.clientSecret=test-client-secret
```

The difference matters because packaging and deployment are now visible as distinct steps. This improves traceability and makes it easier to reason about where a failure occurred, whether in code quality or in runtime promotion.

A version-safe promotion practice depends on more than commands. It depends on how version numbers, runtime assumptions, and plugin declarations are managed. Application versioning should communicate what is being promoted. Runtime line and plugin versions should be explicit enough that the pipeline does not accidentally alter behavior between environments. One of the most dangerous delivery patterns is when a pipeline is technically automated but semantically ambiguous. The commands succeed, yet the actual runtime configuration or plugin interpretation is not what the team believes it is deploying.

This is why deployment plugin versions deserve governance. They should be treated as controlled dependencies of the delivery system, not as incidental technical detail. The same principle applies to runtime line selection and Java alignment. If the build is meant to target a certain runtime combination, that intent should be visible and stable in the project and the pipeline. Delivery quality deteriorates quickly when these assumptions drift silently.

Environment promotion also depends on disciplined configuration separation. Environment-specific values such as endpoints, credentials, queue names, or file locations should be externalized so the application artifact stays the same while the environment changes around it. A team should not need to edit application code or rebuild a different artifact just to switch from one environment to another. If that is happening routinely, the promotion model is weak because the application version is no longer the same thing across environments.

The following XML example shows a property-loading pattern designed to support controlled environment promotion through externalized configuration.

XML

```xml
<mule xmlns:configuration-properties="http://www.mulesoft.org/schema/mule/configuration-properties"
      xmlns:secure-properties="http://www.mulesoft.org/schema/mule/secure-properties"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/configuration-properties http://www.mulesoft.org/schema/mule/configuration-properties/current/mule-configuration-properties.xsd
        http://www.mulesoft.org/schema/mule/secure-properties http://www.mulesoft.org/schema/mule/secure-properties/current/mule-secure-properties.xsd">

    <configuration-properties file="properties/common.yaml"/>
    <configuration-properties file="properties/${env}.yaml"/>
    <secure-properties:config name="SecureProperties"
                              file="properties/${env}-secure.yaml"
                              key="${secure.key}"/>
</mule>
```

<!-- p. 140 -->
This is the simplest correct version because it reflects the promotion principle clearly. The application structure stays the same, while the environment determines which property sources are applied.

A more robust version is often paired with build and deployment discipline that keeps environment values outside the artifact and injects them through pipeline-controlled inputs.

XML

```xml
<mule xmlns:configuration-properties="http://www.mulesoft.org/schema/mule/configuration-properties"
      xmlns:secure-properties="http://www.mulesoft.org/schema/mule/secure-properties"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
        http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
        http://www.mulesoft.org/schema/mule/configuration-properties http://www.mulesoft.org/schema/mule/configuration-properties/current/mule-configuration-properties.xsd
        http://www.mulesoft.org/schema/mule/secure-properties http://www.mulesoft.org/schema/mule/secure-properties/current/mule-secure-properties.xsd">

    <configuration-properties file="properties/common.yaml"/>
    <configuration-properties file="properties/${env}.yaml"/>

    <secure-properties:config name="SecureProperties"
                              file="properties/${env}-secure.yaml"
                              key="${secure.key}"/>
</mule>
```

The XML may look the same because the real improvement is in operational use rather than syntax. The stronger practice is that the pipeline controls the `env` and `secure.key` values consistently, and the artifact itself remains unchanged across promotion stages. That is what makes the deployment model safer.

CI-CD quality also benefits from staged validation. A good lower-environment deployment should reveal whether the application can start, resolve configuration, pass its automated tests, and interact correctly with the expected lower-environment dependencies. Promotion to the next stage should depend on that evidence rather than on schedule pressure alone. The point of the pipeline is to turn quality signals into deployment decisions while the cost of correction is still manageable.

Another useful habit is to treat rollback and redeploy as pipeline concerns, not as improvisations. If a deployment fails or a promoted version must be withdrawn, the team should not be inventing the process from scratch under stress. Versioned artifacts, disciplined environment config, and clear deployment commands make rollback or controlled replacement much easier. This is another reason the promoted artifact should remain stable. You can only roll back confidently if you know what version was actually deployed.

The flow of CI-CD should also be honest about scope. Unit tests are essential, but they are not the whole story. Packaging checks, configuration resolution, deployment success, and environment-specific validation all contribute to release confidence. A strong pipeline does not pretend one layer of checking is enough. It builds confidence progressively, from local behavior to packaged artifact to deployed runtime presence.

Version-safe practice is also about resisting casual edits in shared environments. If a lower environment is repeatedly modified through manual settings that are not reflected in the project or pipeline, it becomes less useful as a promotion stage because the deployed result no longer matches what the controlled process thinks exists. This is a common source of confusion in growing delivery teams. The cure is not perfection. It is discipline. Configuration and deployment state should be expressed as much as possible through the same controlled mechanisms the pipeline uses.

The broader lesson is that delivery pipelines are part of application design. They determine whether the quality work done in tests and architecture actually survives into runtime in a reliable form. A strong CI-CD model for MuleSoft applications keeps the artifact stable, the environment variation externalized, the plugin and runtime assumptions explicit, and the promotion path repeatable. That is what allows teams to move from source to production without depending on luck or memory.
<!-- p. 140: el final de esta frase ("move from source to production...") aparece en el libro como recuadro destacado con letra más grande; es parte del último párrafo -->
