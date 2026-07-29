---
title: PhetioObject
description: Base class for PhET-iO instrumentation — usually ignore unless you are building PhET-iO.
category: api
library: tandem
tags: [tandem, phet-io, PhetioObject]
status: verified
related:
  - /guides/phet-io-and-instrumentation
  - /api/tandem/tandem
  - /api/tandem/disposable
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioObject

`PhetioObject` (from `scenerystack/tandem`) is the base that attaches a [`Tandem`](/api/tandem/tandem), an `IOType`, and PhET-iO metadata (`phetioState`, `phetioReadOnly`, …) to an instance. `Property`, `Node`, `Screen`, and many UI controls extend it transitively.

**You almost never subclass or configure this for a SceneryStack app.** It exists so PhET-iO can address and serialize objects. For why the layer is in the library at all, see [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation). For dispose lifecycle (useful outside PhET-iO), see [`Disposable`](/api/tandem/disposable).
