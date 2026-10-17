import React from "react";

export default function NumInput({ value, onChange, type = "number" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`${type === "text" ? "w-20" : "w-12"} mx-1 px-1 rounded-full text-black text-center`}
    />
  );
}
