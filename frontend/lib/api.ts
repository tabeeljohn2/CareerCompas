const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_KEY = "careercompas_token";

export function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth-change")); // tells the navbar to update
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export async function authRequest(
  mode: "login" | "register",
  email: string,
  password: string
): Promise<string> {
  const res = await fetch(`${API}/api/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Something went wrong. Please try again."
    );
  }
  return data.access_token as string;
}

export type Career = { title: string; match: number; reason: string; missing_skills?: string[] };
export type RoadmapItem = { id: number; title: string; is_done: boolean };
export type RecommendationResult = {
  recommendation_id: number;
  careers: Career[];
  advice: string | null;
  roadmap: RoadmapItem[];
};
export type ProfileInput = {
  education_level: string;
  skills: string[];
  interests: string[];
  goals: string;
};

async function authedRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new Error("NOT_LOGGED_IN");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401 || res.status === 403) {
    clearToken();
    throw new Error("NOT_LOGGED_IN");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error("Something went wrong. Please try again.");
  }
  return data;
}

export function submitProfile(profile: ProfileInput): Promise<RecommendationResult> {
  return authedRequest("/api/recommend", { method: "POST", body: JSON.stringify(profile) });
}

export function getLatest(): Promise<RecommendationResult> {
  return authedRequest("/api/recommendations/latest");
}

export function setProgress(itemId: number, isDone: boolean) {
  return authedRequest(`/api/progress/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ is_done: isDone }),
  });
}