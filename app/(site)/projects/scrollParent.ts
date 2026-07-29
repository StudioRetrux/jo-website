/**
 * Nearest ancestor that actually scrolls, or null for the document.
 *
 * The overlay scrolls itself (`position: fixed` + `overflow-y: auto`) while the
 * /projects/[slug] route scrolls the document, so anything observing scroll on this
 * page has to ask rather than assume the viewport.
 */
export function scrollParent(node: HTMLElement | null | undefined) {
  for (let el = node?.parentElement; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === "auto" || overflowY === "scroll") return el;
  }
  return null;
}
