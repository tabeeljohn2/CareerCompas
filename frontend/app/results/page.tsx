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
          err instanceof TypeError
            ? "Cannot reach the server. Is the backend running?"
            : m
        );
      });
  }, [router]);

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p>{message}</p>
        {message === "You have no results yet." && (
          <Link href="/profile" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">
            Fill in your profile
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Your top career matches</h1>
        {data.careers.map((c) => <CareerCard key={c.title} career={c} />)}
      </section>
            {data.advice && (
        <section className="space-y-2 rounded-lg border border-gray-700 p-4">
          <h2 className="text-xl font-bold">Why these matches?</h2>
          <p className="whitespace-pre-line text-sm text-gray-300">{data.advice}</p>
          <p className="text-xs text-gray-500">AI-generated guidance. Treat it as a starting point, not a guarantee.</p>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Your learning roadmap</h2>
        <RoadmapChecklist key={data.recommendation_id} initialItems={data.roadmap} />
      </section>
      <Link href="/profile" className="inline-block text-sm text-blue-400 hover:underline">
        Update my profile
      </Link>
    </main>
  );
}