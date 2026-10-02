import assert from "node:assert/strict";
import test from "node:test";
import { PARALLAX_TRAVEL, parallaxOffset } from "./parallax.ts";

test("images enter above centre, centre in the viewport, and exit below centre", () => {
  const height = 500;
  assert.equal(parallaxOffset(800, height, 0, 800), -100);
  assert.equal(parallaxOffset(150, height, 0, 800), 0);
  assert.equal(parallaxOffset(-500, height, 0, 800), 100);
  // A nested scroll viewport has the same movement, independent of its screen position.
  assert.equal(parallaxOffset(1100, height, 300, 800), -100);
  assert.equal(parallaxOffset(450, height, 300, 800), 0);
  assert.equal(parallaxOffset(-200, height, 300, 800), 100);
});

test("scroll reversal and jumps return to the same image position", () => {
  const positions = [900, 700, 400, 100, -200, -600];
  const forward = positions.map((top) => parallaxOffset(top, 400, 0, 800));
  assert.ok(forward.every((offset, i) => i === 0 || offset >= forward[i - 1]));
  const reverse = [...positions].reverse().map((top) => parallaxOffset(top, 400, 0, 800));
  assert.deepEqual(reverse.reverse(), forward);
  assert.equal(parallaxOffset(100, 400, 0, 800), forward[3]);
});

test("overscan covers both frame edges across sizes, resizes, and out-of-view positions", () => {
  for (const height of [100, 400, 800, 1600]) {
    for (const viewportHeight of [300, 800, 1200]) {
      for (const top of [-10000, -height, 0, 100, viewportHeight, 10000]) {
        const offset = parallaxOffset(top, height, 0, viewportHeight);
        const overscan = height * PARALLAX_TRAVEL;
        assert.ok(-overscan + offset <= 0);
        assert.ok(height + overscan + offset >= height);
      }
    }
  }
  assert.equal(parallaxOffset(0, 0, 0, 800), 0);
  assert.equal(parallaxOffset(0, 400, 0, 0), 0);
});
