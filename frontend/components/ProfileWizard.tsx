"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, submitProfile } from "../lib/api";

// Example options. These must match career_data.py.
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
        <button
          key={o}
          type="button"
          onClick={() => onToggle(o)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            selected.includes(o)
              ? "border-[#1c1c1c] bg-[#1c1c1c] text-white"
              : "border-black/10 bg-white/60 hover:bg-white"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function ProfileWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Only logged-in users can use the wizard
  useEffect(() => {
    if (!getToken()) router.push("/login");
  }, [router]);

  function validate(): string {
    if (step === 0 && !education) return "Please choose your education level.";
    if (step === 1 && skills.length === 0) return "Pick at least one skill.";
    if (step === 2 && interests.length === 0) return "Pick at least one interest.";
    if (step === 3 && goals.length > 500) return "Goals must be 500 characters or fewer.";
    return "";
  }

  async function next() {
    const msg = validate();
    setError(msg);
    if (msg) return;
    if (step < 3) return setStep(step + 1);

    setLoading(true);
    try {
      await submitProfile({ education_level: education, skills, interests, goals });
      router.push("/results");
    } catch (err) {
      const m = (err as Error).message;
      if (m === "NOT_LOGGED_IN") return router.push("/login");
      setError(err instanceof TypeError ? "Cannot reach the server. Is the backend running?" : m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Build your profile</h1>

      <div className="flex flex-wrap gap-2">
        {STEP_TITLES.map((t, i) => (
          <span
            key={t}
            className={`rounded-full px-5 py-2 text-sm ${
              i === step
                ? "bg-[#1c1c1c] text-white"
                : i < step
                ? "bg-[#ffd95a]"
                : "hatch border border-black/10"
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="glass space-y-5 rounded-3xl p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-light">What is your education level?</h2>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white/70 px-5 py-3 outline-none"
            >
              <option value="">Select...</option>
              {EDUCATION.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-light">Which skills do you have?</h2>
            <Chips options={SKILLS} selected={skills} onToggle={(o) => setSkills(toggle(skills, o))} />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-light">What are you interested in?</h2>
            <Chips options={INTERESTS} selected={interests} onToggle={(o) => setInterests(toggle(interests, o))} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-light">Any career goals? (optional)</h2>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={4}
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-3 outline-none"
              placeholder="For example: I want to work remotely in tech..."
            />
            <p className="text-xs text-[#6b6b6b]">{goals.length}/500</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            disabled={step === 0 || loading}
            onClick={() => { setError(""); setStep(step - 1); }}
            className="rounded-full border border-black/30 px-6 py-3 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={loading}
            className="rounded-full bg-[#1c1c1c] px-8 py-3 text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? "Finding your matches..." : step === 3 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}