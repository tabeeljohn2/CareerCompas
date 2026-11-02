"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "../lib/api";

export default function Navbar() {
  const router = useRouter();
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

  return (
    <nav className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
      <Link href="/" className="text-xl font-bold">careercompas</Link>
      <div className="flex items-center gap-4">
        <Link href="/profile" className="hover:underline">My profile</Link>
        {loggedIn ? (
          <button onClick={logout} className="rounded border border-gray-600 px-3 py-1 hover:bg-gray-800">
            Log out
          </button>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Log in</Link>
            <Link href="/register" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}