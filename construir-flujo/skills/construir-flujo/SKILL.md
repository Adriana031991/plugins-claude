---
name: construir-flujo
description: Usar cuando la persona quiere construir un flujo de Mule 4 (un endpoint HTTP, un oyente de cola o tema, una tarea por reloj, una orden del Bus de control o el manejador de errores global de una app) a partir del diseño ya hecho en el proyecto. Arma un plan del flujo citando los documentos, pasa una lista de revisión fija, pregunta lo que falta y acompaña la construcción en Studio pieza por pieza. Se activa con frases como "construir el flujo", "armar el flujo de Mule", "cómo hago este endpoint en Mule", "empecemos la fase 4", "plan del flujo" o el comando /flujo.
---

# Construir un flujo de Mule 4

Entre el diseño y el código se olvidan decisiones pequeñas: el correlation ID, la clave de idempotencia, cuántos reintentos, qué error devolver, a qué cola publicar. Esta skill las saca de los documentos del proyecto y las pone en un **plan del flujo** antes de abrir Anypoint Studio. Después acompaña la construcción, una pieza a la vez, explicando cada una.

**No hace:** el esqueleto del flujo (eso lo genera APIkit desde el RAML; la skill trabaja *dentro* de cada flujo generado), ni el diseño (si falta una decisión, la marca ❓ y pregunta), ni reemplaza a `mulesoft-coach` para dudas técnicas de Mule.

## Reglas (no se rompen nunca)

1. **No inventar.** Todo componente, nombre de cola, clave, código HTTP o número de reintentos sale de un documento del proyecto y se cita (`archivo:sección` o `archivo:línea`). Si no está escrito, va como ❓ y se pregunta. Esto incluye números «razonables» o «de buena práctica».
2. **Comprobado vs. de memoria.** Lo técnico de Mule (nombre de un componente, un atributo, un tipo de error, cómo se comporta) lleva una marca:
   - ✅ comprobado en la documentación oficial de MuleSoft (con enlace) o en el esqueleto generado (con ruta);
   - 📘 según el material de `mulesoft-coach` (con ruta del fragmento), si ese plugin está instalado;
   - ⚠️ de memoria, **por verificar**.
3. **Mandan los documentos del proyecto.** Si dos fuentes se contradicen, gana la que el `CLAUDE.md` diga que manda. Avisa de la contradicción; no la resuelvas por tu cuenta.
4. **Un flujo a la vez.** Nunca planees varios flujos en una misma respuesta.
5. **Separar QUÉ / CÓMO / CON QUÉ.** En cada pieza: primero el patrón (QUÉ), luego cómo encaja en la arquitectura (CÓMO) y al final el componente de Mule (CON QUÉ). Nunca los tres en la misma frase.
6. **Nada de piezas no discutidas.** No agregues componentes, campos, colas ni endpoints que no estén en el diseño. Si crees que falta algo, propónlo **aparte**, con su razón, y espera aprobación.
7. **No escribir sin permiso.** El plan se muestra en el chat. Se guarda solo si la persona lo aprueba, en la carpeta de planes del **proyecto de diseño** (ver paso 8). En el proyecto de código **no escribas nada**: solo lee el esqueleto; el código lo pone ella en Studio.
8. **Esperar el esqueleto.** No armes el plan de un flujo si su esqueleto todavía no existe en el proyecto de código.
9. **Genérico.** No supongas nombres de archivos: encuéntralos leyendo el `CLAUDE.md` del proyecto y buscando.

**Estilo:** español sencillo, un tema por mensaje, frases cortas. Si la persona no entiende una pieza, explícala con un ejemplo concreto del proyecto en el orden *qué pasa → quién lo hace → qué pasa si falla*.

## Tipos de flujo que se pueden pedir

| Tipo | Cómo se reconoce |
|---|---|
| Endpoint HTTP | método + ruta + API |
| Oyente de una cola o un tema | nombre del evento o del canal |
| Tarea por reloj o alarma | nombre de la tarea o de la decisión que la crea |
| Orden del Bus de control | nombre de la orden («pausar», «relanzar»…) |
| Manejador de errores global de una app | la palabra «errores» + el nombre de la API. Una vez por app, **antes** de su primer flujo |

Si la petición es ambigua («el de órdenes»), busca en los documentos, lista las opciones que encontraste (método + ruta + API, o canal + API) y pregunta cuál. No elijas tú.

## Procedimiento

### 0. Comprobar el esqueleto
El orden de trabajo es: publicar el RAML en Anypoint Exchange → crear en Studio el proyecto de Mule desde ese RAML (APIkit genera un flujo por operación y un manejador de errores) → pedir el plan.
- Lee en el `CLAUDE.md` la ruta del proyecto de código. Si no está, pregúntala.
- Busca ahí la app de esa API y, con Grep en los `.xml` de `src/main/mule/`, el flujo de la operación pedida. ⚠️ De memoria: APIkit nombra los flujos con el método y la ruta (algo como `post:\<recurso>:<config>`); verifícalo con el primer esqueleto real y dilo.
- **Si no existe, detente**: di qué falta («primero genera el esqueleto de `<api>` desde Exchange») y no armes el plan.
- Si existe, anota el nombre real del flujo y del manejador de errores generados, con su ruta. Las piezas del plan van **dentro** de lo generado.
- Para oyentes, tareas por reloj y órdenes del Bus de control, APIkit no genera flujo: basta con que exista la app (el proyecto de Mule de esa API). Dilo así en el plan.

### 1. Leer el `CLAUDE.md` del proyecto de diseño
Saca: qué documentos son fuente de verdad y cuál manda; las reglas de trabajo; la fase del proyecto; dónde se guardan los planes. Si no dice cuáles son las fuentes, **pregunta antes de seguir**.

### 2. Ubicar el flujo y leer solo lo necesario
Usa Grep antes de abrir archivos enteros. Busca: la operación en su contrato (RAML), su dibujo o árbol de llamadas, el cuerpo del evento si publica o escucha, las decisiones que lo nombran, la tabla de canales y la estructura de errores de los contratos. Revisa también la bitácora o notas recientes: ahí suelen estar las diferencias de forma ya detectadas (por ejemplo, un evento y una entidad guardada que no tienen los mismos campos).

Si lo pedido **no está decidido** en los documentos (o está marcado como pendiente), dilo con la cita de dónde aparece como pendiente y pregunta. No armes un plan con un valor inventado.

### 3. Armar el plan
Lee `plantilla-plan.md` (en esta misma carpeta) y llénala. Cada fila cita su fuente. Para el manejador global, lee además `manejo-errores.md`. Para cualquier flujo con fallas, `manejo-errores.md` dice si cada una se atrapa en el flujo o sube al global.

### 4. Pasar la lista de revisión
Lee `lista-revision.md` y pasa **todos** los puntos (R1 a R12). Cada uno queda como ✅ (con cita), «no aplica» (con la razón) o ❓.

### 5. Mostrar el plan y resolver los ❓
Muestra el plan completo en el chat. Si hay ❓, pregúntalos **de uno en uno**, del más importante al menos, cada uno con una sugerencia y su razón. Cuando una respuesta cambia el plan, actualízalo.

### 6. Guardar (solo con aprobación)
Cuando la persona diga «apruébalo» o «guárdalo», guarda el plan en la carpeta de planes que indique el `CLAUDE.md` del proyecto de diseño; si no la indica, pregunta (sugerencia: `planes-flujo/`). Nombre: `<carpeta-de-planes>/<api>/<metodo>-<ruta>.md` en minúsculas, con la ruta sin `/` ni llaves (ejemplo: `POST /ordenes` → `post-ordenes.md`; `GET /ordenes/{id}` → `get-ordenes-id.md`). Para otros tipos: `errores.md`, `oyente-<canal>.md`, `reloj-<tarea>.md`, `orden-<orden>.md`.

### 7. Construir pieza por pieza
En el orden de la tabla 3 del plan, **una pieza por mensaje**:
1. Patrón (QUÉ) → arquitectura (CÓMO) → componente (CON QUÉ), separados.
2. Qué poner en Studio y qué configurar, con su marca técnica.
3. Cómo comprobar que funciona (el resultado visible: línea en el log, respuesta en Postman, mensaje en la consola del broker…).

Espera a que diga «listo» o pegue un error. Si pega un error, ayuda con ese error antes de seguir; si no estás seguro de la causa, dilo y marca ⚠️.

### 8. Cerrar el flujo
Di qué quedó comprobado (probado de verdad) y qué no. Si en el camino cambió una decisión del diseño, avisa que hay que barrerla en los documentos (si `barrido-de-decision` está instalado, sugiere `/barrer`). Si hubo que tocar un RAML, sugiere validarlo (`/validar-raml`, si está instalado). Actualiza el plan guardado solo si la persona lo aprueba.

## Otros plugins
- `mulesoft-coach` (skill `contexto`): si está, úsalo para las marcas 📘. Si no, remite a https://docs.mulesoft.com/ y marca ⚠️.
- `barrido-de-decision`, `validar-raml`: solo se sugieren; no los ejecutes por tu cuenta.
