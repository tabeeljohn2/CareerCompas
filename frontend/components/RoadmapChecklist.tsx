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
    <div>
      <p className="text-sm text-gray-400">{percent}% complete</p>
      <div className="mt-1 h-2 rounded bg-gray-700">
        <div className="h-2 rounded bg-green-600" style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.id}>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={i.is_done} onChange={() => toggle(i)} />
              <span className={i.is_done ? "text-gray-500 line-through" : ""}>{i.title}</span>
            </label>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}