---
title: PhetioIDUtils and Tandem Naming Conventions
description: String helpers for PhET-iO element IDs — usually ignore unless you are building PhET-iO.
category: api
library: tandem
tags: [tandem, phet-io, PhetioIDUtils, Tandem]
status: verified
related:
  - /api/tandem/tandem
  - /guides/phet-io-and-instrumentation
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioIDUtils and Tandem Naming Conventions

`PhetioIDUtils` (from `scenerystack/tandem`) provides static helpers for building and inspecting PhET-iO element IDs (`phetioID` paths produced by a tandem tree). Naming conventions (camelCase segments, Property suffixes, …) matter only when publishing a stable PhET-iO API.

**SceneryStack apps that omit instrumentation never need these utilities.** See [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) and [`Tandem`](/api/tandem/tandem).
