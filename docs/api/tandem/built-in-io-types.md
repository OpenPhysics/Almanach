---
title: Built-in IOTypes
description: Ready-made PhET-iO serializers for primitives and containers — usually ignore unless you are building PhET-iO.
category: api
library: tandem
tags: [tandem, phet-io, IOType]
status: verified
related:
  - /api/tandem/io-type
  - /guides/phet-io-and-instrumentation
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Built-in IOTypes

`scenerystack/tandem` exports ready-made `IOType` instances (`NumberIO`, `StringIO`, `BooleanIO`, array/map helpers, …) used when PhET-iO serializes instrumented values.

**You do not need these for ordinary SceneryStack work.** They matter only when wiring PhET-iO instrumentation. See [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) and [`IOType`](/api/tandem/io-type).
