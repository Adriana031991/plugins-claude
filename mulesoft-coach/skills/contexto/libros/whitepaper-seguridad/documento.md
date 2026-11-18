---
documento: "Security by Design: Building Defense in Depth with an Application Network"
autor: "MuleSoft (whitepaper)"
paginas_pdf: "1-7"
temas: [application-networks, reuso-exchange, deploying-managing]
transcrito: 2026-11-17
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El PDF tiene capa de texto, así que el texto sale del propio PDF (no de una imagen); se revisó contra la imagen de cada página.
- Orden de lectura: columna izquierda y luego derecha.
- Las palabras partidas con guion por el ancho de columna se unieron (self-service, well-defined, point-to-point, impossible-to-fill, as-needed, API-led, built-in). Se conservaron los errores del original (por ejemplo "security can longer be", "who's is using it", la falta de punto en "on the business An application network").
- Los recuadros destacados en azul se transcriben como citas (>) en el lugar donde aparecen.
- Las dos figuras (pp. 2 y 4) se describen en figuras.md.
- El documento cita fuentes de 2016 (MuleSoft Connectivity Benchmark 2016, Gartner 2016): es material antiguo.
-->

# Security by Design: Building Defense in Depth with an Application Network

<!-- p. 1: portada (logo de MuleSoft y título) -->

<!-- p. 2 -->
## Executive Summary

**Challenges**

- CIOs must increase the clockspeed of their business with a limited number of resources, and with the demands of the business for technology solutions growing ever more quickly, have to figure out how to make IT scale to match.
- CISOs need to prevent against bad actors gaining control of systems, but are hampered by poor visibility, shadow IT, and the reputation as the blocker to innovation.
- CIOs and CISOs must partner to develop security and agility together, but often their goals seem misaligned.

**Recommendations**

- Create a better understanding of what is happening in the business by corralling and analyzing projects in progress.
- Take an API-led approach to connectivity and securely expose critical assets while enabling visibility and governance.
- Create an organizational discipline of secure self-service and reuse.

## Introduction

No matter what size company you are or what industry you're in, because of the dramatic and extraordinary changes brought about by the advent of the digital world, you want to move faster and innovate more. However, your ambitions are checked by two things. First, most IT leaders are working in a world where 78% of your collective effort is spent just maintaining your existing IT landscape.[i] And secondly, 60% of digital businesses will suffer major service failures due to the inability of the IT security team to manage digital risk in new technology and use cases.[ii]

Moving faster and staying secure are often at odds in the enterprise technology landscape. But they don't have to be. It is possible to create a corporate culture of innovation while weaving security principles into the design of every application, data access point, and integration. Don't expect this to come from the software you buy, however. You need to think differently about how to change the clockspeed of your business. You can create a framework for faster innovation — and build in security by design — by building an application network.

## Enterprise challenges the CIO faces

Before considering how the needs of the CIO and the needs of the CISO can be combined, let's consider each separately. The CIO, of course, is facing numerous challenges to achieving her goals. The pace of development she must achieve is daunting and is rising all the time. To match that pace, the IT deployment infrastructure must increase, though the resourcing often cannot keep up with demand. Many IT teams spend the majority of their time maintaining existing systems and attempting to drive down technical debt in the face of a growing need from the business for new systems, applications, and innovations. This is creating an impossible-to-fill capacity gap.

<!-- figura: gráfico "IT delivery gap" (ver figuras.md) -->

If a CIO expects IT to be a sole enabler and expects the central IT organization to solve the capacity gap, she will be disappointed. Software itself is not going to be a solution. The CIO needs to get away from project-based thinking and move towards having a comprehensive strategy.

## Why connectivity is the key business strategy

The pressure to incorporate all of these systems into the enterprise technology stack is really a pressure to connect all of these systems. Many of these systems and applications don't make sense on their own. In order for everything to work and actually produce business value, they must be integrated together in some way.

The tempting way to do this is to pull things together in an as-needed fashion. In this type of scenario, as a new system is added, a new integration is added as well. This type of point-to-point integration is extremely common, and can appear to solve the problem, at least in the short term. The IT team sees the integration needs, quickly writes some custom code to solve it, and congratulates itself on dealing with the problem on time and on budget.

<!-- p. 3 -->
But over time, as this type of work keeps happening, the IT organization ends up with a huge mess — a mess that eventually stops the business from being able to go forward. When everything is hard-wired to everything, nothing can move without breaking everything else. This is why businesses often end up with risk aversion and ultimately a misalignment with what IT needs and where the business wants to go. The business wants to continue to innovate and create value, while IT is saying, "wait a minute, I have to somehow keep everything running."

In order for systems to work together properly, and for connectivity to not become an obstacle to moving at the pace the business desires, connectivity must become a strategic business discipline, not driven project-by-project but informed by a broader vision. A well-designed integration strategy becomes the cornerstone of the application network.

## The rise of shadow IT

Some organizations compound this problem through "shadow IT." The term "shadow IT" emerged when there was a well-accepted practice that all information technology needs were handled through the central IT group. All other parts of the business had to wait their turn in line to get their technology projects solved by IT, and thanks to the proliferation of point-to-point integrations or heavyweight SOA obligations, the pace was too slow. So departments like marketing, sales, finance, etc. had their own technologists produce or procure their own solutions outside the central IT department, creating the rise of shadow IT.

## Shadow IT presents challenges for both the CIO and CISO

Central IT doesn't like to be supplanted; when they're not part of the process in the beginning, they often come on at the end and act as a blocker. Yet the business still needs to keep going forward. If IT comes in and blocks innovation, these parts of the business will be even more motivated to go around IT. The same is true of security.

By not partnering with the business, and not helping to create frameworks and methods in order to make things more efficient, there's no way for IT or security to introduce best practices. It therefore often happens that IT and security both are firefighting problems that arise from shadow IT. They find one, they run their vulnerability scanner, and then they go put that fire out. Then there's another fire, and then another. They're so busy putting out fires that they don't have time to build frameworks for best practice and build partnerships with the rest of the business.

Interestingly, the principles behind the formation of shadow IT aren't necessarily negative. The business needs all of its parts to be thinking in an agile and innovative way. A strategic integration discipline, like an application network, harnesses the impulses behind the creation of shadow IT and turns them into business assets.

> It is possible to create a corporate culture of innovation while weaving security principles into the design of every application, data access point, and integration.

## Enterprise challenges a CISO faces

For the modern-day CISO, the proliferation of cloud-based mobile apps has dramatically increased the exposed surface area of the business. Each new app requires and enables access to organizational data and assets, and unless the security team was explicitly involved in the app's creation, acquisition, and delivery, users inside and outside the organization may have access to data and the ability to expose it without the CISO even being aware.

This challenge of visibility is compounded by the lack of standards by which organizational data and assets are shared and exposed. Different business units may adopt their own approach to security, or perhaps not take one at all, making the CISO's job of propagating security best practices unwieldy. As a result, standardization and visibility have emerged as extremely important traits of any kind of security structure. This can be done by providing well-defined entry points and exit points to organizational data and assets and ensuring that standards are documented and shared broadly across teams.

Another challenge is that the security team often has to fight about these problems right when they're about to go into production. It often occurs when IT is about to roll something out to solve a business problem and they didn't secure it. It's
<!-- p. 4 -->
full of vulnerabilities. The security team becomes a blocker rather than a partner, and as outlined above with shadow IT, the business works around it and creates opportunities for new threats to emerge. To solve this problem, security has to be designed into the IT architecture, and not just at the perimeter.

It's tempting to approach security by creating a centralized defense on the outside and having one or more tightly controlled number of entry points that the CISO is in charge of. Recent events across a number of organizations have proven this approach is not reliable, scalable, or adaptable.

A better way to think about security is in a compartmentalized way — as fortified units with common and distinct security requirements. In this case, you're not really increasing the surface area of what needs to be secured, even though there are more things that require security. What you are actually doing is providing a standardized framework; this best practice allows organizations to provide defense in depth.

## Creating security through API-led connectivity

Secure integrations are needed, but security can longer be solely in the domain of the CISO - there simply isn't the time or the resources to have one person or team create security for the entire business.

What you need to do instead is to move from a monolithic approach to application development and data entry to well-defined, well-fortified nodes, delivered via an API-led approach, potentially in a microservices architecture. Each of these nodes, designed and built by the teams that need them, will have security best practices baked in at the point of design. These nodes are connected through APIs, which are standardized, well-defined entry points that are easy to visualize and thus secure. If you have connected a few of these services and exposed those as APIs, you should be able to reuse those services, discover that connected entity and connect it to the next one. As you're building out and connecting more and more of these systems, you're not necessarily creating more and more connections, you're actually reusing the ones you've already created that are already known to and managed by the security team. This approach to IT architecture, called API-led connectivity, allows the business to go faster; you also get governance and compliance naturally along with it thanks to the API, an accessible and widely understood standard.

When architecture is developed this way, it's necessary to build in mechanisms for visibility and security into each part. It can't be imposed top-down like a SOA initiative; every group that is developing a service is actually doing it in a standardized, well-defined way that allows security to actually happen. When any group is building a project, when they're connecting services or building new ones and creating business value, they should always be thinking about "how do I actually create new assets as a result of this thing?" It should be an organizational discipline and later natural in the development methodology every new service creates assets to be reused later. That means that the next project can make use of those aspects again and again.

Each node or service has to add value to the whole network. That's actually the engine that makes this turn on; it creates the network effect and makes people want to participate in it. People start to see value in the network, and they automatically contribute more nodes to this to ensure people get more value out of it and so it spreads. Eventually, that's what makes the entire organization adopt the API-led approach and not create shadow systems.

## API-led connectivity forms an application network

What emerges out of this approach is an application network that is structurally more secure. It's organized around well-defined building blocks, and these building blocks all have an API linking them to the application network. Security is built-in because you've defined a door through an API and cleanly defined your inside and outside.

<!-- figura: diagrama de la application network (ver figuras.md) -->

<!-- p. 5 -->
It's hard to open an unsecure door. With an application network, security teams have many security options to keep those doors barred against unauthorized entrants:

- Who gets in (permissioning),
- What is required for them to get in (authentication)
- What they have access to (provisioning)
- Full visibility into what they've accessed (monitoring, auditing)
- Alarms should something go awry (alerting)

With an application network, these doors are built into your integration fabric, making your network inherently more secure. The API entryways are managed and patterns of access can be reused; the good structure has been validated and can be reused multiple times. It's highly tunable and configurable; with a standardized access point via an API, you can easily suspend access to one service without harming any others. This makes the application network resilient; it bends, unlike point-to-point architectures. The end result is the best practice of layers of security with central governance and visibility.

> If every service has a properly managed entry point, defense in depth is possible even with a large number of services.

## Security and agility go hand in hand

Complexity shouldn't be confused with volume. The fact that there are lots and lots of moving pieces is inevitable today. Businesses are going faster, there are more systems in existence. CIOs need to keep that train moving and CISOs don't want to stop it. By creating some level of standardization, encapsulation, and reusable overall patterns, paradoxically, complexity is reduced even if the volume is actually going up.

Increasing the number of services you bring online does not increase the risk of attack if everyone responsible for developing services controls access to their own data. The people who own the data are responsible for exposing the data and control who has access to that data. You're giving the owners of the data the ability to expose it. The main concern about increasing the number of services is how much variety in entry points are there? How many different ways are there to gain access to something? With an application network, all of the entry points are encapsulated and standardized; not only does each one represent a smaller level of attack, but also because the result is defense in depth.

A bad actor may be able to compromise one of these, but that doesn't mean that he or she can compromise the next one, and the next one, and the next one. They may be standardized, but each one serves as a barrier. Each one is controlling its own domain, each one is controlling what access makes sense from a business perspective, and each one should be checking the authentication. If every service has a properly managed entry point, defense in depth is possible even though the number of nodes or services is quite large and growing quickly.

## Security is about people, not just technology

Another advantage of this approach is that it gives you boxes in which to operate. Developers don't have to be security experts, identity experts, or even domain experts as each of those functions can be handled by people with expertise in those fields. A developer can build her application by reusing tools that are already available, allowing her to focus on making a great application.

To enable the developer to do this, all stakeholders need to think about reuse as they are developing and designing capabilities. This includes the developer because after she creates the application, it too will need to be available for reuse.

By creating new assets from reusable components built by domain experts, you continually reduce your area of attack, because you aren't introducing additional, unvetted access to data or systems.

Then, because of this API approach, having declared the intent, you can pass the asset over to more standardized mechanisms by operational people, or by security operations people to define security policies that attach to that layer. The entire approach depends on well-designed and well-defined services with well-managed entry points, which the CIO and CISO can enforce together.

<!-- p. 6 -->
## Real-world implementations of security and the application network

One of the largest global financial institutions has an IT infrastructure of enormous scale. It has distinguished itself by having local presences across many countries in multiple continents.

As a result, either by design or inadvertently creating a tremendous amount of diversity, numerous silos were created. Like other financial institutions, this one needs to keep up with the demands of the digital era. It needs to fend off a lot of financial tech upstarts that are trying to compete for its business. It also has to deal with an increasing level of regulatory oversight and needs for compliance after the financial crisis of 2008. And it is facing financial pressures to increase efficiency, stop redundant development, bring costs down, and align towards future value-adding propositions. This institution realizes that a lot of their future investment is going to be in the cloud, an initiative driven by that need for business agility and cost reduction.

> This financial institution has realized the only way to achieve their innovation and security goals is to approach them with an application network.

To do all this, they are in the process of creating an application network to rationalize their globally distributed assets and apply the API-led approach to create reuse and agility across multiple pieces of this large and distributed financial institution.

The executive leadership at this institution is also realizing that they actually have to transform their people, business operations, and processes. This kind of shift is not just about technology; the organizational mindset also has to shift in order to align with this distributed way to discover what every part of the business has already created, to reuse that, and to build in security into every aspect of this the application network.

When we speak with the top architects and the top security professionals at this organization, they realize that the only way to solve this is to approach it with an application network that enables them to build those security patterns into the way that people actually end up building things, day to day, and to govern it at that level.

## How Anypoint Platform enables an application network

MuleSoft's Anypoint Platform™ is a complete solution for API-led connectivity that creates a seamless application network of apps, data, and devices, both on-premises and in the cloud. Why Anypoint Platform?

- **Unified Platform for API-led Connectivity.** Anypoint Platform provides full API lifecycle management and enterprise-grade connectivity on a single platform.
- **Full API Lifecycle Management Platform.** API Management is only one piece of the puzzle. As companies build APIs they need a full SDLC from design, collaboration, build, test, deploy, publish, version and retire. Anypoint Platform provides capabilities at each of these lifecycle stages.
- **Creates application networks secured and governed by design.** Every node in the network – every connection and every API – can be governed using policies. Policies can be enforced and updated without making changes to the underlying code with API Manager.
- **Changes the clock-speed of your business with self-service consumption.** Unlock data and break down silos between development teams by publishing APIs that developers can discover, access and use in a self-service model with Anypoint Exchange - the component of Anypoint Platform that captures all APIs, templates, and connectors you create and allows you to share these assets with different groups within or outside of your organization.
- **Single runtime for cloud and on-premises.** Deploy in any cloud, any data center, on premises, or in a hybrid environment. You write the application and deploy it or redeploy it in any environment seamlessly.
- **Built for agile development and DevOps.** The platform works with the common toolchains used for continuous integration and continuous deployment (CI/CD) i.e. SCM, Maven, Junit, Jenkins
<!-- p. 7 -->
and works well in DevOps environments to build and manage microservices, the platform can be containerized.

## How your business can implement security by design with an application network today

There are concrete steps you can take today to become more secure. While these steps won't be a panacea, beginning with this approach will give you a head start on the process:

- Meet with your business leaders, discover the projects they're doing, figure out what data that they have and what data they're trying to expose, and understand what it is they're trying to accomplish. Be part of helping them solve a problem as opposed to being the endpoint.
- Once this happens, CISOs are going to be able to reduce their exposed surface area, because they will discover known entrance points and exit points. This will help security teams create well-defined, well-structured APIs by which people can expose or access your data.
- Create visibility. Visibility is great for security, but it's also great for the business. The business wants to know what's going on, they want to know who's using it, they want to make data-driven decisions. Security wants that same data for a different purpose, they want to know who's is using it to make sure that the data is safe and that only the right people have access to it. API-led connectivity provides a clear path to broad visibility.

## Conclusion

The missions of the CIO and the CISO are aligned, reducing risk to the business and enabling agility. They might be looking at data to measure performance against those missions with two distinct lenses, but their intended outcomes are often the same. The CIO needs to take risks to make the organization better and faster, while the CISO needs to manage those risks and mitigate their effect on the business An application network allows the two to work together and achieve the same goal of business agility rather than creating friction by working towards opposite goals.

---

[i] MuleSoft Connectivity Benchmark Report 2016. https://www.mulesoft.com/lp/reports/2016-connectivity-benchmark

[ii] Proctor, Paul, and Ray Wagner. Special Report: Cybersecurity at the Speed of Digital Business. Gartner, May 26, 2016. https://www.gartner.com/doc/3332117?srcId=1-3132930191&cm_sp=gi-_-cysec-_-srpage

MuleSoft's mission is to connect the world's applications, data and devices. MuleSoft makes connecting anything easy with Anypoint Platform™, the only complete integration platform for SaaS, SOA and APIs. Thousands of organizations in 60 countries, from emerging brands to Global 500 enterprises, use MuleSoft to innovate faster and gain competitive advantage.
