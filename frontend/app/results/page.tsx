import CareerCard from "../../components/CareerCard";
import RoadmapChecklist from "../../components/RoadmapChecklist";
import { SAMPLE_CAREERS, SAMPLE_ROADMAP } from "../../lib/sampleData";

export default function ResultsPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Your top career matches</h1>
        {SAMPLE_CAREERS.map((c) => <CareerCard key={c.title} career={c} />)}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Your learning roadmap</h2>
        <RoadmapChecklist steps={SAMPLE_ROADMAP} />
      </section>
    </main>
  );
}