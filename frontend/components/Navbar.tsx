"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/api";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "My profile" },
  { href: "/results", label: "Results" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const update = () => setLoggedIn(!!getToken());
    update();
    window.addEventListener("auth-change", update);
    return () => window.removeEventListener("auth-change", update);
  }, []);

  function logout() {
    clearToken();
    router.push("/");
  }

  const tab = (href: string) =>
    `rounded-full px-4 py-2 text-sm transition ${
      pathname === href ? "bg-[#1c1c1c] text-white" : "text-[#1c1c1c] hover:bg-white/70"
    }`;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href="/"
        className="rounded-full border border-black/30 bg-white/40 px-6 py-2 text-2xl font-light tracking-tight"
      >
        careercompas
      </Link>

      <nav className="glass flex items-center gap-1 rounded-full p-1.5">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={tab(l.href)}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {loggedIn ? (
          <button
            onClick={logout}
            className="glass rounded-full px-5 py-2 text-sm hover:bg-white/80"
          >
            Log out
          </button>
        ) : (
          <>
            <Link href="/login" className="glass rounded-full px-5 py-2 text-sm hover:bg-white/80">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#1c1c1c] px-5 py-2 text-sm text-white hover:bg-black"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}