---
title: ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject
description: The scenery Node that hosts a fixed-size three.js viewport, and the mixin/PhetioObject pair used to give individual three.js objects a PhET-iO address.
category: api
library: mobius
tags: [mobius, ThreeNode, ThreeInstrumentable, ThreeObject3DPhetioObject, three.js, phet-io]
status: verified
prerequisites:
  - /api/mobius/scene-and-camera-setup
  - /examples/three-js-integration
related:
  - /api/mobius/scene-and-camera-setup
  - /api/mobius/three-isometric-node
  - /api/mobius/three-utils-helpers
  - /examples/three-js-integration
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject

`ThreeNode` (from `scenerystack/mobius`) embeds a fixed-size three.js viewport in the scenery scene graph. `ThreeInstrumentable` / `ThreeObject3DPhetioObject` exist only for PhET-iO addressing of individual meshes — typical SceneryStack apps use `ThreeNode` alone (see [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation)).

## `ThreeNode`: a fixed-size three.js viewport

`ThreeNode` extends `scenerystack/scenery`'s `Node` and hosts one `ThreeStage` (see [ThreeStage](/api/mobius/scene-and-camera-setup)) at a fixed `width`/`height`, embedding the stage's renderer `<canvas>` via a `DOM` node (`preventTransform: true`, `pickable: false`) so scenery never tries to CSS-transform the canvas itself. It's the "content sits at one place in the scene graph" counterpart to `ThreeIsometricNode`, which instead takes over an entire `ScreenView`'s layout bounds with isometric scaling (that's the Node `MobiusScreenView` sets up for you — see [Three.js Integration](/examples/three-js-integration)). Use `ThreeNode` directly when you want 3D content as one ordinary-sized child among other scenery Nodes, rather than a full-screen 3D backdrop.

```ts
import { ThreeNode, THREE } from 'scenerystack/mobius';
import { Vector3 } from 'scenerystack/dot';

const threeNode = new ThreeNode( 400, 300, {
  cameraPosition: new Vector3( 0, 0, 3 )
} );

const geometry = new THREE.SphereGeometry( 0.5, 32, 16 );
const material = new THREE.MeshNormalMaterial();
threeNode.stage.threeScene.add( new THREE.Mesh( geometry, material ) );
threeNode.stage.threeScene.add( new THREE.DirectionalLight( 0xffffff, 1 ) );

// Call once the Node's transform/position in the global scene is settled...
threeNode.layout();
// ...and on every animation frame:
threeNode.render();
```

### `ThreeNode` constructor

```ts
new ThreeNode( width: number, height: number, providedOptions?: ThreeNodeOptions )
```

`ThreeNodeOptions` = `{ fov?: number }` (default `50`) plus every `ThreeStageOptions` (`cameraPosition`, `backgroundColorProperty`, `threeRendererOptions`, `threeRendererPixelRatio` — forwarded straight to the internal `ThreeStage`) plus ordinary `NodeOptions`.

| Member | Description |
| --- | --- |
| `stage` | The `ThreeStage` this Node hosts — add `THREE.Object3D`s to `stage.threeScene` |
| `backgroundEventTarget` | A `Rectangle` sized to `width`×`height`, added as the first child, for capturing drags/clicks that don't hit specific 3D content |
| `projectPoint( Vector3 )` → `Vector2` | Delegates to `stage.projectPoint` |
| `layout()` | Recomputes the stage's pixel dimensions from this Node's current global bounds and repositions the embedded canvas; call after any transform change |
| `render( target? )` | Renders the stage (`autoClear: true`) |
| `dispose()` | Disposes the `stage` |

## PhET-iO helpers (usually skip)

`ThreeInstrumentable` and `ThreeObject3DPhetioObject` attach a PhET-iO address to a `THREE.Object3D`. Ordinary SceneryStack apps do not need them — add meshes to `stage.threeScene` directly. If you are deliberately building PhET-iO, see [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation).
