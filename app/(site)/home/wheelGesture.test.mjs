import assert from "node:assert/strict";
import test from "node:test";
import { wheelDirection } from "./wheelGesture.ts";

test("trackpad travel advances once per gesture; mouse wheel stays immediate", () => {
  const gesture = { lastAt: -Infinity, travel: 0, armed: true };
  const event = (timeStamp, deltaY, deltaMode = 0) => ({ timeStamp, deltaX: 0, deltaY, deltaMode });

  assert.equal(wheelDirection(gesture, event(0, 6)), null);
  assert.equal(wheelDirection(gesture, event(16, 6)), null);
  assert.equal(wheelDirection(gesture, event(32, 12)), "down");
  assert.equal(wheelDirection(gesture, event(48, 80)), null);
  assert.equal(wheelDirection(gesture, event(240, -3, 1)), "up");
});
