// Placeholder data for building the UI. It will be replaced by real API results in Phase 3.
export type Career = { title: string; match: number; reason: string };
export type RoadmapStep = { id: number; title: string };

export const SAMPLE_CAREERS: Career[] = [
  { title: "Data Analyst", match: 87, reason: "Your Python, SQL, and data analysis skills line up well with this role." },
  { title: "Software Developer", match: 79, reason: "Your programming skills and interest in technology are a strong base." },
  { title: "Product Manager", match: 64, reason: "Communication and project management skills are valuable here." },
];

export const SAMPLE_ROADMAP: RoadmapStep[] = [
  { id: 1, title: "Finish a beginner SQL course" },
  { id: 2, title: "Build a small data-analysis project with Python" },
  { id: 3, title: "Learn a charting tool (for example, Power BI or Tableau)" },
  { id: 4, title: "Publish your project on GitHub" },
  { id: 5, title: "Apply for 3 internships or entry-level roles" },
];