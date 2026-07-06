import type { DemoId, DemoModule } from './types.js';

type DemoLoader = () => Promise<DemoModule>;

export const DEMO_REGISTRY: Record<DemoId, DemoLoader> = {
  'rectangular-push-button': () => import( './rectangular-push-button.js' ),
  'hslider': () => import( './hslider.js' ),
  'checkbox': () => import( './checkbox.js' ),
  'reset-all-button': () => import( './reset-all-button.js' ),
  'number-control': () => import( './number-control.js' )
};

export const DEMO_IDS = Object.keys( DEMO_REGISTRY ) as DemoId[];

export async function loadDemo( id: DemoId ): Promise<DemoModule> {
  const loader = DEMO_REGISTRY[ id ];
  if ( !loader ) {
    throw new Error( `Unknown Scenery demo: ${id}` );
  }

  const module = await loader();
  return {
    createDemo: module.createDemo,
    width: module.width ?? 400,
    height: module.height ?? 120
  };
}
