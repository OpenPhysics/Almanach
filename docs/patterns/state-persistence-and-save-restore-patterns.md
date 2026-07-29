---
title: State Persistence and Save/Restore Patterns
description: 'Structuring model state as enumerable Properties so it can be saved and restored by a simulation''s own save/load feature.'
category: patterns
tags:
  - Property
  - state
  - persistence
status: verified
related:
  - /patterns/model-view-separation
  - /patterns/reset-all-pattern
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - 'https://www.npmjs.com/package/scenerystack'
  - 'https://scenerystack.org/reference/'
navOrder: 21
---

# State Persistence and Save/Restore Patterns

::: tip Scope: save/load, not the Reset All button
This page is about **enumerating model state** so it can be serialized and restored by a custom save/load feature. For wiring the in-sim Reset All button back to each Property's `initialValue`, see [The Reset-All Pattern](/patterns/reset-all-pattern).
:::

Any "save state now, restore it later" feature: **the model's entire mutable state is enumerable as a set of `Property` values**, with nothing important living in a local variable, a closure, or a field that isn't a `Property`. [Model-View Separation](/patterns/model-view-separation) already asks for this as an architecture rule; this page is about the save/restore consequence of following (or not following) it.

## Why Property-based state is what makes this mechanical

```ts
class ProjectileModel {
  public readonly angleProperty = new NumberProperty( 45 );
  public readonly speedProperty = new NumberProperty( 10 );
  public readonly isRunningProperty = new BooleanProperty( false );

  // Anything NOT expressed as a Property here (a plain field, a variable in step())
  // is state a generic save/restore mechanism cannot see and cannot capture.
}
```

Because every piece of state above is a `Property`, "capture the current state" and "restore a captured state" are both generic operations that don't need to know anything about `ProjectileModel` specifically:

```ts
// Capture: walk every state Property and record its value.
function captureState( model: ProjectileModel ) {
  return {
    angle: model.angleProperty.value,
    speed: model.speedProperty.value,
    isRunning: model.isRunningProperty.value
  };
}

// Restore: write each value back. Every observer (view, DerivedProperty, …)
// updates itself automatically because it was already observing the Property, not
// a snapshot of it.
function restoreState( model: ProjectileModel, state: ReturnType<typeof captureState> ): void {
  model.angleProperty.value = state.angle;
  model.speedProperty.value = state.speed;
  model.isRunningProperty.value = state.isRunning;
}
```

If a simulation-specific save/restore feature is needed, this is roughly what it looks like hand-rolled. Keep every piece of mutable state in a `Property` and the capture/restore loops stay generic.

## What must NOT be state

| Belongs in a Property (save/restore sees it) | Does not belong in a Property (deliberately invisible to save/restore) |
| --- | --- |
| Anything the user set or that represents the model's condition (`angleProperty`, `isRunningProperty`) | Purely derived values recomputed from other state — see below |
| Inputs that drive a `DerivedProperty` | View-only transient state (an in-progress drag offset, a tooltip's hover flag) |

A `DerivedProperty` is a special case: it *is* state a client can read, but it must never be independently restored — restoring its inputs is sufficient. Trying to hand-restore a derived value directly just means it will immediately be overwritten (or worse, drift out of sync) the next time its dependencies change.

```ts
// Don't restore this directly - restoring angleProperty is enough; heightAtLaunchProperty
// recomputes itself from the DerivedProperty wiring set up in the constructor.
public readonly heightAtLaunchProperty = new DerivedProperty(
  [ this.angleProperty ],
  angle => Math.sin( angle )
);
```

## Reset is the smallest save/restore case

`reset()` (see [The Reset-All Pattern](/patterns/reset-all-pattern)) is the degenerate case of this same idea: "restore" a fixed, known state (each Property's `initialValue`) rather than an arbitrary captured one. A model that can correctly implement `reset()` by calling `.reset()` on every one of its Properties has, by construction, already satisfied the harder requirement of being fully save/restorable — a useful design check even if you never ship a save feature.

::: tip Design for save/restore even if you never build a save feature
Keeping every piece of mutable state in a `Property` costs nothing extra to write and pays off in several ways at once: `reset()` becomes mechanical, a future undo/redo or save/load feature has something to hang its capture step on, and view code stays honest about what the model owns. The alternative — state hidden in closures or plain fields — has to be refactored out retroactively the moment any of those needs shows up.
:::
