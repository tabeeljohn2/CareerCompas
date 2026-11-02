"use client";
import { useState } from "react";
import type { RoadmapStep } from "../lib/sampleData";

export default function RoadmapChecklist({ steps }: { steps: RoadmapStep[] }) {
  const [doneIds, setDoneIds] = useState<number[]>([]);

  function toggle(id: number) {
    setDoneIds(doneIds.includes(id) ? doneIds.filter((x) => x !== id) : [...doneIds, id]);
  }

  const percent = Math.round((doneIds.length / steps.length) * 100);

  return (
    <div>
      <p className="text-sm text-gray-400">{percent}% complete</p>
      <div className="mt-1 h-2 rounded bg-gray-700">
        <div className="h-2 rounded bg-green-600" style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((s) => (
          <li key={s.id}>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={doneIds.includes(s.id)} onChange={() => toggle(s.id)} />
              <span className={doneIds.includes(s.id) ? "text-gray-500 line-through" : ""}>{s.title}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}