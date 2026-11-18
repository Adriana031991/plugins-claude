# Resumen: Security by Design: Building Defense in Depth with an Application Network

Whitepaper de MuleSoft de 7 páginas, sin fecha visible; cita fuentes de 2016. Tiene capa de texto (no es solo imagen).
Archivo: `documento.md`. Figuras: `figuras.md`.
Temas: `application-networks` (principal), `reuso-exchange`, `deploying-managing`.

## Idea central

La velocidad (el objetivo del CIO) y la seguridad (el objetivo del CISO) no tienen por qué estar en conflicto. Una **application network** construida con **API-led connectivity** logra las dos: cada sistema entra a la red por una **puerta bien definida** (una API administrada), lo que da **defensa en profundidad** sin depender de un único perímetro.

## Por partes

- **Problema del CIO**: la demanda sobre TI crece más rápido que su capacidad de entrega (78% del esfuerzo se va en mantener lo existente). Hay que dejar el pensamiento "por proyecto" y tener una estrategia.
- **Por qué la conectividad es estratégica**: los sistemas solo dan valor si se integran. La integración **punto a punto** parece rápida, pero termina en una maraña donde "nada se puede mover sin romper todo lo demás". La conectividad debe ser una **disciplina de negocio**, no algo proyecto por proyecto.
- **Shadow IT**: nace cuando TI central es demasiado lenta (punto a punto o SOA pesado) y las áreas resuelven por su cuenta. TI y seguridad terminan "apagando incendios". Su impulso no es malo: una application network lo convierte en activos del negocio.
- **Problema del CISO**: las apps en la nube y móviles amplían la superficie expuesta. Falta **visibilidad** y faltan **estándares**. Seguridad llega tarde, justo antes de producción, y queda como bloqueador. Un único perímetro central **no es confiable, escalable ni adaptable**; es mejor una seguridad **compartimentada** (unidades fortificadas con requisitos comunes y propios).
- **Seguridad con API-led connectivity**: pasar de lo monolítico a **nodos bien definidos y fortificados**, con la seguridad incorporada desde el diseño. Los nodos se unen por APIs (puntos de entrada estandarizados y visibles). Al **reutilizar** conexiones ya conocidas por seguridad no se multiplican las conexiones. No se impone de arriba hacia abajo "como SOA". Cada servicio crea **activos reutilizables** y aporta valor a la red (**efecto de red**).
- **Las "puertas" de la application network** permiten controlar: quién entra (*permissioning*), qué necesita para entrar (*authentication*), a qué accede (*provisioning*), visibilidad total (*monitoring, auditing*) y alarmas (*alerting*). Se puede suspender el acceso a un servicio sin afectar a los demás: la red "se dobla" y no se rompe, a diferencia del punto a punto.
- **Seguridad y agilidad juntas**: **complejidad no es lo mismo que volumen**; estandarizar, encapsular y reutilizar reduce la complejidad aunque crezca el volumen. Más servicios no implica más riesgo si los **dueños de los datos** controlan su exposición. Si un atacante compromete una puerta, no compromete las siguientes: eso es **defensa en profundidad**.
- **Seguridad es de personas**: el desarrollador no necesita ser experto en seguridad ni en identidad; reutiliza componentes ya revisados por expertos (así no se agrega acceso "sin revisar"). Después, operaciones y seguridad aplican las **políticas** sobre esa capa.
- **Caso real**: una gran institución financiera global, con silos, presión de fintechs, regulación posterior a 2008 y migración a la nube, construye una application network. El cambio es también **organizacional**, no solo tecnológico.
- **Cómo lo habilita Anypoint Platform**: plataforma unificada; ciclo de vida completo de la API (diseñar, colaborar, construir, probar, desplegar, publicar, versionar, retirar); **políticas en API Manager sin cambiar el código**; autoservicio con **Anypoint Exchange** (APIs, plantillas y conectores reutilizables); un solo runtime para la nube, on-premises o híbrido; CI/CD (SCM, Maven, JUnit, Jenkins) y contenedores.
- **Pasos para empezar hoy**: 1) reunirse con el negocio, conocer sus proyectos y sus datos, y ayudar en lugar de ser "el final del camino"; 2) así se descubren los puntos de entrada y salida y se reduce la superficie expuesta; 3) **crear visibilidad**, que sirve tanto al negocio como a seguridad.

## Relación con el examen

Encaja con el tema `application-networks` de la guía del MuleSoft Developer: qué es una application network, API-led connectivity (aquí sin detallar las capas System/Process/Experience), reutilización con Exchange y gobierno con políticas en API Manager. Complementa el capítulo 1 del libro de Anypoint Platform (secciones 1.2 y 1.3) y el capítulo 10 (seguridad).

Nota de verificación: es un documento **conceptual y antiguo** (fuentes de 2016). Los productos que nombra siguen existiendo, pero no menciona lo actual (CloudHub 2.0, Omni Gateway, Agent Fabric). No hay código ni afirmaciones técnicas que verificar. La afirmación de que la seguridad perimetral "no es confiable" es una opinión del documento.
