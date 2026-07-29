---
title: IOType
description: PhET-iO serialization descriptor — usually ignore unless you are building PhET-iO.
category: api
library: tandem
tags: [tandem, phet-io, IOType]
status: verified
related:
  - /guides/phet-io-and-instrumentation
  - /api/tandem/phetio-object
  - /api/tandem/built-in-io-types
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# IOType

`IOType` (from `scenerystack/tandem`) describes how a class serializes for PhET-iO state (schema, `toStateObject` / `applyState`, methods, docs). Built-in Properties already carry `NumberIO`, `StringIO`, and similar types.

**SceneryStack apps that are not PhET-iO products do not author `IOType`s.** Prefer keeping state in ordinary `Property`s. Background: [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation). Ready-made types: [Built-in IOTypes](/api/tandem/built-in-io-types).
