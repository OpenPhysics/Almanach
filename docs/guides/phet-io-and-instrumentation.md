---
title: PhET-iO and Instrumentation
description: Why PhET-iO and Tandem exist in SceneryStack, and why typical SceneryStack apps can ignore them.
category: guides
tags: [phet-io, tandem, instrumentation]
status: verified
related:
  - /getting-started/your-first-simulation
  - /api/tandem/tandem
prerequisites:
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
navOrder: 18
---

# PhET-iO and Instrumentation

**Most SceneryStack apps do not need PhET-iO or `Tandem`.** This page exists so the leftover API surface does not look mysterious — not so you wire instrumentation into every button.

## Why this layer exists

PhET Interactive Simulations ships a product line called **PhET-iO**: wrappers and tooling that treat a running sim as an external API. An instrumented sim can be inspected, driven, logged, and have its full state saved and restored by something *outside* the browser tab — classroom data collection, automated wrappers, Studio, interoperability with other software.

To make that work, every interesting object needs a stable hierarchical address. That address is a [`Tandem`](/api/tandem/tandem). Properties, Nodes, Emitters, and screens that opt in get a tandem path like `mySim.myScreen.model.massProperty`, plus metadata and serialization hooks (`IOType`, `PhetioObject`, and friends under `scenerystack/tandem`).

SceneryStack is the open library extracted from that codebase. The tandem APIs came along with it. They are real, maintained, and useful **if you are building PhET-iO**. They are not a SceneryStack best practice for ordinary interactive apps.

## What you should do in practice

| Situation | What to do |
| --- | --- |
| Building a typical SceneryStack sim or scenery scene | Omit `tandem` on buttons, sliders, Properties, listeners. Copy-paste examples in this Almanach do the same. |
| Constructing a `Screen` / `Sim` | Pass the minimal `Tandem.ROOT.createTandem( '…' )` the API requires, then forget about it. See [Your First Simulation](/getting-started/your-first-simulation). |
| Assertions complain that a tandem was "required" but not supplied | Pass `tandem: Tandem.OPTIONAL` (same as `Tandem.OPT_OUT`) to opt out, or supply a real child tandem only if you intentionally instrument. |
| You actually need remote control / full state restore for wrappers | Read the thin [`api/tandem`](/api/tandem/tandem) stubs and the upstream PhET-iO docs — Almanach does not teach that workflow. |

Do **not** thread tandems through every model Property and UI control "just in case." That cost is for PhET-iO product work, not for learning scenery, axon, or sun.
