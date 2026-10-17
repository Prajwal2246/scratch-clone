import assert from "node:assert/strict";
import { newRunner, tick, isDone } from "./runner.js";

let s = [{ id: "a", x: 0, y: 0, dir: 90, script: [] }];
let w = { sprites: s, runners: { a: newRunner([{ type: "say", text: "hi", secs: 1 }]) }, touching: [] };
w = tick(w.sprites, w.runners, w.touching, 0);
assert.equal(w.sprites[0].bubble.text, "hi");
w = tick(w.sprites, w.runners, w.touching, 500);
assert.equal(w.sprites[0].bubble.text, "hi");
w = tick(w.sprites, w.runners, w.touching, 1000);
assert.equal(w.sprites[0].bubble, null);
assert.ok(isDone(w.runners.a));

const walk = (steps) => [{ type: "repeat", times: 30, children: [{ type: "move", steps }] }];
s = [
  { id: "a", x: -150, y: 0, dir: 90, script: walk(10) },
  { id: "b", x: 150, y: 0, dir: 90, script: walk(-10) },
];
w = { sprites: s, runners: { a: newRunner(s[0].script), b: newRunner(s[1].script) }, touching: [] };
let swaps = 0;
for (let t = 0; t < 30; t++) {
  const before = w.sprites[0].script;
  w = tick(w.sprites, w.runners, w.touching, t);
  if (w.sprites[0].script !== before) swaps++;
}
assert.equal(swaps, 1);
assert.ok(w.sprites[0].x < -100 && w.sprites[1].x > 100, "walked apart");

console.log("runner ok");
