const HIT = 70;

export function move(sprite, dist) {
  const radian = (sprite.dir * Math.PI) / 180;
  return {
    ...sprite,
    x: sprite.x + dist * Math.sin(radian),
    y: sprite.y + dist * Math.cos(radian),
  };
}

export function turn(sprite, degree) {
  return { ...sprite, dir: sprite.dir + degree };
}

export function goTo(sprite, x, y) {
  return { ...sprite, x, y };
}

export function flatten(blocks) {
  const actions = [];
  for (const block of blocks) {
    if (block.type === "repeat") {
      const inner = flatten(block.children);
      for (let i = 0; i < Number(block.times); i++) actions.push(...inner);
    } else {
      actions.push(block);
    }
  }
  return actions;
}

export function runAction(sprite, action) {
  if (action.type === "move") return move(sprite, Number(action.steps));
  if (action.type === "turnRight") return turn(sprite, Number(action.degrees));
  if (action.type === "turnLeft") return turn(sprite, -Number(action.degrees));
  if (action.type === "goTo") return goTo(sprite, Number(action.x), Number(action.y));
  return sprite;
}

export const newRunner = (script) => ({ actions: flatten(script), i: 0, waitUntil: 0 });

export const isDone = (r) => r.i >= r.actions.length && r.waitUntil === 0;

export function tick(sprites, runners, touching, now) {
  runners = { ...runners };

  sprites = sprites.map((sprite) => {
    let r = runners[sprite.id];
    if (!r || now < r.waitUntil) return sprite;
    if (r.waitUntil) {
      sprite = { ...sprite, bubble: null };
      r = { ...r, waitUntil: 0 };
    }
    if (r.i < r.actions.length) {
      const action = r.actions[r.i];
      r = { ...r, i: r.i + 1 };
      if (action.type === "say" || action.type === "think") {
        sprite = { ...sprite, bubble: { kind: action.type, text: action.text } };
        r.waitUntil = now + Number(action.secs) * 1000;
      } else {
        sprite = runAction(sprite, action);
      }
    }
    runners[sprite.id] = r;
    return sprite;
  });

  const nowTouching = [];
  for (let a = 0; a < sprites.length; a++) {
    for (let b = a + 1; b < sprites.length; b++) {
      const A = sprites[a];
      const B = sprites[b];
      if (Math.hypot(A.x - B.x, A.y - B.y) >= HIT) continue;
      const key = `${A.id}|${B.id}`;
      nowTouching.push(key);
      if (touching.includes(key)) continue;
      [runners[A.id], runners[B.id]] = [runners[B.id], runners[A.id]];
      sprites[a] = { ...A, script: B.script };
      sprites[b] = { ...B, script: A.script };
    }
  }

  return { sprites, runners, touching: nowTouching };
}
