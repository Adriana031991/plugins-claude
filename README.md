# Mis plugins

Un marketplace local con plugins independientes. Cada uno se instala por separado.

| Plugin | Qué trae | Úsalo cuando |
|---|---|---|
| `barrido-de-decision` | skill `barrido-de-decision` + comando `/barrer` | cambias una decisión o un término y puede haber restos en otros documentos |
| `validar-raml` | comando `/validar-raml` + script con AMF 5 | tienes contratos RAML 1.0 |
| `ciclo-feynman` | skills `ciclo-feynman` y `corregir-en-orden` | estás aprendiendo un tema explicándolo con tus palabras |
| `construir-flujo` | skill `construir-flujo` + comando `/flujo` | ya tienes el esqueleto de una API generado en Studio y vas a construir uno de sus flujos de Mule 4 |
| `scrum-master` | skill `scrum-master` + comandos `/scrum-iniciar`, `/historia`, `/planificar`, `/daily`, `/estado`, `/cerrar-sprint`, `/semana`, `/portafolio` + aviso al abrir sesión + cronómetro de bloques de 30 min y alarma de la daily (Windows) | quieres llevar el control y el avance de tus proyectos con sprints |

## Instalar

Desde Claude Code, con la ruta de esta carpeta:

```
/plugin marketplace add <ruta a esta carpeta plugins-claude>
/plugin install barrido-de-decision@mis-plugins
/plugin install validar-raml@mis-plugins
/plugin install ciclo-feynman@mis-plugins
/plugin install construir-flujo@mis-plugins
/plugin install scrum-master@mis-plugins
```

Instala solo los que necesites en cada proyecto.

## Notas
- Los plugins son genéricos: no mencionan archivos de ningún proyecto. `barrido-de-decision` y `ciclo-feynman` leen el `CLAUDE.md` del proyecto para adaptarse.
- `scrum-master` guarda el seguimiento de cada proyecto en su carpeta `.scrum/` (Markdown, conviene versionarla con git) y la lista de proyectos en `scrum-master-datos/proyectos.md`. El aviso al abrir sesión necesita Node.js; si no hay `.scrum/` no muestra nada.
- `validar-raml` necesita Node.js. La primera vez instala `amf-client-js` dentro de la carpeta del plugin (no en tu proyecto).
- Para compartirlos o usarlos en otros computadores, sube esta carpeta a un repositorio git y agrégala como marketplace con la URL.
- Versión inicial 0.1.0, sin probar instalada como plugin (los archivos y el script de validación sí se probaron).
