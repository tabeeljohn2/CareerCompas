import Link from "next/link";

// These numbers match career_data.py. Update them if you change those lists.
const STATS = [
  { value: "8", label: "Careers" },
  { value: "10", label: "Skills" },
  { value: "8", label: "Interests" },
];

export default function Home() {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-5xl font-light tracking-tight sm:text-6xl">
          Find the career path
          <br />
          that fits you
        </h1>
        <p className="mt-4 max-w-xl text-[#5f5f5f]">
          Tell us your skills and interests. Get personalised career suggestions
          and a step-by-step learning roadmap.
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#1c1c1c] px-6 py-3 text-sm text-white">Skills</span>
          <span className="rounded-full bg-[#ffd95a] px-6 py-3 text-sm">Interests</span>
          <span className="hatch rounded-full border border-black/10 px-10 py-3 text-sm">Roadmap</span>
          <span className="rounded-full border border-black/30 px-6 py-3 text-sm">Progress</span>
        </div>
        <div className="flex gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-right">
              <div className="text-6xl font-light leading-none">{s.value}</div>
              <div className="mt-1 text-sm text-[#6b6b6b]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-3xl p-6">
          <p className="text-sm text-[#6b6b6b]">Step 1</p>
          <h2 className="mt-2 text-2xl font-light">Share your profile</h2>
          <p className="mt-2 text-sm text-[#5f5f5f]">
            Pick your education, skills, and interests in four quick steps.
          </p>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-sm text-[#6b6b6b]">Step 2</p>
          <h2 className="mt-2 text-2xl font-light">Get matched</h2>
          <p className="mt-2 text-sm text-[#5f5f5f]">
            Our model ranks careers for you and an AI advisor explains why.
          </p>
        </div>
        <div className="rounded-3xl bg-[#1f1f1f] p-6 text-white">
          <p className="text-sm text-white/60">Step 3</p>
          <h2 className="mt-2 text-2xl font-light">Track your progress</h2>
          <p className="mt-2 text-sm text-white/70">
            Follow your roadmap and tick off each step as you finish it.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-full bg-[#1c1c1c] px-8 py-3 text-white hover:bg-black"
        >
          Get started
        </Link>
        <Link href="/login" className="glass rounded-full px-8 py-3 hover:bg-white/80">
          Log in
        </Link>
      </div>
    </main>
  );
}