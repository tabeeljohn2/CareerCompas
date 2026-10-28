"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/health`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status))
      .catch(() => setStatus("backend not reachable"));
  }, []);

  return <main className="p-8">careercompas backend status: {status}</main>;
}