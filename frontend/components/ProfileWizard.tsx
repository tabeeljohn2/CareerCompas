"use client";
import { useState } from "react";

// Example options. In Phase 4 these must match the features your model is trained on.
const EDUCATION = ["High school", "Bachelor's (in progress)", "Bachelor's", "Master's", "Other"];
const SKILLS = ["Python", "JavaScript", "SQL", "Excel", "Communication", "Design",
  "Data analysis", "Machine learning", "Writing", "Project management"];
const INTERESTS = ["Technology", "Healthcare", "Business", "Education",
  "Art & design", "Finance", "Science", "Media"];

const STEP_TITLES = ["Education", "Skills", "Interests", "Goals"];

function toggle(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function Chips({ options, selected, onToggle }: {
  options: string[]; selected: string[]; onToggle: (o: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onToggle(o)}
          className={`rounded-full border px-3 py-1 text-sm ${
            selected.includes(o) ? "border-blue-500 bg-blue-600 text-white" : "border-gray-600"
          }`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function ProfileWizard() {
  const [step, setStep] = useState(0);
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function validate(): string {
    if (step === 0 && !education) return "Please choose your education level.";
    if (step === 1 && skills.length === 0) return "Pick at least one skill.";
    if (step === 2 && interests.length === 0) return "Pick at least one interest.";
    if (step === 3 && goals.length > 500) return "Goals must be 500 characters or fewer.";
    return "";
  }

  function next() {
    const msg = validate();
    setError(msg);
    if (msg) return;
    if (step < 3) return setStep(step + 1);
    const profile = { education_level: education, skills, interests, goals };
    console.log("Will send to the backend in Phase 3:", profile);
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto mt-12 max-w-lg px-4">
        <h1 className="text-2xl font-bold">Profile saved (locally)</h1>
        <p className="mt-2 text-gray-400">
          In Phase 3 this will be sent to the backend to get your career recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-lg space-y-6 px-4">
      <p className="text-sm text-gray-400">
        Step {step + 1} of 4: {STEP_TITLES[step]}
      </p>
      <div className="h-2 rounded bg-gray-700">
        <div className="h-2 rounded bg-blue-600" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>

      {step === 0 && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">What is your education level?</h1>
          <select value={education} onChange={(e) => setEducation(e.target.value)}
            className="w-full rounded border border-gray-600 bg-transparent px-3 py-2">
            <option value="" className="text-black">Select...</option>
            {EDUCATION.map((o) => <option key={o} value={o} className="text-black">{o}</option>)}
          </select>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Which skills do you have?</h1>
          <Chips options={SKILLS} selected={skills} onToggle={(o) => setSkills(toggle(skills, o))} />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">What are you interested in?</h1>
          <Chips options={INTERESTS} selected={interests} onToggle={(o) => setInterests(toggle(interests, o))} />
        </div>
      )}
      {step === 3 && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Any career goals? (optional)</h1>
          <textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={4}
            className="w-full rounded border border-gray-600 bg-transparent px-3 py-2"
            placeholder="For example: I want to work remotely in tech..." />
          <p className="text-xs text-gray-500">{goals.length}/500</p>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex justify-between">
        <button type="button" disabled={step === 0}
          onClick={() => { setError(""); setStep(step - 1); }}
          className="rounded border border-gray-600 px-4 py-2 disabled:opacity-40">
          Back
        </button>
        <button type="button" onClick={next}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
          {step === 3 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}