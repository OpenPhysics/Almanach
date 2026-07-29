---
title: Tandem
description: The naming handle PhET-iO uses for instrumented elements — usually ignore it in SceneryStack apps.
category: api
library: tandem
tags: [tandem, phet-io, Tandem]
status: verified
prerequisites:
  - /guides/phet-io-and-instrumentation
related:
  - /guides/phet-io-and-instrumentation
  - /api/joist/screen
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Tandem

`Tandem` (from `scenerystack/tandem`) is a node in a naming tree used by PhET-iO to give instrumented elements a stable address. **Typical SceneryStack apps do not instrument anything** — see [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation). The one place you still touch `Tandem` is the boilerplate `Screen` requires:

```ts
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'myScreen' );
// pass { tandem: screenTandem } to Screen; do not thread it further unless you need PhET-iO
```

| Value | Meaning |
| --- | --- |
| `Tandem.ROOT` | Root of the sim's tandem tree |
| `tandem.createTandem( name )` | Child path under an existing tandem |
| `Tandem.OPTIONAL` / `Tandem.OPT_OUT` | Explicitly opt out of instrumentation |
| `Tandem.REQUIRED` | Default on many sun/scenery-phet controls meaning "caller must supply a real tandem" — override with `OPTIONAL` or a real tandem if assertions complain |

You do not need to pass `tandem` into everyday components (`RectangularPushButton`, `Checkbox`, `HSlider`, …) unless you are deliberately building PhET-iO.
