"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CareerCard from "../../components/CareerCard";
import RoadmapChecklist from "../../components/RoadmapChecklist";
import { getLatest, type RecommendationResult } from "../../lib/api";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<RecommendationResult | null>(null);
  const [message, setMessage] = useState("Loading your results...");

  useEffect(() => {
    getLatest()
      .then(setData)
      .catch((err) => {
        const m = (err as Error).message;
        if (m === "NOT_LOGGED_IN") return router.push("/login");
        if (m === "NOT_FOUND") return setMessage("You have no results yet.");
        setMessage(
          err instanceof TypeError ? "Cannot reach the server. Is the backend running?" : m
        );
      });
  }, [router]);

  if (!data) {
    return (
      <main className="glass mx-auto max-w-md rounded-3xl p-8 text-center">
        <p>{message}</p>
        {message === "You have no results yet." && (
          <Link
            href="/profile"
            className="mt-4 inline-block rounded-full bg-[#1c1c1c] px-6 py-3 text-white"
          >
            Fill in your profile
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Your career matches</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          {data.careers.map((c, i) => (
            <CareerCard key={c.title} career={c} rank={i + 1} highlight={i === 0} />
          ))}

          {data.advice && (
            <div className="glass space-y-2 rounded-3xl p-6">
              <h2 className="text-2xl font-light">Why these matches?</h2>
              <p className="whitespace-pre-line text-sm text-black/70">{data.advice}</p>
              <p className="text-xs text-black/50">
                AI-generated guidance. Treat it as a starting point, not a guarantee.
              </p>
            </div>
          )}
        </section>

        <aside>
          <RoadmapChecklist key={data.recommendation_id} initialItems={data.roadmap} />
        </aside>
      </div>

      <Link
        href="/profile"
        className="glass inline-block rounded-full px-6 py-3 text-sm hover:bg-white/80"
      >
        Update my profile
      </Link>
    </main>
  );
}