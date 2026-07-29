---
title: PhetioGroup
description: PhET-iO container for a dynamic collection of instrumented elements — usually ignore unless you are building PhET-iO.
category: api
library: tandem
tags: [tandem, phet-io, PhetioGroup]
status: verified
related:
  - /guides/phet-io-and-instrumentation
  - /api/tandem/phetio-capsule
  - /api/tandem/phetio-object
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioGroup

`PhetioGroup` (from `scenerystack/tandem`) manages a runtime-growing collection of instrumented `PhetioObject`s (for example particles created during a sim) so PhET-iO can name them and recreate them on state restore.

**Ordinary SceneryStack apps should not use this.** Prefer a plain array or `ObservableArray` for dynamic model elements. Background: [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation).
