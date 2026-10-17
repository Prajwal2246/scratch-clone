let nextId = 1;
export const newId = () => `b${nextId++}`;

export function removeBlock(blocks, id) {
  let removed = null;
  const rest = [];
  for (const b of blocks) {
    if (b.id === id) {
      removed = b;
    } else if (b.children) {
      const [children, r] = removeBlock(b.children, id);
      if (r) removed = r;
      rest.push({ ...b, children });
    } else {
      rest.push(b);
    }
  }
  return [rest, removed];
}

export function insertBlock(blocks, targetId, where, block) {
  const out = [];
  for (const b of blocks) {
    let copy = b.children ? { ...b, children: insertBlock(b.children, targetId, where, block) } : b;
    if (b.id === targetId && where === "inside") copy = { ...copy, children: [block, ...copy.children] };
    out.push(copy);
    if (b.id === targetId && where === "after") out.push(block);
  }
  return out;
}

export function updateBlock(blocks, id, changes) {
  return blocks.map((b) => {
    if (b.id === id) return { ...b, ...changes };
    if (b.children) return { ...b, children: updateBlock(b.children, id, changes) };
    return b;
  });
}

export function containsId(block, id) {
  return block.id === id || (block.children || []).some((c) => containsId(c, id));
}
