import type { Career } from "../lib/api";

export default function CareerCard({ career }: { career: Career }) {
  return (
    <div className="rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{career.title}</h2>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
          {career.match}% match
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-400">{career.reason}</p>
    </div>
  );
}