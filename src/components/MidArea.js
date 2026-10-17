import React, { useState } from "react";
import Icon from "./Icon";
import NumInput from "./NumInput";

const blockClass = "flex flex-row items-center text-white px-2 py-1 my-1 text-sm w-max rounded cursor-move";
const highlight = "ring-4 ring-gray-400";

function BlockContent({ block, onChange }) {
  const num = (field) => <NumInput value={block[field]} onChange={(v) => onChange(block.id, { [field]: v })} />;
  if (block.type === "move") return <>{"Move"}{num("steps")}{"steps"}</>;
  if (block.type === "turnLeft")
    return <>{"Turn"}<Icon name="undo" size={15} className="text-white mx-1" />{num("degrees")}{"degrees"}</>;
  if (block.type === "turnRight")
    return <>{"Turn"}<Icon name="redo" size={15} className="text-white mx-1" />{num("degrees")}{"degrees"}</>;
  if (block.type === "goTo") return <>{"Go to x:"}{num("x")}{"y:"}{num("y")}</>;
  if (block.type === "repeat") return <>{"Repeat"}{num("times")}</>;
  if (block.type === "say" || block.type === "think")
    return (
      <>
        {block.type === "say" ? "Say" : "Think"}
        <NumInput type="text" value={block.text} onChange={(v) => onChange(block.id, { text: v })} />
        {"for"}{num("secs")}{"seconds"}
      </>
    );
  return block.type;
}

function dropTarget(block, where, ctx) {
  const key = `${block.id}-${where}`;
  return {
    onDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ctx.over !== key) ctx.setOver(key);
    },
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      ctx.setOver(null);
      ctx.onDrop(JSON.parse(e.dataTransfer.getData("text/plain")), { where, id: block.id });
    },
  };
}

function BlockList({ blocks, ctx }) {
  return blocks.map((block) => {
    const lit = (where) => (ctx.over === `${block.id}-${where}` ? highlight : "");
    const dragProps = {
      draggable: true,
      onDragStart: (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", JSON.stringify({ from: "script", id: block.id }));
      },
    };

    if (block.type !== "repeat")
      return (
        <div key={block.id} {...dragProps} {...dropTarget(block, "after", ctx)} className={`${blockClass} ${block.type === "say" || block.type === "think" ? "bg-purple-500" : "bg-blue-500"} ${lit("after")}`}>
          <BlockContent block={block} onChange={ctx.onChange} />
        </div>
      );

    return (
      <div key={block.id} {...dragProps} className="my-1 w-max cursor-move">
        <div {...dropTarget(block, "inside", ctx)} className={`${blockClass} bg-yellow-500 my-0 rounded-b-none ${lit("inside")}`}>
          <BlockContent block={block} onChange={ctx.onChange} />
        </div>
        <div className="flex">
          <div className="w-4 bg-yellow-500" />
          <div {...dropTarget(block, "inside", ctx)} className="pl-1 py-1" style={{ minHeight: 24, minWidth: 80 }}>
            <BlockList blocks={block.children} ctx={ctx} />
          </div>
        </div>
        <div {...dropTarget(block, "after", ctx)} className={`h-3 w-24 bg-yellow-500 rounded-b ${lit("after")}`} />
      </div>
    );
  });
}

export default function MidArea({ sprite, onPlay, onStop, onDrop, onChange }) {
  const script = sprite.script;
  const [over, setOver] = useState(null);
  const ctx = { over, setOver, onDrop, onChange };

  return (
    <div
      className="flex-1 h-full overflow-auto p-4"
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(null);
        onDrop(JSON.parse(e.dataTransfer.getData("text/plain")), { where: "end" });
      }}
    >
      <div className="flex items-center gap-2 mb-4">
      <button
        onClick={onPlay}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
      >
        <Icon name="flag" size={15} className="text-white" />
        {"Play"}
      </button>
      <button onClick={onStop} className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded">
        {"Stop"}
      </button>
      <span className="text-sm text-gray-500">{`Script of ${sprite.name}`}</span>
    </div>
      {script.length === 0 && <div className="text-sm text-gray-400">{"Drag blocks here"}</div>}
      <BlockList blocks={script} ctx={ctx} />
    </div>
  );
}
