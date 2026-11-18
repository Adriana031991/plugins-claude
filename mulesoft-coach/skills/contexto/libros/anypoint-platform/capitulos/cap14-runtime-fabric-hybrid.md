---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 14
titulo: "Runtime Fabric and Hybrid Cloud Architecture"
paginas_pdf: "150-157"
temas: [deploying-managing]
transcrito: 2026-11-14
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha). En las págs. 152-153 hay tres paneles por página.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza al principio de la p. 150 y termina arriba de la p. 157 (el cierre está en un recuadro destacado y se unió al último párrafo). El capítulo 15 empieza en la misma p. 157.
- El código solo aparece en 14.3 (dos pom.xml para Runtime Fabric). La sangría de esos XML en el PDF es irregular entre paneles; se ordenó por la estructura, sin agregar ni quitar líneas.
-->

# Chapter 14: Runtime Fabric and Hybrid Cloud Architecture

<!-- p. 150 -->
Hybrid deployment becomes important when integration architecture has to satisfy more than one kind of runtime need at the same time. Some applications need the convenience of a managed cloud service. Others need tighter network control, closer placement to internal systems, stronger alignment with an existing container platform, or operational patterns that are already centered on enterprise infrastructure teams. In that context, the question is no longer simply where a Mule application can run. The real question is how to place applications across runtime models without losing platform consistency, governance, visibility, or delivery speed. Runtime Fabric exists in that space.

Runtime Fabric matters because it gives MuleSoft teams a deployment model that keeps the Anypoint control experience while allowing application execution to occur on infrastructure that the organization manages more directly. This is attractive in hybrid architectures where cloud-only placement is not always the best fit. Some workloads need proximity to internal databases, queues, file systems, or low-latency internal APIs. Some security programs require stronger control over network boundaries or container platform standards. Some operations teams already run mature Kubernetes environments and want Mule applications to fit into that broader operating model instead of living in a separate runtime estate. Runtime Fabric helps connect those needs to the broader Anypoint platform.

That does not mean Runtime Fabric should be understood as simply CloudHub on your own cluster. It is a different hosting model with a different operational profile. It uses a container-oriented runtime foundation and depends on infrastructure that the organization is responsible for preparing and maintaining. This means the deployment model can be more flexible in some ways, but it also means the runtime team takes on more responsibility for platform readiness, underlying cluster health, storage, networking, and lifecycle operations. That tradeoff is worth understanding early, because Runtime Fabric is most effective when it is chosen for the right reasons rather than as a default response to any cloud hesitation.

It is also important to understand that Runtime Fabric sits inside a wider hybrid cloud strategy rather than replacing one. A hybrid architecture often includes multiple runtime destinations with different strengths. Some APIs may fit a managed cloud runtime very well. Some internal integration workloads may be better placed in Runtime Fabric because they need tighter network adjacency or local operational control. Some supporting components may remain on other hosting approaches entirely. The value of Anypoint Platform in this situation is not that it forces all workloads into one runtime model. It is that it gives teams a more unified control, governance, deployment, and API management experience across those models.

Another reason this topic deserves careful attention is that Runtime Fabric discussions often become too abstract or too infrastructure-heavy too quickly. It is easy to get lost in terminology about clusters, nodes, container scheduling, overlays, and runtime placement without connecting those details back to the real question, which is how Mule applications are actually delivered, secured, operated, and compared with other runtime choices. A useful understanding of Runtime Fabric has to remain application-centered. It should clarify how Mule workloads behave there, how the platform relationship works, what operational responsibilities shift, and what tradeoffs the hosting model creates.

This section begins with Runtime Fabric architecture and its relationship to Kubernetes, because that relationship is central to understanding the hosting model correctly. It then turns to installation, configuration, and day-to-day operation, since Runtime Fabric only works well when the environment itself is treated as a real platform product rather than as an install-once artifact. After that, it explains how APIs and applications can be deployed across hybrid runtime topologies, because a hybrid estate is where Runtime Fabric shows much of its practical value. Finally, it compares Runtime Fabric with CloudHub and other
<!-- p. 151 -->
hosting approaches so that placement choices can be made with a realistic sense of responsibility, control, and operational fit. The goal is to make Runtime Fabric feel like a concrete architectural option rather than a vague alternative to managed cloud deployment.

## 14.1: Runtime Fabric Architecture and Its Relationship to Kubernetes

Runtime Fabric is easiest to understand when it is viewed as a Mule application runtime layer that operates on top of container orchestration infrastructure rather than as a standalone product detached from that infrastructure. Its architecture matters because it sits at the intersection of the Anypoint control plane and a container-based execution environment. That gives it some of the operational benefits of container orchestration while still allowing Mule applications to be deployed and managed through familiar platform workflows. The result is a runtime model that feels connected to Anypoint Platform at the management layer but much closer to enterprise infrastructure practices at the execution layer.

Kubernetes enters the picture because Runtime Fabric relies on container orchestration concepts and aligns with Kubernetes-based infrastructure patterns. This does not mean every Runtime Fabric discussion should become a generic Kubernetes discussion. Mule application teams do not need to behave as though they are writing raw Kubernetes-native workloads by hand. What does matter is that the hosting environment is built around clustered container scheduling concepts, and this changes how runtime placement, scaling, resource allocation, and operational ownership should be understood. The underlying orchestration model influences how applications are deployed, restarted, scaled, isolated, and observed.

A useful mental model is that Runtime Fabric gives Mule applications a managed application runtime experience within a cluster-oriented execution environment that the organization operates more directly than CloudHub. The Anypoint side continues to provide deployment, management, and governance capabilities. The infrastructure side provides the cluster substrate, network behavior, and broader operational context. This dual nature is what makes Runtime Fabric attractive for hybrid environments. It preserves platform consistency while acknowledging that some organizations need runtime execution to live closer to their existing infrastructure practice.

That relationship with Kubernetes also explains why Runtime Fabric is often appealing to teams that already have strong container platform operations. If the organization already knows how to run, secure, monitor, and govern cluster-based environments, then Mule applications can become part of that operating landscape without giving up the Anypoint deployment and management model. This reduces the cultural gap between integration teams and infrastructure teams because the runtime does not sit entirely outside the organization's established operational patterns.

At the same time, it is important not to oversimplify the relationship. Runtime Fabric is not just a generic Kubernetes namespace where Mule applications are dropped as ordinary containers with no higher-level runtime awareness. The Anypoint platform still matters. Application deployment, policy relationships, runtime management, and governance remain connected to the platform experience. That is what distinguishes Runtime Fabric from simply running Mule on arbitrary container infrastructure with completely self-managed tooling around it. The control plane relationship is one of its main strengths.

The architecture also changes the way teams think about responsibility boundaries. In a fully managed runtime like CloudHub, much of the execution environment is abstracted behind the service. With Runtime Fabric, the organization takes on more of the responsibility for the environment in which the Mule runtime operates. That includes cluster health, infrastructure capacity, network configuration, storage assumptions where relevant, and operational integration with enterprise tooling. This is not a disadvantage by itself. In many organizations it is the reason Runtime Fabric is attractive. But it does mean the runtime choice should be made with open eyes.
<!-- p. 152 -->
The application team and platform team are entering a hosting model with more shared operational responsibilities.

Resource behavior is one of the clearest examples of this architectural difference. In Runtime Fabric, Mule application execution competes and cooperates within a cluster-based resource model. CPU, memory, replica behavior, and scheduling decisions need to be understood in that context. This is not fundamentally different from the reality that every runtime has resource limits, but it becomes more explicit. A team cannot simply assume that runtime capacity is an invisible managed pool. Resource planning becomes more closely tied to the organization's infrastructure operations and cluster governance.

The relationship to Kubernetes also shapes availability thinking. Cluster orchestration can improve resilience and operational flexibility, but high availability still depends on how the applications are deployed and how the cluster is designed. If the cluster is unhealthy, under-resourced, or poorly segmented, Runtime Fabric will not magically correct that. Likewise, if the Mule application itself is not restart-tolerant, replica-aware, and safe under repeated scheduling events, container orchestration will not solve the underlying design weakness. This is another reason why the architecture should be understood as cooperative between platform and infrastructure, not magical on either side.

Another important architectural feature is how Runtime Fabric supports hybrid placement logic. Some applications may need to run close to systems that remain inside a private data center or tightly controlled network zone. Others may need to align with enterprise cluster strategies already used for broader platform services. The Kubernetes relationship matters here because it supports that kind of placement flexibility while still allowing Mule deployment to remain tied to Anypoint operational models. In other words, the architecture supports a hybrid runtime strategy without asking the organization to abandon the platform's management experience.

Network design becomes more visible in this model as well. Cluster-based runtime execution means the networking assumptions of the environment matter significantly. Ingress, east-west traffic, service connectivity, and access to internal systems are no longer abstracted in the same way as in a more fully managed runtime. This is not a flaw. It is part of what gives Runtime Fabric its flexibility. But it also means the architecture should be assessed together with enterprise network and security teams, not only by Mule developers.

The control plane and runtime plane distinction is particularly helpful here. The Anypoint control experience remains central for managing and deploying applications, while the actual runtime execution occurs on infrastructure that reflects the organization's operational landscape more directly. That split is one of the defining characteristics of Runtime Fabric. It allows enterprise teams to keep central governance, deployment, and visibility practices while adapting execution to infrastructure realities that may not fit a one-size-fits-all cloud-managed model.

This architectural position also affects how teams should think about standardization. Runtime Fabric can help unify hybrid deployment under one broader platform, but it does not eliminate the need for shared cluster standards, network practices, operational monitoring, and environment preparation. In fact, it makes those things more important, because a loosely governed Runtime Fabric environment can become difficult to operate even if the Anypoint side remains clean. The hosting architecture succeeds when both the platform view and the infrastructure view are disciplined enough to support each other.

The most useful conclusion to draw is that Runtime Fabric is not just an alternative place to deploy Mule applications. It is a hosting architecture that combines Anypoint management with cluster-oriented execution. Its relationship to Kubernetes is central because that is what enables the hybrid infrastructure fit. Its value is strongest when an organization genuinely needs that fit and is prepared to operate the environment accordingly. When understood that way, Runtime Fabric becomes a clear architectural option rather than a vague compromise between cloud and self-hosting.

## 14.2: Installing, Configuring, and Operating Runtime Fabric Environments

A Runtime Fabric environment is not something you install once and then forget. It behaves much more like an internal platform product. That means installation is only the beginning. What matters just as much is how the environment is prepared, configured, observed, upgraded, and governed over time. This is one of the main reasons Runtime Fabric should be chosen deliberately. It offers powerful deployment flexibility, but it assumes the organization is ready to treat the hosting layer as an operational responsibility with real lifecycle work attached to it.

Installation starts with infrastructure readiness. The cluster or cluster-like environment on which Runtime Fabric will operate must be suitable in terms of resources, networking, security, and operational governance. This sounds obvious, but it is one of the places where deployment projects go wrong. Teams sometimes approach installation as though Runtime Fabric itself will compensate for an immature underlying environment. It will not. If the cluster has weak networking, inadequate resource planning, poor observability, or inconsistent operational ownership, the Mule applications deployed on it will inherit that instability in one form or another.

Configuration then becomes the point where the environment is shaped into a usable runtime destination rather than just a successful installation. Capacity allocation, node planning, networking assumptions, certificate handling, environment registration, and access boundaries all matter here. A Runtime Fabric environment should not be thought of as neutral empty space. It reflects choices about where Mule applications will run, how they will reach dependencies, how they will be observed, and how deployment teams will interact with the runtime.

One of the most important operational questions is ownership. Runtime Fabric environments sit between platform operations and infrastructure operations, which means unclear ownership can become a serious problem very quickly. If nobody knows who is responsible for cluster capacity, runtime upgrades,
<!-- p. 153 -->
certificate renewal, node health, or network troubleshooting, then the environment may appear healthy until the first incident reveals the gap. Strong Runtime Fabric operations therefore require a clear shared model. The Anypoint platform side and the infrastructure side need a practical agreement about who owns which layers and how they coordinate changes.

This is also where environment design should be taken seriously. A development Runtime Fabric environment can tolerate different levels of availability, scale, and operational strictness than a production one, but that does not mean it should be careless. Lower environments are where teams learn how the hosting model behaves. If those environments are too unrealistic, they stop being useful preparation for production behavior. It is usually better for the lower environment to be smaller than production but not conceptually different from it in ways that hide important runtime truths.

Installation planning should also account for how Mule applications will actually be deployed and updated later. A Runtime Fabric environment is not valuable simply because it exists. It becomes valuable when the deployment process into it is repeatable, secure, and understandable. That means networking, DNS assumptions where relevant, secrets handling, ingress expectations, and runtime resource governance all need to be established clearly enough that application teams can target the environment without turning every deployment into a custom negotiation.

Operating the environment over time is where maturity really shows. Runtime Fabric needs to be monitored as a platform, not only as a place where application logs happen to exist. Node health, cluster behavior, capacity consumption, certificate validity, connectivity expectations, and environmental consistency all matter. If the team only looks at application-level issues and never at the health of the environment as a whole, problems may accumulate until several applications are affected at once. That is why Runtime Fabric operations should include environment-level observability, not just per-application troubleshooting.

Change management matters as well. Cluster-oriented environments evolve. Infrastructure teams patch systems, adjust networking, improve resource policies, or alter shared controls. If those changes happen without understanding the implications for Mule application behavior, the result can be unexpected outages or degraded performance. Runtime Fabric environments are most stable when infrastructure and platform changes are introduced with awareness of how the runtime and the deployed applications will react. This is another reason why the environment should be treated as a product, not as static plumbing.

A useful discipline is to think in terms of operational baselines. A Runtime Fabric environment should have known expectations for capacity, placement, connectivity, logging, certificate lifecycle, upgrade planning, and deployment behavior. These baselines make incident diagnosis easier because the team knows what "normal" looks like. Without them, support often becomes reactive and anecdotal. One person thinks the environment is behaving normally, another assumes the application is at fault, and nobody has a common reference point for the hosting layer itself.

Configuration quality also affects how easy the environment is to scale operationally. A small pilot environment can tolerate some manual knowledge. A broader enterprise environment serving multiple teams cannot. Naming conventions, environment registration practices, access control boundaries, and support procedures need enough structure that the platform can grow without becoming harder to govern. Runtime Fabric is particularly sensitive to this because its value increases with scale, but so does the cost of ambiguity.

Another important operational issue is lifecycle alignment. Runtime Fabric exists within a wider platform lifecycle and an infrastructure lifecycle at the same time. The hosting environment needs to evolve with supported runtime expectations, infrastructure standards, and security requirements. If it lags behind any of these for too long, the platform starts to accumulate hidden risk. This is another argument for clear ownership and clear upgrade planning. Without them, it can become a complicated hosting layer that creates more uncertainty than it resolves.

The environment must stay supportable as both Mule runtime expectations and enterprise infrastructure practices change. Operational support for Runtime Fabric also benefits from strong documentation, though not in a bureaucratic sense. Teams should know how applications are expected to enter the environment, what networking boundaries apply, how secrets are handled, what observability tools are available, how upgrades are coordinated, and how incidents should be triaged between platform and infrastructure teams. These are practical operating questions. If the answers exist only in the memory of one expert, the environment is more fragile than it needs to be.

The broader lesson is that Runtime Fabric becomes powerful when it is operated as shared runtime infrastructure with a clear product mindset. Installation is necessary, but it is not the same thing as readiness. Readiness comes from environment governance, ownership clarity, operational observability, disciplined configuration, and lifecycle planning. When those are in place, Runtime Fabric can support hybrid Mule deployment in a way that feels strong and sustainable.

## 14.3: Deploying APIs and Applications Across Hybrid Runtime Topologies

Hybrid architecture becomes real when the organization stops asking where Mule can run in principle and starts deciding where particular workloads should run in practice. This is where runtime topology matters. A topology is not merely a diagram of boxes. It is the operational arrangement of runtimes, network paths, deployment destinations, and control relationships that determine how applications behave in the real estate. Runtime Fabric becomes particularly valuable here because it makes it possible to keep a common Anypoint deployment and governance experience while placing execution in environments that suit different kinds of workloads.

A hybrid topology often includes more than one runtime destination. Some APIs may fit CloudHub well because they benefit from fully managed runtime operations, public or semi-
<!-- p. 154 -->
public exposure models, and straightforward scaling behavior. Some internal applications may fit Runtime Fabric better because they need close connectivity to enterprise systems, tighter network control, or placement within infrastructure governed by cluster-centric operations teams. In some organizations, there may also be supporting components or legacy hosting approaches outside both of those options. The point is not to eliminate variety. The point is to make variety manageable.

A good hybrid deployment model therefore starts with workload classification. An application's placement should reflect what it needs. An API that fronts internal systems but is consumed only within a private network may not belong in the same runtime shape as an externally consumed experience API. A batch integration close to large internal data sources may benefit from Runtime Fabric placement even if another part of the program uses CloudHub. A platform becomes more useful when it supports these placement differences without forcing teams to reinvent governance and deployment for each one.

The key strength here is that the control plane can remain more unified than the runtime estate. Teams still design APIs, publish assets, apply management controls, and deploy through Anypoint-oriented workflows. What changes is the runtime destination and its operational profile. This allows organizations to pursue hybrid architecture without fragmenting completely into unrelated deployment cultures. A developer can still work in one broader platform model while targeting different runtimes based on real needs.

The following example shows a Maven deployment configuration pattern for a Runtime Fabric target. It illustrates how a Mule application can be packaged and deployed toward a hybrid runtime destination with explicit target settings.

XML

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.acme.integration</groupId>
    <artifactId>customer-sync-api</artifactId>
    <version>1.0.0</version>
    <packaging>mule-application</packaging>

    <properties>
        <mule.maven.plugin.version>4.1.1</mule.maven.plugin.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.mule.tools.maven</groupId>
                <artifactId>mule-maven-plugin</artifactId>
                <version>${mule.maven.plugin.version}</version>
                <extensions>true</extensions>
                <configuration>
                    <runtimeFabricDeployment>
                        <uri>${anypoint.uri}</uri>
                        <provider>MC</provider>
                        <environment>${anypoint.environment}</environment>
                        <target>${rtf.target}</target>
                        <applicationName>${project.artifactId}</applicationName>
                    </runtimeFabricDeployment>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

This is the simplest correct version because it makes the deployment target explicit and shows that the artifact can be aimed at a Runtime Fabric destination through controlled build configuration.

A more robust version becomes useful when the deployment should also express runtime properties, replica expectations, and environment-aware settings more clearly as part of the topology decision.

XML

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.acme.integration</groupId>
    <artifactId>customer-sync-api</artifactId>
    <version>1.0.0</version>
    <packaging>mule-application</packaging>

    <properties>
        <mule.maven.plugin.version>4.1.1</mule.maven.plugin.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.mule.tools.maven</groupId>
                <artifactId>mule-maven-plugin</artifactId>
                <version>${mule.maven.plugin.version}</version>
                <extensions>true</extensions>
                <configuration>
                    <runtimeFabricDeployment>
                        <uri>${anypoint.uri}</uri>
                        <provider>MC</provider>
                        <environment>${anypoint.environment}</environment>
                        <target>${rtf.target}</target>
                        <applicationName>${project.artifactId}</applicationName>
                        <replicas>${rtf.replicas}</replicas>
                        <properties>
                            <env>${deploy.env}</env>
                            <secure.key>${secure.key}</secure.key>
                        </properties>
                    </runtimeFabricDeployment>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

This stronger version is closer to a real hybrid deployment model because it shows how topology-specific decisions, such as the target and replica count, can remain explicit in the deployment definition while still using the same broader application build model.

Hybrid topology design also changes how teams think about API portfolios. The same portfolio may include applications deployed to different runtimes for valid reasons. A system-
<!-- p. 155 -->
facing integration with strict private connectivity needs may run on Runtime Fabric. An experience API with a simpler public or semi-public access pattern may run on CloudHub. What matters is that the runtime choice should not create governance fragmentation. API management, policy intent, lifecycle visibility, and deployment discipline should remain coherent even when the runtime destinations differ.

This is why the control plane relationship matters so much. A hybrid runtime topology is manageable when the organization can still think in terms of one broader platform for design, deployment, management, and governance. It becomes much harder when every runtime destination brings its own entirely separate process culture. Runtime Fabric helps because it preserves a strong relationship to Anypoint deployment and management even though the actual execution occurs in a different kind of environment than CloudHub.

Network boundaries become especially important in hybrid topologies. An internal API running on Runtime Fabric may be designed for private consumption only. A public-facing API on CloudHub may need policy-managed external exposure. Another internal integration may move data between those two environments. The topology needs to support those flows cleanly. This means placement decisions should be made with a clear picture of dependency paths, consumer location, trust boundaries, and operational support responsibility. The wrong runtime placement can create unnecessary latency, difficult troubleshooting paths, or awkward network bridging. The right placement can simplify all three.

Hybrid topology also affects release planning. Different runtime destinations may have different operational lead times, maintenance coordination patterns, or support team dependencies. A CloudHub deployment may be largely application-team driven once the environment is ready. A Runtime Fabric deployment may involve stronger coordination with cluster operations or network teams depending on the organizational model. This does not mean one is slower in every case. It means the runtime destination influences the broader delivery process. Good hybrid architecture accounts for that instead of assuming all runtime targets behave the same way operationally.

Another subtle but important benefit of hybrid topology is that it supports gradual evolution. Organizations often cannot move every integration workload into one preferred model at once, and in many cases they should not try. Some workloads fit managed cloud sooner. Others need private placement for longer-term reasons. Runtime Fabric allows the organization to expand platform consistency without forcing a false all-or-nothing choice. That is often one of its strongest practical advantages. It helps unify operations across varied runtime needs rather than demanding uniformity where it would be artificial.

A useful way to judge the health of a hybrid topology is to ask whether each runtime placement has a clear reason and whether those reasons remain understandable to both platform and application teams. If the answer is yes, then topology variety is probably serving architecture. If the answer is no, then runtime diversity may be drifting into accidental complexity. The point is not to minimize the number of runtimes at all costs. The point is to ensure that each one earns its place.

The deployment mechanics should also reinforce this clarity. An application targeted to Runtime Fabric should make that target explicit in pipeline and deployment configuration. An application targeted to CloudHub should do the same. Environment properties, replica expectations, and runtime-specific operational assumptions should not be hidden in private scripts or remembered only by one release engineer. Hybrid topology succeeds when placement is visible in both architecture and delivery practice.

The broader lesson is that deploying across hybrid runtime topologies is not a workaround. It is often the actual architecture. Runtime Fabric makes this practical by giving Mule applications a container-oriented private or enterprise-controlled execution option while preserving strong linkage to the Anypoint management model. When used well, this allows an API and integration estate to place workloads where they fit best without breaking platform consistency. That is one of the clearest signs of a mature hybrid cloud strategy.

## 14.4: Comparing Runtime Fabric, CloudHub, and Other Hosting Approaches

A hosting decision becomes useful only when it is based on tradeoffs instead of slogans. Runtime Fabric, CloudHub, and other hosting approaches each solve different parts of the runtime problem well. None is automatically superior in every category, and none should be treated as a default answer without reference to the workload, the operating model, the network shape, the team structure, and the level of infrastructure responsibility the organization is actually prepared to carry. A clear comparison is therefore less about declaring a winner and more about identifying fit.

CloudHub is strongest when the organization wants a highly managed runtime experience with relatively low infrastructure ownership. It is especially appealing for teams that value deployment simplicity, fast environment activation, and reduced responsibility for the underlying runtime estate. It often fits well for APIs and integrations that do not require deep infrastructure customization or close private adjacency to systems that are difficult to reach from a more managed runtime model. The value is in operational convenience and strong platform integration. The tradeoff is that the organization accepts the runtime model and lifecycle behavior of a more managed service.

Runtime Fabric is strongest when that level of management convenience is not enough by itself, because the application needs something that CloudHub is not the best fit for. That may mean deeper network control, stronger alignment with enterprise cluster operations, closer proximity to internal systems, or a hosting strategy that must fit into a wider container platform model. The value is in flexibility and infrastructure alignment. The tradeoff is that the organization takes on more responsibility for the runtime environment and the operational quality of the underlying platform.

<!-- p. 156 -->
The comparison therefore starts with control. CloudHub reduces direct infrastructure control in exchange for managed runtime simplicity. Runtime Fabric gives more execution-environment control and placement flexibility, but expects more from the organization operationally. Neither of these is inherently better. The right choice depends on whether the extra control solves a real problem worth the additional responsibility.

Network fit is often one of the strongest deciding factors. If the application primarily serves workloads that fit well in a managed cloud runtime with straightforward ingress and outbound connectivity, CloudHub may be a strong choice. If the application depends heavily on systems that are best reached within controlled enterprise network boundaries or cluster-based private environments, Runtime Fabric may be more appropriate. A hosting model should reduce network friction, not create it. This is why deployment decisions should be informed by the dependency map of the application rather than by platform preference alone.

Operational ownership is the next major differentiator. CloudHub lets platform and application teams focus more on the application itself because much of the runtime hosting burden is abstracted. Runtime Fabric requires a stronger operational model around the environment, including cluster health, lifecycle planning, network integration, and support coordination. Organizations that already run strong infrastructure platforms may see this as a natural fit rather than a burden. Organizations without that maturity may find that the extra control is not worth the overhead for many workloads.

Release and maintenance behavior also differ in practical feel. CloudHub gives a more fully managed service pattern. Runtime Fabric is more tightly connected to the organization's own environment operations. This affects how teams think about upgrades, environment consistency, maintenance planning, and support escalation. CloudHub can be simpler to operate when speed and standardization are the main priorities. Runtime Fabric can be more flexible when infrastructure policy and private runtime control are the main priorities.

Another comparison point is scaling and topology shape. CloudHub makes certain runtime scaling and multi-replica patterns accessible within a managed service experience. Runtime Fabric also supports scale, but the scaling behavior lives within a cluster-oriented environment that the organization operates more directly. This changes how resource planning and performance responsibility are interpreted. In CloudHub, the platform-managed runtime absorbs more of the hosting complexity. In Runtime Fabric, scale behavior must be considered together with cluster resource planning and infrastructure standards.

Security and compliance expectations often influence the decision as well. Some organizations are comfortable with managed cloud runtime for a broad range of workloads. Others need or prefer hosting approaches that align more closely with existing private infrastructure policies, cluster standards, or segmented network models. Runtime Fabric can be attractive in those cases because it supports a hybrid pattern without giving up the broader Anypoint control experience. Again, the right conclusion depends on actual requirements, not on abstract preference for "more control" or "more cloud."

It is also worth comparing both of these with more traditional or custom hosting approaches outside the main managed runtime options. Some organizations may still operate Mule runtimes in self-managed patterns or maintain legacy hosting arrangements. These approaches can provide very high control, but they usually also require much more direct infrastructure and lifecycle ownership. Compared with those models, both CloudHub and Runtime Fabric often provide stronger integration with Anypoint governance and deployment workflows. The question is how much infrastructure responsibility the organization wants to retain and how valuable a more unified control-plane experience is in return.

There is also a team-design question here. CloudHub often suits teams that want strong platform leverage with less direct platform engineering work. Runtime Fabric suits organizations where platform engineering and infrastructure operations already play a significant role and can support the hosting model effectively. A self-managed or legacy approach may remain in place where neither of the platform-hosted models fits yet, but it should be chosen knowingly rather than by inertia. Hosting decisions are not only technical. They are organizational. They express how much operational burden the teams can carry and where they want that burden to sit.

Another practical way to compare the options is by asking what problem each one solves best. CloudHub solves managed runtime convenience very well. Runtime Fabric solves hybrid placement and cluster-aligned execution very well. Other hosting approaches may solve deep custom infrastructure control or legacy continuity, but often at the cost of more fragmented operations. The strongest platform strategy usually uses this kind of problem-fit logic rather than trying to force one answer into every workload.

A mature organization may use more than one of these approaches at the same time. That is not a failure of standardization. It can be a sign of architectural realism, as long as each hosting approach has a clear reason and remains tied to a coherent management and governance model. The danger is not runtime diversity itself. The danger is runtime diversity without a clear platform story. Anypoint Platform helps reduce that danger by allowing management and governance consistency even when the execution destinations differ.

The clearest comparison therefore is this. CloudHub is about a more managed runtime experience with less infrastructure ownership. Runtime Fabric is about a more flexible hybrid execution model with greater infrastructure alignment and responsibility. Other hosting approaches generally involve even more direct operational control and burden. The best choice depends on placement needs, network realities, team maturity, compliance expectations, and how much of the runtime problem the organization wants the platform to manage versus how much it wants to manage itself.

When these tradeoffs are understood honestly, the hosting decision becomes much easier. Teams stop asking which option sounds most advanced and start asking which option fits the workload, the operating model, and the broader architecture most responsibly. That is the comparison that actually matters.
<!-- p. 157: el final de este párrafo ("workload, the operating model, ... actually matters.") aparece en el libro como recuadro destacado con letra más grande; es parte del último párrafo -->
