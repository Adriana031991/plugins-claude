---
libro: "MuleSoft Anypoint Platform: Complete Guide to Enterprise Integration and APIs"
capitulo: 4
titulo: "DataWeave for Transformation and Mapping"
paginas_pdf: "32-45"
temas: [dataweave, reuso-exchange, processing-records]
transcrito: 2026-11-13
estado: confirmado
---

<!-- Notas de transcripción:
- Texto en inglés, igual que el original. El orden de lectura de cada página es: panel superior (columna izquierda, luego derecha), después panel inferior (izquierda, luego derecha).
- El código se copia tal cual. Solo uno los saltos de línea que produce el ancho de columna (por ejemplo, la línea de orderCategory en 4.1). No corrijo ni completo nada.
- El PDF tiene resaltados de color de la persona. No se transcriben como formato.
- El capítulo empieza en el panel inferior de la p. 32 y termina en el panel superior de la p. 45; ahí empieza el capítulo 5.
-->

# Chapter 4: DataWeave for Transformation and Mapping

<!-- p. 32 -->
Data transformation is one of the defining tasks in enterprise integration. Systems rarely agree on field names, data types, nesting patterns, date formats, null handling, or structure. One application may produce flat records, another may expose nested JSON, another may rely on XML, and another may return Java objects or tabular data. A useful integration platform needs a consistent way to turn one representation into another without forcing each project to invent its own conversion style. In Mule, that role belongs to DataWeave.

DataWeave is the transformation language used throughout Mule applications to shape payloads, construct outputs, filter content, derive values, normalize structures, and support data mapping across formats. It is powerful because it is not limited to one kind of input or one narrow mapping style. It can work with JSON, XML, CSV, Java objects, multipart data, and several other structured forms, while still giving you one coherent language model. This matters in real projects because transformation logic should not feel different every time the source system changes. A stable language for transformation reduces mental switching and allows mapping patterns to become reusable knowledge rather than connector-specific habits.

A good understanding of DataWeave does more than improve syntax fluency. It changes how transformation logic is designed. Instead of writing long sequences of set-payload steps and ad hoc field extraction, you begin to think in terms of explicit output structures, composable expressions, reusable functions, and controlled handling of missing or inconsistent values. That shift leads to transformations that are easier to read, test, and maintain. It also helps avoid a common weakness in integration projects, where mapping logic becomes scattered, repetitive, and deeply tied to one payload shape.

<!-- p. 33 -->
Another reason DataWeave deserves serious attention is that transformations are not isolated presentation concerns. They often define the contract between systems. A DataWeave script may decide which fields are exposed to an API consumer, which values are renamed or suppressed, how data quality issues are handled, how optional fields are represented, and whether type conversions happen safely. In other words, transformation logic often shapes business meaning as much as technical format. That is why poorly designed mappings can cause as much trouble as weak connector usage or unclear routing logic. A transformation that appears to work but quietly drops values, converts them incorrectly, or handles nulls inconsistently can create hard-to-trace defects across system boundaries.

DataWeave also sits close to runtime behavior. Some transformations are small and immediate. Others process large payloads, stream files, aggregate records, or prepare results from multiple sources. Reader and writer properties influence how data is parsed and emitted. Output type influences how consumers interpret the result. Streaming behavior and mapping style can affect memory use and performance. This means that DataWeave should not be taught only as a convenient syntax for reshaping JSON. It should be understood as a language that affects correctness, maintainability, and runtime efficiency.

This section builds that understanding in four stages. It begins with syntax, types, selectors, and operators so the language itself becomes readable. It then shows how the language handles different data formats including JSON, XML, CSV, and Java structures. After that, it moves into reusable functions and modules so transformation logic can be organized cleanly rather than copied between flows. Finally, it explains reader and writer properties, streaming behavior, and performance-aware mapping so that transformations remain reliable when payload sizes and operational demands increase. By the end, DataWeave should feel less like a mysterious mapping layer and more like a practical language for turning integration data into deliberate, well-structured results.

## 4.1: DataWeave Syntax, Types, Selectors, and Core Operators

The easiest way to get comfortable with DataWeave is to see it as a language for constructing values rather than as a visual mapping tool expressed in text. A DataWeave script usually begins by declaring its version and output type, then defining the expression that produces the output. That output can be an object, an array, a scalar value, or any supported structure. The script does not describe a step-by-step mutation process in the style of imperative programming. Instead, it states what the output should be, using expressions that derive values from the input and from any variables or functions in scope.

A common DataWeave script begins with a header such as `%dw 2.0` and an output declaration like `output application/json`. After that, the body contains the expression that produces the result. The separator `---` marks the transition from directives to the main expression. Once that pattern becomes familiar, the language starts to feel consistent. Whether you are transforming a request payload into a response document or extracting selected values from an array of records, the structure remains predictable.

The simplest expression may return a value directly. More often, the script builds an object or array. An object uses key-value pairs, while an array uses ordered values inside square brackets. This part of the syntax is readable because it resembles the shape of common output formats, especially JSON. Yet the real power lies in the expressions assigned to those fields. A field can come directly from the payload, be derived with a calculation, be conditionally included, or be built from nested objects and arrays.

The following example shows a straightforward transformation from an inbound payload into a smaller JSON structure.

DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.id,
  customerName: payload.customer.name,
  totalAmount: payload.total
}
```
<!-- p. 34: el bloque anterior sigue en esta página desde "orderId: payload.id," -->

This is the simplest correct version because it shows the most important habit in DataWeave, which is to describe the output explicitly. The script does not ask the runtime to mutate a message in place. It states what the new payload should look like. That makes the transformation easy to read and review.

A more robust version becomes useful when values may be missing, types need to be normalized, and field names should reflect a stable contract rather than mirror the source directly.

DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.id as String,
  customerName: payload.customer.name default "Unknown Customer",
  totalAmount: (payload.total default 0) as Number,
  currency: payload.currency default "USD",
  hasDiscount: (payload.discount default 0) > 0
}
```

The difference matters. Default handling protects the output contract from missing values. Explicit casting communicates intent and reduces ambiguity. Derived fields such as `hasDiscount` make it easier to construct useful output in one transformation rather than scattering logic across multiple processors.

Types are an important part of DataWeave because integrations often fail at type boundaries. Data may arrive as strings when numbers are needed, dates may need conversion, booleans may be encoded loosely, or null values may disrupt expressions that assume content exists. DataWeave supports common data types such as String, Number, Boolean, Date, Time, DateTime, Array, Object, and Null, among others. In practice, strong type awareness means you become careful about the difference between a numeric value and a numeric-looking string, between an empty value and a missing one, and between a nullable field and a required one.

Casting is useful when you need to normalize source values. If a system sends `"42"` and the target contract expects a number, a cast makes that choice explicit. If a date string must be represented as a Date or DateTime, DataWeave can do that transformation clearly. These conversions should be used deliberately because they define how the application interprets the source data. If the incoming value is malformed, the transformation may fail unless defensive handling is added.

Selectors are one of the most frequently used and most misunderstood parts of DataWeave. A selector is how you access values within a structure. Dot selectors access fields in objects, index selectors access positions in arrays, and there are additional selector patterns for working with more complex content. A selector may look simple, but it communicates an assumption about the shape of the data. If the structure differs, the result may be null or may behave differently than expected. This is why understanding selectors well is more important than memorizing syntax fragments.

When you write `payload.customer.name`, you are saying that the payload contains an object with a `customer` field and that this `customer` field contains another object with a `name` field. When you write `payload.items[0]`, you are saying that `items` is an array and that you want the first element. These assumptions are fine when the source contract is stable. When structures may vary, you need safer handling using defaults, conditional logic, or filtering before selection.

Core operators make DataWeave expressive without making it verbose. Arithmetic operators handle numerical calculations. Comparison operators support filtering and decision logic. Logical operators support boolean expressions. The default operator is especially important in integration work because it gives a clear way to supply fallback values when source content is missing or null. String concatenation, object merging, and conditional expressions also become common once transformations move beyond trivial reshaping.

A conditional expression is often the cleanest way to reflect business rules in transformation logic. Instead of setting a field and then modifying it later, you can derive the value in one place
<!-- p. 35 -->
based on the current data. This keeps the mapping readable and reduces the number of steps needed elsewhere in the flow. The important thing is to keep conditions close to the output fields they affect so that the transformation remains self-explanatory.

The following example shows selectors and operators working together to produce a structured output from a more complex payload.

DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  customerId: payload.customer.id as String,
  itemCount: sizeOf(payload.items default []),
  primarySku: (payload.items default [])[0].sku default null,
  orderCategory: if ((payload.total default 0) >= 1000) "PRIORITY" else "STANDARD",
  contactEmail: payload.customer.contact.email default null,
  discountApplied: (payload.discount default 0) > 0
}
```

This works because it combines clear output construction with guarded selectors. The array access is protected by a default empty array. Numerical logic handles absent values safely. The transformation does not pretend the source is always complete, which makes the output contract more reliable.

It is also helpful to understand that DataWeave expressions can be nested without becoming unreadable if they remain focused. Nested objects and arrays can reflect the intended contract directly. The problem begins when a transformation tries to do too much in one expression or relies on deeply chained selectors without clear handling of missing branches. A readable transformation favors clear field naming, local derivations, and explicit fallback behavior.

Null handling is especially important. Enterprise payloads often contain optional or inconsistently populated fields. A transformation that ignores null behavior may seem to work during happy-path testing but fail in real data conditions. The default operator, conditional expressions, and selective field construction help prevent this. The goal is not to hide data quality issues silently, but to handle them intentionally. Sometimes that means providing a fallback. Sometimes it means omitting a field. Sometimes it means raising an error elsewhere in the flow. What matters is that the transformation reflects the chosen contract rather than leaving behavior accidental.

Another useful habit is to distinguish between source structure and target structure clearly. It is tempting to mirror the source and rename a few fields. That can work for simple cases, but it often leads to unstable contracts because the target remains coupled to the source shape. DataWeave makes it easy to be more deliberate. You can build the target structure independently, selecting only what is needed, grouping values differently, deriving summaries, and hiding internal source details. This is one of the reasons it is so effective in integration projects. It supports adaptation rather than mere copying.

Once syntax, selectors, types, and operators become familiar, DataWeave starts to feel less like a special-purpose transformation layer and more like a practical language for constructing clean output from messy inputs. That is exactly how it should feel. Good DataWeave work is not about producing clever expressions. It is about making transformations explicit, readable, and safe enough that system boundaries stay clear.

## 4.2: Transforming JSON, XML, CSV, and Java Data Structures

One of the strongest aspects of DataWeave is that it supports multiple data formats without forcing you to learn a different transformation style for each one. That does not mean all formats behave identically. JSON, XML, CSV, and Java objects have different structures, different conventions, and different edge cases. What DataWeave provides is a consistent language for working across those structures, so that the main learning burden stays with the data itself rather than with separate transformation tools.

JSON is usually the easiest starting point because it maps naturally to objects and arrays. Fields are selected by name,
<!-- p. 36 -->
arrays are addressed by index or iterated with mapping functions, and the output structure often looks similar to the final result. JSON transformations are common in API development because inbound requests and outbound responses are frequently JSON-based. This makes DataWeave especially useful for request normalization, response shaping, field filtering, and contract stabilization.

The following example reads a JSON payload representing an order and transforms it into a cleaner response object.

DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  id: payload.orderId,
  customer: {
    id: payload.customer.id,
    name: payload.customer.fullName
  },
  items: (payload.lines default []) map (line) -> {
    sku: line.sku,
    quantity: line.qty,
    lineTotal: line.amount
  }
}
```

This works well because JSON payloads are naturally navigated through object and array selectors. The output also stays JSON, so the structure remains familiar. The transformation does not merely rename fields. It also reshapes the customer object and normalizes the line item structure into something more consistent.

A more robust version often adds defaults, type conversions, and derived values that make the output contract less dependent on inconsistent source data.

DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  id: payload.orderId as String,
  customer: {
    id: payload.customer.id as String,
    name: payload.customer.fullName default "Unknown Customer"
  },
  items: (payload.lines default []) map (line) -> {
    sku: line.sku,
    quantity: (line.qty default 0) as Number,
    unitPrice: (line.unitPrice default 0) as Number,
    lineTotal: (line.amount default 0) as Number
  },
  totalLines: sizeOf(payload.lines default []),
  totalAmount: ((payload.lines default []) map ((line) -> (line.amount default 0) as Number)) reduce ((item, acc = 0) -> acc + item)
}
```

The difference is important because real payloads are rarely as clean as sample data. The transformation now makes the intended types explicit, gives safer defaults, and calculates a total rather than assuming the source always provides one. This improves both contract quality and resilience.

XML introduces a different set of considerations. XML often contains nested elements, attributes, namespaces, repeated child nodes, and mixed text content. DataWeave can work with XML effectively, but it helps to be conscious of how XML structures are represented. Elements may be addressed by name, attributes are selected differently from child elements, and repeated nodes may behave like arrays depending on the structure. XML transformation is common in enterprise integration because many older systems, SOAP-based services, and document-oriented workflows still use it heavily.

The following example shows a transformation from XML input into JSON output. The script assumes an XML payload containing an order document with customer and line item elements.

DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.order.@id,
  customerName: payload.order.customer.name,
  items: payload.order.items.*item map (item) -> {
    sku: item.@sku,
    quantity: item.quantity as Number
  }
}
```
<!-- p. 37: el bloque anterior sigue en esta página desde "sku: item.@sku," -->

This example highlights two important XML features. Attribute selection is handled explicitly, and repeated child elements are accessed in a way that produces an iterable collection. That makes it possible to move from an XML document into a JSON array cleanly.

A more robust version becomes useful when XML documents contain optional nodes, text values that need normalization, or namespace-related complexity that should be hidden from downstream consumers.

DataWeave

```dataweave
%dw 2.0
output application/json
var items = payload.order.items.*item default []
---
{
  orderId: payload.order.@id default null,
  customer: {
    name: payload.order.customer.name default "Unknown Customer",
    email: payload.order.customer.email default null
  },
  items: items map (item) -> {
    sku: item.@sku default null,
    quantity: (item.quantity default 0) as Number,
    description: item.description default null
  },
  itemCount: sizeOf(items)
}
```

Here the transformation is clearer about optionality. It also introduces a local variable so the same selected collection does not need to be repeated throughout the expression. That improves readability and makes later changes easier.

CSV is a very different kind of source because it represents tabular data rather than nested hierarchical structure. In DataWeave, CSV content is commonly processed as a sequence of rows, where each row is represented as an object keyed by column names. This is very useful for batch-oriented integrations, file imports, flat exports, and transformations from spreadsheets or data extracts into richer structured formats. The main challenge with CSV is that values often arrive as strings, even when they logically represent dates, numbers, or booleans. This makes normalization especially important.

The following example transforms CSV-like row data into JSON output.

DataWeave

```dataweave
%dw 2.0
output application/json
---
(payload map (row) -> {
  customerId: row.CustomerId,
  name: row.Name,
  active: row.Active == "true",
  balance: row.Balance as Number
})
```

This works because DataWeave treats each row as a record-like object, making the mapping readable. The output becomes an array of JSON objects, which is often more suitable for downstream systems or APIs.

A more robust version can trim values, handle absent columns more safely, and convert loosely formatted text into cleaner output.

DataWeave

```dataweave
%dw 2.0
output application/json
---
(payload map (row) -> {
  customerId: (row.CustomerId default "") as String,
  name: trim(row.Name default ""),
  active: upper(trim(row.Active default "false")) == "TRUE",
  balance: ((row.Balance default "0") as Number),
  region: if (isEmpty(trim(row.Region default ""))) null else trim(row.Region)
})
```

This kind of transformation is common in enterprise integration because flat-file sources are rarely as clean as application-generated JSON. By normalizing the values early, the rest of the flow can work with a more reliable structure.

<!-- p. 38 -->
Java data structures appear frequently in Mule applications because many connectors and internal operations can yield Java objects or collections. DataWeave can work with these structures naturally, but it helps to understand what they represent in practice. A Java map is usually treated similarly to an object. A Java list behaves much like an array. A custom Java object may expose properties that DataWeave can access by name. The main advantage is that transformation logic can remain consistent even when the payload did not originate as JSON or XML.

The following example assumes a Java payload representing a list of order summary objects.

DataWeave

```dataweave
%dw 2.0
output application/json
---
payload map (order) -> {
  id: order.id,
  customerName: order.customerName,
  total: order.total
}
```

This is clear and direct because the Java structure is treated in a familiar way. The transformation does not need to care whether the original data came from a Java service or another connector, only that the fields are accessible.

A more robust version often becomes useful when Java objects contain nested collections, nullable properties, or type normalization needs.

DataWeave

```dataweave
%dw 2.0
output application/json
---
payload map (order) -> {
  id: order.id as String,
  customerName: order.customerName default "Unknown Customer",
  total: (order.total default 0) as Number,
  lines: (order.lines default []) map (line) -> {
    sku: line.sku,
    quantity: (line.quantity default 0) as Number
  }
}
```

The same principle applies as in other formats. The output should be explicit, and assumptions about the source should be made visible through casts and defaults.

The real strength of DataWeave across these formats is not that it hides all differences. It is that it gives you one transformation language that can adapt to those differences while preserving a stable development model. You still need to understand the source data. You still need to know whether a value is an attribute, a repeated node, a row field, or a Java property. But the language used to build the result stays coherent.

This also improves maintenance. When an integration project works with multiple sources, teams do not need one mental model for JSON mapping, another for XML transformation, another for CSV conversion, and another for Java object shaping. They can rely on DataWeave expressions, local variables, selectors, mapping functions, defaults, and type conversions across all of them. That consistency is one of the reasons Mule projects can remain understandable even when their input landscape is diverse.

Another practical benefit is output neutrality. DataWeave does not force the output format to match the input. XML can become JSON. CSV can become XML. Java objects can become CSV rows. JSON can become XML documents. This flexibility matters because integration often exists precisely to bridge incompatible systems. The source system does not determine the consumer contract. The transformation does.

It is also worth noting that format transformation is rarely only about syntax. When JSON becomes XML or CSV becomes JSON, business meaning often changes as well. Field names may be normalized. Optional values may be omitted. Nested groupings may be introduced. Repeated records may be summarized. The transformation language gives you the power to do that. The responsibility is to use that power clearly so that contracts stay intentional rather than accidental. The best transformations do not simply convert structure. They produce output that is appropriate for the next system while remaining understandable to the people maintaining the flow.

<!-- p. 39 -->
## 4.3: Reusable Functions, Modules, and Maintainable Transformation Design

A DataWeave script can be correct and still be difficult to maintain. This usually happens when transformation logic is written only for the immediate payload in front of you and not for the long-term structure of the application. The first few mappings may seem manageable, but once similar rules appear across several flows, repeated expressions and copied fragments begin to accumulate. At that point, even small changes become risky because the same rule must be updated in multiple places. This is where reusable functions, modules, and maintainable transformation design become essential.

A function in DataWeave allows you to define reusable logic once and call it wherever needed within the script. Functions are especially useful when the same normalization rule, formatting step, or object-building pattern appears several times. Instead of repeating the same expression in multiple fields, you can name the transformation step and apply it consistently. This improves readability immediately because the intent becomes visible. It also improves maintainability because changes can be made centrally within the script rather than scattered across the output structure.

The following example shows a straightforward function used to normalize names.

DataWeave

```dataweave
%dw 2.0
output application/json

fun normalizeName(name) = upper(trim(name default ""))

---
{
  firstName: normalizeName(payload.firstName),
  lastName: normalizeName(payload.lastName)
}
```

This is the simplest correct version because it takes a repeated piece of logic and gives it a clear purpose. Instead of reading and mentally comparing the same expression twice, you read a function name that communicates meaning.

A more robust version becomes useful when the same function should handle nulls, empty content, and formatting rules more explicitly, while also supporting multiple related helper functions in one script.

DataWeave

```dataweave
%dw 2.0
output application/json

fun normalizeName(name) =
    if (isEmpty(trim(name default "")))
      null
    else
      capitalize(lower(trim(name)))

fun normalizeEmail(email) =
    if (isEmpty(trim(email default "")))
      null
    else
      lower(trim(email))
---
{
  customer: {
    firstName: normalizeName(payload.firstName),
    lastName: normalizeName(payload.lastName),
    email: normalizeEmail(payload.email)
  }
}
```

The difference is not only more logic. The script now makes business choices visible. Empty strings become null. Case normalization is consistent. Repeated formatting rules are centralized. This makes the transformation easier to reason about and far easier to update if formatting requirements change.

Local functions are useful within one script, but modules are what make reuse possible across multiple scripts and applications. A DataWeave module is a file that contains reusable functions, constants, or helper logic that other scripts can import. This is especially valuable in enterprise environments where the same normalization rules, date
<!-- p. 40 -->
formatting logic, tax calculations, string cleanup, address shaping, or identifier handling appear in multiple APIs and integrations. Instead of copying logic from one flow to another, you publish shared transformation functions that can be maintained in one place.

Reusable modules improve not only code reuse but also consistency. When teams share the same formatting rules, contract helpers, and normalization utilities, the output across applications becomes more predictable. This matters because inconsistent transformation design often shows up as subtle contract drift. One API trims and lowercases email values while another does not. One integration interprets blank values as null while another preserves empty strings. One service formats dates in one pattern while another uses a different one. Shared DataWeave modules help reduce that drift by making common rules easy to adopt.

The following example shows a small reusable module and a script that imports it.

DataWeave

```dataweave
%dw 2.0

fun normalizePhone(phone) =
    (phone default "")
        replace /[^0-9]/ with ""

fun safeString(value) =
    if (isEmpty(trim(value default ""))) null else trim(value)
```

DataWeave

```dataweave
%dw 2.0
output application/json
import normalizePhone, safeString from modules::CommonTransforms

---
{
  customerName: safeString(payload.name),
  phone: normalizePhone(payload.phone)
}
```

This is already useful because the consuming script stays focused on business output while common cleanup logic lives elsewhere. The script becomes shorter and more expressive without losing clarity.

A more robust module often groups related functions by domain or transformation concern and uses naming that reflects contract behavior more clearly.

DataWeave

```dataweave
%dw 2.0

fun safeString(value) =
    if (isEmpty(trim(value default ""))) null else trim(value)

fun normalizePhone(phone) =
    (phone default "")
        replace /[^0-9]/ with ""

fun normalizePostalCode(postalCode) =
    upper(trim(postalCode default ""))

fun buildFullName(firstName, lastName) =
    [safeString(firstName), safeString(lastName)]
        filter ($ != null)
        joinBy " "
```

DataWeave

```dataweave
%dw 2.0
output application/json
import safeString, normalizePhone, normalizePostalCode, buildFullName from modules::CustomerTransforms

---
{
  fullName: buildFullName(payload.firstName, payload.lastName),
  contact: {
    email: safeString(payload.email),
    phone: normalizePhone(payload.phone)
  },
  address: {
    postalCode: normalizePostalCode(payload.address.postalCode)
  }
}
```

This version is stronger because the imported module reflects a coherent domain concern. The calling script becomes easier to read because it no longer carries low-level cleanup logic inline. Instead, it expresses business meaning through named transformation functions.

<!-- p. 41 -->
Maintainable transformation design also depends on how scripts are structured, not only on whether functions exist. A large script can still become difficult to follow if too much logic is embedded inside field definitions. One common improvement is to use local variables to name intermediate values that are reused or conceptually meaningful. For example, if a filtered list of active items is used in several output fields, assigning it to a local variable makes the script clearer. This is similar to how application code becomes more readable when repeated expressions are named rather than retyped.

The following example shows how local variables can reduce repetition in a script.

DataWeave

```dataweave
%dw 2.0
output application/json
var activeLines = (payload.lines default []) filter ((line) -> (line.active default false) == true)
---
{
  activeCount: sizeOf(activeLines),
  activeSkus: activeLines map ((line) -> line.sku),
  totalActiveAmount: (activeLines map ((line) -> (line.amount default 0) as Number)) reduce ((item, acc = 0) -> acc + item)
}
```

This is easier to read than repeating the same filter expression three times. The variable gives the intermediate set a name that reflects its meaning, which improves both readability and maintainability.

A more robust design often combines local variables and helper functions so the top-level output stays focused on structure rather than low-level manipulation.

DataWeave

```dataweave
%dw 2.0
output application/json

fun toAmount(value) = (value default 0) as Number
fun isActive(line) = (line.active default false) == true

var activeLines = (payload.lines default []) filter isActive($)
var activeAmounts = activeLines map ((line) -> toAmount(line.amount))
---
{
  activeCount: sizeOf(activeLines),
  activeSkus: activeLines map ((line) -> line.sku),
  totalActiveAmount: activeAmounts reduce ((item, acc = 0) -> acc + item)
}
```

The difference is that the script now communicates intent more clearly. The reader can see the output structure almost immediately because repeated logic has been moved into named components.

Another part of maintainable design is resisting the urge to make one script do everything. DataWeave is expressive enough that very large transformations can be written as one block. That does not mean they should be. If a transformation includes major sections with different responsibilities, it is often cleaner to separate them through helper functions or modules. A script that builds customer output, item output, billing output, and audit metadata all inline may be syntactically valid but hard to understand. Breaking those responsibilities into named functions makes the output more approachable and much easier to revise later.

Naming is also important. Functions should describe what they do rather than how they do it. A name like `normalizeCurrencyCode` or `buildOrderSummary` is much more useful than a generic name like `format1` or `helper`. Clear naming allows the top-level transformation to read like a description of the output rather than a collection of technical tricks.

Testing and review also improve when transformations are designed this way. A reviewer can look at a script and identify which parts define the contract and which parts encapsulate reusable rules. A test can focus on whether a helper function treats edge cases correctly or whether the final structure matches expectations. When mapping logic is copied and embedded everywhere, both review and testing become more repetitive and less trustworthy.

Maintainability also includes being honest about scope. Not every shared expression should become a module. Some logic is specific to one transformation and should stay local. The goal is not to create a library for every small formatting step. The goal
<!-- p. 42 -->
is to centralize logic that is meaningfully reusable and likely to need consistent behavior across multiple scripts. Too little reuse creates duplication. Too much abstraction makes scripts hard to follow because even simple rules are hidden behind distant helper layers. Good judgment sits in the middle.

The real benefit of reusable functions and modules is that they keep DataWeave from turning into disposable mapping code. In strong Mule applications, transformation logic becomes part of the application's architecture. It expresses contracts, normalizes business data, and helps enforce consistency across interfaces. That role deserves the same design care as flows, connectors, and API definitions. When DataWeave is written with reuse and readability in mind, it becomes easier to trust and much easier to evolve.

## 4.4: Reader and Writer Properties, Streaming, and Performance-aware Mapping

A transformation may be logically correct and still behave poorly at runtime if it ignores how data is read, written, and processed in memory. This is where DataWeave moves beyond syntax and into operational behavior. Reader properties determine how incoming data is interpreted. Writer properties shape how output is produced. Streaming affects whether data is consumed lazily or materialized eagerly. Mapping style influences memory usage, execution time, and the practical cost of processing larger payloads. These concerns are easy to postpone when working with small samples, but they matter greatly in enterprise integration where file sizes, result sets, and message volumes are often much larger than development examples suggest.

Reader properties influence how DataWeave parses incoming content. A CSV file, for example, may require a specific separator, header handling, or encoding interpretation. JSON inputs may need a certain treatment of duplicate keys or null values. XML inputs may involve declaration or namespace behavior that affects how content should be interpreted. In many cases the defaults are good enough, but when they are not, reader properties give you precise control. This can prevent subtle defects where a file appears to load successfully but the resulting structure is not what the transformation expects.

Writer properties matter just as much on the output side. A transformation can produce JSON, XML, CSV, Java objects, and other formats, but the exact shape of that output often depends on writer settings. Pretty printing, null omission, indentation, header inclusion, encoding behavior, and other format-specific controls influence what downstream systems receive. These settings are not merely cosmetic. In some integrations, the wrong writer behavior can cause parsing failures, contract mismatches, or unexpected file content. Good transformations therefore treat output configuration as part of the contract, not as an incidental formatting detail.

The following example shows a straightforward transformation that writes CSV from structured data.

DataWeave

```dataweave
%dw 2.0
output application/csv
---
payload map (customer) -> {
  CustomerId: customer.id,
  Name: customer.name,
  Balance: customer.balance
}
```

This is the simplest correct version because it relies on the default CSV writer behavior to produce a valid tabular output. That is often enough when column names and default settings align with the target expectation.

A more robust version becomes useful when the output requires explicit header handling and a clearer writing style.

DataWeave

```dataweave
%dw 2.0
output application/csv header=true, separator=","
---
payload map (customer) -> {
  CustomerId: customer.id as String,
  Name: customer.name default "",
  Balance: (customer.balance default 0) as Number
}
```

<!-- p. 43 -->
The difference is important because the output behavior is now explicit. The script states that a header row should be present and which separator should be used. This reduces guesswork and makes the intended file contract visible in the transformation itself.

Reader properties are often paired with sources that provide raw content. For example, when handling CSV input, you may need to declare whether the first row contains column headers or whether a different separator is used. That choice affects the structure DataWeave sees. If the reader interprets the first row as data rather than field names, every downstream selector changes. This is why format configuration should be reviewed as part of the transformation, not assumed to be trivial.

The following example shows CSV input being interpreted with explicit reader behavior before it is transformed into JSON.

DataWeave

```dataweave
%dw 2.0
input payload application/csv header=true, separator=","
output application/json
---
payload map (row) -> {
  id: row.CustomerId,
  name: row.Name,
  active: upper(trim(row.Active default "FALSE")) == "TRUE"
}
```

This version is clear about how the source file should be read. That matters because the input structure now matches the field selectors used later in the script.

A more robust version may add value normalization and safer handling for missing fields.

DataWeave

```dataweave
%dw 2.0
input payload application/csv header=true, separator=","
output application/json
---
payload map (row) -> {
  id: (row.CustomerId default "") as String,
  name: trim(row.Name default ""),
  active: upper(trim(row.Active default "FALSE")) == "TRUE",
  region: if (isEmpty(trim(row.Region default ""))) null else trim(row.Region)
}
```

Once again, the pattern is the same. Explicit reader configuration establishes the source shape. The mapping then becomes safer and more contract-aware.

Streaming is one of the most important runtime topics in DataWeave because it affects how large content is processed. In simple terms, streaming allows data to be handled without loading all of it into memory at once, depending on the source, connector, and transformation behavior. This can be very useful when working with large files, large result sets, or payloads that would otherwise consume significant memory. But streaming is not automatic magic. Certain operations force data to be fully materialized, and once that happens, the memory benefits may be lost.

A performance-aware transformation therefore asks practical questions. Is the payload likely to be large. Does the transformation really need the full content at once. Are there operations that repeatedly scan or rebuild the same collection. Is the script mapping data in a single pass, or is it repeatedly filtering and reducing the same structure. Does the connector produce stream-capable content, and is the transformation preserving that advantage or defeating it. These questions matter because DataWeave is expressive enough to make inefficient logic look elegant.

One common source of inefficiency is repeated traversal. If the same large array is filtered several times for similar purposes, the transformation may do more work than necessary. A local variable can help by capturing the subset once and reusing it. Another common issue is converting streamed content into a fully in-memory structure too early, especially when only part of the data is needed. The language does not force these mistakes, but it will not prevent them automatically either. Good design makes them visible.

Consider a transformation that processes a large set of line items. A straightforward version may work, but it may also traverse the collection several times.

DataWeave

<!-- p. 44: el código empieza en esta página -->

```dataweave
%dw 2.0
output application/json
---
{
  itemCount: sizeOf(payload.items default []),
  activeItems: (payload.items default []) filter ((item) -> (item.active default false) == true),
  activeCount: sizeOf((payload.items default []) filter ((item) -> (item.active default false) == true)),
  totalAmount: ((payload.items default []) map ((item) -> (item.amount default 0) as Number)) reduce ((item, acc = 0) -> acc + item)
}
```

This works, but it repeats the same access pattern more than necessary. On small payloads, that may not matter much. On larger payloads, it becomes less efficient and harder to maintain.

A more robust version improves both clarity and runtime behavior by reusing intermediate results.

DataWeave

```dataweave
%dw 2.0
output application/json
var items = payload.items default []
var activeItems = items filter ((item) -> (item.active default false) == true)
var amounts = items map ((item) -> (item.amount default 0) as Number)
---
{
  itemCount: sizeOf(items),
  activeItems: activeItems,
  activeCount: sizeOf(activeItems),
  totalAmount: amounts reduce ((item, acc = 0) -> acc + item)
}
```

The difference is useful in two ways. The script becomes easier to read because the meaningful collections are named. It also avoids unnecessary repeated filtering logic. This does not solve every performance issue automatically, but it is a healthier design pattern.

Writer properties can also affect performance and interoperability. Pretty-printed JSON may be easier for humans to inspect, but it adds output overhead and may be unnecessary in production responses. XML output may require specific declaration behavior or formatting. CSV output may need strict separator and quoting rules. Good transformation design therefore considers what the target system needs rather than producing whatever happens to be convenient during development.

The following example shows JSON output with an explicit writer property that omits null fields.

DataWeave

```dataweave
%dw 2.0
output application/json skipNullOn="everywhere"
---
{
  id: payload.id,
  name: payload.name,
  email: payload.email default null,
  phone: payload.phone default null
}
```

This can be very useful when the target contract expects absent optional values to be omitted rather than present with null content. That is a writer-level decision with contract implications, not a superficial formatting choice.

A more robust version may combine output control with normalization logic so that the writer behavior aligns with the overall contract more deliberately.

DataWeave

```dataweave
%dw 2.0
output application/json skipNullOn="everywhere"
fun safeString(value) =
    if (isEmpty(trim(value default ""))) null else trim(value)
---
{
  id: payload.id as String,
  name: safeString(payload.name),
  email: safeString(payload.email),
  phone: safeString(payload.phone)
}
```

Here the output behavior is much cleaner because empty and blank values are normalized before the writer decides whether to omit them. This creates a more stable contract than relying on raw input values alone.

<!-- p. 45 -->
Performance-aware mapping is also about choosing the right place for heavy work. Some transformations belong in DataWeave because they are naturally structural and declarative. Others may need a different flow design if they require excessive aggregation, repeated grouping, or business logic that no longer reads cleanly as a mapping. DataWeave is capable, but clarity still matters. A transformation that becomes difficult to understand while also processing large data volumes is a warning sign. Often the solution is to split work into stages, use local variables more thoughtfully, or change upstream flow design so the mapping receives data in a more suitable form.

Streaming awareness also affects debugging expectations. When payloads are streamed, inspecting them casually in logs or repeatedly accessing them in ways that force full realization can change runtime behavior. This is another reason to be deliberate. Logging entire large payloads is usually a poor idea both for performance and readability. A better approach is to log focused metadata, counts, identifiers, or summary fields unless the situation truly requires a full payload snapshot.

A good operational mindset therefore treats DataWeave as part of runtime design, not just part of syntax design. Reader properties define how incoming content becomes structured data. Writer properties define how structured output becomes a contract. Streaming and mapping style influence whether large payloads are processed efficiently. Local variables and reusable functions improve not only readability but also repeated-work behavior. Once these ideas become part of regular transformation practice, DataWeave stops being only a mapping language and becomes a reliable tool for shaping data under real production conditions.
