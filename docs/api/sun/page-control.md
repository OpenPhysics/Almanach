---
title: PageControl
description: An iOS-style row of dots indicating the current page, typically paired with Carousel.
category: api
library: sun
tags: [sun, PageControl, Carousel]
status: complete
related:
  - /api/sun/carousel
  - /api/sun/carousel-combo-box
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PageControl

`PageControl` (from `scenerystack/sun`) renders the classic iOS "row of dots" pagination indicator: one dot per page, with the current page's dot drawn distinctly. It's driven by two Properties rather than owning any paging state itself, which is exactly the shape [`Carousel`](/api/sun/carousel) exposes — `pageNumberProperty` and `numberOfPagesProperty` — so the two are typically constructed together, with `PageControl` reflecting (and, if `interactive`, controlling) which page of the carousel is showing.

```ts
import { Carousel, PageControl, type CarouselItem } from 'scenerystack/sun';
import { Rectangle, VBox } from 'scenerystack/scenery';

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5', '#D5B15B' ];

const items: CarouselItem[] = COLORS.map( color => ( {
  createNode: () => new Rectangle( 0, 0, 50, 50, { fill: color, cornerRadius: 8 } )
} ) );

const carousel = new Carousel( items, {
  orientation: 'horizontal',
  itemsPerPage: 2,
  margin: 8
} );

const pageControl = new PageControl(
  carousel.pageNumberProperty,
  carousel.numberOfPagesProperty,
  {
    interactive: true,
    orientation: 'horizontal'
  }
);

const panel = new VBox( {
  spacing: 10,
  align: 'center',
  children: [ carousel, pageControl ]
} );
```

`pageNumberProperty` must be a settable `TProperty<number>` (not just readable) precisely because `PageControl` writes to it when `interactive: true` and a dot is clicked — `Carousel.pageNumberProperty` satisfies this directly.

<SceneryDemo demo="page-control" />

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `interactive` | `false` | Whether clicking a dot navigates to that page |
| `orientation` | `'horizontal'` | `'horizontal'` (dots left-to-right) or `'vertical'` (top-to-bottom); match your carousel's `orientation` |
| `dotRadius` | `3` | Radius of each dot |
| `dotSpacing` | `10` | Space between adjacent dots |
| `lineWidth` | `1` | Stroke width, if `currentPageStroke`/`pageStroke` are set |
| `dotTouchAreaDilation` / `dotMouseAreaDilation` | `4` / `4` | Pointer-area dilation beyond each dot's radius, when `interactive` |
| `currentPageFill` / `currentPageStroke` | `'black'` / `null` | Appearance of the dot for the current page |
| `pageFill` / `pageStroke` | `'rgb( 200, 200, 200 )'` / `null` | Appearance of every other dot |

::: tip Dots are recreated whenever the page count changes
`PageControl` rebuilds its dots from scratch every time `numberOfPagesProperty` fires — including at construction — so it stays correct if a `Carousel`'s visible item count changes at runtime (e.g. via `Carousel.setItemVisible`), without any extra wiring on your part.
:::
