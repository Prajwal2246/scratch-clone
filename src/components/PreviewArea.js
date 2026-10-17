import React from "react";
import CatSprite from "./CatSprite";

const Stage_W = 480;
const Stage_H = 360;

function Bubble({ bubble, left, top }) {
  const shape = bubble.kind === "think" ? "rounded-full italic" : "rounded-lg";
  return (
    <div
      className={`absolute bg-white border-2 border-gray-400 px-3 py-1 text-sm whitespace-nowrap ${shape}`}
      style={{ left, top: top - 55, transform: "translateX(-10%)" }}
    >
      {bubble.kind === "think" ? `💭 ${bubble.text}` : bubble.text}
    </div>
  );
}

export default function PreviewArea({ sprites, selectedId, onSelect, onAdd, onDelete }) {
  return (
    <div className="p-2">
      <div className="relative bg-white border border-gray-200 overflow-hidden" style={{ width: Stage_W, height: Stage_H }}>
        {sprites.map((cat) => {
          const left = Stage_W / 2 + cat.x;
          const top = Stage_H / 2 - cat.y;
          return (
            <React.Fragment key={cat.id}>
              <div
                className="absolute cursor-pointer"
                onClick={() => onSelect(cat.id)}
                style={{
                  left,
                  top,
                  transform: `translate(-50%, -50%) rotate(${cat.dir - 90}deg)`,
                  filter: `hue-rotate(${cat.hue}deg)`,
                }}
              >
                <CatSprite />
              </div>
              {cat.bubble && <Bubble bubble={cat.bubble} left={left} top={top} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-row flex-wrap items-center gap-2 mt-3">
        {sprites.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-3 py-1 rounded text-sm border ${cat.id === selectedId ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {cat.name}
          </button>
        ))}
        <button onClick={onAdd} className="px-3 py-1 rounded text-sm bg-green-500 text-white">
          {"+ Add sprite"}
        </button>
        <button
          onClick={onDelete}
          disabled={sprites.length === 1}
          className={`px-3 py-1 rounded text-sm bg-red-500 text-white ${sprites.length === 1 ? "opacity-50" : ""}`}
        >
          {"Delete"}
        </button>
      </div>
    </div>
  );
}
