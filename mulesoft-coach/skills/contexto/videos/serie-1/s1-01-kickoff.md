---
video: "MCD Level 1 Exam Prep – Session 1 Kickoff | MuleSoft Certification with Digital Dee (2025)"
url: https://www.youtube.com/watch?v=rdOUPEd9U6M
serie: 1
numero: 1
idioma: inglés
tipo: apoyo
fuente: "documentos-base-mulesoft/transcripcion-videos-tutorial-serie-1/video-1-tactiq-free-transcript-rdOUPEd9U6M.txt"
duracion_aprox: "1:22"
temas: [application-networks, herramientas-desarrollo, designing-apis]
resumido: 2026-11-17
estado: confirmado
---

<!-- Notas:
- Es una nota de estudio y contexto, no una transcripción. La transcripción completa (tactiq, automática, con errores de reconocimiento como "Anyoint" o "API lead") sigue en la carpeta de fuentes. Las marcas [mm:ss] sirven para ir al momento exacto.
- Material de apoyo: si algo contradice la doc oficial, gana la oficial. Las secciones "Para evaluar" no son preguntas para copiar: indican qué conviene evaluar; las preguntas se basan en la doc oficial (regla de la skill evaluacion).
-->

# Serie 1 · Sesión 1: Kickoff (Digital Dee, 2025)

Instructora: "Digital Dee" (Diane Kesler), instructora certificada de MuleSoft. Sesión en vivo, la primera de seis.

## 1. Resumen por bloques

| Tiempo | Bloque | Idea principal |
|---|---|---|
| [00:00–00:09] | Cómo estudiar | Practicar con las manos; usar el reporte del examen para atacar los objetivos débiles con una presentación y un flujo de prueba. |
| [00:07–00:18] | Qué entra | Studio (no Code Builder), RAML (OAS solo como mención), 100% Mule 4, leer XML, conceptos de DataWeave. |
| [00:11–00:17] | Formato | 60 preguntas, 120 min, 42 para aprobar; varias respuestas = todo o nada; muchas de escenario. |
| [00:18–00:32] | Logística | Guía en Trailhead, USD 200 / reintento USD 100, mantenimiento anual en Trailhead, examen supervisado online, examen de práctica en PDF. |
| [00:32–00:50] | Evolución de la integración | Punto a punto → hub/colas → ESB → API-led. Ejemplo AS400 + Athena Health con APIs existentes. |
| [00:50–00:59] | Tres capas | System, Process y Experience; no son capas de red; políticas distintas por capa. |
| [01:00–01:20] | C4E y Catalyst | C4E habilita y difunde API-led; Catalyst/Knowledge Hub con *playbooks*; C4E ≠ CoE. |

## 2. Conceptos clave

- **Integración punto a punto** (`application-networks`) [00:35]: cada par de sistemas se conecta con código propio. Problema: "spaghetti integration"; cambiar un sistema obliga a reescribir todas sus conexiones.
- **Hub / cola de mensajes** [00:39]: un intermediario (VM, JMS, Anypoint MQ) desacopla al emisor del receptor y da algo de visibilidad.
- **ESB (Enterprise Service Bus)** [00:40]: las integraciones viven en un runtime central (Mule puede funcionar así). Mejora la gestión, pero las piezas siguen poco desacopladas y poco reutilizables.
- **API-led connectivity** [00:42]: estilo de arquitectura en el que las capacidades se exponen como APIs reutilizables, organizadas en tres capas. Antes de construir se buscan APIs y conectores que ya existan.
- **System API** [00:51]: habla con **un** sistema de registro (BD, Salesforce, AS400), maneja su autenticación y su formato, y entrega los datos en una forma útil. "El mayordomo del sistema".
- **Process API** [00:53]: orquesta varias System APIs para un proceso de negocio (por ejemplo, juntar vuelos de varias aerolíneas, o facturación del paciente). "El comprador".
- **Experience API** [00:56]: adapta los datos al consumidor (móvil, web, Salesforce, el paciente).
- **Las capas no son capas de red** [00:51]: son una forma de organizar. Cada capa tiene necesidades de **políticas** distintas (por ejemplo, limitar el tráfico hacia un sistema viejo).
- **API como producto** [01:02]: una API no es un proyecto; se diseña para que otros la reutilicen.
- **C4E (Center for Enablement)** [01:01]: equipo transversal que difunde y habilita la forma API-led, promueve la reutilización y la mide con KPIs.
- **CoE (Center of Excellence)** [01:18]: grupo de especialistas técnicos (bases de datos, red) que resuelven problemas, por ejemplo en los despliegues. **No es lo mismo que el C4E.**
- **Catalyst / Knowledge Hub** [01:06]: biblioteca de *playbooks* de MuleSoft con tres pilares: business outcomes, technology (platform, projects) y organization (C4E, soporte, formación). Las cuentas de prueba no tienen acceso.

## 3. Para evaluar

Qué debería poder hacer o explicar quien domina este material (`application-networks`, peso 7%):
- Dado un escenario, **elegir la capa** correcta para una API (system, process o experience) y justificarlo.
- Explicar **por qué API-led** es mejor que punto a punto o que un ESB en términos de desacoplamiento, reutilización y cambio de sistemas.
- Distinguir **C4E** de **CoE**, y decir cuál es el objetivo del C4E (habilitar, no controlar).
- Reconocer que las capas **no** son capas de red.

Confusiones típicas que señala el video:
- Pensar que "API-led" es una tecnología o un producto; es un estilo de arquitectura.
- Responder con la práctica de otra empresa en lugar de "como lo haría MuleSoft" (por ejemplo, defender un punto a punto rápido) [00:15].
- Creer que un C4E ya existe porque la empresa tiene un CoE [01:18].

Estrategia de examen [00:11–00:17]: marcar y seguir en las preguntas largas; leer bien cuántas respuestas se piden.

## 4. Para desarrollar

Cómo se aplica en un proyecto real:
1. **Antes de construir, busca** [00:44–00:49]: en Exchange (conectores y APIs de MuleSoft y de tu organización), en el portal del proveedor del sistema y en repositorios públicos de APIs. En el ejemplo, el conector de AS400 ya existía y Athena Health publicaba sus APIs.
2. **Una System API por sistema**: encapsula credenciales, protocolo y formato de ese sistema; nadie más debería conocerlos.
3. **Orquesta en Process APIs**: la lógica que combina sistemas va aquí, no en las System APIs ni en el cliente.
4. **Adapta en Experience APIs**: un consumidor nuevo (por ejemplo, una app móvil) suele significar una Experience API nueva, no cambiar las de abajo.
5. **Aplica políticas por capa**: rate limiting para proteger un sistema lento, autenticación distinta según el consumidor.
6. Si la organización no tiene C4E, **al menos un equipo chico** que cuide los estándares y la reutilización; si no, "la importancia de API-led se diluye" [01:02].

## 5. Para estudiar

- Actividad que propone la instructora [00:03–00:08]: elige un objetivo que no domines, **prepara una presentación y un flujo de prueba** que lo expliquen. Explicarlo muestra lo que de verdad no se sabe.
- Lecturas que recomienda [00:34]: la tesis de Roy Fielding (REST, 2000) y Enterprise Integration Patterns (este último está en "Descartados por ahora" en enlaces-oficiales.md, por decisión tuya).
- Para profundizar con el material ya ingerido:
  - `libros/anypoint-platform/capitulos/cap01-understanding-anypoint-platform.md` §1.3 (API-led y cuándo aplicarlo) y §1.2 (control plane / runtime plane).
  - `libros/anypoint-platform/capitulos/cap16-enterprise-architecture-migration.md` §16.1 (diseño de capas reutilizables).
  - `libros/whitepaper-seguridad/documento.md` (application network, defensa en profundidad).
  - Catalyst / Knowledge Hub: C4E Charter (si tu cuenta tiene acceso).

## 6. Nota de verificación

- Los **porcentajes** que menciona coinciden con `taxonomy.json` (application-networks 7, structuring-apps 10, mule-events 10).
- **No verificado** contra la guía oficial (la página de help.salesforce no cargó el 2026-11-17): 60 preguntas, 120 minutos, 42 para aprobar, USD 200 / USD 100, el mantenimiento anual y el cambio a Pearson VUE. Son datos de un video de 2025; revísalos en la guía antes de inscribirte.
- "No hay preguntas de Code Builder" y "el currículo pasará a OAS" son **opiniones o pronósticos** de la instructora.
- La comparación "ESB vs. API-led" es la visión de MuleSoft; el ESB no es incorrecto en sí, solo menos reutilizable.
