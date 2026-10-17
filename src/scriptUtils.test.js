import assert from "node:assert/strict";
import { removeBlock, insertBlock, updateBlock, containsId } from "./scriptUtils.js";

const script = [
  { id: "a", type: "goTo" },
  { id: "r", type: "repeat", children: [{ id: "m", type: "move" }] },
];

const [rest, a] = removeBlock(script, "a");
const moved = insertBlock(rest, "r", "inside", a);
assert.deepEqual(moved[0].children.map((b) => b.id), ["a", "m"]);

const after = insertBlock(script, "m", "after", { id: "t" });
assert.deepEqual(after[1].children.map((b) => b.id), ["m", "t"]);

assert.equal(updateBlock(script, "m", { steps: "5" })[1].children[0].steps, "5");
assert.equal(script[1].children[0].steps, undefined);

assert.ok(containsId(script[1], "m"));

console.log("scriptUtils ok");
