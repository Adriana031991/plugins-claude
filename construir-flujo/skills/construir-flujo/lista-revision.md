# Lista de revisión fija

Se pasa **completa** en cada flujo. Son preguntas generales de integración; las respuestas salen siempre de los documentos del proyecto, con cita.

Cada punto queda en uno de tres estados:
- ✅ resuelto en los documentos (con cita);
- **no aplica** (con la razón, por ejemplo «es una lectura, no cambia nada»);
- ❓ falta decidirlo (pasa a la sección 8 del plan y se pregunta).

| # | Punto | Qué revisar |
|---|---|---|
| R1 | Capas | ¿Quién puede llamar a quién? ¿El flujo respeta la regla de capas del proyecto (Experience → Process → System)? ¿Hay lógica de negocio donde no debe? |
| R2 | Contrato | ¿La entrada y la salida coinciden con el contrato (tipos, campos obligatorios, códigos HTTP)? ¿Quién valida los obligatorios? |
| R3 | Correlation ID | ¿Dónde se crea o se recibe? ¿Viaja en las llamadas y los mensajes que salen? ¿Aparece en los logs? |
| R4 | Idempotencia | ¿Este flujo puede recibir lo mismo dos veces? Si sí: ¿cuál es la clave, quién la recuerda y qué responde la segunda vez? |
| R5 | Reintentos | ¿A qué llama que pueda fallar? ¿Cuántos reintentos, con qué espera, y qué pasa al agotarlos? |
| R6 | Errores | Cada falla, ¿a qué error del contrato corresponde? ¿Se distingue «no sé si pasó» (timeout) de «falló»? |
| R7 | Mensajería | ¿Publica o escucha? ¿El nombre del canal coincide con la tabla de canales? ¿Cola o tema? ¿Cuándo se firma el acuse? ¿Tiene vencimiento? |
| R8 | Estado y orden | ¿Guarda estado? ¿Dónde? ¿Hay cambios condicionales (que solo cambien si el estado actual es el esperado)? ¿Importa el orden de los mensajes? |
| R9 | Mensajes que no se pueden procesar | ¿Qué va a la cola de mensajes muertos? ¿Quién se entera? |
| R10 | Datos sensibles | ¿Viajan o se registran datos personales o de pago que no deberían ir al log? |
| R11 | Transformación | ¿Hay traducción entre formatos (DataWeave)? ¿De qué formato a cuál, y dónde está definido cada uno? |
| R12 | Operación | ¿Se puede pausar, relanzar o consultar este flujo (Bus de control)? ¿Hay algo que deba poder hacer una persona de soporte? |

## Trampas frecuentes
- **R5:** si un número de reintentos o una espera no está escrito para *esa* llamada, es ❓, aunque esté escrito para otra llamada del mismo flujo. No lo copies de una a otra.
- **R4:** una lectura (GET) normalmente «no aplica», pero dilo con la razón.
- **R7:** el nombre del canal se copia de la tabla de canales tal cual; si el evento tiene otro nombre en otro documento, avisa la contradicción.
- **R11:** compara campo por campo lo que entra, lo que se guarda y lo que se publica. Si las formas difieren, es una pieza de traducción.
