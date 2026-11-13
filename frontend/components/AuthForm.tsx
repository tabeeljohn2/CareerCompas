"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRequest, setToken } from "../lib/api";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setError("");
    setLoading(true);
    try {
      const token = await authRequest(mode, email, password);
      setToken(token);
      router.push("/profile");
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot reach the server. Is the backend running?"
          : (err as Error).message
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-full border border-black/10 bg-white/70 px-5 py-3 outline-none placeholder:text-[#8a8a8a] focus:border-black/40";

  return (
    <form
      onSubmit={handleSubmit}
      className="glass mx-auto mt-6 max-w-sm space-y-4 rounded-3xl p-8"
    >
      <h1 className="text-3xl font-light">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <input
        className={inputClass}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={inputClass}
        type="password"
        placeholder="Password (8+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#1c1c1c] py-3 text-white hover:bg-black disabled:opacity-50"
      >
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
      </button>
    </form>
  );
}