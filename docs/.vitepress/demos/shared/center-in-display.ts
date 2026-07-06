import type { Node } from 'scenerystack/scenery';

/**
 * Centers `content` in a fixed-size demo canvas (Display width/height).
 */
export function centerInDisplay( content: Node, width: number, height: number ): () => void {
  const relayout = (): void => {
    content.centerX = width / 2;
    content.centerY = height / 2;
  };

  content.boundsProperty.link( relayout );
  relayout();

  return () => {
    content.boundsProperty.unlink( relayout );
  };
}
