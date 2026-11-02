import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
      <Link href="/" className="text-xl font-bold">careercompas</Link>
      <div className="flex gap-4">
        <Link href="/login" className="hover:underline">Log in</Link>
        <Link href="/register" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500">
          Sign up
        </Link>
      </div>
    </nav>
  );
}