import React, { useState } from "react";
import Icon from "./Icon";
import NumInput from "./NumInput";

const blockClass = "flex flex-row flex-wrap items-center text-white px-2 py-1 my-2 text-sm cursor-pointer rounded";

function draggable(block) {
  return {
    draggable: true,
    onDragStart: (e) => e.dataTransfer.setData("text/plain", JSON.stringify({ from: "palette", block })),
  };
}

export default function Sidebar({ onMove, onTurn, onGoTo, onSay, onDelete }) {

  const [steps, setSteps] = useState(10);
  const [degrees, setDegrees] = useState(15);
  const [goX, setGoX] = useState(0);
  const [goY, setGoY] = useState(0);
  const [times, setTimes] = useState(10);
  const [sayText, setSayText] = useState("Hello!");
  const [saySecs, setSaySecs] = useState(2);
  const [thinkText, setThinkText] = useState("Hmm...");
  const [thinkSecs, setThinkSecs] = useState(2);

  return (
    <div
      className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const payload = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
        if (payload.from === "script") onDelete(payload.id);
      }}
    >
      <div className="font-bold"> {"Motion"} </div>

      <div className={`${blockClass} bg-blue-500`}
        {...draggable({ type: "move", steps })}
        onClick={() => onMove(Number(steps))}>
        {"Move"}
        <NumInput value={steps} onChange={setSteps} />
        {"steps"}
      </div>

      <div className={`${blockClass} bg-blue-500`}
        {...draggable({ type: "turnLeft", degrees })}
        onClick={() => onTurn(-Number(degrees))}>
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        <NumInput value={degrees} onChange={setDegrees} />
        {"degrees"}
      </div>

      <div className={`${blockClass} bg-blue-500`}
        {...draggable({ type: "turnRight", degrees })}
        onClick={() => onTurn(Number(degrees))}>
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        <NumInput value={degrees} onChange={setDegrees} />
        {"degrees"}
      </div>

      <div className={`${blockClass} bg-blue-500`}
        {...draggable({ type: "goTo", x: goX, y: goY })}
        onClick={() => onGoTo(Number(goX), Number(goY))}>
        {"Go to x:"}
        <NumInput value={goX} onChange={setGoX} />
        {"y:"}
        <NumInput value={goY} onChange={setGoY} />
      </div>

      <div className="font-bold mt-2"> {"Looks"} </div>

      <div className={`${blockClass} bg-purple-500`}
        {...draggable({ type: "say", text: sayText, secs: saySecs })}
        onClick={() => onSay("say", sayText, saySecs)}>
        {"Say"}
        <NumInput type="text" value={sayText} onChange={setSayText} />
        {"for"}
        <NumInput value={saySecs} onChange={setSaySecs} />
        {"seconds"}
      </div>

      <div className={`${blockClass} bg-purple-500`}
        {...draggable({ type: "think", text: thinkText, secs: thinkSecs })}
        onClick={() => onSay("think", thinkText, thinkSecs)}>
        {"Think"}
        <NumInput type="text" value={thinkText} onChange={setThinkText} />
        {"for"}
        <NumInput value={thinkSecs} onChange={setThinkSecs} />
        {"seconds"}
      </div>

      <div className="font-bold mt-2"> {"Control"} </div>

      <div className="my-2 cursor-pointer" {...draggable({ type: "repeat", times })}>
        <div className={`${blockClass} bg-yellow-500 my-0 rounded-b-none`}>
          {"Repeat"}
          <NumInput value={times} onChange={setTimes} />
        </div>
        <div className="w-4 h-5 bg-yellow-500" />
        <div className="h-3 w-24 bg-yellow-500 rounded-b" />
      </div>
    </div>
  );
}
