// Travel and overscan are the same fraction of the frame height, so no edge is exposed.
export const PARALLAX_TRAVEL = 0.2;

export function parallaxOffset(frameTop: number, frameHeight: number, viewportTop: number, viewportHeight: number) {
  if (frameHeight <= 0 || viewportHeight <= 0) return 0;
  const progress = Math.max(0, Math.min(1,
    (viewportTop + viewportHeight - frameTop) / (viewportHeight + frameHeight),
  ));
  return (progress * 2 - 1) * frameHeight * PARALLAX_TRAVEL;
}
