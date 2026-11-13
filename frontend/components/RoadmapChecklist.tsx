"use client";
import { useState } from "react";
import { setProgress, type RoadmapItem } from "../lib/api";

export default function RoadmapChecklist({ initialItems }: { initialItems: RoadmapItem[] }) {
  const [items, setItems] = useState<RoadmapItem[]>(initialItems);
  const [error, setError] = useState("");

  async function toggle(item: RoadmapItem) {
    const newValue = !item.is_done;
    setError("");
    setItems(items.map((i) => (i.id === item.id ? { ...i, is_done: newValue } : i)));
    try {
      await setProgress(item.id, newValue);
    } catch {
      setItems((current) =>
        current.map((i) => (i.id === item.id ? { ...i, is_done: item.is_done } : i))
      );
      setError("Could not save your progress. Please try again.");
    }
  }

  const doneCount = items.filter((i) => i.is_done).length;
  const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="rounded-3xl bg-[#1f1f1f] p-6 text-white shadow-xl">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-light">Learning roadmap</h2>
        <span className="text-4xl font-light leading-none">
          {doneCount}/{items.length}
        </span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white/15">
        <div
          className="h-2 rounded-full bg-[#ffd95a] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-white/60">{percent}% complete</p>

      <ul className="mt-5 space-y-2">
        {items.map((i, idx) => (
          <li key={i.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={i.is_done}
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-white/5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-sm">
                {idx + 1}
              </span>
              <span className={`flex-1 text-sm ${i.is_done ? "text-white/40 line-through" : ""}`}>
                {i.title}
              </span>
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${
                  i.is_done ? "bg-[#ffd95a] text-black" : "bg-white/15"
                }`}
              >
                {i.is_done ? "✓" : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}