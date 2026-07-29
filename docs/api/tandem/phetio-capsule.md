---
title: PhetioCapsule
description: PhET-iO container for a single lazily created instrumented element — usually ignore unless you are building PhET-iO.
category: api
library: tandem
tags: [tandem, phet-io, PhetioCapsule]
status: verified
related:
  - /guides/phet-io-and-instrumentation
  - /api/tandem/phetio-group
  - /api/tandem/phetio-object
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioCapsule

`PhetioCapsule` (from `scenerystack/tandem`) holds one lazily created instrumented element (for example an on-demand dialog) with a stable PhET-iO address across create/dispose cycles.

**Ordinary SceneryStack apps should not use this.** Construct and dispose Nodes normally. Background: [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation).
