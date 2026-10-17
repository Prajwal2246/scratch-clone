import React, { useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { newId, removeBlock, insertBlock, updateBlock, containsId } from "./scriptUtils";
import { move, turn, goTo, newRunner, tick, isDone } from "./runner";

const STEP_MS = 100;

function newSprite(n, x, script = []) {
  return { id: newId(), name: `Cat ${n}`, x, y: 0, dir: 90, hue: (n - 1) * 90, bubble: null, script };
}

function demoScript(x, steps) {
  return [
    { id: newId(), type: "goTo", x, y: 0 },
    { id: newId(), type: "say", text: "Hello!", secs: 1 },
    { id: newId(), type: "repeat", times: 30, children: [{ id: newId(), type: "move", steps }] },
  ];
}

export default function App() {
  const [sprites, setSprites] = useState(() => [
    newSprite(1, -150, demoScript(-150, 10)),
    newSprite(2, 150, demoScript(150, -10)),
  ]);
  const [selectedId, setSelectedId] = useState(sprites[0].id);
  const selected = sprites.find((s) => s.id === selectedId) || sprites[0];

  const spritesRef = useRef(sprites);
  spritesRef.current = sprites;

  function updateSprite(id, fn) {
    setSprites((old) => old.map((s) => (s.id === id ? fn(s) : s)));
  }
  const updateSelected = (fn) => updateSprite(selected.id, fn);
  const setScript = (fn) => updateSelected((s) => ({ ...s, script: fn(s.script) }));

  function handleDrop(payload, target) {
    setScript((old) => {
      let blocks = old;
      let block;
      if (payload.from === "script") {
        [blocks, block] = removeBlock(old, payload.id);
        if (!block || (target.id && containsId(block, target.id))) return old;
      } else {
        block = { ...payload.block, id: newId() };
        if (block.type === "repeat") block.children = [];
      }
      if (target.where === "end") return [...blocks, block];
      return insertBlock(blocks, target.id, target.where, block);
    });
  }

  function say(kind, text, secs) {
    const id = selected.id;
    updateSprite(id, (s) => ({ ...s, bubble: { kind, text } }));
    setTimeout(() => updateSprite(id, (s) => ({ ...s, bubble: null })), Number(secs) * 1000);
  }

  function addSprite() {
    const n = sprites.length + 1;
    const sprite = newSprite(n, 0);
    setSprites((old) => [...old, sprite]);
    setSelectedId(sprite.id);
  }

  function deleteSprite() {
    if (sprites.length === 1) return;
    setSprites((old) => old.filter((s) => s.id !== selected.id));
    setSelectedId(sprites.find((s) => s.id !== selected.id).id);
  }

  const timer = useRef(null);

  function play() {
    clearInterval(timer.current);
    let runners = Object.fromEntries(sprites.map((s) => [s.id, newRunner(s.script)]));
    let touching = [];
    timer.current = setInterval(() => {
      const next = tick(spritesRef.current, runners, touching, Date.now());
      runners = next.runners;
      touching = next.touching;
      spritesRef.current = next.sprites;
      setSprites(next.sprites);
      if (Object.values(runners).every(isDone)) clearInterval(timer.current);
    }, STEP_MS);
  }

  function stop() {
    clearInterval(timer.current);
    setSprites((old) => old.map((s) => ({ ...s, bubble: null })));
  }

  return (
    <div className="bg-blue-100 font-sans h-screen flex flex-col">
      <header className="flex-none flex items-center gap-2 bg-blue-600 text-white px-4 py-2 shadow">
        <span className="font-bold text-lg">{"Scratch Clone"}</span>
        <span className="text-sm text-blue-100">{"Drag blocks, press Play. Touching cats swap scripts."}</span>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-row pt-2">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            onMove={(steps) => updateSelected((s) => move(s, steps))}
            onTurn={(degree) => updateSelected((s) => turn(s, degree))}
            onGoTo={(x, y) => updateSelected((s) => goTo(s, x, y))}
            onSay={say}
            onDelete={(id) => setScript((old) => removeBlock(old, id)[0])}
          />
          <MidArea
            sprite={selected}
            onPlay={play}
            onStop={stop}
            onDrop={handleDrop}
            onChange={(id, changes) => setScript((old) => updateBlock(old, id, changes))}
          />
        </div>
        <div className="flex-none h-full overflow-auto flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
            sprites={sprites}
            selectedId={selected.id}
            onSelect={setSelectedId}
            onAdd={addSprite}
            onDelete={deleteSprite}
          />
        </div>
      </div>
    </div>
  );
}
