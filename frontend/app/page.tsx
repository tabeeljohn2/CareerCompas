import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold">Find the career path that fits you</h1>
      <p className="mt-4 text-gray-400">
        Tell us your skills and interests. Get personalised career suggestions
        and a step-by-step learning roadmap.
      </p>
      <Link href="/register"
        className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-500">
        Get started
      </Link>
    </main>
  );
}