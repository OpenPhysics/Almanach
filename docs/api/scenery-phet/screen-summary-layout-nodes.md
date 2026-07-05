---
title: Screen Summary Layout Nodes
description: PlayAreaNode, ControlAreaNode, and ScreenSummaryNode — the standard PDOM structural sections used to organize a ScreenView's accessible description tree.
category: api
library: scenery-phet
tags: [scenery-phet, PlayAreaNode, ControlAreaNode, ScreenSummaryNode, pdom, accessibility]
status: complete
related:
  - /accessibility/pdom
  - /api/joist/screen-view
  - /accessibility/describing-dynamic-state
prerequisites:
  - /accessibility/pdom
  - /api/joist/screen-view
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Screen Summary Layout Nodes

A screen reader user exploring a PhET sim's [PDOM](/accessibility/pdom) benefits enormously from a consistent, predictable structure — rather than every sim inventing its own heading layout, `ScreenView` divides accessible content into three standard sections, each backed by one of these `Node` types from `scenerystack/scenery-phet`: `ScreenSummaryNode` (an overview of the screen, read first), `PlayAreaNode` (the primary, pedagogically important interactive content), and `ControlAreaNode` (secondary controls). You don't construct these yourself in most sims — a `ScreenView` already creates one of each — but you do add your own content into them via `pdomOrder`.

```ts
// Inside a ScreenView subclass constructor:
this.screenSummaryNode.addChild( new Node( {
  tagName: 'p',
  innerContent: 'A ball moves across a frictionless track.'
} ) );

// Order the accessible content within the play area.
this.pdomPlayAreaNode.pdomOrder = [ ballNode, trackNode ];

// And within the control area.
this.pdomControlAreaNode.pdomOrder = [ resetAllButton ];
```

## The shared shape: PDOMSectionNode

`PlayAreaNode` and `ControlAreaNode` are both thin subclasses of a shared (internal) `PDOMSectionNode` base: each renders as an HTML `<section>` containing a `<div>`, with an `accessibleHeading` set from a translated label ("Play Area" / "Control Area") baked in by the constructor — you supply content, not the heading. Both accept a `providedOptions` object that's just `NodeOptions` (minus the PDOM fields the base class already owns), so you configure them the same way you'd configure any container `Node`.

| Type | Section heading | Intended contents |
| --- | --- | --- |
| `PlayAreaNode` | "Play Area" | The main interactive, pedagogically central elements of the screen |
| `ControlAreaNode` | "Control Area" | Secondary controls — reset buttons, settings, anything supporting rather than central to the interaction |

```ts
import { PlayAreaNode, ControlAreaNode } from 'scenerystack/scenery-phet';

const playAreaNode = new PlayAreaNode();
const controlAreaNode = new ControlAreaNode();
```

## ScreenSummaryNode: the opening overview

`ScreenSummaryNode` is a plain `Node` (not a `PDOMSectionNode`) that renders as two paragraphs read at the very top of the PDOM: an opening summary sentence and a fixed "use keyboard shortcuts" hint. `ScreenView` creates one automatically and calls `setIntroString( simName, screenDisplayName, isMultiScreen )` on it internally to fill in the opening sentence appropriately for single- vs. multi-screen sims — you don't normally call `setIntroString` yourself.

What you *do* use it for is adding more descriptive content after the opening sentence:

```ts
// Inside a ScreenView subclass constructor:
this.screenSummaryNode.addChild( new Node( {
  tagName: 'p',
  innerContent: 'There are 3 balls and a track. The track is currently flat.'
} ) );
```

`ScreenSummaryNode` manages its own internal `pdomOrder` (opening summary first, then your added children, then the keyboard-shortcuts hint last) — don't set `pdomOrder` on it yourself.

::: tip These three Nodes already exist on your ScreenView — don't construct new ones
A `ScreenView` instance exposes `screenSummaryNode`, `pdomPlayAreaNode`, and `pdomControlAreaNode` (consult [`ScreenView`](/api/joist/screen-view) for the exact property names) already wired into the sim's top-level PDOM structure. Constructing extra `PlayAreaNode`/`ControlAreaNode`/`ScreenSummaryNode` instances yourself would just create disconnected sections nothing points to — add your content into the existing ones instead.
:::
