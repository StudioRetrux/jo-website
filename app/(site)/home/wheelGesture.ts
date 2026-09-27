const GESTURE_GAP_MS = 150;
const WHEEL_TRAVEL_PX = 24;

export type WheelGesture = { lastAt: number; travel: number; armed: boolean };

export function wheelDirection(gesture: WheelGesture, event: Pick<WheelEvent, "timeStamp" | "deltaX" | "deltaY" | "deltaMode">): "down" | "up" | null {
  if (event.timeStamp - gesture.lastAt > GESTURE_GAP_MS) {
    gesture.armed = true;
    gesture.travel = 0;
  }
  gesture.lastAt = event.timeStamp;
  if (!gesture.armed) return null;

  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  gesture.travel += delta * (event.deltaMode === 0 ? 1 : WHEEL_TRAVEL_PX);
  if (Math.abs(gesture.travel) < WHEEL_TRAVEL_PX) return null;
  gesture.armed = false;
  return gesture.travel > 0 ? "down" : "up";
}
