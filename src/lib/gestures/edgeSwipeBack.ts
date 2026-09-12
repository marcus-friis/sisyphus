export function edgeSwipeBack(node: HTMLElement, onBack: () => void) {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  const EDGE_ZONE = 24; // px from left edge to start tracking
  const THRESHOLD = 80; // px of horizontal travel to trigger back
  const MAX_VERTICAL = 40; // cancel if the touch drifts too far vertically (likely a scroll)

  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    if (t.clientX <= EDGE_ZONE) {
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (!tracking) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = Math.abs(t.clientY - startY);

    if (dy > MAX_VERTICAL) {
      tracking = false;
      return;
    }
    if (dx > THRESHOLD) {
      tracking = false;
      onBack();
    }
  }

  function onTouchEnd() {
    tracking = false;
  }

  node.addEventListener("touchstart", onTouchStart, { passive: true });
  node.addEventListener("touchmove", onTouchMove, { passive: true });
  node.addEventListener("touchend", onTouchEnd, { passive: true });

  return {
    destroy() {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
    },
  };
}
