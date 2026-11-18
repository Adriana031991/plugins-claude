# Manejo de errores: global y específico

Dos niveles. Los dos usan **la estructura de errores que ya tiene el proyecto**; no inventes otra.

## Antes de empezar: leer la estructura de errores
Búscala en los contratos (Grep de `Error`, `codigo`, `errores`, `conflicto` en los `.raml` y en las reglas de los contratos). Anota, con cita:
- el tipo del cuerpo de error y sus campos (por ejemplo un código, un mensaje y la correlación);
- dónde va el número HTTP (en la respuesta o en el cuerpo);
- la lista cerrada de códigos y a qué número HTTP corresponde cada uno;
- variantes (por ejemplo un 409 que trae además el estado actual del objeto).

Si no encuentras una estructura de errores escrita, **detente y pregunta**. No propongas una por tu cuenta como si estuviera decidida.

## Los dos niveles

| Nivel | Dónde vive | Qué hace | Cuándo se arma |
|---|---|---|---|
| **Global** | Un manejador de errores común a toda la app (⚠️ de memoria: en Mule 4, un error handler declarado como manejador por defecto de la configuración; verificar). | Convierte cualquier error que nadie atrapó en el cuerpo de error del proyecto, con la correlación tomada del encabezado de correlación. El error interno (500) **nunca** lleva detalles internos en el mensaje: el detalle va al log, con la misma correlación. | Una vez por app, como primer «flujo» de esa app. Parte del manejador que generó APIkit y lo ajusta a la estructura del proyecto. |
| **Específico** | Dentro del flujo o del componente que lo necesita (⚠️ de memoria: un ámbito `Try` o el manejo de errores del propio flujo). | Los casos de negocio de ese flujo: un conflicto con o sin estado actual, el «no sé si pasó» (timeout → estado pendiente), reintentos agotados → cola de mensajes muertos, etc. | Al armar el plan de ese flujo: cada fila de la tabla 4 dice si la atrapa el flujo o la deja subir al global. |

**Regla:** un error se atrapa en el flujo **solo si el flujo hace algo distinto con él** (responder un conflicto, reintentar, pasar a «pendiente»). Si no, se deja subir al global. Así no se repite el mismo manejo en cada flujo.

## Plan del manejador global

Además de las secciones 0, 1, 4, 5, 7 y 8 de la plantilla, arma esta tabla:

| Error que puede llegar (Mule / APIkit) | HTTP | Código del proyecto | Mensaje (sin detalles internos) | Marca técnica | Fuente |
|---|---|---|---|---|---|
| ⚠️ p. ej. `APIKIT:BAD_REQUEST` | 400 | <código del proyecto para 400> | | ⚠️ | |
| ⚠️ p. ej. `APIKIT:NOT_FOUND` | 404 | | | ⚠️ | |
| cualquier otro | 500 | | | ⚠️ | |

- Los nombres de los errores de Mule y de APIkit van ⚠️ hasta comprobarlos en la documentación oficial o en el XML generado (si están en el esqueleto, cita la línea y márcalos ✅).
- Solo filas para los números HTTP que la estructura del proyecto tiene.
- **Errores que APIkit genera y el proyecto no tiene** (⚠️ de memoria: método no permitido 405, formato no aceptado 406, tipo de contenido no soportado 415, no implementado 501): compáralos con el esqueleto generado, lístalos y **pregunta qué hacer** con ellos (por ejemplo, agregarlos a la lista de códigos o convertirlos en el código de solicitud inválida). Da tu sugerencia y su razón, pero no lo decidas. Si el proyecto ya lo decidió, cita dónde.
- Comprueba que la correlación se toma del encabezado de entrada y que el 500 escribe el detalle en el log con esa misma correlación.
