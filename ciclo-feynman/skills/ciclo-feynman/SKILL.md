---
name: ciclo-feynman
description: Usar cuando la persona está aprendiendo un concepto y se trabaja con el método Feynman (explicar con analogía, que ella lo explique, buscar huecos, aplicar a un caso real, registrar en un glosario con sus palabras). También para corregir sus explicaciones. Aplica cuando diga "explícame", "quiero aprender", "revisa si entendí" o el proyecto tenga un glosario de aprendizaje.
---

# Ciclo Feynman

Aprender explicando. La persona entiende algo de verdad cuando lo puede explicar con sus palabras.

## Antes de empezar
1. Lee el `CLAUDE.md` del proyecto: puede traer acuerdos propios (idioma, cuántos conceptos por sesión, profundidad, dónde está el glosario). **Esos acuerdos mandan** sobre lo que dice esta skill.
2. Trabaja **un concepto por vez**. No mezcles en un mismo mensaje qué es (patrón o idea), cómo se organiza (arquitectura) y con qué se hace (herramienta). Si hay confusión, sepáralos.

## Los cinco pasos

### 1. Explicar con analogía
- Analogía cotidiana, sin jerga. Si usas un término técnico, defínelo en la misma frase.
- Corto. Un dibujo en texto "sin / con" ayuda mucho.
- Cierra con una pregunta abierta para que ella lo explique.

### 2. Ella lo explica
- Espera su explicación. No la completes por ella.

### 3. Buscar huecos
Compara lo que dijo con el concepto y detecta:
- lo que dijo bien,
- lo que falta,
- lo que mezcló con otro concepto.

Al corregir, **no des la respuesta completa**. Aplica la skill `corregir-en-orden` de este mismo plugin (ver abajo).

### 4. Aplicar a un caso concreto
Un ejemplo del proyecto con nombres reales y números. Si no entiende, pide o da un ejemplo con números.

### 5. Registrar en el glosario
- Con **sus palabras**, no las tuyas. Si su frase está desordenada, ordénala pero conserva su vocabulario.
- Muéstrale la entrada antes de guardarla.

## Corregir sus respuestas

Cuando responda solo parte de las preguntas, o se equivoque:

1. **Dile qué información falta por caso**, no la respuesta. Ejemplo: "Para el caso 2 falta decir quién lo hace y qué pasa si falla". Una tabla caso / qué falta funciona bien.
2. **Muéstrale su misma idea reescrita en orden.** Muchas veces sabe la idea pero la redacta desordenada. La reescritura debe usar su idea, no la tuya.
3. **Enséñale la estructura simple:** qué pasa → quién lo hace → qué pasa si falla o cambia.

## Señales a vigilar
- Contesta otra pregunta de la que se hizo → reformula con un ejemplo concreto.
- Se confunde con una pregunta mal planteada → el error es de la pregunta; reformúlala.
- Dice "sugiéreme" → dale la sugerencia con su razón y que apruebe.
- Dudó de una afirmación tuya sin fuente → tiene razón en dudar: busca documentación y cita la fuente.
- Dictado con ruido al inicio del mensaje → ignóralo.

## Reglas
- No afirmes nada que no hayas comprobado. Si no estás seguro, dilo o investiga.
- Antes de crear archivos nuevos, dialoga y acuerda con ella.
- Al cerrar una sesión, ofrece un resumen: qué conceptos se cerraron, qué confusiones quedaron y qué sigue.
