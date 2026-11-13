import type { Career } from "../lib/api";

export default function CareerCard({
  career,
  rank,
  highlight = false,
}: {
  career: Career;
  rank: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl p-6 ${
        highlight ? "bg-[#ffd95a] shadow-[0_10px_30px_rgba(255,217,90,0.4)]" : "glass"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1c1c1c] text-sm text-white">
            {rank}
          </span>
          <div>
            <h2 className="text-2xl font-light">{career.title}</h2>
            {highlight && <p className="text-xs uppercase tracking-wide text-black/60">Best match</p>}
          </div>
        </div>
        <span className="text-5xl font-light leading-none">{career.match}%</span>
      </div>

      <div className="hatch mt-5 h-3 overflow-hidden rounded-full border border-black/10">
        <div className="h-full rounded-full bg-[#1c1c1c]" style={{ width: `${career.match}%` }} />
      </div>

      <p className="mt-4 text-sm text-black/70">{career.reason}</p>

      {career.missing_skills && career.missing_skills.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-black/60">To learn:</span>
          {career.missing_skills.map((s) => (
            <span key={s} className="rounded-full bg-white/70 px-3 py-1 text-xs">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}