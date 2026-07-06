import type { Node } from 'scenerystack/scenery';

export type DemoDispose = () => void;

export type DemoFactory = ( rootNode: Node ) => DemoDispose;

export type DemoModule = {
  createDemo: DemoFactory;
  width?: number;
  height?: number;
};

export type DemoId =
  | 'rectangular-push-button'
  | 'hslider'
  | 'checkbox'
  | 'reset-all-button'
  | 'number-control';
